import * as acp from '@zed-industries/agent-client-protocol'
import {type Readable, type Writable} from 'node:stream'

import {type AcpAgentOptions, ClaudeAcpAgent} from './acp-agent.js'
import {nodeStdioStream} from './acp-stream.js'

export interface ServeAcpOptions extends AcpAgentOptions {
  /** Defaults to process.stdin; injectable for tests. */
  stdin?: Readable
  /** Defaults to process.stdout; injectable for tests. */
  stdout?: Writable
}

/**
 * Serve the Claude agent over ACP on a stdio pipe and resolve once the peer
 * closes the connection.
 *
 * stdout carries protocol traffic only — anything logged there would be
 * parsed as JSON-RPC by the client — so diagnostics belong on stderr.
 */
export async function serveAcpOverStdio(options: ServeAcpOptions): Promise<void> {
  const {stdin = process.stdin, stdout = process.stdout, ...agentOptions} = options

  const stream = nodeStdioStream({input: stdin, output: stdout})

  // Constructing the connection is what registers the agent's request
  // handlers on the stream; there is nothing further to do with the object.
  // eslint-disable-next-line no-new
  new acp.AgentSideConnection((connection) => new ClaudeAcpAgent(connection, agentOptions), stream)

  await new Promise<void>((resolve) => {
    stdin.once('close', resolve)
    stdin.once('end', resolve)
    stdin.once('error', resolve)
  })
}
