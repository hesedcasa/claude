/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:command:index', () => {
  let CommandList: any
  let registerCapabilityCommandsStub: SinonStub
  let renderTopicHelpStub: SinonStub

  const commandOptions = {
    configDir: '/tmp/test-agent-config',
    root: process.cwd(),
    runHook: stub().resolves({failures: [], successes: []}),
  }

  beforeEach(async () => {
    registerCapabilityCommandsStub = stub().resolves()
    renderTopicHelpStub = stub().resolves()

    const imported = await esmock(
      '../../../../src/commands/claude/command/index.js',
      {},
      {
        '../../../../src/capability-commands.js': {registerCapabilityCommands: registerCapabilityCommandsStub},
        '../../../../src/topic-help.js': {renderTopicHelp: renderTopicHelpStub},
      },
    )
    CommandList = imported.default
    CommandList.id = 'claude:command'
  })

  it('re-registers dynamic capability commands against the reloaded config, then renders the topic overview', async () => {
    const cmd = new CommandList([], commandOptions as any)

    await cmd.run()

    expect(registerCapabilityCommandsStub.calledOnceWith(cmd.config, 'claude:command')).to.be.true
    expect(renderTopicHelpStub.calledOnceWith(cmd.config, 'claude:command')).to.be.true
    expect(registerCapabilityCommandsStub.calledBefore(renderTopicHelpStub)).to.be.true
  })
})
