import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

export interface WorkflowEntry {
  prompt: string
  skills?: string[]
  workspace?: string
}

export type Workflows = Record<string, WorkflowEntry>

const CONFIG_FILE = 'claude-config.json'

function configPath(configDir: string): string {
  return path.join(configDir, CONFIG_FILE)
}

export async function readWorkflows(configDir: string): Promise<undefined | Workflows> {
  try {
    const raw = await fs.readJSON(configPath(configDir))
    return (raw.workflows ?? {}) as Workflows
  } catch (error: unknown) {
    // Missing config file is expected (no workflows saved yet); surface anything else
    // (e.g. malformed JSON) so config corruption isn't silently hidden.
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return undefined
    throw error
  }
}

export async function readWorkflow(configDir: string, name: string): Promise<undefined | WorkflowEntry> {
  const workflows = await readWorkflows(configDir)
  if (!workflows) return undefined
  return workflows[name] ?? undefined
}
