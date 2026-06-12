import {Command, Flags} from '@oclif/core'

import {getDefaultWorkspace, setDefaultWorkspace} from '../../../workspace-config.js'

export default class AgentWorkspaceDefault extends Command {
  static override args = {}
  static override description = 'Set or show the default workspace'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --set proj01']
  static override flags = {
    set: Flags.string({description: 'Workspace name to set as default', required: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentWorkspaceDefault)

    if (flags.set) {
      await setDefaultWorkspace(this.config.configDir, flags.set, this.log.bind(this))
      return
    }

    const current = await getDefaultWorkspace(this.config.configDir)
    if (current) {
      this.log(current)
    } else {
      this.log('No default workspace set')
    }
  }
}
