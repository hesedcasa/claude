/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('init hook: register-capability-commands', () => {
  let hook: any
  let registerStub: SinonStub

  async function loadHook() {
    const imported = await esmock('../../../src/hooks/init/register-capability-commands.js', {
      '../../../src/capability-commands.js': {registerCapabilityCommands: registerStub},
    })
    hook = imported.default
  }

  it('registers capability commands with the config and invoked command id', async () => {
    registerStub = stub().resolves()
    await loadHook()

    const config = {cacheDir: '/tmp/test-cache'}
    await hook.call({} as any, {config, id: 'claude:list'} as any)

    expect(registerStub.calledOnceWith(config, 'claude:list')).to.be.true
  })

  it('swallows registration errors so the CLI still starts', async () => {
    registerStub = stub().rejects(new Error('boom'))
    await loadHook()

    await hook.call({} as any, {config: {}, id: 'claude:list'} as any)

    expect(registerStub.calledOnce).to.be.true
  })
})
