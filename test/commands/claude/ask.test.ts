/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:ask', () => {
  let AgentAsk: any
  let loadAgentConfigStub: SinonStub
  let readWorkspaceStub: SinonStub
  let buildWorkspaceContextStub: SinonStub
  let askStub: SinonStub
  let clearClientsStub: SinonStub
  let formatAsToonStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockUsage = {costUsd: 0.0123, durationMs: 4321, inputTokens: 1500, numTurns: 3, outputTokens: 250}
  const mockResult = {
    data: {result: 'The capital of France is Paris.', toolsUsed: [], usage: mockUsage},
    success: true,
  }

  before(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkspaceStub = stub().resolves()
    buildWorkspaceContextStub = stub().resolves()
    askStub = stub().resolves(mockResult)
    clearClientsStub = stub()
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/claude/ask.js', {
      '../../../src/agent/agent-client.js': {ask: askStub, clearClients: clearClientsStub},
      '../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
      '../../../src/workspace-bash.js': {buildWorkspaceContext: buildWorkspaceContextStub},
      '../../../src/workspace-config.js': {readWorkspace: readWorkspaceStub},
      '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
    })
    AgentAsk = imported.default
  })

  after(() => {
    esmock.purge(AgentAsk)
  })

  beforeEach(() => {
    loadAgentConfigStub.reset()
    loadAgentConfigStub.resolves(mockAuth)
    readWorkspaceStub.reset()
    readWorkspaceStub.resolves()
    buildWorkspaceContextStub.reset()
    buildWorkspaceContextStub.resolves()
    askStub.reset()
    askStub.resolves(mockResult)
    clearClientsStub.reset()
    formatAsToonStub.reset()
    formatAsToonStub.returns('toon-output')
  })

  it('calls ask with the prompt and outputs JSON', async () => {
    const cmd = new AgentAsk(['What is the capital of France?'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(askStub.calledOnce).to.be.true
    expect(askStub.firstCall.args[0]).to.deep.equal(mockAuth)
    expect(askStub.firstCall.args[1]).to.equal('What is the capital of France?')
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.called).to.be.false
  })

  it('does not log a summary line when result has no usage', async () => {
    askStub.resolves({data: {result: 'hi', toolsUsed: []}, success: true})

    const cmd = new AgentAsk(['hi'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    const summaryCalls = logStub.getCalls().filter((c) => String(c.args[0] ?? '').startsWith('Tokens: '))
    expect(summaryCalls).to.have.length(0)
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new AgentAsk(['hi'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('parses --allow-tools into an array', async () => {
    const cmd = new AgentAsk(['list files', '--allow-tools', 'Read, Glob , Edit'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.allowedTools).to.deep.equal(['Read', 'Glob', 'Edit'])
  })

  it('passes --system as systemPrompt', async () => {
    const cmd = new AgentAsk(['hi', '--system', 'Be brief.'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.systemPrompt).to.equal('Be brief.')
  })

  it('wires onText callback when --stream is set', async () => {
    const cmd = new AgentAsk(['hi', '--stream'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.onText).to.be.a('function')
    expect(opts.onToolUse).to.be.a('function')

    opts.onText('hello-stream')
    expect(logStub.calledWith('hello-stream')).to.be.true
    opts.onToolUse('Read')
    expect(logStub.calledWith('[tool: Read]')).to.be.true
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new AgentAsk(['hi', '--toon'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })

  it('passes --model to ask options', async () => {
    const cmd = new AgentAsk(['hi', '--model', 'claude-opus-4-7'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.model).to.equal('claude-opus-4-7')
  })

  it('passes --profile to loadAgentConfig', async () => {
    const cmd = new AgentAsk(['hi', '--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.firstCall.args[2]).to.equal('work')
  })

  it('resolves model shorthand from config.models', async () => {
    loadAgentConfigStub.resolves({
      ...mockAuth,
      models: {haiku: 'claude-haiku-4-5-20251001', opus: 'claude-opus-4-7', sonnet: 'claude-sonnet-4-6'},
    })

    const cmd = new AgentAsk(['hi', '--model', 'sonnet'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.model).to.equal('claude-sonnet-4-6')
  })

  it('passes full model ID through unchanged when not a shorthand', async () => {
    const cmd = new AgentAsk(['hi', '--model', 'claude-opus-4-7'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.model).to.equal('claude-opus-4-7')
  })

  it('applies workspace context to ask options when workspace has repos', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a', 'repo-b': '~/code/repo-b'}})
    buildWorkspaceContextStub.resolves({
      additionalDirectories: ['/code/repo-a', '/code/repo-b'],
      cwd: '/code',
      systemPrompt: 'Workspace directories:\n  repo-a: ~/code/repo-a\n  repo-b: ~/code/repo-b',
    })

    const cmd = new AgentAsk(['summarise changes', '--workspace', 'proj01'], {
      configDir: '/tmp/test-agent-config',
      dataDir: '/tmp/test-agent-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const wsArgs = buildWorkspaceContextStub.firstCall.args[0]
    expect(wsArgs.mode).to.equal('local')
    expect(wsArgs.repos).to.deep.equal({'repo-a': '~/code/repo-a', 'repo-b': '~/code/repo-b'})
    expect(wsArgs.workspaceLabel).to.equal('proj01')

    const opts = askStub.firstCall.args[2]
    expect(opts.systemPrompt).to.include('repo-a')
    expect(opts.additionalDirectories).to.deep.equal(['/code/repo-a', '/code/repo-b'])
    expect(opts.cwd).to.equal('/code')
    expect(opts.sandboxExec).to.be.undefined
  })

  it('uses the workspace-configured sandbox mode and forwards sandboxExec to ask options', async () => {
    readWorkspaceStub.resolves({mode: 'sandbox', repos: {'repo-a': '~/code/repo-a'}})
    const sandboxExec = stub()
    buildWorkspaceContextStub.resolves({sandboxExec, systemPrompt: 'sandboxed'})

    const cmd = new AgentAsk(['hi', '--workspace', 'proj01', '--repo', 'repo-a'], {
      configDir: '/tmp/test-agent-config',
      dataDir: '/tmp/test-agent-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const wsArgs = buildWorkspaceContextStub.firstCall.args[0]
    expect(wsArgs.mode).to.equal('sandbox')
    expect(wsArgs.repoFilter).to.equal('repo-a')

    const opts = askStub.firstCall.args[2]
    expect(opts.sandboxExec).to.equal(sandboxExec)
    expect(opts.systemPrompt).to.equal('sandboxed')
    expect(opts.additionalDirectories).to.be.undefined
  })

  it('does not set workspace context when buildWorkspaceContext returns undefined', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a'}})
    buildWorkspaceContextStub.resolves()

    const cmd = new AgentAsk(['hi', '--workspace', 'proj01', '--repo', 'missing'], {
      configDir: '/tmp/test-agent-config',
      dataDir: '/tmp/test-agent-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.additionalDirectories).to.be.undefined
    expect(opts.sandboxExec).to.be.undefined
  })
})
