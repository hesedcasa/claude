import {formatAsToon} from '@hesed/plugin-lib'
import {Command, Flags} from '@oclif/core'

import {listAgentSessions} from '../../../agent/session-api.js'

export default class SessionList extends Command {
  static override description = 'List persisted agent sessions'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --all',
    '<%= config.bin %> <%= command.id %> --dir ~/code/repo-a --limit 10',
    '<%= config.bin %> <%= command.id %> --toon',
  ]
  static override flags = {
    all: Flags.boolean({
      description: 'List sessions across all projects (default: current directory)',
      required: false,
    }),
    dir: Flags.string({description: 'Project directory to list sessions for', required: false}),
    limit: Flags.integer({description: 'Maximum number of sessions to return', required: false}),
    offset: Flags.integer({description: 'Number of sessions to skip (for pagination)', required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(SessionList)

    const dir = flags.all ? undefined : (flags.dir ?? process.cwd())
    const result = await listAgentSessions({dir, limit: flags.limit, offset: flags.offset})

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
