import {createProfileManager, type Profiles} from '@hesed/plugin-lib'
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

export type Prompts = Profiles<PromptConfig>

/** Prompts persist in their own plugin-lib store, keyed by name. */
export const PROMPTS_FILE = 'claude-prompts.json'

function manager(config: Config) {
  return createProfileManager<PromptConfig>(config, undefined, PROMPTS_FILE)
}

/**
 * Read every saved prompt. plugin-lib's `readProfiles` throws when the store
 * file does not exist yet; treat only that case as an empty collection. Any
 * other failure (e.g. malformed JSON) is rethrown so a subsequent save can't
 * silently overwrite an unreadable store and lose existing prompts.
 */
export async function readPrompts(config: Config): Promise<Prompts> {
  try {
    return await manager(config).readProfiles()
  } catch (error) {
    try {
      await fs.access(path.join(config.configDir, PROMPTS_FILE))
    } catch {
      return {}
    }

    throw error
  }
}

export async function savePrompts(config: Config, prompts: Prompts): Promise<void> {
  await manager(config).saveProfiles(prompts)
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
