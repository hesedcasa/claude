/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:resume', () => {
  let SessionResume: any
  let loadAgentConfigStub: SinonStub
  let askStub: SinonStub
  let clearClientsStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockResult = {data: {result: 'Refactoring applied.', sessionId: 'sess-1', toolsUsed: []}, success: true}

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    askStub = stub().resolves(mockResult)
    clearClientsStub = stub()

    const imported = await esmock('../../../../src/commands/claude/session/resume.js', {
      '../../../../src/agent/agent-client.js': {ask: askStub, clearClients: clearClientsStub},
      '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
    })
    SessionResume = imported.default
  })

  it('resumes the session with the follow-up prompt', async () => {
    const cmd = new SessionResume(['sess-1', 'Now implement the refactoring'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.calledOnce).to.be.true
    expect(askStub.firstCall.args[1]).to.equal('Now implement the refactoring')
    const opts = askStub.firstCall.args[2]
    expect(opts.resume).to.equal('sess-1')
    expect(opts.forkSession === undefined || opts.forkSession === false).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('forks the session with --fork', async () => {
    const cmd = new SessionResume(['sess-1', 'Try OAuth2 instead', '--fork'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.resume).to.equal('sess-1')
    expect(opts.forkSession).to.be.true
  })

  it('parses --allow-tools into an array', async () => {
    const cmd = new SessionResume(['sess-1', 'continue', '--allow-tools', 'Read, Edit'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.allowedTools).to.deep.equal(['Read', 'Edit'])
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new SessionResume(['sess-1', 'hi'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })
})
