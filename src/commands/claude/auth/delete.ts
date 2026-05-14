import {Command, Flags} from '@oclif/core'

import {deleteProfile} from '../../../config.js'

export default class AgentAuthDelete extends Command {
  static override args = {}
  static override description = 'Delete an authentication profile'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %> --profile work',
    '<%= config.bin %> <%= command.id %> --profile default',
  ]
  static override flags = {
    profile: Flags.string({char: 'p', description: 'Profile name to delete', required: true}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentAuthDelete)
    await deleteProfile(this.config.configDir, flags.profile, this.log.bind(this))
  }
}
