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
  let formatAsToonStub: SinonStub
  let writeCapabilityStoreStub: SinonStub

  const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
  const mockData = {
    agents: ['code-reviewer'],
    commands: ['help', 'clear'],
    mcpServers: [{name: 'github', status: 'connected'}],
    skills: ['init', 'review'],
    tools: ['Read', 'Edit'],
  }
  const mockResult = {data: mockData, success: true}

  beforeEach(async () => {
    loadAgentConfigStub = stub().resolves(mockAuth)
    readWorkspaceStub = stub().resolves()
    listStub = stub().resolves(mockResult)
    clearClientsStub = stub()
    formatAsToonStub = stub().returns('toon-output')
    writeCapabilityStoreStub = stub().resolves()

    const imported = await esmock(
      '../../../../src/commands/claude/list/index.js',
      {},
      {
        '../../../../src/agent/agent-client.js': {clearClients: clearClientsStub, list: listStub},
        '../../../../src/agent/profile-config.js': {loadAgentConfig: loadAgentConfigStub},
        '../../../../src/capability-commands.js': {writeCapabilityStore: writeCapabilityStoreStub},
        '../../../../src/workspace-config.js': {
          commonParentDir: (dirs: string[]) => dirs[0] ?? process.cwd(),
          expandPath: (p: string) => p,
          readWorkspace: readWorkspaceStub,
        },
        '@hesed/plugin-lib': {formatAsToon: formatAsToonStub},
      },
    )
    AgentList = imported.default
  })

  it('lists all categories and outputs JSON', async () => {
    const cmd = new AgentList([], {
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
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
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

  it('outputs TOON format when --toon is used', async () => {
    const cmd = new AgentList(['--toon'], {
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
    const cmd = new AgentList(['--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
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
    stub(cmd, 'logJson')

    await cmd.run()

    expect(writeCapabilityStoreStub.calledOnce).to.be.true
    expect(writeCapabilityStoreStub.firstCall.args[0]).to.equal('/tmp/test-agent-cache')
    expect(writeCapabilityStoreStub.firstCall.args[1]).to.deep.equal({
      commands: ['help', 'clear'],
      skills: ['init', 'review'],
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
    stub(cmd, 'logJson')

    await cmd.run()

    expect(writeCapabilityStoreStub.called).to.be.false
  })

  it('passes workspace directories to list options', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '~/code/repo-a', 'repo-b': '~/code/repo-b'}})

    const cmd = new AgentList(['--workspace', 'proj01'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'logJson')

    await cmd.run()

    expect(readWorkspaceStub.firstCall.args[2]).to.equal('proj01')
    const opts = listStub.firstCall.args[1]
    expect(opts.cwd).to.equal('~/code/repo-a')
    expect(opts.additionalDirectories).to.deep.equal(['~/code/repo-a', '~/code/repo-b'])
  })
})
