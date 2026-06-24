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
* [Running skills and slash commands directly](#running-skills-and-slash-commands-directly)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @hesed/claude
$ claude COMMAND
running command...
$ claude (--version)
@hesed/claude/0.2.0 linux-x64 node-v22.22.3
$ claude --help [COMMAND]
USAGE
  $ claude COMMAND
...
```
<!-- usagestop -->

# Running skills and slash commands directly

Any skill or slash command the agent can see (enumerate them with `claude list`) can be invoked as if it were a built-in CLI command — no `run` needed:

```sh-session
$ claude claude review "check this branch"     # same as: claude claude run review "check this branch"
$ claude claude /help                          # same as: claude claude run /help
$ claude claude review "this repo" -w proj01   # flags are forwarded to run
```

Built-in commands and topics (`ask`, `run`, `list`, `auth`, `workspace`) always take precedence; only unknown names are dispatched to `run`. Quote multi-word input — unquoted words after the name are re-joined before being passed to the agent.

# Running POML prompts as DSPy programs

`claude poml` reads a [POML](https://github.com/microsoft/poml) file, converts it into a DSPy-style program using [Ax](https://github.com/ax-llm/ax), and executes it in memory (nothing is written to disk).

The supported POML subset maps onto DSPy concepts:

| POML | DSPy / Ax |
| --- | --- |
| `<role>` / `<task>` / `<hint>` / `<output-format>` | signature description (the instructions) |
| `<input name=.. type=.. description=..>` | typed input field |
| `<output name=.. type=.. description=..>` | typed output field (`type="class"` uses the description as the allowed options) |
| `<example>` with `<input>`/`<output>` children | few-shot demonstration |
| `<let name=.. value=..>` + `{{ var }}` | template variables |
| root `module="chain-of-thought"` / `reasoning="true"` / `<reasoning/>` | prepends a `reasoning` output field |

```sh-session
# Preview the compiled signature without calling a model
$ claude claude poml examples/sentiment.poml "Absolutely love it!" --dry-run

# Execute in memory (single input field maps from the positional argument)
$ claude claude poml examples/sentiment.poml "Absolutely love it!"

# Multiple input fields: pass values as JSON, and template vars with --var
$ claude claude poml classify.poml --input '{"review":"..."}' --var domain=books
```

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
* [`claude claude list agents`](#claude-claude-list-agents)
* [`claude claude list commands`](#claude-claude-list-commands)
* [`claude claude list mcp-servers`](#claude-claude-list-mcp-servers)
* [`claude claude list skills`](#claude-claude-list-skills)
* [`claude claude list tools`](#claude-claude-list-tools)
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
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
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

_See code: [src/commands/claude/ask.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/ask.ts)_

## `claude claude auth add`

Add Claude Agent SDK authentication

```
USAGE
  $ claude claude auth add -p <value> -k <value> -u <value> --opus <value> --sonnet <value> --haiku <value> [--json]

FLAGS
  -k, --apiKey=<value>   (required) Anthropic API key
  -p, --profile=<value>  (required) Profile name
  -u, --apiUrl=<value>   (required) Anthropic API base URL (blank for default)
      --haiku=<value>    (required) Haiku model ID override
      --opus=<value>     (required) Opus model ID override
      --sonnet=<value>   (required) Sonnet model ID override

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add Claude Agent SDK authentication

EXAMPLES
  $ claude claude auth add

  $ claude claude auth add -p prod
```

_See code: [src/commands/claude/auth/add.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/auth/add.ts)_

## `claude claude auth delete`

Delete an authentication profile

```
USAGE
  $ claude claude auth delete [--json] [-p <value>]

FLAGS
  -p, --profile=<value>  Profile to delete

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete an authentication profile

EXAMPLES
  $ claude claude auth delete

  $ claude claude auth delete -p prod
```

_See code: [src/commands/claude/auth/delete.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/auth/delete.ts)_

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

_See code: [src/commands/claude/auth/list.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/auth/list.ts)_

## `claude claude auth profile`

Set or show the default authentication profile

```
USAGE
  $ claude claude auth profile [--json] [--default <value>]

FLAGS
  --default=<value>  Profile to set as default

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set or show the default authentication profile

EXAMPLES
  $ claude claude auth profile

  $ claude claude auth profile --default test
```

_See code: [src/commands/claude/auth/profile.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/auth/profile.ts)_

## `claude claude auth test`

Test authentication and connection

```
USAGE
  $ claude claude auth test [--json] [-p <value>]

FLAGS
  -p, --profile=<value>  Authentication profile name

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Test authentication and connection

EXAMPLES
  $ claude claude auth test

  $ claude claude auth test -p prod
```

_See code: [src/commands/claude/auth/test.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/auth/test.ts)_

## `claude claude auth update`

Update Claude Agent SDK authentication

```
USAGE
  $ claude claude auth update -p <value> -k <value> -u <value> --opus <value> --sonnet <value> --haiku <value> [--json]

FLAGS
  -k, --apiKey=<value>   (required) Anthropic API key
  -p, --profile=<value>  (required) Profile name
  -u, --apiUrl=<value>   (required) Anthropic API base URL (blank for default)
      --haiku=<value>    (required) Haiku model ID override
      --opus=<value>     (required) Opus model ID override
      --sonnet=<value>   (required) Sonnet model ID override

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Update Claude Agent SDK authentication

EXAMPLES
  $ claude claude auth update

  $ claude claude auth update -p test
```

_See code: [src/commands/claude/auth/update.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/auth/update.ts)_

## `claude claude list`

List skills, slash commands, tools, subagents, and MCP servers the agent can use

```
USAGE
  $ claude claude list [-p <value>] [--toon] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)
      --toon               Format output as toon

DESCRIPTION
  List skills, slash commands, tools, subagents, and MCP servers the agent can use

EXAMPLES
  $ claude claude list

  $ claude claude list --toon

  $ claude claude list --workspace proj01
```

_See code: [src/commands/claude/list/index.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/list/index.ts)_

## `claude claude list agents`

List subagents the agent can use

```
USAGE
  $ claude claude list agents [-p <value>] [--toon] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)
      --toon               Format output as toon

DESCRIPTION
  List subagents the agent can use

EXAMPLES
  $ claude claude list agents

  $ claude claude list agents --toon
```

_See code: [src/commands/claude/list/agents.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/list/agents.ts)_

## `claude claude list commands`

List slash commands the agent can use

```
USAGE
  $ claude claude list commands [-p <value>] [--toon] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)
      --toon               Format output as toon

DESCRIPTION
  List slash commands the agent can use

EXAMPLES
  $ claude claude list commands

  $ claude claude list commands --toon
```

_See code: [src/commands/claude/list/commands.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/list/commands.ts)_

## `claude claude list mcp-servers`

List MCP servers the agent can use

```
USAGE
  $ claude claude list mcp-servers [-p <value>] [--toon] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)
      --toon               Format output as toon

DESCRIPTION
  List MCP servers the agent can use

EXAMPLES
  $ claude claude list mcp-servers

  $ claude claude list mcp-servers --toon
```

_See code: [src/commands/claude/list/mcp-servers.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/list/mcp-servers.ts)_

## `claude claude list skills`

List skills the agent can use

```
USAGE
  $ claude claude list skills [-p <value>] [--toon] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)
      --toon               Format output as toon

DESCRIPTION
  List skills the agent can use

EXAMPLES
  $ claude claude list skills

  $ claude claude list skills --toon
```

_See code: [src/commands/claude/list/skills.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/list/skills.ts)_

## `claude claude list tools`

List tools the agent can use

```
USAGE
  $ claude claude list tools [-p <value>] [--toon] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)
      --toon               Format output as toon

DESCRIPTION
  List tools the agent can use

EXAMPLES
  $ claude claude list tools

  $ claude claude list tools --toon
```

_See code: [src/commands/claude/list/tools.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/list/tools.ts)_

## `claude claude run NAME [INPUT]`

Execute a slash command or skill by name

```
USAGE
  $ claude claude run NAME [INPUT] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [--toon] [-w <value>]

ARGUMENTS
  NAME     Slash command (e.g. /help) or skill name
  [INPUT]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent
      --toon                 Format output as toon

DESCRIPTION
  Execute a slash command or skill by name

EXAMPLES
  $ claude claude run /help

  $ claude claude run review "this branch"

  $ claude claude run /clear --stream

  $ claude claude run review "this repo" --workspace proj01
```

_See code: [src/commands/claude/run.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/run.ts)_

## `claude claude workspace add`

Add a workspace with named repository directories

```
USAGE
  $ claude claude workspace add --mode local|sandbox --repo <value>... -w <value> [--json]

FLAGS
  -w, --workspace=<value>  (required) Workspace name
      --mode=<option>      (required) 'local' uses real repo dirs; 'sandbox' clones git URLs into a virtual bash
                           <options: local|sandbox>
      --repo=<value>...    (required) Named repo entry as name=path or name=git-url (repeatable)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add a workspace with named repository directories

EXAMPLES
  $ claude claude workspace add --workspace proj01 --repo repo01=/path/to/repo01 --repo repo02=/path/to/repo02

  $ claude claude workspace add --workspace proj02 --mode sandbox --repo repo01=https://github.com/org/repo01.git
```

_See code: [src/commands/claude/workspace/add.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/workspace/add.ts)_

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

_See code: [src/commands/claude/workspace/default.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/workspace/default.ts)_

## `claude claude workspace delete`

Delete a workspace or remove a repo from a workspace

```
USAGE
  $ claude claude workspace delete -w <value> [--json]

FLAGS
  -w, --workspace=<value>  (required) Workspace name

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Delete a workspace or remove a repo from a workspace

EXAMPLES
  $ claude claude workspace delete --workspace proj01
```

_See code: [src/commands/claude/workspace/delete.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/workspace/delete.ts)_

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

_See code: [src/commands/claude/workspace/list.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/workspace/list.ts)_

## `claude claude workspace update`

Update repositories in an existing workspace

```
USAGE
  $ claude claude workspace update [--json] [--mode local|sandbox] [--remove-repo <value>...] [--repo <value>...] [-w
  <value>]

FLAGS
  -w, --workspace=<value>       Workspace name
      --mode=<option>           'local' uses real repo dirs; 'sandbox' clones git URLs into a virtual bash
                                <options: local|sandbox>
      --remove-repo=<value>...  Repo name to remove from the workspace (repeatable)
      --repo=<value>...         Named repo entry as name=path to add/update (repeatable)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Update repositories in an existing workspace

EXAMPLES
  $ claude claude workspace update --workspace proj01 --repo repo01=/new/path --repo repo03=/path/to/repo03

  $ claude claude workspace update --workspace proj01 --remove-repo repo02

  $ claude claude workspace update --workspace proj01 --mode sandbox
```

_See code: [src/commands/claude/workspace/update.ts](https://github.com/hesedcasa/claude/blob/v0.2.0/src/commands/claude/workspace/update.ts)_
<!-- commandsstop -->
