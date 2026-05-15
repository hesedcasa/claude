# claude

CLI for running Claude agents, skills, and slash commands via the Anthropic Agent SDK

[![Version](https://img.shields.io/npm/v/@hesed/claude.svg)](https://npmjs.org/package/@hesed/claude)
[![Downloads/week](https://img.shields.io/npm/dw/@hesed/claude.svg)](https://npmjs.org/package/@hesed/claude)

# Install

```bash
sdkck plugins install @hesed/claude
```

<!-- toc -->
* [claude](#claude)
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @hesed/claude
$ claude COMMAND
running command...
$ claude (--version)
@hesed/claude/0.1.0 linux-x64 node-v20.20.2
$ claude --help [COMMAND]
USAGE
  $ claude COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`claude claude ask PROMPT`](#claude-claude-ask-prompt)
* [`claude claude auth add`](#claude-claude-auth-add)
* [`claude claude auth delete`](#claude-claude-auth-delete)
* [`claude claude auth list`](#claude-claude-auth-list)
* [`claude claude auth profile`](#claude-claude-auth-profile)
* [`claude claude auth test`](#claude-claude-auth-test)
* [`claude claude auth update`](#claude-claude-auth-update)
* [`claude claude list`](#claude-claude-list)
* [`claude claude run NAME [INPUT]`](#claude-claude-run-name-input)
* [`claude claude workspace add`](#claude-claude-workspace-add)
* [`claude claude workspace default`](#claude-claude-workspace-default)
* [`claude claude workspace delete`](#claude-claude-workspace-delete)
* [`claude claude workspace list`](#claude-claude-workspace-list)
* [`claude claude workspace update`](#claude-claude-workspace-update)

## `claude claude ask PROMPT`

Ask the Claude agent a natural-language question

```
USAGE
  $ claude claude ask PROMPT [--allow-tools <value>] [-m <value>] [-p <value>] [--repo <value>] [--stream]
    [--system <value>] [--toon] [-w <value>]

ARGUMENTS
  PROMPT  Natural-language prompt to send to the agent

FLAGS
  -m, --model=<value>        Model to use (e.g. claude-opus-4-7)
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses default workspace if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent
      --toon                 Format output as toon

DESCRIPTION
  Ask the Claude agent a natural-language question

EXAMPLES
  $ claude claude ask "What is the capital of France?"

  $ claude claude ask "List files in src" --allow-tools Read,Glob

  $ claude claude ask "Summarise changes" --workspace proj01

  $ claude claude ask "Review changes" --workspace proj01 --repo repo01
```

_See code: [src/commands/claude/ask.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/ask.ts)_

## `claude claude auth add`

Add Claude Agent SDK authentication

```
USAGE
  $ claude claude auth add -p <value> -k <value> -u <value> [--json] [--opus <value>] [--sonnet <value>] [--haiku
    <value>]

FLAGS
  -k, --key=<value>      (required) Anthropic API key
  -p, --profile=<value>  (required) Profile name:
  -u, --url=<value>      (required) Anthropic API base URL (blank for default)
      --haiku=<value>    Haiku model ID mapping (blank for default)
      --opus=<value>     Opus model ID mapping (blank for default)
      --sonnet=<value>   Sonnet model ID mapping (blank for default)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add Claude Agent SDK authentication

EXAMPLES
  $ claude claude auth add

  $ claude claude auth add --profile work
```

_See code: [src/commands/claude/auth/add.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/auth/add.ts)_

## `claude claude auth delete`

Delete an authentication profile

```
USAGE
  $ claude claude auth delete -p <value> [--json]

FLAGS
  -p, --profile=<value>  (required) Profile name to delete

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an authentication profile

EXAMPLES
  $ claude claude auth delete --profile work

  $ claude claude auth delete --profile default
```

_See code: [src/commands/claude/auth/delete.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/auth/delete.ts)_

## `claude claude auth list`

List authentication profiles

```
USAGE
  $ claude claude auth list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List authentication profiles

EXAMPLES
  $ claude claude auth list
```

_See code: [src/commands/claude/auth/list.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/auth/list.ts)_

## `claude claude auth profile`

Set or show the default authentication profile

```
USAGE
  $ claude claude auth profile [--json] [--default <value>]

FLAGS
  --default=<value>  Profile name to set as default

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set or show the default authentication profile

EXAMPLES
  $ claude claude auth profile

  $ claude claude auth profile --default work
```

_See code: [src/commands/claude/auth/profile.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/auth/profile.ts)_

## `claude claude auth test`

Test Claude Agent SDK authentication and connection

```
USAGE
  $ claude claude auth test [--json] [-p <value>]

FLAGS
  -p, --profile=<value>  Authentication profile name

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Test Claude Agent SDK authentication and connection

EXAMPLES
  $ claude claude auth test

  $ claude claude auth test --profile work
```

_See code: [src/commands/claude/auth/test.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/auth/test.ts)_

## `claude claude auth update`

Update existing Claude Agent SDK authentication

```
USAGE
  $ claude claude auth update -k <value> [--json] [-p <value>] [-u <value>] [--opus <value>] [--sonnet <value>] [--haiku
    <value>]

FLAGS
  -k, --key=<value>      (required) Anthropic API key
  -p, --profile=<value>  Profile name to update (default: "default")
  -u, --url=<value>      Anthropic API base URL
      --haiku=<value>    Haiku model ID mapping (blank to clear)
      --opus=<value>     Opus model ID mapping (blank to clear)
      --sonnet=<value>   Sonnet model ID mapping (blank to clear)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Update existing Claude Agent SDK authentication

EXAMPLES
  $ claude claude auth update

  $ claude claude auth update --profile work
```

_See code: [src/commands/claude/auth/update.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/auth/update.ts)_

## `claude claude list`

List skills, slash commands, tools, subagents, and MCP servers the agent can use

```
USAGE
  $ claude claude list [--only <value>] [-p <value>] [--toon]

FLAGS
  -p, --profile=<value>  Authentication profile name
      --only=<value>     Comma-separated subset to return (skills|commands|tools|agents|mcpServers)
      --toon             Format output as toon

DESCRIPTION
  List skills, slash commands, tools, subagents, and MCP servers the agent can use

EXAMPLES
  $ claude claude list

  $ claude claude list --only skills

  $ claude claude list --only skills,commands --toon
```

_See code: [src/commands/claude/list.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/list.ts)_

## `claude claude run NAME [INPUT]`

Execute a slash command or skill by name

```
USAGE
  $ claude claude run NAME [INPUT] [--allow-tools <value>] [-p <value>] [--stream] [--system <value>] [--toon]

ARGUMENTS
  NAME     Slash command (e.g. /help) or skill name
  [INPUT]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent
      --toon                 Format output as toon

DESCRIPTION
  Execute a slash command or skill by name

EXAMPLES
  $ claude claude run /help

  $ claude claude run review "this branch"

  $ claude claude run /clear --stream
```

_See code: [src/commands/claude/run.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/run.ts)_

## `claude claude workspace add`

Add a workspace with named repository directories

```
USAGE
  $ claude claude workspace add --repo <value>... -w <value> [--json]

FLAGS
  -w, --workspace=<value>  (required) Workspace name
      --repo=<value>...    (required) Named repo entry as name=path (repeatable)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add a workspace with named repository directories

EXAMPLES
  $ claude claude workspace add --workspace proj01 --repo repo01=/path/to/repo01 --repo repo02=/path/to/repo02
```

_See code: [src/commands/claude/workspace/add.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/workspace/add.ts)_

## `claude claude workspace default`

Set or show the default workspace

```
USAGE
  $ claude claude workspace default [--json] [--set <value>]

FLAGS
  --set=<value>  Workspace name to set as default

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set or show the default workspace

EXAMPLES
  $ claude claude workspace default

  $ claude claude workspace default --set proj01
```

_See code: [src/commands/claude/workspace/default.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/workspace/default.ts)_

## `claude claude workspace delete`

Delete a workspace or remove a repo from a workspace

```
USAGE
  $ claude claude workspace delete [--json] [--repo <value>] [-w <value>]

FLAGS
  -w, --workspace=<value>  Workspace name
      --repo=<value>       Repo name to remove from the workspace

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a workspace or remove a repo from a workspace

EXAMPLES
  $ claude claude workspace delete --workspace proj01

  $ claude claude workspace delete --workspace proj01 --repo repo01

  $ claude claude workspace delete --repo repo01
```

_See code: [src/commands/claude/workspace/delete.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/workspace/delete.ts)_

## `claude claude workspace list`

List workspaces

```
USAGE
  $ claude claude workspace list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List workspaces

EXAMPLES
  $ claude claude workspace list
```

_See code: [src/commands/claude/workspace/list.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/workspace/list.ts)_

## `claude claude workspace update`

Update repositories in an existing workspace

```
USAGE
  $ claude claude workspace update [--json] [--remove-repo <value>...] [--repo <value>...] [-w <value>]

FLAGS
  -w, --workspace=<value>       Workspace name (default: default workspace)
      --remove-repo=<value>...  Repo name to remove from the workspace (repeatable)
      --repo=<value>...         Named repo entry as name=path to add/update (repeatable, merges into existing)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Update repositories in an existing workspace

EXAMPLES
  $ claude claude workspace update --workspace proj01 --repo repo01=/new/path --repo repo03=/path/to/repo03

  $ claude claude workspace update --workspace proj01 --remove-repo repo02
```

_See code: [src/commands/claude/workspace/update.ts](https://github.com/hesedcasa/claude/blob/v0.1.0/src/commands/claude/workspace/update.ts)_
<!-- commandsstop -->
