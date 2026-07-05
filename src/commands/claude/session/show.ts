import {Args, Command, Flags} from '@oclif/core'

import {getAgentSessionInfo, getAgentSessionMessages} from '../../../agent/session-api.js'

export default class SessionShow extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID)', required: true}),
  }
  static override description = 'Show metadata (and optionally messages) for a session'
  static override examples = [
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345',
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 --messages',
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 --messages --limit 20',
  ]
  static override flags = {
    dir: Flags.string({description: 'Project directory the session belongs to', required: false}),
    limit: Flags.integer({description: 'Maximum number of messages to return (with --messages)', required: false}),
    messages: Flags.boolean({description: 'Include the session conversation messages', required: false}),
    offset: Flags.integer({description: 'Number of messages to skip (with --messages)', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionShow)

    const info = await getAgentSessionInfo(args.sessionId, flags.dir)
    if (!info.success) {
      this.error(String(info.error))
    }

    let result = info
    if (flags.messages) {
      const messages = await getAgentSessionMessages(args.sessionId, {
        dir: flags.dir,
        limit: flags.limit,
        offset: flags.offset,
      })
      if (!messages.success) {
        this.error(String(messages.error))
      }

      result = {
        data: {...(info.data as object), ...(messages.data as object)},
        success: true,
      }
    }

    this.logJson(result)
  }
}
