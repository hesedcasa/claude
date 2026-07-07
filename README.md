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
@hesed/claude/0.4.0 linux-x64 node-v22.23.1
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
* [`claude claude [PROMPT]`](#claude-claude-prompt)
* [`claude claude ask PROMPT`](#claude-claude-ask-prompt)
* [`claude claude auth add`](#claude-claude-auth-add)
* [`claude claude auth delete`](#claude-claude-auth-delete)
* [`claude claude auth list`](#claude-claude-auth-list)
* [`claude claude auth profile`](#claude-claude-auth-profile)
* [`claude claude auth test`](#claude-claude-auth-test)
* [`claude claude auth update`](#claude-claude-auth-update)
* [`claude claude command`](#claude-claude-command)
* [`claude claude command run NAME [INPUT]`](#claude-claude-command-run-name-input)
* [`claude claude list`](#claude-claude-list)
* [`claude claude list agents`](#claude-claude-list-agents)
* [`claude claude list mcp-servers`](#claude-claude-list-mcp-servers)
* [`claude claude list tools`](#claude-claude-list-tools)
* [`claude claude prompt`](#claude-claude-prompt)
* [`claude claude prompt add NAME BODY`](#claude-claude-prompt-add-name-body)
* [`claude claude prompt delete NAME`](#claude-claude-prompt-delete-name)
* [`claude claude prompt edit NAME [BODY]`](#claude-claude-prompt-edit-name-body)
* [`claude claude prompt rm NAME`](#claude-claude-prompt-rm-name)
* [`claude claude prompt run NAME`](#claude-claude-prompt-run-name)
* [`claude claude prompt show NAME`](#claude-claude-prompt-show-name)
* [`claude claude run NAME [INPUT]`](#claude-claude-run-name-input)
* [`claude claude session`](#claude-claude-session)
* [`claude claude session delete SESSIONID`](#claude-claude-session-delete-sessionid)
* [`claude claude session fork SESSIONID`](#claude-claude-session-fork-sessionid)
* [`claude claude session rename SESSIONID TITLE`](#claude-claude-session-rename-sessionid-title)
* [`claude claude session resume SESSIONID PROMPT`](#claude-claude-session-resume-sessionid-prompt)
* [`claude claude session show SESSIONID`](#claude-claude-session-show-sessionid)
* [`claude claude session tag SESSIONID [TAG]`](#claude-claude-session-tag-sessionid-tag)
* [`claude claude skill`](#claude-claude-skill)
* [`claude claude skill run NAME [INPUT]`](#claude-claude-skill-run-name-input)
* [`claude claude workspace add`](#claude-claude-workspace-add)
* [`claude claude workspace default`](#claude-claude-workspace-default)
* [`claude claude workspace delete`](#claude-claude-workspace-delete)
* [`claude claude workspace list`](#claude-claude-workspace-list)
* [`claude claude workspace update`](#claude-claude-workspace-update)

## `claude claude [PROMPT]`

Chat with the Claude agent in a persistent interactive session (streaming input mode)

```
USAGE
  $ claude claude [PROMPT] [--allow-tools <value>] [--continue | --resume <value>] [--fork-session] [-m
    <value>] [-p <value>] [--repo <value>] [--system <value>] [-w <value>]

ARGUMENTS
  [PROMPT]  Optional first message to send

FLAGS
  -m, --model=<value>        Model to use (e.g. claude-opus-4-7)
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --continue             Continue the most recent session in the current directory
      --fork-session         With --resume/--continue, fork into a new session instead of appending
      --repo=<value>         Filter workspace context to this repo name
      --resume=<value>       Session ID to resume
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Chat with the Claude agent in a persistent interactive session (streaming input mode)

EXAMPLES
  $ claude claude

  $ claude claude "Analyze this codebase for security issues"

  $ claude claude --workspace proj01 --repo repo01

  $ claude claude --resume 4f8b6f2a-1234-4c56-8d90-abcdef012345

  echo "Explain the auth flow" | claude claude
```

_See code: [src/commands/claude/index.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/index.ts)_

## `claude claude ask PROMPT`

Ask the Claude agent a natural-language question

```
USAGE
  $ claude claude ask PROMPT [--allow-tools <value>] [--continue | --resume <value>] [--fork-session] [-m
    <value>] [-p <value>] [--repo <value>] [--stream] [--system <value>] [-w <value>]

ARGUMENTS
  PROMPT  Natural-language prompt to send to the agent

FLAGS
  -m, --model=<value>        Model to use (e.g. claude-opus-4-7)
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --continue             Continue the most recent session in the current directory
      --fork-session         With --resume/--continue, fork into a new session instead of appending
      --repo=<value>         Filter workspace context to this repo name
      --resume=<value>       Session ID to resume
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Ask the Claude agent a natural-language question

EXAMPLES
  $ claude claude ask "What is the capital of France?"

  $ claude claude ask "List files in src" --allow-tools Read,Glob

  $ claude claude ask "Summarise changes" --workspace proj01

  $ claude claude ask "Review changes" --workspace proj01 --repo repo01

  $ claude claude ask "Now refactor it" --continue

  $ claude claude ask "Try another approach" --resume 4f8b6f2a-1234-4c56-8d90-abcdef012345 --fork-session
```

_See code: [src/commands/claude/ask.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/ask.ts)_

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

_See code: [src/commands/claude/auth/add.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/auth/add.ts)_

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

_See code: [src/commands/claude/auth/delete.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/auth/delete.ts)_

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

_See code: [src/commands/claude/auth/list.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/auth/list.ts)_

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

_See code: [src/commands/claude/auth/profile.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/auth/profile.ts)_

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

_See code: [src/commands/claude/auth/test.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/auth/test.ts)_

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

_See code: [src/commands/claude/auth/update.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/auth/update.ts)_

## `claude claude command`

Execute a slash command by name

```
USAGE
  $ claude claude command

DESCRIPTION
  Execute a slash command by name

EXAMPLES
  $ claude claude command
```

_See code: [src/commands/claude/command/index.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/command/index.ts)_

## `claude claude command run NAME [INPUT]`

Execute a slash command by name

```
USAGE
  $ claude claude command run NAME [INPUT] [--json] [--allow-tools <value>] [-p <value>] [--repo <value>] [--system
    <value>] [-w <value>]

ARGUMENTS
  NAME     Slash command name (e.g. help)
  [INPUT]  Additional input to forward to the command

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --system=<value>       Custom system prompt for the agent

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute a slash command by name

EXAMPLES
  $ claude claude command run help

  $ claude claude command run review "this branch"

  $ claude claude command run commit --stream

  $ claude claude command run review "this repo" --workspace proj01
```

_See code: [src/commands/claude/command/run.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/command/run.ts)_

## `claude claude list`

List skills, slash commands, tools, subagents, and MCP servers the agent can use

```
USAGE
  $ claude claude list [--json] [-p <value>] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List skills, slash commands, tools, subagents, and MCP servers the agent can use

EXAMPLES
  $ claude claude list

  $ claude claude list --workspace proj01
```

_See code: [src/commands/claude/list/index.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/list/index.ts)_

## `claude claude list agents`

List subagents the agent can use

```
USAGE
  $ claude claude list agents [--json] [-p <value>] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List subagents the agent can use

EXAMPLES
  $ claude claude list agents
```

_See code: [src/commands/claude/list/agents.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/list/agents.ts)_

## `claude claude list mcp-servers`

List MCP servers the agent can use

```
USAGE
  $ claude claude list mcp-servers [--json] [-p <value>] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List MCP servers the agent can use

EXAMPLES
  $ claude claude list mcp-servers
```

_See code: [src/commands/claude/list/mcp-servers.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/list/mcp-servers.ts)_

## `claude claude list tools`

List tools the agent can use

```
USAGE
  $ claude claude list tools [--json] [-p <value>] [-w <value>]

FLAGS
  -p, --profile=<value>    Authentication profile name
  -w, --workspace=<value>  Workspace name (uses current directory if omitted)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List tools the agent can use

EXAMPLES
  $ claude claude list tools
```

_See code: [src/commands/claude/list/tools.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/list/tools.ts)_

## `claude claude prompt`

List saved prompts

```
USAGE
  $ claude claude prompt

DESCRIPTION
  List saved prompts

EXAMPLES
  $ claude claude prompt
```

_See code: [src/commands/claude/prompt/index.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/prompt/index.ts)_

## `claude claude prompt add NAME BODY`

Create a saved prompt

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
  Create a saved prompt

EXAMPLES
  $ claude claude prompt add summarize "Inspect the project and summarize the architecture"

  $ claude claude prompt add review "Review the changes on this branch" --description "Branch review"

  $ claude claude prompt add reviewer "Review this PR" --system "You are a meticulous senior reviewer"

  $ claude claude prompt add
```

_See code: [src/commands/claude/prompt/add.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/prompt/add.ts)_

## `claude claude prompt delete NAME`

Delete a saved prompt

```
USAGE
  $ claude claude prompt delete NAME [-f]

ARGUMENTS
  NAME  Prompt name

FLAGS
  -f, --force  Skip the confirmation prompt

DESCRIPTION
  Delete a saved prompt

ALIASES
  $ claude claude prompt rm

EXAMPLES
  $ claude claude prompt delete summarize

  $ claude claude prompt delete summarize --force
```

_See code: [src/commands/claude/prompt/delete.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/prompt/delete.ts)_

## `claude claude prompt edit NAME [BODY]`

Edit a saved prompt

```
USAGE
  $ claude claude prompt edit NAME [BODY] [-d <value>] [-f] [-s <value>]

ARGUMENTS
  NAME    Prompt name
  [BODY]  Replacement prompt text

FLAGS
  -d, --description=<value>  Replacement prompt description
  -f, --force                Skip the confirmation prompt
  -s, --system=<value>       Replacement system prompt

DESCRIPTION
  Edit a saved prompt

EXAMPLES
  $ claude claude prompt edit summarize "A new prompt body"

  $ claude claude prompt edit summarize --description "Updated description"

  $ claude claude prompt edit summarize --system "A new system prompt"

  $ claude claude prompt edit summarize
```

_See code: [src/commands/claude/prompt/edit.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/prompt/edit.ts)_

## `claude claude prompt rm NAME`

Delete a saved prompt

```
USAGE
  $ claude claude prompt rm NAME [-f]

ARGUMENTS
  NAME  Prompt name

FLAGS
  -f, --force  Skip the confirmation prompt

DESCRIPTION
  Delete a saved prompt

ALIASES
  $ claude claude prompt rm

EXAMPLES
  $ claude claude prompt rm summarize

  $ claude claude prompt rm summarize --force
```

## `claude claude prompt run NAME`

Execute a saved prompt through the Claude agent

```
USAGE
  $ claude claude prompt run NAME [--allow-tools <value>] [-a <value>...] [--debug] [--dry-run] [-m <value>] [-p
    <value>] [--repo <value>] [--system <value>] [-w <value>]

ARGUMENTS
  NAME  Prompt name

FLAGS
  -a, --arg=<value>...       Template argument as name=value, substituting {{name}} in the prompt (repeatable)
  -m, --model=<value>        Model to use (e.g. claude-opus-4-7)
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --debug                Include full agent metadata (model, tools, usage) in the output; default prints the result
                             only
      --dry-run              Print the resolved prompt and context without calling the agent
      --repo=<value>         Filter workspace context to this repo name
      --system=<value>       Override the prompt's saved system prompt

DESCRIPTION
  Execute a saved prompt through the Claude agent

EXAMPLES
  $ claude claude prompt run summarize

  $ claude claude prompt run classify --arg summary="Login fails" --arg description="TODO: fix client request"

  $ claude claude prompt run summarize --profile work --workspace proj01

  $ claude claude prompt run review --workspace proj01 --repo repo01

  $ claude claude prompt run summarize --system "Override the saved system prompt"

  $ claude claude prompt run classify --arg summary="..." --dry-run

  $ claude claude prompt run summarize --debug
```

_See code: [src/commands/claude/prompt/run.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/prompt/run.ts)_

## `claude claude prompt show NAME`

View a saved prompt

```
USAGE
  $ claude claude prompt show NAME

ARGUMENTS
  NAME  Prompt name

DESCRIPTION
  View a saved prompt

EXAMPLES
  $ claude claude prompt show summarize
```

_See code: [src/commands/claude/prompt/show.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/prompt/show.ts)_

## `claude claude run NAME [INPUT]`

Execute a slash command or skill by name

```
USAGE
  $ claude claude run NAME [INPUT] [--json] [--allow-tools <value>] [-p <value>] [--repo <value>] [--system
    <value>] [-w <value>]

ARGUMENTS
  NAME     Slash command (e.g. /help) or skill name
  [INPUT]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --system=<value>       Custom system prompt for the agent

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute a slash command or skill by name

EXAMPLES
  $ claude claude run /help

  $ claude claude run review "this branch"

  $ claude claude run /clear --json

  $ claude claude run review "this repo" --workspace proj01
```

_See code: [src/commands/claude/run.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/run.ts)_

## `claude claude session`

List persisted agent sessions

```
USAGE
  $ claude claude session [--all] [--dir <value>] [--limit <value>] [--offset <value>]

FLAGS
  --all             List sessions across all projects (default: current directory)
  --dir=<value>     Project directory to list sessions for
  --limit=<value>   Maximum number of sessions to return
  --offset=<value>  Number of sessions to skip (for pagination)

DESCRIPTION
  List persisted agent sessions

EXAMPLES
  $ claude claude session

  $ claude claude session --all

  $ claude claude session --dir ~/code/repo-a --limit 10
```

_See code: [src/commands/claude/session/index.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/index.ts)_

## `claude claude session delete SESSIONID`

Delete a session transcript

```
USAGE
  $ claude claude session delete SESSIONID [--dir <value>] [-f]

ARGUMENTS
  SESSIONID  Session ID (UUID)

FLAGS
  -f, --force        Skip the confirmation prompt
      --dir=<value>  Project directory the session belongs to

DESCRIPTION
  Delete a session transcript

EXAMPLES
  $ claude claude session delete 4f8b6f2a-1234-4c56-8d90-abcdef012345

  $ claude claude session delete 4f8b6f2a-1234-4c56-8d90-abcdef012345 --force
```

_See code: [src/commands/claude/session/delete.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/delete.ts)_

## `claude claude session fork SESSIONID`

Fork a session into a new independent branch

```
USAGE
  $ claude claude session fork SESSIONID [--dir <value>] [--title <value>]

ARGUMENTS
  SESSIONID  Session ID (UUID) to fork

FLAGS
  --dir=<value>    Project directory the session belongs to
  --title=<value>  Title for the forked session

DESCRIPTION
  Fork a session into a new independent branch

EXAMPLES
  $ claude claude session fork 4f8b6f2a-1234-4c56-8d90-abcdef012345

  $ claude claude session fork 4f8b6f2a-1234-4c56-8d90-abcdef012345 --title "OAuth2 spike"
```

_See code: [src/commands/claude/session/fork.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/fork.ts)_

## `claude claude session rename SESSIONID TITLE`

Set a custom title on a session

```
USAGE
  $ claude claude session rename SESSIONID TITLE [--dir <value>]

ARGUMENTS
  SESSIONID  Session ID (UUID)
  TITLE      New session title

FLAGS
  --dir=<value>  Project directory the session belongs to

DESCRIPTION
  Set a custom title on a session

EXAMPLES
  $ claude claude session rename 4f8b6f2a-1234-4c56-8d90-abcdef012345 "Auth refactor"
```

_See code: [src/commands/claude/session/rename.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/rename.ts)_

## `claude claude session resume SESSIONID PROMPT`

Resume a session with a follow-up prompt

```
USAGE
  $ claude claude session resume SESSIONID PROMPT [--allow-tools <value>] [--fork] [-m <value>] [-p <value>] [--stream]

ARGUMENTS
  SESSIONID  Session ID (UUID) to resume
  PROMPT     Follow-up prompt to send to the resumed session

FLAGS
  -m, --model=<value>        Model to use (e.g. claude-opus-4-7)
  -p, --profile=<value>      Authentication profile name
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --fork                 Fork into a new session instead of appending to the original
      --stream               Stream assistant text as it arrives

DESCRIPTION
  Resume a session with a follow-up prompt

EXAMPLES
  $ claude claude session resume 4f8b6f2a-1234-4c56-8d90-abcdef012345 "Now implement the refactoring you suggested"

  $ claude claude session resume 4f8b6f2a-1234-4c56-8d90-abcdef012345 "Try OAuth2 instead" --fork
```

_See code: [src/commands/claude/session/resume.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/resume.ts)_

## `claude claude session show SESSIONID`

Show metadata (and optionally messages) for a session

```
USAGE
  $ claude claude session show SESSIONID [--dir <value>] [--limit <value>] [--messages] [--offset <value>]

ARGUMENTS
  SESSIONID  Session ID (UUID)

FLAGS
  --dir=<value>     Project directory the session belongs to
  --limit=<value>   Maximum number of messages to return (with --messages)
  --messages        Include the session conversation messages
  --offset=<value>  Number of messages to skip (with --messages)

DESCRIPTION
  Show metadata (and optionally messages) for a session

EXAMPLES
  $ claude claude session show 4f8b6f2a-1234-4c56-8d90-abcdef012345

  $ claude claude session show 4f8b6f2a-1234-4c56-8d90-abcdef012345 --messages

  $ claude claude session show 4f8b6f2a-1234-4c56-8d90-abcdef012345 --messages --limit 20
```

_See code: [src/commands/claude/session/show.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/show.ts)_

## `claude claude session tag SESSIONID [TAG]`

Set or clear a tag on a session

```
USAGE
  $ claude claude session tag SESSIONID [TAG] [--clear] [--dir <value>]

ARGUMENTS
  SESSIONID  Session ID (UUID)
  [TAG]      Tag to set (omit with --clear to remove the tag)

FLAGS
  --clear        Remove the tag from the session
  --dir=<value>  Project directory the session belongs to

DESCRIPTION
  Set or clear a tag on a session

EXAMPLES
  $ claude claude session tag 4f8b6f2a-1234-4c56-8d90-abcdef012345 auth-work

  $ claude claude session tag 4f8b6f2a-1234-4c56-8d90-abcdef012345 --clear
```

_See code: [src/commands/claude/session/tag.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/session/tag.ts)_

## `claude claude skill`

Execute a skill by name

```
USAGE
  $ claude claude skill

DESCRIPTION
  Execute a skill by name

EXAMPLES
  $ claude claude skill
```

_See code: [src/commands/claude/skill/index.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/skill/index.ts)_

## `claude claude skill run NAME [INPUT]`

Execute a skill by name

```
USAGE
  $ claude claude skill run NAME [INPUT] [--json] [--allow-tools <value>] [-p <value>] [--repo <value>] [--system
    <value>] [-w <value>]

ARGUMENTS
  NAME     Skill name (e.g. review)
  [INPUT]  Additional input to forward to the skill

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --system=<value>       Custom system prompt for the agent

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute a skill by name

EXAMPLES
  $ claude claude skill run review "this branch"

  $ claude claude skill run init --stream

  $ claude claude skill run review "this repo" --workspace proj01
```

_See code: [src/commands/claude/skill/run.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/skill/run.ts)_

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

_See code: [src/commands/claude/workspace/add.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/workspace/add.ts)_

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

_See code: [src/commands/claude/workspace/default.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/workspace/default.ts)_

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

_See code: [src/commands/claude/workspace/delete.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/workspace/delete.ts)_

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

_See code: [src/commands/claude/workspace/list.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/workspace/list.ts)_

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

_See code: [src/commands/claude/workspace/update.ts](https://github.com/hesedcasa/claude/blob/v0.4.0/src/commands/claude/workspace/update.ts)_
<!-- commandsstop -->
