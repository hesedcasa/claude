import {createProfileManager} from '@hesed/plugin-lib'
import {type Config} from '@oclif/core'

import {type AgentConfig, type ModelMap} from './agent-api.js'
import {type AgentFlatAuth, AUTH_CONFIG_FILE} from './auth-options.js'

type StoredAgentAuth = AgentFlatAuth & {models?: ModelMap}

export async function loadAgentConfig(
  config: Config,
  log: (message: string) => void,
  profile?: string,
): Promise<AgentConfig | undefined> {
  const pm = createProfileManager<StoredAgentAuth>(config, profile, AUTH_CONFIG_FILE)
  const auth = await pm.loadAuthConfig()

  if (!auth) {
    log(`Profile '${profile ?? 'default'}' not found. Run 'claude auth add' to add it.`)
    return undefined
  }

  const {apiKey, apiUrl, haiku, models: nestedModels, opus, sonnet} = auth
  const models: ModelMap = {}
  if (opus) models.opus = opus
  if (sonnet) models.sonnet = sonnet
  if (haiku) models.haiku = haiku
  if (nestedModels) Object.assign(models, nestedModels)

  return {
    apiKey,
    apiUrl: apiUrl ?? '',
    ...(Object.keys(models).length > 0 && {models}),
  }
}
