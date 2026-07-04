import {formatAsToon} from '@hesed/plugin-lib'
import {Args, Command, Flags} from '@oclif/core'

import {ask, clearClients} from '../../../agent/agent-client.js'
import {loadAgentConfig} from '../../../agent/profile-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class SessionResume extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID) to resume', required: true}),
    prompt: Args.string({description: 'Follow-up prompt to send to the resumed session', required: true}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Resume a session with a follow-up prompt'
  static override examples = [
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 "Now implement the refactoring you suggested"',
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 "Try OAuth2 instead" --fork',
  ]
  static override flags = {
    'allow-tools': Flags.string({
      description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
      required: false,
    }),
    fork: Flags.boolean({
      description: 'Fork into a new session instead of appending to the original',
      required: false,
    }),
    model: Flags.string({char: 'm', description: 'Model to use (e.g. claude-opus-4-7)', required: false}),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    stream: Flags.boolean({description: 'Stream assistant text as it arrives', required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionResume)
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    const allowedTools = flags['allow-tools']
      ? flags['allow-tools']
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    const model = flags.model
      ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model)
      : config.models?.sonnet

    const result = await ask(config, args.prompt, {
      allowedTools,
      cwd: process.cwd(),
      forkSession: flags.fork,
      model,
      onText: flags.stream ? (text) => this.log(text) : undefined,
      onToolUse: flags.stream ? (name) => this.log(`[tool: ${name}]`) : undefined,
      resume: args.sessionId,
    })
    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
