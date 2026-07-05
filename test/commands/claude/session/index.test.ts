/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:session', () => {
  let SessionList: any
  let listAgentSessionsStub: SinonStub

  const mockResult = {data: {sessions: [{sessionId: 'sess-1', summary: 'Analyze auth'}]}, success: true}

  beforeEach(async () => {
    listAgentSessionsStub = stub().resolves(mockResult)

    const imported = await esmock('../../../../src/commands/claude/session/index.js', {
      '../../../../src/agent/session-api.js': {listAgentSessions: listAgentSessionsStub},
    })
    SessionList = imported.default
  })

  it('lists sessions for the current directory by default', async () => {
    const cmd = new SessionList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(listAgentSessionsStub.calledOnce).to.be.true
    expect(listAgentSessionsStub.firstCall.args[0].dir).to.equal(process.cwd())
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('passes --dir, --limit, and --offset through', async () => {
    const cmd = new SessionList(['--dir', '/code/repo-a', '--limit', '10', '--offset', '5'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(listAgentSessionsStub.firstCall.args[0]).to.deep.equal({dir: '/code/repo-a', limit: 10, offset: 5})
  })

  it('lists sessions across all projects with --all', async () => {
    const cmd = new SessionList(['--all'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(listAgentSessionsStub.firstCall.args[0].dir === undefined).to.be.true
  })
})
