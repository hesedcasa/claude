import {createSdkMcpServer, type McpServerConfig, query, type SDKMessage, tool} from '@anthropic-ai/claude-agent-sdk'
import {z} from 'zod'

export interface ApiResult {
  data?: unknown
  error?: unknown
  success: boolean
}

export interface ModelMap {
  haiku?: string
  opus?: string
  sonnet?: string
}

export interface AgentConfig {
  apiKey: string
  apiUrl: string
  models?: ModelMap
}

export type SandboxExecFn = (command: string) => Promise<{exitCode: number; stderr: string; stdout: string}>

export interface AskOptions {
  additionalDirectories?: string[]
  allowedTools?: string[]
  cwd?: string
  model?: string
  onText?: (text: string) => void
  onToolUse?: (toolName: string) => void
  sandboxExec?: SandboxExecFn
  skills?: 'all' | string[]
  systemPrompt?: string
}

export interface UsageSummary {
  costUsd: number
  durationMs: number
  inputTokens: number
  numTurns: number
  outputTokens: number
}

interface AskResult {
  model?: string
  result: string
  toolsUsed: string[]
  usage?: UsageSummary
}

interface ListResult {
  agents: string[]
  commands: string[]
  mcpServers: {name: string; status: string}[]
  skills: string[]
  tools: string[]
}

type QueryFn = typeof query

const SANDBOX_BASH_TOOL = 'mcp__workspace-bash__bash'
const SANDBOXED_BUILTIN_TOOLS = ['Bash', 'Edit', 'Glob', 'Grep', 'MultiEdit', 'NotebookEdit', 'Read', 'Write']

interface SandboxTooling {
  allowedTools?: string[]
  disallowedTools?: string[]
  mcpServers?: Record<string, McpServerConfig>
}

/**
 * Resolve the tool-related query options for a run. With a sandbox, the
 * built-in fs/shell tools are blocked, the sandbox bash tool is exposed,
 * and a non-empty allow-list is extended to include it.
 */
function resolveToolOptions(options?: AskOptions): SandboxTooling {
  if (!options?.sandboxExec) return {allowedTools: options?.allowedTools}

  const sandbox = buildSandboxTooling(options.sandboxExec)
  const allowedTools =
    options.allowedTools && options.allowedTools.length > 0
      ? [...options.allowedTools, SANDBOX_BASH_TOOL]
      : options.allowedTools

  return {...sandbox, allowedTools}
}

/**
 * Expose the workspace sandbox as an in-process MCP `bash` tool and block
 * the built-in filesystem/shell tools so every operation goes through the
 * virtual filesystem instead of the real one.
 */
function buildSandboxTooling(sandboxExec: SandboxExecFn): SandboxTooling {
  const bashTool = tool(
    'bash',
    'Run a bash command in the sandboxed workspace filesystem. Workspace repos are mounted under /workspace/<repoName>.',
    {command: z.string().describe('Bash command to execute')},
    async ({command}) => {
      const result = await sandboxExec(command)
      const text = [result.stdout, result.stderr].filter(Boolean).join('\n')
      return {
        content: [{text: text || `(exit code ${result.exitCode})`, type: 'text' as const}],
        isError: result.exitCode !== 0,
      }
    },
  )

  return {
    disallowedTools: SANDBOXED_BUILTIN_TOOLS,
    mcpServers: {'workspace-bash': createSdkMcpServer({name: 'workspace-bash', tools: [bashTool]})},
  }
}

/**
 * Claude Agent SDK client. Wraps the SDK's `query()` async generator
 * and surfaces a simple ask/testConnection API consistent with the
 * project's ApiResult pattern.
 */
export class AgentApi {
  private config: AgentConfig
  private queryFn: QueryFn

  constructor(config: AgentConfig, queryFn: QueryFn = query) {
    this.config = config
    this.queryFn = queryFn
  }

  /**
   * Send a natural-language prompt to the agent and collect the full result.
   */
  async ask(prompt: string, options?: AskOptions): Promise<ApiResult> {
    try {
      const toolOptions = resolveToolOptions(options)

      const iterator = this.queryFn({
        options: {
          additionalDirectories: options?.additionalDirectories,
          allowedTools: toolOptions.allowedTools,
          cwd: options?.cwd,
          disallowedTools: toolOptions.disallowedTools,
          env: this.buildEnv(),
          mcpServers: toolOptions.mcpServers,
          model: options?.model,
          permissionMode: 'bypassPermissions',
          skills: options?.skills,
          systemPrompt: options?.systemPrompt,
        },
        prompt,
      })

      const toolsUsed: string[] = []
      let finalText = ''
      let model: string | undefined
      let usage: undefined | UsageSummary
      let errorSubtype: string | undefined
      let resultSeen = false

      for await (const message of iterator as AsyncIterable<SDKMessage>) {
        if (message.type === 'assistant') {
          this.handleAssistantMessage(message, toolsUsed, options)
        } else if (message.type === 'result') {
          resultSeen = true
          if (message.subtype === 'success') {
            finalText = message.result
            model = Object.keys(message.modelUsage ?? {})[0]
            usage = this.extractUsage(message)
          } else {
            errorSubtype = message.subtype
          }
        }
      }

      if (errorSubtype) {
        return {error: `Agent run ended with subtype: ${errorSubtype}`, success: false}
      }

      if (!resultSeen) {
        return {error: 'Agent run completed without a result message', success: false}
      }

      return {data: {model, result: finalText, toolsUsed, usage} satisfies AskResult, success: true}
    } catch (error: unknown) {
      return {error: error instanceof Error ? error.message : String(error), success: false}
    }
  }

  /**
   * Clear client (no persistent client to dispose for the SDK wrapper).
   */
  clearClients(): void {}

  /**
   * List the skills, slash commands, tools, subagents, and MCP servers
   * available to the current session. Reads the SDK's init system message
   * and aborts the run immediately afterwards.
   */
  async list(options?: Pick<AskOptions, 'additionalDirectories' | 'cwd'>): Promise<ApiResult> {
    const controller = new AbortController()
    let initData: ListResult | undefined
    try {
      const iterator = this.queryFn({
        options: {
          abortController: controller,
          additionalDirectories: options?.additionalDirectories,
          cwd: options?.cwd,
          env: this.buildEnv(),
          permissionMode: 'bypassPermissions',
        },
        prompt: 'list',
      })

      for await (const message of iterator as AsyncIterable<SDKMessage>) {
        if (message.type === 'system' && message.subtype === 'init') {
          initData = {
            agents: message.agents ?? [],
            commands: message.slash_commands ?? [],
            mcpServers: message.mcp_servers ?? [],
            skills: message.skills ?? [],
            tools: message.tools ?? [],
          } satisfies ListResult
          controller.abort()
          return {data: initData, success: true}
        }
      }

      return {error: 'Agent did not emit an init message', success: false}
    } catch (error: unknown) {
      if (initData) {
        return {data: initData, success: true}
      }

      const msg = error instanceof Error ? error.message : String(error)
      if (controller.signal.aborted) {
        return {error: 'Aborted before init message', success: false}
      }

      return {error: msg, success: false}
    }
  }

  /**
   * Execute a slash command or skill by name.
   *
   * - Names starting with `/` are treated as slash commands and sent
   *   directly as the prompt (e.g. `/help`, `/clear`, `/my-cmd args`).
   * - Other names are treated as skills: the run is scoped to that
   *   single skill via `options.skills`, and the user-supplied input
   *   is forwarded to the model with a default instruction when blank.
   */
  async run(name: string, input?: string, options?: AskOptions): Promise<ApiResult> {
    const trimmed = name.trim()
    if (!trimmed) {
      return {error: 'Name is required', success: false}
    }

    if (trimmed.startsWith('/')) {
      const prompt = input ? `${trimmed} ${input}` : trimmed
      return this.ask(prompt, options)
    }

    const prompt = input || `Use the ${trimmed} skill.`
    return this.ask(prompt, {...options, skills: [trimmed]})
  }

  /**
   * Verify agent credentials by issuing a minimal prompt.
   */
  async testConnection(): Promise<ApiResult> {
    const result = await this.ask('Reply with exactly the word OK and nothing else.', {
      allowedTools: [],
      model: this.config.models?.haiku ?? 'haiku',
    })

    if (!result.success) return result

    return {
      data: {apiUrl: this.config.apiUrl || 'default', reply: (result.data as AskResult).result},
      success: true,
    }
  }

  private buildEnv(): Record<string, string | undefined> {
    const env: Record<string, string | undefined> = {
      ...process.env,
      ANTHROPIC_API_KEY: this.config.apiKey,
    }
    if (this.config.apiUrl) {
      env.ANTHROPIC_BASE_URL = this.config.apiUrl
    }

    return env
  }

  private extractUsage(message: SDKMessage & {type: 'result'}): undefined | UsageSummary {
    if (message.subtype !== 'success') return undefined
    const u = message.usage as Record<string, unknown> | undefined
    const inputTokens = Number(u?.input_tokens ?? 0)
    const outputTokens = Number(u?.output_tokens ?? 0)

    return {
      costUsd: message.total_cost_usd ?? 0,
      durationMs: message.duration_ms ?? 0,
      inputTokens,
      numTurns: message.num_turns ?? 0,
      outputTokens,
    }
  }

  private handleAssistantMessage(
    message: SDKMessage & {type: 'assistant'},
    toolsUsed: string[],
    options?: AskOptions,
  ): void {
    const content = message.message?.content
    if (!Array.isArray(content)) return

    for (const block of content) {
      if (!block || typeof block !== 'object') continue

      if ('text' in block && typeof block.text === 'string') {
        options?.onText?.(block.text)
      } else if ('name' in block && typeof block.name === 'string') {
        toolsUsed.push(block.name)
        options?.onToolUse?.(block.name)
      }
    }
  }
}
