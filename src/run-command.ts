import {formatAsToon} from '@hesed/plugin-lib'
import {Command, Flags, ux} from '@oclif/core'
import {default as path} from 'node:path'

import type {AgentConfig, ApiResult, AskOptions} from './agent/agent-api.js'

import {clearClients} from './agent/agent-client.js'
import {loadAgentConfig} from './agent/profile-config.js'
import {buildWorkspaceContext, type WorkspaceContext} from './workspace-bash.js'
import {readWorkspace} from './workspace-config.js'

/**
 * Base class shared by the run-style commands (`run`, `command run`,
 * `skill run`). Resolves the profile and optional workspace context,
 * wires streaming callbacks, and formats the output; subclasses only
 * decide how the agent is invoked via `invoke()`.
 */
export abstract class RunCommand extends Command {
  static override baseFlags = {
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

  protected abstract invoke(
    config: AgentConfig,
    name: string,
    input: string | undefined,
    options: AskOptions,
  ): Promise<ApiResult>

  public async run(): Promise<void> {
    const {args, flags} = await this.parse()
    const {input, name} = args as {input?: string; name: string}
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    const workspaceContext = await this.resolveWorkspaceContext(flags.workspace, flags.repo)

    const systemPrompt = workspaceContext
      ? flags.system
        ? `${flags.system}\n\n${workspaceContext.systemPrompt}`
        : workspaceContext.systemPrompt
      : flags.system

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : []

    // Spinner would garble streamed output and pollute stderr in scripts.
    const spinner = !flags.stream && Boolean(process.stderr.isTTY)
    if (spinner) ux.action.start(`Running ${name}`)

    let result: ApiResult
    try {
      result = await this.invoke(config, name, input, {
        additionalDirectories: workspaceContext?.additionalDirectories,
        allowedTools,
        cwd: workspaceContext?.cwd ?? process.cwd(),
        onText: flags.stream ? (text: string) => this.log(text) : undefined,
        onToolUse: flags.stream ? (toolName: string) => this.log(`[tool: ${toolName}]`) : undefined,
        sandboxExec: workspaceContext?.sandboxExec,
        sandboxFs: workspaceContext?.sandboxFs,
        systemPrompt,
      })
    } finally {
      if (spinner) ux.action.stop()
    }

    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }

  private async resolveWorkspaceContext(
    workspaceName: string | undefined,
    repoFilter: string | undefined,
  ): Promise<undefined | WorkspaceContext> {
    if (!workspaceName) return undefined

    const workspace = await readWorkspace(this.config.configDir, workspaceName)

    if (!workspace || Object.keys(workspace.repos).length === 0) {
      this.error(`Workspace '${workspaceName}' does not exist.`)
    }

    const workspaceContext = await buildWorkspaceContext({
      cacheDir: path.join(this.config.dataDir, 'workspace-repos'),
      log: this.log.bind(this),
      mode: workspace.mode,
      repoFilter,
      repos: workspace.repos,
      workspaceLabel: workspaceName,
    })

    if (!workspaceContext) {
      this.error(
        `Workspace '${workspaceName}' could not be resolved${repoFilter ? ` for repo '${repoFilter}'` : ''}. Refusing to run against the current directory.`,
      )
    }

    return workspaceContext
  }
}
