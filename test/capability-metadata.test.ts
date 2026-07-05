import {expect} from 'chai'
import fs from 'fs-extra'
import path from 'node:path'

import {parseFrontmatter, resolveCapabilityEntries} from '../src/capability-metadata.js'

const testDir = path.join(process.cwd(), 'test-capability-metadata')
const cwd = path.join(testDir, 'project')
const userDir = path.join(testDir, 'user-claude')
const pluginDir = path.join(testDir, 'plugins', 'sentry')

describe('capability-metadata', () => {
  describe('parseFrontmatter', () => {
    it('extracts description and argument-hint', () => {
      const result = parseFrontmatter('---\ndescription: Review a PR\nargument-hint: [pr-number]\n---\nBody')
      expect(result).to.deep.equal({argumentHint: '[pr-number]', description: 'Review a PR'})
    })

    it('strips surrounding quotes', () => {
      const result = parseFrontmatter('---\ndescription: "Quoted: value"\nargument-hint: \'[msg]\'\n---\n')
      expect(result).to.deep.equal({argumentHint: '[msg]', description: 'Quoted: value'})
    })

    it('joins folded block scalars into one line', () => {
      const content = '---\ndescription: >-\n  Line one\n  line two\nname: x\n---\n'
      expect(parseFrontmatter(content)).to.deep.equal({description: 'Line one line two'})
    })

    it('ignores files without frontmatter', () => {
      expect(parseFrontmatter('# Just markdown')).to.deep.equal({})
      expect(parseFrontmatter('---\ndescription: unterminated\n')).to.deep.equal({})
    })

    it('ignores indented keys inside nested blocks', () => {
      const content = '---\nmetadata:\n  description: nested\ndescription: top level\n---\n'
      expect(parseFrontmatter(content)).to.deep.equal({description: 'top level'})
    })
  })

  describe('resolveCapabilityEntries', () => {
    beforeEach(async () => {
      await fs.ensureDir(testDir)
    })

    afterEach(async () => {
      await fs.remove(testDir)
    })

    it('reads skill frontmatter from the project .claude directory', async () => {
      await fs.outputFile(
        path.join(cwd, '.claude', 'skills', 'review', 'SKILL.md'),
        '---\nname: review\ndescription: Review a pull request\n---\n',
      )

      const result = await resolveCapabilityEntries({commands: [], cwd, plugins: [], skills: ['review'], userDir})
      expect(result.skills).to.deep.equal([{description: 'Review a pull request', name: 'review'}])
    })

    it('falls back to the user-level directory and resolves command argument hints', async () => {
      await fs.outputFile(
        path.join(userDir, 'commands', 'commit.md'),
        '---\ndescription: Create a git commit\nargument-hint: [message]\n---\n',
      )

      const result = await resolveCapabilityEntries({commands: ['/commit'], cwd, plugins: [], skills: [], userDir})
      expect(result.commands).to.deep.equal([
        {argumentHint: '[message]', description: 'Create a git commit', name: '/commit'},
      ])
    })

    it('resolves plugin-qualified names through the plugin path', async () => {
      await fs.outputFile(
        path.join(pluginDir, 'skills', 'sentry-go-sdk', 'SKILL.md'),
        '---\ndescription: Set up the Sentry Go SDK\n---\n',
      )
      await fs.outputFile(path.join(pluginDir, 'commands', 'seer.md'), '---\ndescription: Ask Seer\n---\n')

      const result = await resolveCapabilityEntries({
        commands: ['sentry:seer'],
        cwd,
        plugins: [{name: 'sentry', path: pluginDir}],
        skills: ['sentry:sentry-go-sdk'],
        userDir,
      })

      expect(result.skills).to.deep.equal([{description: 'Set up the Sentry Go SDK', name: 'sentry:sentry-go-sdk'}])
      expect(result.commands).to.deep.equal([{description: 'Ask Seer', name: 'sentry:seer'}])
    })

    it('falls back to the other layout when skills are backed by command markdown (and vice versa)', async () => {
      // Claude Code lists markdown commands among skills and skills among
      // slash commands, so each kind probes the other layout second.
      await fs.outputFile(
        path.join(pluginDir, 'commands', 'adversarial-review.md'),
        '---\ndescription: Codex review\n---\n',
      )
      await fs.outputFile(
        path.join(userDir, 'skills', 'remotion', 'SKILL.md'),
        '---\ndescription: Remotion best practices\n---\n',
      )

      const result = await resolveCapabilityEntries({
        commands: ['remotion'],
        cwd,
        plugins: [{name: 'codex', path: pluginDir}],
        skills: ['codex:adversarial-review'],
        userDir,
      })

      expect(result.skills).to.deep.equal([{description: 'Codex review', name: 'codex:adversarial-review'}])
      expect(result.commands).to.deep.equal([{description: 'Remotion best practices', name: 'remotion'}])
    })

    it('returns bare entries when no backing file exists', async () => {
      const result = await resolveCapabilityEntries({
        commands: ['/compact'],
        cwd,
        plugins: [],
        skills: ['ghost'],
        userDir,
      })
      expect(result).to.deep.equal({commands: [{name: '/compact'}], skills: [{name: 'ghost'}]})
    })

    it('never resolves names that escape the search roots', async () => {
      await fs.outputFile(path.join(testDir, 'outside.md'), '---\ndescription: outside\n---\n')

      const result = await resolveCapabilityEntries({
        commands: ['../outside'],
        cwd: path.join(cwd, '.claude', 'commands'),
        plugins: [],
        skills: [],
        userDir,
      })
      expect(result.commands).to.deep.equal([{name: '../outside'}])
    })
  })
})
