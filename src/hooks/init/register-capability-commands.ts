import type {Hook} from '@oclif/core'

import {registerCapabilityCommands} from '../../capability-commands.js'

/**
 * Reads the capabilities cache (written by `claude list`) at startup and
 * registers every known skill and slash command as a first-class oclif
 * command. This makes them visible in `claude help` and invocable directly
 * as `claude <name> [input]`, exactly like a built-in command. Names not in
 * the cache still work through the `command_not_found` hook fallback.
 */
const hook: Hook<'init'> = async function (opts) {
  try {
    await registerCapabilityCommands(opts.config)
  } catch {
    // Non-fatal: if the cache is unreadable we just don't register the commands.
  }
}

export default hook
