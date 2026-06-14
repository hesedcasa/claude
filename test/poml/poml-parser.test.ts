import {expect} from 'chai'

import {parsePoml} from '../../src/poml/poml-parser.js'

describe('parsePoml', () => {
  it('parses role, task, and typed input/output fields', () => {
    const doc = parsePoml(`
      <poml>
        <role>You are a translator.</role>
        <task>Translate the text.</task>
        <input name="text" type="string" description="source text" />
        <output name="translation" type="string" />
      </poml>
    `)

    expect(doc.role).to.equal('You are a translator.')
    expect(doc.task).to.equal('Translate the text.')
    expect(doc.inputs).to.deep.equal([{description: 'source text', name: 'text', optional: false, type: 'string'}])
    expect(doc.outputs).to.deep.equal([{name: 'translation', optional: false, type: 'string'}])
    expect(doc.reasoning).to.equal(false)
  })

  it('substitutes {{ }} template variables from <let> and overrides', () => {
    const doc = parsePoml(
      `
      <poml>
        <let name="lang" value="French" />
        <task>Translate to {{lang}} in a {{tone}} tone.</task>
        <input name="text">Hello {{lang}}</input>
      </poml>
    `,
      {tone: 'formal'},
    )

    expect(doc.task).to.equal('Translate to French in a formal tone.')
    expect(doc.inputs[0].defaultValue).to.equal('Hello French')
  })

  it('parses few-shot examples with input/output children', () => {
    const doc = parsePoml(`
      <poml>
        <input name="q" />
        <output name="a" />
        <example>
          <input name="q">2+2</input>
          <output name="a">4</output>
        </example>
      </poml>
    `)

    expect(doc.examples).to.deep.equal([{inputs: {q: '2+2'}, outputs: {a: '4'}}])
  })

  it('detects chain-of-thought via the module attribute', () => {
    const doc = parsePoml('<poml module="chain-of-thought"><task>x</task></poml>')
    expect(doc.reasoning).to.equal(true)
  })

  it('detects reasoning via attribute and via a <reasoning/> element', () => {
    expect(parsePoml('<poml reasoning="true"><task>x</task></poml>').reasoning).to.equal(true)
    expect(parsePoml('<poml><reasoning/><task>x</task></poml>').reasoning).to.equal(true)
  })

  it('folds <output-format> into the hint', () => {
    const doc = parsePoml(`
      <poml>
        <hint>Be concise.</hint>
        <output-format>Return JSON.</output-format>
      </poml>
    `)
    expect(doc.hint).to.equal('Be concise. Return JSON.')
  })

  it('marks fields optional via required=false, optional=true, or a trailing ?', () => {
    const doc = parsePoml(`
      <poml>
        <input name="a" required="false" />
        <input name="b" optional="true" />
        <input name="c?" />
      </poml>
    `)
    expect(doc.inputs.map((f) => f.name)).to.deep.equal(['a', 'b', 'c'])
    expect(doc.inputs.every((f) => f.optional)).to.equal(true)
  })

  it('ignores comments and unknown tags', () => {
    const doc = parsePoml(`
      <poml>
        <!-- a comment with <fake> tags -->
        <task>Do it.</task>
        <unknown>ignored</unknown>
      </poml>
    `)
    expect(doc.task).to.equal('Do it.')
    expect(doc.inputs).to.have.length(0)
  })

  it('throws when an input field is missing a name', () => {
    expect(() => parsePoml('<poml><input type="string" /></poml>')).to.throw(/missing a required "name"/)
  })

  it('parses without a <poml> root element (lenient)', () => {
    const doc = parsePoml('<task>Standalone</task><input name="x" />')
    expect(doc.task).to.equal('Standalone')
    expect(doc.inputs).to.have.length(1)
  })
})
