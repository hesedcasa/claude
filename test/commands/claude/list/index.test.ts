/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:list', () => {
  let AgentList: any
  let loadAgentConfigStub: SinonStub
  let readWorkspaceStub: SinonStub
  let listStub: SinonStub
  let clearClientsStub: SinonStub
  let writeCapabilityStoreStub: SinonStub
  let resolveCapabilityEntriesStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockData = {
    agents: ['code-reviewer'],
    capabilities: [
      {argumentHint: '[pr-number]', description: 'Review a PR (SDK)', name: 'review'},
      {argumentHint: '[<target>]', description: 'Simplify the changed code', name: 'simplify'},
    ],
    commands: ['help', 'clear'],
    mcpServers: [{name: 'github', status: 'connected'}],
    plugins: [{name: 'sentry', path: '/plugins/sentry'}],
    skills: ['simplify', 'review'],
    tools: ['Read', 'Edit'],
  }
  // Frontmatter resolved from disk: `review` has a description (which wins
  // over the SDK's), `simplify` is a bundled built-in with no file.
  const mockEntries = {
    commands: [{name: 'help'}, {name: 'clear'}],
    skills: [{name: 'simplify'}, {description: 'Review a PR (frontmatter)', name: 'review'}],
  }
  // Metadata and plugin paths are cache-only detail: list output omits them.
  const expectedGrouped = {
    agents: ['code-reviewer'],
    commands: ['help', 'clear'],
    mcpServers: ['github'],
    skills: ['simplify', 'review'],
    tools: ['Read', 'Edit'],
  }

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkspaceStub = stub().resolves()
    listStub = stub().resolves({data: {...mockData}, success: true})
    clearClientsStub = stub()
    writeCapabilityStoreStub = stub().resolves()
    resolveCapabilityEntriesStub = stub().resolves(mockEntries)

    const imported = await esmock(
      '../../../../src/commands/claude/list/index.js',
      {},
      {
        '../../../../src/agent/agent-client.js': {clearClients: clearClientsStub, list: listStub},
        '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
        '../../../../src/capability-commands.js': {writeCapabilityStore: writeCapabilityStoreStub},
        '../../../../src/capability-metadata.js': {resolveCapabilityEntries: resolveCapabilityEntriesStub},
        '../../../../src/workspace-config.js': {
          commonParentDir: (dirs: string[]) => dirs[0] ?? process.cwd(),
          expandPath: (p: string) => p,
          readWorkspace: readWorkspaceStub,
        },
      },
    )
    AgentList = imported.default
  })

  it('lists all categories as JSON with --json', async () => {
    const cmd = new AgentList(['--json'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.calledOnce).to.be.true
    expect(listStub.calledOnce).to.be.true
    expect(listStub.firstCall.args[0]).to.deep.equal(mockAuth)
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(expectedGrouped)
  })

  it('prints all categories as text by default', async () => {
    const cmd = new AgentList([], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    const lines = logStub.getCalls().map((call) => call.args[0])
    expect(lines).to.deep.equal([
      'Agents:',
      'code-reviewer',
      '',
      'Commands:',
      'help',
      'clear',
      '',
      'MCP Servers:',
      'github',
      '',
      'Skills:',
      'simplify',
      'review',
      '',
      'Tools:',
      'Read',
      'Edit',
      '',
    ])
  })

  it('returns early when config is missing', async () => {
    loadAgentConfigStub.resolves(null)

    const cmd = new AgentList([], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logJsonStub = stub(cmd, 'logJson')

    await cmd.run()

    expect(listStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('passes --profile to loadAgentConfig', async () => {
    const cmd = new AgentList(['--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    expect(loadAgentConfigStub.firstCall.args[2]).to.equal('work')
  })

  it('writes the capability cache after a successful list', async () => {
    const cmd = new AgentList([], {
      cacheDir: '/tmp/test-agent-cache',
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    expect(resolveCapabilityEntriesStub.calledOnce).to.be.true
    expect(resolveCapabilityEntriesStub.firstCall.args[0]).to.deep.include({
      commands: ['help', 'clear'],
      plugins: [{name: 'sentry', path: '/plugins/sentry'}],
      skills: ['simplify', 'review'],
    })
    expect(writeCapabilityStoreStub.calledOnce).to.be.true
    expect(writeCapabilityStoreStub.firstCall.args[0]).to.equal('/tmp/test-agent-cache')
    // supportedCommands metadata fills gaps (simplify); frontmatter wins
    // per field where both exist (review keeps its frontmatter description
    // and picks up the SDK argument hint).
    expect(writeCapabilityStoreStub.firstCall.args[1]).to.deep.equal({
      commands: [{name: 'help'}, {name: 'clear'}],
      skills: [
        {argumentHint: '[<target>]', description: 'Simplify the changed code', name: 'simplify'},
        {argumentHint: '[pr-number]', description: 'Review a PR (frontmatter)', name: 'review'},
      ],
    })
  })

  it('does not write the capability cache when list fails', async () => {
    listStub.resolves({error: 'boom', success: false})

    const cmd = new AgentList([], {
      cacheDir: '/tmp/test-agent-cache',
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    expect(writeCapabilityStoreStub.called).to.be.false
    expect(logStub.calledWith('Error: boom')).to.be.true
  })

  it('passes workspace directories to list options', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a', 'repo-b': '~/code/repo-b'}})

    const cmd = new AgentList(['--workspace', 'proj01'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    stub(cmd, 'logJson')

    await cmd.run()

    expect(readWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    const opts = listStub.firstCall.args[1]
    expect(opts.cwd).to.equal('~/code/repo-a')
    expect(opts.additionalDirectories).to.deep.equal(['~/code/repo-a', '~/code/repo-b'])
  })
})
