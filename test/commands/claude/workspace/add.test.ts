/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('agent:workspace:add', () => {
  let AgentWorkspaceAdd: any
  let addWorkspaceStub: SinonStub

  beforeEach(async () => {
    addWorkspaceStub = stub().resolves(true)

    const imported = await esmock('../../../../src/commands/claude/workspace/add.js', {
      '../../../../src/workspace-config.js': {addWorkspace: addWorkspaceStub},
      '@inquirer/prompts': {input: stub().resolves(''), select: stub().resolves('sandbox')},
    })
    AgentWorkspaceAdd = imported.default
  })

  it('passes parsed repo entries to addWorkspace', async () => {
    const cmd = new AgentWorkspaceAdd(
      ['--workspace', 'proj01', '--mode', 'local', '--repo', 'repo-a=/code/repo-a', '--repo', 'repo-b=/code/repo-b'],
      {
        configDir: '/tmp/test-config',
        root: process.cwd(),
        runHook: stub().resolves({failures: [], successes: []}),
      } as any,
    )
    stub(cmd, 'log')

    await cmd.run()

    expect(addWorkspaceStub.calledOnce).to.be.true
    expect(addWorkspaceStub.firstCall.args[0]).to.equal('/tmp/test-config')
    expect(addWorkspaceStub.firstCall.args[1]).to.equal('proj01')
    expect(addWorkspaceStub.firstCall.args[2]).to.deep.equal({
      mode: 'local',
      repos: {
        'repo-a': '/code/repo-a',
        'repo-b': '/code/repo-b',
      },
    })
    expect(addWorkspaceStub.firstCall.args[3]).to.be.a('function')
  })

  it('errors when a repo entry is malformed', async () => {
    const cmd = new AgentWorkspaceAdd(['--workspace', 'proj01', '--mode', 'local', '--repo', 'repo-a'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: stub().resolves({failures: [], successes: []}),
    } as any)
    stub(cmd, 'log')
    const errorStub = stub(cmd, 'error').throws(new Error("Invalid repo format 'repo-a'. Expected name=path."))

    let thrown: Error | undefined
    try {
      await cmd.run()
    } catch (error) {
      thrown = error as Error
    }

    expect(errorStub.calledOnce).to.be.true
    expect(thrown?.message).to.include("Invalid repo format 'repo-a'")
    expect(addWorkspaceStub.called).to.be.false
  })

  it('requires at least one repo entry', async () => {
    const cmd = new AgentWorkspaceAdd(['--workspace', 'proj01', '--mode', 'local'], {
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

    expect(thrown?.message).to.match(/Missing required flag repo|At least one repository entry is required\./)
    expect(addWorkspaceStub.called).to.be.false
  })
})
