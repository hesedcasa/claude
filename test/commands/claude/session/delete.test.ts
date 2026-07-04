/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session:delete', () => {
  let SessionDelete: any
  let deleteAgentSessionStub: SinonStub
  let getAgentSessionInfoStub: SinonStub
  let confirmStub: SinonStub
  const originalIsTTY = process.stdout.isTTY

  // The confirmation only fires in a TTY, so toggle isTTY before (re)importing to
  // exercise each path.
  async function importCommand(isTTY = false) {
    ;(process.stdout as any).isTTY = isTTY
    const imported = await esmock('../../../../src/commands/claude/session/delete.js', {
      '../../../../src/agent/session-api.js': {
        deleteAgentSession: deleteAgentSessionStub,
        getAgentSessionInfo: getAgentSessionInfoStub,
      },
      '@inquirer/prompts': {confirm: confirmStub},
    })
    SessionDelete = imported.default
  }

  beforeEach(async () => {
    deleteAgentSessionStub = stub().resolves({data: {sessionId: 'sess-1'}, success: true})
    getAgentSessionInfoStub = stub().resolves({data: {sessionId: 'sess-1', summary: 'Analyze auth'}, success: true})
    confirmStub = stub().resolves(true)

    await importCommand()
  })

  afterEach(() => {
    ;(process.stdout as any).isTTY = originalIsTTY
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

  it('confirms before deleting in a TTY', async () => {
    await importCommand(true)

    const cmd = new SessionDelete(['sess-1'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.calledOnce).to.be.true
    expect(confirmStub.firstCall.args[0].message).to.equal("Delete session 'sess-1' (Analyze auth)?")
    expect(deleteAgentSessionStub.calledOnce).to.be.true
  })

  it('does not delete when the confirmation is declined', async () => {
    confirmStub = stub().resolves(false)
    await importCommand(true)

    const cmd = new SessionDelete(['sess-1'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(deleteAgentSessionStub.called).to.be.false
    expect(logStub.calledWith('Aborted')).to.be.true
  })

  it('skips the confirmation with --force', async () => {
    await importCommand(true)

    const cmd = new SessionDelete(['sess-1', '--force'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.called).to.be.false
    expect(deleteAgentSessionStub.calledOnce).to.be.true
  })

  it('truncates long summaries in the confirmation message', async () => {
    getAgentSessionInfoStub.resolves({data: {sessionId: 'sess-1', summary: 'x'.repeat(80)}, success: true})
    await importCommand(true)

    const cmd = new SessionDelete(['sess-1'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.firstCall.args[0].message).to.equal(`Delete session 'sess-1' (${'x'.repeat(60)}…)?`)
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
