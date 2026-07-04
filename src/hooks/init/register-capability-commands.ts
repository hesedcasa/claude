import type {Hook} from '@oclif/core'

import {registerCapabilityCommands} from '../../capability-commands.js'

/**
 * Reads the capabilities cache (written by `claude list`) at startup and
 * registers every known skill and slash command as a first-class oclif
 * command under its topic. This makes them visible in `claude help` and
 * invocable as `claude command <name> [input]` (slash commands) or
 * `claude skill <name> [input]` (skills), exactly like built-in commands.
 */
const hook: Hook<'init'> = async function (opts) {
  try {
    await registerCapabilityCommands(opts.config)
  } catch {
    // Non-fatal: if the cache is unreadable we just don't register the commands.
  }
}

export default hook
