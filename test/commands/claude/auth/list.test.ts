/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:auth:list', () => {
  let AgentAuthList: any
  let readProfilesStub: SinonStub
  let getDefaultProfileStub: SinonStub

  beforeEach(async () => {
    readProfilesStub = stub()
    getDefaultProfileStub = stub()

    const imported = await esmock('../../../../src/commands/claude/auth/list.js', {
      '../../../../src/config.js': {
        getDefaultProfile: getDefaultProfileStub,
        readProfiles: readProfilesStub,
      },
    })
    AgentAuthList = imported.default
  })

  it('lists profiles with masked api key and marks default', async () => {
    readProfilesStub.resolves({
      default: {apiKey: 'sk-ant-api03-abc', apiUrl: 'https://api.anthropic.com'},
      work: {apiKey: 'sk-ant-api03-xyz', apiUrl: ''},
    })
    getDefaultProfileStub.resolves('default')

    const cmd = new AgentAuthList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.profiles).to.have.length(2)
    const def = result.profiles.find((p: any) => p.name === 'default')
    expect(def.default).to.be.true
    expect(def.apiKey).to.match(/^sk-ant-\.\.\./)
    expect(def.apiUrl).to.equal('https://api.anthropic.com')

    const work = result.profiles.find((p: any) => p.name === 'work')
    expect(work.default === undefined).to.be.true
    expect(work.apiUrl).to.equal('(default)')

    expect(logStub.called).to.be.true
  })

  it('logs message and returns empty list when no profiles', async () => {
    readProfilesStub.resolves({})

    const cmd = new AgentAuthList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.profiles).to.deep.equal([])
    expect(logStub.calledWith("No authentication profiles found. Run 'agent auth add' to add one.")).to.be.true
  })

  it('logs message and returns empty list when readProfiles returns undefined', async () => {
    readProfilesStub.resolves()

    const cmd = new AgentAuthList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.profiles).to.deep.equal([])
    expect(logStub.calledWith("No authentication profiles found. Run 'agent auth add' to add one.")).to.be.true
  })
})
