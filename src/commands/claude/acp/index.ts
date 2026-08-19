import {Command} from '@oclif/core'

import {type AcpAgentEntry, type AcpAgents, readAcpAgents} from '../../../acp/acp-config.js'

interface AcpAgentInfo extends AcpAgentEntry {
  name: string
}

interface ListResult {
  agents: AcpAgentInfo[]
}

/**
 * `claude acp` lists the peer ACP agents this CLI can talk to.
 */
export default class AcpList extends Command {
  static override args = {}
  static override description = 'List registered peer ACP agents'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {}

  public async run(): Promise<ListResult> {
    await this.parse(AcpList)
    const agents: AcpAgents | undefined = await readAcpAgents(this.config.configDir)

    if (!agents || Object.keys(agents).length === 0) {
      this.log(`No ACP agents registered. Run '${this.config.bin} acp add' to add one.`)
      return {agents: []}
    }

    const agentList: AcpAgentInfo[] = Object.entries(agents).map(([name, entry]) => ({...entry, name}))

    for (const agent of agentList) {
      const command = [agent.command, ...(agent.args ?? [])].join(' ')
      this.log(`${agent.name}: ${command}${agent.cwd ? ` (cwd: ${agent.cwd})` : ''}`)
    }

    return {agents: agentList}
  }
}
