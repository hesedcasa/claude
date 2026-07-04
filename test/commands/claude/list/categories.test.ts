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
  {file: 'list/agents.js', key: 'agents'},
  {file: 'command/index.js', key: 'commands'},
  {file: 'list/mcp-servers.js', key: 'mcpServers'},
  {file: 'skill/index.js', key: 'skills'},
  {file: 'list/tools.js', key: 'tools'},
] as const

for (const {file, key} of CASES) {
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
          '../../../../src/workspace-config.js': {readWorkspace: stub().resolves()},
        },
      )
      CommandClass = imported.default
    })

    it(`outputs only ${key}`, async () => {
      const cmd = new CommandClass([], commandOptions as any)
      const logJsonStub = stub(cmd, 'logJson')

      await cmd.run()

      expect(listStub.calledOnce).to.be.true
      expect(clearClientsStub.calledOnce).to.be.true
      expect(logJsonStub.firstCall.args[0]).to.deep.equal({data: {[key]: mockData[key]}, success: true})
    })

    it('returns the full result when unsuccessful', async () => {
      listStub.resolves({error: 'boom', success: false})

      const cmd = new CommandClass([], commandOptions as any)
      const logJsonStub = stub(cmd, 'logJson')

      await cmd.run()

      expect(logJsonStub.firstCall.args[0]).to.deep.equal({error: 'boom', success: false})
    })
  })
}
