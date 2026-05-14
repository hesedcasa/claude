import {input} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import {addWorkspace, type WorkspaceRepos} from '../../../config.js'

export default class AgentWorkspaceAdd extends Command {
  static override args = {}
  static override description = 'Add a workspace with named repository directories'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %> --workspace proj01 --repo repo01=/path/to/repo01 --repo repo02=/path/to/repo02',
  ]
  static override flags = {
    repo: Flags.string({
      description: 'Named repo entry as name=path (repeatable)',
      multiple: true,
      required: !process.stdout.isTTY,
    }),
    workspace: Flags.string({char: 'w', description: 'Workspace name', required: !process.stdout.isTTY}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentWorkspaceAdd)
    const workspaceName = flags.workspace ?? (await input({default: 'default', message: 'Workspace name:', required: true}))

    const repos: WorkspaceRepos = {}

    if (flags.repo && flags.repo.length > 0) {
      for (const entry of flags.repo) {
        const sep = entry.indexOf('=')
        if (sep === -1) {
          this.error(`Invalid repo format '${entry}'. Expected name=path.`)
        }

        repos[entry.slice(0, sep)] = entry.slice(sep + 1)
      }
    } else {
      this.log('Enter repository entries (leave name blank to finish):')
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const name = await input({message: 'Repo name (blank to finish):', required: false})
        if (!name) break
        // eslint-disable-next-line no-await-in-loop
        const dir = await input({message: `Path for '${name}':`, required: true})
        repos[name] = dir
      }
    }

    if (Object.keys(repos).length === 0) {
      this.error('At least one repository entry is required.')
    }

    await addWorkspace(this.config.configDir, workspaceName, repos, this.log.bind(this))
  }
}
