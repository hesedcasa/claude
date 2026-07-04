import {formatAsToon} from '@hesed/plugin-lib'
import {Args, Command, Flags, ux} from '@oclif/core'
import {default as path} from 'node:path'

import {ask, clearClients} from '../../../agent/agent-client.js'
import {loadAgentConfig} from '../../../agent/profile-config.js'
import {extractPlaceholders, readPrompts, renderPrompt, resolvePrompt} from '../../../prompts-config.js'
import {buildWorkspaceContext, type WorkspaceContext} from '../../../workspace-bash.js'
import {readWorkspace} from '../../../workspace-config.js'

export default class PromptRun extends Command {
  static override args = {
    name: Args.string({description: 'Prompt name', required: true}),
  }
  static override description = 'Execute a saved prompt through the Claude agent'
  static override examples = [
    '<%= config.bin %> <%= command.id %> summarize',
    '<%= config.bin %> <%= command.id %> classify --arg summary="Login fails" --arg description="TODO: fix client request"',
    '<%= config.bin %> <%= command.id %> summarize --profile work --workspace proj01',
    '<%= config.bin %> <%= command.id %> review --workspace proj01 --repo repo01',
    '<%= config.bin %> <%= command.id %> summarize --system "Override the saved system prompt"',
    '<%= config.bin %> <%= command.id %> classify --arg summary="..." --dry-run',
    '<%= config.bin %> <%= command.id %> summarize --debug',
  ]
  static override flags = {
    'allow-tools': Flags.string({
      description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
      required: false,
    }),
    arg: Flags.string({
      char: 'a',
      description: 'Template argument as name=value, substituting {{name}} in the prompt (repeatable)',
      multiple: true,
      required: false,
    }),
    debug: Flags.boolean({
      description: 'Include full agent metadata (model, tools, usage) in the output; default prints the result only',
    }),
    'dry-run': Flags.boolean({description: 'Print the resolved prompt and context without calling the agent'}),
    model: Flags.string({char: 'm', description: 'Model to use (e.g. claude-opus-4-7)', required: false}),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    repo: Flags.string({description: 'Filter workspace context to this repo name', required: false}),
    system: Flags.string({description: "Override the prompt's saved system prompt", required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
    workspace: Flags.string({
      char: 'w',
      description: 'Workspace name (uses current directory if omitted)',
      required: false,
    }),
  }

  // eslint-disable-next-line complexity
  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptRun)
    const prompts = await readPrompts(this.config)
    const [name, prompt] = resolvePrompt(prompts, args.name)

    const argValues: Record<string, string> = {}
    for (const pair of flags.arg ?? []) {
      const eq = pair.indexOf('=')
      if (eq <= 0) {
        this.error(`Invalid --arg '${pair}'. Expected name=value.`)
      }

      argValues[pair.slice(0, eq)] = pair.slice(eq + 1)
    }

    // --system overrides the saved system prompt; render both it and the body.
    const baseSystem = flags.system ?? prompt.system
    const body = renderPrompt(prompt.body, argValues)
    const renderedSystem = baseSystem === undefined ? undefined : renderPrompt(baseSystem, argValues)

    const missing = [
      ...new Set([...(baseSystem ? extractPlaceholders(baseSystem) : []), ...extractPlaceholders(prompt.body)]),
    ].filter((placeholder) => !Object.hasOwn(argValues, placeholder))
    if (missing.length > 0) {
      this.error(`Missing values for placeholder(s): ${missing.join(', ')}. Pass them with --arg name=value.`)
    }

    if (flags['dry-run']) {
      this.logJson({
        args: argValues,
        body,
        name,
        profile: flags.profile ?? 'default',
        repo: flags.repo,
        system: renderedSystem,
        workspace: flags.workspace,
      })
      return
    }

    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    let workspaceContext: undefined | WorkspaceContext
    const workspaceName = flags.workspace

    if (workspaceName) {
      const workspace = await readWorkspace(this.config.configDir, workspaceName)

      if (!workspace || Object.keys(workspace.repos).length === 0) {
        this.error(`Workspace '${workspaceName}' does not exist.`)
      }

      workspaceContext = await buildWorkspaceContext({
        cacheDir: path.join(this.config.dataDir, 'workspace-repos'),
        log: this.log.bind(this),
        mode: workspace.mode,
        repoFilter: flags.repo,
        repos: workspace.repos,
        workspaceLabel: workspaceName,
      })

      if (!workspaceContext) {
        this.error(
          `Workspace '${workspaceName}' could not be resolved${flags.repo ? ` for repo '${flags.repo}'` : ''}. Refusing to run against the current directory.`,
        )
      }
    }

    // Workspace context (when present) is appended to the rendered system prompt.
    const systemPrompt = [renderedSystem, workspaceContext?.systemPrompt].filter(Boolean).join('\n\n') || undefined

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const model = flags.model
      ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model)
      : config.models?.sonnet

    // Spinner only when stderr is a TTY, so piped output stays clean.
    const showSpinner = Boolean(process.stderr.isTTY)
    if (showSpinner) ux.action.start(`Running '${name}'`)

    let result
    try {
      result = await ask(config, body, {
        additionalDirectories: workspaceContext?.additionalDirectories,
        allowedTools,
        cwd: workspaceContext?.cwd ?? process.cwd(),
        model,
        sandboxExec: workspaceContext?.sandboxExec,
        sandboxFs: workspaceContext?.sandboxFs,
        systemPrompt,
      })
    } finally {
      if (showSpinner) ux.action.stop()
    }

    clearClients()

    // Default shows the agent's result only; --debug includes the surrounding metadata.
    // --toon formats whichever payload is selected.
    if (!result.success && !flags.debug) {
      this.error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error))
    }

    const data = result.data as undefined | {result?: unknown}
    const payload = flags.debug ? result : (data?.result ?? result.data ?? {})

    if (flags.toon) {
      this.log(formatAsToon(payload))
    } else if (typeof payload === 'string') {
      this.log(payload)
    } else {
      this.logJson(payload)
    }
  }
}
