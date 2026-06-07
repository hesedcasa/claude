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
│   ├── list.ts            # List skills, commands, tools, agents, MCP servers
│   ├── run.ts             # Execute a slash command or skill by name
│   ├── auth/              # Profile management (add, delete, list, profile, test, update)
│   └── workspace/         # Workspace management (add, default, delete, list, update)
├── agent/
│   ├── agent-api.ts       # AgentApi class wrapping claude-agent-sdk query()
│   ├── agent-client.ts    # Singleton wrapper functions (ask, list, run, testConnection)
│   └── usage.ts           # formatUsageSummary helper
├── config.ts              # Profiles, workspaces, path helpers (readAgentConfig, readWorkspace, etc.)
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

**3. AgentApi drives the SDK generator:**
`AgentApi.ask()` iterates the `query()` async generator, collects `assistant` messages (text blocks and tool-use blocks) and the final `result` message. `AgentApi.list()` aborts after the `system/init` message to cheaply enumerate available capabilities. `AgentApi.run()` dispatches to `ask()` with either a slash-command prompt or a skills-scoped prompt.

**4. Profiles + Workspaces (config.ts):**
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
    "proj01": {"repo-a": "~/code/repo-a", "repo-b": "~/code/repo-b"}
  }
}
```

- `readAgentConfig(configDir, log, profileName?)` resolves the profile (falls back to `defaultProfile`).
- `readWorkspace(configDir, log, workspaceName?)` resolves the workspace (falls back to `defaultWorkspace`) and returns a `Record<repoName, absPath>`.
- When a workspace is loaded, `ask` builds a system prompt listing the repo directories, sets `cwd` to the common parent, and passes `additionalDirectories` to the SDK.

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
