/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

const ctx = () =>
  ({
    configDir: '/tmp/test-agent-config',
    root: process.cwd(),
    runHook: stub().resolves({failures: [], successes: []}),
  }) as any

describe('agent:poml', () => {
  let AgentPoml: any
  let readFileStub: SinonStub
  let loadAgentConfigStub: SinonStub
  let runAxProgramStub: SinonStub
  let formatAsToonStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockResult = {
    data: {outputs: {sentiment: 'positive'}, signature: 'review:string -> sentiment:string'},
    success: true,
  }

  const samplePoml = `
    <poml>
      <role>You are an analyst.</role>
      <task>Classify sentiment.</task>
      <input name="review" type="string" />
      <output name="sentiment" type="class" description="positive, negative" />
    </poml>
  `

  before(async () => {
    readFileStub = stub().resolves(samplePoml)
    loadAgentConfigStub = stub().resolves(mockAuth)
    runAxProgramStub = stub().resolves(mockResult)
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/claude/poml.js', {
      '../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
      '../../../src/poml/ax-program.js': {runAxProgram: runAxProgramStub},
      '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
      'node:fs/promises': {readFile: readFileStub},
    })
    AgentPoml = imported.default
  })

  after(() => {
    esmock.purge(AgentPoml)
  })

  beforeEach(() => {
    readFileStub.reset()
    readFileStub.resolves(samplePoml)
    loadAgentConfigStub.reset()
    loadAgentConfigStub.resolves(mockAuth)
    runAxProgramStub.reset()
    runAxProgramStub.resolves(mockResult)
    formatAsToonStub.reset()
    formatAsToonStub.returns('toon-output')
  })

  it('compiles and runs the program, passing the compiled signature and inputs', async () => {
    const cmd = new AgentPoml(['/x.poml', '--input', '{"review":"great"}'], ctx())
    stub(cmd, 'logJson')

    await cmd.run()

    expect(runAxProgramStub.calledOnce).to.be.true
    const args = runAxProgramStub.firstCall.args[0]
    expect(args.apiKey).to.equal('sk-ant-test')
    expect(args.apiUrl).to.equal('https://api.anthropic.com')
    expect(args.inputs).to.deep.equal({review: 'great'})
    expect(args.program.signature).to.equal(
      '"You are an analyst. Classify sentiment." review:string -> sentiment:class "positive, negative"',
    )
  })

  it('maps a positional input onto the single input field', async () => {
    const cmd = new AgentPoml(['/x.poml', 'amazing product'], ctx())
    stub(cmd, 'logJson')

    await cmd.run()

    expect(runAxProgramStub.firstCall.args[0].inputs).to.deep.equal({review: 'amazing product'})
  })

  it('does not execute on --dry-run, printing the compiled program instead', async () => {
    const cmd = new AgentPoml(['/x.poml', '--input', '{"review":"x"}', '--dry-run'], ctx())
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(runAxProgramStub.called).to.be.false
    expect(loadAgentConfigStub.called).to.be.false
    expect(logJsonStub.firstCall.args[0].signature).to.contain('review:string')
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)
    const cmd = new AgentPoml(['/x.poml', '--input', '{"review":"x"}'], ctx())
    stub(cmd, 'logJson')

    await cmd.run()

    expect(runAxProgramStub.called).to.be.false
  })

  it('errors when a required input is missing', async () => {
    const cmd = new AgentPoml(['/x.poml'], ctx())
    stub(cmd, 'logJson')

    let threw = false
    try {
      await cmd.run()
    } catch {
      threw = true
    }

    expect(threw).to.be.true
    expect(runAxProgramStub.called).to.be.false
  })

  it('resolves a model shorthand from config.models', async () => {
    loadAgentConfigStub.resolves({...mockAuth, models: {sonnet: 'claude-sonnet-4-6'}})
    const cmd = new AgentPoml(['/x.poml', 'hi', '--model', 'sonnet'], ctx())
    stub(cmd, 'logJson')

    await cmd.run()

    expect(runAxProgramStub.firstCall.args[0].model).to.equal('claude-sonnet-4-6')
  })

  it('outputs TOON format when --toon is set', async () => {
    const cmd = new AgentPoml(['/x.poml', 'hi', '--toon'], ctx())
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnceWith(mockResult)).to.be.true
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
