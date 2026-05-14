import {Command, Flags} from '@oclif/core'
import {action} from '@oclif/core/ux'

import {type ApiResult} from '../../../agent/agent-api.js'
import {clearClients, testConnection} from '../../../agent/agent-client.js'
import {readAgentConfig} from '../../../config.js'

export default class AgentAuthTest extends Command {
  static override args = {}
  static override description = 'Test Claude Agent SDK authentication and connection'
  static override enableJsonFlag = true
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --profile work',
  ]
  static override flags = {
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
  }

  public async run(): Promise<ApiResult> {
    const {flags} = await this.parse(AgentAuthTest)
    const config = await readAgentConfig(this.config.configDir, this.log.bind(this), flags.profile)
    if (!config) {
      return {
        error: 'Missing agent authentication config',
        success: false,
      }
    }

    action.start('Authenticating connection')
    const result = await testConnection(config)
    clearClients()

    if (result.success) {
      action.stop('✓ successful')
      this.log('Successful connection to AI provider')
    } else {
      action.stop('✗ failed')
      this.error('Failed to connect to AI provider.')
    }

    return result
  }
}
