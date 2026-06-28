import {formatAsToon} from '@hesed/plugin-lib'
import {Args, Command, Flags} from '@oclif/core'
import {default as path} from 'node:path'

import {clearClients, run} from '../../agent/agent-client.js'
import {loadAgentConfig} from '../../agent/profile-config.js'
import {buildWorkspaceContext, type WorkspaceContext} from '../../workspace-bash.js'
import {readWorkspace} from '../../workspace-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class AgentRun extends Command {
  static override args = {
    name: Args.string({description: 'Slash command (e.g. /help) or skill name', required: true}),
    input: Args.string({description: 'Additional input to forward to the agent', required: false}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Execute a slash command or skill by name'
  static override examples = [
    '<%= config.bin %> <%= command.id %> /help',
    '<%= config.bin %> <%= command.id %> review "this branch"',
    '<%= config.bin %> <%= command.id %> /clear --stream',
    '<%= config.bin %> <%= command.id %> review "this repo" --workspace proj01',
  ]
  static override flags = {
    'allow-tools': Flags.string({
      description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
      required: false,
    }),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    repo: Flags.string({description: 'Filter workspace context to this repo name', required: false}),
    stream: Flags.boolean({description: 'Stream assistant text as it arrives', required: false}),
    system: Flags.string({description: 'Custom system prompt for the agent', required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
    workspace: Flags.string({
      char: 'w',
      description: 'Workspace name (uses current directory if omitted)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AgentRun)
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

    const systemPrompt = workspaceContext
      ? flags.system
        ? `${flags.system}\n\n${workspaceContext.systemPrompt}`
        : workspaceContext.systemPrompt
      : flags.system

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const result = await run(config, args.name, args.input, {
      additionalDirectories: workspaceContext?.additionalDirectories,
      allowedTools,
      cwd: workspaceContext?.cwd ?? process.cwd(),
      onText: flags.stream ? (text) => this.log(text) : undefined,
      onToolUse: flags.stream ? (name) => this.log(`[tool: ${name}]`) : undefined,
      sandboxExec: workspaceContext?.sandboxExec,
      sandboxFs: workspaceContext?.sandboxFs,
      systemPrompt,
    })
    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
