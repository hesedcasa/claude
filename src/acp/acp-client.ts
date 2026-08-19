import * as acp from '@zed-industries/agent-client-protocol'
import {default as fs} from 'fs-extra'
import {type ChildProcess, spawn as nodeSpawn} from 'node:child_process'
import {default as path} from 'node:path'

import {nodeStdioStream} from './acp-stream.js'

export type SpawnFn = typeof nodeSpawn

/** What to answer when the peer agent asks permission to run a tool. */
export type PermissionPolicy = 'allow' | 'reject'

export interface AcpPeerEvents {
  /** The peer asked for permission and we answered with `optionId`. */
  onPermission?: (event: {optionId: string; title: string}) => void
  /** The peer's plan for the turn changed. */
  onPlan?: (entries: {content: string; status: string}[]) => void
  /** Assistant text from the peer. */
  onText?: (text: string) => void
  /** The peer's reasoning, when it chooses to share it. */
  onThought?: (text: string) => void
  /** A tool call started, or an existing one changed state. */
  onToolCall?: (event: {status?: string; title?: string; toolCallId: string}) => void
}

export interface AcpPeerOptions extends AcpPeerEvents {
  args?: string[]
  command: string
  cwd?: string
  env?: Record<string, string>
  /** Advertise `fs/write_text_file` to the peer. Defaults to true. */
  fsWrite?: boolean
  /** How to answer `session/request_permission`. Defaults to 'allow'. */
  permission?: PermissionPolicy
  /** Injectable for tests; defaults to node:child_process spawn. */
  spawnFn?: SpawnFn
}

/** Read the text out of an ACP content block for terminal display. */
function contentText(content: acp.ContentBlock): string {
  switch (content.type) {
    case 'resource': {
      const {resource} = content
      return 'text' in resource ? resource.text : `[binary resource ${resource.uri}]`
    }

    case 'resource_link': {
      return `[${content.name}](${content.uri})`
    }

    case 'text': {
      return content.text
    }

    default: {
      return `[${content.type}]`
    }
  }
}

/**
 * Pick the permission option matching the configured policy, preferring the
 * one-shot variants so an answer never silently applies to later turns.
 */
export function selectPermissionOption(
  options: acp.PermissionOption[],
  policy: PermissionPolicy,
): acp.PermissionOption | undefined {
  const order: acp.PermissionOption['kind'][] =
    policy === 'allow' ? ['allow_once', 'allow_always'] : ['reject_once', 'reject_always']

  for (const kind of order) {
    const match = options.find((option) => option.kind === kind)
    if (match) return match
  }

  return options[0]
}

/**
 * A peer AI agent that speaks the Agent Client Protocol, driven from this
 * CLI as the ACP *client*.
 *
 * The peer is spawned as a subprocess (`gemini --experimental-acp`,
 * `claude-code-acp`, another `claude acp serve`, ...) and talked to over
 * newline-delimited JSON-RPC on its stdio. This side answers the peer's
 * permission requests according to `permission` and serves its file reads
 * and writes from the real filesystem.
 */
export class AcpPeer {
  private child?: ChildProcess
  private connection?: acp.ClientSideConnection
  private exitError?: Error
  private readonly options: AcpPeerOptions
  private readonly spawnFn: SpawnFn
  /** Rejectors for in-flight requests, tripped if the peer dies. */
  private waiters = new Set<(error: Error) => void>()

  constructor(options: AcpPeerOptions) {
    this.options = options
    this.spawnFn = options.spawnFn ?? nodeSpawn
  }

  /**
   * Stop the peer process. Safe to call more than once.
   */
  async close(): Promise<void> {
    const {child} = this
    this.child = undefined
    this.connection = undefined
    if (!child || child.exitCode !== null || child.signalCode !== null) return

    await new Promise<void>((resolve) => {
      child.once('close', () => resolve())
      child.kill()
    })
  }

  /**
   * Replay an existing peer session so the conversation continues where it
   * left off. Only available when the peer advertises `loadSession`.
   */
  async loadSession(sessionId: string): Promise<void> {
    await this.race(
      this.requireConnection().loadSession({
        cwd: this.cwd(),
        mcpServers: [],
        sessionId,
      }),
    )
  }

  /**
   * Open a new conversation with the peer.
   */
  async newSession(): Promise<string> {
    const response = await this.race(this.requireConnection().newSession({cwd: this.cwd(), mcpServers: []}))
    return response.sessionId
  }

  /**
   * Send one prompt and wait for the peer to finish its turn. Streamed
   * output arrives through the handlers passed to the constructor.
   */
  async prompt(sessionId: string, text: string): Promise<acp.PromptResponse> {
    return this.race(
      this.requireConnection().prompt({
        prompt: [{text, type: 'text'}],
        sessionId,
      }),
    )
  }

  /**
   * Spawn the peer and complete the ACP initialize handshake.
   */
  async start(): Promise<acp.InitializeResponse> {
    const child = this.spawnFn(this.options.command, this.options.args ?? [], {
      cwd: this.cwd(),
      env: {...process.env, ...this.options.env},
      stdio: ['pipe', 'pipe', 'inherit'],
    })
    this.child = child
    this.watchForExit(child)

    if (!child.stdin || !child.stdout) {
      throw new Error(`Peer agent '${this.options.command}' did not expose stdio pipes`)
    }

    const stream = nodeStdioStream({input: child.stdout, output: child.stdin})
    this.connection = new acp.ClientSideConnection(() => this.buildClient(), stream)

    return this.race(
      this.connection.initialize({
        clientCapabilities: {fs: {readTextFile: true, writeTextFile: this.options.fsWrite !== false}},
        protocolVersion: acp.PROTOCOL_VERSION,
      }),
    )
  }

  /**
   * The client half of the connection: everything the peer may ask of us.
   *
   * Handlers are plain object methods, so anything they need from the peer
   * is captured here rather than reached for through `this`.
   */
  private buildClient(): acp.Client {
    const events: AcpPeerEvents = this.options
    const fsWrite = this.options.fsWrite !== false
    const policy = this.options.permission ?? 'allow'

    return {
      async readTextFile(params: acp.ReadTextFileRequest): Promise<acp.ReadTextFileResponse> {
        const content = await fs.readFile(params.path, 'utf8')
        const line = params.line ?? undefined
        const limit = params.limit ?? undefined
        if (line === undefined && limit === undefined) return {content}

        const lines = content.split('\n')
        const start = line === undefined ? 0 : Math.max(0, line - 1)
        const end = limit === undefined ? lines.length : start + limit
        return {content: lines.slice(start, end).join('\n')}
      },

      async requestPermission(params: acp.RequestPermissionRequest): Promise<acp.RequestPermissionResponse> {
        const option = selectPermissionOption(params.options, policy)
        if (!option) return {outcome: {outcome: 'cancelled'}}

        events.onPermission?.({optionId: option.optionId, title: params.toolCall.title ?? 'tool call'})
        return {outcome: {optionId: option.optionId, outcome: 'selected'}}
      },

      async sessionUpdate(params: acp.SessionNotification): Promise<void> {
        const {update} = params
        switch (update.sessionUpdate) {
          case 'agent_message_chunk': {
            events.onText?.(contentText(update.content))
            break
          }

          case 'agent_thought_chunk': {
            events.onThought?.(contentText(update.content))
            break
          }

          case 'plan': {
            events.onPlan?.(update.entries.map((entry) => ({content: entry.content, status: entry.status})))
            break
          }

          case 'tool_call': {
            events.onToolCall?.({status: update.status, title: update.title, toolCallId: update.toolCallId})
            break
          }

          case 'tool_call_update': {
            events.onToolCall?.({
              status: update.status ?? undefined,
              title: update.title ?? undefined,
              toolCallId: update.toolCallId,
            })
            break
          }

          default: {
            break
          }
        }
      },

      async writeTextFile(params: acp.WriteTextFileRequest): Promise<acp.WriteTextFileResponse> {
        if (!fsWrite) {
          throw acp.RequestError.invalidRequest({reason: 'Writes are disabled for this peer agent'})
        }

        await fs.outputFile(params.path, params.content)
        return {}
      },
    }
  }

  private cwd(): string {
    return this.options.cwd ? path.resolve(this.options.cwd) : process.cwd()
  }

  private failWaiters(reason: string): void {
    this.exitError ??= new Error(`Peer agent '${this.options.command}' ${reason}`)
    for (const reject of this.waiters) reject(this.exitError)
    this.waiters.clear()
  }

  /**
   * Fail an in-flight request if the peer process dies, instead of waiting
   * on a reply that can never arrive.
   */
  private async race<T>(operation: Promise<T>): Promise<T> {
    if (this.exitError) throw this.exitError

    return new Promise<T>((resolve, reject) => {
      this.waiters.add(reject)
      operation.then(resolve, reject).finally(() => this.waiters.delete(reject))
    })
  }

  private requireConnection(): acp.ClientSideConnection {
    if (!this.connection) throw new Error('Peer agent is not connected; call start() first')
    return this.connection
  }

  /**
   * Watch the peer process so a death takes down pending requests with it.
   */
  private watchForExit(child: ChildProcess): void {
    child.once('error', (error: Error) => this.failWaiters(`could not be started: ${error.message}`))
    child.once('exit', (code, signal) =>
      this.failWaiters(signal ? `exited on signal ${signal}` : `exited with code ${code ?? 'unknown'}`),
    )
  }
}
