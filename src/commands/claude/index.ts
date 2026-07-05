import {input} from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'
import {default as path} from 'node:path'
import {createInterface, type Interface} from 'node:readline'

import {type ChatTurn} from '../../agent/agent-api.js'
import {chat, clearClients} from '../../agent/agent-client.js'
import {loadAgentConfig} from '../../agent/profile-config.js'
import {formatUsageSummary} from '../../agent/usage.js'
import {buildWorkspaceContext, type WorkspaceContext} from '../../workspace-bash.js'
import {readWorkspace} from '../../workspace-config.js'

const EXIT_COMMANDS = new Set(['/exit', '/quit', 'exit', 'quit'])

export default class AgentChat extends Command {
  static override args = {
    // ignoreStdin stops the oclif parser from draining piped stdin into
    // this arg; piped lines must reach the chat loop as individual turns.
    prompt: Args.string({description: 'Optional first message to send', ignoreStdin: true, required: false}),
  }
  static override description =
    'Chat with the Claude agent in a persistent interactive session (streaming input mode)'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> "Analyze this codebase for security issues"',
    '<%= config.bin %> <%= command.id %> --workspace proj01 --repo repo01',
    '<%= config.bin %> <%= command.id %> --resume 4f8b6f2a-1234-4c56-8d90-abcdef012345',
    'echo "Explain the auth flow" | <%= config.bin %> <%= command.id %>',
  ]
  static override flags = {
    'allow-tools': Flags.string({
      description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
      required: false,
    }),
    continue: Flags.boolean({
      description: 'Continue the most recent session in the current directory',
      exclusive: ['resume'],
      required: false,
    }),
    'fork-session': Flags.boolean({
      description: 'With --resume/--continue, fork into a new session instead of appending',
      required: false,
    }),
    model: Flags.string({char: 'm', description: 'Model to use (e.g. claude-opus-4-7)', required: false}),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    repo: Flags.string({description: 'Filter workspace context to this repo name', required: false}),
    resume: Flags.string({description: 'Session ID to resume', required: false}),
    system: Flags.string({description: 'Custom system prompt for the agent', required: false}),
    workspace: Flags.string({
      char: 'w',
      description: 'Workspace name (uses current directory if omitted)',
      required: false,
    }),
  }
  private finished = false
  private stdinEnded = false
  private stdinQueue: string[] = []
  private stdinReader?: Interface
  private stdinWaiter?: () => void
  private turnDone?: () => void

  // eslint-disable-next-line complexity
  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AgentChat)
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

    const systemPrompt = [flags.system, workspaceContext?.systemPrompt].filter(Boolean).join('\n\n') || undefined

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const model = flags.model
      ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model)
      : config.models?.sonnet

    const result = await chat(config, this.prompts(args.prompt), {
      additionalDirectories: workspaceContext?.additionalDirectories,
      allowedTools,
      continueSession: flags.continue,
      cwd: workspaceContext?.cwd ?? process.cwd(),
      forkSession: flags['fork-session'],
      model,
      onText: (text) => this.log(text),
      onToolUse: (name) => this.log(`[tool: ${name}]`),
      onTurnEnd: (turn) => this.handleTurnEnd(turn),
      resume: flags.resume,
      sandboxExec: workspaceContext?.sandboxExec,
      sandboxFs: workspaceContext?.sandboxFs,
      systemPrompt,
    })

    // Release the prompt generator so it never blocks on a dead session.
    this.finished = true
    this.turnDone?.()
    this.stdinReader?.close()
    clearClients()

    if (!result.success) {
      this.error(String(result.error))
    }

    const {numTurns, sessionId} = result.data as {numTurns: number; sessionId?: string}
    if (sessionId) {
      this.log(`Session ${sessionId} ended after ${numTurns} turn(s). Resume it with: claude --resume ${sessionId}`)
    }
  }

  /**
   * Buffer piped stdin lines in an owned queue. Node's readline async
   * iterator discards lines still queued when the stream closes, which
   * loses input whenever a line arrives while a turn is in flight, so
   * the events are consumed directly instead.
   */
  private ensureStdinReader(): void {
    if (this.stdinReader) return

    this.stdinReader = createInterface({input: process.stdin})
    this.stdinReader.on('line', (line) => {
      this.stdinQueue.push(line)
      this.stdinWaiter?.()
      this.stdinWaiter = undefined
    })
    this.stdinReader.on('close', () => {
      this.stdinEnded = true
      this.stdinWaiter?.()
      this.stdinWaiter = undefined
    })
  }

  /**
   * Print the per-turn summary and resume the prompt generator so the
   * next user message is only requested after the turn has completed.
   */
  private handleTurnEnd(turn: ChatTurn): void {
    if (turn.error) this.log(turn.error)
    const summary = formatUsageSummary(turn.usage)
    if (summary) this.log(summary)
    this.turnDone?.()
    this.turnDone = undefined
  }

  /**
   * Stream of user prompts for the chat session: the optional initial
   * message followed by interactive input, one turn at a time. The
   * generator returns (ending the session) on EOF, interrupt, or an
   * exit command.
   * @yields each user prompt, then pauses until `handleTurnEnd` signals
   * the turn finished
   */
  private async *prompts(initial?: string): AsyncGenerator<string> {
    if (initial) {
      const wait = this.waitForTurn()
      yield initial
      await wait
    }

    while (!this.finished) {
      // eslint-disable-next-line no-await-in-loop
      const line = await this.readLine()
      if (line === undefined || this.finished) return

      const trimmed = line.trim()
      if (!trimmed) continue
      if (EXIT_COMMANDS.has(trimmed.toLowerCase())) return

      const wait = this.waitForTurn()
      yield trimmed
      // eslint-disable-next-line no-await-in-loop
      await wait
    }
  }

  /**
   * Read the next user message: an interactive prompt on a TTY, or the
   * next stdin line when input is piped. Returns undefined on EOF or
   * interrupt (Ctrl+C/Ctrl+D), which ends the session.
   */
  private async readLine(): Promise<string | undefined> {
    if (process.stdin.isTTY) {
      try {
        return await input({message: '>'})
      } catch {
        return undefined
      }
    }

    // A readline attached after stdin already ended (e.g. a flag consumed
    // the piped input first) never emits anything, so bail out up front.
    if (process.stdin.readableEnded && this.stdinQueue.length === 0) return undefined

    this.ensureStdinReader()

    while (this.stdinQueue.length === 0) {
      if (this.stdinEnded) return undefined
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>((resolve) => {
        this.stdinWaiter = resolve
      })
    }

    return this.stdinQueue.shift()
  }

  private waitForTurn(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.turnDone = resolve
    })
  }
}
