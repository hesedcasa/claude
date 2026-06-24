/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

import {compilePoml} from '../../src/poml/ax-program.js'
import {type PomlDocument} from '../../src/poml/poml-parser.js'

function doc(overrides: Partial<PomlDocument> = {}): PomlDocument {
  return {examples: [], inputs: [], outputs: [], reasoning: false, ...overrides}
}

describe('ax-program', () => {
  describe('compilePoml', () => {
    it('assembles a sanitized description from role/task/hint', () => {
      const program = compilePoml(
        doc({
          hint: 'Be "brief".',
          inputs: [{name: 'text', type: 'string'}],
          outputs: [{name: 'summary', type: 'string'}],
          role: 'You are an editor.',
          task: 'Summarize\nthe text.',
        }),
      )

      expect(program.signature).to.equal(
        '"You are an editor. Summarize the text. Be brief." text:string -> summary:string',
      )
    })

    it('uses default input/output fields when none are declared', () => {
      const program = compilePoml(doc({task: 'Do something.'}))
      expect(program.signature).to.equal('"Do something." input:string -> output:string')
    })

    it('prepends a reasoning output field for chain-of-thought', () => {
      const program = compilePoml(
        doc({inputs: [{name: 'q', type: 'string'}], outputs: [{name: 'a', type: 'string'}], reasoning: true}),
      )
      expect(program.signature).to.equal(
        'q:string -> reasoning:string "Think step by step before answering.", a:string',
      )
    })

    it('formats class fields with their options', () => {
      const program = compilePoml(
        doc({
          inputs: [{name: 'review', type: 'string'}],
          outputs: [{description: 'positive, negative', name: 'sentiment', type: 'class'}],
        }),
      )
      expect(program.signature).to.equal('review:string -> sentiment:class "positive, negative"')
    })

    it('maps type aliases to Ax types', () => {
      const program = compilePoml(
        doc({
          inputs: [
            {name: 'count', type: 'int'},
            {name: 'items', type: 'array'},
          ],
          outputs: [{name: 'ok', type: 'bool'}],
        }),
      )
      expect(program.signature).to.equal('count:number, items:string[] -> ok:boolean')
    })

    it('marks optional fields with a trailing ?', () => {
      const program = compilePoml(
        doc({inputs: [{name: 'note', optional: true, type: 'string'}], outputs: [{name: 'out', type: 'string'}]}),
      )
      expect(program.signature).to.equal('note?:string -> out:string')
    })

    it('keeps only declared fields in example demos', () => {
      const program = compilePoml(
        doc({
          examples: [{inputs: {extra: 'x', q: 'hi'}, outputs: {a: 'yo'}}],
          inputs: [{name: 'q', type: 'string'}],
          outputs: [{name: 'a', type: 'string'}],
        }),
      )
      expect(program.examples).to.deep.equal([{a: 'yo', q: 'hi'}])
    })

    it('throws on an invalid field name', () => {
      expect(() => compilePoml(doc({inputs: [{name: 'bad name', type: 'string'}]}))).to.throw(/Invalid field name/)
    })

    it('throws when a class field has no options', () => {
      expect(() => compilePoml(doc({outputs: [{name: 'label', type: 'class'}]}))).to.throw(/requires a description/)
    })
  })

  describe('runAxProgram', () => {
    let runAxProgram: any
    let forwardStub: SinonStub
    let setExamplesStub: SinonStub
    let getUsageStub: SinonStub
    let axStub: SinonStub
    let setApiUrlStub: SinonStub
    let anthropicCtor: SinonStub

    const program = {
      description: 'desc',
      examples: [{a: '1', q: 'x'}],
      inputs: [{name: 'q', type: 'string'}],
      outputs: [{name: 'a', type: 'string'}],
      signature: 'q:string -> a:string',
    }

    before(async () => {
      forwardStub = stub().resolves({a: '42'})
      setExamplesStub = stub()
      getUsageStub = stub().returns([{ai: 'anthropic', model: 'claude'}])
      axStub = stub().returns({forward: forwardStub, getUsage: getUsageStub, setExamples: setExamplesStub})
      setApiUrlStub = stub()
      anthropicCtor = stub().callsFake(function (this: any) {
        this.setAPIURL = setApiUrlStub
      })

      const imported = await esmock('../../src/poml/ax-program.js', {
        '@ax-llm/ax': {ax: axStub, AxAIAnthropic: anthropicCtor},
      })
      runAxProgram = imported.runAxProgram
    })

    beforeEach(() => {
      forwardStub.resetHistory()
      forwardStub.resolves({a: '42'})
      setExamplesStub.resetHistory()
      axStub.resetHistory()
      setApiUrlStub.resetHistory()
      anthropicCtor.resetHistory()
    })

    it('builds the generator, runs forward, and returns outputs', async () => {
      const result = await runAxProgram({
        apiKey: 'sk-test',
        apiUrl: 'https://proxy/v1',
        inputs: {q: 'hello'},
        model: 'claude-sonnet-4-6',
        program,
      })

      expect(axStub.firstCall.args[0]).to.equal('q:string -> a:string')
      expect(setExamplesStub.calledOnceWith(program.examples)).to.equal(true)
      expect(anthropicCtor.firstCall.args[0]).to.deep.include({apiKey: 'sk-test'})
      expect(setApiUrlStub.calledOnceWith('https://proxy/v1')).to.equal(true)
      expect(forwardStub.firstCall.args[1]).to.deep.equal({q: 'hello'})
      expect(result.success).to.equal(true)
      expect((result.data as any).outputs).to.deep.equal({a: '42'})
      expect((result.data as any).signature).to.equal('q:string -> a:string')
    })

    it('does not set examples when there are none', async () => {
      await runAxProgram({apiKey: 'k', inputs: {q: 'x'}, program: {...program, examples: []}})
      expect(setExamplesStub.called).to.equal(false)
    })

    it('returns a failure result when forward throws', async () => {
      forwardStub.rejects(new Error('model exploded'))
      const result = await runAxProgram({apiKey: 'k', inputs: {q: 'x'}, program})
      expect(result.success).to.equal(false)
      expect(result.error).to.equal('model exploded')
    })
  })
})
