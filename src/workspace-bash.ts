import {default as fs} from 'fs-extra'
import {Bash, InMemoryFs, MountableFs, type MountConfig, OverlayFs} from 'just-bash'
import {execFile} from 'node:child_process'
import {default as path} from 'node:path'
import {promisify} from 'node:util'

import {commonParentDir, expandPath, type WorkspaceMode, type WorkspaceRepos} from './workspace-config.js'

const execFileAsync = promisify(execFile)

export interface BashExecResult {
  exitCode: number
  stderr: string
  stdout: string
}

export interface SandboxFsStat {
  isDirectory: boolean
  isFile: boolean
  size: number
}

export interface SandboxFs {
  exists: (path: string) => Promise<boolean>
  mkdir: (path: string, opts?: {recursive?: boolean}) => Promise<void>
  readdir: (path: string) => Promise<string[]>
  readFile: (path: string) => Promise<string>
  rm: (path: string, opts?: {force?: boolean; recursive?: boolean}) => Promise<void>
  stat: (path: string) => Promise<SandboxFsStat>
  writeFile: (path: string, content: string) => Promise<void>
}

export type BashExecFn = (command: string) => Promise<BashExecResult>
export type GitSyncFn = (url: string, dest: string, log: (message: string) => void) => Promise<string | undefined>

type RepoEntry = [string, string]

export interface WorkspaceContext {
  additionalDirectories?: string[]
  cwd?: string
  sandboxExec?: BashExecFn
  sandboxFs?: SandboxFs
  systemPrompt: string
}

export interface BuildWorkspaceContextOptions {
  cacheDir: string
  gitSync?: GitSyncFn
  log: (message: string) => void
  mode: WorkspaceMode
  repoFilter?: string
  repos: WorkspaceRepos
  workspaceLabel: string
}

/**
 * True when a workspace repo location is a git URL rather than a local path.
 */
export function isGitUrl(location: string): boolean {
  return /^(git|https?|ssh):\/\//.test(location) || /^git@[^:]+:/.test(location) || location.endsWith('.git')
}

/**
 * Shallow-clone a git repo into `dest`, or fast-forward an existing clone.
 * Returns the checkout directory, or undefined when the repo is unavailable.
 */
export async function syncGitRepo(
  url: string,
  dest: string,
  log: (message: string) => void,
): Promise<string | undefined> {
  if (await fs.pathExists(path.join(dest, '.git'))) {
    try {
      await execFileAsync('git', ['-C', dest, 'pull', '--ff-only'])
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      log(`Could not update '${url}', using existing checkout: ${msg}`)
    }

    return dest
  }

  try {
    await fs.ensureDir(path.dirname(dest))
    await execFileAsync('git', ['clone', '--depth', '1', url, dest])
    log(`Cloned '${url}' into ${dest}`)
    return dest
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    log(`Failed to clone '${url}': ${msg}`)
    return undefined
  }
}

/**
 * Resolve a workspace into agent run context.
 *
 * - `local` mode: local repo paths are passed through as real directories
 *   (cwd + additionalDirectories). Git URLs are skipped.
 * - `sandbox` mode: local paths are mounted copy-on-write and git URLs are
 *   cloned into `cacheDir`, then mounted, at `/workspace/<repoName>` inside a
 *   just-bash virtual filesystem. `sandboxExec` runs commands in that sandbox.
 */
export async function buildWorkspaceContext(
  options: BuildWorkspaceContextOptions,
): Promise<undefined | WorkspaceContext> {
  const {cacheDir, gitSync = syncGitRepo, log, mode, repoFilter, repos, workspaceLabel} = options
  const entries = repoFilter ? Object.entries(repos).filter(([name]) => name === repoFilter) : Object.entries(repos)
  if (repoFilter && entries.length === 0) {
    log(`Repo '${repoFilter}' not found in workspace '${workspaceLabel}'`)
    return undefined
  }

  if (entries.length === 0) return undefined

  return mode === 'sandbox' ? buildSandboxContext(entries, cacheDir, gitSync, log) : buildLocalContext(entries, log)
}

function buildLocalContext(entries: RepoEntry[], log: (message: string) => void): undefined | WorkspaceContext {
  const localEntries = entries.filter(([name, location]) => {
    if (isGitUrl(location)) {
      log(`Repo '${name}' is a git URL; set the workspace mode to 'sandbox' to include it`)
      return false
    }

    return true
  })
  if (localEntries.length === 0) return undefined

  const dirLines = localEntries.map(([name, dir]) => `  ${name}: ${dir}`).join('\n')
  const expandedDirs = localEntries.map(([, dir]) => expandPath(dir))
  return {
    additionalDirectories: expandedDirs,
    cwd: commonParentDir(expandedDirs),
    systemPrompt: `Workspace directories:\n${dirLines}`,
  }
}

async function buildSandboxContext(
  entries: RepoEntry[],
  cacheDir: string,
  gitSync: GitSyncFn,
  log: (message: string) => void,
): Promise<undefined | WorkspaceContext> {
  const mounts: MountConfig[] = []
  const promptLines: string[] = []

  for (const [name, location] of entries) {
    /* eslint-disable no-await-in-loop */
    const realDir = isGitUrl(location) ? await gitSync(location, path.join(cacheDir, name), log) : expandPath(location)
    if (!realDir) continue

    if (!(await fs.pathExists(realDir))) {
      log(`Repo '${name}' directory not found: ${realDir}`)
      continue
    }
    /* eslint-enable no-await-in-loop */

    mounts.push({filesystem: new OverlayFs({mountPoint: '/', root: realDir}), mountPoint: `/workspace/${name}`})
    promptLines.push(`  ${name}: /workspace/${name}`)
  }

  if (mounts.length === 0) return undefined

  await fs.ensureDir(cacheDir)
  const bash = new Bash({cwd: '/workspace', fs: new MountableFs({base: new InMemoryFs(), mounts})})
  const fsInstance = bash.fs
  const cwd = bash.getCwd()
  const resolve = (p: string): string => (p.startsWith('/') ? p : fsInstance.resolvePath(cwd, p))

  const sandboxFs: SandboxFs = {
    exists: (p) => fsInstance.exists(resolve(p)),
    mkdir: (p, o) => fsInstance.mkdir(resolve(p), o),
    readdir: (p) => fsInstance.readdir(resolve(p)),
    readFile: (p) => fsInstance.readFile(resolve(p)),
    rm: (p, o) => fsInstance.rm(resolve(p), o),
    async stat(p) {
      const s = await fsInstance.stat(resolve(p))
      return {isDirectory: s.isDirectory, isFile: s.isFile, size: s.size}
    },
    async writeFile(p, content) {
      const resolved = resolve(p)
      const dir = resolved.replace(/\/[^/]*$/, '')
      if (dir && dir !== resolved) {
        try {
          await fsInstance.mkdir(dir, {recursive: true})
        } catch {
          /* parent already exists */
        }
      }

      await fsInstance.writeFile(resolved, content)
    },
  }

  return {
    cwd: cacheDir,
    async sandboxExec(command: string): Promise<BashExecResult> {
      const result = await bash.exec(command)
      return {exitCode: result.exitCode, stderr: result.stderr, stdout: result.stdout}
    },
    sandboxFs,
    systemPrompt:
      `Workspace repos are mounted in a sandboxed virtual filesystem:\n${promptLines.join('\n')}\n\n` +
      'Use the workspace tools for all shell, file read, file write, and file edit operations. ' +
      'Changes stay inside the sandbox and never touch the real filesystem.',
  }
}
