import {Args, Command, Flags} from '@oclif/core'

import {tagAgentSession} from '../../../agent/session-api.js'

export default class SessionTag extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID)', required: true}),
    tag: Args.string({description: 'Tag to set (omit with --clear to remove the tag)', required: false}),
  }
  static override description = 'Set or clear a tag on a session'
  static override examples = [
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 auth-work',
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 --clear',
  ]
  static override flags = {
    clear: Flags.boolean({description: 'Remove the tag from the session', required: false}),
    dir: Flags.string({description: 'Project directory the session belongs to', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionTag)

    if (flags.clear && args.tag) {
      this.error('Provide either a tag or --clear, not both.')
    }

    if (!flags.clear && !args.tag) {
      this.error('Provide a tag to set, or --clear to remove the existing tag.')
    }

    const tag = flags.clear ? null : (args.tag as string)
    const result = await tagAgentSession(args.sessionId, tag, flags.dir)
    if (!result.success) {
      this.error(String(result.error))
    }

    this.log(tag ? `Tagged session '${args.sessionId}' with '${tag}'.` : `Cleared tag on session '${args.sessionId}'.`)
  }
}
