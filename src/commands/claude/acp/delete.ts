import {confirm} from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {deleteAcpAgent} from '../../../acp/acp-config.js'

export default class AcpDelete extends Command {
  static override aliases = ['claude acp rm']
  static override args = {
    name: Args.string({description: 'Registered ACP agent name', required: true}),
  }
  static override description = 'Delete a registered peer ACP agent'
  static override examples = [
    '<%= config.bin %> <%= command.id %> gemini',
    '<%= config.bin %> <%= command.id %> gemini --force',
  ]
  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Skip the confirmation prompt'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AcpDelete)

    // Only ask in a TTY (scripted use can't answer) and skip entirely with --force.
    if (!flags.force && process.stdout.isTTY) {
      const confirmed = await confirm({default: false, message: `Delete ACP agent '${args.name}'?`})
      if (!confirmed) {
        this.log('Aborted')
        return
      }
    }

    await deleteAcpAgent(this.config.configDir, args.name, this.log.bind(this))
  }
}
