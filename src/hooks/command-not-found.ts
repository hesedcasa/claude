import {Errors, type Hook} from '@oclif/core'

const TOPIC = 'claude'
const RUN_COMMAND = `${TOPIC}:run`

/**
 * Expose agent skills and slash commands as first-class CLI commands.
 *
 * When oclif cannot resolve a command under the `claude` topic (e.g.
 * `claude review "fix this"` or `claude /help`), forward the unknown
 * name plus any remaining input to `claude run`, which executes it as
 * a skill or slash command. IDs outside the topic — or typos inside
 * existing sub-topics such as `auth`, `list`, `workspace` — still fail
 * with the normal "command not found" error.
 *
 * With a space topic separator oclif collates leading positionals into
 * the id (`claude review fix` arrives as id `claude:review:fix`), so any
 * segments past the name are re-joined with `:` to restore a single
 * quoted input argument unchanged.
 */
const hook: Hook<'command_not_found'> = async function (opts) {
  const parts = opts.id.split(':')
  const [topic, name] = parts
  const notFound = () => new Errors.CLIError(`command ${parts.join(' ')} not found`)

  if (topic !== TOPIC || !name || name.startsWith('-')) throw notFound()
  if (opts.config.findTopic(`${TOPIC}:${name}`)) throw notFound()

  const input = parts.slice(2).join(':')
  const argv = input ? [name, input, ...(opts.argv ?? [])] : [name, ...(opts.argv ?? [])]

  this.warn(`"${name}" is not a built-in command — running it as a skill/slash command via "${TOPIC} run"`)
  return opts.config.runCommand(RUN_COMMAND, argv)
}

export default hook
