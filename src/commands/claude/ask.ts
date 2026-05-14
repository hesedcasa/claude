import {Args, Command, Flags} from '@oclif/core'

import {ask, clearClients} from '../../agent/agent-client.js'
import {commonParentDir, expandPath, readAgentConfig, readWorkspace} from '../../config.js'
import {formatAsToon} from '../../format.js'

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
    workspace: Flags.string({char: 'w', description: 'Workspace name (uses default workspace if omitted)', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AgentAsk)
    const config = await readAgentConfig(this.config.configDir, this.log.bind(this), flags.profile)
    if (!config) return

    let systemPrompt = flags.system
    let cwd = process.cwd()
    let additionalDirectories: string[] | undefined

    const repos = await readWorkspace(this.config.configDir, this.log.bind(this), flags.workspace)
    if (repos && Object.keys(repos).length > 0) {
      const entries = flags.repo ? Object.entries(repos).filter(([name]) => name === flags.repo) : Object.entries(repos)
      if (flags.repo && entries.length === 0) {
        this.log(`Repo '${flags.repo}' not found in workspace '${flags.workspace ?? 'default'}'`)
      } else if (entries.length > 0) {
        const dirLines = entries.map(([name, dir]) => `  ${name}: ${dir}`).join('\n')
        const workspaceContext = `Workspace directories:\n${dirLines}`
        systemPrompt = flags.system ? `${flags.system}\n\n${workspaceContext}` : workspaceContext
        const expandedDirs = entries.map(([, dir]) => expandPath(dir))
        cwd = commonParentDir(expandedDirs)
        additionalDirectories = expandedDirs
      }
    }

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const model = flags.model
      ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model)
      : undefined

    const result = await ask(config, args.prompt, {
      additionalDirectories,
      allowedTools,
      cwd,
      model,
      onText: flags.stream ? (text) => this.log(text) : undefined,
      onToolUse: flags.stream ? (name) => this.log(`[tool: ${name}]`) : undefined,
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
