/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:prompt:list', () => {
  let PromptList: any
  let readPromptsStub: SinonStub

  beforeEach(async () => {
    readPromptsStub = stub().resolves({
      review: {body: '  Review   the   branch  '},
      summarize: {body: 'Summarize it', description: 'Summary'},
    })

    const imported = await esmock('../../../../src/commands/claude/prompt/index.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub},
    })
    PromptList = imported.default
  })

  it('lists prompts, falling back to a collapsed body when no description exists', async () => {
    const cmd = new PromptList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(logJsonStub.firstCall.args[0]).to.deep.equal([
      {description: 'Review the branch', name: 'review'},
      {description: 'Summary', name: 'summarize'},
    ])
  })

  it('returns an empty array when no prompts are saved', async () => {
    readPromptsStub.resolves({})

    const cmd = new PromptList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(logJsonStub.firstCall.args[0]).to.deep.equal([])
  })
})
