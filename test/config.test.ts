import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'

import {addWorkspace, deleteProfile, deleteWorkspace, getDefaultProfile, readAgentConfig, readProfiles, readWorkspace, setDefaultProfile, updateWorkspace} from '../src/config.js'

describe('config', () => {
describe('agent-config', () => {
  const testConfigDir = path.join(process.cwd(), 'test-agent-config')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('reads the default profile when it exists', async () => {
    const auth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
    await fs.writeJSON(testConfigPath, {profiles: {default: auth}})

    const logs: string[] = []
    const result = await readAgentConfig(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.deep.equal(auth)
    expect(logs).to.be.empty
  })

  it('resolves default to the defaultProfile name', async () => {
    const auth = {apiKey: 'sk-ant-work', apiUrl: 'https://api.anthropic.com'}
    await fs.writeJSON(testConfigPath, {defaultProfile: 'work', profiles: {work: auth}})

    const logs: string[] = []
    const result = await readAgentConfig(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.deep.equal(auth)
    expect(logs).to.be.empty
  })

  it('reads a named profile', async () => {
    const auth = {apiKey: 'sk-ant-work', apiUrl: 'https://api.anthropic.com'}
    await fs.writeJSON(testConfigPath, {profiles: {default: {apiKey: 'sk-ant-default', apiUrl: ''}, work: auth}})

    const logs: string[] = []
    const result = await readAgentConfig(testConfigDir, (msg) => logs.push(msg), 'work')

    expect(result).to.deep.equal(auth)
    expect(logs).to.be.empty
  })

  it('returns undefined and logs when profile is not found', async () => {
    await fs.writeJSON(testConfigPath, {profiles: {default: {apiKey: 'sk-ant-test', apiUrl: ''}}})

    const logs: string[] = []
    const result = await readAgentConfig(testConfigDir, (msg) => logs.push(msg), 'missing')

    expect(result).to.be.undefined
    expect(logs[0]).to.include("Profile 'missing' not found")
  })

  it('returns undefined and logs "Missing" when file does not exist', async () => {
    const logs: string[] = []
    const result = await readAgentConfig(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.be.undefined
    expect(logs).to.include('Missing agent authentication config')
  })

  it('logs actual error message for invalid JSON', async () => {
    await fs.writeFile(testConfigPath, 'not-json {')

    const logs: string[] = []
    const result = await readAgentConfig(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.be.undefined
    expect(logs).to.have.length(1)
    expect(logs[0]).to.not.include('Missing agent authentication config')
  })
})

describe('getDefaultProfile', () => {
  const testConfigDir = path.join(process.cwd(), 'test-agent-config-get')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('returns defaultProfile from config file', async () => {
    await fs.writeJSON(testConfigPath, {defaultProfile: 'work', profiles: {}})
    expect(await getDefaultProfile(testConfigDir)).to.equal('work')
  })

  it('returns "default" when file has no defaultProfile', async () => {
    await fs.writeJSON(testConfigPath, {profiles: {}})
    expect(await getDefaultProfile(testConfigDir)).to.equal('default')
  })

  it('returns "default" when file does not exist', async () => {
    expect(await getDefaultProfile(testConfigDir)).to.equal('default')
  })
})

describe('setDefaultProfile', () => {
  const testConfigDir = path.join(process.cwd(), 'test-agent-config-set')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('updates defaultProfile when profile exists', async () => {
    await fs.writeJSON(testConfigPath, {defaultProfile: 'default', profiles: {default: {apiKey: 'k', apiUrl: ''}, work: {apiKey: 'k2', apiUrl: ''}}})

    const logs: string[] = []
    await setDefaultProfile(testConfigDir, 'work', (msg) => logs.push(msg))

    const saved = await fs.readJSON(testConfigPath)
    expect(saved.defaultProfile).to.equal('work')
    expect(logs[0]).to.include("Default profile set to 'work'")
  })

  it('logs error when profile does not exist', async () => {
    await fs.writeJSON(testConfigPath, {profiles: {default: {apiKey: 'k', apiUrl: ''}}})

    const logs: string[] = []
    await setDefaultProfile(testConfigDir, 'missing', (msg) => logs.push(msg))

    expect(logs[0]).to.include("Profile 'missing' not found")
  })
})

describe('readProfiles', () => {
  const testConfigDir = path.join(process.cwd(), 'test-agent-config-profiles')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('returns all profiles from config', async () => {
    const profiles = {default: {apiKey: 'k1', apiUrl: ''}, work: {apiKey: 'k2', apiUrl: 'https://x'}}
    await fs.writeJSON(testConfigPath, {profiles})

    const logs: string[] = []
    const result = await readProfiles(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.deep.equal(profiles)
    expect(logs).to.be.empty
  })

  it('returns empty object when profiles key is missing', async () => {
    await fs.writeJSON(testConfigPath, {defaultProfile: 'default'})

    const logs: string[] = []
    const result = await readProfiles(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.deep.equal({})
  })

  it('returns undefined and logs when file does not exist', async () => {
    const logs: string[] = []
    const result = await readProfiles(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.be.undefined
    expect(logs[0]).to.include('No authentication profiles found')
  })
})

describe('deleteProfile', () => {
  const testConfigDir = path.join(process.cwd(), 'test-agent-config-delete')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('removes the profile and returns true', async () => {
    await fs.writeJSON(testConfigPath, {
      defaultProfile: 'default',
      profiles: {default: {apiKey: 'k1', apiUrl: ''}, work: {apiKey: 'k2', apiUrl: ''}},
    })

    const logs: string[] = []
    const result = await deleteProfile(testConfigDir, 'work', (msg) => logs.push(msg))

    expect(result).to.be.true
    const saved = await fs.readJSON(testConfigPath)
    expect(saved.profiles).to.not.have.key('work')
    expect(logs[0]).to.include("Profile 'work' deleted")
  })

  it('updates defaultProfile to first remaining when default is deleted', async () => {
    await fs.writeJSON(testConfigPath, {
      defaultProfile: 'default',
      profiles: {default: {apiKey: 'k1', apiUrl: ''}, work: {apiKey: 'k2', apiUrl: ''}},
    })

    const logs: string[] = []
    await deleteProfile(testConfigDir, 'default', (msg) => logs.push(msg))

    const saved = await fs.readJSON(testConfigPath)
    expect(saved.defaultProfile).to.equal('work')
    expect(saved.profiles).to.not.have.key('default')
  })

  it('sets defaultProfile to undefined when last profile is deleted', async () => {
    await fs.writeJSON(testConfigPath, {
      defaultProfile: 'default',
      profiles: {default: {apiKey: 'k1', apiUrl: ''}},
    })

    const logs: string[] = []
    await deleteProfile(testConfigDir, 'default', (msg) => logs.push(msg))

    const saved = await fs.readJSON(testConfigPath)
    expect(saved.defaultProfile).to.be.undefined
    expect(Object.keys(saved.profiles)).to.have.length(0)
  })

  it('logs error and returns false when profile does not exist', async () => {
    await fs.writeJSON(testConfigPath, {profiles: {default: {apiKey: 'k', apiUrl: ''}}})

    const logs: string[] = []
    const result = await deleteProfile(testConfigDir, 'missing', (msg) => logs.push(msg))

    expect(result).to.be.false
    expect(logs[0]).to.include("Profile 'missing' not found")
  })
})

describe('deleteProfile error handling', () => {
  const testConfigDir = path.join(process.cwd(), 'test-agent-config-delete-err')

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('returns false and logs when config file is missing', async () => {
    const logs: string[] = []
    const result = await deleteProfile(testConfigDir, 'default', (msg) => logs.push(msg))
    expect(result).to.be.false
    expect(logs).to.have.length(1)
  })
})

describe('readWorkspace', () => {
  const testConfigDir = path.join(process.cwd(), 'test-workspace-read')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  it('returns repos for named workspace', async () => {
    const repos = {'repo-a': '~/code/repo-a'}
    await fs.writeJSON(testConfigPath, {workspaces: {proj01: repos}})

    const logs: string[] = []
    const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg), 'proj01')

    expect(result).to.deep.equal(repos)
    expect(logs).to.be.empty
  })

  it('resolves default workspace when workspaceName is omitted', async () => {
    const repos = {'repo-b': '~/code/repo-b'}
    await fs.writeJSON(testConfigPath, {defaultWorkspace: 'proj01', workspaces: {proj01: repos}})

    const logs: string[] = []
    const result = await readWorkspace(testConfigDir, (msg) => logs.push(msg))

    expect(result).to.deep.equal(repos)
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
    const result = await addWorkspace(testConfigDir, 'proj01', {'repo-a': '~/code/repo-a'}, (msg) => logs.push(msg))

    expect(result).to.be.true
    const saved = await fs.readJSON(testConfigPath)
    expect(saved.workspaces.proj01).to.deep.equal({'repo-a': '~/code/repo-a'})
    expect(saved.defaultWorkspace).to.equal('proj01')
  })

  it('does not change defaultWorkspace when adding a second workspace', async () => {
    await fs.writeJSON(testConfigPath, {defaultWorkspace: 'proj01', workspaces: {proj01: {}}})

    const logs: string[] = []
    await addWorkspace(testConfigDir, 'proj02', {'repo-b': '~/code/repo-b'}, (msg) => logs.push(msg))

    const saved = await fs.readJSON(testConfigPath)
    expect(saved.defaultWorkspace).to.equal('proj01')
  })

  it('returns false and logs when workspace already exists', async () => {
    await fs.writeJSON(testConfigPath, {workspaces: {proj01: {}}})

    const logs: string[] = []
    const result = await addWorkspace(testConfigDir, 'proj01', {}, (msg) => logs.push(msg))

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
    await fs.writeJSON(testConfigPath, {workspaces: {proj01: {'repo-a': '/old'}}})

    const logs: string[] = []
    const result = await updateWorkspace(testConfigDir, 'proj01', {'repo-a': '/new', 'repo-b': '/also'}, (msg) => logs.push(msg))

    expect(result).to.be.true
    const saved = await fs.readJSON(testConfigPath)
    expect(saved.workspaces.proj01).to.deep.equal({'repo-a': '/new', 'repo-b': '/also'})
  })

  it('returns false and logs when workspace does not exist', async () => {
    await fs.writeJSON(testConfigPath, {workspaces: {}})

    const logs: string[] = []
    const result = await updateWorkspace(testConfigDir, 'missing', {}, (msg) => logs.push(msg))

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
