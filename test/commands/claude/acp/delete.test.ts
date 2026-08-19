/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('claude:acp:delete', () => {
  let AcpDelete: any
  let confirmStub: SinonStub
  let deleteAcpAgentStub: SinonStub
  const originalIsTTY = process.stdout.isTTY

  const makeCommand = (argv: string[]): any =>
    new AcpDelete(argv, {
      bin: 'claude',
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)

  beforeEach(async () => {
    deleteAcpAgentStub = stub().resolves(true)
    confirmStub = stub().resolves(true)

    const imported = await esmock('../../../../src/commands/claude/acp/delete.js', {
      '../../../../src/acp/acp-config.js': {deleteAcpAgent: deleteAcpAgentStub},
      '@inquirer/prompts': {confirm: confirmStub},
    })
    AcpDelete = imported.default
  })

  afterEach(() => {
    process.stdout.isTTY = originalIsTTY
  })

  it('deletes without confirmation when --force is passed', async () => {
    process.stdout.isTTY = true
    const cmd = makeCommand(['gemini', '--force'])
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.called).to.be.false
    expect(deleteAcpAgentStub.firstCall.args[1]).to.equal('gemini')
  })

  it('asks for confirmation on a TTY', async () => {
    process.stdout.isTTY = true
    const cmd = makeCommand(['gemini'])
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.calledOnce).to.be.true
    expect(deleteAcpAgentStub.calledOnce).to.be.true
  })

  it('aborts when the confirmation is declined', async () => {
    process.stdout.isTTY = true
    confirmStub.resolves(false)
    const cmd = makeCommand(['gemini'])
    const log = stub(cmd, 'log')

    await cmd.run()

    expect(deleteAcpAgentStub.called).to.be.false
    expect(log.firstCall.args[0]).to.equal('Aborted')
  })

  it('does not prompt when stdout is not a TTY', async () => {
    process.stdout.isTTY = false
    const cmd = makeCommand(['gemini'])
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.called).to.be.false
    expect(deleteAcpAgentStub.calledOnce).to.be.true
  })
})
