/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:command:run', () => {
  let CommandRun: any
  let loadAgentConfigStub: SinonStub
  let runCommandStub: SinonStub
  let clearClientsStub: SinonStub
  let formatAsToonStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockResult = {data: {result: 'done', toolsUsed: []}, success: true}

  const commandOptions = {
    configDir: '/tmp/test-agent-config',
    root: process.cwd(),
    runHook: stub().resolves({failures: [], successes: []}),
  }

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    runCommandStub = stub().resolves(mockResult)
    clearClientsStub = stub()
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock(
      '../../../../src/commands/claude/command/run.js',
      {},
      {
        '../../../../src/agent/agent-client.js': {clearClients: clearClientsStub, runCommand: runCommandStub},
        '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
        '../../../../src/workspace-config.js': {readWorkspace: stub().resolves()},
        '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
      },
    )
    CommandRun = imported.default
  })

  it('forwards the command name and input to runCommand and outputs JSON', async () => {
    const cmd = new CommandRun(['review', 'this branch'], commandOptions as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(runCommandStub.calledOnce).to.be.true
    expect(runCommandStub.firstCall.args[1]).to.equal('review')
    expect(runCommandStub.firstCall.args[2]).to.equal('this branch')
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('accepts a slash-prefixed name', async () => {
    const cmd = new CommandRun(['/help'], commandOptions as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(runCommandStub.firstCall.args[1]).to.equal('/help')
    expect(runCommandStub.firstCall.args[2] === undefined).to.be.true
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new CommandRun(['help'], commandOptions as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(runCommandStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon is used', async () => {
    const cmd = new CommandRun(['help', '--toon'], commandOptions as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
