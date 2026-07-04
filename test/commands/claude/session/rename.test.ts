/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:rename', () => {
  let SessionRename: any
  let renameAgentSessionStub: SinonStub

  beforeEach(async () => {
    renameAgentSessionStub = stub().resolves({data: {sessionId: 'sess-1', title: 'Auth refactor'}, success: true})

    const imported = await esmock('../../../../src/commands/claude/session/rename.js', {
      '../../../../src/agent/session-api.js': {renameAgentSession: renameAgentSessionStub},
    })
    SessionRename = imported.default
  })

  it('renames the session', async () => {
    const cmd = new SessionRename(['sess-1', 'Auth refactor', '--dir', '/code/repo-a'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(renameAgentSessionStub.firstCall.args).to.deep.equal(['sess-1', 'Auth refactor', '/code/repo-a'])
    expect(logStub.calledWith("Renamed session 'sess-1' to 'Auth refactor'.")).to.be.true
  })

  it('errors when the rename fails', async () => {
    renameAgentSessionStub.resolves({error: 'not found', success: false})

    const cmd = new SessionRename(['sess-1', 'x'], {
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
  })
})
