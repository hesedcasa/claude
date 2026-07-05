/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workflow:run', () => {
  let AgentWorkflowRun: any
  let loadAgentConfigStub: SinonStub
  let readWorkflowStub: SinonStub
  let readWorkspaceStub: SinonStub
  let buildWorkspaceContextStub: SinonStub
  let askStub: SinonStub
  let clearClientsStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockResult = {data: {result: 'done', toolsUsed: []}, success: true}
  const mockWorkflow = {prompt: 'Review all recent changes', skills: ['review']}

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkflowStub = stub().resolves(mockWorkflow)
    readWorkspaceStub = stub().resolves()
    buildWorkspaceContextStub = stub().resolves()
    askStub = stub().resolves(mockResult)
    clearClientsStub = stub()

    const imported = await esmock('../../../../src/commands/claude/workflow/run.js', {
      '../../../../src/agent/agent-client.js': {ask: askStub, clearClients: clearClientsStub},
      '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
      '../../../../src/workflow-config.js': {readWorkflow: readWorkflowStub},
      '../../../../src/workspace-bash.js': {buildWorkspaceContext: buildWorkspaceContextStub},
      '../../../../src/workspace-config.js': {readWorkspace: readWorkspaceStub},
    })
    AgentWorkflowRun = imported.default
  })

  it('runs the workflow prompt and outputs JSON', async () => {
    const cmd = new AgentWorkflowRun(['daily-review'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(readWorkflowStub.firstCall.args).to.deep.equal(['/tmp/test-config', 'daily-review'])
    expect(askStub.calledOnce).to.be.true
    expect(askStub.firstCall.args[1]).to.equal('Review all recent changes')
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('appends additional input to the workflow prompt', async () => {
    const cmd = new AgentWorkflowRun(['daily-review', 'focus on auth module'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.firstCall.args[1]).to.equal('Review all recent changes\n\nfocus on auth module')
  })

  it('passes workflow skills to ask', async () => {
    const cmd = new AgentWorkflowRun(['daily-review'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.skills).to.deep.equal(['review'])
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new AgentWorkflowRun(['daily-review'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('errors when workflow does not exist', async () => {
    readWorkflowStub.resolves()

    const cmd = new AgentWorkflowRun(['missing-workflow'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')
    stub(cmd, 'error').throws(new Error("Workflow 'missing-workflow' does not exist."))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(thrown?.message).to.include("Workflow 'missing-workflow' does not exist.")
    expect(askStub.called).to.be.false
  })

  it('uses the workflow workspace when no --workspace flag is given', async () => {
    readWorkflowStub.resolves({prompt: 'Review changes', workspace: 'proj01'})
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '/code/repo-a'}})
    buildWorkspaceContextStub.resolves({additionalDirectories: ['/code/repo-a'], cwd: '/code', systemPrompt: 'ctx'})

    const cmd = new AgentWorkflowRun(['daily-review'], {
      configDir: '/tmp/test-config',
      dataDir: '/tmp/test-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(readWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    const wsArgs = buildWorkspaceContextStub.firstCall.args[0]
    expect(wsArgs.mode).to.equal('local')
    expect(wsArgs.workspaceLabel).to.equal('proj01')
  })

  it('--workspace flag overrides the workflow workspace', async () => {
    readWorkflowStub.resolves({prompt: 'Review changes', workspace: 'proj01'})
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-b': '/code/repo-b'}})
    buildWorkspaceContextStub.resolves({cwd: '/code', systemPrompt: 'ctx'})

    const cmd = new AgentWorkflowRun(['daily-review', '--workspace', 'proj02'], {
      configDir: '/tmp/test-config',
      dataDir: '/tmp/test-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(readWorkspaceStub.firstCall.args[1]).to.equal('proj02')
    expect(buildWorkspaceContextStub.firstCall.args[0].workspaceLabel).to.equal('proj02')
  })

  it('wires onText callback when --stream is set', async () => {
    const cmd = new AgentWorkflowRun(['daily-review', '--stream'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.onText).to.be.a('function')
    opts.onText('streamed-chunk')
    expect(logStub.calledWith('streamed-chunk')).to.be.true
    opts.onToolUse('Read')
    expect(logStub.calledWith('[tool: Read]')).to.be.true
  })

  it('passes --profile to loadAgentConfig', async () => {
    const cmd = new AgentWorkflowRun(['daily-review', '--profile', 'work'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.firstCall.args[2]).to.equal('work')
  })

  it('errors with a non-zero exit when the agent run fails', async () => {
    askStub.resolves({error: 'agent blew up', success: false})

    const cmd = new AgentWorkflowRun(['daily-review'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')
    const errorStub = stub(cmd, 'error').throws(new Error('agent blew up'))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(thrown?.message).to.include('agent blew up')
    expect(errorStub.firstCall.args[0]).to.equal('agent blew up')
  })

  it('errors with a fallback message when the failure has no string error', async () => {
    askStub.resolves({error: {code: 500}, success: false})

    const cmd = new AgentWorkflowRun(['daily-review'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')
    const errorStub = stub(cmd, 'error').throws(new Error('Workflow run failed.'))

    try {
      await cmd.run()
    } catch {
      // expected
    }

    expect(errorStub.firstCall.args[0]).to.equal('Workflow run failed.')
  })

  it('parses --allow-tools into an array', async () => {
    const cmd = new AgentWorkflowRun(['daily-review', '--allow-tools', 'Read, Glob , Edit'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    const opts = askStub.firstCall.args[2]
    expect(opts.allowedTools).to.deep.equal(['Read', 'Glob', 'Edit'])
  })
})
