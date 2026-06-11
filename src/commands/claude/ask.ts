import {formatAsToon} from '@hesed/plugin-lib'
import {Args, Command, Flags} from '@oclif/core'
import {default as path} from 'node:path'

import {ask, clearClients} from '../../agent/agent-client.js'
import {loadAgentConfig} from '../../agent/profile-config.js'
import {buildWorkspaceContext, type WorkspaceContext} from '../../workspace-bash.js'
import {readWorkspace} from '../../workspace-config.js'

export default class AgentAsk extends Command {
  static override args = {
    prompt: Args.string({description: 'Natural-language prompt to send to the agent', required: true}),
  }
  static override description = 'Ask the Claude agent a natural-language question'
  static override examples = [
    '<%= config.bin %> <%= command.id %> "What is the capital of France?"',
    '<%= config.bin %> <%= command.id %> "List files in src" --allow-tools Read,Glob',
    '<%= config.bin %> <%= command.id %> "Summarise changes" --workspace proj01',
    '<%= config.bin %> <%= command.id %> "Review changes" --workspace proj01 --repo repo01',
  ]
  static override flags = {
    'allow-tools': Flags.string({
      description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
      required: false,
    }),
    model: Flags.string({char: 'm', description: 'Model to use (e.g. claude-opus-4-7)', required: false}),
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
    const {args, flags} = await this.parse(AgentAsk)
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    let workspaceContext: undefined | WorkspaceContext
    const workspace = await readWorkspace(this.config.configDir, this.log.bind(this), flags.workspace)
    if (workspace && Object.keys(workspace.repos).length > 0) {
      workspaceContext = await buildWorkspaceContext({
        cacheDir: path.join(this.config.dataDir, 'workspace-repos'),
        log: this.log.bind(this),
        mode: workspace.mode,
        repoFilter: flags.repo,
        repos: workspace.repos,
        workspaceLabel: flags.workspace ?? 'default',
      })
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

    const model = flags.model ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model) : undefined

    const result = await ask(config, args.prompt, {
      additionalDirectories: workspaceContext?.additionalDirectories,
      allowedTools,
      cwd: workspaceContext?.cwd ?? process.cwd(),
      model,
      onText: flags.stream ? (text) => this.log(text) : undefined,
      onToolUse: flags.stream ? (name) => this.log(`[tool: ${name}]`) : undefined,
      sandboxExec: workspaceContext?.sandboxExec,
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
