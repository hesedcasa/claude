import {encode} from '@toon-format/toon'

/**
 * Format data as TOON (Token-Oriented Object Notation)
 */
export function formatAsToon(data: unknown): string {
  if (data === null || data === undefined) {
    return ''
  }

  return encode(data)
}
