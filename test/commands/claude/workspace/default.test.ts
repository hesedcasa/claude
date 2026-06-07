/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workspace:default', () => {
  let AgentWorkspaceDefault: any
  let getDefaultWorkspaceStub: SinonStub
  let setDefaultWorkspaceStub: SinonStub

  beforeEach(async () => {
    getDefaultWorkspaceStub = stub()
    setDefaultWorkspaceStub = stub().resolves(true)

    const imported = await esmock('../../../../src/commands/claude/workspace/default.js', {
      '../../../../src/workspaceConfig.js': {
        getDefaultWorkspace: getDefaultWorkspaceStub,
        setDefaultWorkspace: setDefaultWorkspaceStub,
      },
    })
    AgentWorkspaceDefault = imported.default
  })

  it('sets the default workspace when --set is provided', async () => {
    const cmd = new AgentWorkspaceDefault(['--set', 'proj01'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(setDefaultWorkspaceStub.calledOnce).to.be.true
    expect(setDefaultWorkspaceStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(setDefaultWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    expect(setDefaultWorkspaceStub.firstCall.args[2]).to.be.a('function')
    expect(getDefaultWorkspaceStub.called).to.be.false
  })

  it('logs the current default workspace', async () => {
    getDefaultWorkspaceStub.resolves('proj01')

    const cmd = new AgentWorkspaceDefault([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith('proj01')).to.be.true
  })

  it('logs when no default workspace is set', async () => {
    getDefaultWorkspaceStub.resolves()

    const cmd = new AgentWorkspaceDefault([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith('No default workspace set')).to.be.true
  })
})
