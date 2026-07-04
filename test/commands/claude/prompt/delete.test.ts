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
  let confirmStub: SinonStub
  const originalIsTTY = process.stdout.isTTY

  // The confirmation only fires in a TTY, so toggle isTTY before (re)importing to
  // exercise each path.
  async function importCommand(isTTY = false) {
    ;(process.stdout as any).isTTY = isTTY
    const imported = await esmock('../../../../src/commands/claude/prompt/delete.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, resolvePrompt, savePrompts: savePromptsStub},
      '@inquirer/prompts': {confirm: confirmStub},
    })
    PromptDelete = imported.default
  }

  beforeEach(async () => {
    readPromptsStub = stub().resolves({other: {body: 'keep me'}, summarize: {body: 'Summarize it'}})
    savePromptsStub = stub().resolves()
    confirmStub = stub().resolves(true)

    await importCommand()
  })

  afterEach(() => {
    ;(process.stdout as any).isTTY = originalIsTTY
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

  it('confirms before deleting in a TTY', async () => {
    await importCommand(true)

    const cmd = new PromptDelete(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.calledOnce).to.be.true
    expect(savePromptsStub.calledOnce).to.be.true
  })

  it('does not delete when the confirmation is declined', async () => {
    confirmStub = stub().resolves(false)
    await importCommand(true)

    const cmd = new PromptDelete(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.called).to.be.false
    expect(logStub.calledWith('Aborted')).to.be.true
  })

  it('skips the confirmation prompt with --force', async () => {
    confirmStub = stub().resolves(false)
    await importCommand(true)

    const cmd = new PromptDelete(['summarize', '--force'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.called).to.be.false
    expect(savePromptsStub.calledOnce).to.be.true
  })

  it('registers the `prompt rm` alias', () => {
    expect(PromptDelete.aliases).to.include('claude prompt rm')
  })
})
