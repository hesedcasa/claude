/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:tag', () => {
  let SessionTag: any
  let tagAgentSessionStub: SinonStub

  beforeEach(async () => {
    tagAgentSessionStub = stub().resolves({data: {sessionId: 'sess-1', tag: 'auth-work'}, success: true})

    const imported = await esmock('../../../../src/commands/claude/session/tag.js', {
      '../../../../src/agent/session-api.js': {tagAgentSession: tagAgentSessionStub},
    })
    SessionTag = imported.default
  })

  it('sets a tag on the session', async () => {
    const cmd = new SessionTag(['sess-1', 'auth-work'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(tagAgentSessionStub.firstCall.args[0]).to.equal('sess-1')
    expect(tagAgentSessionStub.firstCall.args[1]).to.equal('auth-work')
    expect(logStub.calledWith("Tagged session 'sess-1' with 'auth-work'.")).to.be.true
  })

  it('clears the tag with --clear', async () => {
    const cmd = new SessionTag(['sess-1', '--clear'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(tagAgentSessionStub.firstCall.args[1]).to.equal(null)
    expect(logStub.calledWith("Cleared tag on session 'sess-1'.")).to.be.true
  })

  it('errors when neither a tag nor --clear is provided', async () => {
    const cmd = new SessionTag(['sess-1'], {
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
    expect(tagAgentSessionStub.called).to.be.false
  })

  it('errors when both a tag and --clear are provided', async () => {
    const cmd = new SessionTag(['sess-1', 'auth-work', '--clear'], {
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
    expect(tagAgentSessionStub.called).to.be.false
  })
})
