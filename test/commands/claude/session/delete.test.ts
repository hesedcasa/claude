/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:delete', () => {
  let SessionDelete: any
  let deleteAgentSessionStub: SinonStub
  let getAgentSessionInfoStub: SinonStub

  beforeEach(async () => {
    deleteAgentSessionStub = stub().resolves({data: {sessionId: 'sess-1'}, success: true})
    getAgentSessionInfoStub = stub().resolves({data: {sessionId: 'sess-1', summary: 'Analyze auth'}, success: true})

    const imported = await esmock('../../../../src/commands/claude/session/delete.js', {
      '../../../../src/agent/session-api.js': {
        deleteAgentSession: deleteAgentSessionStub,
        getAgentSessionInfo: getAgentSessionInfoStub,
      },
    })
    SessionDelete = imported.default
  })

  it('deletes an existing session', async () => {
    const cmd = new SessionDelete(['sess-1'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(deleteAgentSessionStub.firstCall.args[0]).to.equal('sess-1')
    expect(logStub.calledWith("Deleted session 'sess-1'.")).to.be.true
  })

  it('errors without deleting when the session is not found', async () => {
    getAgentSessionInfoStub.resolves({error: "Session 'missing' not found", success: false})

    const cmd = new SessionDelete(['missing'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)

    let errored = false
    try {
      await cmd.run()
    } catch {
      errored = true
    }

    expect(errored).to.be.true
    expect(deleteAgentSessionStub.called).to.be.false
  })
})
