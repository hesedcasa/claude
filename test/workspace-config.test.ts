import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'

import {addWorkspace, deleteWorkspace, readWorkspace, updateWorkspace} from '../src/workspace-config.js'

describe('workspace-config', () => {
  describe('readWorkspace', () => {
    const testConfigDir = path.join(process.cwd(), 'test-workspace-read')
    const testConfigPath = path.join(testConfigDir, 'claude-config.json')

    beforeEach(async () => {
      await fs.ensureDir(testConfigDir)
    })

    afterEach(async () => {
      await fs.remove(testConfigDir)
    })

    it('returns the workspace entry for a named workspace', async () => {
      const repos = {'repo-a': '~/code/repo-a'}
      await fs.writeJSON(testConfigPath, {workspaces: {proj01: {mode: 'sandbox', repos}}})

      const logs: string[] = []
      const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg), 'proj01')

      expect(result).to.deep.equal({mode: 'sandbox', repos})
      expect(logs).to.be.empty
    })

    it('ignores defaultWorkspace and returns undefined when workspaceName is omitted', async () => {
      const repos = {'repo-b': '~/code/repo-b'}
      await fs.writeJSON(testConfigPath, {defaultWorkspace: 'proj01', workspaces: {proj01: {mode: 'local', repos}}})

      const logs: string[] = []
      const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg))

      expect(result).to.be.undefined
      expect(logs).to.be.empty
    })

    it('returns undefined and logs when workspace not found', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {}})

      const logs: string[] = []
      const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg), 'missing')

      expect(result).to.be.undefined
      expect(logs[0]).to.include("Workspace 'missing' not found")
    })

    it('returns undefined silently when no workspaceName and no default', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {}})

      const logs: string[] = []
      const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg))

      expect(result).to.be.undefined
      expect(logs).to.be.empty
    })

    it('returns undefined and logs when file does not exist', async () => {
      const logs: string[] = []
      const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg), 'proj01')

      expect(result).to.be.undefined
      expect(logs[0]).to.include('No workspaces found')
    })
  })

  describe('addWorkspace', () => {
    const testConfigDir = path.join(process.cwd(), 'test-workspace-add')
    const testConfigPath = path.join(testConfigDir, 'claude-config.json')

    beforeEach(async () => {
      await fs.ensureDir(testConfigDir)
    })

    afterEach(async () => {
      await fs.remove(testConfigDir)
    })

    it('adds workspace and sets it as default when it is the first', async () => {
      const logs: string[] = []
      const result = await addWorkspace(testConfigDir, 'proj01', {repos: {'repo-a': '~/code/repo-a'}}, (msg) =>
        logs.push(msg),
      )

      expect(result).to.be.true
      const saved = await fs.readJSON(testConfigPath)
      expect(saved.workspaces.proj01).to.deep.equal({mode: 'local', repos: {'repo-a': '~/code/repo-a'}})
      expect(saved.defaultWorkspace).to.equal('proj01')
    })

    it('stores the provided mode', async () => {
      const logs: string[] = []
      await addWorkspace(testConfigDir, 'proj01', {mode: 'sandbox', repos: {'repo-a': '~/code/repo-a'}}, (msg) =>
        logs.push(msg),
      )

      const saved = await fs.readJSON(testConfigPath)
      expect(saved.workspaces.proj01.mode).to.equal('sandbox')
    })

    it('does not change defaultWorkspace when adding a second workspace', async () => {
      await fs.writeJSON(testConfigPath, {defaultWorkspace: 'proj01', workspaces: {proj01: {}}})

      const logs: string[] = []
      await addWorkspace(testConfigDir, 'proj02', {repos: {'repo-b': '~/code/repo-b'}}, (msg) => logs.push(msg))

      const saved = await fs.readJSON(testConfigPath)
      expect(saved.defaultWorkspace).to.equal('proj01')
    })

    it('returns false and logs when workspace already exists', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {proj01: {}}})

      const logs: string[] = []
      const result = await addWorkspace(testConfigDir, 'proj01', {repos: {}}, (msg) => logs.push(msg))

      expect(result).to.be.false
      expect(logs[0]).to.include("Workspace 'proj01' already exists")
    })
  })

  describe('updateWorkspace', () => {
    const testConfigDir = path.join(process.cwd(), 'test-workspace-update-fn')
    const testConfigPath = path.join(testConfigDir, 'claude-config.json')

    beforeEach(async () => {
      await fs.ensureDir(testConfigDir)
    })

    afterEach(async () => {
      await fs.remove(testConfigDir)
    })

    it('updates repos for existing workspace', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {proj01: {mode: 'local', repos: {'repo-a': '/old'}}}})

      const logs: string[] = []
      const result = await updateWorkspace(
        testConfigDir,
        'proj01',
        {repos: {'repo-a': '/new', 'repo-b': '/also'}},
        (msg) => logs.push(msg),
      )

      expect(result).to.be.true
      const saved = await fs.readJSON(testConfigPath)
      expect(saved.workspaces.proj01).to.deep.equal({mode: 'local', repos: {'repo-a': '/new', 'repo-b': '/also'}})
    })

    it('preserves the existing mode when mode is omitted and changes it when provided', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {proj01: {mode: 'sandbox', repos: {'repo-a': '/old'}}}})

      await updateWorkspace(testConfigDir, 'proj01', {repos: {'repo-a': '/new'}}, () => {})
      let saved = await fs.readJSON(testConfigPath)
      expect(saved.workspaces.proj01.mode).to.equal('sandbox')

      await updateWorkspace(testConfigDir, 'proj01', {mode: 'local', repos: {'repo-a': '/new'}}, () => {})
      saved = await fs.readJSON(testConfigPath)
      expect(saved.workspaces.proj01.mode).to.equal('local')
    })

    it('returns false and logs when workspace does not exist', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {}})

      const logs: string[] = []
      const result = await updateWorkspace(testConfigDir, 'missing', {repos: {}}, (msg) => logs.push(msg))

      expect(result).to.be.false
      expect(logs[0]).to.include("Workspace 'missing' not found")
    })
  })

  describe('deleteWorkspace', () => {
    const testConfigDir = path.join(process.cwd(), 'test-workspace-delete')
    const testConfigPath = path.join(testConfigDir, 'claude-config.json')

    beforeEach(async () => {
      await fs.ensureDir(testConfigDir)
    })

    afterEach(async () => {
      await fs.remove(testConfigDir)
    })

    it('removes workspace and returns true', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {proj01: {}, proj02: {}}})

      const logs: string[] = []
      const result = await deleteWorkspace(testConfigDir, 'proj01', (msg) => logs.push(msg))

      expect(result).to.be.true
      const saved = await fs.readJSON(testConfigPath)
      expect(saved.workspaces).to.not.have.key('proj01')
    })

    it('updates defaultWorkspace to first remaining when default is deleted', async () => {
      await fs.writeJSON(testConfigPath, {defaultWorkspace: 'proj01', workspaces: {proj01: {}, proj02: {}}})

      await deleteWorkspace(testConfigDir, 'proj01', () => {})

      const saved = await fs.readJSON(testConfigPath)
      expect(saved.defaultWorkspace).to.equal('proj02')
    })

    it('sets defaultWorkspace to undefined when last workspace is deleted', async () => {
      await fs.writeJSON(testConfigPath, {defaultWorkspace: 'proj01', workspaces: {proj01: {}}})

      await deleteWorkspace(testConfigDir, 'proj01', () => {})

      const saved = await fs.readJSON(testConfigPath)
      expect(saved.defaultWorkspace).to.be.undefined
    })

    it('returns false and logs when workspace not found', async () => {
      await fs.writeJSON(testConfigPath, {workspaces: {}})

      const logs: string[] = []
      const result = await deleteWorkspace(testConfigDir, 'missing', (msg) => logs.push(msg))

      expect(result).to.be.false
      expect(logs[0]).to.include("Workspace 'missing' not found")
    })

    it('returns false and logs when config file is missing', async () => {
      const logs: string[] = []
      const result = await deleteWorkspace(testConfigDir, 'proj01', (msg) => logs.push(msg))

      expect(result).to.be.false
      expect(logs).to.have.length(1)
    })
  })
})
