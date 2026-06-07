/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workspace:delete', () => {
  let AgentWorkspaceDelete: any
  let deleteRepoFromWorkspaceStub: SinonStub
  let deleteWorkspaceStub: SinonStub
  let getDefaultWorkspaceStub: SinonStub

  beforeEach(async () => {
    deleteRepoFromWorkspaceStub = stub().resolves(true)
    deleteWorkspaceStub = stub().resolves(true)
    getDefaultWorkspaceStub = stub()

    const imported = await esmock('../../../../src/commands/claude/workspace/delete.js', {
      '../../../../src/workspaceConfig.js': {
        deleteRepoFromWorkspace: deleteRepoFromWorkspaceStub,
        deleteWorkspace: deleteWorkspaceStub,
        getDefaultWorkspace: getDefaultWorkspaceStub,
      },
    })
    AgentWorkspaceDelete = imported.default
  })

  it('deletes the requested workspace', async () => {
    const cmd = new AgentWorkspaceDelete(['--workspace', 'proj01'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(deleteWorkspaceStub.calledOnce).to.be.true
    expect(deleteWorkspaceStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(deleteWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    expect(deleteWorkspaceStub.firstCall.args[2]).to.be.a('function')
    expect(deleteRepoFromWorkspaceStub.called).to.be.false
  })

  it('removes a repo from the requested workspace', async () => {
    const cmd = new AgentWorkspaceDelete(['--workspace', 'proj01', '--repo', 'repo-a'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(deleteRepoFromWorkspaceStub.calledOnce).to.be.true
    expect(deleteRepoFromWorkspaceStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(deleteRepoFromWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    expect(deleteRepoFromWorkspaceStub.firstCall.args[2]).to.equal('repo-a')
    expect(deleteWorkspaceStub.called).to.be.false
  })

  it('removes a repo from the default workspace when --workspace is omitted', async () => {
    getDefaultWorkspaceStub.resolves('proj01')

    const cmd = new AgentWorkspaceDelete(['--repo', 'repo-a'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(deleteRepoFromWorkspaceStub.firstCall.args[1]).to.equal('proj01')
  })

  it('errors when neither workspace nor repo is provided', async () => {
    const cmd = new AgentWorkspaceDelete([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(
      new Error('Provide --workspace to delete a workspace, or --repo (with optional --workspace) to remove a repo.'),
    )

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(errorStub.calledOnce).to.be.true
    expect(thrown?.message).to.include('Provide --workspace')
  })

  it('errors when removing a repo without a default workspace', async () => {
    getDefaultWorkspaceStub.resolves()

    const cmd = new AgentWorkspaceDelete(['--repo', 'repo-a'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(new Error('No default workspace set. Use --workspace to specify one.'))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(errorStub.calledOnce).to.be.true
    expect(thrown?.message).to.include('No default workspace set')
    expect(deleteRepoFromWorkspaceStub.called).to.be.false
  })
})
