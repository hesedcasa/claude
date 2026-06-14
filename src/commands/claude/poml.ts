import {formatAsToon} from '@hesed/plugin-lib'
import {Args, Command, Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'

import {loadAgentConfig} from '../../agent/profile-config.js'
import {compilePoml, runAxProgram} from '../../poml/ax-program.js'
import {parsePoml, type PomlField} from '../../poml/poml-parser.js'

function parseKeyValues(values: string[] | undefined): Record<string, string> {
  const result: Record<string, string> = {}
  for (const entry of values ?? []) {
    const eq = entry.indexOf('=')
    if (eq === -1) throw new Error(`Invalid --var "${entry}": expected key=value`)
    result[entry.slice(0, eq).trim()] = entry.slice(eq + 1)
  }

  return result
}

/**
 * Resolve the input field values to feed the program: field defaults first,
 * then the `--input` JSON object, then a bare positional input mapped onto the
 * sole input field when the signature has exactly one.
 */
function resolveInputs(
  fields: PomlField[],
  jsonInput: string | undefined,
  positional: string | undefined,
): Record<string, unknown> {
  const inputs: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.defaultValue !== undefined) inputs[field.name] = field.defaultValue
  }

  if (jsonInput) {
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonInput)
    } catch {
      throw new Error('--input must be a valid JSON object of field values')
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('--input must be a valid JSON object of field values')
    }

    Object.assign(inputs, parsed)
  }

  if (positional !== undefined) {
    if (fields.length === 1) {
      inputs[fields[0].name] = positional
    } else {
      throw new Error(
        `Cannot map positional input: signature has ${fields.length} input fields. Use --input '{...}' instead.`,
      )
    }
  }

  return inputs
}

export default class AgentPoml extends Command {
  static override args = {
    file: Args.string({description: 'Path to the .poml file', required: true}),
    input: Args.string({description: 'Value for the single input field (when the signature has exactly one)'}),
  }
  static override description = 'Convert a POML file into a DSPy-style Ax program and execute it in memory'
  static override examples = [
    '<%= config.bin %> <%= command.id %> prompt.poml "What is the capital of France?"',
    '<%= config.bin %> <%= command.id %> classify.poml --input \'{"review":"Great product"}\'',
    '<%= config.bin %> <%= command.id %> summary.poml --var topic=rivers --dry-run',
  ]
  static override flags = {
    'dry-run': Flags.boolean({
      description: 'Compile and print the Ax program without executing it',
      required: false,
    }),
    input: Flags.string({
      description: 'JSON object of input field values (e.g. \'{"question":"..."}\')',
      required: false,
    }),
    model: Flags.string({char: 'm', description: 'Model to use (e.g. claude-opus-4-7)', required: false}),
    profile: Flags.string({char: 'p', description: 'Authentication profile name', required: false}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
    var: Flags.string({
      description: 'Template variable as key=value (repeatable) for {{ }} placeholders',
      multiple: true,
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AgentPoml)

    const source = await readFile(args.file, 'utf8').catch(() => {
      this.error(`Could not read POML file: ${args.file}`)
    })

    const overrides = parseKeyValues(flags.var)
    const doc = parsePoml(source as string, overrides)
    const program = compilePoml(doc)
    const inputs = resolveInputs(program.inputs, flags.input, args.input)

    if (flags['dry-run']) {
      const result = {
        examples: program.examples,
        inputs,
        signature: program.signature,
        success: true,
      }
      this.output(result, flags.toon)
      return
    }

    const config = await loadAgentConfig(this.config, this.log.bind(this), flags.profile)
    if (!config) return

    const missing = program.inputs.filter((f) => !f.optional && inputs[f.name] === undefined)
    if (missing.length > 0) {
      this.error(`Missing required input(s): ${missing.map((f) => f.name).join(', ')}`)
    }

    const model = flags.model
      ? (config.models?.[flags.model as 'haiku' | 'opus' | 'sonnet'] ?? flags.model)
      : config.models?.sonnet

    const result = await runAxProgram({
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || undefined,
      inputs,
      model,
      program,
    })

    this.output(result, flags.toon)
  }

  private output(result: unknown, toon: boolean): void {
    if (toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
