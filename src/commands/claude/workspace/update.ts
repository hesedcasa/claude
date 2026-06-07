import {input} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import {
  deleteRepoFromWorkspace,
  getDefaultWorkspace,
  readWorkspace,
  updateWorkspace,
  type WorkspaceRepos,
} from '../../../workspaceConfig.js'

export default class AgentWorkspaceUpdate extends Command {
  static override args = {}
  static override description = 'Update repositories in an existing workspace'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %> --workspace proj01 --repo repo01=/new/path --repo repo03=/path/to/repo03',
    '<%= config.bin %> <%= command.id %> --workspace proj01 --remove-repo repo02',
  ]
  static override flags = {
    'remove-repo': Flags.string({
      description: 'Repo name to remove from the workspace (repeatable)',
      multiple: true,
      required: false,
    }),
    repo: Flags.string({
      description: 'Named repo entry as name=path to add/update (repeatable, merges into existing)',
      multiple: true,
      required: false,
    }),
    workspace: Flags.string({char: 'w', description: 'Workspace name (default: default workspace)', required: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentWorkspaceUpdate)
    const workspaceName = flags.workspace

    const resolvedName = workspaceName ?? (await getDefaultWorkspace(this.config.configDir)) ?? 'default'

    const current = await readWorkspace(this.config.configDir, this.log.bind(this), resolvedName)
    if (!current) return

    if (flags['remove-repo'] && flags['remove-repo'].length > 0) {
      for (const repoName of flags['remove-repo']) {
        // eslint-disable-next-line no-await-in-loop
        await deleteRepoFromWorkspace(this.config.configDir, resolvedName, repoName, this.log.bind(this))
      }

      if (!flags.repo || flags.repo.length === 0) return
    }

    const repos: WorkspaceRepos = {...current}

    if (flags.repo && flags.repo.length > 0) {
      for (const entry of flags.repo) {
        const sep = entry.indexOf('=')
        if (sep === -1) {
          this.error(`Invalid repo format '${entry}'. Expected name=path.`)
        }

        repos[entry.slice(0, sep)] = entry.slice(sep + 1)
      }
    } else {
      this.log(`Current repos for workspace '${resolvedName}':`)
      for (const [name, dir] of Object.entries(current)) {
        this.log(`  ${name}: ${dir}`)
      }

      this.log('Enter repository entries to add/update (leave name blank to finish):')
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const name = await input({message: 'Repo name (blank to finish):', required: false})
        if (!name) break
        const defaultPath = current[name] ?? ''
        // eslint-disable-next-line no-await-in-loop
        const dir = await input({default: defaultPath, message: `Path for '${name}':`, prefill: 'tab', required: true})
        repos[name] = dir
      }
    }

    await updateWorkspace(this.config.configDir, resolvedName, repos, this.log.bind(this))
  }
}
