import {Args, Command, Flags} from '@oclif/core'

import {deleteAgentSession, getAgentSessionInfo} from '../../../agent/session-api.js'

export default class SessionDelete extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID)', required: true}),
  }
  static override description = 'Delete a session transcript'
  static override examples = ['<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345']
  static override flags = {
    dir: Flags.string({description: 'Project directory the session belongs to', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionDelete)

    const info = await getAgentSessionInfo(args.sessionId, flags.dir)
    if (!info.success) {
      this.error(String(info.error))
    }

    const result = await deleteAgentSession(args.sessionId, flags.dir)
    if (!result.success) {
      this.error(String(result.error))
    }

    this.log(`Deleted session '${args.sessionId}'.`)
  }
}
