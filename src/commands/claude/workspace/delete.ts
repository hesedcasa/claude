import {input} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import {deleteWorkspace, readWorkspace} from '../../../workspace-config.js'

export default class AgentWorkspaceDelete extends Command {
  static override args = {}
  static override description = 'Delete a workspace or remove a repo from a workspace'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %> --workspace proj01']
  static override flags = {
    repo: Flags.string({description: 'Repo name to remove from the workspace', required: !process.stdout.isTTY}),
    workspace: Flags.string({char: 'w', description: 'Workspace name', required: !process.stdout.isTTY}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentWorkspaceDelete)

    const workspace = flags.workspace ?? (await input({default: 'default', message: 'Workspace name:', required: true}))
    const current = await readWorkspace(this.config.configDir, workspace)

    if (!current) {
      this.error(`Workspace '${workspace}' does not exist.`)
    }

    await deleteWorkspace(this.config.configDir, workspace, this.log.bind(this))
  }
}
