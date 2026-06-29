/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

const resolvePrompt = (prompts: Record<string, any>, name: string): [string, any] => {
  if (!prompts[name]) throw new Error(`Prompt '${name}' does not exist.`)
  return [name, prompts[name]]
}

describe('agent:prompt:show', () => {
  let PromptShow: any
  let readPromptsStub: SinonStub
  let formatAsToonStub: SinonStub

  beforeEach(async () => {
    readPromptsStub = stub().resolves({summarize: {body: 'Summarize it', description: 'Summary'}})
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock('../../../../src/commands/claude/prompt/show.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, resolvePrompt},
      '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
    })
    PromptShow = imported.default
  })

  it('prints the resolved prompt as JSON', async () => {
    const cmd = new PromptShow(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(logJsonStub.firstCall.args[0]).to.deep.equal({
      body: 'Summarize it',
      description: 'Summary',
      name: 'summarize',
    })
  })

  it('lists the {{placeholders}} a prompt requires', async () => {
    readPromptsStub.resolves({classify: {body: 'Classify {{summary}}', system: 'Context {{description}}'}})

    const cmd = new PromptShow(['classify'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(logJsonStub.firstCall.args[0].placeholders).to.have.members(['summary', 'description'])
  })

  it('formats as TOON when --toon is set', async () => {
    const cmd = new PromptShow(['summarize', '--toon'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
