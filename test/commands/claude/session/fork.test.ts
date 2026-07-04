/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:fork', () => {
  let SessionFork: any
  let forkAgentSessionStub: SinonStub

  const mockResult = {data: {forkedSessionId: 'fork-1', sourceSessionId: 'sess-1'}, success: true}

  beforeEach(async () => {
    forkAgentSessionStub = stub().resolves(mockResult)

    const imported = await esmock('../../../../src/commands/claude/session/fork.js', {
      '../../../../src/agent/session-api.js': {forkAgentSession: forkAgentSessionStub},
    })
    SessionFork = imported.default
  })

  it('forks the session and outputs the new session id', async () => {
    const cmd = new SessionFork(['sess-1', '--title', 'OAuth2 spike'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(forkAgentSessionStub.firstCall.args[0]).to.equal('sess-1')
    expect(forkAgentSessionStub.firstCall.args[1].title).to.equal('OAuth2 spike')
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('errors when the fork fails', async () => {
    forkAgentSessionStub.resolves({error: 'cannot fork', success: false})

    const cmd = new SessionFork(['sess-1'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    let errored = false
    try {
      await cmd.run()
    } catch {
      errored = true
    }

    expect(errored).to.be.true
  })
})
