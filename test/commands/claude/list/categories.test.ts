/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

const mockAuth = {apiKey: 'sk-ant-test', apiUrl: 'https://api.anthropic.com'}
const mockData = {
  agents: ['code-reviewer'],
  commands: ['help', 'clear'],
  mcpServers: [{name: 'github', status: 'connected'}],
  skills: ['init', 'review'],
  tools: ['Read', 'Edit'],
}

const CASES = [
  {
    entries: ['code-reviewer'],
    file: 'list/agents.js',
    key: 'agents',
    lines: ['code-reviewer'],
  },
  {
    entries: ['github'],
    file: 'list/mcp-servers.js',
    key: 'mcpServers',
    lines: ['github'],
  },
  {
    entries: ['Read', 'Edit'],
    file: 'list/tools.js',
    key: 'tools',
    lines: ['Read', 'Edit'],
  },
] as const

for (const {entries, file, key, lines} of CASES) {
  describe(`agent:list:${key}`, () => {
    let CommandClass: any
    let listStub: SinonStub
    let clearClientsStub: SinonStub

    const commandOptions = {
      configDir: '/tmp/test-agent-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    }

    beforeEach(async () => {
      listStub = stub().resolves({data: mockData, success: true})
      clearClientsStub = stub()

      const imported = await esmock(
        `../../../../src/commands/claude/${file}`,
        {},
        {
          '../../../../src/agent/agent-client.js': {clearClients: clearClientsStub, list: listStub},
          '../../../../src/agent/profile-config.js': {loadAgentConfig: stub().resolves(mockAuth)},
          '../../../../src/capability-commands.js': {writeCapabilityStore: stub().resolves()},
          '../../../../src/capability-metadata.js': {
            resolveCapabilityEntries: stub().resolves({
              commands: mockData.commands.map((name) => ({name})),
              skills: mockData.skills.map((name) => ({name})),
            }),
          },
          '../../../../src/workspace-config.js': {readWorkspace: stub().resolves()},
        },
      )
      CommandClass = imported.default
    })

    it(`outputs only ${key} as JSON with --json`, async () => {
      const cmd = new CommandClass(['--json'], commandOptions as any)
      const logJsonStub = stub(cmd, 'logJson')

      await cmd.run()

      expect(listStub.calledOnce).to.be.true
      expect(clearClientsStub.calledOnce).to.be.true
      expect(logJsonStub.firstCall.args[0]).to.deep.equal(entries)
    })

    it(`prints only ${key} as text by default`, async () => {
      const cmd = new CommandClass([], commandOptions as any)
      const logStub = stub(cmd, 'log')
      stub(cmd, 'logJson')

      await cmd.run()

      expect(logStub.getCalls().map((call) => call.args[0])).to.deep.equal(lines)
    })

    it('prints the error message when unsuccessful', async () => {
      listStub.resolves({error: 'boom', success: false})

      const cmd = new CommandClass([], commandOptions as any)
      const logStub = stub(cmd, 'log')
      stub(cmd, 'logJson')

      await cmd.run()

      expect(logStub.calledWith('Error: boom')).to.be.true
    })
  })
}
