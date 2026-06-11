/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:run', () => {
  let AgentRun: any
  let loadAgentConfigStub: SinonStub
  let readWorkspaceStub: SinonStub
  let buildWorkspaceContextStub: SinonStub
  let runStub: SinonStub
  let clearClientsStub: SinonStub
  let formatAsToonStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockUsage = {costUsd: 0.0123, durationMs: 4321, inputTokens: 1500, numTurns: 3, outputTokens: 250}
  const mockResult = {data: {result: 'done', toolsUsed: [], usage: mockUsage}, success: true}

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkspaceStub = stub().resolves()
    buildWorkspaceContextStub = stub().resolves()
    runStub = stub().resolves(mockResult)
    clearClientsStub = stub()
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/claude/run.js', {
      '../../../src/agent/agent-client.js': {clearClients: clearClientsStub, run: runStub},
      '../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
      '../../../src/workspace-bash.js': {buildWorkspaceContext: buildWorkspaceContextStub},
      '../../../src/workspace-config.js': {readWorkspace: readWorkspaceStub},
      '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
    })
    AgentRun = imported.default
  })

  it('forwards slash command name and outputs JSON without appending summary to stdout', async () => {
    const cmd = new AgentRun(['/help'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(runStub.calledOnce).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
    const summaryCalls = logStub.getCalls().filter((c) => String(c.args[0] ?? '').startsWith('Tokens: '))
    expect(summaryCalls).to.have.length(0)
  })

  it('does not log a summary line when result has no usage', async () => {
    runStub.resolves({data: {result: 'done', toolsUsed: []}, success: true})

    const cmd = new AgentRun(['/help'], {
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

  it('passes the optional input arg through', async () => {
    const cmd = new AgentRun(['review', 'check this branch'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(runStub.firstCall.args[1]).to.equal('review')
    expect(runStub.firstCall.args[2]).to.equal('check this branch')
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new AgentRun(['/help'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(runStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('parses --allow-tools into an array', async () => {
    const cmd = new AgentRun(['review', 'go', '--allow-tools', 'Read, Glob , Edit'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = runStub.firstCall.args[3]
    expect(opts.allowedTools).to.deep.equal(['Read', 'Glob', 'Edit'])
  })

  it('wires onText callback when --stream is set', async () => {
    const cmd = new AgentRun(['/help', '--stream'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = runStub.firstCall.args[3]
    expect(opts.onText).to.be.a('function')
    opts.onText('streamed-chunk')
    expect(logStub.calledWith('streamed-chunk')).to.be.true
    opts.onToolUse('Read')
    expect(logStub.calledWith('[tool: Read]')).to.be.true
  })

  it('outputs TOON format when --toon is used', async () => {
    const cmd = new AgentRun(['/help', '--toon'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(logStub.calledWith('toon-output')).to.be.true
  })

  it('passes --profile to loadAgentConfig', async () => {
    const cmd = new AgentRun(['/help', '--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.firstCall.args[2]).to.equal('work')
  })

  it('applies workspace context for a sandbox-mode workspace', async () => {
    readWorkspaceStub.resolves({mode: 'sandbox', repos: {'repo-a': 'https://github.com/org/repo-a.git'}})
    const sandboxExec = stub()
    buildWorkspaceContextStub.resolves({sandboxExec, systemPrompt: 'sandboxed'})

    const cmd = new AgentRun(['review', 'this repo', '--workspace', 'proj01'], {
      configDir: '/tmp/test-agent-config',
      dataDir: '/tmp/test-agent-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(readWorkspaceStub.firstCall.args[2]).to.equal('proj01')
    const wsArgs = buildWorkspaceContextStub.firstCall.args[0]
    expect(wsArgs.mode).to.equal('sandbox')
    expect(wsArgs.workspaceLabel).to.equal('proj01')

    const opts = runStub.firstCall.args[3]
    expect(opts.sandboxExec).to.equal(sandboxExec)
    expect(opts.systemPrompt).to.equal('sandboxed')
  })
})
