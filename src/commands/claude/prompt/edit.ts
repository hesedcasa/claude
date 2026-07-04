import {confirm, editor, input} from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {readPrompts, resolvePrompt, savePrompts} from '../../../prompts-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class PromptEdit extends Command {
  static override args = {
    // Order is positional: `claude prompt edit <name> [body]`. Name is optional in
    // a TTY so the wizard can prompt for it; required otherwise.
    name: Args.string({description: 'Prompt name', required: !process.stdout.isTTY}),
    body: Args.string({description: 'Replacement prompt text'}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Edit a saved prompt'
  static override examples = [
    '<%= config.bin %> <%= command.id %> summarize "A new prompt body"',
    '<%= config.bin %> <%= command.id %> summarize --description "Updated description"',
    '<%= config.bin %> <%= command.id %> summarize --system "A new system prompt"',
    '<%= config.bin %> <%= command.id %> summarize',
  ]
  static override flags = {
    description: Flags.string({char: 'd', description: 'Replacement prompt description'}),
    force: Flags.boolean({char: 'f', description: 'Skip the confirmation prompt'}),
    system: Flags.string({char: 's', description: 'Replacement system prompt'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptEdit)

    // Enter the interactive wizard when no field to change was supplied on the
    // command line. Each editor/input is pre-filled with the current value so the
    // user tweaks in place; passing a body or any flag keeps the original
    // targeted, non-interactive update. Body/system open an editor so multi-line
    // prompt text survives intact where a single-line input() would truncate it.
    const noChangeRequested = args.body === undefined && flags.description === undefined && flags.system === undefined
    const interactive = Boolean(process.stdout.isTTY) && noChangeRequested
    if (!interactive && noChangeRequested) {
      this.error('Nothing to update. Pass a new body, --system, and/or --description.')
    }

    const prompts = await readPrompts(this.config)
    const promptName = args.name ?? (await input({message: 'Prompt name:', required: true}))
    const [name, prompt] = resolvePrompt(prompts, promptName)

    const body = interactive
      ? (
          await editor({
            default: prompt.body,
            message: 'Prompt text (opens your editor):',
            validate: (value) => value.trim().length > 0 || 'Prompt text is required.',
            waitForUserInput: false,
          })
        ).trim()
      : (args.body ?? prompt.body)
    const description = interactive
      ? (await input({default: prompt.description ?? '', message: 'Description (optional):', required: false})) ||
        undefined
      : (flags.description ?? prompt.description)
    const system = interactive
      ? (
          await editor({
            default: prompt.system ?? '',
            message: 'System prompt (optional, opens your editor):',
            waitForUserInput: false,
          })
        ).trim() || undefined
      : (flags.system ?? prompt.system)

    // Confirm before overwriting. Only ask in a TTY (scripted/piped use can't
    // answer) and skip entirely with --force.
    if (!flags.force && process.stdout.isTTY) {
      const confirmed = await confirm({default: true, message: `Save changes to prompt '${name}'?`})
      if (!confirmed) {
        this.log('Aborted')
        return
      }
    }

    prompts[name] = {body, description, system}
    await savePrompts(this.config, prompts)
    this.log(`Prompt '${name}' updated`)
  }
}
