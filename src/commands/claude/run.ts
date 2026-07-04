import {Args} from '@oclif/core'

import type {AgentConfig, ApiResult, AskOptions} from '../../agent/agent-api.js'

import {run} from '../../agent/agent-client.js'
import {RunCommand} from '../../run-command.js'

/* eslint-disable perfectionist/sort-objects */
export default class AgentRun extends RunCommand {
  static override args = {
    name: Args.string({description: 'Slash command (e.g. /help) or skill name', required: true}),
    input: Args.string({description: 'Additional input to forward to the agent', required: false}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Execute a slash command or skill by name'
  static override examples = [
    '<%= config.bin %> <%= command.id %> /help',
    '<%= config.bin %> <%= command.id %> review "this branch"',
    '<%= config.bin %> <%= command.id %> /clear --stream',
    '<%= config.bin %> <%= command.id %> review "this repo" --workspace proj01',
  ]
  static override flags = {}

  protected invoke(
    config: AgentConfig,
    name: string,
    input: string | undefined,
    options: AskOptions,
  ): Promise<ApiResult> {
    return run(config, name, input, options)
  }
}
