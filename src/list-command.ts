import {formatAsToon} from '@hesed/plugin-lib'
import {Command, Flags} from '@oclif/core'

import {clearClients, list} from './agent/agent-client.js'
import {loadAgentConfig} from './agent/profile-config.js'
import {writeCapabilityStore} from './capability-commands.js'
import {isGitUrl} from './workspace-bash.js'
import {commonParentDir, expandPath, readWorkspace} from './workspace-config.js'

export type ListCategory = 'agents' | 'commands' | 'mcpServers' | 'skills' | 'tools'

export abstract class ListCommand extends Command {
  static override baseFlags = {
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
    workspace: Flags.string({
      char: 'w',
      description: 'Workspace name (uses current directory if omitted)',
      required: false,
    }),
  }
  protected readonly category?: ListCategory

  public async run(): Promise<void> {
    const {flags} = await this.parse()
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    let cwd = process.cwd()
    let additionalDirectories: string[] | undefined

    const workspace = await readWorkspace(this.config.configDir, flags.workspace)
    const localDirs = workspace
      ? Object.values(workspace.repos)
          .filter((dir) => !isGitUrl(dir))
          .map((dir) => expandPath(dir))
      : []
    if (localDirs.length > 0) {
      cwd = commonParentDir(localDirs)
      additionalDirectories = localDirs
    }

    const result = await list(config, {additionalDirectories, cwd})
    clearClients()

    await this.refreshCapabilityCache(result)

    const filtered = this.pickCategory(result)

    if (flags.toon) {
      this.log(formatAsToon(filtered))
    } else {
      this.logJson(filtered)
    }
  }

  private pickCategory(result: {data?: unknown; error?: unknown; success: boolean}): unknown {
    if (!this.category || !result.success || !result.data || typeof result.data !== 'object') {
      return result
    }

    const source = result.data as Record<string, unknown>
    return {data: {[this.category]: source[this.category]}, success: true}
  }

  /**
   * Persist the skills and slash commands to the capabilities cache so the
   * init hook can register them as first-class CLI commands on the next run.
   */
  private async refreshCapabilityCache(result: {data?: unknown; success: boolean}): Promise<void> {
    if (!result.success || !result.data || typeof result.data !== 'object') return

    const data = result.data as {commands?: string[]; skills?: string[]}
    try {
      await writeCapabilityStore(this.config.cacheDir, {commands: data.commands ?? [], skills: data.skills ?? []})
    } catch {
      // Non-fatal: a stale cache only delays dynamic command registration.
    }
  }
}
