import {Command, Flags, ux} from '@oclif/core'

import type {ApiResult, CapabilityDetail} from './agent/agent-api.js'
import type {CapabilityEntry} from './capability-commands.js'

import {clearClients, list} from './agent/agent-client.js'
import {loadAgentConfig} from './agent/profile-config.js'
import {writeCapabilityStore} from './capability-commands.js'
import {resolveCapabilityEntries} from './capability-metadata.js'
import {isGitUrl} from './workspace-bash.js'
import {commonParentDir, expandPath, getDefaultWorkspace, readWorkspace} from './workspace-config.js'

export type ListCategory = 'agents' | 'commands' | 'mcpServers' | 'skills' | 'tools'

const CATEGORY_LABELS: Record<ListCategory, string> = {
  agents: 'Agents',
  commands: 'Commands',
  mcpServers: 'MCP Servers',
  skills: 'Skills',
  tools: 'Tools',
}

export abstract class ListCommand extends Command {
  static override baseFlags = {
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    workspace: Flags.string({
      char: 'w',
      description: 'Workspace name (uses current directory if omitted)',
      required: false,
    }),
  }
  static override enableJsonFlag = true
  protected readonly category?: ListCategory

  public async run(): Promise<void> {
    const {flags} = await this.parse()
    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    let cwd = process.cwd()
    let additionalDirectories: string[] | undefined

    const workspaceName = flags.workspace ?? (await getDefaultWorkspace(this.config.configDir))
    const workspace = await readWorkspace(this.config.configDir, workspaceName)
    const localDirs = workspace
      ? Object.values(workspace.repos)
          .filter((dir) => !isGitUrl(dir))
          .map((dir) => expandPath(dir))
      : []
    if (localDirs.length > 0) {
      cwd = commonParentDir(localDirs)
      additionalDirectories = localDirs
    }

    const spinner = Boolean(process.stderr.isTTY)
    if (spinner) ux.action.start('Fetching capabilities')

    let result: ApiResult
    try {
      result = await list(config, {additionalDirectories, cwd})
    } finally {
      if (spinner) ux.action.stop()
    }

    clearClients()

    if (!result.success || !result.data || typeof result.data !== 'object') {
      if (this.jsonEnabled()) this.logJson(result)
      else this.log(`Error: ${String(result.error ?? 'Unknown error')}`)
      return
    }

    const data = result.data as {
      agents?: string[]
      capabilities?: CapabilityDetail[]
      commands?: string[]
      mcpServers?: {name: string; status: string}[]
      plugins?: {name: string; path: string}[]
      skills?: string[]
      tools?: string[]
    }

    const merged = await this.resolveMergedEntries(data, cwd)
    if (merged) {
      try {
        await writeCapabilityStore(this.config.cacheDir, merged)
      } catch {
        // Non-fatal: a stale cache only delays dynamic command registration.
      }
    }

    const entriesByCategory = merged ?? {
      commands: (data.commands ?? []).map((name) => ({name})),
      skills: (data.skills ?? []).map((name) => ({name})),
    }

    if (this.category) {
      const entries = this.buildDisplayEntries(this.category, data, entriesByCategory)
      if (this.jsonEnabled()) this.logJson(entries)
      else this.renderEntries(entries)
      return
    }

    const grouped: Record<ListCategory, string[]> = {
      agents: this.buildDisplayEntries('agents', data, entriesByCategory),
      commands: this.buildDisplayEntries('commands', data, entriesByCategory),
      mcpServers: this.buildDisplayEntries('mcpServers', data, entriesByCategory),
      skills: this.buildDisplayEntries('skills', data, entriesByCategory),
      tools: this.buildDisplayEntries('tools', data, entriesByCategory),
    }

    if (this.jsonEnabled()) this.logJson(grouped)
    else this.renderGrouped(grouped)
  }

  private buildDisplayEntries(
    category: ListCategory,
    data: {agents?: string[]; mcpServers?: {name: string; status: string}[]; tools?: string[]},
    entriesByCategory: {commands: CapabilityEntry[]; skills: CapabilityEntry[]},
  ): string[] {
    switch (category) {
      case 'agents': {
        return data.agents ?? []
      }

      case 'commands': {
        return entriesByCategory.commands.map(({name}) => name)
      }

      case 'mcpServers': {
        return (data.mcpServers ?? []).map(({name}) => name)
      }

      case 'skills': {
        return entriesByCategory.skills.map(({name}) => name)
      }

      case 'tools': {
        return data.tools ?? []
      }
    }
  }

  private renderEntries(entries: string[]): void {
    if (entries.length === 0) {
      this.log('(none)')
      return
    }

    for (const id of entries) {
      this.log(id)
    }
  }

  private renderGrouped(grouped: Record<ListCategory, string[]>): void {
    const categories = Object.keys(CATEGORY_LABELS) as ListCategory[]
    for (const category of categories) {
      this.log(`${CATEGORY_LABELS[category]}:`)
      this.renderEntries(grouped[category])
      this.log('')
    }
  }

  /**
   * Enrich the capability names reported by the SDK init message with the
   * `description`/`argument-hint` from markdown frontmatter (covers
   * model-invoked plugin and user skills) and the SDK's supportedCommands()
   * metadata (covers user-invocable capabilities bundled inside Claude Code
   * with no file on disk). Frontmatter wins per field. Returns undefined on
   * failure so the caller can fall back to bare names without touching the
   * on-disk cache.
   */
  private async resolveMergedEntries(
    data: {
      capabilities?: CapabilityDetail[]
      commands?: string[]
      plugins?: {name: string; path: string}[]
      skills?: string[]
    },
    cwd: string,
  ): Promise<undefined | {commands: CapabilityEntry[]; skills: CapabilityEntry[]}> {
    const detailsByName = new Map((data.capabilities ?? []).map((detail) => [detail.name, detail]))

    try {
      const entries = await resolveCapabilityEntries({
        commands: data.commands ?? [],
        cwd,
        plugins: data.plugins ?? [],
        skills: data.skills ?? [],
      })

      const merge = (list: typeof entries.commands) =>
        list.map((entry) => {
          const detail = detailsByName.get(entry.name.replace(/^\//, ''))
          return {
            ...entry,
            ...(entry.argumentHint || !detail?.argumentHint ? {} : {argumentHint: detail.argumentHint}),
            ...(entry.description || !detail?.description ? {} : {description: detail.description}),
          }
        })

      return {commands: merge(entries.commands), skills: merge(entries.skills)}
    } catch {
      return undefined
    }
  }
}
