/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:auth:update', () => {
  let AgentAuthUpdate: any
  let testConnectionStub: SinonStub
  let clearClientsStub: SinonStub
  let fsStub: Record<string, SinonStub>
  let actionStartStub: SinonStub
  let actionStopStub: SinonStub

  const existing = {profiles: {default: {apiKey: 'old-key', apiUrl: 'https://old.example.com'}}}

  beforeEach(async () => {
    testConnectionStub = stub()
    clearClientsStub = stub()
    actionStartStub = stub()
    actionStopStub = stub()
    fsStub = {
      readJSON: stub().resolves(existing),
      writeJSON: stub().resolves(),
    }

    const imported = await esmock('../../../../src/commands/claude/auth/update.js', {
      '../../../../src/agent/agent-client.js': {
        clearClients: clearClientsStub,
        testConnection: testConnectionStub,
      },
      '@inquirer/prompts': {input: stub().resolves('prompted')},
      '@oclif/core/ux': {action: {start: actionStartStub, stop: actionStopStub}},
      'fs-extra': {default: fsStub},
    })
    AgentAuthUpdate = imported.default
  })

  it('writes updated config for the default profile', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthUpdate(['--key', 'new-key', '--url', 'https://new.example.com'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(fsStub.writeJSON.calledOnce).to.be.true
    const written = fsStub.writeJSON.firstCall.args[1]
    expect(written.profiles.default.apiKey).to.equal('new-key')
    expect(written.profiles.default.apiUrl).to.equal('https://new.example.com')
    expect(logStub.calledWith('Agent authentication updated successfully')).to.be.true
  })

  it('writes updated config for a named profile', async () => {
    testConnectionStub.resolves({data: {}, success: true})
    fsStub.readJSON.resolves({profiles: {work: {apiKey: 'old-work', apiUrl: 'https://work.example.com'}}})

    const cmd = new AgentAuthUpdate(['--key', 'new-work', '--url', 'https://new-work.example.com', '--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    const written = fsStub.writeJSON.firstCall.args[1]
    expect(written.profiles.work.apiKey).to.equal('new-work')
    expect(logStub.calledWith("Agent authentication for profile 'work' updated successfully")).to.be.true
  })

  it('writes with owner-only permissions', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthUpdate(['--key', 'new-key'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const writeOptions = fsStub.writeJSON.firstCall.args[2]
    expect(writeOptions.mode).to.equal(0o600)
  })

  it('logs hint when no existing config file', async () => {
    fsStub.readJSON.rejects(new Error('ENOENT: no such file or directory'))

    const cmd = new AgentAuthUpdate(['--key', 'new'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith("Run 'agent auth add' instead")).to.be.true
    expect(fsStub.writeJSON.called).to.be.false
  })

  it('shows error on failed auth test', async () => {
    testConnectionStub.resolves({error: '401', success: false})

    const cmd = new AgentAuthUpdate(['--key', 'bad-key'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error')

    await cmd.run()

    expect(actionStopStub.calledWith('✗ failed')).to.be.true
    expect(errorStub.calledWith('Agent authentication is invalid. Please check your API key and URL.')).to.be.true
  })

  it('writes model mappings when model flags are provided', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthUpdate(
      ['--key', 'new-key', '--url', '', '--opus', 'claude-opus-4-7', '--sonnet', 'claude-sonnet-4-6', '--haiku', 'claude-haiku-4-5-20251001'],
      {
        configDir: '/tmp/test-agent-config',
        root: process.cwd(),
        runHook: stub().resolves({failures: [], successes: []}),
      } as any,
    )
    stub(cmd, 'log')

    await cmd.run()

    const written = fsStub.writeJSON.firstCall.args[1]
    expect(written.profiles.default.models).to.deep.equal({
      haiku: 'claude-haiku-4-5-20251001',
      opus: 'claude-opus-4-7',
      sonnet: 'claude-sonnet-4-6',
    })
  })

  it('preserves existing models when no model flags are provided', async () => {
    testConnectionStub.resolves({data: {}, success: true})
    fsStub.readJSON.resolves({
      profiles: {
        default: {apiKey: 'old-key', apiUrl: '', models: {opus: 'claude-opus-4-7', sonnet: 'claude-sonnet-4-6'}},
      },
    })

    const cmd = new AgentAuthUpdate(['--key', 'new-key', '--url', ''], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const written = fsStub.writeJSON.firstCall.args[1]
    expect(written.profiles.default.models).to.deep.equal({opus: 'claude-opus-4-7', sonnet: 'claude-sonnet-4-6'})
  })

  it('clears a model mapping when flag is set to empty string', async () => {
    testConnectionStub.resolves({data: {}, success: true})
    fsStub.readJSON.resolves({
      profiles: {
        default: {apiKey: 'old-key', apiUrl: '', models: {haiku: 'claude-haiku-4-5-20251001', opus: 'claude-opus-4-7'}},
      },
    })

    const cmd = new AgentAuthUpdate(['--key', 'new-key', '--url', '', '--opus', ''], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const written = fsStub.writeJSON.firstCall.args[1]
    expect(written.profiles.default.models).to.deep.equal({haiku: 'claude-haiku-4-5-20251001'})
    expect(written.profiles.default.models.opus).to.be.undefined
  })
})
