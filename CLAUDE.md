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
│   ├── ask.ts             # Send a natural-language prompt to the agent
│   ├── list/              # List capabilities: index.ts (all) + tools, agents, mcp-servers
│   ├── command/           # Slash commands: index.ts (list) + run.ts (execute by name, no leading / needed)
│   ├── skill/             # Skills: index.ts (list) + run.ts (execute by name)
│   ├── run.ts             # Execute a slash command or skill by name (dispatches on leading /)
│   ├── auth/              # Profile management (add, delete, list, profile, test, update)
│   ├── prompt/            # Saved prompts (add, delete/rm, edit, list, run, show)
│   └── workspace/         # Workspace management (add, default, delete, list, update)
├── agent/
│   ├── agent-api.ts       # AgentApi class wrapping claude-agent-sdk query()
│   ├── agent-client.ts    # Singleton wrapper functions (ask, list, run, runCommand, runSkill, testConnection)
│   ├── profile-config.ts  # Profile resolution (loadAgentConfig)
│   └── usage.ts           # formatUsageSummary helper
├── hooks/
│   └── init/register-capability-commands.ts  # init hook: registers cached skills/commands as first-class commands
├── capability-commands.ts # Capabilities cache (capabilities.json) + dynamic oclif command factory/registration
├── list-command.ts        # ListCommand base class shared by the list-style commands (category filter + cache refresh)
├── run-command.ts         # RunCommand base class shared by run, command run, skill run (workspace context + output)
├── prompts-config.ts      # Saved prompts {body (user prompt), system, description} in claude-prompts.jsonl — JSON Lines, one {name: config} object per line (name is the object key, not a field) (readPrompts, savePrompts, resolvePrompt); {{name}} templating via extractPlaceholders/renderPrompt (filled by `prompt run --arg name=value`)
├── workspace-config.ts    # Workspace entries {mode, repos}, path helpers (readWorkspace, etc.)
├── workspace-bash.ts      # Workspace context: local dirs or just-bash sandbox (git clone + virtual fs)
└── format.ts              # TOON output formatting
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

**4. AgentApi drives the SDK generator:**
`AgentApi.ask()` iterates the `query()` async generator, collects `assistant` messages (text blocks and tool-use blocks) and the final `result` message. `AgentApi.list()` aborts after the `system/init` message to cheaply enumerate available capabilities. `AgentApi.runCommand()` sends a slash-command prompt and `AgentApi.runSkill()` sends a skills-scoped prompt (both via `ask()`); `AgentApi.run()` dispatches to one of them based on a leading `/`.

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
- TOON format: `this.log(formatAsToon(result))` with `--toon` flag
- Usage summary: `formatUsageSummary(usage)` prints token/cost/duration line (used in `run.ts`)

## Commit Message Convention

Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
