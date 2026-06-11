import {encode} from '@toon-format/toon'

export function formatAsToon(data: unknown): string {
  if (data === null || data === undefined) {
    return ''
  }

  return encode(data)
}
