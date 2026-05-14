import {input} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'
import {action} from '@oclif/core/ux'
import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

import {type ApiResult, type ModelMap} from '../../../agent/agent-api.js'
import {clearClients, testConnection} from '../../../agent/agent-client.js'

export default class AgentAuthUpdate extends Command {
  static override args = {}
  static override description = 'Update existing Claude Agent SDK authentication'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --profile work',
  ]
  /* eslint-disable perfectionist/sort-objects */
  static override flags = {
    profile: Flags.string({char: 'p', description: 'Profile name to update (default: "default")', required: false}),
    key: Flags.string({char: 'k', description: 'Anthropic API key', required: !process.stdout.isTTY}),
    url: Flags.string({char: 'u', description: 'Anthropic API base URL', required: false}),
    opus: Flags.string({description: 'Opus model ID mapping (blank to clear)', required: false}),
    sonnet: Flags.string({description: 'Sonnet model ID mapping (blank to clear)', required: false}),
    haiku: Flags.string({description: 'Haiku model ID mapping (blank to clear)', required: false}),
  }
  /* eslint-enable perfectionist/sort-objects */

  public async run(): Promise<ApiResult | void> {
    const {flags} = await this.parse(AgentAuthUpdate)
    const profileName = flags.profile ?? 'default'
    const configFilePath = path.join(this.config.configDir, 'claude-config.json')

    let existing: Record<string, unknown>
    try {
      existing = await fs.readJSON(configFilePath)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.toLowerCase().includes('no such file or directory')) {
        this.log("Run 'agent auth add' instead")
      } else {
        this.log(msg)
      }

      return
    }

    const profiles = (existing.profiles ?? {}) as Record<string, Record<string, unknown>>
    const current = profiles[profileName] ?? {}
    const existingModels = (current.models ?? {}) as ModelMap

    const apiKey =
      flags.key ??
      (await input({default: current.apiKey as string, message: 'Anthropic API Key:', prefill: 'tab', required: true}))
    const apiUrl =
      flags.url ??
      (await input({
        default: (current.apiUrl as string) ?? '',
        message: 'Anthropic API base URL (optional):',
        prefill: 'tab',
        required: false,
      }))

    const models: ModelMap = {...existingModels}
    if (flags.opus !== undefined) {
      if (flags.opus) models.opus = flags.opus
      else delete models.opus
    }

    if (flags.sonnet !== undefined) {
      if (flags.sonnet) models.sonnet = flags.sonnet
      else delete models.sonnet
    }

    if (flags.haiku !== undefined) {
      if (flags.haiku) models.haiku = flags.haiku
      else delete models.haiku
    }

    action.start('Authenticating')
    const result = await testConnection({apiKey, apiUrl})
    clearClients()

    if (result.success) {
      action.stop('✓ successful')

      const updatedProfile = Object.keys(models).length > 0 ? {apiKey, apiUrl, models} : {apiKey, apiUrl}
      const updatedConfig = {
        ...existing,
        profiles: {...profiles, [profileName]: updatedProfile},
      }
      await fs.writeJSON(configFilePath, updatedConfig, {mode: 0o600, spaces: 2})

      const profileSuffix = profileName === 'default' ? '' : ` for profile '${profileName}'`
      this.log(`Agent authentication${profileSuffix} updated successfully`)
    } else {
      action.stop('✗ failed')
      this.error('Agent authentication is invalid. Please check your API key and URL.')
    }

    return result
  }
}
