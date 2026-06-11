import {type ListCategory, ListCommand} from '../../../list-command.js'

export default class AgentListCommands extends ListCommand {
  static override args = {}
  static override description = 'List slash commands the agent can use'
  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --toon']
  static override flags = {}
  protected override readonly category: ListCategory = 'commands'
}
