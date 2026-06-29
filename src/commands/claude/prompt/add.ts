import {Args, Command, Flags} from '@oclif/core'

import {readPrompts, savePrompts} from '../../../prompts-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class PromptAdd extends Command {
  static override args = {
    // Order is positional: `claude prompt add <name> <body>`.
    name: Args.string({description: 'Prompt name', required: true}),
    body: Args.string({description: 'Prompt text to save', required: true}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Create or overwrite a saved prompt'
  static override examples = [
    '<%= config.bin %> <%= command.id %> summarize "Inspect the project and summarize the architecture"',
    '<%= config.bin %> <%= command.id %> review "Review the changes on this branch" --description "Branch review"',
    '<%= config.bin %> <%= command.id %> reviewer "Review this PR" --system "You are a meticulous senior reviewer"',
  ]
  static override flags = {
    description: Flags.string({char: 'd', description: 'Short prompt description'}),
    system: Flags.string({char: 's', description: 'System prompt applied when the prompt runs'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptAdd)
    const prompts = await readPrompts(this.config)
    prompts[args.name] = {body: args.body, description: flags.description, system: flags.system}
    await savePrompts(this.config, prompts)
    this.log(`Prompt '${args.name}' saved`)
  }
}
