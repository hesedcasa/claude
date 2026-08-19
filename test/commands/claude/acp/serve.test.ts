/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('claude:acp:serve', () => {
  let AcpServe: any
  let loadAgentConfigStub: SinonStub
  let serveStub: SinonStub
  let stderrStub: SinonStub

  const makeCommand = (argv: string[]): any =>
    new AcpServe(argv, {
      bin: 'claude',
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves({
      apiKey: 'sk-ant-test',
      apiUrl: '',
      models: {opus: 'claude-opus-test', sonnet: 'claude-sonnet-test'},
    })
    serveStub = stub().resolves()
    stderrStub = stub(process.stderr, 'write').returns(true)

    const imported = await esmock('../../../../src/commands/claude/acp/serve.js', {
      '../../../../src/acp/acp-serve.js': {serveAcpOverStdio: serveStub},
      '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
    })
    AcpServe = imported.default
  })

  afterEach(() => {
    stderrStub.restore()
  })

  it('serves the agent with the profile default model', async () => {
    await makeCommand([]).run()

    expect(serveStub.calledOnce).to.be.true
    const options = serveStub.firstCall.args[0]
    expect(options.config.apiKey).to.equal('sk-ant-test')
    expect(options.model).to.equal('claude-sonnet-test')
    expect(options.allowedTools).to.equal(undefined)
    expect(options.systemPrompt).to.equal(undefined)
  })

  it('maps a model alias through the profile and passes the tool allow-list', async () => {
    await makeCommand(['--model', 'opus', '--allow-tools', 'Read, Glob', '--system', 'be brief']).run()

    const options = serveStub.firstCall.args[0]
    expect(options.model).to.equal('claude-opus-test')
    expect(options.allowedTools).to.deep.equal(['Read', 'Glob'])
    expect(options.systemPrompt).to.equal('be brief')
  })

  it('passes a full model ID through unchanged', async () => {
    await makeCommand(['--model', 'claude-custom-1']).run()

    expect(serveStub.firstCall.args[0].model).to.equal('claude-custom-1')
  })

  it('forwards the requested profile name', async () => {
    await makeCommand(['--profile', 'work']).run()

    expect(loadAgentConfigStub.firstCall.args[2]).to.equal('work')
  })

  it('keeps diagnostics off stdout so the protocol stream stays clean', async () => {
    const cmd = makeCommand([])
    const log = stub(cmd, 'log')

    await cmd.run()

    expect(log.called).to.be.false
    expect(
      stderrStub
        .getCalls()
        .map((call) => call.args[0])
        .join(''),
    ).to.contain('ACP agent listening on stdio')
  })

  it('errors when no profile is configured', async () => {
    loadAgentConfigStub.resolves()
    const cmd = makeCommand([])

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain('No authentication profile available')
    }

    expect(serveStub.called).to.be.false
  })
})
