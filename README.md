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
@hesed/claude/0.3.0 linux-x64 node-v22.23.0
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
* [`claude claude prompt add NAME BODY`](#claude-claude-prompt-add-name-body)
* [`claude claude prompt delete NAME`](#claude-claude-prompt-delete-name)
* [`claude claude prompt edit NAME [BODY]`](#claude-claude-prompt-edit-name-body)
* [`claude claude prompt list`](#claude-claude-prompt-list)
* [`claude claude prompt rm NAME`](#claude-claude-prompt-rm-name)
* [`claude claude prompt run NAME`](#claude-claude-prompt-run-name)
* [`claude claude prompt show NAME`](#claude-claude-prompt-show-name)
* [`claude claude run NAME [INPUT]`](#claude-claude-run-name-input)
* [`claude claude workflow list`](#claude-claude-workflow-list)
* [`claude claude workflow run NAME [INPUT]`](#claude-claude-workflow-run-name-input)
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

_See code: [src/commands/claude/ask.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/ask.ts)_

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

_See code: [src/commands/claude/auth/add.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/add.ts)_

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

_See code: [src/commands/claude/auth/delete.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/delete.ts)_

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

_See code: [src/commands/claude/auth/list.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/list.ts)_

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

_See code: [src/commands/claude/auth/profile.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/profile.ts)_

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

_See code: [src/commands/claude/auth/test.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/test.ts)_

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

_See code: [src/commands/claude/auth/update.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/update.ts)_

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

_See code: [src/commands/claude/list/index.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/index.ts)_

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

_See code: [src/commands/claude/list/agents.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/agents.ts)_

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

_See code: [src/commands/claude/list/commands.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/commands.ts)_

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

_See code: [src/commands/claude/list/mcp-servers.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/mcp-servers.ts)_

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

_See code: [src/commands/claude/list/skills.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/skills.ts)_

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

_See code: [src/commands/claude/list/tools.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/tools.ts)_

## `claude claude prompt add NAME BODY`

Create or overwrite a saved prompt

```
USAGE
  $ claude claude prompt add NAME BODY [-d <value>] [-s <value>]

ARGUMENTS
  NAME  Prompt name
  BODY  Prompt text to save

FLAGS
  -d, --description=<value>  Short prompt description
  -s, --system=<value>       System prompt applied when the prompt runs

DESCRIPTION
  Create or overwrite a saved prompt

EXAMPLES
  $ claude claude prompt add summarize "Inspect the project and summarize the architecture"

  $ claude claude prompt add review "Review the changes on this branch" --description "Branch review"

  $ claude claude prompt add reviewer "Review this PR" --system "You are a meticulous senior reviewer"
```

_See code: [src/commands/claude/prompt/add.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/add.ts)_

## `claude claude prompt delete NAME`

Delete a saved prompt

```
USAGE
  $ claude claude prompt delete NAME

ARGUMENTS
  NAME  Prompt name

DESCRIPTION
  Delete a saved prompt

ALIASES
  $ claude claude prompt rm

EXAMPLES
  $ claude claude prompt delete summarize
```

_See code: [src/commands/claude/prompt/delete.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/delete.ts)_

## `claude claude prompt edit NAME [BODY]`

Edit a saved prompt

```
USAGE
  $ claude claude prompt edit NAME [BODY] [-d <value>] [-s <value>]

ARGUMENTS
  NAME    Prompt name
  [BODY]  Replacement prompt text

FLAGS
  -d, --description=<value>  Replacement prompt description
  -s, --system=<value>       Replacement system prompt

DESCRIPTION
  Edit a saved prompt

EXAMPLES
  $ claude claude prompt edit summarize "A new prompt body"

  $ claude claude prompt edit summarize --description "Updated description"

  $ claude claude prompt edit summarize --system "A new system prompt"
```

_See code: [src/commands/claude/prompt/edit.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/edit.ts)_

## `claude claude prompt list`

List saved prompts

```
USAGE
  $ claude claude prompt list [--toon]

FLAGS
  --toon  Format output as toon

DESCRIPTION
  List saved prompts

EXAMPLES
  $ claude claude prompt list

  $ claude claude prompt list --toon
```

_See code: [src/commands/claude/prompt/list.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/list.ts)_

## `claude claude prompt rm NAME`

Delete a saved prompt

```
USAGE
  $ claude claude prompt rm NAME

ARGUMENTS
  NAME  Prompt name

DESCRIPTION
  Delete a saved prompt

ALIASES
  $ claude claude prompt rm

EXAMPLES
  $ claude claude prompt rm summarize
```

## `claude claude prompt run NAME`

Execute a saved prompt through the Claude agent

```
USAGE
  $ claude claude prompt run NAME [--allow-tools <value>] [-a <value>...] [--dry-run] [-m <value>] [-p <value>] [--repo
    <value>] [--stream] [--system <value>] [--toon] [-w <value>]

ARGUMENTS
  NAME  Prompt name

FLAGS
  -a, --arg=<value>...       Template argument as name=value, substituting {{name}} in the prompt (repeatable)
  -m, --model=<value>        Model to use (e.g. claude-opus-4-7)
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --dry-run              Print the resolved prompt and context without calling the agent
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Override the prompt's saved system prompt
      --toon                 Format output as toon

DESCRIPTION
  Execute a saved prompt through the Claude agent

EXAMPLES
  $ claude claude prompt run summarize

  $ claude claude prompt run classify --arg summary="Login fails" --arg description="TODO: fix client request"

  $ claude claude prompt run summarize --profile work --workspace proj01

  $ claude claude prompt run review --workspace proj01 --repo repo01

  $ claude claude prompt run summarize --system "Override the saved system prompt"

  $ claude claude prompt run classify --arg summary="..." --dry-run
```

_See code: [src/commands/claude/prompt/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/run.ts)_

## `claude claude prompt show NAME`

View a saved prompt

```
USAGE
  $ claude claude prompt show NAME [--toon]

ARGUMENTS
  NAME  Prompt name

FLAGS
  --toon  Format output as toon

DESCRIPTION
  View a saved prompt

EXAMPLES
  $ claude claude prompt show summarize

  $ claude claude prompt show summarize --toon
```

_See code: [src/commands/claude/prompt/show.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/show.ts)_

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

_See code: [src/commands/claude/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/run.ts)_

## `claude claude workflow list`

List saved workflows

```
USAGE
  $ claude claude workflow list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List saved workflows

EXAMPLES
  $ claude claude workflow list
```

_See code: [src/commands/claude/workflow/list.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workflow/list.ts)_

## `claude claude workflow run NAME [INPUT]`

Run a saved workflow by name

```
USAGE
  $ claude claude workflow run NAME [INPUT] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [--toon] [-w <value>]

ARGUMENTS
  NAME     Workflow name
  [INPUT]  Additional input to append to the workflow prompt

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Override the workflow workspace (uses workflow setting if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent
      --toon                 Format output as toon

DESCRIPTION
  Run a saved workflow by name

EXAMPLES
  $ claude claude workflow run daily-review

  $ claude claude workflow run daily-review "focus on auth module"

  $ claude claude workflow run daily-review --stream
```

_See code: [src/commands/claude/workflow/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workflow/run.ts)_

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

_See code: [src/commands/claude/workspace/add.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workspace/add.ts)_

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

_See code: [src/commands/claude/workspace/default.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workspace/default.ts)_

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

_See code: [src/commands/claude/workspace/delete.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workspace/delete.ts)_

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

_See code: [src/commands/claude/workspace/list.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workspace/list.ts)_

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

_See code: [src/commands/claude/workspace/update.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workspace/update.ts)_
<!-- commandsstop -->
