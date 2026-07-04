import {Args, Command, Flags} from '@oclif/core'

import {renameAgentSession} from '../../../agent/session-api.js'

export default class SessionRename extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID)', required: true}),
    title: Args.string({description: 'New session title', required: true}),
  }
  static override description = 'Set a custom title on a session'
  static override examples = [
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 "Auth refactor"',
  ]
  static override flags = {
    dir: Flags.string({description: 'Project directory the session belongs to', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionRename)

    const result = await renameAgentSession(args.sessionId, args.title, flags.dir)
    if (!result.success) {
      this.error(String(result.error))
    }

    this.log(`Renamed session '${args.sessionId}' to '${args.title}'.`)
  }
}
