/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workspace:update', () => {
  let AgentWorkspaceUpdate: any
  let readWorkspaceStub: SinonStub
  let updateWorkspaceStub: SinonStub
  let deleteRepoFromWorkspaceStub: SinonStub
  let getDefaultWorkspaceStub: SinonStub

  beforeEach(async () => {
    readWorkspaceStub = stub()
    updateWorkspaceStub = stub().resolves(true)
    deleteRepoFromWorkspaceStub = stub().resolves(true)
    getDefaultWorkspaceStub = stub()

    const imported = await esmock('../../../../src/commands/claude/workspace/update.js', {
      '../../../../src/config.js': {
        deleteRepoFromWorkspace: deleteRepoFromWorkspaceStub,
        getDefaultWorkspace: getDefaultWorkspaceStub,
        readWorkspace: readWorkspaceStub,
        updateWorkspace: updateWorkspaceStub,
      },
      '@inquirer/prompts': {input: stub().resolves('')},
    })
    AgentWorkspaceUpdate = imported.default
  })

  it('passes the actual default workspace name when --workspace is not provided', async () => {
    readWorkspaceStub.resolves({'repo-a': '/code/repo-a'})
    getDefaultWorkspaceStub.resolves('proj01')

    const cmd = new AgentWorkspaceUpdate(['--repo', 'repo-a=/code/repo-a-new'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(updateWorkspaceStub.calledOnce).to.be.true
    expect(updateWorkspaceStub.firstCall.args[1]).to.equal('proj01')
  })

  it('passes the --workspace flag value when provided', async () => {
    readWorkspaceStub.resolves({'repo-a': '/code/repo-a'})

    const cmd = new AgentWorkspaceUpdate(['--workspace', 'myws', '--repo', 'repo-a=/new'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(updateWorkspaceStub.firstCall.args[1]).to.equal('myws')
  })

  it('uses resolved name when removing repos', async () => {
    readWorkspaceStub.resolves({'repo-a': '/code/repo-a', 'repo-b': '/code/repo-b'})
    getDefaultWorkspaceStub.resolves('proj01')

    const cmd = new AgentWorkspaceUpdate(['--remove-repo', 'repo-a'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(deleteRepoFromWorkspaceStub.firstCall.args[1]).to.equal('proj01')
  })
})
