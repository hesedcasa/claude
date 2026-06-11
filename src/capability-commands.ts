import type {Config} from '@oclif/core/interfaces'

import {Args, Command, Flags} from '@oclif/core'
import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

const STORE_FILE = 'capabilities.json'
const TOPIC = 'claude'
const RUN_COMMAND = `${TOPIC}:run`

export type CapabilityKind = 'command' | 'skill'

export interface CapabilityStore {
  commands: string[]
  skills: string[]
}

function storePath(cacheDir: string): string {
  return path.join(cacheDir, STORE_FILE)
}

/**
 * Read the cached capabilities written by `claude list`. Returns undefined
 * when the cache is missing or unreadable — dynamic commands are simply
 * not registered until `claude list` has run once.
 */
export async function readCapabilityStore(cacheDir: string): Promise<CapabilityStore | undefined> {
  try {
    const raw = await fs.readJSON(storePath(cacheDir))
    return {
      commands: Array.isArray(raw.commands) ? raw.commands.filter((c: unknown) => typeof c === 'string') : [],
      skills: Array.isArray(raw.skills) ? raw.skills.filter((s: unknown) => typeof s === 'string') : [],
    }
  } catch {
    return undefined
  }
}

export async function writeCapabilityStore(cacheDir: string, store: CapabilityStore): Promise<void> {
  await fs.outputJSON(storePath(cacheDir), store, {spaces: 2})
}

// Mirrors the `claude run` flags so `--help` on a dynamic command shows the
// real options. Parsing/validation happens in `claude run` itself — the
// dynamic command forwards its argv verbatim. Kept inline (instead of
// importing run.ts) so the init hook never loads the agent SDK.
const RUN_FORWARD_FLAGS = {
  'allow-tools': Flags.string({
    description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
    required: false,
  }),
  profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
  repo: Flags.string({description: 'Filter workspace context to this repo name', required: false}),
  stream: Flags.boolean({description: 'Stream assistant text as it arrives', required: false}),
  system: Flags.string({description: 'Custom system prompt for the agent', required: false}),
  toon: Flags.boolean({description: 'Format output as toon', required: false}),
  workspace: Flags.string({
    char: 'w',
    description: 'Workspace name (uses current directory if omitted)',
    required: false,
  }),
}

// ─── Dynamic command factory ──────────────────────────────────────────────────

/**
 * Creates an oclif Command class for a single agent capability (skill or
 * slash command). The command forwards its raw argv to `claude run <name>`,
 * which performs the actual parsing and agent dispatch.
 */
function createCapabilityCommand(name: string, kind: CapabilityKind): typeof Command {
  const runName = kind === 'command' ? `/${name}` : name
  const commandId = `${TOPIC}:${name}`
  const description =
    kind === 'command' ? `Run the /${name} slash command (via claude run)` : `Run the '${name}' skill (via claude run)`

  class DynamicCapabilityCommand extends Command {
    // `name` must be set explicitly: injected commands skip oclif's cached
    // conversion that normally assigns it, and help rendering relies on it.
    static args = {
      input: Args.string({description: 'Additional input to forward to the agent', name: 'input', required: false}),
    }
    static description = description
    static flags = RUN_FORWARD_FLAGS
    static id = commandId
    static strict = false

    async run(): Promise<void> {
      await this.config.runCommand(RUN_COMMAND, [runName, ...this.argv])
    }
  }

  return DynamicCapabilityCommand
}

// ─── Registration ─────────────────────────────────────────────────────────────

interface LoadableCommand {
  aliases: string[]
  args: Record<string, unknown>
  description?: string
  flags: Record<string, unknown>
  hidden: boolean
  id: string
  load(): Promise<typeof Command>
  pluginName?: string
  pluginType?: string
  strict: boolean
}

interface InternalConfig {
  _commands: Map<string, LoadableCommand>
  _topics: Map<string, unknown>
}

/**
 * Reads the capabilities cache and injects one oclif command per skill and
 * slash command into the Config's internal `_commands` map, making them
 * visible in `help` and invocable directly as `claude <name> [input] [flags]`.
 * Built-in commands and topics always win: existing ids are never replaced.
 */
export async function registerCapabilityCommands(config: Config): Promise<void> {
  const store = await readCapabilityStore(config.cacheDir)
  if (!store) return

  const internal = config as unknown as InternalConfig
  const entries = [
    ...store.skills.map((name) => ({kind: 'skill' as const, name})),
    ...store.commands.map((name) => ({kind: 'command' as const, name})),
  ]

  for (const {kind, name} of entries) {
    const bare = name.replace(/^\//, '').trim()
    if (!bare || bare.startsWith('-')) continue

    const commandId = `${TOPIC}:${bare}`
    if (internal._commands.has(commandId) || internal._topics.has(commandId)) continue

    const CmdClass = createCapabilityCommand(bare, kind)

    internal._commands.set(commandId, {
      aliases: [],
      args: CmdClass.args as Record<string, unknown>,
      description: CmdClass.description,
      flags: CmdClass.flags as Record<string, unknown>,
      hidden: false,
      id: commandId,
      async load() {
        return CmdClass
      },
      pluginName: config.name,
      pluginType: 'core',
      strict: false,
    })
  }
}
