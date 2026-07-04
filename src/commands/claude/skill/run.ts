import {Args} from '@oclif/core'

import type {AgentConfig, ApiResult, AskOptions} from '../../../agent/agent-api.js'

import {runSkill} from '../../../agent/agent-client.js'
import {RunCommand} from '../../../run-command.js'

/* eslint-disable perfectionist/sort-objects */
export default class SkillRun extends RunCommand {
  static override args = {
    name: Args.string({description: 'Skill name (e.g. review)', required: true}),
    input: Args.string({description: 'Additional input to forward to the skill', required: false}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Execute a skill by name'
  static override examples = [
    '<%= config.bin %> <%= command.id %> review "this branch"',
    '<%= config.bin %> <%= command.id %> init --stream',
    '<%= config.bin %> <%= command.id %> review "this repo" --workspace proj01',
  ]
  static override flags = {}

  protected invoke(
    config: AgentConfig,
    name: string,
    input: string | undefined,
    options: AskOptions,
  ): Promise<ApiResult> {
    return runSkill(config, name, input, options)
  }
}
