/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:prompt:add', () => {
  let PromptAdd: any
  let readPromptsStub: SinonStub
  let savePromptsStub: SinonStub
  let inputStub: SinonStub
  let editorStub: SinonStub
  const originalIsTTY = process.stdout.isTTY

  // The positional args are `required: !process.stdout.isTTY`, evaluated when the
  // module is imported. Toggle isTTY before (re)importing to exercise each path.
  async function importCommand(isTTY = false) {
    ;(process.stdout as any).isTTY = isTTY
    const imported = await esmock('../../../../src/commands/claude/prompt/add.js', {
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, savePrompts: savePromptsStub},
      '@inquirer/prompts': {editor: editorStub, input: inputStub},
    })
    PromptAdd = imported.default
  }

  beforeEach(async () => {
    readPromptsStub = stub().resolves({})
    savePromptsStub = stub().resolves()
    inputStub = stub().resolves('')
    editorStub = stub().resolves('')

    await importCommand()
  })

  afterEach(() => {
    ;(process.stdout as any).isTTY = originalIsTTY
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

  it('refuses to overwrite an existing prompt', async () => {
    readPromptsStub.resolves({summarize: {body: 'old', description: 'old'}})

    const cmd = new PromptAdd(['summarize', 'new body'], {
      bin: 'claude',
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(new Error("Prompt 'summarize' already exists."))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(errorStub.calledOnce).to.be.true
    expect(errorStub.firstCall.args[0]).to.include("Prompt 'summarize' already exists.")
    expect(thrown?.message).to.include("Prompt 'summarize' already exists.")
    expect(savePromptsStub.called).to.be.false
  })

  it('prompts for every field when no positional args are given', async () => {
    inputStub = stub()
    inputStub.onCall(0).resolves('summarize') // name
    inputStub.onCall(1).resolves('Architecture summary') // description
    editorStub = stub()
    editorStub.onCall(0).resolves('Summarize the project') // body
    editorStub.onCall(1).resolves('You are terse') // system
    await importCommand(true)

    const cmd = new PromptAdd([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(inputStub.callCount).to.equal(2)
    expect(editorStub.callCount).to.equal(2)
    expect(savePromptsStub.firstCall.args[1]).to.deep.equal({
      summarize: {body: 'Summarize the project', description: 'Architecture summary', system: 'You are terse'},
    })
  })

  it('captures multi-line prompt text from the editor', async () => {
    const multiline = '[[ ## summary ## ]]\n{{ summary }}\n\n[[ ## description ## ]]\n{{ description }}'
    inputStub = stub()
    inputStub.onCall(0).resolves('formatter') // name
    inputStub.onCall(1).resolves('') // description
    editorStub = stub()
    editorStub.onCall(0).resolves(`${multiline}\n`) // body (editor appends trailing newline)
    editorStub.onCall(1).resolves('') // system
    await importCommand(true)

    const cmd = new PromptAdd([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].formatter).to.deep.equal({
      body: multiline,
      description: undefined,
      system: undefined,
    })
  })

  it('stores blank interactive optional answers as undefined', async () => {
    inputStub = stub()
    inputStub.onCall(0).resolves('summarize') // name
    inputStub.onCall(1).resolves('') // description
    editorStub = stub()
    editorStub.onCall(0).resolves('Summarize the project') // body
    editorStub.onCall(1).resolves('') // system
    await importCommand(true)

    const cmd = new PromptAdd([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(savePromptsStub.firstCall.args[1].summarize).to.deep.equal({
      body: 'Summarize the project',
      description: undefined,
      system: undefined,
    })
  })

  it('does not prompt when both positional args are provided', async () => {
    const cmd = new PromptAdd(['summarize', 'Summarize the project'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(inputStub.called).to.be.false
    expect(editorStub.called).to.be.false
  })
})
