/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('topic-help', () => {
  it('does nothing when the topic is not found', async () => {
    const {renderTopicHelp} = await import('../src/topic-help.js')
    const findTopicStub = stub()

    await renderTopicHelp({findTopic: findTopicStub} as any, 'claude:command')

    expect(findTopicStub.calledOnceWith('claude:command')).to.be.true
  })

  it('renders the topic overview through a Help subclass when the topic exists', async () => {
    let showTopicHelpStub: SinonStub

    class FakeHelp {
      config: unknown

      constructor(config: unknown) {
        this.config = config
        showTopicHelpStub = stub(this, 'showTopicHelp' as never).resolves()
      }

      async showTopicHelp(_topic: unknown): Promise<void> {}
    }

    const {renderTopicHelp} = await esmock('../src/topic-help.js', {
      '@oclif/core': {Help: FakeHelp},
    })

    const topic = {name: 'claude:command'}
    const config = {findTopic: stub().returns(topic)}

    await renderTopicHelp(config as any, 'claude:command')

    expect(showTopicHelpStub!.calledOnceWith(topic)).to.be.true
  })
})
