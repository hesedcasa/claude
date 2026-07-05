import {Args, Command} from '@oclif/core'

import {extractPlaceholders, readPrompts, resolvePrompt} from '../../../prompts-config.js'

export default class PromptShow extends Command {
  static override args = {
    name: Args.string({description: 'Prompt name', required: true}),
  }
  static override description = 'View a saved prompt'
  static override examples = ['<%= config.bin %> <%= command.id %> summarize']

  public async run(): Promise<void> {
    const {args} = await this.parse(PromptShow)
    const prompts = await readPrompts(this.config)
    const [name, prompt] = resolvePrompt(prompts, args.name)
    const placeholders = [
      ...new Set([...(prompt.system ? extractPlaceholders(prompt.system) : []), ...extractPlaceholders(prompt.body)]),
    ]
    const result = {name, ...prompt, ...(placeholders.length > 0 && {placeholders})}
    this.logJson(result)
  }
}
