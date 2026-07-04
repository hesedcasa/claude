/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:show', () => {
  let SessionShow: any
  let getAgentSessionInfoStub: SinonStub
  let getAgentSessionMessagesStub: SinonStub

  const mockInfo = {data: {sessionId: 'sess-1', summary: 'Analyze auth'}, success: true}
  const mockMessages = {data: {messages: [{type: 'user', uuid: 'u1'}]}, success: true}

  beforeEach(async () => {
    getAgentSessionInfoStub = stub().resolves(mockInfo)
    getAgentSessionMessagesStub = stub().resolves(mockMessages)

    const imported = await esmock('../../../../src/commands/claude/session/show.js', {
      '../../../../src/agent/session-api.js': {
        getAgentSessionInfo: getAgentSessionInfoStub,
        getAgentSessionMessages: getAgentSessionMessagesStub,
      },
    })
    SessionShow = imported.default
  })

  it('shows session metadata', async () => {
    const cmd = new SessionShow(['sess-1'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(getAgentSessionInfoStub.firstCall.args[0]).to.equal('sess-1')
    expect(getAgentSessionMessagesStub.called).to.be.false
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockInfo)
  })

  it('merges messages into the output with --messages', async () => {
    const cmd = new SessionShow(['sess-1', '--messages', '--limit', '20'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(getAgentSessionMessagesStub.firstCall.args[0]).to.equal('sess-1')
    expect(getAgentSessionMessagesStub.firstCall.args[1].limit).to.equal(20)
    expect(logJsonStub.firstCall.args[0]).to.deep.equal({
      data: {messages: [{type: 'user', uuid: 'u1'}], sessionId: 'sess-1', summary: 'Analyze auth'},
      success: true,
    })
  })

  it('errors when the session is not found', async () => {
    getAgentSessionInfoStub.resolves({error: "Session 'missing' not found", success: false})

    const cmd = new SessionShow(['missing'], {
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
    expect(getAgentSessionMessagesStub.called).to.be.false
  })
})
