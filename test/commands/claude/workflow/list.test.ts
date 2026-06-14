/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workflow:list', () => {
  let AgentWorkflowList: any
  let readWorkflowsStub: SinonStub

  beforeEach(async () => {
    readWorkflowsStub = stub()

    const imported = await esmock('../../../../src/commands/claude/workflow/list.js', {
      '../../../../src/workflow-config.js': {readWorkflows: readWorkflowsStub},
    })
    AgentWorkflowList = imported.default
  })

  it('lists workflows with their details', async () => {
    readWorkflowsStub.resolves({
      'daily-review': {prompt: 'Review all recent changes', workspace: 'proj01'},
      'weekly-summary': {prompt: 'Summarize the week', skills: ['review']},
    })

    const cmd = new AgentWorkflowList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(readWorkflowsStub.calledOnce).to.be.true
    expect(readWorkflowsStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(result.workflows).to.deep.equal([
      {name: 'daily-review', prompt: 'Review all recent changes', workspace: 'proj01'},
      {name: 'weekly-summary', prompt: 'Summarize the week', skills: ['review']},
    ])
    expect(logStub.calledWith('daily-review:\n  prompt: Review all recent changes\n  workspace: proj01')).to.be.true
    expect(logStub.calledWith('weekly-summary:\n  prompt: Summarize the week\n  skills: review')).to.be.true
  })

  it('returns an empty list when no workflows exist', async () => {
    readWorkflowsStub.resolves({})

    const cmd = new AgentWorkflowList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.workflows).to.deep.equal([])
    expect(logStub.calledWith('No workflows found.')).to.be.true
  })

  it('returns an empty list when config is missing', async () => {
    readWorkflowsStub.resolves()

    const cmd = new AgentWorkflowList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.workflows).to.deep.equal([])
    expect(logStub.calledWith('No workflows found.')).to.be.true
  })
})
