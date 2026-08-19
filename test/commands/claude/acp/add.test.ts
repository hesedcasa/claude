/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('claude:acp:add', () => {
  let AcpAdd: any
  let addAcpAgentStub: SinonStub

  const makeCommand = (argv: string[]): any =>
    new AcpAdd(argv, {
      bin: 'claude',
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)

  beforeEach(async () => {
    addAcpAgentStub = stub().resolves(true)

    const imported = await esmock('../../../../src/commands/claude/acp/add.js', {
      '../../../../src/acp/acp-config.js': {addAcpAgent: addAcpAgentStub},
    })
    AcpAdd = imported.default
  })

  it('stores the command with its arguments in order', async () => {
    const cmd = makeCommand(['gemini', 'gemini', '--arg', '--experimental-acp', '--arg', '--yolo'])
    stub(cmd, 'log')

    await cmd.run()

    expect(addAcpAgentStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(addAcpAgentStub.firstCall.args[1]).to.equal('gemini')
    expect(addAcpAgentStub.firstCall.args[2]).to.deep.equal({
      args: ['--experimental-acp', '--yolo'],
      command: 'gemini',
    })
  })

  it('stores cwd and environment variables', async () => {
    const cmd = makeCommand(['local', './my-agent', '--cwd', '/code/project', '--env', 'DEBUG=1', '--env', 'K=v=w'])
    stub(cmd, 'log')

    await cmd.run()

    expect(addAcpAgentStub.firstCall.args[2]).to.deep.equal({
      command: './my-agent',
      cwd: '/code/project',
      env: {DEBUG: '1', K: 'v=w'},
    })
  })

  it('omits empty optional fields', async () => {
    const cmd = makeCommand(['peer', 'peer-agent'])
    stub(cmd, 'log')

    await cmd.run()

    expect(addAcpAgentStub.firstCall.args[2]).to.deep.equal({command: 'peer-agent'})
  })

  it('rejects a malformed env entry', async () => {
    const cmd = makeCommand(['peer', 'peer-agent', '--env', 'BROKEN'])
    stub(cmd, 'log')

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain('Invalid env format')
    }

    expect(addAcpAgentStub.called).to.be.false
  })
})
