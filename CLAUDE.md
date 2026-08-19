# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@hesed/claude** is an Oclif-based CLI tool that wraps the `@anthropic-ai/claude-agent-sdk` to expose Claude agent capabilities (ask, run, list, auth, workspace management) as a terminal command.

## Development Commands

```bash
# Build
npm run build

# Run all tests
npm test

# Run a single test file
npx mocha test/path/to/test.test.ts

# Lint and format
npm run lint
npm run format

# Coverage (50% threshold enforced)
npm run test:coverage

# Find dead code
npm run find-deadcode
```

## Architecture

```
src/
├── commands/claude/       # Oclif CLI commands (user-facing)
│   ├── index.ts           # Interactive multi-turn chat session (streaming input mode)
│   ├── acp/               # Agent Client Protocol: index.ts (list peers) + add, delete, prompt, serve
│   ├── ask.ts             # Send a natural-language prompt to the agent
│   ├── list/              # List capabilities: index.ts (all) + tools, agents, mcp-servers
│   ├── command/           # Slash commands: index.ts (list) + run.ts (execute by name, no leading / needed)
│   ├── skill/             # Skills: index.ts (list) + run.ts (execute by name)
│   ├── run.ts             # Execute a slash command or skill by name (dispatches on leading /)
│   ├── auth/              # Profile management (add, delete, list, profile, test, update)
│   ├── prompt/            # Saved prompts (add, delete/rm, edit, list, run, show)
│   ├── session/           # Session management (index=list, show, delete, rename, tag, fork, resume)
│   └── workspace/         # Workspace management (add, default, delete, list, update)
├── acp/
│   ├── acp-agent.ts       # ClaudeAcpAgent: the Claude agent exposed as an ACP agent (server role)
│   ├── acp-client.ts      # AcpPeer: spawns and drives another ACP agent (client role)
│   ├── acp-config.ts      # Peer agent registry ({command, args, cwd, env}) under acpAgents in claude-config.json
│   ├── acp-serve.ts       # serveAcpOverStdio: stdio transport wiring for the agent role
│   └── acp-stream.ts      # nodeStdioStream: node stdio -> ACP newline-delimited JSON transport
├── agent/
│   ├── agent-api.ts       # AgentApi class wrapping claude-agent-sdk query()
│   ├── agent-client.ts    # Singleton wrapper functions (ask, list, run, runCommand, runSkill, testConnection)
│   ├── profile-config.ts  # Profile resolution (loadAgentConfig)
│   ├── session-api.ts     # ApiResult wrappers over the SDK session fns (listSessions, getSessionInfo/Messages, deleteSession, renameSession, tagSession, forkSession)
│   └── usage.ts           # formatUsageSummary helper
├── hooks/
│   └── init/register-capability-commands.ts  # init hook: registers cached skills/commands as first-class commands
├── capability-commands.ts # Capabilities cache (capabilities.json, entries {name, description?, argumentHint?}) + dynamic oclif command factory/registration
├── capability-metadata.ts # Frontmatter enrichment for the cache: reads description/argument-hint from SKILL.md / command .md (project .claude, user dir, plugin paths)
├── list-command.ts        # ListCommand base class shared by the list-style commands (category filter + cache refresh)
├── run-command.ts         # RunCommand base class shared by run, command run, skill run (workspace context + output)
├── prompts-config.ts      # Saved prompts {body (user prompt), system, description} in claude-prompts.jsonl — JSON Lines, one {name: config} object per line (name is the object key, not a field) (readPrompts, savePrompts, resolvePrompt); {{name}} templating via extractPlaceholders/renderPrompt (filled by `prompt run --arg name=value`)
├── workspace-config.ts    # Workspace entries {mode, repos}, path helpers (readWorkspace, etc.)
└── workspace-bash.ts      # Workspace context: local dirs or just-bash sandbox (git clone + virtual fs)
```

### Key Architectural Patterns

**1. Three-Tier Command Pattern:**

- **Commands** (`src/commands/claude/`) — thin Oclif wrappers that parse args/flags
- **Client Layer** (`agent-client.ts`) — functional wrappers with singleton `AgentApi` instance
- **API Layer** (`agent-api.ts`) — `AgentApi` class that drives the SDK's `query()` async generator

**2. ApiResult Pattern:**
All API functions return `ApiResult`:

```typescript
interface ApiResult {
  data?: unknown
  error?: unknown
  success: boolean
}
```

**3. Skills/slash commands as CLI commands (capability-commands.ts + hooks/):**
The `init` hook exposes slash commands as `claude command <name> [input]` and skills as `claude skill <name> [input]`:

- **`init` hook (hooks/init/register-capability-commands.ts):** at startup, reads the capabilities cache (`<cacheDir>/capabilities.json`, written by `claude list` via `ListCommand.refreshCapabilityCache`) and injects one dynamic oclif command per skill/slash command into the Config's internal `_commands` map (`registerCapabilityCommands`) under its topic (`claude:command:<name>` / `claude:skill:<name>`). Registered names appear in `claude help` with the same flags as `command run`/`skill run`; each dynamic command forwards its raw argv (name without leading `/`) to `claude command run <name>` or `claude skill run <name>`. Existing command ids and topics are never replaced, so built-ins always win. Run `claude list` to (re)populate the cache.
- **Capability metadata (capability-metadata.ts + supportedCommands):** when `claude list` refreshes the cache, each entry gets a `description`/`argumentHint` merged from two sources. (1) Markdown frontmatter on disk (`SKILL.md` for skills, `<name>.md` for commands; probed in the project `.claude` dir, the user-level Claude dir, and the owning plugin's path from the init message's `plugins` — each kind also probes the other layout since Claude Code lists commands among skills and vice versa) — this covers model-invoked plugin/user skills. (2) The SDK's `supportedCommands()` control request, called by `AgentApi.list()` after init — this covers user-invocable capabilities, including ones bundled inside Claude Code with no file on disk (e.g. `simplify`). Frontmatter wins per field. Dynamic commands surface the metadata as their help description and `INPUT` argument hint (generic fallback when neither source has it; legacy name-only caches still load). The `capabilities` and `plugins` fields ride on the list result for the cache and are stripped from `claude list` display output.

**4. AgentApi drives the SDK generator:**
`AgentApi.ask()` iterates the `query()` async generator, collects `assistant` messages (text blocks and tool-use blocks) and the final `result` message. `AgentApi.list()` aborts after the `system/init` message to cheaply enumerate available capabilities. `AgentApi.runCommand()` sends a slash-command prompt and `AgentApi.runSkill()` sends a skills-scoped prompt (both via `ask()`); `AgentApi.run()` dispatches to one of them based on a leading `/`. `AgentApi.chat()` uses the SDK's streaming input mode: instead of a string prompt it passes an `AsyncIterable<string>` of user prompts (wrapped as `SDKUserMessage`s), keeping the session alive across turns; each turn's `result` message fires `options.onTurnEnd` and the returned `ApiResult` summarises the session (last result text, per-turn count, cumulative usage). The root `claude` command (commands/claude/index.ts) builds that prompt stream from interactive input (`@inquirer/prompts` on a TTY, stdin lines when piped), pausing after each `yield` until `onTurnEnd` signals the turn finished; `exit`/`quit`/`/exit`/`/quit` or EOF ends the session.

**5. Profiles + Workspaces (profile-config.ts / workspace-config.ts):**
Config lives at `~/.config/claude/claude-config.json`:

```json
{
  "defaultProfile": "work",
  "defaultWorkspace": "proj01",
  "profiles": {
    "default": {"apiKey": "sk-...", "apiUrl": "", "models": {"haiku": "...", "opus": "...", "sonnet": "..."}},
    "work": {"apiKey": "sk-...", "apiUrl": "https://custom/v1"}
  },
  "workspaces": {
    "proj01": {"mode": "local", "repos": {"repo-a": "~/code/repo-a", "repo-b": "~/code/repo-b"}},
    "proj02": {"mode": "sandbox", "repos": {"repo-c": "https://github.com/org/repo-c.git"}}
  },
  "acpAgents": {
    "gemini": {"command": "gemini", "args": ["--experimental-acp"]}
  }
}
```

- `readAgentConfig(configDir, log, profileName?)` resolves the profile (falls back to `defaultProfile`).
- `readWorkspace(configDir, log, workspaceName?)` resolves the named workspace and returns a `WorkspaceEntry` (`{mode, repos}`). Without an explicit name it returns `undefined` (no `defaultWorkspace` fallback), so `ask`/`run`/`list` run against the current directory. `defaultWorkspace` is only used by the `workspace` management commands (`default`, `update`).
- Workspace `mode` is set via `workspace add/update --mode`, not on `ask`/`run`.

**6. Workspace modes (workspace-bash.ts):**

`buildWorkspaceContext({cacheDir, log, mode, repoFilter, repos, workspaceLabel})` turns a workspace into agent run context:

- **`local` mode** — repo paths are real directories: `ask`/`run` build a system prompt listing them, set `cwd` to the common parent (`commonParentDir`), and pass `additionalDirectories` to the SDK. Git URLs are skipped with a hint.
- **`sandbox` mode** — repos are mounted copy-on-write (just-bash `OverlayFs` under `MountableFs`) at `/workspace/<repoName>` in an in-memory virtual filesystem; git URLs are shallow-cloned into `<dataDir>/workspace-repos` first (`syncGitRepo`). The returned `sandboxExec` is passed to `AgentApi.ask()`, which exposes it as an in-process MCP `bash` tool (`mcp__workspace-bash__bash` via `createSdkMcpServer`) and disallows the built-in `Bash`/`Edit`/`Glob`/`Grep`/`Read`/`Write` tools, so all agent file/shell operations stay inside the sandbox and never touch the real filesystem.

**7. ACP — talking to other AI agents (src/acp/ + commands/claude/acp/):**

The [Agent Client Protocol](https://agentclientprotocol.com) is JSON-RPC 2.0 over newline-delimited stdio, spoken between a _client_ (a code editor, or another agent driving one) and an _agent_. This CLI implements both roles, so it can be driven by other tools and can drive other agents.

- **Agent role — `claude acp serve` (acp-agent.ts + acp-serve.ts):** `serveAcpOverStdio` builds the transport and hands it to the ACP library's `AgentSideConnection` wrapping `ClaudeAcpAgent`. `initialize` negotiates the version (`Math.min` of ours and the client's) and advertises `loadSession`, `mcpCapabilities` (http/sse) and `promptCapabilities.embeddedContext`. `session/new` mints an ACP session id and remembers the client's `cwd` and MCP servers (`toSdkMcpServers` maps ACP `McpServer[]` to the SDK's config). `session/prompt` flattens the prompt's ContentBlocks (`promptToText`) and runs one `ask()` turn, streaming `agent_message_chunk`, `tool_call` and `tool_call_update` notifications from `ask()`'s `onText`/`onToolUse`/`onToolResult` callbacks; the SDK session id from the first turn is stored and passed as `resume` on later turns, so the conversation keeps its history. Notifications are chained onto a single promise (`enqueueUpdate`) because the SDK's callbacks are synchronous while sending is not, and the queue is flushed before the response. `session/cancel` aborts the turn's `AbortController`, which makes the pending prompt answer `stopReason: 'cancelled'`. `session/load` treats the ACP session id as an SDK session id: it checks the session exists via `getAgentSessionInfo` (reading messages for an unknown session returns an empty list, not an error) and replays the transcript as message chunks. **stdout is the protocol channel** — `serve.ts` logs only to stderr.
- **Client role — `claude acp prompt` (acp-client.ts):** `AcpPeer` spawns the peer program, wraps its stdio in a `ClientSideConnection`, and exposes `start`/`newSession`/`loadSession`/`prompt`/`close`. It answers the peer's `session/request_permission` from a policy (`--permission allow|reject`, preferring the one-shot option kinds so an answer never leaks into later turns) and serves `fs/read_text_file` / `fs/write_text_file` from the real filesystem (`--read-only` withdraws the write capability). Pending requests are tracked in a waiter set so a peer that dies fails them instead of hanging. Peer JSON-RPC failures reject with a plain `{code, message, data}` object rather than an `Error`, so `prompt.ts` formats them before reporting.
- **Peer registry (acp-config.ts):** named peers live under `acpAgents` in `claude-config.json` alongside profiles and workspaces (`claude acp add gemini gemini --arg --experimental-acp`); `claude acp prompt` resolves a name through it, or takes an inline `--command`/`--arg`.
- **AgentApi additions this needed:** `AskOptions` gained `abortController` (cancellation), `mcpServers` (client-supplied servers, merged in `resolveToolOptions` with the sandbox server winning its name), `onToolResult`, and an optional details argument on `onToolUse` carrying the tool-use id and input — enough to emit ACP tool calls that clients can complete and locate.

**8. Sessions (session-api.ts + commands/claude/session/):**

The SDK persists every `query()` run as a session transcript under `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`. `AgentApi.ask()` accepts `resume` (session ID), `continueSession`, and `forkSession` options (mapped to the SDK's `resume`/`continue`/`forkSession` query options) and reports the run's `session_id` back as `sessionId` in `AskResult`, so any `ask`/`run` output contains the ID needed to return to that conversation. `ask` exposes these as `--resume <id>`, `--continue`, and `--fork-session`; `session resume <id> <prompt>` resumes through the same `ask()` path (with `--fork` to branch instead of appending). The remaining `session` commands (`session` = list, `show`, `delete`, `rename`, `tag`, `fork`) operate on transcripts directly via the SDK session functions wrapped in `session-api.ts` — no agent run and no profile/API key required. `session` (list) defaults to the current directory's project; pass `--all` for every project.

## Adding a New Command

1. Create `src/commands/claude/<category>/<name>.ts`
2. Extend `Command` from `@oclif/core`; define `static args`, `flags`, `description`, `examples`
3. In `run()`: parse → `readAgentConfig` → call client function → `clearClients()` → output
4. Use `readAgentConfig(this.config.configDir, this.log.bind(this), flags.profile)` (not the old `readConfig`)

**Argument ordering:** when positional args are not alphabetically sorted, wrap with eslint-disable:

```typescript
/* eslint-disable perfectionist/sort-objects */
static override args = {
  name: Args.string({...}),
  input: Args.string({...}),
}
/* eslint-enable perfectionist/sort-objects */
```

## Adding New API Functions

1. Add a method to `AgentApi` in `agent-api.ts` (must return `ApiResult`)
2. Export a wrapper function from `agent-client.ts` (uses `initAgent()` singleton)
3. Call `clearClients()` in the command after the API call

## Testing

- Mocha + Chai + sinon; `esmock` for ES module mocking
- `esmock()` paths must use `.js` extensions even though source files are `.ts`
- Commands are instantiated directly: `new CommandClass([...args], {configDir, root, runHook} as any)`
- Arg array order must match `static args` definition order exactly
- `configDir` is required in constructor options whenever `readAgentConfig` is called
- `posttest` runs `npm run lint` — a passing test run requires clean lint

### Linting quirks

- `camelcase` rule flags snake_case params passed to external APIs — use `// eslint-disable-next-line camelcase`
- `unicorn/no-useless-undefined` flags `stub.calledWith(undefined)` — use `stub.firstCall.args[0] === undefined`

## Output Formatting

- Default: `this.logJson(result)`
- Usage summary: `formatUsageSummary(usage)` prints token/cost/duration line (used in `run.ts`)

## Commit Message Convention

Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
