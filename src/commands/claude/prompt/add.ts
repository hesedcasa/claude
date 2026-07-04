import {editor, input} from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {readPrompts, savePrompts} from '../../../prompts-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class PromptAdd extends Command {
  static override args = {
    // Order is positional: `claude prompt add <name> <body>`. Optional in a TTY so
    // the command can prompt for anything missing; required otherwise.
    name: Args.string({description: 'Prompt name', required: !process.stdout.isTTY}),
    body: Args.string({description: 'Prompt text to save', required: !process.stdout.isTTY}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Create a saved prompt'
  static override examples = [
    '<%= config.bin %> <%= command.id %> summarize "Inspect the project and summarize the architecture"',
    '<%= config.bin %> <%= command.id %> review "Review the changes on this branch" --description "Branch review"',
    '<%= config.bin %> <%= command.id %> reviewer "Review this PR" --system "You are a meticulous senior reviewer"',
    '<%= config.bin %> <%= command.id %>',
  ]
  static override flags = {
    description: Flags.string({char: 'd', description: 'Short prompt description'}),
    system: Flags.string({char: 's', description: 'System prompt applied when the prompt runs'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptAdd)

    // Entering the interactive wizard whenever the positional body is missing.
    // Only then do we prompt for the optional description/system so a fully
    // positional invocation keeps its original non-interactive behaviour.
    // Body/system open an editor so multi-line prompt text is captured intact;
    // a single-line input() would truncate everything after the first newline.
    const interactive = args.body === undefined
    const name = args.name ?? (await input({message: 'Prompt name:', required: true}))

    // Refuse to clobber an existing prompt. Checked before the editor opens so the
    // user doesn't compose a body only to have the add rejected.
    const prompts = await readPrompts(this.config)
    if (prompts[name]) {
      this.error(`Prompt '${name}' already exists. Use '${this.config.bin} prompt edit' to modify it.`)
    }

    const body =
      args.body ??
      (
        await editor({
          message: 'Prompt text (opens your editor):',
          validate: (value) => value.trim().length > 0 || 'Prompt text is required.',
          waitForUserInput: false,
        })
      ).trim()
    const description =
      flags.description ??
      (interactive ? await input({message: 'Description (optional):', required: false}) : undefined)
    const system =
      flags.system ??
      (interactive
        ? (await editor({message: 'System prompt (optional, opens your editor):', waitForUserInput: false})).trim()
        : undefined)

    prompts[name] = {body, description: description || undefined, system: system || undefined}
    await savePrompts(this.config, prompts)
    this.log(`Prompt '${name}' saved`)
  }
}
