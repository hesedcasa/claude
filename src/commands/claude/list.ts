import {formatAsToon} from '@hesed/plugin-lib'
import {Command, Flags} from '@oclif/core'

import {clearClients, list} from '../../agent/agent-client.js'
import {loadAgentConfig} from '../../agent/profile-config.js'
import {commonParentDir, expandPath, readWorkspace} from '../../workspaceConfig.js'

type Filter = 'agents' | 'commands' | 'mcpServers' | 'skills' | 'tools'

const FILTERS: readonly Filter[] = ['skills', 'commands', 'tools', 'agents', 'mcpServers']

export default class AgentList extends Command {
  static override args = {}
  static override description = 'List skills, slash commands, tools, subagents, and MCP servers the agent can use'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --only skills',
    '<%= config.bin %> <%= command.id %> --only skills,commands --toon',
    '<%= config.bin %> <%= command.id %> --workspace proj01',
  ]
  static override flags = {
    only: Flags.string({
      description: `Comma-separated subset to return (${FILTERS.join('|')})`,
      required: false,
    }),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
    workspace: Flags.string({
      char: 'w',
      description: 'Workspace name (uses default workspace if omitted)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AgentList)
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    let cwd = process.cwd()
    let additionalDirectories: string[] | undefined

    const repos = await readWorkspace(this.config.configDir, this.log.bind(this), flags.workspace)
    if (repos && Object.keys(repos).length > 0) {
      const expandedDirs = Object.values(repos).map((dir) => expandPath(dir))
      cwd = commonParentDir(expandedDirs)
      additionalDirectories = expandedDirs
    }

    const result = await list(config, {additionalDirectories, cwd})
    clearClients()

    const filtered = this.applyFilter(result, flags.only)

    if (flags.toon) {
      this.log(formatAsToon(filtered))
    } else {
      this.logJson(filtered)
    }
  }

  private applyFilter(result: {data?: unknown; error?: unknown; success: boolean}, only: string | undefined): unknown {
    if (!only || !result.success || !result.data || typeof result.data !== 'object') {
      return result
    }

    const requested = only
      .split(',')
      .map((s) => s.trim())
      .filter((s): s is Filter => (FILTERS as readonly string[]).includes(s))

    if (requested.length === 0) return result

    const source = result.data as Record<string, unknown>
    const data: Record<string, unknown> = {}
    for (const key of requested) data[key] = source[key]

    return {data, success: true}
  }
}
