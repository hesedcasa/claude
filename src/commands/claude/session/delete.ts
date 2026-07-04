import {confirm} from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {deleteAgentSession, getAgentSessionInfo} from '../../../agent/session-api.js'

export default class SessionDelete extends Command {
  static override args = {
    sessionId: Args.string({description: 'Session ID (UUID)', required: true}),
  }
  static override description = 'Delete a session transcript'
  static override examples = [
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345',
    '<%= config.bin %> <%= command.id %> 4f8b6f2a-1234-4c56-8d90-abcdef012345 --force',
  ]
  static override flags = {
    dir: Flags.string({description: 'Project directory the session belongs to', required: false}),
    force: Flags.boolean({char: 'f', description: 'Skip the confirmation prompt'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(SessionDelete)

    const info = await getAgentSessionInfo(args.sessionId, flags.dir)
    if (!info.success) {
      this.error(String(info.error))
    }

    // Confirm before deleting. Only ask in a TTY (scripted/piped use can't answer)
    // and skip entirely with --force.
    if (!flags.force && process.stdout.isTTY) {
      const {summary} = info.data as {summary?: string}
      const shortSummary = summary && summary.length > 60 ? `${summary.slice(0, 60)}…` : summary
      const label = shortSummary ? `'${args.sessionId}' (${shortSummary})` : `'${args.sessionId}'`
      const confirmed = await confirm({default: false, message: `Delete session ${label}?`})
      if (!confirmed) {
        this.log('Aborted')
        return
      }
    }

    const result = await deleteAgentSession(args.sessionId, flags.dir)
    if (!result.success) {
      this.error(String(result.error))
    }

    this.log(`Deleted session '${args.sessionId}'.`)
  }
}
