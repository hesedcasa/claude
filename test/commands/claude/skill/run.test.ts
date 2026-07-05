/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:skill:run', () => {
  let SkillRun: any
  let loadAgentConfigStub: SinonStub
  let runSkillStub: SinonStub
  let clearClientsStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockResult = {data: {result: 'done', toolsUsed: []}, success: true}

  const commandOptions = {
    configDir: '/tmp/test-agent-config',
    root: process.cwd(),
    runHook: stub().resolves({failures: [], successes: []}),
  }

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    runSkillStub = stub().resolves(mockResult)
    clearClientsStub = stub()

    const imported = await esmock(
      '../../../../src/commands/claude/skill/run.js',
      {},
      {
        '../../../../src/agent/agent-client.js': {clearClients: clearClientsStub, runSkill: runSkillStub},
        '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
        '../../../../src/workspace-config.js': {readWorkspace: stub().resolves()},
      },
    )
    SkillRun = imported.default
  })

  it('forwards the skill name and input to runSkill and outputs JSON with --json', async () => {
    const cmd = new SkillRun(['review', 'check this branch', '--json'], commandOptions as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(runSkillStub.calledOnce).to.be.true
    expect(runSkillStub.firstCall.args[1]).to.equal('review')
    expect(runSkillStub.firstCall.args[2]).to.equal('check this branch')
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('passes --allow-tools through as an array', async () => {
    const cmd = new SkillRun(['review', 'go', '--allow-tools', 'Read, Glob , Edit'], commandOptions as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = runSkillStub.firstCall.args[3]
    expect(opts.allowedTools).to.deep.equal(['Read', 'Glob', 'Edit'])
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new SkillRun(['review'], commandOptions as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(runSkillStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })
})
