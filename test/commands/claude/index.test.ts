/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:chat', () => {
  let AgentChat: any
  let loadAgentConfigStub: SinonStub
  let readWorkspaceStub: SinonStub
  let buildWorkspaceContextStub: SinonStub
  let chatStub: SinonStub
  let clearClientsStub: SinonStub
  let formatAsToonStub: SinonStub
  let receivedPrompts: string[]

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockUsage = {costUsd: 0.0123, durationMs: 4321, inputTokens: 1500, numTurns: 1, outputTokens: 250}
  const mockResult = {
    data: {numTurns: 1, result: 'Paris.', sessionId: 'sess-1', toolsUsed: [], usage: mockUsage},
    success: true,
  }

  /**
   * Consume the prompt stream like AgentApi.chat: pull each prompt, then
   * signal the turn finished via onTurnEnd so the generator resumes.
   */
  const consumePrompts = async (prompts: AsyncIterable<string>, options: any) => {
    for await (const prompt of prompts) {
      receivedPrompts.push(prompt)
      options?.onTurnEnd?.({result: 'ok', sessionId: 'sess-1', usage: mockUsage})
    }

    return mockResult
  }

  before(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkspaceStub = stub().resolves()
    buildWorkspaceContextStub = stub().resolves()
    chatStub = stub().callsFake(async (_config: any, prompts: AsyncIterable<string>, options: any) =>
      consumePrompts(prompts, options),
    )
    clearClientsStub = stub()
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/claude/index.js', {
      '../../../src/agent/agent-client.js': {chat: chatStub, clearClients: clearClientsStub},
      '../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
      '../../../src/workspace-bash.js': {buildWorkspaceContext: buildWorkspaceContextStub},
      '../../../src/workspace-config.js': {readWorkspace: readWorkspaceStub},
      '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
    })
    AgentChat = imported.default
  })

  after(() => {
    esmock.purge(AgentChat)
  })

  beforeEach(() => {
    receivedPrompts = []
    loadAgentConfigStub.reset()
    loadAgentConfigStub.resolves(mockAuth)
    readWorkspaceStub.reset()
    readWorkspaceStub.resolves()
    buildWorkspaceContextStub.reset()
    buildWorkspaceContextStub.resolves()
    chatStub.resetHistory()
    clearClientsStub.reset()
    formatAsToonStub.reset()
    formatAsToonStub.returns('toon-output')
  })

  function makeCommand(argv: string[]): any {
    const cmd = new AgentChat(argv, {
      configDir: '/tmp/test-agent-config',
      dataDir: '/tmp/test-agent-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    return cmd
  }

  it('sends the initial prompt argument as the first message and outputs JSON', async () => {
    const cmd = makeCommand(['What is the capital of France?'])
    stub(cmd, 'readLine').resolves('exit')
    const logJsonStub = stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(chatStub.calledOnce).to.be.true
    expect(chatStub.firstCall.args[0]).to.deep.equal(mockAuth)
    expect(receivedPrompts).to.deep.equal(['What is the capital of France?'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('opts the prompt arg out of oclif stdin reading so piped lines reach the chat loop', () => {
    // Without ignoreStdin the oclif parser drains piped stdin into the
    // arg, so multi-line pipes collapse into one giant first turn and
    // the interactive loop hangs on the already-consumed stream.
    expect(AgentChat.args.prompt.ignoreStdin).to.be.true
  })

  it('keeps the session alive across turns until an exit command', async () => {
    const cmd = makeCommand(['first question'])
    const readLineStub = stub(cmd, 'readLine')
    readLineStub.onCall(0).resolves('second question')
    readLineStub.onCall(1).resolves('/quit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    expect(receivedPrompts).to.deep.equal(['first question', 'second question'])
    expect(chatStub.calledOnce).to.be.true
  })

  it('starts without an initial prompt and skips blank input lines', async () => {
    const cmd = makeCommand([])
    const readLineStub = stub(cmd, 'readLine')
    readLineStub.onCall(0).resolves('   ')
    readLineStub.onCall(1).resolves('hello there')
    readLineStub.onCall(2).resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    expect(receivedPrompts).to.deep.equal(['hello there'])
  })

  it('ends the session on EOF (readLine returns undefined)', async () => {
    const cmd = makeCommand([])
    stub(cmd, 'readLine').resolves()
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    expect(receivedPrompts).to.deep.equal([])
    expect(chatStub.calledOnce).to.be.true
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = makeCommand(['hi'])
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(chatStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('logs the usage summary after each turn', async () => {
    const cmd = makeCommand(['hi'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    const logStub = stub(cmd, 'log')

    await cmd.run()

    const summaryCalls = logStub.getCalls().filter((c) => String(c.args[0] ?? '').startsWith('Tokens: '))
    expect(summaryCalls).to.have.length(1)
  })

  it('logs turn errors reported through onTurnEnd', async () => {
    chatStub.callsFake(async (_config: any, prompts: AsyncIterable<string>, options: any) => {
      for await (const prompt of prompts) {
        receivedPrompts.push(prompt)
        options?.onTurnEnd?.({error: 'Agent turn ended with subtype: error_max_turns', sessionId: 'sess-1'})
      }

      return {error: 'Agent turn ended with subtype: error_max_turns', success: false}
    })

    const cmd = makeCommand(['hi'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    const logStub = stub(cmd, 'log')

    try {
      await cmd.run()
    } finally {
      chatStub.callsFake(async (_config: any, prompts: AsyncIterable<string>, options: any) =>
        consumePrompts(prompts, options),
      )
    }

    expect(logStub.calledWith('Agent turn ended with subtype: error_max_turns')).to.be.true
  })

  it('wires onText and onToolUse streaming callbacks', async () => {
    const cmd = makeCommand(['hi'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    const logStub = stub(cmd, 'log')

    await cmd.run()

    const opts = chatStub.firstCall.args[2]
    expect(opts.onText).to.be.a('function')
    expect(opts.onToolUse).to.be.a('function')

    opts.onText('hello-stream')
    expect(logStub.calledWith('hello-stream')).to.be.true
    opts.onToolUse('Read')
    expect(logStub.calledWith('[tool: Read]')).to.be.true
  })

  it('parses --allow-tools into an array', async () => {
    const cmd = makeCommand(['hi', '--allow-tools', 'Read, Glob , Edit'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    const opts = chatStub.firstCall.args[2]
    expect(opts.allowedTools).to.deep.equal(['Read', 'Glob', 'Edit'])
  })

  it('passes --system as systemPrompt', async () => {
    const cmd = makeCommand(['hi', '--system', 'Be brief.'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    const opts = chatStub.firstCall.args[2]
    expect(opts.systemPrompt).to.equal('Be brief.')
  })

  it('passes --resume and --fork-session to chat options', async () => {
    const cmd = makeCommand(['hi', '--resume', 'sess-1', '--fork-session'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    const opts = chatStub.firstCall.args[2]
    expect(opts.resume).to.equal('sess-1')
    expect(opts.forkSession).to.be.true
  })

  it('passes --continue as continueSession', async () => {
    const cmd = makeCommand(['hi', '--continue'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    const opts = chatStub.firstCall.args[2]
    expect(opts.continueSession).to.be.true
    expect(opts.resume === undefined).to.be.true
  })

  it('resolves model shorthand from config.models', async () => {
    loadAgentConfigStub.resolves({
      ...mockAuth,
      models: {haiku: 'claude-haiku-4-5-20251001', opus: 'claude-opus-4-7', sonnet: 'claude-sonnet-4-6'},
    })

    const cmd = makeCommand(['hi', '--model', 'sonnet'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    const opts = chatStub.firstCall.args[2]
    expect(opts.model).to.equal('claude-sonnet-4-6')
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = makeCommand(['hi', '--toon'])
    stub(cmd, 'readLine').resolves('exit')
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })

  it('applies workspace context to chat options when workspace has repos', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a'}})
    buildWorkspaceContextStub.resolves({
      additionalDirectories: ['/code/repo-a'],
      cwd: '/code',
      systemPrompt: 'Workspace directories:\n  repo-a: ~/code/repo-a',
    })

    const cmd = makeCommand(['hi', '--workspace', 'proj01'])
    stub(cmd, 'readLine').resolves('exit')
    stub(cmd, 'logJson')
    stub(cmd, 'log')

    await cmd.run()

    const wsArgs = buildWorkspaceContextStub.firstCall.args[0]
    expect(wsArgs.mode).to.equal('local')
    expect(wsArgs.workspaceLabel).to.equal('proj01')

    const opts = chatStub.firstCall.args[2]
    expect(opts.systemPrompt).to.include('repo-a')
    expect(opts.additionalDirectories).to.deep.equal(['/code/repo-a'])
    expect(opts.cwd).to.equal('/code')
  })

  it('errors instead of running when a requested workspace cannot be resolved', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a'}})
    buildWorkspaceContextStub.resolves()

    const cmd = makeCommand(['hi', '--workspace', 'proj01', '--repo', 'missing'])
    stub(cmd, 'logJson')

    let errored = false
    try {
      await cmd.run()
    } catch {
      errored = true
    }

    expect(errored).to.be.true
    expect(chatStub.called).to.be.false
  })
})
