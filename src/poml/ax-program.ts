/**
 * Convert a parsed POML document into an Ax (DSPy-for-TypeScript) program and
 * execute it in memory. The POML semantics map onto DSPy concepts as follows:
 *
 * - `<role>` / `<task>` / `<hint>` / `<output-format>` -> the signature's
 *   natural-language description (the DSPy "instructions").
 * - `<input>` / `<output>` -> typed signature fields (`name:type "desc"`).
 * - `<example>` -> few-shot demonstrations attached to the predictor.
 * - `reasoning` / chain-of-thought -> a prepended `reasoning` output field.
 *
 * Nothing is written to disk: the compiled signature is run through Ax's
 * Anthropic provider entirely in process.
 */
import {ax, AxAIAnthropic, type AxAIAnthropicModel} from '@ax-llm/ax'

import type {ApiResult} from '../agent/agent-api.js'
import type {PomlDocument, PomlExample, PomlField} from './poml-parser.js'

export interface CompiledProgram {
  description: string
  examples: Record<string, string>[]
  inputs: PomlField[]
  outputs: PomlField[]
  signature: string
}

export interface RunProgramOptions {
  apiKey: string
  apiUrl?: string
  inputs: Record<string, unknown>
  model?: string
  program: CompiledProgram
}

const FIELD_NAME_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/

const TYPE_ALIASES: Record<string, string> = {
  array: 'string[]',
  bool: 'boolean',
  float: 'number',
  int: 'number',
  integer: 'number',
  object: 'json',
  str: 'string',
  text: 'string',
}

/** Strip characters that would break the Ax signature DSL string. */
function sanitize(value: string): string {
  return value.replaceAll('"', '').replaceAll(/\s+/g, ' ').trim()
}

function normalizeType(type: string): string {
  const lower = type.trim().toLowerCase()
  return TYPE_ALIASES[lower] ?? lower
}

function fieldToDsl(field: PomlField): string {
  if (!FIELD_NAME_RE.test(field.name)) {
    throw new Error(
      `Invalid field name "${field.name}": must start with a letter and contain only letters, digits, or underscores`,
    )
  }

  const type = normalizeType(field.type)
  const name = `${field.name}${field.optional ? '?' : ''}`

  // For class fields, the description carries the allowed options.
  if (type === 'class') {
    const options = sanitize(field.description ?? '')
    if (!options) {
      throw new Error(`class field "${field.name}" requires a description listing its options`)
    }

    return `${name}:class "${options}"`
  }

  const description = field.description ? sanitize(field.description) : ''
  return description ? `${name}:${type} "${description}"` : `${name}:${type}`
}

/** Compile a POML document into an Ax signature string plus demos. */
export function compilePoml(doc: PomlDocument): CompiledProgram {
  const description = sanitize([doc.role, doc.task, doc.hint].filter(Boolean).join(' '))

  const inputs = doc.inputs.length > 0 ? doc.inputs : [{name: 'input', type: 'string'}]
  const baseOutputs = doc.outputs.length > 0 ? doc.outputs : [{name: 'output', type: 'string'}]
  const outputs: PomlField[] = doc.reasoning
    ? [{description: 'Think step by step before answering.', name: 'reasoning', type: 'string'}, ...baseOutputs]
    : baseOutputs

  const inputDsl = inputs.map((f) => fieldToDsl(f)).join(', ')
  const outputDsl = outputs.map((f) => fieldToDsl(f)).join(', ')
  const signature = `${description ? `"${description}" ` : ''}${inputDsl} -> ${outputDsl}`

  const inputNames = new Set(inputs.map((f) => f.name))
  const outputNames = new Set(outputs.map((f) => f.name))
  // When chain-of-thought is active, only keep examples that include 'reasoning'.
  // Examples without it produce contradictory few-shot assistant messages (showing
  // only Sentiment: but not Reasoning:), which causes the model to skip the
  // reasoning field and fail Ax's output validation.
  const eligibleExamples = doc.reasoning
    ? doc.examples.filter((ex) => 'reasoning' in ex.outputs)
    : doc.examples
  const examples = eligibleExamples.map((ex) => exampleToDemo(ex, inputNames, outputNames))

  return {description, examples, inputs, outputs, signature}
}

function exampleToDemo(
  example: PomlExample,
  inputNames: Set<string>,
  outputNames: Set<string>,
): Record<string, string> {
  const demo: Record<string, string> = {}
  for (const [key, value] of Object.entries(example.inputs)) {
    if (inputNames.has(key)) demo[key] = value
  }

  for (const [key, value] of Object.entries(example.outputs)) {
    if (outputNames.has(key)) demo[key] = value
  }

  return demo
}

/**
 * Build the Ax generator from a compiled program and run it against the
 * Anthropic provider in memory, returning the typed output fields.
 */
export async function runAxProgram(options: RunProgramOptions): Promise<ApiResult> {
  const {apiKey, apiUrl, inputs, model, program} = options

  try {
    const llm = new AxAIAnthropic({
      apiKey,
      ...(model && {config: {model: model as unknown as AxAIAnthropicModel}}),
    })
    if (apiUrl) {
      // The Anthropic SDK convention: apiUrl is the base (e.g. https://api.z.ai/api/anthropic)
      // and each SDK appends /v1/messages. Ax only appends /messages, so we add /v1 here
      // to produce the same full path.
      const base = apiUrl.replace(/\/+$/, '')
      const axBase = base.endsWith('/v1') ? base : `${base}/v1`
      llm.setAPIURL(axBase)
    }

    const gen = ax(program.signature)
    if (program.examples.length > 0) {
      gen.setExamples(program.examples)
    }

    const outputs = await gen.forward(llm, inputs)
    const usage = gen.getUsage()

    return {
      data: {model, outputs, signature: program.signature, usage},
      success: true,
    }
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}
