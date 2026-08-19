import {Command, Flags} from '@oclif/core'

import {serveAcpOverStdio} from '../../../acp/acp-serve.js'
import {loadAgentConfig} from '../../../agent/profile-config.js'

/**
 * stdout is the protocol channel for `acp serve`; anything written there
 * that isn't JSON-RPC would corrupt the stream, so messages go to stderr.
 */
function logToStderr(message: string): void {
  process.stderr.write(`${message}\n`)
}

/**
 * Expose this CLI as an ACP agent. Anything that speaks the Agent Client
 * Protocol — a code editor, or another AI agent acting as an ACP client —
 * can drive the Claude agent through this command's stdio.
 */
export default class AcpServe extends Command {
  static override args = {}
  static override description = 'Serve the Claude agent over the Agent Client Protocol (ACP) on stdio'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --profile work --model opus',
    '<%= config.bin %> <%= command.id %> --allow-tools Read,Glob,Grep',
  ]
  static override flags = {
    'allow-tools': Flags.string({
      description: 'Comma-separated list of tools the agent may use (default: all available)',
      required: false,
    }),
    model: Flags.string({char: 'm', description: 'Model to use (e.g. opus, or a full model ID)', required: false}),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    system: Flags.string({description: 'Custom system prompt for the agent', required: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AcpServe)

    const config = await loadAgentConfig(this.config, logToStderr, flags.profile)
    if (!config) {
      this.error('No authentication profile available. Run `claude auth add` first.')
    }

    const allowedTools = flags['allow-tools']
      ?.split(',')
      .map((tool) => tool.trim())
      .filter(Boolean)

    const model = flags.model
      ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model)
      : config.models?.sonnet

    logToStderr('ACP agent listening on stdio')

    await serveAcpOverStdio({
      allowedTools: allowedTools && allowedTools.length > 0 ? allowedTools : undefined,
      config,
      model,
      systemPrompt: flags.system,
    })
  }
}
