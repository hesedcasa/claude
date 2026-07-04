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
  let inputStub: SinonStub
  let editorStub: SinonStub
  let confirmStub: SinonStub
  const originalIsTTY = process.stdout.isTTY

  // The `name` arg is `required: !process.stdout.isTTY`, evaluated when the module
  // is imported. Toggle isTTY before (re)importing to exercise each path.
  async function importCommand(isTTY = false) {
    ;(process.stdout as any).isTTY = isTTY
    const imported = await esmock('../../../../src/commands/claude/prompt/edit.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, resolvePrompt, savePrompts: savePromptsStub},
      '@inquirer/prompts': {confirm: confirmStub, editor: editorStub, input: inputStub},
    })
    PromptEdit = imported.default
  }

  beforeEach(async () => {
    readPromptsStub = stub().resolves({
      summarize: {body: 'old body', description: 'old description', system: 'old system'},
    })
    savePromptsStub = stub().resolves()
    inputStub = stub().resolves('')
    editorStub = stub().resolves('')
    confirmStub = stub().resolves(true)

    await importCommand()
  })

  afterEach(() => {
    ;(process.stdout as any).isTTY = originalIsTTY
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
    expect(editorStub.called).to.be.false
    expect(inputStub.called).to.be.false
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

  it('errors when nothing is provided to update outside a TTY', async () => {
    const cmd = new PromptEdit(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(
      new Error('Nothing to update. Pass a new body, --system, and/or --description.'),
    )

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

  it('opens editors pre-filled with the current values when only the name is given', async () => {
    inputStub = stub()
    inputStub.onCall(0).resolves('new description') // description (name comes from the positional arg)
    editorStub = stub()
    editorStub.onCall(0).resolves('new body\n') // body (editor appends a trailing newline)
    editorStub.onCall(1).resolves('new system\n') // system
    await importCommand(true)

    const cmd = new PromptEdit(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    // Each field is seeded with the existing value so the user edits in place.
    expect(editorStub.firstCall.args[0].default).to.equal('old body')
    expect(editorStub.secondCall.args[0].default).to.equal('old system')
    expect(inputStub.firstCall.args[0].default).to.equal('old description')
    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'new body',
      description: 'new description',
      system: 'new system',
    })
  })

  it('clears optional fields when their interactive answers are blank', async () => {
    inputStub = stub()
    inputStub.onCall(0).resolves('') // description blanked
    editorStub = stub()
    editorStub.onCall(0).resolves('kept body\n') // body
    editorStub.onCall(1).resolves('') // system blanked
    await importCommand(true)

    const cmd = new PromptEdit(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'kept body',
      description: undefined,
      system: undefined,
    })
  })

  it('does not save when the confirmation is declined', async () => {
    confirmStub = stub().resolves(false)
    await importCommand(true)

    const cmd = new PromptEdit(['summarize', 'new body'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.calledOnce).to.be.true
    expect(savePromptsStub.called).to.be.false
    expect(logStub.calledWith('Aborted')).to.be.true
  })

  it('skips the confirmation prompt with --force', async () => {
    confirmStub = stub().resolves(false)
    await importCommand(true)

    const cmd = new PromptEdit(['summarize', 'new body', '--force'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.called).to.be.false
    expect(savePromptsStub.calledOnce).to.be.true
  })

  it('does not confirm outside a TTY', async () => {
    // beforeEach imported with isTTY = false.
    const cmd = new PromptEdit(['summarize', 'new body'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(confirmStub.called).to.be.false
    expect(savePromptsStub.calledOnce).to.be.true
  })

  it('prompts for the name too when no positional args are given', async () => {
    inputStub = stub()
    inputStub.onCall(0).resolves('summarize') // name
    inputStub.onCall(1).resolves('new description') // description
    editorStub = stub()
    editorStub.onCall(0).resolves('new body\n') // body
    editorStub.onCall(1).resolves('new system\n') // system
    await importCommand(true)

    const cmd = new PromptEdit([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(inputStub.callCount).to.equal(2)
    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'new body',
      description: 'new description',
      system: 'new system',
    })
  })
})
