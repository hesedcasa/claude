/**
 * Minimal parser for the POML (Prompt Orchestration Markup Language) subset
 * this project supports. POML is an HTML/XML-like markup for prompts; here we
 * map a pragmatic subset onto a DSPy-style signature (typed inputs/outputs),
 * few-shot examples, and a task description so it can be compiled to an Ax
 * program. See `ax-program.ts` for the conversion step.
 */

export interface PomlField {
  defaultValue?: string
  description?: string
  name: string
  optional?: boolean
  type: string
}

export interface PomlExample {
  inputs: Record<string, string>
  outputs: Record<string, string>
}

export interface PomlDocument {
  examples: PomlExample[]
  hint?: string
  inputs: PomlField[]
  outputs: PomlField[]
  reasoning: boolean
  role?: string
  task?: string
}

interface RawNode {
  attrs: Record<string, string>
  children: RawChild[]
  tag: string
}

type RawChild = RawNode | {text: string}

const ATTR_RE = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g

function isElement(child: RawChild): child is RawNode {
  return 'tag' in child
}

function parseTag(body: string): {attrs: Record<string, string>; tag: string} {
  const trimmed = body.trim()
  const spaceIdx = trimmed.search(/\s/)
  const tag = (spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx)).toLowerCase()
  const attrs: Record<string, string> = {}

  if (spaceIdx !== -1) {
    const rest = trimmed.slice(spaceIdx)
    let match: null | RegExpExecArray
    ATTR_RE.lastIndex = 0
    while ((match = ATTR_RE.exec(rest)) !== null) {
      const [, key, dq, sq, bare] = match
      attrs[key.toLowerCase()] = dq ?? sq ?? bare ?? ''
    }
  }

  return {attrs, tag}
}

/**
 * Tokenise an XML-ish string into a tree of element/text nodes. Tolerant of
 * comments, self-closing tags, boolean attributes, and unmatched closers.
 */
function tokenize(input: string): RawChild[] {
  const root: RawNode = {attrs: {}, children: [], tag: '#root'}
  const stack: RawNode[] = [root]
  const pushText = (text: string) => {
    if (text) stack.at(-1)!.children.push({text})
  }

  let i = 0
  while (i < input.length) {
    const lt = input.indexOf('<', i)
    if (lt === -1) {
      pushText(input.slice(i))
      break
    }

    if (lt > i) pushText(input.slice(i, lt))

    if (input.startsWith('<!--', lt)) {
      const end = input.indexOf('-->', lt + 4)
      i = end === -1 ? input.length : end + 3
      continue
    }

    const gt = input.indexOf('>', lt)
    if (gt === -1) {
      pushText(input.slice(lt))
      break
    }

    const raw = input.slice(lt + 1, gt).trim()
    i = gt + 1

    if (raw.startsWith('/')) {
      const name = raw.slice(1).trim().toLowerCase()
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].tag === name) {
          stack.length = s
          break
        }
      }

      continue
    }

    const selfClose = raw.endsWith('/')
    const {attrs, tag} = parseTag(selfClose ? raw.slice(0, -1) : raw)
    const node: RawNode = {attrs, children: [], tag}
    stack.at(-1)!.children.push(node)
    if (!selfClose) stack.push(node)
  }

  return root.children
}

function textOf(node: RawNode): string {
  return node.children
    .filter((c): c is {text: string} => !isElement(c))
    .map((c) => c.text)
    .join('')
    .trim()
}

function applyVars(value: string, vars: Record<string, string>): string {
  return value.replaceAll(/\{\{\s*([\w.-]+)\s*\}\}/g, (whole, name: string) =>
    Object.hasOwn(vars, name) ? vars[name] : whole,
  )
}

function toField(node: RawNode, vars: Record<string, string>): PomlField {
  const name = node.attrs.name?.trim()
  if (!name) {
    throw new Error(`<${node.tag}> is missing a required "name" attribute`)
  }

  const description = node.attrs.description ? applyVars(node.attrs.description, vars) : undefined
  const defaultText = textOf(node)
  const optional = node.attrs.optional === 'true' || node.attrs.required === 'false' || name.endsWith('?')

  return {
    ...(defaultText && {defaultValue: applyVars(defaultText, vars)}),
    ...(description && {description}),
    name: name.replace(/\?$/, ''),
    optional,
    type: (node.attrs.type ?? 'string').trim(),
  }
}

function toExample(node: RawNode, vars: Record<string, string>): PomlExample {
  const inputs: Record<string, string> = {}
  const outputs: Record<string, string> = {}

  for (const child of node.children) {
    if (!isElement(child)) continue
    const fieldName = child.attrs.name?.trim()
    if (!fieldName) continue
    const value = applyVars(textOf(child), vars)
    if (child.tag === 'input') inputs[fieldName] = value
    else if (child.tag === 'output') outputs[fieldName] = value
  }

  return {inputs, outputs}
}

/**
 * Collect `<let name=.. value=..>` (or `<let name=..>text</let>`) variable
 * definitions, applying earlier definitions to later values.
 */
function collectVars(nodes: RawChild[], overrides: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const node of nodes) {
    if (!isElement(node) || node.tag !== 'let') continue
    const name = node.attrs.name?.trim()
    if (!name) continue
    const value = node.attrs.value ?? textOf(node)
    vars[name] = applyVars(value, vars)
  }

  return {...vars, ...overrides}
}

/**
 * Parse a `.poml` document. `overrides` supplies/overrides `<let>` template
 * variables (e.g. from `--var key=value`).
 */
export function parsePoml(source: string, overrides: Record<string, string> = {}): PomlDocument {
  const top = tokenize(source)
  const rootEl = top.find((c): c is RawNode => isElement(c) && c.tag === 'poml')
  const body = rootEl ? rootEl.children : top

  const reasoning =
    rootEl?.attrs.reasoning === 'true' ||
    rootEl?.attrs.module === 'chain-of-thought' ||
    body.some((c) => isElement(c) && c.tag === 'reasoning')

  const vars = collectVars(body, overrides)

  const doc: PomlDocument = {examples: [], inputs: [], outputs: [], reasoning}

  for (const node of body) {
    if (!isElement(node)) continue
    switch (node.tag) {
      case 'example': {
        doc.examples.push(toExample(node, vars))
        break
      }

      case 'hint': {
        doc.hint = applyVars(textOf(node), vars)
        break
      }

      case 'input': {
        doc.inputs.push(toField(node, vars))
        break
      }

      case 'output': {
        doc.outputs.push(toField(node, vars))
        break
      }

      case 'output-format': {
        doc.hint = [doc.hint, applyVars(textOf(node), vars)].filter(Boolean).join(' ')
        break
      }

      case 'role': {
        doc.role = applyVars(textOf(node), vars)
        break
      }

      case 'task': {
        doc.task = applyVars(textOf(node), vars)
        break
      }

      default: {
        break
      }
    }
  }

  return doc
}
