import {Args, Command, Flags} from '@oclif/core'

import {readPrompts, resolvePrompt, savePrompts} from '../../../prompts-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class PromptEdit extends Command {
  static override args = {
    // Order is positional: `claude prompt edit <name> [body]`.
    name: Args.string({description: 'Prompt name', required: true}),
    body: Args.string({description: 'Replacement prompt text'}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Edit a saved prompt'
  static override examples = [
    '<%= config.bin %> <%= command.id %> summarize "A new prompt body"',
    '<%= config.bin %> <%= command.id %> summarize --description "Updated description"',
    '<%= config.bin %> <%= command.id %> summarize --system "A new system prompt"',
  ]
  static override flags = {
    description: Flags.string({char: 'd', description: 'Replacement prompt description'}),
    system: Flags.string({char: 's', description: 'Replacement system prompt'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptEdit)
    if (args.body === undefined && flags.description === undefined && flags.system === undefined) {
      this.error('Nothing to update. Pass a new body, --system, and/or --description.')
    }

    const prompts = await readPrompts(this.config)
    const [name, prompt] = resolvePrompt(prompts, args.name)
    prompts[name] = {
      body: args.body ?? prompt.body,
      description: flags.description ?? prompt.description,
      system: flags.system ?? prompt.system,
    }
    await savePrompts(this.config, prompts)
    this.log(`Prompt '${name}' updated`)
  }
}
