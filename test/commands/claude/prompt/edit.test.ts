/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

const resolvePrompt = (prompts: Record<string, any>, name: string): [string, any] => {
  if (!prompts[name]) throw new Error(`Prompt '${name}' does not exist.`)
  return [name, prompts[name]]
}

describe('agent:prompt:edit', () => {
  let PromptEdit: any
  let readPromptsStub: SinonStub
  let savePromptsStub: SinonStub

  beforeEach(async () => {
    readPromptsStub = stub().resolves({
      summarize: {body: 'old body', description: 'old description', system: 'old system'},
    })
    savePromptsStub = stub().resolves()

    const imported = await esmock('../../../../src/commands/claude/prompt/edit.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, resolvePrompt, savePrompts: savePromptsStub},
    })
    PromptEdit = imported.default
  })

  it('replaces the body and keeps the description when only a body is given', async () => {
    const cmd = new PromptEdit(['summarize', 'new body'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'new body',
      description: 'old description',
      system: 'old system',
    })
  })

  it('replaces only the description when --description is given', async () => {
    const cmd = new PromptEdit(['summarize', '--description', 'new description'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'old body',
      description: 'new description',
      system: 'old system',
    })
  })

  it('replaces only the system prompt when --system is given', async () => {
    const cmd = new PromptEdit(['summarize', '--system', 'new system'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'old body',
      description: 'old description',
      system: 'new system',
    })
  })

  it('errors when nothing is provided to update', async () => {
    const cmd = new PromptEdit(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(new Error('Nothing to update. Pass a new body and/or --description.'))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(errorStub.calledOnce).to.be.true
    expect(thrown?.message).to.include('Nothing to update')
    expect(savePromptsStub.called).to.be.false
  })
})
