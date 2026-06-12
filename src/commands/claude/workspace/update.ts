import {input} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import {
  deleteRepoFromWorkspace,
  getDefaultWorkspace,
  readWorkspace,
  updateWorkspace,
  type WorkspaceMode,
  type WorkspaceRepos,
} from '../../../workspace-config.js'

export default class AgentWorkspaceUpdate extends Command {
  static override args = {}
  static override description = 'Update repositories in an existing workspace'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %> --workspace proj01 --repo repo01=/new/path --repo repo03=/path/to/repo03',
    '<%= config.bin %> <%= command.id %> --workspace proj01 --remove-repo repo02',
    '<%= config.bin %> <%= command.id %> --workspace proj01 --mode sandbox',
  ]
  static override flags = {
    mode: Flags.string({
      description: "'local' uses real repo dirs; 'sandbox' clones git URLs into a virtual bash",
      options: ['local', 'sandbox'],
    }),
    'remove-repo': Flags.string({
      description: 'Repo name to remove from the workspace (repeatable)',
      multiple: true,
    }),
    repo: Flags.string({
      description: 'Named repo entry as name=path to add/update (repeatable)',
      multiple: true,
    }),
    workspace: Flags.string({char: 'w', description: 'Workspace name'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentWorkspaceUpdate)
    const workspace =
      flags.workspace ??
      (await getDefaultWorkspace(this.config.configDir)) ??
      (process.stdout.isTTY
        ? await input({default: 'default', message: 'Workspace name:', required: true})
        : this.error('Provide --workspace or set a default workspace first.'))
    const current = await readWorkspace(this.config.configDir, workspace)

    if (!current) {
      this.error(`No workspaces found. Run '${this.config.bin} workspace add' to create one.`)
    }

    const mode = flags.mode ?? current.mode

    if (flags['remove-repo'] && flags['remove-repo'].length > 0) {
      for (const repoName of flags['remove-repo']) {
        // eslint-disable-next-line no-await-in-loop
        await deleteRepoFromWorkspace(this.config.configDir, workspace, repoName, this.log.bind(this))
      }

      if (!flags.repo || flags.repo.length === 0) return
    }

    const repos: WorkspaceRepos = {...current.repos}

    if (flags.repo && flags.repo.length > 0) {
      for (const entry of flags.repo) {
        const sep = entry.indexOf('=')
        if (sep === -1) {
          this.error(`Invalid repo format '${entry}'. Expected name=path.`)
        }

        repos[entry.slice(0, sep)] = entry.slice(sep + 1)
      }
    } else if (!flags.mode) {
      this.log(`Current repos for workspace '${workspace}':`)
      for (const [name, dir] of Object.entries(current.repos)) {
        this.log(`  ${name}: ${dir}`)
      }

      this.log('Enter repository entries to add/update (leave name blank to finish):')
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const name = await input({message: 'Repo name (blank to finish):', required: false})
        if (!name) break
        const defaultPath = current.repos[name] ?? ''
        // eslint-disable-next-line no-await-in-loop
        const dir = await input({default: defaultPath, message: `Path for '${name}':`, prefill: 'tab', required: true})
        repos[name] = dir
      }
    }

    await updateWorkspace(this.config.configDir, workspace, {mode: mode as WorkspaceMode, repos}, this.log.bind(this))
  }
}
