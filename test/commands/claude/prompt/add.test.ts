/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:prompt:add', () => {
  let PromptAdd: any
  let readPromptsStub: SinonStub
  let savePromptsStub: SinonStub

  beforeEach(async () => {
    readPromptsStub = stub().resolves({})
    savePromptsStub = stub().resolves()

    const imported = await esmock('../../../../src/commands/claude/prompt/add.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, savePrompts: savePromptsStub},
    })
    PromptAdd = imported.default
  })

  it('saves a new prompt with its description', async () => {
    const cmd = new PromptAdd(['summarize', 'Summarize the project', '--description', 'Architecture summary'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.calledOnce).to.be.true
    expect(savePromptsStub.firstCall.args[1]).to.deep.equal({
      summarize: {body: 'Summarize the project', description: 'Architecture summary', system: undefined},
    })
    expect(logStub.calledWith("Prompt 'summarize' saved")).to.be.true
  })

  it('saves a system prompt alongside the body', async () => {
    const cmd = new PromptAdd(['reviewer', 'Review this PR', '--system', 'You are a meticulous reviewer'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].reviewer).to.deep.equal({
      body: 'Review this PR',
      description: undefined,
      system: 'You are a meticulous reviewer',
    })
  })

  it('overwrites an existing prompt', async () => {
    readPromptsStub.resolves({summarize: {body: 'old', description: 'old'}})

    const cmd = new PromptAdd(['summarize', 'new body'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'new body',
      description: undefined,
      system: undefined,
    })
  })
})
