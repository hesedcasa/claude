import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

export type WorkspaceMode = 'local' | 'sandbox'
export type WorkspaceRepos = Record<string, string>

export interface WorkspaceEntry {
  mode: WorkspaceMode
  repos: WorkspaceRepos
}

export type Workspaces = Record<string, WorkspaceEntry>

interface WorkspaceConfigFile {
  defaultWorkspace?: string
  workspaces?: Workspaces
}

const CONFIG_FILE = 'claude-config.json'

export function expandPath(p: string): string {
  return p.startsWith('~/') ? path.join(process.env.HOME ?? '~', p.slice(2)) : p
}

export function commonParentDir(dirs: string[]): string {
  if (dirs.length === 0) return process.cwd()
  if (dirs.length === 1) return dirs[0]
  const split = dirs.map((d) => d.split(path.sep))
  const depth = Math.min(...split.map((p) => p.length))
  let i = 0
  while (i < depth && split.every((p) => p[i] === split[0][i])) i++
  const common = split[0].slice(0, i).join(path.sep)
  return common || path.sep
}

function configPath(configDir: string): string {
  return path.join(configDir, CONFIG_FILE)
}

export async function getDefaultWorkspace(configDir: string): Promise<string | undefined> {
  try {
    const raw = await fs.readJSON(configPath(configDir))
    return raw.defaultWorkspace ?? undefined
  } catch {
    return undefined
  }
}

export async function setDefaultWorkspace(
  configDir: string,
  workspace: string,
  log: (message: string) => void,
): Promise<void> {
  const cp = configPath(configDir)
  let raw: Record<string, unknown> & WorkspaceConfigFile
  try {
    raw = await fs.readJSON(cp)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.toLowerCase().includes('no such file or directory')) {
      log('No workspaces found')
    } else {
      log(msg)
    }

    return
  }

  const workspaces = (raw.workspaces ?? {}) as Workspaces
  if (!(workspace in workspaces)) {
    log(`Workspace '${workspace}' does not exist.`)
    return
  }

  raw.defaultWorkspace = workspace
  await fs.outputJSON(cp, raw, {mode: 0o600, spaces: 2})
  log(`Default workspace set to '${workspace}'`)
}

export async function readWorkspaces(configDir: string): Promise<undefined | Workspaces> {
  const cp = configPath(configDir)
  try {
    const raw = await fs.readJSON(cp)
    return (raw.workspaces ?? {}) as Workspaces
  } catch (error: unknown) {
    // Missing config file is expected (no workspaces saved yet); surface anything else
    // (e.g. malformed JSON) so config corruption isn't silently hidden.
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return undefined
    throw error
  }
}

export async function readWorkspace(configDir: string, workspaceName?: string): Promise<undefined | WorkspaceEntry> {
  if (!workspaceName) return undefined

  const cp = configPath(configDir)
  let file: WorkspaceConfigFile
  try {
    file = await fs.readJSON(cp)
  } catch (error: unknown) {
    // Missing config file is expected; surface anything else (e.g. malformed JSON).
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return undefined
    throw error
  }

  const workspaces = file.workspaces ?? {}
  const entry = workspaces[workspaceName]
  if (!entry) {
    return undefined
  }

  return entry
}

export async function addWorkspace(
  configDir: string,
  workspace: string,
  entry: {mode?: WorkspaceMode; repos: WorkspaceRepos},
  log: (message: string) => void,
): Promise<boolean> {
  const cp = configPath(configDir)
  let existing: Record<string, unknown> = {}
  try {
    existing = await fs.readJSON(cp)
  } catch {
    // file doesn't exist yet
  }

  const workspaces = (existing.workspaces ?? {}) as Workspaces
  if (workspace in workspaces) {
    log(`Workspace '${workspace}' already exists. Use 'claude workspace update' to modify it.`)
    return false
  }

  const isFirst = Object.keys(workspaces).length === 0
  workspaces[workspace] = {mode: entry.mode ?? 'local', repos: entry.repos}
  const defaultWorkspace = isFirst ? workspace : existing.defaultWorkspace
  await fs.outputJSON(cp, {...existing, defaultWorkspace, workspaces}, {mode: 0o600, spaces: 2})
  log(`Workspace '${workspace}' added`)
  return true
}

export async function updateWorkspace(
  configDir: string,
  workspace: string,
  entry: {mode?: WorkspaceMode; repos: WorkspaceRepos},
  log: (message: string) => void,
): Promise<boolean> {
  const cp = configPath(configDir)
  let existing: Record<string, unknown>
  try {
    existing = await fs.readJSON(cp)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.toLowerCase().includes('no such file or directory')) {
      log("Run 'claude workspace add' instead")
    } else {
      log(msg)
    }

    return false
  }

  const workspaces = (existing.workspaces ?? {}) as Workspaces
  if (!(workspace in workspaces)) {
    log(`Workspace '${workspace}' does not exist. Run 'claude workspace add' to create.`)
    return false
  }

  const current = workspaces[workspace]
  workspaces[workspace] = {mode: entry.mode ?? current.mode, repos: entry.repos}
  await fs.outputJSON(cp, {...existing, workspaces}, {mode: 0o600, spaces: 2})
  log(`Workspace '${workspace}' updated`)
  return true
}

export async function deleteWorkspace(
  configDir: string,
  workspace: string,
  log: (message: string) => void,
): Promise<boolean> {
  const cp = configPath(configDir)
  let raw: Record<string, unknown> & WorkspaceConfigFile
  try {
    raw = await fs.readJSON(cp)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.toLowerCase().includes('no such file or directory')) {
      log('No workspaces found')
    } else {
      log(msg)
    }

    return false
  }

  const workspaces = (raw.workspaces ?? {}) as Workspaces
  if (!(workspace in workspaces)) {
    log(`Workspace '${workspace}' does not exist.`)
    return false
  }

  delete workspaces[workspace]

  const remaining = Object.keys(workspaces)
  if (raw.defaultWorkspace === workspace) {
    raw.defaultWorkspace = remaining[0] ?? undefined
  }

  await fs.outputJSON(cp, {...raw, workspaces}, {mode: 0o600, spaces: 2})
  log(`Workspace '${workspace}' deleted`)
  return true
}

export async function deleteRepoFromWorkspace(
  configDir: string,
  workspace: string,
  repoName: string,
  log: (message: string) => void,
): Promise<boolean> {
  const cp = configPath(configDir)
  let raw: Record<string, unknown> & WorkspaceConfigFile
  try {
    raw = await fs.readJSON(cp)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.toLowerCase().includes('no such file or directory')) {
      log('No workspaces found')
    } else {
      log(msg)
    }

    return false
  }

  const workspaces = (raw.workspaces ?? {}) as Workspaces
  if (!(workspace in workspaces)) {
    log(`Workspace '${workspace}' does not exist.`)
    return false
  }

  const entry = workspaces[workspace]
  if (!(repoName in entry.repos)) {
    log(`Repo '${repoName}' not found in workspace '${workspace}'`)
    return false
  }

  delete entry.repos[repoName]
  await fs.outputJSON(cp, {...raw, workspaces}, {mode: 0o600, spaces: 2})
  log(`Repo '${repoName}' removed from workspace '${workspace}'`)
  return true
}
