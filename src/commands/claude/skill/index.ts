import {Command} from '@oclif/core'

import {registerCapabilityCommands} from '../../../capability-commands.js'
import {renderTopicHelp} from '../../../topic-help.js'

/**
 * `claude skill` has no logic of its own to run: it's the `skill` topic's
 * index, so invoking it bare should show the same TOPICS/COMMANDS overview
 * oclif renders for any topic with children. The init hook already registers
 * dynamic capability commands once at startup, but oclif's `Command.run()`
 * reloads `Config` from scratch before instantiating this class (it treats
 * an already-loaded `Config` passed to `Config.load()` as reload input),
 * which discards that in-memory registration. Re-run it against `this.config`
 * so the topic actually has its children by the time we render it.
 */
export default class SkillList extends Command {
  static override args = {}
  static override description = 'Execute a skill by name'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {}

  public async run(): Promise<void> {
    await registerCapabilityCommands(this.config, this.id)
    await renderTopicHelp(this.config, this.id ?? '')
  }
}
