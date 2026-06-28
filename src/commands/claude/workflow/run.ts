import {formatAsToon} from '@hesed/plugin-lib'
import {Args, Command, Flags} from '@oclif/core'
import {default as path} from 'node:path'

import {ask, clearClients} from '../../../agent/agent-client.js'
import {loadAgentConfig} from '../../../agent/profile-config.js'
import {readWorkflow} from '../../../workflow-config.js'
import {buildWorkspaceContext, type WorkspaceContext} from '../../../workspace-bash.js'
import {readWorkspace} from '../../../workspace-config.js'

function resolveSystemPrompt(
  customSystem: string | undefined,
  workspaceContext: undefined | WorkspaceContext,
): string | undefined {
  if (!workspaceContext) return customSystem
  return customSystem ? `${customSystem}\n\n${workspaceContext.systemPrompt}` : workspaceContext.systemPrompt
}

/* eslint-disable perfectionist/sort-objects */
export default class AgentWorkflowRun extends Command {
  static override args = {
    name: Args.string({description: 'Workflow name', required: true}),
    input: Args.string({description: 'Additional input to append to the workflow prompt', required: false}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Run a saved workflow by name'
  static override examples = [
    '<%= config.bin %> <%= command.id %> daily-review',
    '<%= config.bin %> <%= command.id %> daily-review "focus on auth module"',
    '<%= config.bin %> <%= command.id %> daily-review --stream',
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
      description: 'Override the workflow workspace (uses workflow setting if omitted)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AgentWorkflowRun)
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    const workflow = await readWorkflow(this.config.configDir, args.name)
    if (!workflow) {
      this.error(`Workflow '${args.name}' does not exist.`)
    }

    const prompt = args.input ? `${workflow.prompt}\n\n${args.input}` : workflow.prompt
    const workspaceName = flags.workspace ?? workflow.workspace

    let workspaceContext: undefined | WorkspaceContext
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
    }

    const systemPrompt = resolveSystemPrompt(flags.system, workspaceContext)

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const result = await ask(config, prompt, {
      additionalDirectories: workspaceContext?.additionalDirectories,
      allowedTools,
      cwd: workspaceContext?.cwd ?? process.cwd(),
      onText: flags.stream ? (text) => this.log(text) : undefined,
      onToolUse: flags.stream ? (name) => this.log(`[tool: ${name}]`) : undefined,
      sandboxExec: workspaceContext?.sandboxExec,
      sandboxFs: workspaceContext?.sandboxFs,
      skills: workflow.skills,
      systemPrompt,
    })
    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }

    if (!result.success) {
      this.error(typeof result.error === 'string' ? result.error : 'Workflow run failed.')
    }
  }
}
