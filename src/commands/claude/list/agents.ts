import {type ListCategory, ListCommand} from '../../../list-command.js'

export default class AgentListAgents extends ListCommand {
  static override args = {}
  static override description = 'List subagents the agent can use'
  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --toon']
  static override flags = {}
  protected override readonly category: ListCategory = 'agents'
}
