import {Args, Command, Flags} from '@oclif/core'

import {addAcpAgent} from '../../../acp/acp-config.js'

/* eslint-disable perfectionist/sort-objects */
export default class AcpAdd extends Command {
  static override args = {
    // Positional: `claude acp add <name> <command>`.
    name: Args.string({description: 'Name to register the peer agent under', required: true}),
    command: Args.string({description: 'Executable that speaks ACP over stdio', required: true}),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'Register a peer ACP agent this CLI can talk to'
  static override examples = [
    '<%= config.bin %> <%= command.id %> gemini gemini --arg --experimental-acp',
    '<%= config.bin %> <%= command.id %> claude-peer claude --arg acp --arg serve',
    '<%= config.bin %> <%= command.id %> local ./my-agent --cwd ~/code/project --env DEBUG=1',
  ]
  static override flags = {
    arg: Flags.string({
      description: 'Argument passed to the peer agent command (repeatable, order preserved)',
      multiple: true,
      required: false,
    }),
    cwd: Flags.string({description: 'Working directory to start the peer agent in', required: false}),
    env: Flags.string({
      description: 'Environment variable for the peer agent as KEY=value (repeatable)',
      multiple: true,
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AcpAdd)

    const env: Record<string, string> = {}
    for (const entry of flags.env ?? []) {
      const sep = entry.indexOf('=')
      if (sep === -1) {
        this.error(`Invalid env format '${entry}'. Expected KEY=value.`)
      }

      env[entry.slice(0, sep)] = entry.slice(sep + 1)
    }

    await addAcpAgent(
      this.config.configDir,
      args.name,
      {
        ...(flags.arg && flags.arg.length > 0 && {args: flags.arg}),
        command: args.command,
        ...(flags.cwd && {cwd: flags.cwd}),
        ...(Object.keys(env).length > 0 && {env}),
      },
      this.log.bind(this),
    )
  }
}
