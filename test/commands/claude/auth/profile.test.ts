/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:auth:profile', () => {
  let AgentAuthProfile: any
  let getDefaultProfileStub: SinonStub
  let setDefaultProfileStub: SinonStub

  beforeEach(async () => {
    getDefaultProfileStub = stub()
    setDefaultProfileStub = stub()

    const imported = await esmock('../../../../src/commands/claude/auth/profile.js', {
      '../../../../src/config.js': {
        getDefaultProfile: getDefaultProfileStub,
        setDefaultProfile: setDefaultProfileStub,
      },
    })
    AgentAuthProfile = imported.default
  })

  it('logs the current default profile when no flag is given', async () => {
    getDefaultProfileStub.resolves('work')

    const cmd = new AgentAuthProfile([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith('work')).to.be.true
    expect(setDefaultProfileStub.called).to.be.false
  })

  it('calls setDefaultProfile when --default flag is given', async () => {
    setDefaultProfileStub.resolves()

    const cmd = new AgentAuthProfile(['--default', 'work'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(setDefaultProfileStub.calledOnce).to.be.true
    expect(setDefaultProfileStub.firstCall.args[1]).to.equal('work')
    expect(getDefaultProfileStub.called).to.be.false
  })
})
