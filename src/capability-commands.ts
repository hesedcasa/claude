import type {Config} from '@oclif/core/interfaces'

import {Args, Command, Flags} from '@oclif/core'
import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

const STORE_FILE = 'capabilities.json'
const TOPIC = 'claude'
const LIST_COMMAND_ID = `${TOPIC}:list`

export type CapabilityKind = 'command' | 'skill'

/** One cached capability: the name plus optional frontmatter metadata. */
export interface CapabilityEntry {
  argumentHint?: string
  description?: string
  name: string
}

export interface CapabilityStore {
  commands: CapabilityEntry[]
  skills: CapabilityEntry[]
}

/** Accepts plain names alongside full entries (legacy cache shape). */
export interface CapabilityStoreInput {
  commands: Array<CapabilityEntry | string>
  skills: Array<CapabilityEntry | string>
}

function storePath(cacheDir: string): string {
  return path.join(cacheDir, STORE_FILE)
}

function normalizeEntries(raw: unknown): CapabilityEntry[] {
  if (!Array.isArray(raw)) return []

  const entries: CapabilityEntry[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      entries.push({name: item})
    } else if (item && typeof item === 'object' && typeof (item as {name?: unknown}).name === 'string') {
      const {argumentHint, description, name} = item as {argumentHint?: unknown; description?: unknown; name: string}
      entries.push({
        ...(typeof argumentHint === 'string' && argumentHint ? {argumentHint} : {}),
        ...(typeof description === 'string' && description ? {description} : {}),
        name,
      })
    }
  }

  return entries
}

/**
 * Read the cached capabilities written by `claude list`. Returns undefined
 * when the cache is missing or unreadable — dynamic commands are simply
 * not registered until `claude list` has run once. Caches written before
 * metadata support (plain name arrays) are read as entries without metadata.
 */
export async function readCapabilityStore(cacheDir: string): Promise<CapabilityStore | undefined> {
  try {
    const raw = await fs.readJSON(storePath(cacheDir))
    return {
      commands: normalizeEntries(raw.commands),
      skills: normalizeEntries(raw.skills),
    }
  } catch {
    return undefined
  }
}

export async function writeCapabilityStore(cacheDir: string, store: CapabilityStoreInput): Promise<void> {
  const normalized: CapabilityStore = {
    commands: normalizeEntries(store.commands),
    skills: normalizeEntries(store.skills),
  }
  await fs.outputJSON(storePath(cacheDir), normalized, {spaces: 2})
}

// Mirrors the `command run` / `skill run` flags so `--help` on a dynamic
// command shows the real options. Parsing/validation happens in the run
// command itself — the dynamic command forwards its argv verbatim. Kept
// inline (instead of importing run.ts) so the init hook never loads the
// agent SDK.
const RUN_FORWARD_FLAGS = {
  'allow-tools': Flags.string({
    description: 'Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)',
    required: false,
  }),
  profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
  repo: Flags.string({description: 'Filter workspace context to this repo name', required: false}),
  stream: Flags.boolean({description: 'Stream assistant text as it arrives', required: false}),
  system: Flags.string({description: 'Custom system prompt for the agent', required: false}),
  workspace: Flags.string({
    char: 'w',
    description: 'Workspace name (uses current directory if omitted)',
    required: false,
  }),
}

// ─── Dynamic command factory ──────────────────────────────────────────────────

function capabilityCommandId(name: string, kind: CapabilityKind): string {
  return `${TOPIC}:${kind}:${name}`
}

/**
 * Creates an oclif Command class for a single agent capability. Slash
 * commands live under the `command` topic and skills under the `skill`
 * topic; each forwards its raw argv to the topic's `run` command
 * (`claude command run <name>` / `claude skill run <name>`), which
 * performs the actual parsing and agent dispatch. The capability's own
 * frontmatter (cached by `claude list`) supplies the description and the
 * input argument hint shown in help output.
 */
function createCapabilityCommand(name: string, kind: CapabilityKind, entry?: CapabilityEntry): typeof Command {
  const commandId = capabilityCommandId(name, kind)
  const runTarget = `${TOPIC}:${kind}:run`
  const description =
    entry?.description?.trim() || (kind === 'command' ? `Run the /${name} slash command` : `Run the '${name}' skill`)
  const inputDescription = entry?.argumentHint?.trim() || 'Additional input to forward to the agent'

  class DynamicCapabilityCommand extends Command {
    // `name` must be set explicitly: injected commands skip oclif's cached
    // conversion that normally assigns it, and help rendering relies on it.
    static args = {
      input: Args.string({description: inputDescription, name: 'input', required: false}),
    }
    static description = description
    static flags = RUN_FORWARD_FLAGS
    static id = commandId
    static strict = false

    async run(): Promise<void> {
      await this.config.runCommand(runTarget, [name, ...this.argv])
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

interface Topic {
  description?: string
  hidden?: boolean
  name: string
}

interface InternalConfig {
  _commands: Map<string, LoadableCommand>
  _topics: Map<string, Topic>
}

/**
 * Capability names may be plugin-namespaced (e.g. `sentry:sentry-go-sdk`).
 * Since `:` is oclif's topic separator, such a command sits more than one
 * level below the `claude:skill` / `claude:command` topic and topic help
 * only lists direct children. Registering each namespace prefix as a topic
 * (as oclif's own loadTopics does for plugin commands) makes the namespace
 * show up in `claude skill --help` and gives `claude skill <ns> --help` a
 * listing of its commands. The full command id is registered as a topic
 * too — oclif's help only displays a topic that has at least one child
 * topic, so the leaf entry is what makes its namespace visible (the leaf
 * itself is childless and never rendered in a TOPICS section).
 */
function registerNamespaceTopics(
  internal: InternalConfig,
  bare: string,
  kind: CapabilityKind,
  description: string,
): void {
  const segments = bare.split(':')
  for (let i = 1; i <= segments.length; i++) {
    const namespace = segments.slice(0, i).join(':')
    const topicName = capabilityCommandId(namespace, kind)
    if (internal._topics.has(topicName)) continue

    internal._topics.set(topicName, {
      description:
        i === segments.length
          ? description
          : kind === 'command'
            ? `Slash commands in the '${namespace}' namespace`
            : `Skills in the '${namespace}' namespace`,
      name: topicName,
    })
  }
}

/**
 * Reading the cache and building a Command class per entry is only useful
 * when the invoked command actually cares about the capability list: the
 * `claude list`/`claude command`/`claude skill` index commands (which list
 * skills and slash commands), their `run` subcommands, and direct by-name
 * invocation (`claude command <name>` / `claude skill <name>`). Every other
 * command (ask, auth, workspace, session, prompt, the root chat) never looks
 * at dynamic capability commands, so registering for them is wasted work.
 */
function isCapabilityAccessId(id: string | undefined): boolean {
  if (!id) return false
  if (id === LIST_COMMAND_ID) return true

  return (['command', 'skill'] as const).some((kind) => id === `${TOPIC}:${kind}` || id.startsWith(`${TOPIC}:${kind}:`))
}

/**
 * Reads the capabilities cache and injects one oclif command per skill and
 * slash command into the Config's internal `_commands` map, making them
 * visible in `help` and invocable as `claude command <name> [input] [flags]`
 * (slash commands) or `claude skill <name> [input] [flags]` (skills).
 * Built-in commands and topics always win: existing ids are never replaced.
 * A no-op unless `commandId` is within the list/command/skill surface — see
 * `isCapabilityAccessId`.
 */
export async function registerCapabilityCommands(config: Config, commandId?: string): Promise<void> {
  if (!isCapabilityAccessId(commandId)) return

  const store = await readCapabilityStore(config.cacheDir)
  if (!store) return

  const internal = config as unknown as InternalConfig
  const entries = [
    ...store.skills.map((entry) => ({entry, kind: 'skill' as const})),
    ...store.commands.map((entry) => ({entry, kind: 'command' as const})),
  ]

  const registered: Array<{bare: string; description: string; kind: CapabilityKind}> = []

  for (const {entry, kind} of entries) {
    const bare = entry.name.replace(/^\//, '').trim()
    if (!bare || bare.startsWith('-')) continue

    const commandId = capabilityCommandId(bare, kind)
    if (internal._commands.has(commandId) || internal._topics.has(commandId)) continue

    const CmdClass = createCapabilityCommand(bare, kind, entry)

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
    registered.push({bare, description: CmdClass.description ?? '', kind})
  }

  // Topics are added after every command is registered: creating a topic for
  // a namespace (e.g. `claude:skill:sentry` for `sentry:foo`) must not block
  // a plain capability with the same name (a skill called `sentry`) from
  // registering via the topic-existence guard above.
  for (const {bare, description, kind} of registered) {
    if (bare.includes(':')) registerNamespaceTopics(internal, bare, kind, description)
  }
}
