/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('claude:acp:prompt', () => {
  let AcpPrompt: any
  let readAcpAgentStub: SinonStub
  let readAcpAgentsStub: SinonStub
  let peerOptions: any
  let peerCalls: string[]
  let loadSessionCapability: boolean
  let promptRejection: unknown
  let streamed: {text?: string[]; toolCall?: {status?: string; title?: string}[]}

  const makeCommand = (argv: string[]): any =>
    new AcpPrompt(argv, {
      bin: 'claude',
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)

  beforeEach(async () => {
    peerCalls = []
    peerOptions = undefined
    loadSessionCapability = true
    promptRejection = undefined
    streamed = {text: ['hello ', 'world'], toolCall: [{status: 'completed', title: 'Read'}]}
    readAcpAgentStub = stub().resolves({args: ['--experimental-acp'], command: 'gemini'})
    readAcpAgentsStub = stub().resolves({gemini: {command: 'gemini'}, other: {command: 'other'}})

    class FakeAcpPeer {
      constructor(options: any) {
        peerOptions = options
      }

      async close(): Promise<void> {
        peerCalls.push('close')
      }

      async loadSession(sessionId: string): Promise<void> {
        peerCalls.push(`loadSession:${sessionId}`)
      }

      async newSession(): Promise<string> {
        peerCalls.push('newSession')
        return 'peer-session-1'
      }

      async prompt(sessionId: string, text: string): Promise<{stopReason: string}> {
        peerCalls.push(`prompt:${sessionId}:${text}`)

        if (promptRejection !== undefined) throw promptRejection
        for (const chunk of streamed.text ?? []) peerOptions.onText?.(chunk)
        for (const call of streamed.toolCall ?? []) peerOptions.onToolCall?.({...call, toolCallId: 't1'})
        peerOptions.onPermission?.({optionId: 'allow', title: 'Write file'})
        return {stopReason: 'end_turn'}
      }

      async start(): Promise<any> {
        peerCalls.push('start')
        return {agentCapabilities: {loadSession: loadSessionCapability}, protocolVersion: 1}
      }
    }

    const imported = await esmock('../../../../src/commands/claude/acp/prompt.js', {
      '../../../../src/acp/acp-client.js': {AcpPeer: FakeAcpPeer},
      '../../../../src/acp/acp-config.js': {readAcpAgent: readAcpAgentStub, readAcpAgents: readAcpAgentsStub},
    })
    AcpPrompt = imported.default
  })

  it('runs a registered peer agent and returns the collected answer', async () => {
    const cmd = makeCommand(['gemini', 'What changed?'])
    const log = stub(cmd, 'log')

    const result = await cmd.run()

    expect(readAcpAgentStub.firstCall.args).to.deep.equal(['/tmp/test-config', 'gemini'])
    expect(peerOptions.command).to.equal('gemini')
    expect(peerOptions.args).to.deep.equal(['--experimental-acp'])
    expect(peerCalls).to.deep.equal(['start', 'newSession', 'prompt:peer-session-1:What changed?', 'close'])
    expect(result).to.deep.equal({
      agent: 'gemini',
      protocolVersion: 1,
      sessionId: 'peer-session-1',
      stopReason: 'end_turn',
      text: 'hello world',
    })

    const logged = log.getCalls().map((call) => call.args[0])
    expect(logged).to.include('hello ')
    expect(logged).to.include('[tool: Read (completed)]')
    expect(logged).to.include('[permission: Write file -> allow]')
    expect(logged.at(-1)).to.contain('finished: end_turn')
  })

  it('suppresses streamed output in JSON mode', async () => {
    const cmd = makeCommand(['gemini', 'hi', '--json'])
    const log = stub(cmd, 'log')

    const result = await cmd.run()

    expect(log.called).to.be.false
    expect(result.text).to.equal('hello world')
  })

  it('uses an inline --command peer instead of the registry', async () => {
    const cmd = makeCommand(['inline', 'hi', '--command', 'my-agent', '--arg', '--acp', '--env', 'TOKEN=abc'])
    stub(cmd, 'log')

    await cmd.run()

    expect(readAcpAgentStub.called).to.be.false
    expect(peerOptions.command).to.equal('my-agent')
    expect(peerOptions.args).to.deep.equal(['--acp'])
    expect(peerOptions.env).to.deep.equal({TOKEN: 'abc'})
  })

  it('forwards the permission policy and read-only choice to the peer', async () => {
    const cmd = makeCommand(['gemini', 'hi', '--permission', 'reject', '--read-only', '--cwd', '/work'])
    stub(cmd, 'log')

    await cmd.run()

    expect(peerOptions.permission).to.equal('reject')
    expect(peerOptions.fsWrite).to.be.false
    expect(peerOptions.cwd).to.equal('/work')
  })

  it('defaults to allowing tool permission requests', async () => {
    const cmd = makeCommand(['gemini', 'hi'])
    stub(cmd, 'log')

    await cmd.run()

    expect(peerOptions.permission).to.equal('allow')
    expect(peerOptions.fsWrite).to.be.true
  })

  it('resumes an existing peer session with --session', async () => {
    const cmd = makeCommand(['gemini', 'hi', '--session', 'earlier'])
    stub(cmd, 'log')

    const result = await cmd.run()

    expect(peerCalls).to.deep.equal(['start', 'loadSession:earlier', 'prompt:earlier:hi', 'close'])
    expect(result.sessionId).to.equal('earlier')
  })

  it('errors when the peer cannot resume sessions', async () => {
    loadSessionCapability = false
    const cmd = makeCommand(['gemini', 'hi', '--session', 'earlier'])
    stub(cmd, 'log')

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain('does not support resuming sessions')
    }

    expect(peerCalls).to.include('close')
  })

  it('errors with the known agent names when the name is not registered', async () => {
    readAcpAgentStub.resolves()
    const cmd = makeCommand(['missing', 'hi'])
    stub(cmd, 'log')

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain("'missing' is not registered")
      expect(error.message).to.contain('gemini, other')
    }
  })

  it('points at acp add when nothing is registered yet', async () => {
    readAcpAgentStub.resolves()
    readAcpAgentsStub.resolves()
    const cmd = makeCommand(['missing', 'hi'])
    stub(cmd, 'log')

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain('acp add')
    }
  })

  it('reports a JSON-RPC rejection from the peer, which is not an Error', async () => {
    promptRejection = {code: -32_603, data: {error: 'model unavailable'}, message: 'Internal error'}
    const cmd = makeCommand(['gemini', 'hi'])
    stub(cmd, 'log')

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain("Peer agent 'gemini' failed")
      expect(error.message).to.contain('Internal error [-32603]')
      expect(error.message).to.contain('model unavailable')
    }

    expect(peerCalls).to.include('close')
  })

  it('rejects a malformed --env entry', async () => {
    const cmd = makeCommand(['gemini', 'hi', '--env', 'BROKEN'])
    stub(cmd, 'log')

    try {
      await cmd.run()
      expect.fail('expected an error')
    } catch (error: any) {
      expect(error.message).to.contain('Invalid env format')
    }
  })
})
