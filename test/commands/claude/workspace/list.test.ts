/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workspace:list', () => {
  let AgentWorkspaceList: any
  let getDefaultWorkspaceStub: SinonStub
  let readWorkspacesStub: SinonStub

  beforeEach(async () => {
    getDefaultWorkspaceStub = stub()
    readWorkspacesStub = stub()

    const imported = await esmock('../../../../src/commands/claude/workspace/list.js', {
      '../../../../src/workspaceConfig.js': {
        getDefaultWorkspace: getDefaultWorkspaceStub,
        readWorkspaces: readWorkspacesStub,
      },
    })
    AgentWorkspaceList = imported.default
  })

  it('lists workspaces and marks the default', async () => {
    readWorkspacesStub.resolves({
      proj01: {'repo-a': '/code/repo-a'},
      proj02: {'repo-b': '/code/repo-b'},
    })
    getDefaultWorkspaceStub.resolves('proj02')

    const cmd = new AgentWorkspaceList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(readWorkspacesStub.calledOnce).to.be.true
    expect(readWorkspacesStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(result.workspaces).to.deep.equal([
      {name: 'proj01', repos: {'repo-a': '/code/repo-a'}},
      {default: true, name: 'proj02', repos: {'repo-b': '/code/repo-b'}},
    ])
    expect(logStub.calledWith('proj02 (default):\n  repo-b: /code/repo-b')).to.be.true
  })

  it('returns an empty list when no workspaces exist', async () => {
    readWorkspacesStub.resolves({})

    const cmd = new AgentWorkspaceList([], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.workspaces).to.deep.equal([])
    expect(logStub.calledWith("No workspaces found. Run 'claude workspace add' to create one.")).to.be.true
    expect(getDefaultWorkspaceStub.called).to.be.false
  })
})
