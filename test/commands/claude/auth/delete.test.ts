/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:auth:delete', () => {
  let AgentAuthDelete: any
  let deleteProfileStub: SinonStub

  beforeEach(async () => {
    deleteProfileStub = stub()

    const imported = await esmock('../../../../src/commands/claude/auth/delete.js', {
      '../../../../src/config.js': {deleteProfile: deleteProfileStub},
    })
    AgentAuthDelete = imported.default
  })

  it('calls deleteProfile with the given profile name', async () => {
    deleteProfileStub.resolves(true)

    const cmd = new AgentAuthDelete(['--profile', 'work'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(deleteProfileStub.calledOnce).to.be.true
    expect(deleteProfileStub.firstCall.args[1]).to.equal('work')
  })

  it('calls deleteProfile for the default profile', async () => {
    deleteProfileStub.resolves(true)

    const cmd = new AgentAuthDelete(['--profile', 'default'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(deleteProfileStub.firstCall.args[1]).to.equal('default')
  })
})
