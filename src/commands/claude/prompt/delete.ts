import {confirm} from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {readPrompts, resolvePrompt, savePrompts} from '../../../prompts-config.js'

export default class PromptDelete extends Command {
  static override aliases = ['claude prompt rm']
  static override args = {
    name: Args.string({description: 'Prompt name', required: true}),
  }
  static override description = 'Delete a saved prompt'
  static override examples = [
    '<%= config.bin %> <%= command.id %> summarize',
    '<%= config.bin %> <%= command.id %> summarize --force',
  ]
  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Skip the confirmation prompt'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptDelete)
    const prompts = await readPrompts(this.config)
    const [name] = resolvePrompt(prompts, args.name)

    // Confirm before deleting. Only ask in a TTY (scripted/piped use can't answer)
    // and skip entirely with --force.
    if (!flags.force && process.stdout.isTTY) {
      const confirmed = await confirm({default: false, message: `Delete prompt '${name}'?`})
      if (!confirmed) {
        this.log('Aborted')
        return
      }
    }

    delete prompts[name]
    await savePrompts(this.config, prompts)
    this.log(`Prompt '${name}' deleted`)
  }
}
