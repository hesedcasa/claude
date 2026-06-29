import {formatAsToon} from '@hesed/plugin-lib'
import {Command, Flags} from '@oclif/core'

import {readPrompts} from '../../../prompts-config.js'

export default class PromptList extends Command {
  static override description = 'List saved prompts'
  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --toon']
  static override flags = {
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(PromptList)
    const prompts = await readPrompts(this.config)
    const rows = Object.entries(prompts).map(([name, prompt]) => ({
      description: prompt.description ?? prompt.body.replaceAll(/\s+/g, ' ').trim(),
      name,
    }))

    if (flags.toon) {
      this.log(formatAsToon(rows))
    } else {
      this.logJson(rows)
    }
  }
}
