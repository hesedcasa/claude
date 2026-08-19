/* eslint-disable @typescript-eslint/no-explicit-any */
import * as acp from '@zed-industries/agent-client-protocol'
import {expect} from 'chai'
import fs from 'fs-extra'
import {EventEmitter} from 'node:events'
import path from 'node:path'
import {PassThrough} from 'node:stream'

import type {AcpPeerOptions} from '../../src/acp/acp-client.js'

import {AcpPeer, selectPermissionOption} from '../../src/acp/acp-client.js'
import {nodeStdioStream} from '../../src/acp/acp-stream.js'

/**
 * A stand-in for the peer's child process, backed by in-memory pipes. It has
 * to emit node-style events to stand in for a ChildProcess, so EventEmitter
 * is the right base class here even though EventTarget is usually preferred.
 */
// eslint-disable-next-line unicorn/prefer-event-target
class FakeChild extends EventEmitter {
  exitCode: null | number = null
  killed = false
  signalCode: null | string = null
  readonly stdin = new PassThrough()
  readonly stdout = new PassThrough()

  kill(): boolean {
    this.killed = true
    this.exitCode = 0
    setImmediate(() => this.emit('close'))
    return true
  }
}

const baseAgent = {
  async authenticate(): Promise<acp.AuthenticateResponse> {
    return {}
  },
  async cancel(): Promise<void> {},
  async initialize(): Promise<acp.InitializeResponse> {
    return {agentCapabilities: {loadSession: true}, protocolVersion: acp.PROTOCOL_VERSION}
  },
  async newSession(): Promise<acp.NewSessionResponse> {
    return {sessionId: 'peer-session'}
  },
  async prompt(): Promise<acp.PromptResponse> {
    return {stopReason: 'end_turn' as const}
  },
}

/**
 * Put a real agent-side connection on the other end of the peer's pipes, so
 * the client is tested against actual protocol traffic. The agent factory
 * receives the connection, which is how an ACP agent talks back to a client.
 */
function fakePeer(makeAgent: (connection: acp.AgentSideConnection) => Partial<acp.Agent> = () => ({})): {
  child: FakeChild
  spawnFn: AcpPeerOptions['spawnFn']
} {
  const child = new FakeChild()

  // Constructing the connection is what registers the handlers.
  // eslint-disable-next-line no-new
  new acp.AgentSideConnection(
    (connection) => ({...baseAgent, ...makeAgent(connection)}),
    nodeStdioStream({input: child.stdin, output: child.stdout}),
  )

  return {child, spawnFn: (() => child) as any}
}

/** Drive one permission round-trip and report what each side saw. */
async function runPermissionCase(policy: 'allow' | 'reject'): Promise<{announced: string[]; outcome: unknown}> {
  const options: acp.PermissionOption[] = [
    {kind: 'allow_once', name: 'Allow', optionId: 'yes'},
    {kind: 'reject_once', name: 'Reject', optionId: 'no'},
  ]
  let outcome: unknown
  const announced: string[] = []

  const {spawnFn} = fakePeer((connection) => ({
    async prompt(params: acp.PromptRequest) {
      const response = await connection.requestPermission({
        options,
        sessionId: params.sessionId,
        toolCall: {title: 'Write config', toolCallId: 't1'},
      })
      outcome = response.outcome
      return {stopReason: 'end_turn' as const}
    },
  }))

  const peer = new AcpPeer({
    command: 'fake',
    onPermission: ({optionId}) => announced.push(optionId),
    permission: policy,
    spawnFn,
  })

  await peer.start()
  await peer.prompt(await peer.newSession(), 'go')
  await peer.close()

  return {announced, outcome}
}

describe('acp-client', () => {
  describe('selectPermissionOption', () => {
    const options: acp.PermissionOption[] = [
      {kind: 'allow_always', name: 'Always allow', optionId: 'aa'},
      {kind: 'allow_once', name: 'Allow', optionId: 'a1'},
      {kind: 'reject_always', name: 'Never', optionId: 'ra'},
      {kind: 'reject_once', name: 'Reject', optionId: 'r1'},
    ]

    it('prefers the one-shot allow option', () => {
      expect(selectPermissionOption(options, 'allow')?.optionId).to.equal('a1')
    })

    it('prefers the one-shot reject option', () => {
      expect(selectPermissionOption(options, 'reject')?.optionId).to.equal('r1')
    })

    it('falls back to always-variants when no one-shot option is offered', () => {
      const only = [options[0], options[2]]
      expect(selectPermissionOption(only, 'allow')?.optionId).to.equal('aa')
      expect(selectPermissionOption(only, 'reject')?.optionId).to.equal('ra')
    })

    it('falls back to the first option when nothing matches the policy', () => {
      const odd: acp.PermissionOption[] = [{kind: 'allow_always', name: 'Always', optionId: 'x'}]
      expect(selectPermissionOption(odd, 'reject')?.optionId).to.equal('x')
    })

    it('returns undefined when the peer offers no options', () => {
      expect(selectPermissionOption([], 'allow')).to.be.undefined
    })
  })

  describe('AcpPeer', () => {
    let peer: AcpPeer | undefined

    afterEach(async () => {
      await peer?.close()
      peer = undefined
    })

    it('completes the handshake and opens a session', async () => {
      const {spawnFn} = fakePeer()

      peer = new AcpPeer({command: 'fake', spawnFn})
      const init = await peer.start()

      expect(init.protocolVersion).to.equal(acp.PROTOCOL_VERSION)
      expect(init.agentCapabilities?.loadSession).to.be.true
      expect(await peer.newSession()).to.equal('peer-session')
    })

    it('reports assistant text, thoughts, plans, and tool calls through handlers', async () => {
      const {spawnFn} = fakePeer((connection) => ({
        async prompt(params: acp.PromptRequest) {
          const {sessionId} = params
          await connection.sessionUpdate({
            sessionId,
            update: {content: {text: 'thinking', type: 'text'}, sessionUpdate: 'agent_thought_chunk'},
          })
          await connection.sessionUpdate({
            sessionId,
            update: {content: {text: 'the answer', type: 'text'}, sessionUpdate: 'agent_message_chunk'},
          })
          await connection.sessionUpdate({
            sessionId,
            update: {entries: [{content: 'step one', priority: 'medium', status: 'pending'}], sessionUpdate: 'plan'},
          })
          await connection.sessionUpdate({
            sessionId,
            update: {sessionUpdate: 'tool_call', status: 'pending', title: 'Read file', toolCallId: 't1'},
          })
          await connection.sessionUpdate({
            sessionId,
            update: {sessionUpdate: 'tool_call_update', status: 'completed', toolCallId: 't1'},
          })
          return {stopReason: 'end_turn' as const}
        },
      }))

      const text: string[] = []
      const thoughts: string[] = []
      const plans: unknown[] = []
      const toolCalls: {status?: string; title?: string}[] = []

      peer = new AcpPeer({
        command: 'fake',
        onPlan: (entries) => plans.push(entries),
        onText: (value) => text.push(value),
        onThought: (value) => thoughts.push(value),
        onToolCall: (event) => toolCalls.push({status: event.status, title: event.title}),
        spawnFn,
      })

      await peer.start()
      const response = await peer.prompt(await peer.newSession(), 'hello')

      expect(response.stopReason).to.equal('end_turn')
      expect(text).to.deep.equal(['the answer'])
      expect(thoughts).to.deep.equal(['thinking'])
      expect(plans).to.deep.equal([[{content: 'step one', status: 'pending'}]])
      expect(toolCalls).to.deep.equal([
        {status: 'pending', title: 'Read file'},
        {status: 'completed', title: undefined},
      ])
    })

    it('allows tool calls when the policy is allow', async () => {
      const {announced, outcome} = await runPermissionCase('allow')

      expect(outcome).to.deep.equal({optionId: 'yes', outcome: 'selected'})
      expect(announced).to.deep.equal(['yes'])
    })

    it('rejects tool calls when the policy is reject', async () => {
      const {announced, outcome} = await runPermissionCase('reject')

      expect(outcome).to.deep.equal({optionId: 'no', outcome: 'selected'})
      expect(announced).to.deep.equal(['no'])
    })

    it('forwards a loadSession request to the peer', async () => {
      let loaded: string | undefined
      const {spawnFn} = fakePeer(() => ({
        async loadSession(params: acp.LoadSessionRequest) {
          loaded = params.sessionId
          return {}
        },
      }))

      peer = new AcpPeer({command: 'fake', spawnFn})
      await peer.start()
      await peer.loadSession('earlier-session')

      expect(loaded).to.equal('earlier-session')
    })

    it('fails an in-flight request when the peer process dies', async () => {
      const {child, spawnFn} = fakePeer(() => ({
        async prompt() {
          // Never answers; the child's exit has to break the wait.
          return new Promise<acp.PromptResponse>(() => {})
        },
      }))

      peer = new AcpPeer({command: 'dead-peer', spawnFn})
      await peer.start()
      const sessionId = await peer.newSession()

      const pending = peer.prompt(sessionId, 'hello')
      child.emit('exit', 3, null)

      try {
        await pending
        expect.fail('expected the pending request to reject')
      } catch (error: any) {
        expect(error.message).to.contain("Peer agent 'dead-peer' exited with code 3")
      }
    })

    it('reports a peer that could not be started', async () => {
      const {child, spawnFn} = fakePeer(() => ({
        async prompt() {
          return new Promise<acp.PromptResponse>(() => {})
        },
      }))

      peer = new AcpPeer({command: 'missing-peer', spawnFn})
      await peer.start()
      const pending = peer.prompt(await peer.newSession(), 'hello')
      child.emit('error', new Error('spawn ENOENT'))

      try {
        await pending
        expect.fail('expected the pending request to reject')
      } catch (error: any) {
        expect(error.message).to.contain('could not be started: spawn ENOENT')
      }
    })

    it('refuses to send a prompt before start()', async () => {
      peer = new AcpPeer({command: 'fake', spawnFn: (() => new FakeChild()) as any})

      try {
        await peer.newSession()
        expect.fail('expected an error')
      } catch (error: any) {
        expect(error.message).to.contain('not connected')
      }
    })
  })

  describe('filesystem requests from the peer', () => {
    const testDir = path.join(process.cwd(), 'test-acp-peer-fs')
    const filePath = path.join(testDir, 'notes.txt')
    const target = path.join(testDir, 'written.txt')
    let peer: AcpPeer | undefined

    beforeEach(async () => {
      await fs.outputFile(filePath, 'line1\nline2\nline3\n')
    })

    afterEach(async () => {
      await peer?.close()
      peer = undefined
      await fs.remove(testDir)
    })

    it('serves whole files and line ranges', async () => {
      const reads: acp.ReadTextFileResponse[] = []
      const {spawnFn} = fakePeer((connection) => ({
        async prompt(params: acp.PromptRequest) {
          const {sessionId} = params
          reads.push(
            await connection.readTextFile({path: filePath, sessionId}),
            await connection.readTextFile({limit: 1, line: 2, path: filePath, sessionId}),
          )
          return {stopReason: 'end_turn' as const}
        },
      }))

      peer = new AcpPeer({command: 'fake', spawnFn})
      await peer.start()
      await peer.prompt(await peer.newSession(), 'read it')

      expect(reads[0].content).to.equal('line1\nline2\nline3\n')
      expect(reads[1].content).to.equal('line2')
    })

    it('writes files the peer asks it to write', async () => {
      const errors: string[] = []
      const {spawnFn} = fakePeer((connection) => ({
        async prompt(params: acp.PromptRequest) {
          try {
            await connection.writeTextFile({content: 'hello', path: target, sessionId: params.sessionId})
          } catch (error: any) {
            errors.push(String(error.message))
          }

          return {stopReason: 'end_turn' as const}
        },
      }))

      peer = new AcpPeer({command: 'fake', spawnFn})
      await peer.start()
      await peer.prompt(await peer.newSession(), 'write it')

      expect(errors).to.deep.equal([])
      expect(await fs.readFile(target, 'utf8')).to.equal('hello')
    })

    it('refuses writes for a read-only peer', async () => {
      const errors: string[] = []
      const {spawnFn} = fakePeer((connection) => ({
        async prompt(params: acp.PromptRequest) {
          try {
            await connection.writeTextFile({content: 'hello', path: target, sessionId: params.sessionId})
          } catch (error: any) {
            errors.push(String(error.message))
          }

          return {stopReason: 'end_turn' as const}
        },
      }))

      peer = new AcpPeer({command: 'fake', fsWrite: false, spawnFn})
      await peer.start()
      await peer.prompt(await peer.newSession(), 'write it')

      expect(errors).to.have.lengthOf(1)
      expect(await fs.pathExists(target)).to.be.false
    })
  })
})
