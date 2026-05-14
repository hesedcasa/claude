/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent auth add', () => {
  let AgentAuthAdd: any
  let testConnectionStub: SinonStub
  let clearClientsStub: SinonStub
  let fsStub: Record<string, SinonStub>
  let actionStartStub: SinonStub
  let actionStopStub: SinonStub

  beforeEach(async () => {
    testConnectionStub = stub()
    clearClientsStub = stub()
    actionStartStub = stub()
    actionStopStub = stub()
    fsStub = {
      outputJSON: stub().resolves(),
      readJSON: stub().resolves({profiles: {}}),
    }

    const imported = await esmock('../../../../src/commands/claude/auth/add.js', {
      '../../../../src/agent/agent-client.js': {
        clearClients: clearClientsStub,
        testConnection: testConnectionStub,
      },
      '@inquirer/prompts': {input: stub().resolves('sk-ant-from-prompt')},
      '@oclif/core/ux': {action: {start: actionStartStub, stop: actionStopStub}},
      'fs-extra': {default: fsStub},
    })
    AgentAuthAdd = imported.default
  })

  it('writes config and shows success on valid auth', async () => {
    testConnectionStub.resolves({data: {apiUrl: 'default'}, success: true})

    const cmd = new AgentAuthAdd(
      ['--key', 'sk-ant-test', '--url', 'https://api.anthropic.com', '--profile', 'default'],
      {
        configDir: '/tmp/test-agent-config',
        root: process.cwd(),
        runHook: stub().resolves({failures: [], successes: []}),
      } as any,
    )
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(fsStub.outputJSON.calledOnce).to.be.true
    const writtenData = fsStub.outputJSON.firstCall.args[1]
    expect(writtenData.profiles.default.apiKey).to.equal('sk-ant-test')
    expect(writtenData.profiles.default.apiUrl).to.equal('https://api.anthropic.com')
    expect(writtenData.defaultProfile).to.equal('default')
    expect(testConnectionStub.calledOnce).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(actionStopStub.calledWith('✓ successful')).to.be.true
    expect(logStub.calledWith('Agent authentication added successfully')).to.be.true
    expect(result.success).to.be.true
  })

  it('writes config with owner-only permissions', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'default'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const writeOptions = fsStub.outputJSON.firstCall.args[2]
    expect(writeOptions.mode).to.equal(0o600)
  })

  it('shows error on failed auth test', async () => {
    testConnectionStub.resolves({error: '401', success: false})

    const cmd = new AgentAuthAdd(['--key', 'bad-key', '--url', '', '--profile', 'default'], {
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

  it('errors when profile already exists', async () => {
    fsStub.readJSON.resolves({profiles: {work: {apiKey: 'old', apiUrl: ''}}})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    stub(cmd, 'error').throws(new Error("Profile 'work' already exists. Use 'agent auth update' to modify it."))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(thrown?.message).to.equal("Profile 'work' already exists. Use 'agent auth update' to modify it.")
    expect(fsStub.outputJSON.called).to.be.false
  })

  it('sets first profile as default regardless of name', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const writtenData = fsStub.outputJSON.firstCall.args[1]
    expect(writtenData.defaultProfile).to.equal('work')
  })

  it('does not overwrite defaultProfile when adding a second profile', async () => {
    fsStub.readJSON.resolves({defaultProfile: 'work', profiles: {work: {apiKey: 'old', apiUrl: ''}}})
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'personal'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const writtenData = fsStub.outputJSON.firstCall.args[1]
    expect(writtenData.defaultProfile).to.equal('work')
  })

  it('includes profile name in success message for non-default profiles', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'work'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith("Agent authentication added as profile 'work' successfully")).to.be.true
  })

  it('writes model mappings to profile when model flags are provided', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(
      ['--key', 'sk-ant', '--url', '', '--profile', 'default', '--opus', 'claude-opus-4-7', '--sonnet', 'claude-sonnet-4-6', '--haiku', 'claude-haiku-4-5-20251001'],
      {
        configDir: '/tmp/test-agent-config',
        root: process.cwd(),
        runHook: stub().resolves({failures: [], successes: []}),
      } as any,
    )
    stub(cmd, 'log')

    await cmd.run()

    const writtenData = fsStub.outputJSON.firstCall.args[1]
    expect(writtenData.profiles.default.models).to.deep.equal({
      haiku: 'claude-haiku-4-5-20251001',
      opus: 'claude-opus-4-7',
      sonnet: 'claude-sonnet-4-6',
    })
  })

  it('does not include models key when no model flags are provided', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'default'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const writtenData = fsStub.outputJSON.firstCall.args[1]
    expect(writtenData.profiles.default.models).to.be.undefined
  })

  it('does not write config when connection test fails', async () => {
    testConnectionStub.resolves({error: '401', success: false})

    const cmd = new AgentAuthAdd(['--key', 'bad-key', '--url', '', '--profile', 'default'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    stub(cmd, 'error')

    await cmd.run()

    expect(fsStub.outputJSON.called).to.be.false
  })

  it('writes config with spaces: 2 for readability', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AgentAuthAdd(['--key', 'sk-ant', '--url', '', '--profile', 'default'], {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    const writeOptions = fsStub.outputJSON.firstCall.args[2]
    expect(writeOptions.spaces).to.equal(2)
  })
})
