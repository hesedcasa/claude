/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

const resolvePrompt = (prompts: Record<string, any>, name: string): [string, any] => {
  if (!prompts[name]) throw new Error(`Prompt '${name}' does not exist.`)
  return [name, prompts[name]]
}

describe('agent:prompt:delete', () => {
  let PromptDelete: any
  let readPromptsStub: SinonStub
  let savePromptsStub: SinonStub

  beforeEach(async () => {
    readPromptsStub = stub().resolves({other: {body: 'keep me'}, summarize: {body: 'Summarize it'}})
    savePromptsStub = stub().resolves()

    const imported = await esmock('../../../../src/commands/claude/prompt/delete.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, resolvePrompt, savePrompts: savePromptsStub},
    })
    PromptDelete = imported.default
  })

  it('removes the named prompt and saves the rest', async () => {
    const cmd = new PromptDelete(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1]).to.deep.equal({other: {body: 'keep me'}})
    expect(logStub.calledWith("Prompt 'summarize' deleted")).to.be.true
  })

  it('registers the `prompt rm` alias', () => {
    expect(PromptDelete.aliases).to.include('claude prompt rm')
  })
})
