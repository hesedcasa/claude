/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'
import {stub} from 'sinon'

import {readCapabilityStore, registerCapabilityCommands, writeCapabilityStore} from '../src/capability-commands.js'

const testCacheDir = path.join(process.cwd(), 'test-capability-cache')
const testStorePath = path.join(testCacheDir, 'capabilities.json')

function makeConfig() {
  return {
    _commands: new Map<string, any>(),
    _topics: new Map<string, any>(),
    cacheDir: testCacheDir,
    name: '@hesed/claude',
  }
}

describe('capability-commands', () => {
  beforeEach(async () => {
    await fs.ensureDir(testCacheDir)
  })

  afterEach(async () => {
    await fs.remove(testCacheDir)
  })

  describe('capability store', () => {
    it('round-trips skills and commands through the cache file', async () => {
      const store = {commands: ['help', 'clear'], skills: ['review', 'commit']}
      await writeCapabilityStore(testCacheDir, store)

      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.deep.equal(store)
    })

    it('returns undefined when the cache file is missing', async () => {
      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.be.undefined
    })

    it('drops non-string entries and tolerates missing keys', async () => {
      await fs.writeJSON(testStorePath, {commands: ['help', 42, null]})

      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.deep.equal({commands: ['help'], skills: []})
    })
  })

  describe('registerCapabilityCommands', () => {
    it('registers skills and slash commands as claude:<name> commands', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['/compact', 'help'], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any)

      expect([...config._commands.keys()]).to.have.members(['claude:review', 'claude:compact', 'claude:help'])
      const entry = config._commands.get('claude:review')
      expect(entry.hidden).to.be.false
      expect(entry.pluginName).to.equal('@hesed/claude')
      expect(entry.description).to.include('review')
    })

    it('does nothing when the cache is missing', async () => {
      const config = makeConfig()
      await registerCapabilityCommands(config as any)

      expect(config._commands.size).to.equal(0)
    })

    it('never replaces existing commands or topics', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['run'], skills: ['auth']})

      const config = makeConfig()
      const builtIn = {id: 'claude:run'}
      config._commands.set('claude:run', builtIn)
      config._topics.set('claude:auth', {name: 'claude:auth'})

      await registerCapabilityCommands(config as any)

      expect(config._commands.get('claude:run')).to.equal(builtIn)
      expect(config._commands.has('claude:auth')).to.be.false
    })

    it('forwards argv to claude:run with the skill name', async () => {
      await writeCapabilityStore(testCacheDir, {commands: [], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any)

      const CmdClass = await config._commands.get('claude:review').load()
      const runCommandStub = stub().resolves()
      const cmd = new (CmdClass as any)(['fix this', '--stream'], {...config, runCommand: runCommandStub})

      await cmd.run()

      expect(runCommandStub.calledOnceWith('claude:run', ['review', 'fix this', '--stream'])).to.be.true
    })

    it('prefixes slash commands with / when forwarding to claude:run', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['compact'], skills: []})

      const config = makeConfig()
      await registerCapabilityCommands(config as any)

      const CmdClass = await config._commands.get('claude:compact').load()
      const runCommandStub = stub().resolves()
      const cmd = new (CmdClass as any)([], {...config, runCommand: runCommandStub})

      await cmd.run()

      expect(runCommandStub.calledOnceWith('claude:run', ['/compact'])).to.be.true
    })
  })
})
