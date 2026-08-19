import {Args, Command, Flags} from '@oclif/core'

import {AcpPeer, type PermissionPolicy} from '../../../acp/acp-client.js'
import {type AcpAgentEntry, readAcpAgent, readAcpAgents} from '../../../acp/acp-config.js'

/**
 * Turn a peer failure into something worth printing. JSON-RPC errors arrive
 * as plain `{code, message, data}` objects rather than Errors, so they would
 * otherwise reach the user as a bare non-zero exit.
 */
function describePeerError(error: unknown): string {
  if (error && typeof error === 'object' && !(error instanceof Error)) {
    const {code, data, message} = error as {code?: unknown; data?: unknown; message?: unknown}
    const codePart = code === undefined ? '' : ` [${String(code)}]`
    const dataPart = data === undefined ? '' : ` ${JSON.stringify(data)}`
    return `${String(message ?? 'request failed')}${codePart}${dataPart}`
  }

  return error instanceof Error ? error.message : String(error)
}

interface PromptResult {
  agent: string
  protocolVersion?: number
  sessionId: string
  stopReason: string
  text: string
}

/**
 * Talk to another AI agent over ACP: spawn the peer, open (or resume) a
 * session, send one prompt, and stream its answer back to the terminal.
 */
export default class AcpPrompt extends Command {
  static override args = {
    agent: Args.string({description: 'Registered ACP agent name (see `claude acp`)', required: true}),
    prompt: Args.string({description: 'Prompt to send to the peer agent', required: true}),
  }
  static override description = 'Send a prompt to another AI agent over the Agent Client Protocol (ACP)'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %> gemini "Summarise the architecture of this repo"',
    '<%= config.bin %> <%= command.id %> peer "Review my changes" --session 019c0f2a-1234-4c56-8d90-abcdef012345',
    '<%= config.bin %> <%= command.id %> peer "What changed?" --permission reject --read-only',
    '<%= config.bin %> <%= command.id %> inline "Hello" --command gemini --arg --experimental-acp',
  ]
  static override flags = {
    arg: Flags.string({
      description: 'Argument for the peer agent command (repeatable, used with --command)',
      multiple: true,
      required: false,
    }),
    command: Flags.string({
      char: 'c',
      description: 'Peer agent command, instead of looking the name up in the registry',
      required: false,
    }),
    cwd: Flags.string({description: 'Working directory the peer agent should operate in', required: false}),
    env: Flags.string({
      description: 'Environment variable for the peer agent as KEY=value (repeatable)',
      multiple: true,
      required: false,
    }),
    permission: Flags.string({
      default: 'allow',
      description: "How to answer the peer's tool permission requests",
      options: ['allow', 'reject'],
      required: false,
    }),
    'read-only': Flags.boolean({
      description: 'Do not let the peer agent write files through this CLI',
      required: false,
    }),
    session: Flags.string({description: 'Peer session ID to resume instead of starting a new one', required: false}),
  }

  public async run(): Promise<PromptResult> {
    const {args, flags} = await this.parse(AcpPrompt)
    const json = this.jsonEnabled()
    const entry = await this.resolveAgent(args.agent, flags)

    const chunks: string[] = []
    const peer = new AcpPeer({
      ...entry,
      cwd: flags.cwd ?? entry.cwd,
      fsWrite: !flags['read-only'],
      onPermission: ({optionId, title}) => {
        if (!json) this.log(`[permission: ${title} -> ${optionId}]`)
      },
      onText: (text) => {
        chunks.push(text)
        if (!json) this.log(text)
      },
      onToolCall: ({status, title}) => {
        if (!json && title) this.log(`[tool: ${title}${status ? ` (${status})` : ''}]`)
      },
      permission: flags.permission as PermissionPolicy,
    })

    try {
      const init = await peer.start()
      const sessionId = await this.openSession(peer, init, flags.session)
      const response = await peer.prompt(sessionId, args.prompt)

      const result: PromptResult = {
        agent: args.agent,
        protocolVersion: init.protocolVersion,
        sessionId,
        stopReason: response.stopReason,
        text: chunks.join(''),
      }

      if (!json) this.log(`[${args.agent} finished: ${response.stopReason}, session ${sessionId}]`)
      return result
    } catch (error: unknown) {
      // Errors raised by this command are already reportable; a rejection
      // from the peer is not, so give it a message before it surfaces.
      if (error instanceof Error) throw error
      this.error(`Peer agent '${args.agent}' failed: ${describePeerError(error)}`)
    } finally {
      await peer.close()
    }
  }

  /**
   * Resume the given peer session, or start a fresh one. Resuming needs the
   * peer to advertise the `loadSession` capability.
   */
  private async openSession(
    peer: AcpPeer,
    init: {agentCapabilities?: {loadSession?: boolean}},
    sessionId?: string,
  ): Promise<string> {
    if (!sessionId) return peer.newSession()

    if (!init.agentCapabilities?.loadSession) {
      this.error('Peer agent does not support resuming sessions (no loadSession capability).')
    }

    await peer.loadSession(sessionId)
    return sessionId
  }

  private parseEnv(entries?: string[]): Record<string, string> | undefined {
    if (!entries || entries.length === 0) return undefined

    const env: Record<string, string> = {}
    for (const entry of entries) {
      const sep = entry.indexOf('=')
      if (sep === -1) {
        this.error(`Invalid env format '${entry}'. Expected KEY=value.`)
      }

      env[entry.slice(0, sep)] = entry.slice(sep + 1)
    }

    return env
  }

  /**
   * Resolve the peer agent from an inline `--command` or, failing that, from
   * the saved registry.
   */
  private async resolveAgent(
    name: string,
    flags: {arg?: string[]; command?: string; cwd?: string; env?: string[]},
  ): Promise<AcpAgentEntry> {
    const env = this.parseEnv(flags.env)

    if (flags.command) {
      return {args: flags.arg ?? [], command: flags.command, cwd: flags.cwd, env}
    }

    const entry = await readAcpAgent(this.config.configDir, name)
    if (!entry) {
      const agents = await readAcpAgents(this.config.configDir)
      const known = Object.keys(agents ?? {})
      this.error(
        `ACP agent '${name}' is not registered. ${
          known.length > 0 ? `Known agents: ${known.join(', ')}.` : `Add one with '${this.config.bin} acp add'.`
        }`,
      )
    }

    return {...entry, env: {...entry.env, ...env}}
  }
}
