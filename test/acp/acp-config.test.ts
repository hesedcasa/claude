import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'

import {addAcpAgent, deleteAcpAgent, readAcpAgent, readAcpAgents} from '../../src/acp/acp-config.js'

describe('acp-config', () => {
  const testConfigDir = path.join(process.cwd(), 'test-acp-config')
  const testConfigPath = path.join(testConfigDir, 'claude-config.json')
  const messages: string[] = []
  const log = (message: string): void => {
    messages.push(message)
  }

  beforeEach(async () => {
    messages.length = 0
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  describe('readAcpAgents', () => {
    it('returns undefined when no config file exists', async () => {
      expect(await readAcpAgents(path.join(testConfigDir, 'missing'))).to.equal(undefined)
    })

    it('returns an empty map when the config file has no agents', async () => {
      await fs.writeJSON(testConfigPath, {profiles: {}})
      expect(await readAcpAgents(testConfigDir)).to.deep.equal({})
    })

    it('surfaces malformed config instead of hiding it', async () => {
      await fs.writeFile(testConfigPath, '{not json')

      try {
        await readAcpAgents(testConfigDir)
        expect.fail('expected a parse error')
      } catch (error: unknown) {
        expect(error).to.be.an('error')
      }
    })
  })

  describe('readAcpAgent', () => {
    it('returns the named entry', async () => {
      await fs.writeJSON(testConfigPath, {acpAgents: {gemini: {args: ['--experimental-acp'], command: 'gemini'}}})

      expect(await readAcpAgent(testConfigDir, 'gemini')).to.deep.equal({
        args: ['--experimental-acp'],
        command: 'gemini',
      })
    })

    it('returns undefined for an unknown name', async () => {
      await fs.writeJSON(testConfigPath, {acpAgents: {}})
      expect(await readAcpAgent(testConfigDir, 'nope')).to.equal(undefined)
    })
  })

  describe('addAcpAgent', () => {
    it('creates the config file and stores the entry', async () => {
      const added = await addAcpAgent(testConfigDir, 'gemini', {args: ['--acp'], command: 'gemini'}, log)

      expect(added).to.be.true
      expect(await fs.readJSON(testConfigPath)).to.deep.equal({
        acpAgents: {gemini: {args: ['--acp'], command: 'gemini'}},
      })
      expect(messages).to.deep.equal(["ACP agent 'gemini' added"])
    })

    it('preserves unrelated config sections', async () => {
      await fs.writeJSON(testConfigPath, {defaultProfile: 'work', profiles: {work: {apiKey: 'sk'}}})

      await addAcpAgent(testConfigDir, 'peer', {command: 'peer-agent'}, log)

      const raw = await fs.readJSON(testConfigPath)
      expect(raw.defaultProfile).to.equal('work')
      expect(raw.profiles).to.deep.equal({work: {apiKey: 'sk'}})
      expect(raw.acpAgents).to.deep.equal({peer: {command: 'peer-agent'}})
    })

    it('refuses to overwrite an existing agent', async () => {
      await addAcpAgent(testConfigDir, 'gemini', {command: 'gemini'}, log)
      const added = await addAcpAgent(testConfigDir, 'gemini', {command: 'other'}, log)

      expect(added).to.be.false
      expect(messages.at(-1)).to.contain('already exists')
      expect((await readAcpAgent(testConfigDir, 'gemini'))?.command).to.equal('gemini')
    })
  })

  describe('deleteAcpAgent', () => {
    it('removes the entry', async () => {
      await addAcpAgent(testConfigDir, 'gemini', {command: 'gemini'}, log)

      const deleted = await deleteAcpAgent(testConfigDir, 'gemini', log)

      expect(deleted).to.be.true
      expect(await readAcpAgents(testConfigDir)).to.deep.equal({})
      expect(messages.at(-1)).to.equal("ACP agent 'gemini' deleted")
    })

    it('reports an unknown agent', async () => {
      await fs.writeJSON(testConfigPath, {acpAgents: {}})

      expect(await deleteAcpAgent(testConfigDir, 'nope', log)).to.be.false
      expect(messages.at(-1)).to.equal("ACP agent 'nope' does not exist.")
    })

    it('reports a missing config file', async () => {
      expect(await deleteAcpAgent(path.join(testConfigDir, 'missing'), 'nope', log)).to.be.false
      expect(messages.at(-1)).to.equal('No ACP agents found')
    })
  })
})
