import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'

import {readWorkflow, readWorkflows} from '../src/workflow-config.js'

describe('workflow-config', () => {
  describe('readWorkflows', () => {
    const testConfigDir = path.join(process.cwd(), 'test-workflow-read')
    const testConfigPath = path.join(testConfigDir, 'claude-config.json')

    beforeEach(async () => {
      await fs.ensureDir(testConfigDir)
    })

    afterEach(async () => {
      await fs.remove(testConfigDir)
    })

    it('returns all workflows from config', async () => {
      await fs.writeJSON(testConfigPath, {
        workflows: {
          'daily-review': {prompt: 'Review all recent changes', workspace: 'proj01'},
          'weekly-summary': {prompt: 'Summarize the week', skills: ['review']},
        },
      })

      const result = await readWorkflows(testConfigDir)

      expect(result).to.deep.equal({
        'daily-review': {prompt: 'Review all recent changes', workspace: 'proj01'},
        'weekly-summary': {prompt: 'Summarize the week', skills: ['review']},
      })
    })

    it('returns empty object when no workflows key exists', async () => {
      await fs.writeJSON(testConfigPath, {profiles: {}})

      const result = await readWorkflows(testConfigDir)

      expect(result).to.deep.equal({})
    })

    it('returns undefined when config file does not exist', async () => {
      const result = await readWorkflows(testConfigDir)

      expect(result).to.be.undefined
    })
  })

  describe('readWorkflow', () => {
    const testConfigDir = path.join(process.cwd(), 'test-workflow-single-read')
    const testConfigPath = path.join(testConfigDir, 'claude-config.json')

    beforeEach(async () => {
      await fs.ensureDir(testConfigDir)
    })

    afterEach(async () => {
      await fs.remove(testConfigDir)
    })

    it('returns the named workflow entry', async () => {
      await fs.writeJSON(testConfigPath, {
        workflows: {
          'daily-review': {prompt: 'Review all recent changes', skills: ['review'], workspace: 'proj01'},
        },
      })

      const result = await readWorkflow(testConfigDir, 'daily-review')

      expect(result).to.deep.equal({prompt: 'Review all recent changes', skills: ['review'], workspace: 'proj01'})
    })

    it('returns undefined when workflow does not exist', async () => {
      await fs.writeJSON(testConfigPath, {workflows: {}})

      const result = await readWorkflow(testConfigDir, 'missing')

      expect(result).to.be.undefined
    })

    it('returns undefined when config file does not exist', async () => {
      const result = await readWorkflow(testConfigDir, 'daily-review')

      expect(result).to.be.undefined
    })
  })
})
