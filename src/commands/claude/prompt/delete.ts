import {Args, Command} from '@oclif/core'

import {readPrompts, resolvePrompt, savePrompts} from '../../../prompts-config.js'

export default class PromptDelete extends Command {
  static override aliases = ['claude prompt rm']
  static override args = {
    name: Args.string({description: 'Prompt name', required: true}),
  }
  static override description = 'Delete a saved prompt'
  static override examples = ['<%= config.bin %> <%= command.id %> summarize']

  public async run(): Promise<void> {
    const {args} = await this.parse(PromptDelete)
    const prompts = await readPrompts(this.config)
    const [name] = resolvePrompt(prompts, args.name)
    delete prompts[name]
    await savePrompts(this.config, prompts)
    this.log(`Prompt '${name}' deleted`)
  }
}
