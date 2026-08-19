/* eslint-disable @typescript-eslint/no-explicit-any */
import * as acp from '@zed-industries/agent-client-protocol'
import {expect} from 'chai'
import {PassThrough} from 'node:stream'

import type {AskFn, HistoryFn, SessionInfoFn} from '../../src/acp/acp-agent.js'
import type {ApiResult, AskOptions} from '../../src/agent/agent-api.js'

import {promptToText, toSdkMcpServers} from '../../src/acp/acp-agent.js'
import {serveAcpOverStdio} from '../../src/acp/acp-serve.js'
import {nodeStdioStream} from '../../src/acp/acp-stream.js'

const config = {apiKey: 'sk-ant-test', apiUrl: ''}

interface Harness {
  connection: acp.ClientSideConnection
  stop(): void
  updates: acp.SessionNotification[]
}

/** A promise plus its resolver, for coordinating the async tests below. */
function deferred(): {promise: Promise<void>; resolve: () => void} {
  let resolve!: () => void
  const promise = new Promise<void>((r) => {
    resolve = r
  })
  return {promise, resolve}
}

/** A minimal client: it only records the notifications the agent sends. */
function recordingClient(updates: acp.SessionNotification[]): acp.Client {
  return {
    async requestPermission() {
      return {outcome: {outcome: 'cancelled' as const}}
    },
    async sessionUpdate(params: acp.SessionNotification) {
      updates.push(params)
    },
  }
}

/**
 * Wire a real client-side connection to a real agent-side connection over a
 * pair of in-memory pipes, so the tests exercise the actual JSON-RPC
 * transport rather than the agent class in isolation.
 */
function connect(options: {
  allowedTools?: string[]
  askFn?: AskFn
  historyFn?: HistoryFn
  infoFn?: SessionInfoFn
  model?: string
}): Harness {
  const clientToAgent = new PassThrough()
  const agentToClient = new PassThrough()
  const updates: acp.SessionNotification[] = []

  serveAcpOverStdio({...options, config, stdin: clientToAgent, stdout: agentToClient}).catch(() => {})

  const connection = new acp.ClientSideConnection(
    () => recordingClient(updates),
    nodeStdioStream({input: agentToClient, output: clientToAgent}),
  )

  return {
    connection,
    stop() {
      clientToAgent.end()
      agentToClient.end()
    },
    updates,
  }
}

/** Streams one text chunk, one tool call, and that call's result. */
const streamingAskFn: AskFn = async (_config, _prompt, options) => {
  options?.onText?.('Reading the file')
  // eslint-disable-next-line camelcase
  options?.onToolUse?.('Read', {id: 'call_1', input: {file_path: '/repo/README.md'}})
  options?.onToolResult?.({content: '# Title', toolUseId: 'call_1'})
  return {data: {result: 'done', sessionId: 'sdk-1', toolsUsed: ['Read']}, success: true}
}

/** Reports a tool call that failed. */
const failingToolAskFn: AskFn = async (_config, _prompt, options) => {
  options?.onToolUse?.('Bash', {id: 'call_9'})
  options?.onToolResult?.({content: 'boom', isError: true, toolUseId: 'call_9'})
  return {data: {result: 'done', sessionId: 'sdk-1'}, success: true}
}

/** Records the `resume` option each turn was given. */
function resumeTrackingAskFn(resumes: (string | undefined)[], sessionId: string): AskFn {
  return async (_config, _prompt, options) => {
    resumes.push(options?.resume)
    return {data: {result: 'ok', sessionId}, success: true}
  }
}

/** Records the prompt and options a turn was run with. */
function recordingAskFn(sink: {options?: AskOptions; prompt?: string}): AskFn {
  return async (_config, prompt, options) => {
    sink.options = options
    sink.prompt = prompt
    return {data: {result: 'ok', sessionId: 'sdk-1'}, success: true}
  }
}

/** Blocks until cancelled, signalling once the turn is under way. */
function blockingAskFn(started: () => void): AskFn {
  return async (_config, _prompt, options) => {
    started()
    await new Promise<void>((resolve) => {
      options?.abortController?.signal.addEventListener('abort', () => resolve())
    })
    return {error: 'aborted', success: false}
  }
}

/**
 * Blocks every turn until cancelled, signalling each start in order, so a
 * turn can be superseded by the next prompt while still in flight.
 */
function supersedingAskFn(starts: {resolve: () => void}[]): AskFn {
  let turn = 0
  return async (_config, _prompt, options) => {
    starts[turn]?.resolve()
    turn++
    await new Promise<void>((resolve) => {
      options?.abortController?.signal.addEventListener('abort', () => resolve())
    })
    return {error: 'aborted', success: false}
  }
}

function historyOf(messages: unknown[]): HistoryFn {
  return async (): Promise<ApiResult> => ({data: {messages}, success: true})
}

const sessionFound: SessionInfoFn = async (sessionId) => ({data: {sessionId}, success: true})
const sessionMissing: SessionInfoFn = async (sessionId) => ({
  error: `Session '${sessionId}' not found`,
  success: false,
})

describe('acp-agent', () => {
  let harness: Harness | undefined

  afterEach(() => {
    harness?.stop()
    harness = undefined
  })

  describe('ClaudeAcpAgent initialize', () => {
    it('advertises loadSession and echoes a supported protocol version', async () => {
      harness = connect({})

      const result = await harness.connection.initialize({
        clientCapabilities: {fs: {readTextFile: true, writeTextFile: true}},
        protocolVersion: acp.PROTOCOL_VERSION,
      })

      expect(result.protocolVersion).to.equal(acp.PROTOCOL_VERSION)
      expect(result.agentCapabilities?.loadSession).to.be.true
      expect(result.agentCapabilities?.promptCapabilities?.embeddedContext).to.be.true
    })

    it('caps the negotiated version at the version this agent implements', async () => {
      harness = connect({})

      const result = await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION + 5})

      expect(result.protocolVersion).to.equal(acp.PROTOCOL_VERSION)
    })
  })

  describe('ClaudeAcpAgent prompt', () => {
    it('streams assistant text, tool calls, and tool results to the client', async () => {
      harness = connect({askFn: streamingAskFn})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/repo', mcpServers: []})

      const response = await harness.connection.prompt({
        prompt: [{text: 'What does the readme say?', type: 'text'}],
        sessionId,
      })

      expect(response.stopReason).to.equal('end_turn')
      const kinds = harness.updates.map((u) => u.update.sessionUpdate)
      expect(kinds).to.deep.equal(['agent_message_chunk', 'tool_call', 'tool_call_update'])

      const [message, toolCall, toolResult] = harness.updates.map((u) => u.update as any)
      expect(message.content).to.deep.equal({text: 'Reading the file', type: 'text'})
      expect(toolCall.title).to.equal('Read')
      expect(toolCall.kind).to.equal('read')
      expect(toolCall.toolCallId).to.equal('call_1')
      expect(toolCall.locations).to.deep.equal([{path: '/repo/README.md'}])
      expect(toolResult.status).to.equal('completed')
      expect(toolResult.content).to.deep.equal([{content: {text: '# Title', type: 'text'}, type: 'content'}])
    })

    it('marks a failed tool call as failed', async () => {
      harness = connect({askFn: failingToolAskFn})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/repo', mcpServers: []})
      await harness.connection.prompt({prompt: [{text: 'run it', type: 'text'}], sessionId})

      const update = harness.updates.at(-1)!.update as any
      expect(update.sessionUpdate).to.equal('tool_call_update')
      expect(update.status).to.equal('failed')
    })

    it('resumes the SDK session the previous turn created', async () => {
      const resumes: (string | undefined)[] = []
      harness = connect({askFn: resumeTrackingAskFn(resumes, 'sdk-42')})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/repo', mcpServers: []})

      await harness.connection.prompt({prompt: [{text: 'first', type: 'text'}], sessionId})
      await harness.connection.prompt({prompt: [{text: 'second', type: 'text'}], sessionId})

      expect(resumes[0]).to.be.undefined
      expect(resumes[1]).to.equal('sdk-42')
    })

    it('passes the session cwd and the agent options through to the run', async () => {
      const sink: {options?: AskOptions; prompt?: string} = {}
      harness = connect({allowedTools: ['Read'], askFn: recordingAskFn(sink), model: 'claude-test-model'})

      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/some/repo', mcpServers: []})
      await harness.connection.prompt({prompt: [{text: 'hi', type: 'text'}], sessionId})

      expect(sink.prompt).to.equal('hi')
      expect(sink.options?.cwd).to.equal('/some/repo')
      expect(sink.options?.allowedTools).to.deep.equal(['Read'])
      expect(sink.options?.model).to.equal('claude-test-model')
    })

    it('translates session MCP servers into SDK server configs', async () => {
      const sink: {options?: AskOptions; prompt?: string} = {}
      harness = connect({askFn: recordingAskFn(sink)})

      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({
        cwd: '/repo',
        mcpServers: [{args: ['serve'], command: 'my-mcp', env: [{name: 'TOKEN', value: 'abc'}], name: 'local'}],
      })
      await harness.connection.prompt({prompt: [{text: 'hi', type: 'text'}], sessionId})

      expect(sink.options?.mcpServers).to.deep.equal({
        local: {args: ['serve'], command: 'my-mcp', env: {TOKEN: 'abc'}, type: 'stdio'},
      })
    })

    it('rejects a prompt for an unknown session', async () => {
      harness = connect({})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})

      try {
        await harness.connection.prompt({prompt: [{text: 'hi', type: 'text'}], sessionId: 'nope'})
        expect.fail('expected an error')
      } catch (error: any) {
        expect(error.code).to.equal(-32_602)
      }
    })

    it('surfaces a failed agent run as an internal error', async () => {
      harness = connect({askFn: async () => ({error: 'credentials rejected', success: false})})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/repo', mcpServers: []})

      try {
        await harness.connection.prompt({prompt: [{text: 'hi', type: 'text'}], sessionId})
        expect.fail('expected an error')
      } catch (error: any) {
        expect(error.code).to.equal(-32_603)
        expect(JSON.stringify(error.data)).to.contain('credentials rejected')
      }
    })
  })

  describe('ClaudeAcpAgent cancel', () => {
    it('aborts the running turn and answers the prompt with cancelled', async () => {
      const running = deferred()
      harness = connect({askFn: blockingAskFn(running.resolve)})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/repo', mcpServers: []})

      const pending = harness.connection.prompt({prompt: [{text: 'long job', type: 'text'}], sessionId})
      await running.promise
      await harness.connection.cancel({sessionId})

      expect((await pending).stopReason).to.equal('cancelled')
    })

    it('cancels the newest turn after an earlier turn was superseded', async () => {
      const starts = [deferred(), deferred()]
      harness = connect({askFn: supersedingAskFn(starts)})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      const {sessionId} = await harness.connection.newSession({cwd: '/repo', mcpServers: []})

      const first = harness.connection.prompt({prompt: [{text: 'one', type: 'text'}], sessionId})
      await starts[0].promise
      // A second prompt supersedes the first, which must not retire the
      // controller the second turn needs to be cancellable.
      const second = harness.connection.prompt({prompt: [{text: 'two', type: 'text'}], sessionId})
      await starts[1].promise
      expect((await first).stopReason).to.equal('cancelled')

      await harness.connection.cancel({sessionId})

      expect((await second).stopReason).to.equal('cancelled')
    })
  })

  describe('ClaudeAcpAgent loadSession', () => {
    it('replays the transcript and resumes that session on the next prompt', async () => {
      const historyFn = historyOf([
        {message: {content: 'earlier question'}, type: 'user'},
        {message: {content: [{text: 'earlier answer', type: 'text'}]}, type: 'assistant'},
        {message: {content: 'ignored'}, type: 'system'},
      ])
      const resumes: (string | undefined)[] = []

      harness = connect({askFn: resumeTrackingAskFn(resumes, 'sdk-known'), historyFn, infoFn: sessionFound})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})
      await harness.connection.loadSession({cwd: '/repo', mcpServers: [], sessionId: 'sdk-known'})

      expect(harness.updates.map((u) => u.update.sessionUpdate)).to.deep.equal([
        'user_message_chunk',
        'agent_message_chunk',
      ])
      expect((harness.updates[1].update as any).content.text).to.equal('earlier answer')

      await harness.connection.prompt({prompt: [{text: 'follow up', type: 'text'}], sessionId: 'sdk-known'})
      expect(resumes).to.deep.equal(['sdk-known'])
    })

    it('reports an unknown session as not found', async () => {
      // A missing transcript reads back as an empty message list rather than
      // an error, so existence has to be established from the metadata.
      harness = connect({historyFn: historyOf([]), infoFn: sessionMissing})
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})

      try {
        await harness.connection.loadSession({cwd: '/repo', mcpServers: [], sessionId: 'x'})
        expect.fail('expected an error')
      } catch (error: any) {
        expect(error.code).to.equal(-32_002)
      }
    })

    it('surfaces an unreadable transcript as an internal error', async () => {
      harness = connect({
        historyFn: async () => ({error: 'transcript is corrupt', success: false}),
        infoFn: sessionFound,
      })
      await harness.connection.initialize({protocolVersion: acp.PROTOCOL_VERSION})

      try {
        await harness.connection.loadSession({cwd: '/repo', mcpServers: [], sessionId: 'sdk-known'})
        expect.fail('expected an error')
      } catch (error: any) {
        expect(error.code).to.equal(-32_603)
        expect(JSON.stringify(error.data)).to.contain('transcript is corrupt')
      }
    })
  })

  describe('promptToText', () => {
    it('joins text blocks', () => {
      expect(
        promptToText([
          {text: 'one', type: 'text'},
          {text: 'two', type: 'text'},
        ]),
      ).to.equal('one\n\ntwo')
    })

    it('inlines embedded text resources and references links', () => {
      const text = promptToText([
        {text: 'look at this', type: 'text'},
        {resource: {mimeType: 'text/plain', text: 'file body', uri: 'file:///a.txt'}, type: 'resource'},
        {name: 'b.txt', type: 'resource_link', uri: 'file:///b.txt'},
      ])

      expect(text).to.contain('look at this')
      expect(text).to.contain('Contents of file:///a.txt')
      expect(text).to.contain('file body')
      expect(text).to.contain('@file:///b.txt')
    })

    it('notes attachments it cannot inline', () => {
      const text = promptToText([
        {data: 'AAA', mimeType: 'image/png', type: 'image'},
        {data: 'BBB', mimeType: 'audio/wav', type: 'audio'},
        {resource: {blob: 'AAA', mimeType: 'application/octet-stream', uri: 'file:///c.bin'}, type: 'resource'},
      ])

      expect(text).to.contain('[image attachment omitted]')
      expect(text).to.contain('[audio attachment omitted]')
      expect(text).to.contain('[binary resource file:///c.bin]')
    })
  })

  describe('toSdkMcpServers', () => {
    it('returns undefined when no servers are attached', () => {
      expect(toSdkMcpServers([])).to.be.undefined
    })

    it('maps http and sse servers with their headers', () => {
      const configs = toSdkMcpServers([
        {headers: [{name: 'Authorization', value: 'Bearer t'}], name: 'remote', type: 'http', url: 'https://mcp.test'},
        {headers: [], name: 'events', type: 'sse', url: 'https://sse.test'},
      ])

      expect(configs).to.deep.equal({
        events: {headers: {}, type: 'sse', url: 'https://sse.test'},
        remote: {headers: {Authorization: 'Bearer t'}, type: 'http', url: 'https://mcp.test'},
      })
    })
  })
})
