import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('authOptions', () => {
  let clearClientsStub: SinonStub
  let connectStub: SinonStub
  let authOptions: typeof import('../../src/agent/auth-options.js').authOptions

  beforeEach(async () => {
    clearClientsStub = stub()
    connectStub = stub().resolves({success: true})

    const imported = await esmock('../../src/agent/auth-options.js', {
      '../../src/agent/agent-client.js': {
        clearClients: clearClientsStub,
        testConnection: connectStub,
      },
    })

    authOptions = imported.authOptions
  })

  it('exports Claude auth command metadata', () => {
    expect(authOptions.configFile).to.equal('claude-auth.json')
    expect(authOptions.serviceName).to.equal('Claude Agent SDK')
    expect(authOptions.clearClients).to.equal(clearClientsStub)
  })

  it('defines flat auth and model fields', () => {
    expect(authOptions.fields).to.deep.equal([
      {char: 'k', description: 'Anthropic API key', name: 'apiKey', required: true, type: 'string'},
      {
        char: 'u',
        description: 'Anthropic API base URL (blank for default)',
        name: 'apiUrl',
        required: false,
        type: 'string',
      },
      {description: 'Opus model ID override', name: 'opus', required: false, type: 'string'},
      {description: 'Sonnet model ID override', name: 'sonnet', required: false, type: 'string'},
      {description: 'Haiku model ID override', name: 'haiku', required: false, type: 'string'},
    ])
  })

  it('passes apiKey and apiUrl to the SDK connection test', async () => {
    const result = await authOptions.testConnection({apiKey: 'sk-ant-test', apiUrl: 'https://api.example.com'})

    expect(result).to.deep.equal({success: true})
    expect(connectStub.calledOnceWith({apiKey: 'sk-ant-test', apiUrl: 'https://api.example.com'})).to.be.true
  })

  it('defaults missing apiUrl to an empty string', async () => {
    await authOptions.testConnection({apiKey: 'sk-ant-test'})

    expect(connectStub.calledOnceWith({apiKey: 'sk-ant-test', apiUrl: ''})).to.be.true
  })
})
