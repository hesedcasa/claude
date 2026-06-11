/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import {type SinonStub, stub} from 'sinon'

import hook from '../../src/hooks/command-not-found.js'

describe('hooks:command_not_found', () => {
  let findTopicStub: SinonStub
  let runCommandStub: SinonStub
  let warnStub: SinonStub
  let config: any
  let context: any

  beforeEach(() => {
    findTopicStub = stub()
    runCommandStub = stub().resolves('run-result')
    warnStub = stub()
    config = {findTopic: findTopicStub, runCommand: runCommandStub}
    context = {config, warn: warnStub}
  })

  const invoke = (id: string, argv: string[] = []) => (hook as any).call(context, {argv, config, id})

  it('dispatches an unknown claude subcommand to claude run', async () => {
    const result = await invoke('claude:/help')

    expect(runCommandStub.calledOnceWith('claude:run', ['/help'])).to.be.true
    expect(warnStub.calledOnce).to.be.true
    expect(result).to.equal('run-result')
  })

  it('reconstructs collated positional input from the id', async () => {
    await invoke('claude:review:fix this')

    expect(runCommandStub.firstCall.args[1]).to.deep.equal(['review', 'fix this'])
  })

  it('restores colons inside a single quoted input argument', async () => {
    await invoke('claude:review:fix: the bug')

    expect(runCommandStub.firstCall.args[1]).to.deep.equal(['review', 'fix: the bug'])
  })

  it('forwards remaining argv (flags and post-flag input)', async () => {
    await invoke('claude:review', ['--stream', 'fix it'])

    expect(runCommandStub.firstCall.args[1]).to.deep.equal(['review', '--stream', 'fix it'])
  })

  it('throws for ids outside the claude topic', async () => {
    try {
      await invoke('bogus')
      expect.fail('expected hook to throw')
    } catch (error: any) {
      expect(error.message).to.equal('command bogus not found')
    }

    expect(runCommandStub.called).to.be.false
  })

  it('throws for unknown commands inside existing sub-topics', async () => {
    findTopicStub.withArgs('claude:auth').returns({name: 'claude:auth'})

    try {
      await invoke('claude:auth:bogus')
      expect.fail('expected hook to throw')
    } catch (error: any) {
      expect(error.message).to.equal('command claude auth bogus not found')
    }

    expect(runCommandStub.called).to.be.false
  })

  it('throws when the name segment is missing or a flag', async () => {
    try {
      await invoke('claude:-x')
      expect.fail('expected hook to throw')
    } catch (error: any) {
      expect(error.message).to.equal('command claude -x not found')
    }

    expect(runCommandStub.called).to.be.false
  })
})
