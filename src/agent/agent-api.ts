import {createSdkMcpServer, type McpServerConfig, query, type SDKMessage, tool} from '@anthropic-ai/claude-agent-sdk'
import {z} from 'zod'

import type {SandboxFs} from '../workspace-bash.js'

// eslint-disable-next-line unicorn/prefer-export-from
export type {SandboxFs}

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
  continueSession?: boolean
  cwd?: string
  forkSession?: boolean
  model?: string
  onText?: (text: string) => void
  onToolUse?: (toolName: string) => void
  resume?: string
  sandboxExec?: SandboxExecFn
  sandboxFs?: SandboxFs
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
  sessionId?: string
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

const SANDBOX_MCP_SERVER = 'workspace-bash'
const SANDBOX_BASH_TOOL = `mcp__${SANDBOX_MCP_SERVER}__bash`
const SANDBOX_READ_TOOL = `mcp__${SANDBOX_MCP_SERVER}__read`
const SANDBOX_WRITE_TOOL = `mcp__${SANDBOX_MCP_SERVER}__write`
const SANDBOX_EDIT_TOOL = `mcp__${SANDBOX_MCP_SERVER}__edit`
const SANDBOX_TOOLS = [SANDBOX_BASH_TOOL, SANDBOX_READ_TOOL, SANDBOX_WRITE_TOOL, SANDBOX_EDIT_TOOL]
const SANDBOXED_BUILTIN_TOOLS = ['Bash', 'Edit', 'Glob', 'Grep', 'MultiEdit', 'NotebookEdit', 'Read', 'Write']

interface SandboxTooling {
  allowedTools?: string[]
  disallowedTools?: string[]
  mcpServers?: Record<string, McpServerConfig>
}

/**
 * Resolve the tool-related query options for a run. With a sandbox, the
 * built-in fs/shell tools are blocked, the sandbox tools are exposed,
 * and any explicit allow-list is extended to include them.
 */
function resolveToolOptions(options?: AskOptions): SandboxTooling {
  if (!options?.sandboxExec) return {allowedTools: options?.allowedTools}

  const sandbox = buildSandboxTooling(options.sandboxExec, options.sandboxFs)
  const registeredTools = options.sandboxFs ? SANDBOX_TOOLS : [SANDBOX_BASH_TOOL]
  const allowedTools = options.allowedTools === undefined ? undefined : [...options.allowedTools, ...registeredTools]

  return {...sandbox, allowedTools}
}

/**
 * Expose the workspace sandbox as in-process MCP tools (bash, read, write,
 * edit) and block the built-in filesystem/shell tools so every operation
 * goes through the virtual filesystem instead of the real one.
 */
function buildSandboxTooling(sandboxExec: SandboxExecFn, sandboxFs?: SandboxFs): SandboxTooling {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: ReturnType<typeof tool<any>>[] = [bashTool]

  if (sandboxFs) {
    const readTool = tool(
      'read',
      'Read a file or list a directory in the sandboxed workspace.',
      {
        /* eslint-disable perfectionist/sort-objects */
        path: z.string().describe('Absolute path to the file or directory'),
        offset: z.number().optional().describe('Line number to start from (1-indexed)'),
        limit: z.number().optional().describe('Maximum number of lines to read'),
        /* eslint-enable perfectionist/sort-objects */
      },
      async ({limit, offset, path}) => {
        try {
          const stat = await sandboxFs.stat(path)
          if (stat.isDirectory) {
            const entries = await sandboxFs.readdir(path)
            return {content: [{text: entries.join('\n') || '(empty directory)', type: 'text' as const}]}
          }

          const content = await sandboxFs.readFile(path)
          const lines = content.split('\n')
          const start = offset ? Math.max(0, offset - 1) : 0
          const end = limit ? start + limit : lines.length
          const slice = lines.slice(start, end).join('\n')
          return {content: [{text: slice, type: 'text' as const}]}
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error)
          return {content: [{text: msg, type: 'text' as const}], isError: true}
        }
      },
    )

    const writeTool = tool(
      'write',
      'Write content to a file in the sandboxed workspace. Creates parent directories as needed.',
      {
        /* eslint-disable perfectionist/sort-objects */
        path: z.string().describe('Absolute path to the file'),
        content: z.string().describe('Content to write'),
        /* eslint-enable perfectionist/sort-objects */
      },
      async ({content, path}) => {
        try {
          await sandboxFs.writeFile(path, content)
          return {content: [{text: `Wrote ${content.length} bytes to ${path}`, type: 'text' as const}]}
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error)
          return {content: [{text: msg, type: 'text' as const}], isError: true}
        }
      },
    )

    const editTool = tool(
      'edit',
      'Replace an exact unique string in a file in the sandboxed workspace.',
      {
        /* eslint-disable camelcase, perfectionist/sort-objects */
        path: z.string().describe('Absolute path to the file'),
        old_string: z.string().describe('Exact text to replace (must be unique in the file)'),
        new_string: z.string().describe('Replacement text'),
        /* eslint-enable camelcase, perfectionist/sort-objects */
      },
      // eslint-disable-next-line camelcase
      async ({new_string, old_string, path}) => {
        try {
          const content = await sandboxFs.readFile(path)
          const count = content.split(old_string).length - 1
          if (count === 0) {
            return {
              content: [{text: `Text not found in ${path}`, type: 'text' as const}],
              isError: true,
            }
          }

          if (count > 1) {
            return {
              content: [
                {
                  text: `Found ${count} occurrences; provide more context to make the match unique`,
                  type: 'text' as const,
                },
              ],
              isError: true,
            }
          }

          await sandboxFs.writeFile(path, content.replace(old_string, new_string))
          return {content: [{text: `Edited ${path}`, type: 'text' as const}]}
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error)
          return {content: [{text: msg, type: 'text' as const}], isError: true}
        }
      },
    )

    tools.push(readTool, writeTool, editTool)
  }

  return {
    disallowedTools: SANDBOXED_BUILTIN_TOOLS,
    mcpServers: {[SANDBOX_MCP_SERVER]: createSdkMcpServer({name: SANDBOX_MCP_SERVER, tools})},
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
          continue: options?.continueSession,
          cwd: options?.cwd,
          disallowedTools: toolOptions.disallowedTools,
          env: this.buildEnv(),
          forkSession: options?.forkSession,
          mcpServers: toolOptions.mcpServers,
          model: options?.model ?? this.config.models?.sonnet,
          permissionMode: 'bypassPermissions',
          resume: options?.resume,
          skills: options?.skills,
          systemPrompt: options?.systemPrompt,
        },
        prompt,
      })

      const toolsUsed: string[] = []
      let finalText = ''
      let model: string | undefined
      let sessionId: string | undefined
      let usage: undefined | UsageSummary
      let errorSubtype: string | undefined
      let resultSeen = false

      for await (const message of iterator as AsyncIterable<SDKMessage>) {
        if (message.type === 'assistant') {
          this.handleAssistantMessage(message, toolsUsed, options)
        } else if (message.type === 'result') {
          resultSeen = true
          sessionId = message.session_id
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

      return {data: {model, result: finalText, sessionId, toolsUsed, usage} satisfies AskResult, success: true}
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
