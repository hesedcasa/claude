import {type Config} from '@oclif/core'
import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'

import {
  extractPlaceholders,
  PROMPTS_FILE,
  readPrompts,
  renderPrompt,
  resolvePrompt,
  savePrompts,
} from '../src/prompts-config.js'

describe('prompts-config', () => {
  const testConfigDir = path.join(process.cwd(), 'test-prompts-config')
  const testConfigPath = path.join(testConfigDir, PROMPTS_FILE)
  const config = {configDir: testConfigDir} as Config

  beforeEach(async () => {
    await fs.ensureDir(testConfigDir)
  })

  afterEach(async () => {
    await fs.remove(testConfigDir)
  })

  describe('readPrompts / savePrompts', () => {
    it('round-trips saved prompts including the system prompt', async () => {
      await savePrompts(config, {summarize: {body: 'Summarize it', description: 'Summary', system: 'Be concise'}})

      const result = await readPrompts(config)

      expect(result).to.deep.equal({summarize: {body: 'Summarize it', description: 'Summary', system: 'Be concise'}})
    })

    it('returns an empty collection when the store does not exist', async () => {
      const result = await readPrompts(config)

      expect(result).to.deep.equal({})
    })

    it('rethrows instead of losing data when the store is malformed', async () => {
      await fs.writeFile(testConfigPath, '{not valid json')

      let thrown: Error | undefined
      try {
        await readPrompts(config)
      } catch (error) {
        thrown = error as Error
      }

      expect(thrown).to.be.an('error')
    })
  })

  describe('resolvePrompt', () => {
    it('returns the named prompt', () => {
      const [name, prompt] = resolvePrompt({summarize: {body: 'Summarize it'}}, 'summarize')

      expect(name).to.equal('summarize')
      expect(prompt).to.deep.equal({body: 'Summarize it'})
    })

    it('throws when the prompt does not exist', () => {
      expect(() => resolvePrompt({}, 'missing')).to.throw("Prompt 'missing' does not exist.")
    })
  })

  describe('extractPlaceholders', () => {
    it('returns unique {{name}} placeholders and tolerates inner whitespace', () => {
      expect(extractPlaceholders('Hi {{name}} and {{ name }} and {{topic}}')).to.deep.equal(['name', 'topic'])
    })

    it('ignores single-brace text and non-name double-brace markers', () => {
      // `{result}` is literal output, `{{ $json.x }}` is another tool's syntax.
      expect(extractPlaceholders('Output {result} for {{ $json.summary }}')).to.deep.equal([])
    })
  })

  describe('renderPrompt', () => {
    it('substitutes provided values and leaves unknown placeholders intact', () => {
      const out = renderPrompt('{{greeting}}, {{name}}!', {greeting: 'Hello'})

      expect(out).to.equal('Hello, {{name}}!')
    })
  })
})
