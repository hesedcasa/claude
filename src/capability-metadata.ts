import {default as fs} from 'fs-extra'
import {default as os} from 'node:os'
import {default as path} from 'node:path'

import type {CapabilityEntry} from './capability-commands.js'

export interface CapabilityMetadata {
  argumentHint?: string
  description?: string
}

export interface PluginInfo {
  name: string
  path: string
}

interface ResolveOptions {
  commands: string[]
  cwd: string
  plugins: PluginInfo[]
  skills: string[]
  /** User-level Claude directory; defaults to $CLAUDE_CONFIG_DIR or ~/.claude. */
  userDir?: string
}

const BLOCK_INDICATORS = new Set(['', '>', '>-', '|', '|-'])

function unquote(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }

  return value
}

/** Joins the indented lines of a `>`/`|` block scalar; returns the end index. */
function collectBlockScalar(lines: string[], start: number, end: number): {index: number; value: string} {
  const block: string[] = []
  let i = start
  while (i + 1 < end && (/^\s/.test(lines[i + 1]) || lines[i + 1].trim() === '')) {
    i++
    if (lines[i].trim()) block.push(lines[i].trim())
  }

  return {index: i, value: block.join(' ')}
}

/**
 * Minimal YAML frontmatter reader for the two fields the CLI surfaces in
 * help output: `description` and `argument-hint`. Handles plain, quoted,
 * and folded/literal (`>`/`|`) scalar values; anything fancier is ignored
 * rather than mis-parsed.
 */
export function parseFrontmatter(content: string): CapabilityMetadata {
  const lines = content.replaceAll('\r\n', '\n').split('\n')
  if (lines[0]?.trim() !== '---') return {}

  const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---')
  if (end === -1) return {}

  const metadata: CapabilityMetadata = {}
  for (let i = 1; i < end; i++) {
    const match = /^(description|argument-hint):\s*(.*)$/.exec(lines[i])
    if (!match) continue

    let value = match[2].trim()
    if (BLOCK_INDICATORS.has(value)) {
      ;({index: i, value} = collectBlockScalar(lines, i, end))
    } else {
      value = unquote(value)
    }

    if (!value) continue
    if (match[1] === 'description') metadata.description = value
    else metadata.argumentHint = value
  }

  return metadata
}

function defaultUserDir(): string {
  return process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), '.claude')
}

/** A capability name is only used as a relative path when it is safe to. */
function isSafeName(name: string): boolean {
  return name.length > 0 && !path.isAbsolute(name) && !name.split(/[/:\\]/).includes('..')
}

function candidateFiles(name: string, kind: 'command' | 'skill', opts: ResolveOptions): string[] {
  if (!isSafeName(name)) return []

  const userDir = opts.userDir ?? defaultUserDir()
  const segments = name.split(':')

  // Plugin-qualified names (`plugin:rest`) live under the plugin's own
  // directory; deeper namespaces map to subdirectories. `bases` is ordered
  // by precedence: owning plugin, project `.claude`, user-level directory.
  const plugin = segments.length > 1 ? opts.plugins.find((p) => p.name === segments[0]) : undefined
  const bases = plugin
    ? [{dir: plugin.path, rest: segments.slice(1).join('/')}]
    : [
        {dir: path.join(opts.cwd, '.claude'), rest: segments.join('/')},
        {dir: userDir, rest: segments.join('/')},
      ]

  // Skills and slash commands are interchangeable in Claude Code: the init
  // message lists markdown commands among skills and vice versa. Probe the
  // kind's own layout in every base first, then the other layout.
  const skillFiles = bases.map(({dir, rest}) => path.join(dir, 'skills', rest, 'SKILL.md'))
  const commandFiles = bases.map(({dir, rest}) => path.join(dir, 'commands', `${rest}.md`))
  return kind === 'skill' ? [...skillFiles, ...commandFiles] : [...commandFiles, ...skillFiles]
}

async function readMetadata(
  name: string,
  kind: 'command' | 'skill',
  opts: ResolveOptions,
): Promise<CapabilityMetadata> {
  // Candidates are ordered by precedence, so they must be probed
  // sequentially — the first existing file wins.
  for (const file of candidateFiles(name, kind, opts)) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const content = await fs.readFile(file, 'utf8')
      return parseFrontmatter(content)
    } catch {
      // Try the next candidate location.
    }
  }

  return {}
}

/**
 * Enrich the capability names reported by the SDK init message with the
 * `description` and `argument-hint` frontmatter of the backing markdown
 * files (SKILL.md for skills, `<name>.md` for slash commands), searched in
 * the project's `.claude` directory, the user-level Claude directory, and
 * the reporting plugin's own directory. Missing files simply yield entries
 * without metadata (capabilities bundled inside Claude Code have no file on
 * disk — the SDK's supportedCommands() metadata covers those instead).
 */
export async function resolveCapabilityEntries(
  opts: ResolveOptions,
): Promise<{commands: CapabilityEntry[]; skills: CapabilityEntry[]}> {
  const resolve = async (names: string[], kind: 'command' | 'skill') =>
    Promise.all(
      names.map(async (name): Promise<CapabilityEntry> => {
        const bare = name.replace(/^\//, '').trim()
        return {name, ...(await readMetadata(bare, kind, opts))}
      }),
    )

  return {
    commands: await resolve(opts.commands, 'command'),
    skills: await resolve(opts.skills, 'skill'),
  }
}
