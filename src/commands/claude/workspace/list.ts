import {Command} from '@oclif/core'

import {getDefaultWorkspace, readWorkspaces, type WorkspaceMode, type Workspaces} from '../../../workspace-config.js'

interface WorkspaceInfo {
  default?: boolean
  mode: WorkspaceMode
  name: string
  repos: Record<string, string>
}

interface ListResult {
  workspaces: WorkspaceInfo[]
}

export default class AgentWorkspaceList extends Command {
  static override args = {}
  static override description = 'List workspaces'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {}

  public async run(): Promise<ListResult> {
    await this.parse(AgentWorkspaceList)
    const workspaces: undefined | Workspaces = await readWorkspaces(this.config.configDir)

    if (!workspaces || Object.keys(workspaces).length === 0) {
      this.log("No workspaces found. Run 'claude workspace add' to create one.")
      return {workspaces: []}
    }

    const defaultWorkspace = await getDefaultWorkspace(this.config.configDir)
    const workspaceList: WorkspaceInfo[] = Object.entries(workspaces).map(([name, entry]) => ({
      ...(name === defaultWorkspace && {default: true}),
      mode: entry.mode,
      name,
      repos: entry.repos,
    }))

    for (const ws of workspaceList) {
      const repoLines = Object.entries(ws.repos)
        .map(([n, p]) => `  ${n}: ${p}`)
        .join('\n')
      this.log(`${ws.name}${ws.default ? ' (default)' : ''} [${ws.mode}]:\n${repoLines}`)
    }

    return {workspaces: workspaceList}
  }
}
