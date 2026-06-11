import {expect} from 'chai'
import {default as fs} from 'fs-extra'
import {default as os} from 'node:os'
import {default as path} from 'node:path'
import {stub} from 'sinon'

import {buildWorkspaceContext, isGitUrl} from '../src/workspace-bash.js'

describe('workspace-bash', () => {
  describe('isGitUrl', () => {
    it('detects git URLs', () => {
      expect(isGitUrl('https://github.com/org/repo')).to.be.true
      expect(isGitUrl('https://github.com/org/repo.git')).to.be.true
      expect(isGitUrl('git@github.com:org/repo.git')).to.be.true
      expect(isGitUrl('ssh://git@github.com/org/repo')).to.be.true
      expect(isGitUrl('git://github.com/org/repo')).to.be.true
    })

    it('treats local paths as non-git locations', () => {
      expect(isGitUrl('~/code/repo-a')).to.be.false
      expect(isGitUrl('/abs/path/repo')).to.be.false
      expect(isGitUrl('./relative/repo')).to.be.false
    })
  })

  describe('buildWorkspaceContext', () => {
    let tmpDir: string
    let log: ReturnType<typeof stub>

    beforeEach(async () => {
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ws-bash-test-'))
      await fs.outputFile(path.join(tmpDir, 'repo-a', 'file.txt'), 'hello-a\n')
      await fs.outputFile(path.join(tmpDir, 'repo-b', 'file.txt'), 'hello-b\n')
      log = stub()
    })

    afterEach(async () => {
      await fs.remove(tmpDir)
    })

    const base = (repos: Record<string, string>, mode: 'local' | 'sandbox') => ({
      cacheDir: path.join(tmpDir, 'cache'),
      log,
      mode,
      repos,
      workspaceLabel: 'proj01',
    })

    it('returns real directories and a directory prompt in local mode', async () => {
      const repoA = path.join(tmpDir, 'repo-a')
      const repoB = path.join(tmpDir, 'repo-b')
      const ctx = await buildWorkspaceContext(base({'repo-a': repoA, 'repo-b': repoB}, 'local'))

      expect(ctx).to.not.be.undefined
      expect(ctx!.additionalDirectories).to.deep.equal([repoA, repoB])
      expect(ctx!.cwd).to.equal(tmpDir)
      expect(ctx!.sandboxExec).to.be.undefined
      expect(ctx!.systemPrompt).to.include('repo-a')
      expect(ctx!.systemPrompt).to.include('repo-b')
    })

    it('skips git URLs in local mode and logs a hint', async () => {
      const repoA = path.join(tmpDir, 'repo-a')
      const ctx = await buildWorkspaceContext(
        base({'repo-a': repoA, 'repo-remote': 'https://github.com/org/repo.git'}, 'local'),
      )

      expect(ctx!.additionalDirectories).to.deep.equal([repoA])
      expect(log.calledWith("Repo 'repo-remote' is a git URL; set the workspace mode to 'sandbox' to include it")).to.be
        .true
    })

    it('returns undefined in local mode when all repos are git URLs', async () => {
      const ctx = await buildWorkspaceContext(base({'repo-remote': 'https://github.com/org/repo.git'}, 'local'))
      expect(ctx).to.be.undefined
    })

    it('filters repos by repoFilter and logs when not found', async () => {
      const repoA = path.join(tmpDir, 'repo-a')
      const found = await buildWorkspaceContext({
        ...base({'repo-a': repoA, 'repo-b': path.join(tmpDir, 'repo-b')}, 'local'),
        repoFilter: 'repo-a',
      })
      expect(found!.additionalDirectories).to.deep.equal([repoA])

      const missing = await buildWorkspaceContext({...base({'repo-a': repoA}, 'local'), repoFilter: 'nope'})
      expect(missing).to.be.undefined
      expect(log.calledWith("Repo 'nope' not found in workspace 'proj01'")).to.be.true
    })

    it('mounts local repos into a virtual bash in sandbox mode', async () => {
      const ctx = await buildWorkspaceContext(
        base({'repo-a': path.join(tmpDir, 'repo-a'), 'repo-b': path.join(tmpDir, 'repo-b')}, 'sandbox'),
      )

      expect(ctx).to.not.be.undefined
      expect(ctx!.additionalDirectories).to.be.undefined
      expect(ctx!.sandboxExec).to.be.a('function')
      expect(ctx!.systemPrompt).to.include('/workspace/repo-a')

      const ls = await ctx!.sandboxExec!('ls /workspace')
      expect(ls.exitCode).to.equal(0)
      expect(ls.stdout).to.equal('repo-a\nrepo-b\n')

      const cat = await ctx!.sandboxExec!('cat /workspace/repo-a/file.txt')
      expect(cat.stdout).to.equal('hello-a\n')
    })

    it('keeps sandbox writes out of the real filesystem', async () => {
      const repoA = path.join(tmpDir, 'repo-a')
      const ctx = await buildWorkspaceContext(base({'repo-a': repoA}, 'sandbox'))

      const write = await ctx!.sandboxExec!('echo changed > /workspace/repo-a/file.txt && cat /workspace/repo-a/file.txt')
      expect(write.stdout).to.equal('changed\n')

      const real = await fs.readFile(path.join(repoA, 'file.txt'), 'utf8')
      expect(real).to.equal('hello-a\n')
    })

    it('clones git URLs through gitSync into the cache dir in sandbox mode', async () => {
      const cloneDir = path.join(tmpDir, 'cache', 'repo-remote')
      await fs.outputFile(path.join(cloneDir, 'cloned.txt'), 'from-git\n')
      const gitSync = stub().resolves(cloneDir)

      const ctx = await buildWorkspaceContext({
        ...base({'repo-remote': 'https://github.com/org/repo.git'}, 'sandbox'),
        gitSync,
      })

      expect(gitSync.calledOnceWith('https://github.com/org/repo.git', cloneDir)).to.be.true
      const cat = await ctx!.sandboxExec!('cat /workspace/repo-remote/cloned.txt')
      expect(cat.stdout).to.equal('from-git\n')
    })

    it('skips repos whose git sync fails and returns undefined when none mount', async () => {
      const gitSync = stub().resolves()
      const ctx = await buildWorkspaceContext({
        ...base({'repo-remote': 'https://github.com/org/repo.git'}, 'sandbox'),
        gitSync,
      })

      expect(ctx).to.be.undefined
    })

    it('skips missing local directories in sandbox mode', async () => {
      const ctx = await buildWorkspaceContext(
        base({'repo-a': path.join(tmpDir, 'repo-a'), 'repo-gone': path.join(tmpDir, 'does-not-exist')}, 'sandbox'),
      )

      expect(log.calledWithMatch(/Repo 'repo-gone' directory not found/)).to.be.true
      const ls = await ctx!.sandboxExec!('ls /workspace')
      expect(ls.stdout).to.equal('repo-a\n')
    })
  })
})
