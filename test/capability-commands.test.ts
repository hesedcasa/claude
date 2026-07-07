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
    it('round-trips entries with metadata through the cache file', async () => {
      const store = {
        commands: [{argumentHint: '[message]', description: 'Create a git commit', name: 'commit'}],
        skills: [{description: 'Review a pull request', name: 'review'}],
      }
      await writeCapabilityStore(testCacheDir, store)

      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.deep.equal(store)
    })

    it('normalizes plain names to entries without metadata', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['help'], skills: ['review']})

      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.deep.equal({commands: [{name: 'help'}], skills: [{name: 'review'}]})
    })

    it('reads legacy caches that contain plain name arrays', async () => {
      await fs.writeJSON(testStorePath, {commands: ['help', 'clear'], skills: ['review']})

      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.deep.equal({
        commands: [{name: 'help'}, {name: 'clear'}],
        skills: [{name: 'review'}],
      })
    })

    it('returns undefined when the cache file is missing', async () => {
      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.be.undefined
    })

    it('drops invalid entries and tolerates missing keys', async () => {
      await fs.writeJSON(testStorePath, {commands: ['help', 42, null, {description: 'no name'}, {name: 'ok'}]})

      const result = await readCapabilityStore(testCacheDir)
      expect(result).to.deep.equal({commands: [{name: 'help'}, {name: 'ok'}], skills: []})
    })
  })

  describe('registerCapabilityCommands', () => {
    it('registers slash commands under command and skills under skill', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['/compact', 'help'], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      expect([...config._commands.keys()]).to.have.members([
        'claude:skill:review',
        'claude:command:compact',
        'claude:command:help',
      ])
      const entry = config._commands.get('claude:skill:review')
      expect(entry.hidden).to.be.false
      expect(entry.pluginName).to.equal('@hesed/claude')
      expect(entry.description).to.include('review')
    })

    it('uses the frontmatter description and argument hint when present', async () => {
      await writeCapabilityStore(testCacheDir, {
        commands: [{argumentHint: '[message]', description: 'Create a git commit', name: 'commit'}],
        skills: [{description: 'Review a pull request', name: 'review'}],
      })

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      expect(config._commands.get('claude:command:commit').description).to.equal('Create a git commit')
      expect(config._commands.get('claude:skill:review').description).to.equal('Review a pull request')

      const CmdClass = await config._commands.get('claude:command:commit').load()
      expect((CmdClass as any).args.input.description).to.equal('[message]')
    })

    it('falls back to generic help text when metadata is missing', async () => {
      await writeCapabilityStore(testCacheDir, {commands: [{name: 'compact'}], skills: []})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      expect(config._commands.get('claude:command:compact').description).to.equal('Run the /compact slash command')
      const CmdClass = await config._commands.get('claude:command:compact').load()
      expect((CmdClass as any).args.input.description).to.equal('Additional input to forward to the agent')
    })

    it('does nothing when the cache is missing', async () => {
      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      expect(config._commands.size).to.equal(0)
    })

    it('does nothing when the invoked command is unrelated to list/command/skill', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['help'], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:ask')

      expect(config._commands.size).to.equal(0)
    })

    it('does nothing when no command id is given', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['help'], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any)

      expect(config._commands.size).to.equal(0)
    })

    it('registers when accessing the bare command/skill topics', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['help'], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:command')

      expect(config._commands.has('claude:command:help')).to.be.true
      expect(config._commands.has('claude:skill:review')).to.be.true
    })

    it('registers for direct by-name invocation (claude command <name>)', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['help'], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:command:help')

      expect(config._commands.has('claude:command:help')).to.be.true
    })

    it('never replaces existing commands or topics', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['run'], skills: ['auth']})

      const config = makeConfig()
      const builtIn = {id: 'claude:command:run'}
      config._commands.set('claude:command:run', builtIn)
      config._topics.set('claude:skill:auth', {name: 'claude:skill:auth'})

      await registerCapabilityCommands(config as any, 'claude:list')

      expect(config._commands.get('claude:command:run')).to.equal(builtIn)
      expect(config._commands.has('claude:skill:auth')).to.be.false
    })

    it('registers intermediate topics for namespaced capabilities', async () => {
      await writeCapabilityStore(testCacheDir, {
        commands: ['dev-kit:misc:generate-rules'],
        skills: ['sentry:sentry-go-sdk'],
      })

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      expect([...config._commands.keys()]).to.have.members([
        'claude:skill:sentry:sentry-go-sdk',
        'claude:command:dev-kit:misc:generate-rules',
      ])
      // Leaf topics mirror oclif's own loadTopics: help only displays a
      // topic that has a child topic, so the leaf makes its namespace visible.
      expect([...config._topics.keys()]).to.have.members([
        'claude:skill:sentry',
        'claude:skill:sentry:sentry-go-sdk',
        'claude:command:dev-kit',
        'claude:command:dev-kit:misc',
        'claude:command:dev-kit:misc:generate-rules',
      ])
      expect(config._topics.get('claude:skill:sentry').description).to.include('sentry')
      expect(config._topics.get('claude:command:dev-kit:misc').description).to.include('dev-kit:misc')
    })

    it('does not overwrite an existing topic with the same name', async () => {
      await writeCapabilityStore(testCacheDir, {commands: [], skills: ['sentry:sentry-go-sdk']})

      const config = makeConfig()
      const existing = {description: 'built-in', name: 'claude:skill:sentry'}
      config._topics.set('claude:skill:sentry', existing)

      await registerCapabilityCommands(config as any, 'claude:list')

      expect(config._topics.get('claude:skill:sentry')).to.equal(existing)
    })

    it('still registers a plain capability whose name matches a namespace', async () => {
      await writeCapabilityStore(testCacheDir, {commands: [], skills: ['sentry:sentry-go-sdk', 'sentry']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      expect(config._commands.has('claude:skill:sentry')).to.be.true
      expect(config._commands.has('claude:skill:sentry:sentry-go-sdk')).to.be.true
      expect(config._topics.has('claude:skill:sentry')).to.be.true
    })

    it('forwards argv to claude:skill:run with the skill name', async () => {
      await writeCapabilityStore(testCacheDir, {commands: [], skills: ['review']})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      const CmdClass = await config._commands.get('claude:skill:review').load()
      const runCommandStub = stub().resolves()
      const cmd = new (CmdClass as any)(['fix this', '--stream'], {...config, runCommand: runCommandStub})

      await cmd.run()

      expect(runCommandStub.calledOnceWith('claude:skill:run', ['review', 'fix this', '--stream'])).to.be.true
    })

    it('forwards slash commands to claude:command:run without the leading /', async () => {
      await writeCapabilityStore(testCacheDir, {commands: ['/compact'], skills: []})

      const config = makeConfig()
      await registerCapabilityCommands(config as any, 'claude:list')

      const CmdClass = await config._commands.get('claude:command:compact').load()
      const runCommandStub = stub().resolves()
      const cmd = new (CmdClass as any)([], {...config, runCommand: runCommandStub})

      await cmd.run()

      expect(runCommandStub.calledOnceWith('claude:command:run', ['compact'])).to.be.true
    })
  })
})
