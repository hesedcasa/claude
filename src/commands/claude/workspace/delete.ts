import {Command, Flags} from '@oclif/core'

import {deleteRepoFromWorkspace, deleteWorkspace, getDefaultWorkspace} from '../../../workspaceConfig.js'

export default class AgentWorkspaceDelete extends Command {
  static override args = {}
  static override description = 'Delete a workspace or remove a repo from a workspace'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %> --workspace proj01',
    '<%= config.bin %> <%= command.id %> --workspace proj01 --repo repo01',
    '<%= config.bin %> <%= command.id %> --repo repo01',
  ]
  static override flags = {
    repo: Flags.string({description: 'Repo name to remove from the workspace', required: false}),
    workspace: Flags.string({char: 'w', description: 'Workspace name', required: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentWorkspaceDelete)

    if (!flags.workspace && !flags.repo) {
      this.error('Provide --workspace to delete a workspace, or --repo (with optional --workspace) to remove a repo.')
    }

    if (flags.repo) {
      const workspaceName = flags.workspace ?? (await getDefaultWorkspace(this.config.configDir))
      if (!workspaceName) {
        this.error('No default workspace set. Use --workspace to specify one.')
      }

      await deleteRepoFromWorkspace(this.config.configDir, workspaceName, flags.repo, this.log.bind(this))
      return
    }

    await deleteWorkspace(this.config.configDir, flags.workspace!, this.log.bind(this))
  }
}
