import {ListCommand} from '../../../list-command.js'

export default class AgentList extends ListCommand {
  static override args = {}
  static override description = 'List skills, slash commands, tools, subagents, and MCP servers the agent can use'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --workspace proj01',
  ]
  static override flags = {}
}
