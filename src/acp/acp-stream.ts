/* eslint-disable n/no-unsupported-features/node-builtins */
import * as acp from '@zed-industries/agent-client-protocol'
import {Readable, Writable} from 'node:stream'

/**
 * Build the ACP newline-delimited JSON transport from a pair of Node stdio
 * streams.
 *
 * ACP defines its transport in terms of web streams, so the conversion is
 * unavoidable. The lint rule disabled above tracks when the web stream APIs
 * became *stable*; they have shipped (as experimental APIs) since Node 18,
 * which is this package's floor. Keeping the conversion here means the
 * exemption lives in exactly one place.
 */
export function nodeStdioStream({input, output}: {input: Readable; output: Writable}): acp.Stream {
  return acp.ndJsonStream(
    Writable.toWeb(output) as WritableStream<Uint8Array>,
    Readable.toWeb(input) as ReadableStream<Uint8Array>,
  )
}
