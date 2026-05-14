import {input} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'
import {action} from '@oclif/core/ux'
import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

import {type ApiResult, type ModelMap} from '../../../agent/agent-api.js'
import {clearClients, testConnection} from '../../../agent/agent-client.js'

export default class AgentAuthAdd extends Command {
  static override args = {}
  static override description = 'Add Claude Agent SDK authentication'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --profile work',
  ]
  /* eslint-disable perfectionist/sort-objects */
  static override flags = {
    profile: Flags.string({char: 'p', description: 'Profile name:', required: !process.stdout.isTTY}),
    key: Flags.string({char: 'k', description: 'Anthropic API key', required: !process.stdout.isTTY}),
    url: Flags.string({
      char: 'u',
      description: 'Anthropic API base URL (blank for default)',
      required: !process.stdout.isTTY,
    }),
    opus: Flags.string({description: 'Opus model ID mapping (blank for default)', required: false}),
    sonnet: Flags.string({description: 'Sonnet model ID mapping (blank for default)', required: false}),
    haiku: Flags.string({description: 'Haiku model ID mapping (blank for default)', required: false}),
  }
  /* eslint-enable perfectionist/sort-objects */

  public async run(): Promise<ApiResult> {
    const {flags} = await this.parse(AgentAuthAdd)
    const profileName =
      flags.profile ?? (await input({default: 'default', message: 'Profile name:', required: process.stdout.isTTY}))
    const apiKey = flags.key ?? (await input({message: 'Anthropic API Key:', required: process.stdout.isTTY}))

    if (!apiKey.trim()) {
      this.error('API key is required.')
    }

    const apiUrl =
      flags.url ?? (await input({default: '', message: 'Anthropic API base URL (optional):', required: false}))

    const configFilePath = path.join(this.config.configDir, 'claude-config.json')

    let existing: Record<string, unknown> = {}
    try {
      existing = await fs.readJSON(configFilePath)
    } catch {
      // file doesn't exist yet
    }

    const profiles = (existing.profiles ?? {}) as Record<string, unknown>

    if (profileName in profiles) {
      this.error(`Profile '${profileName}' already exists. Use 'agent auth update' to modify it.`)
    }

    const models: ModelMap = {}
    if (flags.opus) models.opus = flags.opus
    if (flags.sonnet) models.sonnet = flags.sonnet
    if (flags.haiku) models.haiku = flags.haiku

    action.start('Authenticating')
    const result = await testConnection({apiKey, apiUrl})
    clearClients()

    if (result.success) {
      action.stop('✓ successful')

      const isFirstProfile = Object.keys(profiles).length === 0
      profiles[profileName] = Object.keys(models).length > 0 ? {apiKey, apiUrl, models} : {apiKey, apiUrl}
      const defaultProfile = isFirstProfile ? profileName : existing.defaultProfile
      await fs.outputJSON(configFilePath, {...existing, defaultProfile, profiles}, {mode: 0o600, spaces: 2})

      const profileSuffix = profileName === 'default' ? '' : ` as profile '${profileName}'`
      this.log(`Agent authentication added${profileSuffix} successfully`)
    } else {
      action.stop('✗ failed')
      this.error('Agent authentication is invalid. Please check your API key and URL.')
    }

    return result
  }
}
