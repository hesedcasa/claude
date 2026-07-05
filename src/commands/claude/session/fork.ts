import {Args, Command, Flags} from '@oclif/core'

import {forkAgentSession} from '../../../agent/session-api.js'

export default class SessionFork extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID) to fork', required: true}),
  }
  static override description = 'Fork a session into a new independent branch'
  static override examples = [
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345',
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 --title "OAuth2 spike"',
  ]
  static override flags = {
    dir: Flags.string({description: 'Project directory the session belongs to', required: false}),
    title: Flags.string({description: 'Title for the forked session', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionFork)

    const result = await forkAgentSession(args.sessionId, {dir: flags.dir, title: flags.title})
    if (!result.success) {
      this.error(String(result.error))
    }

    this.logJson(result)
  }
}
