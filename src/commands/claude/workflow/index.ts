import {Command} from '@oclif/core'

import {readWorkflows} from '../../../workflow-config.js'

interface WorkflowInfo {
  name: string
  prompt: string
  skills?: string[]
  workspace?: string
}

interface ListResult {
  workflows: WorkflowInfo[]
}

export default class AgentWorkflowList extends Command {
  static override args = {}
  static override description = 'List saved workflows'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {}

  public async run(): Promise<ListResult> {
    await this.parse(AgentWorkflowList)
    const workflows = await readWorkflows(this.config.configDir)

    if (!workflows || Object.keys(workflows).length === 0) {
      this.log('No workflows found.')
      return {workflows: []}
    }

    const workflowList: WorkflowInfo[] = Object.entries(workflows).map(([name, entry]) => ({
      name,
      prompt: entry.prompt,
      ...(entry.skills && {skills: entry.skills}),
      ...(entry.workspace && {workspace: entry.workspace}),
    }))

    for (const wf of workflowList) {
      const parts = [`  prompt: ${wf.prompt}`]
      if (wf.workspace) parts.push(`  workspace: ${wf.workspace}`)
      if (wf.skills) parts.push(`  skills: ${wf.skills.join(', ')}`)
      this.log(`${wf.name}:\n${parts.join('\n')}`)
    }

    return {workflows: workflowList}
  }
}
