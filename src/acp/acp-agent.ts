import type {McpServerConfig} from '@anthropic-ai/claude-agent-sdk'

// The `Agent` interface is imported by name: the `import/namespace` rule
// cannot see type-only members through the namespace object.
import {type Agent as AcpAgentInterface} from '@zed-industries/agent-client-protocol'
import * as acp from '@zed-industries/agent-client-protocol'
import {randomUUID} from 'node:crypto'

import type {AgentConfig, ApiResult, AskOptions, ToolResultEvent, ToolUseEvent} from '../agent/agent-api.js'

import {ask as askAgent} from '../agent/agent-client.js'
import {getAgentSessionInfo, getAgentSessionMessages} from '../agent/session-api.js'

export type AskFn = (config: AgentConfig, prompt: string, options?: AskOptions) => Promise<ApiResult>
export type HistoryFn = (sessionId: string, options?: {dir?: string}) => Promise<ApiResult>
export type SessionInfoFn = (sessionId: string, dir?: string) => Promise<ApiResult>

export interface AcpAgentOptions {
  /** Tools the agent may use; omitted means the SDK's default tool set. */
  allowedTools?: string[]
  /** Injectable for tests; defaults to the shared agent client. */
  askFn?: AskFn
  config: AgentConfig
  /** Injectable for tests; defaults to reading SDK session transcripts. */
  historyFn?: HistoryFn
  /** Injectable for tests; defaults to reading SDK session metadata. */
  infoFn?: SessionInfoFn
  model?: string
  systemPrompt?: string
}

interface AcpSession {
  /** Aborts the in-flight prompt turn when the client cancels. */
  abortController?: AbortController
  cwd: string
  mcpServers?: Record<string, McpServerConfig>
  /** SDK session id, learnt from the first completed turn, used to resume. */
  sdkSessionId?: string
}

/** Claude tool name -> the ACP tool kind clients use to pick an icon. */
const TOOL_KINDS: Record<string, acp.ToolKind> = {
  Bash: 'execute',
  BashOutput: 'execute',
  Edit: 'edit',
  Glob: 'search',
  Grep: 'search',
  KillShell: 'execute',
  MultiEdit: 'edit',
  NotebookEdit: 'edit',
  Read: 'read',
  Task: 'think',
  TodoWrite: 'think',
  WebFetch: 'fetch',
  WebSearch: 'fetch',
  Write: 'edit',
}

/** Tool-input fields that name a file, in the order we prefer them. */
const PATH_FIELDS = ['file_path', 'path', 'notebook_path']

/**
 * Flatten ACP prompt content blocks into the single text prompt the Agent
 * SDK takes. Text and embedded resources are inlined; links and binary
 * blocks are referenced so the model still knows they were attached.
 */
export function promptToText(blocks: acp.ContentBlock[]): string {
  const parts: string[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'audio': {
        parts.push('[audio attachment omitted]')
        break
      }

      case 'image': {
        parts.push(`[image attachment omitted${block.uri ? `: ${block.uri}` : ''}]`)
        break
      }

      case 'resource': {
        const {resource} = block
        parts.push(
          'text' in resource
            ? `Contents of ${resource.uri}:\n\`\`\`\n${resource.text}\n\`\`\``
            : `[binary resource ${resource.uri}]`,
        )
        break
      }

      case 'resource_link': {
        parts.push(`@${block.uri}`)
        break
      }

      case 'text': {
        parts.push(block.text)
        break
      }
    }
  }

  return parts.join('\n\n')
}

/**
 * Translate the MCP servers a client attaches to a session into the Agent
 * SDK's own MCP server configuration.
 */
export function toSdkMcpServers(servers: acp.McpServer[]): Record<string, McpServerConfig> | undefined {
  if (servers.length === 0) return undefined

  const configs: Record<string, McpServerConfig> = {}
  for (const server of servers) {
    const headers = 'headers' in server ? Object.fromEntries(server.headers.map((h) => [h.name, h.value])) : {}

    if ('type' in server && (server.type === 'http' || server.type === 'sse')) {
      configs[server.name] = {headers, type: server.type, url: server.url}
    } else {
      const stdio = server as acp.Stdio
      configs[server.name] = {
        args: stdio.args,
        command: stdio.command,
        env: Object.fromEntries((stdio.env ?? []).map((e) => [e.name, e.value])),
        type: 'stdio',
      }
    }
  }

  return configs
}

/**
 * The Claude agent, exposed over the Agent Client Protocol.
 *
 * An ACP client (a code editor, or another AI agent acting as a client)
 * drives this over stdio: `session/new` opens a conversation, each
 * `session/prompt` runs one `ask()` turn against the Agent SDK, and the
 * turn's assistant text and tool calls are streamed back as `session/update`
 * notifications. Turns after the first resume the SDK session the previous
 * turn created, so the conversation keeps its history.
 */
export class ClaudeAcpAgent implements AcpAgentInterface {
  private readonly askFn: AskFn
  private readonly connection: acp.AgentSideConnection
  private readonly historyFn: HistoryFn
  private readonly infoFn: SessionInfoFn
  private readonly options: AcpAgentOptions
  private readonly sessions = new Map<string, AcpSession>()
  /** Serialises session/update notifications so clients see them in order. */
  private updateQueue: Promise<void> = Promise.resolve()

  constructor(connection: acp.AgentSideConnection, options: AcpAgentOptions) {
    this.connection = connection
    this.options = options
    this.askFn = options.askFn ?? askAgent
    this.historyFn = options.historyFn ?? ((sessionId, opts) => getAgentSessionMessages(sessionId, opts))
    this.infoFn = options.infoFn ?? ((sessionId, dir) => getAgentSessionInfo(sessionId, dir))
  }

  /**
   * No ACP-level authentication: credentials come from the local CLI
   * profile resolved before the server started.
   */
  async authenticate(): Promise<acp.AuthenticateResponse> {
    return {}
  }

  /**
   * Abort the session's in-flight turn. The pending `session/prompt` then
   * resolves with a `cancelled` stop reason.
   */
  async cancel(params: acp.CancelNotification): Promise<void> {
    this.sessions.get(params.sessionId)?.abortController?.abort()
  }

  async initialize(params: acp.InitializeRequest): Promise<acp.InitializeResponse> {
    return {
      agentCapabilities: {
        loadSession: true,
        mcpCapabilities: {http: true, sse: true},
        promptCapabilities: {embeddedContext: true},
      },
      // Echo the client's version when we support it, else our own latest.
      protocolVersion: Math.min(params.protocolVersion, acp.PROTOCOL_VERSION),
    }
  }

  /**
   * Resume a previous conversation. The ACP session id is an Agent SDK
   * session id here, so `session/load` replays that transcript back to the
   * client as message chunks before returning.
   */
  async loadSession(params: acp.LoadSessionRequest): Promise<acp.LoadSessionResponse> {
    // Existence is checked against the session's metadata: reading messages
    // for an unknown session returns an empty list rather than failing.
    const info = await this.infoFn(params.sessionId, params.cwd)
    if (!info.success) {
      throw acp.RequestError.resourceNotFound(params.sessionId)
    }

    this.sessions.set(params.sessionId, {
      cwd: params.cwd,
      mcpServers: toSdkMcpServers(params.mcpServers),
      sdkSessionId: params.sessionId,
    })

    const history = await this.historyFn(params.sessionId, {dir: params.cwd})
    if (!history.success) {
      this.sessions.delete(params.sessionId)
      throw acp.RequestError.internalError({error: String(history.error)})
    }

    const {messages} = (history.data ?? {}) as {messages?: {message?: unknown; type?: string}[]}
    for (const entry of messages ?? []) {
      if (entry.type !== 'assistant' && entry.type !== 'user') continue
      const text = extractMessageText(entry.message)
      if (!text) continue
      this.enqueueUpdate(params.sessionId, {
        content: {text, type: 'text'},
        sessionUpdate: entry.type === 'assistant' ? 'agent_message_chunk' : 'user_message_chunk',
      })
    }

    await this.flushUpdates()
    return {}
  }

  async newSession(params: acp.NewSessionRequest): Promise<acp.NewSessionResponse> {
    const sessionId = randomUUID()
    this.sessions.set(sessionId, {cwd: params.cwd, mcpServers: toSdkMcpServers(params.mcpServers)})
    return {sessionId}
  }

  /**
   * Run one prompt turn. Assistant text, tool calls, and tool results are
   * streamed to the client as they arrive; the turn ends with a stop reason.
   */
  async prompt(params: acp.PromptRequest): Promise<acp.PromptResponse> {
    const session = this.sessions.get(params.sessionId)
    if (!session) {
      throw acp.RequestError.invalidParams({sessionId: `Unknown session '${params.sessionId}'`})
    }

    // A new prompt supersedes anything still running for this session.
    session.abortController?.abort()
    const abortController = new AbortController()
    session.abortController = abortController

    const result = await this.askFn(this.options.config, promptToText(params.prompt), {
      abortController,
      allowedTools: this.options.allowedTools,
      cwd: session.cwd,
      mcpServers: session.mcpServers,
      model: this.options.model,
      onText: (text) =>
        this.enqueueUpdate(params.sessionId, {content: {text, type: 'text'}, sessionUpdate: 'agent_message_chunk'}),
      onToolResult: (event) => this.emitToolResult(params.sessionId, event),
      onToolUse: (name, details) => this.emitToolCall(params.sessionId, name, details),
      resume: session.sdkSessionId,
      systemPrompt: this.options.systemPrompt,
    })

    // Flush queued notifications before answering, as the protocol requires.
    await this.flushUpdates()
    // Only retire our own controller: a turn superseded by a newer prompt must
    // not clear the controller that newer turn is relying on for cancellation.
    if (session.abortController === abortController) {
      session.abortController = undefined
    }

    if (abortController.signal.aborted) return {stopReason: 'cancelled'}

    if (!result.success) {
      throw acp.RequestError.internalError({error: String(result.error)})
    }

    const {sessionId} = (result.data ?? {}) as {sessionId?: string}
    // Remember the SDK session so the next turn resumes this conversation.
    if (sessionId) session.sdkSessionId = sessionId

    return {stopReason: 'end_turn'}
  }

  private emitToolCall(sessionId: string, name: string, details?: ToolUseEvent): void {
    this.enqueueUpdate(sessionId, {
      kind: TOOL_KINDS[name] ?? 'other',
      locations: toolLocations(details?.input),
      rawInput: details?.input,
      sessionUpdate: 'tool_call',
      status: 'in_progress',
      title: name,
      // The protocol requires an id. Tool-use blocks always carry one; if a
      // future SDK omits it there is nothing to correlate a result with, so a
      // synthetic id at least keeps the notification well-formed.
      toolCallId: details?.id ?? randomUUID(),
    })
  }

  private emitToolResult(sessionId: string, event: ToolResultEvent): void {
    this.enqueueUpdate(sessionId, {
      content: event.content ? [{content: {text: event.content, type: 'text'}, type: 'content'}] : undefined,
      sessionUpdate: 'tool_call_update',
      status: event.isError ? 'failed' : 'completed',
      toolCallId: event.toolUseId,
    })
  }

  /**
   * Queue a session update. The Agent SDK's callbacks are synchronous while
   * sending a notification is not, so updates are chained onto a single
   * promise to keep them in the order the model produced them.
   */
  private enqueueUpdate(sessionId: string, update: acp.SessionNotification['update']): void {
    this.updateQueue = this.updateQueue
      .then(() => this.connection.sessionUpdate({sessionId, update}))
      .catch(() => {
        // A client that has gone away must not fail the turn.
      })
  }

  private async flushUpdates(): Promise<void> {
    await this.updateQueue
  }
}

/**
 * Pull readable text out of a persisted transcript message, whose shape the
 * SDK types only as `unknown`.
 */
function extractMessageText(message: unknown): string | undefined {
  if (!message || typeof message !== 'object') return undefined
  const {content} = message as {content?: unknown}
  if (typeof content === 'string') return content || undefined
  if (!Array.isArray(content)) return undefined

  const text = content
    .filter((block): block is {text: string} => Boolean(block) && typeof (block as {text?: unknown}).text === 'string')
    .map((block) => block.text)
    .join('\n')

  return text || undefined
}

/**
 * Report the file a tool is acting on, so clients can follow along in the
 * editor while the agent works.
 */
function toolLocations(input?: Record<string, unknown>): acp.ToolCallLocation[] | undefined {
  if (!input) return undefined

  for (const field of PATH_FIELDS) {
    const value = input[field]
    if (typeof value === 'string' && value) return [{path: value}]
  }

  return undefined
}
