import {type Config} from '@oclif/core'
import {default as fs} from 'fs-extra'
import {default as path} from 'node:path'

/** A user-defined prompt saved locally for later reuse. */
export interface PromptConfig {
  /** The user prompt sent to the agent. */
  body: string
  description?: string
  /** Optional system prompt applied when the prompt is run. */
  system?: string
}

/** Prompts keyed by name. */
export type Prompts = Record<string, PromptConfig>

/**
 * Prompts persist as JSON Lines: one `{name: PromptConfig}` object per line. The
 * name is the object key rather than a field, so it appears once. The
 * line-oriented format keeps diffs to a single line per prompt and lets the
 * store be appended to or grepped without parsing the whole file.
 */
export const PROMPTS_FILE = 'claude-prompts.jsonl'

/**
 * Read every saved prompt. A missing store is an empty collection; any other
 * failure (a malformed line, an unreadable file) is rethrown so a subsequent
 * save can't silently overwrite an unreadable store and lose existing prompts.
 */
export async function readPrompts(config: Config): Promise<Prompts> {
  let contents: string
  try {
    contents = await fs.readFile(path.join(config.configDir, PROMPTS_FILE), 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }

    throw error
  }

  const prompts: Prompts = {}
  for (const line of contents.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    Object.assign(prompts, JSON.parse(trimmed) as Prompts)
  }

  return prompts
}

export async function savePrompts(config: Config, prompts: Prompts): Promise<void> {
  const lines = Object.entries(prompts).map(([name, prompt]) => JSON.stringify({[name]: prompt}))
  const contents = lines.length > 0 ? lines.join('\n') + '\n' : ''
  await fs.outputFile(path.join(config.configDir, PROMPTS_FILE), contents)
}

export function resolvePrompt(prompts: Prompts, name: string): [string, PromptConfig] {
  const prompt = prompts[name]
  if (!prompt) {
    throw new Error(`Prompt '${name}' does not exist.`)
  }

  return [name, prompt]
}

/**
 * Template placeholders use a `{{name}}` syntax (whitespace tolerated). The
 * double brace and restricted name charset keep it from clashing with literal
 * single-brace text (e.g. `{result}`) or other tools' `{{ $json.x }}` markers.
 */
const PLACEHOLDER_PATTERN = String.raw`\{\{\s*([A-Za-z0-9_]+)\s*\}\}`

/** The unique placeholder names referenced by a template, in first-seen order. */
export function extractPlaceholders(template: string): string[] {
  const names = new Set<string>()
  for (const match of template.matchAll(new RegExp(PLACEHOLDER_PATTERN, 'g'))) {
    names.add(match[1])
  }

  return [...names]
}

/** Replace every `{{name}}` for which `args` has a value; leave the rest intact. */
export function renderPrompt(template: string, args: Record<string, string>): string {
  return template.replaceAll(new RegExp(PLACEHOLDER_PATTERN, 'g'), (full, name) =>
    Object.hasOwn(args, name) ? args[name] : full,
  )
}
