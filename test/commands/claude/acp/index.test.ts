/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('claude:acp', () => {
  let AcpList: any
  let readAcpAgentsStub: SinonStub

  const makeCommand = (): any =>
    new AcpList([], {
      bin: 'claude',
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)

  beforeEach(async () => {
    readAcpAgentsStub = stub().resolves({
      gemini: {args: ['--experimental-acp'], command: 'gemini'},
      local: {command: './my-agent', cwd: '/code/project'},
    })

    const imported = await esmock('../../../../src/commands/claude/acp/index.js', {
      '../../../../src/acp/acp-config.js': {readAcpAgents: readAcpAgentsStub},
    })
    AcpList = imported.default
  })

  it('lists each registered agent with its command line', async () => {
    const cmd = makeCommand()
    const log = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.agents).to.have.lengthOf(2)
    const logged = log.getCalls().map((call) => call.args[0])
    expect(logged).to.deep.equal(['gemini: gemini --experimental-acp', 'local: ./my-agent (cwd: /code/project)'])
  })

  it('explains how to add one when none are registered', async () => {
    readAcpAgentsStub.resolves({})
    const cmd = makeCommand()
    const log = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result).to.deep.equal({agents: []})
    expect(log.firstCall.args[0]).to.contain('claude acp add')
  })

  it('handles a missing config file', async () => {
    readAcpAgentsStub.resolves()
    const cmd = makeCommand()
    stub(cmd, 'log')

    expect(await cmd.run()).to.deep.equal({agents: []})
  })
})
