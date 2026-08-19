import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

/**
 * A peer ACP agent this CLI can talk to. The peer is a program that speaks
 * the Agent Client Protocol over stdio (e.g. `gemini --experimental-acp`,
 * `claude-code-acp`, or another `claude acp serve`).
 */
export interface AcpAgentEntry {
  args?: string[]
  command: string
  cwd?: string
  env?: Record<string, string>
}

export type AcpAgents = Record<string, AcpAgentEntry>

interface AcpConfigFile {
  acpAgents?: AcpAgents
}

const CONFIG_FILE = 'claude-config.json'

function configPath(configDir: string): string {
  return path.join(configDir, CONFIG_FILE)
}

/**
 * Read the whole peer-agent registry. Returns undefined when no config file
 * exists yet; anything else (e.g. malformed JSON) is surfaced so config
 * corruption isn't silently hidden.
 */
export async function readAcpAgents(configDir: string): Promise<AcpAgents | undefined> {
  try {
    const raw: AcpConfigFile = await fs.readJSON(configPath(configDir))
    return raw.acpAgents ?? {}
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return undefined
    throw error
  }
}

/**
 * Read a single peer agent by name.
 */
export async function readAcpAgent(configDir: string, name: string): Promise<AcpAgentEntry | undefined> {
  const agents = await readAcpAgents(configDir)
  return agents?.[name]
}

/**
 * Register a peer agent. Refuses to overwrite an existing entry.
 */
export async function addAcpAgent(
  configDir: string,
  name: string,
  entry: AcpAgentEntry,
  log: (message: string) => void,
): Promise<boolean> {
  const cp = configPath(configDir)
  let existing: Record<string, unknown> = {}
  try {
    existing = await fs.readJSON(cp)
  } catch {
    // file doesn't exist yet
  }

  const acpAgents = (existing.acpAgents ?? {}) as AcpAgents
  if (name in acpAgents) {
    log(`ACP agent '${name}' already exists. Delete it first to change its command.`)
    return false
  }

  acpAgents[name] = entry
  await fs.outputJSON(cp, {...existing, acpAgents}, {mode: 0o600, spaces: 2})
  log(`ACP agent '${name}' added`)
  return true
}

/**
 * Remove a peer agent from the registry.
 */
export async function deleteAcpAgent(
  configDir: string,
  name: string,
  log: (message: string) => void,
): Promise<boolean> {
  const cp = configPath(configDir)
  let raw: AcpConfigFile & Record<string, unknown>
  try {
    raw = await fs.readJSON(cp)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    log(msg.toLowerCase().includes('no such file or directory') ? 'No ACP agents found' : msg)
    return false
  }

  const acpAgents = (raw.acpAgents ?? {}) as AcpAgents
  if (!(name in acpAgents)) {
    log(`ACP agent '${name}' does not exist.`)
    return false
  }

  delete acpAgents[name]
  await fs.outputJSON(cp, {...raw, acpAgents}, {mode: 0o600, spaces: 2})
  log(`ACP agent '${name}' deleted`)
  return true
}
