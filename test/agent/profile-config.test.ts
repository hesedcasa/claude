import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

import {createMockConfig} from '../helpers/config-mock.js'

describe('loadAgentConfig', () => {
  let createProfileManagerStub: SinonStub
  let loadAgentConfig: typeof import('../../src/agent/profile-config.js').loadAgentConfig
  let loadAuthConfigStub: SinonStub

  beforeEach(async () => {
    loadAuthConfigStub = stub()
    createProfileManagerStub = stub().returns({loadAuthConfig: loadAuthConfigStub})

    const imported = await esmock('../../src/agent/profile-config.js', {
      '@hesed/plugin-lib': {createProfileManager: createProfileManagerStub},
    })

    loadAgentConfig = imported.loadAgentConfig
  })

  it('loads the requested profile from the Claude auth file', async () => {
    loadAuthConfigStub.resolves({apiKey: 'sk-ant-test', apiUrl: 'https://api.example.com'})
    const config = createMockConfig()

    const result = await loadAgentConfig(config, () => {}, 'work')

    expect(createProfileManagerStub.calledOnceWith(config, 'work', 'claude-auth.json')).to.be.true
    expect(result).to.deep.equal({apiKey: 'sk-ant-test', apiUrl: 'https://api.example.com'})
  })

  it('returns undefined and logs when the profile is missing', async () => {
    loadAuthConfigStub.resolves()
    const logs: string[] = []

    const result = await loadAgentConfig(createMockConfig(), (message) => logs.push(message), 'work')

    expect(result).to.be.undefined
    expect(logs).to.deep.equal(["Profile 'work' not found. Run 'claude auth add' to add it."])
  })

  it('uses the default profile name in missing-profile logs', async () => {
    loadAuthConfigStub.resolves()
    const logs: string[] = []

    await loadAgentConfig(createMockConfig(), (message) => logs.push(message))

    expect(logs).to.deep.equal(["Profile 'default' not found. Run 'claude auth add' to add it."])
  })

  it('defaults a missing apiUrl to an empty string', async () => {
    loadAuthConfigStub.resolves({apiKey: 'sk-ant-test'})

    const result = await loadAgentConfig(createMockConfig(), () => {})

    expect(result).to.deep.equal({apiKey: 'sk-ant-test', apiUrl: ''})
  })

  it('maps flat model fields into the AgentConfig models object', async () => {
    loadAuthConfigStub.resolves({
      apiKey: 'sk-ant-test',
      apiUrl: '',
      haiku: 'claude-haiku-4-5-20251001',
      opus: 'claude-opus-4-7',
      sonnet: 'claude-sonnet-4-6',
    })

    const result = await loadAgentConfig(createMockConfig(), () => {})

    expect(result).to.deep.equal({
      apiKey: 'sk-ant-test',
      apiUrl: '',
      models: {
        haiku: 'claude-haiku-4-5-20251001',
        opus: 'claude-opus-4-7',
        sonnet: 'claude-sonnet-4-6',
      },
    })
  })

  it('merges nested model fields after flat model fields', async () => {
    loadAuthConfigStub.resolves({
      apiKey: 'sk-ant-test',
      apiUrl: '',
      models: {opus: 'nested-opus', sonnet: 'nested-sonnet'},
      opus: 'flat-opus',
    })

    const result = await loadAgentConfig(createMockConfig(), () => {})

    expect(result?.models).to.deep.equal({opus: 'nested-opus', sonnet: 'nested-sonnet'})
  })
})
