/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workspace:delete', () => {
  let AgentWorkspaceDelete: any
  let deleteWorkspaceStub: SinonStub
  let readWorkspaceStub: SinonStub
  let stdoutIsTtyDescriptor: PropertyDescriptor | undefined

  beforeEach(async () => {
    stdoutIsTtyDescriptor = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY')
    Object.defineProperty(process.stdout, 'isTTY', {configurable: true, value: false})

    deleteWorkspaceStub = stub().resolves(true)
    readWorkspaceStub = stub()

    const imported = await esmock('../../../../src/commands/claude/workspace/delete.js', {
      '../../../../src/workspace-config.js': {
        deleteWorkspace: deleteWorkspaceStub,
        readWorkspace: readWorkspaceStub,
      },
    })
    AgentWorkspaceDelete = imported.default
  })

  afterEach(() => {
    if (stdoutIsTtyDescriptor) {
      Object.defineProperty(process.stdout, 'isTTY', stdoutIsTtyDescriptor)
    } else {
      delete (process.stdout as {isTTY?: boolean}).isTTY
    }
  })

  it('deletes the requested workspace', async () => {
    readWorkspaceStub.resolves({mode: 'local', repos: {'repo-a': '/code/repo-a'}})

    const cmd = new AgentWorkspaceDelete(['--workspace', 'proj01'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    await cmd.run()

    expect(readWorkspaceStub.calledOnceWith('/tmp/test-config', 'proj01')).to.be.true
    expect(deleteWorkspaceStub.calledOnce).to.be.true
    expect(deleteWorkspaceStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(deleteWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    expect(deleteWorkspaceStub.firstCall.args[2]).to.be.a('function')
  })

  it('requires --workspace in non-interactive mode', async () => {
    const cmd = new AgentWorkspaceDelete([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(thrown?.message).to.include('Missing required flag workspace')
    expect(readWorkspaceStub.called).to.be.false
    expect(deleteWorkspaceStub.called).to.be.false
  })

  it('errors when the workspace does not exist', async () => {
    readWorkspaceStub.resolves()

    const cmd = new AgentWorkspaceDelete(['--workspace', 'missing'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(new Error("Workspace 'missing' does not exist."))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(errorStub.calledOnce).to.be.true
    expect(thrown?.message).to.include("Workspace 'missing' does not exist")
    expect(deleteWorkspaceStub.called).to.be.false
  })
})
