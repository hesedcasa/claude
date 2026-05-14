import {Command} from '@oclif/core'

import {type ModelMap} from '../../../agent/agent-api.js'
import {getDefaultProfile, type Profiles, readProfiles} from '../../../config.js'

interface ProfileInfo {
  apiKey: string
  apiUrl: string
  default?: boolean
  models?: ModelMap
  name: string
}

interface ListResult {
  profiles: ProfileInfo[]
}

export default class AgentAuthList extends Command {
  static override args = {}
  static override description = 'List authentication profiles'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {}

  public async run(): Promise<ListResult> {
    await this.parse(AgentAuthList)
    const profiles: Profiles | undefined = await readProfiles(this.config.configDir, this.log.bind(this))

    if (!profiles || Object.keys(profiles).length === 0) {
      this.log("No authentication profiles found. Run 'agent auth add' to add one.")
      return {profiles: []}
    }

    const defaultProfile = await getDefaultProfile(this.config.configDir)
    const profileList: ProfileInfo[] = Object.entries(profiles).map(([name, auth]) => ({
      ...(name === defaultProfile && {default: true}),
      ...(auth.models && Object.keys(auth.models).length > 0 && {models: auth.models}),
      apiKey: `${auth.apiKey.slice(0, 7)}...${auth.apiKey.slice(-4)}`,
      apiUrl: auth.apiUrl || '(default)',
      name,
    }))

    for (const profile of profileList) {
      const lines = [`  url: ${profile.apiUrl}`, `  key: ${profile.apiKey}`]
      if (profile.models) {
        const modelEntries = Object.entries(profile.models).map(([tier, id]) => `    ${tier}: ${id}`)
        lines.push(`  models:\n${modelEntries.join('\n')}`)
      }

      this.log(`${profile.name}${profile.default ? ' (default):' : ':'}\n${lines.join('\n')}`)
    }

    return {profiles: profileList}
  }
}
