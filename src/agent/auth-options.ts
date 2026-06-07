import {type AuthCommandOptions} from '@hesed/plugin-lib'

import {type ApiResult} from './agent-api.js'
import {clearClients, testConnection as connectToSdk} from './agent-client.js'

export interface AgentFlatAuth {
  apiKey: string
  apiUrl?: string
  haiku?: string
  opus?: string
  sonnet?: string
}

async function testConnection(auth: AgentFlatAuth): Promise<ApiResult> {
  return connectToSdk({apiKey: auth.apiKey, apiUrl: auth.apiUrl ?? ''})
}

export const authOptions: AuthCommandOptions<AgentFlatAuth> = {
  clearClients,
  configFile: 'claude-auth.json',
  fields: [
    {char: 'k', description: 'Anthropic API key', name: 'apiKey', required: true, type: 'string'},
    {
      char: 'u',
      description: 'Anthropic API base URL (blank for default)',
      name: 'apiUrl',
      required: false,
      type: 'string',
    },
    {description: 'Opus model ID override', name: 'opus', required: false, type: 'string'},
    {description: 'Sonnet model ID override', name: 'sonnet', required: false, type: 'string'},
    {description: 'Haiku model ID override', name: 'haiku', required: false, type: 'string'},
  ],
  serviceName: 'Claude Agent SDK',
  testConnection,
}
