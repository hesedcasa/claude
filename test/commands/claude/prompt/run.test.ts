/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

const resolvePrompt = (prompts: Record<string, any>, name: string): [string, any] => {
  if (!prompts[name]) throw new Error(`Prompt '${name}' does not exist.`)
  return [name, prompts[name]]
}

describe('agent:prompt:run', () => {
  let PromptRun: any
  let readPromptsStub: SinonStub
  let loadAgentConfigStub: SinonStub
  let readWorkspaceStub: SinonStub
  let buildWorkspaceContextStub: SinonStub
  let askStub: SinonStub
  let clearClientsStub: SinonStub
  let formatAsToonStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockResult = {data: {result: 'done', toolsUsed: []}, success: true}

  beforeEach(async () => {
    readPromptsStub = stub().resolves({summarize: {body: 'Summarize the project', description: 'Summary'}})
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkspaceStub = stub().resolves()
    buildWorkspaceContextStub = stub().resolves()
    askStub = stub().resolves(mockResult)
    clearClientsStub = stub()
    formatAsToonStub = stub().returns('toon-output')

    const imported = await esmock('../../../../src/commands/claude/prompt/run.js', {
      '../../../../src/agent/agent-client.js': {ask: askStub, clearClients: clearClientsStub},
      '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
      '../../../../src/prompts-config.js': {readPrompts: readPromptsStub, resolvePrompt},
      '../../../../src/workspace-bash.js': {buildWorkspaceContext: buildWorkspaceContextStub},
      '../../../../src/workspace-config.js': {readWorkspace: readWorkspaceStub},
      '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
    })
    PromptRun = imported.default
  })

  it('sends the resolved prompt body to ask', async () => {
    const cmd = new PromptRun(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.calledOnce).to.be.true
    expect(askStub.firstCall.args[1]).to.equal('Summarize the project')
    expect(clearClientsStub.calledOnce).to.be.true
  })

  it("uses the prompt's saved system prompt when --system is not given", async () => {
    readPromptsStub.resolves({summarize: {body: 'Summarize the project', system: 'saved system'}})

    const cmd = new PromptRun(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.firstCall.args[2].systemPrompt).to.equal('saved system')
  })

  it('lets --system override the saved system prompt', async () => {
    readPromptsStub.resolves({summarize: {body: 'Summarize the project', system: 'saved system'}})

    const cmd = new PromptRun(['summarize', '--system', 'override system'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.firstCall.args[2].systemPrompt).to.equal('override system')
  })

  it('previews the prompt without calling the agent on --dry-run', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {}})
    const cmd = new PromptRun(['summarize', '--dry-run', '--profile', 'work', '--workspace', 'proj01'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.called).to.be.false
    expect(loadAgentConfigStub.called).to.be.false
    expect(logJsonStub.firstCall.args[0]).to.deep.equal({
      args: {},
      body: 'Summarize the project',
      name: 'summarize',
      profile: 'work',
      repo: undefined,
      system: undefined,
      workspace: 'proj01',
    })
  })

  it('renders {{placeholders}} from --arg into the body and system before calling ask', async () => {
    readPromptsStub.resolves({classify: {body: 'Classify: {{summary}}', system: 'Context: {{summary}}'}})

    const cmd = new PromptRun(['classify', '--arg', 'summary=Login fails'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.firstCall.args[1]).to.equal('Classify: Login fails')
    expect(askStub.firstCall.args[2].systemPrompt).to.equal('Context: Login fails')
  })

  it('errors instead of running when a required placeholder has no --arg', async () => {
    readPromptsStub.resolves({classify: {body: 'Classify: {{summary}} / {{description}}'}})

    const cmd = new PromptRun(['classify', '--arg', 'summary=only this'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(thrown?.message).to.include('description')
    expect(askStub.called).to.be.false
  })

  it('errors on a malformed --arg', async () => {
    const cmd = new PromptRun(['summarize', '--arg', 'noequals'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(thrown?.message).to.include('Expected name=value')
    expect(askStub.called).to.be.false
  })

  it('passes --profile to loadAgentConfig', async () => {
    const cmd = new PromptRun(['summarize', '--profile', 'work'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.firstCall.args[2]).to.equal('work')
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new PromptRun(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
  })

  it('parses --allow-tools into an array', async () => {
    const cmd = new PromptRun(['summarize', '--allow-tools', 'Read, Glob , Edit'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(askStub.firstCall.args[2].allowedTools).to.deep.equal(['Read', 'Glob', 'Edit'])
  })

  it('applies workspace context for a sandbox-mode workspace', async () => {
    readWorkspaceStub.resolves({mode: 'sandbox', repos: {'repo-a': 'https://github.com/org/repo-a.git'}})
    const sandboxExec = stub()
    buildWorkspaceContextStub.resolves({sandboxExec, systemPrompt: 'sandboxed'})

    const cmd = new PromptRun(['summarize', '--workspace', 'proj01'], {
      configDir: '/tmp/test-config',
      dataDir: '/tmp/test-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(readWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    const opts = askStub.firstCall.args[2]
    expect(opts.sandboxExec).to.equal(sandboxExec)
    expect(opts.systemPrompt).to.equal('sandboxed')
  })

  it('errors instead of running when a requested workspace cannot be resolved', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a'}})
    buildWorkspaceContextStub.resolves()

    const cmd = new PromptRun(['summarize', '--workspace', 'proj01'], {
      configDir: '/tmp/test-config',
      dataDir: '/tmp/test-data',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    let errored = false
    try {
      await cmd.run()
    } catch {
      errored = true
    }

    expect(errored).to.be.true
    expect(askStub.called).to.be.false
  })

  it('prints the result only (no metadata) by default', async () => {
    const cmd = new PromptRun(['summarize'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(logStub.calledWith('done')).to.be.true
    expect(logJsonStub.called).to.be.false
  })

  it('includes full metadata via logJson when --debug is used', async () => {
    const cmd = new PromptRun(['summarize', '--debug'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('outputs TOON format of the result only when --toon is used without --debug', async () => {
    const cmd = new PromptRun(['summarize', '--toon'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.equal('done')
    expect(logStub.calledWith('toon-output')).to.be.true
  })

  it('outputs TOON format of the full result when --toon and --debug are used', async () => {
    const cmd = new PromptRun(['summarize', '--toon', '--debug'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
