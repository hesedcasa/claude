import {Command} from '@oclif/core'

import {readPrompts} from '../../../prompts-config.js'

export default class PromptList extends Command {
  static override description = 'List saved prompts'
  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const prompts = await readPrompts(this.config)
    const rows = Object.entries(prompts).map(([name, prompt]) => ({
      description: prompt.description ?? prompt.body.replaceAll(/\s+/g, ' ').trim(),
      name,
    }))

    this.logJson(rows)
  }
}
