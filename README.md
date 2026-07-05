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
@hesed/claude/0.3.0 darwin-arm64 node-v22.22.3
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
* [`claude claude command agents [INPUT]`](#claude-claude-command-agents-input)
* [`claude claude command api extract-api [INPUT]`](#claude-claude-command-api-extract-api-input)
* [`claude claude command ax-agent [INPUT]`](#claude-claude-command-ax-agent-input)
* [`claude claude command ax-agent-memory-skills [INPUT]`](#claude-claude-command-ax-agent-memory-skills-input)
* [`claude claude command ax-agent-observability [INPUT]`](#claude-claude-command-ax-agent-observability-input)
* [`claude claude command ax-agent-optimize [INPUT]`](#claude-claude-command-ax-agent-optimize-input)
* [`claude claude command ax-agent-rlm [INPUT]`](#claude-claude-command-ax-agent-rlm-input)
* [`claude claude command ax-ai [INPUT]`](#claude-claude-command-ax-ai-input)
* [`claude claude command ax-audio [INPUT]`](#claude-claude-command-ax-audio-input)
* [`claude claude command ax-flow [INPUT]`](#claude-claude-command-ax-flow-input)
* [`claude claude command ax-gen [INPUT]`](#claude-claude-command-ax-gen-input)
* [`claude claude command ax-gepa [INPUT]`](#claude-claude-command-ax-gepa-input)
* [`claude claude command ax-llm [INPUT]`](#claude-claude-command-ax-llm-input)
* [`claude claude command ax-refine [INPUT]`](#claude-claude-command-ax-refine-input)
* [`claude claude command ax-signature [INPUT]`](#claude-claude-command-ax-signature-input)
* [`claude claude command batch [INPUT]`](#claude-claude-command-batch-input)
* [`claude claude command browse-seeking admin-portal [INPUT]`](#claude-claude-command-browse-seeking-admin-portal-input)
* [`claude claude command browse-seeking webapp [INPUT]`](#claude-claude-command-browse-seeking-webapp-input)
* [`claude claude command browse-seeking webapp-mobile [INPUT]`](#claude-claude-command-browse-seeking-webapp-mobile-input)
* [`claude claude command claude-api [INPUT]`](#claude-claude-command-claude-api-input)
* [`claude claude command claude-md-management claude-md-improver [INPUT]`](#claude-claude-command-claude-md-management-claude-md-improver-input)
* [`claude claude command claude-md-management revise-claude-md [INPUT]`](#claude-claude-command-claude-md-management-revise-claude-md-input)
* [`claude claude command clear [INPUT]`](#claude-claude-command-clear-input)
* [`claude claude command code-refactoring refactoring [INPUT]`](#claude-claude-command-code-refactoring-refactoring-input)
* [`claude claude command code-review [INPUT]`](#claude-claude-command-code-review-input)
* [`claude claude command code-review code-review [INPUT]`](#claude-claude-command-code-review-code-review-input)
* [`claude claude command codex adversarial-review [INPUT]`](#claude-claude-command-codex-adversarial-review-input)
* [`claude claude command codex cancel [INPUT]`](#claude-claude-command-codex-cancel-input)
* [`claude claude command codex rescue [INPUT]`](#claude-claude-command-codex-rescue-input)
* [`claude claude command codex result [INPUT]`](#claude-claude-command-codex-result-input)
* [`claude claude command codex review [INPUT]`](#claude-claude-command-codex-review-input)
* [`claude claude command codex setup [INPUT]`](#claude-claude-command-codex-setup-input)
* [`claude claude command codex status [INPUT]`](#claude-claude-command-codex-status-input)
* [`claude claude command commit-commands clean_gone [INPUT]`](#claude-claude-command-commit-commands-clean_gone-input)
* [`claude claude command commit-commands commit [INPUT]`](#claude-claude-command-commit-commands-commit-input)
* [`claude claude command commit-commands commit-push-pr [INPUT]`](#claude-claude-command-commit-commands-commit-push-pr-input)
* [`claude claude command compact [INPUT]`](#claude-claude-command-compact-input)
* [`claude claude command config [INPUT]`](#claude-claude-command-config-input)
* [`claude claude command context [INPUT]`](#claude-claude-command-context-input)
* [`claude claude command dataviz [INPUT]`](#claude-claude-command-dataviz-input)
* [`claude claude command debug [INPUT]`](#claude-claude-command-debug-input)
* [`claude claude command deep-research [INPUT]`](#claude-claude-command-deep-research-input)
* [`claude claude command design [INPUT]`](#claude-claude-command-design-input)
* [`claude claude command design-patterns design-patterns [INPUT]`](#claude-claude-command-design-patterns-design-patterns-input)
* [`claude claude command design-sync [INPUT]`](#claude-claude-command-design-sync-input)
* [`claude claude command dev-coding-kit cloud-estimate [INPUT]`](#claude-claude-command-dev-coding-kit-cloud-estimate-input)
* [`claude claude command dev-coding-kit commit [INPUT]`](#claude-claude-command-dev-coding-kit-commit-input)
* [`claude claude command dev-coding-kit estimate [INPUT]`](#claude-claude-command-dev-coding-kit-estimate-input)
* [`claude claude command dev-coding-kit implement [INPUT]`](#claude-claude-command-dev-coding-kit-implement-input)
* [`claude claude command dev-coding-kit init-plan-context [INPUT]`](#claude-claude-command-dev-coding-kit-init-plan-context-input)
* [`claude claude command dev-coding-kit misc agents-bootstrap [INPUT]`](#claude-claude-command-dev-coding-kit-misc-agents-bootstrap-input)
* [`claude claude command dev-coding-kit misc generate-rules [INPUT]`](#claude-claude-command-dev-coding-kit-misc-generate-rules-input)
* [`claude claude command dev-coding-kit misc provision-rule [INPUT]`](#claude-claude-command-dev-coding-kit-misc-provision-rule-input)
* [`claude claude command dev-coding-kit plan [INPUT]`](#claude-claude-command-dev-coding-kit-plan-input)
* [`claude claude command dev-coding-kit review [INPUT]`](#claude-claude-command-dev-coding-kit-review-input)
* [`claude claude command feature-dev feature-dev [INPUT]`](#claude-claude-command-feature-dev-feature-dev-input)
* [`claude claude command fewer-permission-prompts [INPUT]`](#claude-claude-command-fewer-permission-prompts-input)
* [`claude claude command figma figma-code-connect [INPUT]`](#claude-claude-command-figma-figma-code-connect-input)
* [`claude claude command figma figma-create-new-file [INPUT]`](#claude-claude-command-figma-figma-create-new-file-input)
* [`claude claude command figma figma-generate-design [INPUT]`](#claude-claude-command-figma-figma-generate-design-input)
* [`claude claude command figma figma-generate-diagram [INPUT]`](#claude-claude-command-figma-figma-generate-diagram-input)
* [`claude claude command figma figma-generate-library [INPUT]`](#claude-claude-command-figma-figma-generate-library-input)
* [`claude claude command figma figma-implement-motion [INPUT]`](#claude-claude-command-figma-figma-implement-motion-input)
* [`claude claude command figma figma-swiftui [INPUT]`](#claude-claude-command-figma-figma-swiftui-input)
* [`claude claude command figma figma-use [INPUT]`](#claude-claude-command-figma-figma-use-input)
* [`claude claude command figma figma-use-figjam [INPUT]`](#claude-claude-command-figma-figma-use-figjam-input)
* [`claude claude command figma figma-use-motion [INPUT]`](#claude-claude-command-figma-figma-use-motion-input)
* [`claude claude command figma figma-use-slides [INPUT]`](#claude-claude-command-figma-figma-use-slides-input)
* [`claude claude command frontend-design frontend-design [INPUT]`](#claude-claude-command-frontend-design-frontend-design-input)
* [`claude claude command goal [INPUT]`](#claude-claude-command-goal-input)
* [`claude claude command heapdump [INPUT]`](#claude-claude-command-heapdump-input)
* [`claude claude command init [INPUT]`](#claude-claude-command-init-input)
* [`claude claude command insights [INPUT]`](#claude-claude-command-insights-input)
* [`claude claude command loop [INPUT]`](#claude-claude-command-loop-input)
* [`claude claude command mcp__plugin_figma_figma__create_design_system_rules [INPUT]`](#claude-claude-command-mcp__plugin_figma_figma__create_design_system_rules-input)
* [`claude claude command n8n-mcp-skills n8n-code-javascript [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-code-javascript-input)
* [`claude claude command n8n-mcp-skills n8n-code-python [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-code-python-input)
* [`claude claude command n8n-mcp-skills n8n-expression-syntax [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-expression-syntax-input)
* [`claude claude command n8n-mcp-skills n8n-mcp-tools-expert [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-mcp-tools-expert-input)
* [`claude claude command n8n-mcp-skills n8n-node-configuration [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-node-configuration-input)
* [`claude claude command n8n-mcp-skills n8n-validation-expert [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-validation-expert-input)
* [`claude claude command n8n-mcp-skills n8n-workflow-patterns [INPUT]`](#claude-claude-command-n8n-mcp-skills-n8n-workflow-patterns-input)
* [`claude claude command peer-review cloud-peer-review [INPUT]`](#claude-claude-command-peer-review-cloud-peer-review-input)
* [`claude claude command peer-review deploy-test-server [INPUT]`](#claude-claude-command-peer-review-deploy-test-server-input)
* [`claude claude command peer-review peer-review [INPUT]`](#claude-claude-command-peer-review-peer-review-input)
* [`claude claude command plugin-dev agent-development [INPUT]`](#claude-claude-command-plugin-dev-agent-development-input)
* [`claude claude command plugin-dev command-development [INPUT]`](#claude-claude-command-plugin-dev-command-development-input)
* [`claude claude command plugin-dev create-plugin [INPUT]`](#claude-claude-command-plugin-dev-create-plugin-input)
* [`claude claude command plugin-dev hook-development [INPUT]`](#claude-claude-command-plugin-dev-hook-development-input)
* [`claude claude command plugin-dev mcp-integration [INPUT]`](#claude-claude-command-plugin-dev-mcp-integration-input)
* [`claude claude command plugin-dev plugin-settings [INPUT]`](#claude-claude-command-plugin-dev-plugin-settings-input)
* [`claude claude command plugin-dev plugin-structure [INPUT]`](#claude-claude-command-plugin-dev-plugin-structure-input)
* [`claude claude command plugin-dev skill-development [INPUT]`](#claude-claude-command-plugin-dev-skill-development-input)
* [`claude claude command pr-review-toolkit review-pr [INPUT]`](#claude-claude-command-pr-review-toolkit-review-pr-input)
* [`claude claude command prompt-engineering prompt-engineering [INPUT]`](#claude-claude-command-prompt-engineering-prompt-engineering-input)
* [`claude claude command recap [INPUT]`](#claude-claude-command-recap-input)
* [`claude claude command reflex-workflows jira-intake-analyzer [INPUT]`](#claude-claude-command-reflex-workflows-jira-intake-analyzer-input)
* [`claude claude command reflex-workflows jira-plan-implementer [INPUT]`](#claude-claude-command-reflex-workflows-jira-plan-implementer-input)
* [`claude claude command reflex-workflows jira-plan-writer [INPUT]`](#claude-claude-command-reflex-workflows-jira-plan-writer-input)
* [`claude claude command reload-skills [INPUT]`](#claude-claude-command-reload-skills-input)
* [`claude claude command remotion-best-practices [INPUT]`](#claude-claude-command-remotion-best-practices-input)
* [`claude claude command review [INPUT]`](#claude-claude-command-review-input)
* [`claude claude command run NAME [INPUT]`](#claude-claude-command-run-name-input)
* [`claude claude command run-skill-generator [INPUT]`](#claude-claude-command-run-skill-generator-input)
* [`claude claude command security-review [INPUT]`](#claude-claude-command-security-review-input)
* [`claude claude command sentry seer [INPUT]`](#claude-claude-command-sentry-seer-input)
* [`claude claude command sentry sentry-android-sdk [INPUT]`](#claude-claude-command-sentry-sentry-android-sdk-input)
* [`claude claude command sentry sentry-browser-sdk [INPUT]`](#claude-claude-command-sentry-sentry-browser-sdk-input)
* [`claude claude command sentry sentry-cloudflare-sdk [INPUT]`](#claude-claude-command-sentry-sentry-cloudflare-sdk-input)
* [`claude claude command sentry sentry-cocoa-sdk [INPUT]`](#claude-claude-command-sentry-sentry-cocoa-sdk-input)
* [`claude claude command sentry sentry-code-review [INPUT]`](#claude-claude-command-sentry-sentry-code-review-input)
* [`claude claude command sentry sentry-create-alert [INPUT]`](#claude-claude-command-sentry-sentry-create-alert-input)
* [`claude claude command sentry sentry-dotnet-sdk [INPUT]`](#claude-claude-command-sentry-sentry-dotnet-sdk-input)
* [`claude claude command sentry sentry-elixir-sdk [INPUT]`](#claude-claude-command-sentry-sentry-elixir-sdk-input)
* [`claude claude command sentry sentry-feature-setup [INPUT]`](#claude-claude-command-sentry-sentry-feature-setup-input)
* [`claude claude command sentry sentry-fix-issues [INPUT]`](#claude-claude-command-sentry-sentry-fix-issues-input)
* [`claude claude command sentry sentry-flutter-sdk [INPUT]`](#claude-claude-command-sentry-sentry-flutter-sdk-input)
* [`claude claude command sentry sentry-go-sdk [INPUT]`](#claude-claude-command-sentry-sentry-go-sdk-input)
* [`claude claude command sentry sentry-nestjs-sdk [INPUT]`](#claude-claude-command-sentry-sentry-nestjs-sdk-input)
* [`claude claude command sentry sentry-nextjs-sdk [INPUT]`](#claude-claude-command-sentry-sentry-nextjs-sdk-input)
* [`claude claude command sentry sentry-node-sdk [INPUT]`](#claude-claude-command-sentry-sentry-node-sdk-input)
* [`claude claude command sentry sentry-otel-exporter-setup [INPUT]`](#claude-claude-command-sentry-sentry-otel-exporter-setup-input)
* [`claude claude command sentry sentry-php-sdk [INPUT]`](#claude-claude-command-sentry-sentry-php-sdk-input)
* [`claude claude command sentry sentry-pr-code-review [INPUT]`](#claude-claude-command-sentry-sentry-pr-code-review-input)
* [`claude claude command sentry sentry-python-sdk [INPUT]`](#claude-claude-command-sentry-sentry-python-sdk-input)
* [`claude claude command sentry sentry-react-native-sdk [INPUT]`](#claude-claude-command-sentry-sentry-react-native-sdk-input)
* [`claude claude command sentry sentry-react-sdk [INPUT]`](#claude-claude-command-sentry-sentry-react-sdk-input)
* [`claude claude command sentry sentry-ruby-sdk [INPUT]`](#claude-claude-command-sentry-sentry-ruby-sdk-input)
* [`claude claude command sentry sentry-sdk-setup [INPUT]`](#claude-claude-command-sentry-sentry-sdk-setup-input)
* [`claude claude command sentry sentry-sdk-skill-creator [INPUT]`](#claude-claude-command-sentry-sentry-sdk-skill-creator-input)
* [`claude claude command sentry sentry-sdk-upgrade [INPUT]`](#claude-claude-command-sentry-sentry-sdk-upgrade-input)
* [`claude claude command sentry sentry-setup-ai-monitoring [INPUT]`](#claude-claude-command-sentry-sentry-setup-ai-monitoring-input)
* [`claude claude command sentry sentry-svelte-sdk [INPUT]`](#claude-claude-command-sentry-sentry-svelte-sdk-input)
* [`claude claude command sentry sentry-workflow [INPUT]`](#claude-claude-command-sentry-sentry-workflow-input)
* [`claude claude command simplify [INPUT]`](#claude-claude-command-simplify-input)
* [`claude claude command ssh-remote-server ssh-remote-server [INPUT]`](#claude-claude-command-ssh-remote-server-ssh-remote-server-input)
* [`claude claude command team-onboarding [INPUT]`](#claude-claude-command-team-onboarding-input)
* [`claude claude command terminal-recorder terminal-recorder [INPUT]`](#claude-claude-command-terminal-recorder-terminal-recorder-input)
* [`claude claude command trello-qa-triage analyze-serenity-report [INPUT]`](#claude-claude-command-trello-qa-triage-analyze-serenity-report-input)
* [`claude claude command trello-qa-triage investigate [INPUT]`](#claude-claude-command-trello-qa-triage-investigate-input)
* [`claude claude command update-config [INPUT]`](#claude-claude-command-update-config-input)
* [`claude claude command usage [INPUT]`](#claude-claude-command-usage-input)
* [`claude claude command verify [INPUT]`](#claude-claude-command-verify-input)
* [`claude claude list`](#claude-claude-list)
* [`claude claude list agents`](#claude-claude-list-agents)
* [`claude claude list mcp-servers`](#claude-claude-list-mcp-servers)
* [`claude claude list tools`](#claude-claude-list-tools)
* [`claude claude prompt`](#claude-claude-prompt)
* [`claude claude prompt add [NAME] [BODY]`](#claude-claude-prompt-add-name-body)
* [`claude claude prompt delete NAME`](#claude-claude-prompt-delete-name)
* [`claude claude prompt edit [NAME] [BODY]`](#claude-claude-prompt-edit-name-body)
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
* [`claude claude skill api extract-api [INPUT]`](#claude-claude-skill-api-extract-api-input)
* [`claude claude skill ax-agent [INPUT]`](#claude-claude-skill-ax-agent-input)
* [`claude claude skill ax-agent-memory-skills [INPUT]`](#claude-claude-skill-ax-agent-memory-skills-input)
* [`claude claude skill ax-agent-observability [INPUT]`](#claude-claude-skill-ax-agent-observability-input)
* [`claude claude skill ax-agent-optimize [INPUT]`](#claude-claude-skill-ax-agent-optimize-input)
* [`claude claude skill ax-agent-rlm [INPUT]`](#claude-claude-skill-ax-agent-rlm-input)
* [`claude claude skill ax-ai [INPUT]`](#claude-claude-skill-ax-ai-input)
* [`claude claude skill ax-audio [INPUT]`](#claude-claude-skill-ax-audio-input)
* [`claude claude skill ax-flow [INPUT]`](#claude-claude-skill-ax-flow-input)
* [`claude claude skill ax-gen [INPUT]`](#claude-claude-skill-ax-gen-input)
* [`claude claude skill ax-gepa [INPUT]`](#claude-claude-skill-ax-gepa-input)
* [`claude claude skill ax-llm [INPUT]`](#claude-claude-skill-ax-llm-input)
* [`claude claude skill ax-refine [INPUT]`](#claude-claude-skill-ax-refine-input)
* [`claude claude skill ax-signature [INPUT]`](#claude-claude-skill-ax-signature-input)
* [`claude claude skill batch [INPUT]`](#claude-claude-skill-batch-input)
* [`claude claude skill browse-seeking admin-portal [INPUT]`](#claude-claude-skill-browse-seeking-admin-portal-input)
* [`claude claude skill browse-seeking webapp [INPUT]`](#claude-claude-skill-browse-seeking-webapp-input)
* [`claude claude skill browse-seeking webapp-mobile [INPUT]`](#claude-claude-skill-browse-seeking-webapp-mobile-input)
* [`claude claude skill claude-api [INPUT]`](#claude-claude-skill-claude-api-input)
* [`claude claude skill claude-md-management claude-md-improver [INPUT]`](#claude-claude-skill-claude-md-management-claude-md-improver-input)
* [`claude claude skill code-refactoring refactoring [INPUT]`](#claude-claude-skill-code-refactoring-refactoring-input)
* [`claude claude skill code-review [INPUT]`](#claude-claude-skill-code-review-input)
* [`claude claude skill codex adversarial-review [INPUT]`](#claude-claude-skill-codex-adversarial-review-input)
* [`claude claude skill codex cancel [INPUT]`](#claude-claude-skill-codex-cancel-input)
* [`claude claude skill codex result [INPUT]`](#claude-claude-skill-codex-result-input)
* [`claude claude skill codex review [INPUT]`](#claude-claude-skill-codex-review-input)
* [`claude claude skill codex status [INPUT]`](#claude-claude-skill-codex-status-input)
* [`claude claude skill dataviz [INPUT]`](#claude-claude-skill-dataviz-input)
* [`claude claude skill debug [INPUT]`](#claude-claude-skill-debug-input)
* [`claude claude skill deep-research [INPUT]`](#claude-claude-skill-deep-research-input)
* [`claude claude skill design-patterns design-patterns [INPUT]`](#claude-claude-skill-design-patterns-design-patterns-input)
* [`claude claude skill design-sync [INPUT]`](#claude-claude-skill-design-sync-input)
* [`claude claude skill fewer-permission-prompts [INPUT]`](#claude-claude-skill-fewer-permission-prompts-input)
* [`claude claude skill figma figma-code-connect [INPUT]`](#claude-claude-skill-figma-figma-code-connect-input)
* [`claude claude skill figma figma-create-new-file [INPUT]`](#claude-claude-skill-figma-figma-create-new-file-input)
* [`claude claude skill figma figma-generate-design [INPUT]`](#claude-claude-skill-figma-figma-generate-design-input)
* [`claude claude skill figma figma-generate-diagram [INPUT]`](#claude-claude-skill-figma-figma-generate-diagram-input)
* [`claude claude skill figma figma-generate-library [INPUT]`](#claude-claude-skill-figma-figma-generate-library-input)
* [`claude claude skill figma figma-implement-motion [INPUT]`](#claude-claude-skill-figma-figma-implement-motion-input)
* [`claude claude skill figma figma-swiftui [INPUT]`](#claude-claude-skill-figma-figma-swiftui-input)
* [`claude claude skill figma figma-use [INPUT]`](#claude-claude-skill-figma-figma-use-input)
* [`claude claude skill figma figma-use-figjam [INPUT]`](#claude-claude-skill-figma-figma-use-figjam-input)
* [`claude claude skill figma figma-use-motion [INPUT]`](#claude-claude-skill-figma-figma-use-motion-input)
* [`claude claude skill figma figma-use-slides [INPUT]`](#claude-claude-skill-figma-figma-use-slides-input)
* [`claude claude skill frontend-design frontend-design [INPUT]`](#claude-claude-skill-frontend-design-frontend-design-input)
* [`claude claude skill loop [INPUT]`](#claude-claude-skill-loop-input)
* [`claude claude skill n8n-mcp-skills n8n-code-javascript [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-code-javascript-input)
* [`claude claude skill n8n-mcp-skills n8n-code-python [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-code-python-input)
* [`claude claude skill n8n-mcp-skills n8n-expression-syntax [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-expression-syntax-input)
* [`claude claude skill n8n-mcp-skills n8n-mcp-tools-expert [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-mcp-tools-expert-input)
* [`claude claude skill n8n-mcp-skills n8n-node-configuration [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-node-configuration-input)
* [`claude claude skill n8n-mcp-skills n8n-validation-expert [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-validation-expert-input)
* [`claude claude skill n8n-mcp-skills n8n-workflow-patterns [INPUT]`](#claude-claude-skill-n8n-mcp-skills-n8n-workflow-patterns-input)
* [`claude claude skill plugin-dev agent-development [INPUT]`](#claude-claude-skill-plugin-dev-agent-development-input)
* [`claude claude skill plugin-dev command-development [INPUT]`](#claude-claude-skill-plugin-dev-command-development-input)
* [`claude claude skill plugin-dev hook-development [INPUT]`](#claude-claude-skill-plugin-dev-hook-development-input)
* [`claude claude skill plugin-dev mcp-integration [INPUT]`](#claude-claude-skill-plugin-dev-mcp-integration-input)
* [`claude claude skill plugin-dev plugin-settings [INPUT]`](#claude-claude-skill-plugin-dev-plugin-settings-input)
* [`claude claude skill plugin-dev plugin-structure [INPUT]`](#claude-claude-skill-plugin-dev-plugin-structure-input)
* [`claude claude skill plugin-dev skill-development [INPUT]`](#claude-claude-skill-plugin-dev-skill-development-input)
* [`claude claude skill prompt-engineering prompt-engineering [INPUT]`](#claude-claude-skill-prompt-engineering-prompt-engineering-input)
* [`claude claude skill reflex-workflows jira-intake-analyzer [INPUT]`](#claude-claude-skill-reflex-workflows-jira-intake-analyzer-input)
* [`claude claude skill reflex-workflows jira-plan-implementer [INPUT]`](#claude-claude-skill-reflex-workflows-jira-plan-implementer-input)
* [`claude claude skill reflex-workflows jira-plan-writer [INPUT]`](#claude-claude-skill-reflex-workflows-jira-plan-writer-input)
* [`claude claude skill remotion-best-practices [INPUT]`](#claude-claude-skill-remotion-best-practices-input)
* [`claude claude skill run NAME [INPUT]`](#claude-claude-skill-run-name-input)
* [`claude claude skill run-skill-generator [INPUT]`](#claude-claude-skill-run-skill-generator-input)
* [`claude claude skill sentry sentry-android-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-android-sdk-input)
* [`claude claude skill sentry sentry-browser-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-browser-sdk-input)
* [`claude claude skill sentry sentry-cloudflare-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-cloudflare-sdk-input)
* [`claude claude skill sentry sentry-cocoa-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-cocoa-sdk-input)
* [`claude claude skill sentry sentry-code-review [INPUT]`](#claude-claude-skill-sentry-sentry-code-review-input)
* [`claude claude skill sentry sentry-create-alert [INPUT]`](#claude-claude-skill-sentry-sentry-create-alert-input)
* [`claude claude skill sentry sentry-dotnet-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-dotnet-sdk-input)
* [`claude claude skill sentry sentry-elixir-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-elixir-sdk-input)
* [`claude claude skill sentry sentry-feature-setup [INPUT]`](#claude-claude-skill-sentry-sentry-feature-setup-input)
* [`claude claude skill sentry sentry-fix-issues [INPUT]`](#claude-claude-skill-sentry-sentry-fix-issues-input)
* [`claude claude skill sentry sentry-flutter-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-flutter-sdk-input)
* [`claude claude skill sentry sentry-go-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-go-sdk-input)
* [`claude claude skill sentry sentry-nestjs-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-nestjs-sdk-input)
* [`claude claude skill sentry sentry-nextjs-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-nextjs-sdk-input)
* [`claude claude skill sentry sentry-node-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-node-sdk-input)
* [`claude claude skill sentry sentry-otel-exporter-setup [INPUT]`](#claude-claude-skill-sentry-sentry-otel-exporter-setup-input)
* [`claude claude skill sentry sentry-php-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-php-sdk-input)
* [`claude claude skill sentry sentry-pr-code-review [INPUT]`](#claude-claude-skill-sentry-sentry-pr-code-review-input)
* [`claude claude skill sentry sentry-python-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-python-sdk-input)
* [`claude claude skill sentry sentry-react-native-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-react-native-sdk-input)
* [`claude claude skill sentry sentry-react-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-react-sdk-input)
* [`claude claude skill sentry sentry-ruby-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-ruby-sdk-input)
* [`claude claude skill sentry sentry-sdk-setup [INPUT]`](#claude-claude-skill-sentry-sentry-sdk-setup-input)
* [`claude claude skill sentry sentry-sdk-skill-creator [INPUT]`](#claude-claude-skill-sentry-sentry-sdk-skill-creator-input)
* [`claude claude skill sentry sentry-sdk-upgrade [INPUT]`](#claude-claude-skill-sentry-sentry-sdk-upgrade-input)
* [`claude claude skill sentry sentry-setup-ai-monitoring [INPUT]`](#claude-claude-skill-sentry-sentry-setup-ai-monitoring-input)
* [`claude claude skill sentry sentry-svelte-sdk [INPUT]`](#claude-claude-skill-sentry-sentry-svelte-sdk-input)
* [`claude claude skill sentry sentry-workflow [INPUT]`](#claude-claude-skill-sentry-sentry-workflow-input)
* [`claude claude skill simplify [INPUT]`](#claude-claude-skill-simplify-input)
* [`claude claude skill ssh-remote-server ssh-remote-server [INPUT]`](#claude-claude-skill-ssh-remote-server-ssh-remote-server-input)
* [`claude claude skill terminal-recorder terminal-recorder [INPUT]`](#claude-claude-skill-terminal-recorder-terminal-recorder-input)
* [`claude claude skill trello-qa-triage analyze-serenity-report [INPUT]`](#claude-claude-skill-trello-qa-triage-analyze-serenity-report-input)
* [`claude claude skill update-config [INPUT]`](#claude-claude-skill-update-config-input)
* [`claude claude skill verify [INPUT]`](#claude-claude-skill-verify-input)
* [`claude claude workflow`](#claude-claude-workflow)
* [`claude claude workflow run NAME [INPUT]`](#claude-claude-workflow-run-name-input)
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

_See code: [src/commands/claude/index.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/index.ts)_

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

_See code: [src/commands/claude/ask.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/ask.ts)_

## `claude claude auth add`

Add Claude Agent SDK authentication

```
USAGE
  $ claude claude auth add [--json] [-p <value>] [-k <value>] [-u <value>] [--opus <value>] [--sonnet <value>]
    [--haiku <value>]

FLAGS
  -k, --apiKey=<value>   Anthropic API key
  -p, --profile=<value>  Profile name
  -u, --apiUrl=<value>   Anthropic API base URL (blank for default)
      --haiku=<value>    Haiku model ID override
      --opus=<value>     Opus model ID override
      --sonnet=<value>   Sonnet model ID override

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
  $ claude claude auth update [--json] [-p <value>] [-k <value>] [-u <value>] [--opus <value>] [--sonnet <value>]
    [--haiku <value>]

FLAGS
  -k, --apiKey=<value>   Anthropic API key
  -p, --profile=<value>  Profile name
  -u, --apiUrl=<value>   Anthropic API base URL (blank for default)
      --haiku=<value>    Haiku model ID override
      --opus=<value>     Opus model ID override
      --sonnet=<value>   Sonnet model ID override

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Update Claude Agent SDK authentication

EXAMPLES
  $ claude claude auth update

  $ claude claude auth update -p test
```

_See code: [src/commands/claude/auth/update.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/auth/update.ts)_

## `claude claude command agents [INPUT]`

(removed) Ask Claude to create/manage subagents, or edit .claude/agents/

```
USAGE
  $ claude claude command agents [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  (removed) Ask Claude to create/manage subagents, or edit .claude/agents/
```

## `claude claude command api extract-api [INPUT]`

This skill should be used when the user asks to "extract API from", "import API from", "add commands from this repo", "register API from docs", "convert docs to CLI commands", "import Postman collection", or provides a GitHub repository URL, a documentation site URL, a Postman collection file/URL, or a local API documentation file and wants it imported as sdkck CLI commands.

```
USAGE
  $ claude claude command api extract-api [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <github-url|docs-url|file-path> [--name <name>]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "extract API from", "import API from", "add commands from this repo",
  "register API from docs", "convert docs to CLI commands", "import Postman collection", or provides a GitHub repository
  URL, a documentation site URL, a Postman collection file/URL, or a local API documentation file and wants it imported
  as sdkck CLI commands.
```

## `claude claude command ax-agent [INPUT]`

This skill helps an LLM generate correct core AxAgent code using @ax-llm/ax. Use when the user asks about agent(), child agents, namespaced functions, discovery mode, clarification, bubbleErrors, host-side final/clarification protocol, or ordinary agent runtime behavior. For RLM/code-runtime work use ax-agent-rlm; for callbacks and telemetry use ax-agent-observability; for recall/memory/skill loading use ax-agent-memory-skills; for agent.optimize(...) use ax-agent-optimize.

```
USAGE
  $ claude claude command ax-agent [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct core AxAgent code using @ax-llm/ax. Use when the user asks about agent(),
  child agents, namespaced functions, discovery mode, clarification, bubbleErrors, host-side final/clarification
  protocol, or ordinary agent runtime behavior. For RLM/code-runtime work use ax-agent-rlm; for callbacks and telemetry
  use ax-agent-observability; for recall/memory/skill loading use ax-agent-memory-skills; for agent.optimize(...) use
  ax-agent-optimize.
```

## `claude claude command ax-agent-memory-skills [INPUT]`

This skill helps an LLM generate correct AxAgent memory retrieval, context-map, and dynamic skill-loading code using @ax-llm/ax. Use when the user asks about contextMap, AxAgentContextMap, onMemoriesSearch, recall(...), inputs.memories, onLoadedMemories, onUsedMemories, onSkillsSearch, discover({ skills }), onLoadedSkills, onUsedSkills, preloaded skills, loaded memory/skill IDs, or carrying memories across forward() calls.

```
USAGE
  $ claude claude command ax-agent-memory-skills [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent memory retrieval, context-map, and dynamic skill-loading code using
  @ax-llm/ax. Use when the user asks about contextMap, AxAgentContextMap, onMemoriesSearch, recall(...),
  inputs.memories, onLoadedMemories, onUsedMemories, onSkillsSearch, discover({ skills }), onLoadedSkills, onUsedSkills,
  preloaded skills, loaded memory/skill IDs, or carrying memories across forward() calls.
```

## `claude claude command ax-agent-observability [INPUT]`

This skill helps an LLM generate correct AxAgent observability code using @ax-llm/ax. Use when the user asks about actorTurnCallback, onContextEvent, agentStatusCallback, onFunctionCall, reportSuccess, reportFailure, getChatLog(), getUsage(), resetUsage(), debug traces, progress updates, or telemetry for AxAgent runs.

```
USAGE
  $ claude claude command ax-agent-observability [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent observability code using @ax-llm/ax. Use when the user asks about
  actorTurnCallback, onContextEvent, agentStatusCallback, onFunctionCall, reportSuccess, reportFailure, getChatLog(),
  getUsage(), resetUsage(), debug traces, progress updates, or telemetry for AxAgent runs.
```

## `claude claude command ax-agent-optimize [INPUT]`

This skill helps an LLM generate correct AxAgent tuning and evaluation code using @ax-llm/ax. Use when the user asks about agent.optimize(...), judgeOptions, eval datasets, optimization targets, saved optimizedProgram artifacts, or agent optimization guidance.

```
USAGE
  $ claude claude command ax-agent-optimize [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent tuning and evaluation code using @ax-llm/ax. Use when the user asks
  about agent.optimize(...), judgeOptions, eval datasets, optimization targets, saved optimizedProgram artifacts, or
  agent optimization guidance.
```

## `claude claude command ax-agent-rlm [INPUT]`

This skill helps an LLM generate correct AxAgent RLM/runtime code using @ax-llm/ax. Use when the user asks about RLM code execution, AxJSRuntime, contextFields, contextPolicy, liveRuntimeState, promptLevel, stage prompt controls, executorModelPolicy, maxRuntimeChars, agent.test(...), llmQuery(...), recursionOptions, or long-running agent runtime behavior.

```
USAGE
  $ claude claude command ax-agent-rlm [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent RLM/runtime code using @ax-llm/ax. Use when the user asks about RLM
  code execution, AxJSRuntime, contextFields, contextPolicy, liveRuntimeState, promptLevel, stage prompt controls,
  executorModelPolicy, maxRuntimeChars, agent.test(...), llmQuery(...), recursionOptions, or long-running agent runtime
  behavior.
```

## `claude claude command ax-ai [INPUT]`

This skill helps an LLM generate correct AI provider setup and configuration code using @ax-llm/ax. Use when the user asks about ai(), providers, models, presets, embeddings, batch audio with ai.transcribe() or ai.speak(), extended thinking, context caching, or mentions OpenAI/Anthropic/Google/Azure/DeepSeek/Mistral/Cohere/Reka/Grok with @ax-llm/ax.

```
USAGE
  $ claude claude command ax-ai [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AI provider setup and configuration code using @ax-llm/ax. Use when the user
  asks about ai(), providers, models, presets, embeddings, batch audio with ai.transcribe() or ai.speak(), extended
  thinking, context caching, or mentions OpenAI/Anthropic/Google/Azure/DeepSeek/Mistral/Cohere/Reka/Grok with
  @ax-llm/ax.
```

## `claude claude command ax-audio [INPUT]`

This skill helps an LLM generate correct audio code with @ax-llm/ax. Use when the user asks about ai.transcribe(), ai.speak(), signature audio inputs or outputs, agent audio behavior, .chat() conversational audio, OpenAI audio or realtime models, Gemini Live native audio, Grok Voice Agent models, voices, formats, transcripts, or how audio fits with structured outputs.

```
USAGE
  $ claude claude command ax-audio [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct audio code with @ax-llm/ax. Use when the user asks about ai.transcribe(),
  ai.speak(), signature audio inputs or outputs, agent audio behavior, .chat() conversational audio, OpenAI audio or
  realtime models, Gemini Live native audio, Grok Voice Agent models, voices, formats, transcripts, or how audio fits
  with structured outputs.
```

## `claude claude command ax-flow [INPUT]`

This skill helps an LLM generate correct AxFlow workflow code using @ax-llm/ax. Use when the user asks about flow(), AxFlow, workflow orchestration, parallel execution, DAG workflows, conditional routing, map/reduce patterns, or multi-node AI pipelines.

```
USAGE
  $ claude claude command ax-flow [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxFlow workflow code using @ax-llm/ax. Use when the user asks about flow(),
  AxFlow, workflow orchestration, parallel execution, DAG workflows, conditional routing, map/reduce patterns, or
  multi-node AI pipelines.
```

## `claude claude command ax-gen [INPUT]`

This skill helps an LLM generate correct AxGen code using @ax-llm/ax. Use when the user asks about ax(), AxGen, generators, forward(), streamingForward(), validation, assertions, streaming assertions, field processors, step hooks, self-tuning, or structured outputs.

```
USAGE
  $ claude claude command ax-gen [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxGen code using @ax-llm/ax. Use when the user asks about ax(), AxGen,
  generators, forward(), streamingForward(), validation, assertions, streaming assertions, field processors, step hooks,
  self-tuning, or structured outputs.
```

## `claude claude command ax-gepa [INPUT]`

This skill helps an LLM generate correct AxGEPA optimization code using @ax-llm/ax. Use when the user asks about AxGEPA, GEPA, Pareto optimization, multi-objective prompt tuning, reflective prompt evolution, validationExamples, maxMetricCalls, or optimizing a generator, flow, or agent tree.

```
USAGE
  $ claude claude command ax-gepa [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxGEPA optimization code using @ax-llm/ax. Use when the user asks about
  AxGEPA, GEPA, Pareto optimization, multi-objective prompt tuning, reflective prompt evolution, validationExamples,
  maxMetricCalls, or optimizing a generator, flow, or agent tree.
```

## `claude claude command ax-llm [INPUT]`

This skill helps with using the @ax-llm/ax TypeScript library for building LLM applications. Use when the user asks about ax(), ai(), f(), s(), agent(), flow(), AxGen, AxAgent, AxFlow, signatures, streaming, or mentions @ax-llm/ax.

```
USAGE
  $ claude claude command ax-llm [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps with using the @ax-llm/ax TypeScript library for building LLM applications. Use when the user asks
  about ax(), ai(), f(), s(), agent(), flow(), AxGen, AxAgent, AxFlow, signatures, streaming, or mentions @ax-llm/ax.
```

## `claude claude command ax-refine [INPUT]`

Use this skill when writing or reviewing Ax bestOfN/refine code, reward functions, thresholds, native sample selection, serial attempts, generated advice, and attempt diagnostics.

```
USAGE
  $ claude claude command ax-refine [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill when writing or reviewing Ax bestOfN/refine code, reward functions, thresholds, native sample
  selection, serial attempts, generated advice, and attempt diagnostics.
```

## `claude claude command ax-signature [INPUT]`

This skill helps an LLM generate correct DSPy signature code using @ax-llm/ax. Use when the user asks about signatures, s(), f(), field types, string syntax, fluent builder API, validation constraints, or type-safe inputs/outputs.

```
USAGE
  $ claude claude command ax-signature [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct DSPy signature code using @ax-llm/ax. Use when the user asks about
  signatures, s(), f(), field types, string syntax, fluent builder API, validation constraints, or type-safe
  inputs/outputs.
```

## `claude claude command batch [INPUT]`

Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.

```
USAGE
  $ claude claude command batch [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <instruction>

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each
  open a PR.
```

## `claude claude command browse-seeking admin-portal [INPUT]`

This skill should be used when verifying admin portal pages or business logic changes at https://admin-{test_env}.seeking.com. Use when a peer-review verification step has strategy "admin_portal", when navigating the Seeking admin dashboard to inspect member profiles, manage settings, apply moderation actions, or confirm backend changes are reflected in the admin UI.

```
USAGE
  $ claude claude command browse-seeking admin-portal [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when verifying admin portal pages or business logic changes at
  https://admin-{test_env}.seeking.com. Use when a peer-review verification step has strategy "admin_portal", when
  navigating the Seeking admin dashboard to inspect member profiles, manage settings, apply moderation actions, or
  confirm backend changes are reflected in the admin UI.
```

## `claude claude command browse-seeking webapp [INPUT]`

This skill should be used when verifying member-facing webapp features or user flows at https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp", when testing registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend feature visible to members.

```
USAGE
  $ claude claude command browse-seeking webapp [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when verifying member-facing webapp features or user flows at
  https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp", when testing
  registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend feature
  visible to members.
```

## `claude claude command browse-seeking webapp-mobile [INPUT]`

This skill should be used when verifying member-facing webapp features or user flows on mobile view (iPhone 15) at https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp-mobile", when testing registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend feature visible to members on mobile devices.

```
USAGE
  $ claude claude command browse-seeking webapp-mobile [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when verifying member-facing webapp features or user flows on mobile view (iPhone 15) at
  https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp-mobile", when
  testing registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend
  feature visible to members on mobile devices.
```

## `claude claude command claude-api [INPUT]`

Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token counting, model migration.

```
USAGE
  $ claude claude command claude-api [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching,
  token counting, model migration.
  TRIGGER — read BEFORE opening the target file; don't skip because it "looks like a one-liner" — whenever: the prompt
  names Claude/Anthropic in any form (Claude, Anthropic, Fable, Opus, Sonnet, Haiku, `anthropic`, `@anthropic-ai`,
  `claude-*`, `us.anthropic.*`, `[1m]`); the user asks about an LLM (pricing/model choice/limits/caching) — never answer
  from memory; OR the task is LLM-shaped with provider unstated
  (agent/MCP/tool-definition/multi-agent/RAG/LLM-judge/computer-use;
  generate/summarize/extract/classify/rewrite/converse over NL; debugging refusals/cutoffs/streaming/tool-calls/tokens).
  SKIP only when another provider is being worked on (overrides all triggers):
  OpenAI/GPT/Gemini/Llama/Mistral/Cohere/Ollama named in the query; OR `grep -rE
  'openai|langchain_openai|google.generativeai|genai|mistralai|cohere|ollama'` over the project hits (run this grep
  FIRST if no provider named — don't Read the file).
```

## `claude claude command claude-md-management claude-md-improver [INPUT]`

Audit and improve CLAUDE.md files in repositories. Use when user asks to check, audit, update, improve, or fix CLAUDE.md files. Scans for all CLAUDE.md files, evaluates quality against templates, outputs quality report, then makes targeted updates. Also use when the user mentions "CLAUDE.md maintenance" or "project memory optimization".

```
USAGE
  $ claude claude command claude-md-management claude-md-improver [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Audit and improve CLAUDE.md files in repositories. Use when user asks to check, audit, update, improve, or fix
  CLAUDE.md files. Scans for all CLAUDE.md files, evaluates quality against templates, outputs quality report, then
  makes targeted updates. Also use when the user mentions "CLAUDE.md maintenance" or "project memory optimization".
```

## `claude claude command claude-md-management revise-claude-md [INPUT]`

Update CLAUDE.md with learnings from this session

```
USAGE
  $ claude claude command claude-md-management revise-claude-md [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Update CLAUDE.md with learnings from this session
```

## `claude claude command clear [INPUT]`

Start a new session with empty context; previous session stays on disk (resumable with /resume)

```
USAGE
  $ claude claude command clear [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [name]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Start a new session with empty context; previous session stays on disk (resumable with /resume)
```

## `claude claude command code-refactoring refactoring [INPUT]`

This skill should be used when the user asks to "refactor this code", "identify code smells", "clean up this class", "fix this design", "this method is too long", "reduce duplication", "simplify this conditional", "improve code quality", "detect code smell", "what refactoring should I apply", "how do I fix feature envy", "how do I fix large class", or asks about any named code smell or refactoring technique from Fowler or Kerievsky.

```
USAGE
  $ claude claude command code-refactoring refactoring [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "refactor this code", "identify code smells", "clean up this class",
  "fix this design", "this method is too long", "reduce duplication", "simplify this conditional", "improve code
  quality", "detect code smell", "what refactoring should I apply", "how do I fix feature envy", "how do I fix large
  class", or asks about any named code smell or refactoring technique from Fowler or Kerievsky.
```

## `claude claude command code-review [INPUT]`

Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings). Pass --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.

```
USAGE
  $ claude claude command code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [low|medium|high|xhigh|max] [--fix] [--comment] [<target>]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level
  (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings). Pass
  --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.
```

## `claude claude command code-review code-review [INPUT]`

Code review a pull request

```
USAGE
  $ claude claude command code-review code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Code review a pull request
```

## `claude claude command codex adversarial-review [INPUT]`

Run a Codex review that challenges the implementation approach and design choices

```
USAGE
  $ claude claude command codex adversarial-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [--wait|--background] [--base <ref>] [--scope auto|working-tree|branch] [focus ...]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a Codex review that challenges the implementation approach and design choices
```

## `claude claude command codex cancel [INPUT]`

Cancel an active background Codex job in this repository

```
USAGE
  $ claude claude command codex cancel [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [job-id]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Cancel an active background Codex job in this repository
```

## `claude claude command codex rescue [INPUT]`

Delegate investigation, an explicit fix request, or follow-up rescue work to the Codex rescue subagent

```
USAGE
  $ claude claude command codex rescue [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [--background|--wait] [--resume|--fresh] [--model <model|spark>] [--effort
              <none|minimal|low|medium|high|xhigh>] [what Codex should investigate, solve, or continue]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Delegate investigation, an explicit fix request, or follow-up rescue work to the Codex rescue subagent
```

## `claude claude command codex result [INPUT]`

Show the stored final output for a finished Codex job in this repository

```
USAGE
  $ claude claude command codex result [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [job-id]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Show the stored final output for a finished Codex job in this repository
```

## `claude claude command codex review [INPUT]`

Run a Codex code review against local git state

```
USAGE
  $ claude claude command codex review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [--wait|--background] [--base <ref>] [--scope auto|working-tree|branch]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a Codex code review against local git state
```

## `claude claude command codex setup [INPUT]`

Check whether the local Codex CLI is ready and optionally toggle the stop-time review gate

```
USAGE
  $ claude claude command codex setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [--enable-review-gate|--disable-review-gate]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Check whether the local Codex CLI is ready and optionally toggle the stop-time review gate
```

## `claude claude command codex status [INPUT]`

Show active and recent Codex jobs for this repository, including review-gate status

```
USAGE
  $ claude claude command codex status [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [job-id] [--wait] [--timeout-ms <ms>] [--all]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Show active and recent Codex jobs for this repository, including review-gate status
```

## `claude claude command commit-commands clean_gone [INPUT]`

Cleans up all git branches marked as [gone] (branches that have been deleted on the remote but still exist locally), including removing associated worktrees.

```
USAGE
  $ claude claude command commit-commands clean_gone [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Cleans up all git branches marked as [gone] (branches that have been deleted on the remote but still exist locally),
  including removing associated worktrees.
```

## `claude claude command commit-commands commit [INPUT]`

Create a git commit

```
USAGE
  $ claude claude command commit-commands commit [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Create a git commit
```

## `claude claude command commit-commands commit-push-pr [INPUT]`

Commit, push, and open a PR

```
USAGE
  $ claude claude command commit-commands commit-push-pr [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Commit, push, and open a PR
```

## `claude claude command compact [INPUT]`

Free up context by summarizing the conversation so far

```
USAGE
  $ claude claude command compact [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <optional custom summarization instructions>

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Free up context by summarizing the conversation so far
```

## `claude claude command config [INPUT]`

Set a setting by key

```
USAGE
  $ claude claude command config [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  key=value

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Set a setting by key
```

## `claude claude command context [INPUT]`

Show current context usage

```
USAGE
  $ claude claude command context [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Show current context usage
```

## `claude claude command dataviz [INPUT]`

Use this skill whenever you are about to create ANY chart, graph, plot, dashboard, or data visualization, in ANY output medium — an HTML or React artifact, inline SVG, plotting code in any library (matplotlib, plotly, d3, Recharts, …), an image/PNG you will render and upload, or a chart shared into Slack. Read it BEFORE writing the first line of chart code, choosing chart colors, building a stat tile / meter / KPI row, or laying out a dashboard. Produces visualizations that read as one system — elegant, accessible, consistent in light and dark — using a brand-neutral placeholder palette you swap for your own. Teaches a design-system-agnostic method: a form heuristic, a color formula with a runnable validator, mark specs, and interaction rules. A validated default palette is documented in `references/palette.md` — swap that file's values for your brand's. Triggers on: "chart", "graph", "plot", "data viz", "visualization", "dashboard", "analytics", "visualize data", "categorical colors", "sequential / diverging palette", "stat tile", "sparkline", "heatmap", "legend", "axis", "tooltip", "chart colors", "color by series".

```
USAGE
  $ claude claude command dataviz [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill whenever you are about to create ANY chart, graph, plot, dashboard, or data visualization, in ANY
  output medium — an HTML or React artifact, inline SVG, plotting code in any library (matplotlib, plotly, d3, Recharts,
  …), an image/PNG you will render and upload, or a chart shared into Slack. Read it BEFORE writing the first line of
  chart code, choosing chart colors, building a stat tile / meter / KPI row, or laying out a dashboard. Produces
  visualizations that read as one system — elegant, accessible, consistent in light and dark — using a brand-neutral
  placeholder palette you swap for your own. Teaches a design-system-agnostic method: a form heuristic, a color formula
  with a runnable validator, mark specs, and interaction rules. A validated default palette is documented in
  `references/palette.md` — swap that file's values for your brand's. Triggers on: "chart", "graph", "plot", "data viz",
  "visualization", "dashboard", "analytics", "visualize data", "categorical colors", "sequential / diverging palette",
  "stat tile", "sparkline", "heatmap", "legend", "axis", "tooltip", "chart colors", "color by series".
```

## `claude claude command debug [INPUT]`

Enable debug logging for this session and help diagnose issues

```
USAGE
  $ claude claude command debug [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [issue description]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Enable debug logging for this session and help diagnose issues
```

## `claude claude command deep-research [INPUT]`

Deep research harness — fan-out web searches, fetch sources, adversarially verify claims, synthesize a cited report. (dynamic workflow)

```
USAGE
  $ claude claude command deep-research [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Deep research harness — fan-out web searches, fetch sources, adversarially verify claims, synthesize a cited report.
  (dynamic workflow)
```

## `claude claude command design [INPUT]`

Grant or revoke Claude agent access to your Design projects

```
USAGE
  $ claude claude command design [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  consent | revoke

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Grant or revoke Claude agent access to your Design projects
```

## `claude claude command design-patterns design-patterns [INPUT]`

This skill should be used when the user asks to "implement singleton", "apply observer pattern", "use factory method", "implement strategy pattern", "add decorator pattern", "which design pattern should I use", "how should I structure this code", "I need to decouple these classes", "refactor using a pattern", "which pattern fits this problem", "I have a telescoping constructor", "switch on type problem", "add behavior without subclassing", "need undo/redo", or mentions any GoF pattern by name. Covers all 22 GoF patterns across Creational, Structural, and Behavioral categories with guidance on when to apply — and when not to — each pattern.

```
USAGE
  $ claude claude command design-patterns design-patterns [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "implement singleton", "apply observer pattern", "use factory method",
  "implement strategy pattern", "add decorator pattern", "which design pattern should I use", "how should I structure
  this code", "I need to decouple these classes", "refactor using a pattern", "which pattern fits this problem", "I have
  a telescoping constructor", "switch on type problem", "add behavior without subclassing", "need undo/redo", or
  mentions any GoF pattern by name. Covers all 22 GoF patterns across Creational, Structural, and Behavioral categories
  with guidance on when to apply — and when not to — each pattern.
```

## `claude claude command design-sync [INPUT]`

Push a React design system to claude.ai/design. This runs a converter that bundles the real component code (from Storybook or a bare package) and uploads it. Use when the user runs /design-sync or says "sync my design system to Claude Design".

```
USAGE
  $ claude claude command design-sync [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [<project hint, e.g. "Acme DS">]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Push a React design system to claude.ai/design. This runs a converter that bundles the real component code (from
  Storybook or a bare package) and uploads it. Use when the user runs /design-sync or says "sync my design system to
  Claude Design".
```

## `claude claude command dev-coding-kit cloud-estimate [INPUT]`

Generate planning-grade, allocation-ready estimates for Jira tickets with human-only and AI-assisted time breakdowns in the Cloud

```
USAGE
  $ claude claude command dev-coding-kit cloud-estimate [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <jira-url | ticket-id>

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Generate planning-grade, allocation-ready estimates for Jira tickets with human-only and AI-assisted time breakdowns
  in the Cloud
```

## `claude claude command dev-coding-kit commit [INPUT]`

Generate a conventional commit message from a task file or staged changes and create the commit.

```
USAGE
  $ claude claude command dev-coding-kit commit [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [@tasks/<task-id>/task.md]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Generate a conventional commit message from a task file or staged changes and create the commit.
```

## `claude claude command dev-coding-kit estimate [INPUT]`

Generate planning-grade, allocation-ready estimates for Jira tickets with human-only and AI-assisted time breakdowns.

```
USAGE
  $ claude claude command dev-coding-kit estimate [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <jira-url | ticket-id> [--comment]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Generate planning-grade, allocation-ready estimates for Jira tickets with human-only and AI-assisted time breakdowns.
```

## `claude claude command dev-coding-kit implement [INPUT]`

Execute tasks from a task.md, review.md, or security.md file — implement, test, and record progress without committing.

```
USAGE
  $ claude claude command dev-coding-kit implement [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  @tasks/<task-id>/task.md [--only "1,3"] [--path "src/..."] [--full-test-suite]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Execute tasks from a task.md, review.md, or security.md file — implement, test, and record progress without
  committing.
```

## `claude claude command dev-coding-kit init-plan-context [INPUT]`

Generate or regenerate .claude/plan/context.md by analyzing the repository — stack-neutral, evidence-driven, autonomous. Detects stack/structure/tests, follows convention sources, gates conditional modules on existing rules/skills. Output is pure content (no comments/metadata). Writes a complete file even with zero answers; never blocks.

```
USAGE
  $ claude claude command dev-coding-kit init-plan-context [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [subdir]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Generate or regenerate .claude/plan/context.md by analyzing the repository — stack-neutral, evidence-driven,
  autonomous. Detects stack/structure/tests, follows convention sources, gates conditional modules on existing
  rules/skills. Output is pure content (no comments/metadata). Writes a complete file even with zero answers; never
  blocks.
```

## `claude claude command dev-coding-kit misc agents-bootstrap [INPUT]`

(dev-coding-kit) /agents-bootstrap — Project Agent Configuration Bootstrap

```
USAGE
  $ claude claude command dev-coding-kit misc agents-bootstrap [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  (dev-coding-kit) /agents-bootstrap — Project Agent Configuration Bootstrap
```

## `claude claude command dev-coding-kit misc generate-rules [INPUT]`

(dev-coding-kit) Universal Cursor Rules Generator

```
USAGE
  $ claude claude command dev-coding-kit misc generate-rules [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  (dev-coding-kit) Universal Cursor Rules Generator
```

## `claude claude command dev-coding-kit misc provision-rule [INPUT]`

(dev-coding-kit) Command: Provision Rule

```
USAGE
  $ claude claude command dev-coding-kit misc provision-rule [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  (dev-coding-kit) Command: Provision Rule
```

## `claude claude command dev-coding-kit plan [INPUT]`

Create or update an outcome-oriented task list from a Jira ticket, user story, or prompt — without executing any tasks.

```
USAGE
  $ claude claude command dev-coding-kit plan [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [jira-url | story | prompt]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Create or update an outcome-oriented task list from a Jira ticket, user story, or prompt — without executing any
  tasks.
```

## `claude claude command dev-coding-kit review [INPUT]`

Run a high-signal code review on staged changes, recent commits, or a specified path — auto-selects scope, runs automated checks, and writes a review.md task file.

```
USAGE
  $ claude claude command dev-coding-kit review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [path/to/review] [--no-security]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a high-signal code review on staged changes, recent commits, or a specified path — auto-selects scope, runs
  automated checks, and writes a review.md task file.
```

## `claude claude command feature-dev feature-dev [INPUT]`

Guided feature development with codebase understanding and architecture focus

```
USAGE
  $ claude claude command feature-dev feature-dev [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Optional feature description

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Guided feature development with codebase understanding and architecture focus
```

## `claude claude command fewer-permission-prompts [INPUT]`

Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritized allowlist to project .claude/settings.json to reduce permission prompts.

```
USAGE
  $ claude claude command fewer-permission-prompts [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritized allowlist to project
  .claude/settings.json to reduce permission prompts.
```

## `claude claude command figma figma-code-connect [INPUT]`

Creates and maintains Figma Code Connect template files that map Figma components to code snippets. Use when the user mentions Code Connect, Figma component mapping, design-to-code translation, or asks to create/update .figma.ts or .figma.js files.

```
USAGE
  $ claude claude command figma figma-code-connect [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Creates and maintains Figma Code Connect template files that map Figma components to code snippets. Use when the user
  mentions Code Connect, Figma component mapping, design-to-code translation, or asks to create/update .figma.ts or
  .figma.js files.
```

## `claude claude command figma figma-create-new-file [INPUT]`

**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `create_new_file` tool call. NEVER call `create_new_file` directly without loading this skill first. Trigger whenever the user wants a new blank Figma file — a new design, FigJam, or Slides file — or when you need a fresh file before calling `use_figma`. Usage — /figma-create-new-file [editorType] [fileName] (e.g. /figma-create-new-file figjam My Whiteboard, /figma-create-new-file slides Q3 Review)

```
USAGE
  $ claude claude command figma figma-create-new-file [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `create_new_file` tool call. NEVER call
  `create_new_file` directly without loading this skill first. Trigger whenever the user wants a new blank Figma file —
  a new design, FigJam, or Slides file — or when you need a fresh file before calling `use_figma`. Usage —
  /figma-create-new-file [editorType] [fileName] (e.g. /figma-create-new-file figjam My Whiteboard,
  /figma-create-new-file slides Q3 Review)
```

## `claude claude command figma figma-generate-design [INPUT]`

Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page and build it in Figma', 'create a screen', 'build a landing page in Figma', 'update the Figma screen to match code', 'convert this modal/dialog/drawer/panel to Figma'. This is the preferred workflow skill whenever the user wants to build or update a full page, modal, dialog, drawer, sidebar, panel, or any composed multi-section view in Figma from code or a description. Discovers design system components, variables, and styles from Code Connect files, existing screens, and library search, then imports them and assembles views incrementally section-by-section using design system tokens instead of hardcoded values.

```
USAGE
  $ claude claude command figma figma-generate-design [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section
  layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page
  and build it in Figma', 'create a screen', 'build a landing page in Figma', 'update the Figma screen to match code',
  'convert this modal/dialog/drawer/panel to Figma'. This is the preferred workflow skill whenever the user wants to
  build or update a full page, modal, dialog, drawer, sidebar, panel, or any composed multi-section view in Figma from
  code or a description. Discovers design system components, variables, and styles from Code Connect files, existing
  screens, and library search, then imports them and assembles views incrementally section-by-section using design
  system tokens instead of hardcoded values.
```

## `claude claude command figma figma-generate-diagram [INPUT]`

MANDATORY prerequisite — load this skill BEFORE every `generate_diagram` tool call. NEVER call `generate_diagram` directly without loading this skill first. Trigger whenever the user asks to create, generate, draw, render, sketch, or build a diagram — flowchart, architecture diagram, sequence diagram, ERD or entity-relationship diagram, state diagram or state machine, gantt chart, or timeline. Also trigger when the user mentions Mermaid syntax or wants a system architecture, decision tree, dependency graph, API call flow, auth handshake, schema, or pipeline visualized in FigJam. Routes to type-specific guidance, sets universal Mermaid constraints, and tells you when to use a different diagram type or skip the tool entirely (mindmaps, pie charts, class diagrams, etc.).

```
USAGE
  $ claude claude command figma figma-generate-diagram [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  MANDATORY prerequisite — load this skill BEFORE every `generate_diagram` tool call. NEVER call `generate_diagram`
  directly without loading this skill first. Trigger whenever the user asks to create, generate, draw, render, sketch,
  or build a diagram — flowchart, architecture diagram, sequence diagram, ERD or entity-relationship diagram, state
  diagram or state machine, gantt chart, or timeline. Also trigger when the user mentions Mermaid syntax or wants a
  system architecture, decision tree, dependency graph, API call flow, auth handshake, schema, or pipeline visualized in
  FigJam. Routes to type-specific guidance, sets universal Mermaid constraints, and tells you when to use a different
  diagram type or skip the tool entirely (mindmaps, pie charts, class diagrams, etc.).
```

## `claude claude command figma figma-generate-library [INPUT]`

Build or update a professional-grade design system in Figma from a codebase. Use when the user wants to create variables/tokens, build component libraries, create individual components with proper variant sets and variable bindings, set up theming (light/dark modes), document foundations, or reconcile gaps between code and Figma. Also use when the user asks to create or generate any component in Figma — even a single one — since components require proper variable foundations, variant states, and design token bindings to be production-quality. This skill teaches WHAT to build and in WHAT ORDER — it complements the `figma-use` skill which teaches HOW to call the Plugin API. Both skills should be loaded together.

```
USAGE
  $ claude claude command figma figma-generate-library [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Build or update a professional-grade design system in Figma from a codebase. Use when the user wants to create
  variables/tokens, build component libraries, create individual components with proper variant sets and variable
  bindings, set up theming (light/dark modes), document foundations, or reconcile gaps between code and Figma. Also use
  when the user asks to create or generate any component in Figma — even a single one — since components require proper
  variable foundations, variant states, and design token bindings to be production-quality. This skill teaches WHAT to
  build and in WHAT ORDER — it complements the `figma-use` skill which teaches HOW to call the Plugin API. Both skills
  should be loaded together.
```

## `claude claude command figma figma-implement-motion [INPUT]`

Translates Figma motion and animations into production-ready application code. Use when implementing animation/motion from a Figma design — user mentions "implement this motion", "add animation from Figma", "animate this component", provides a Figma URL whose node is animated, or when `get_design_context` returns motion data or instructs you to call `get_motion_context`.

```
USAGE
  $ claude claude command figma figma-implement-motion [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Translates Figma motion and animations into production-ready application code. Use when implementing animation/motion
  from a Figma design — user mentions "implement this motion", "add animation from Figma", "animate this component",
  provides a Figma URL whose node is animated, or when `get_design_context` returns motion data or instructs you to call
  `get_motion_context`.
```

## `claude claude command figma figma-swiftui [INPUT]`

SwiftUI ↔ Figma translation. Use whenever the user mentions Swift, SwiftUI, iOS, iPhone, or iPad — in EITHER direction — translating a Figma design into SwiftUI (design → code), or pushing SwiftUI views / screens / tokens back into a Figma file (code → design). Triggers on phrases like 'implement this Figma design in SwiftUI', 'build this screen in Swift', 'push this SwiftUI view to Figma', 'mirror my Swift code in a Figma file', or whenever a Figma URL appears alongside `.swift` files / an `.xcodeproj`. Routes to a direction-specific reference doc; loads alongside `figma-use` for the code → design path.

```
USAGE
  $ claude claude command figma figma-swiftui [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  SwiftUI ↔ Figma translation. Use whenever the user mentions Swift, SwiftUI, iOS, iPhone, or iPad — in EITHER direction
  — translating a Figma design into SwiftUI (design → code), or pushing SwiftUI views / screens / tokens back into a
  Figma file (code → design). Triggers on phrases like 'implement this Figma design in SwiftUI', 'build this screen in
  Swift', 'push this SwiftUI view to Figma', 'mirror my Swift code in a Figma file', or whenever a Figma URL appears
  alongside `.swift` files / an `.xcodeproj`. Routes to a direction-specific reference doc; loads alongside `figma-use`
  for the code → design path.
```

## `claude claude command figma figma-use [INPUT]`

**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically.

```
USAGE
  $ claude claude command figma figma-use [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma`
  directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the
  user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file
  context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout
  or fills, bind variables to properties, or inspect file structure programmatically.
```

## `claude claude command figma figma-use-figjam [INPUT]`

This skill helps agents use Figma's use_figma MCP tool in the FigJam context. Can be used alongside figma-use which has foundational context for using the use_figma tool.

```
USAGE
  $ claude claude command figma figma-use-figjam [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps agents use Figma's use_figma MCP tool in the FigJam context. Can be used alongside figma-use which
  has foundational context for using the use_figma tool.
```

## `claude claude command figma figma-use-motion [INPUT]`

Motion / animation context for the `use_figma` MCP tool — animating Figma nodes via manual keyframes, animation styles, easing, and timeline duration. Load alongside figma-use whenever a task involves adding, editing, or inspecting animation on a node.

```
USAGE
  $ claude claude command figma figma-use-motion [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Motion / animation context for the `use_figma` MCP tool — animating Figma nodes via manual keyframes, animation
  styles, easing, and timeline duration. Load alongside figma-use whenever a task involves adding, editing, or
  inspecting animation on a node.
```

## `claude claude command figma figma-use-slides [INPUT]`

This skill helps agents use Figma's use_figma MCP tool in the Slides context. Can be used alongside figma-use which has foundational context for using the use_figma tool.

```
USAGE
  $ claude claude command figma figma-use-slides [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps agents use Figma's use_figma MCP tool in the Slides context. Can be used alongside figma-use which
  has foundational context for using the use_figma tool.
```

## `claude claude command frontend-design frontend-design [INPUT]`

Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.

```
USAGE
  $ claude claude command frontend-design frontend-design [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with
  aesthetic direction, typography, and making choices that don't read as templated defaults.
```

## `claude claude command goal [INPUT]`

Set a goal — keep working until the condition is met

```
USAGE
  $ claude claude command goal [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Set a goal — keep working until the condition is met
```

## `claude claude command heapdump [INPUT]`

Dump the JS heap to ~/Desktop

```
USAGE
  $ claude claude command heapdump [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Dump the JS heap to ~/Desktop
```

## `claude claude command init [INPUT]`

Initialize a new CLAUDE.md file with codebase documentation

```
USAGE
  $ claude claude command init [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Initialize a new CLAUDE.md file with codebase documentation
```

## `claude claude command insights [INPUT]`

Generate a report analyzing your Claude Code sessions

```
USAGE
  $ claude claude command insights [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Generate a report analyzing your Claude Code sessions
```

## `claude claude command loop [INPUT]`

Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo). Omit the interval to let the model self-pace.

```
USAGE
  $ claude claude command loop [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [interval] [prompt]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo). Omit the interval to let the model
  self-pace.
```

## `claude claude command mcp__plugin_figma_figma__create_design_system_rules [INPUT]`

Run the /mcp__plugin_figma_figma__create_design_system_rules slash command

```
USAGE
  $ claude claude command mcp__plugin_figma_figma__create_design_system_rules [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run the /mcp__plugin_figma_figma__create_design_system_rules slash command
```

## `claude claude command n8n-mcp-skills n8n-code-javascript [INPUT]`

Write JavaScript code in n8n Code nodes. Use when writing JavaScript in n8n, using $input/$json/$node syntax, making HTTP requests with $helpers, working with dates using DateTime, troubleshooting Code node errors, choosing between Code node modes, or doing any custom data transformation in n8n. Always use this skill when a workflow needs a Code node — whether for data aggregation, filtering, API calls, format conversion, batch processing logic, or any custom JavaScript. Covers SplitInBatches loop patterns, cross-iteration data, pairedItem, and real-world production patterns.

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-code-javascript [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Write JavaScript code in n8n Code nodes. Use when writing JavaScript in n8n, using $input/$json/$node syntax, making
  HTTP requests with $helpers, working with dates using DateTime, troubleshooting Code node errors, choosing between
  Code node modes, or doing any custom data transformation in n8n. Always use this skill when a workflow needs a Code
  node — whether for data aggregation, filtering, API calls, format conversion, batch processing logic, or any custom
  JavaScript. Covers SplitInBatches loop patterns, cross-iteration data, pairedItem, and real-world production patterns.
```

## `claude claude command n8n-mcp-skills n8n-code-python [INPUT]`

Write Python code in n8n Code nodes. Use when writing Python in n8n, using _input/_json/_node syntax, working with standard library, or need to understand Python limitations in n8n Code nodes. Use this skill when the user specifically requests Python for an n8n Code node. Note — JavaScript is recommended for 95% of use cases — only use Python when the user explicitly prefers it or the task requires Python-specific standard library capabilities (regex, hashlib, statistics).

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-code-python [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Write Python code in n8n Code nodes. Use when writing Python in n8n, using _input/_json/_node syntax, working with
  standard library, or need to understand Python limitations in n8n Code nodes. Use this skill when the user
  specifically requests Python for an n8n Code node. Note — JavaScript is recommended for 95% of use cases — only use
  Python when the user explicitly prefers it or the task requires Python-specific standard library capabilities (regex,
  hashlib, statistics).
```

## `claude claude command n8n-mcp-skills n8n-expression-syntax [INPUT]`

Validate n8n expression syntax and fix common errors. Use when writing n8n expressions, using {{}} syntax, accessing $json/$node variables, troubleshooting expression errors, mapping data between nodes, or referencing webhook data in workflows. Use this skill whenever configuring node fields that reference data from previous nodes — expressions are how n8n passes data between nodes, and getting the syntax wrong is the most common source of workflow errors.

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-expression-syntax [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Validate n8n expression syntax and fix common errors. Use when writing n8n expressions, using {{}} syntax, accessing
  $json/$node variables, troubleshooting expression errors, mapping data between nodes, or referencing webhook data in
  workflows. Use this skill whenever configuring node fields that reference data from previous nodes — expressions are
  how n8n passes data between nodes, and getting the syntax wrong is the most common source of workflow errors.
```

## `claude claude command n8n-mcp-skills n8n-mcp-tools-expert [INPUT]`

Expert guide for using n8n-mcp MCP tools effectively. Use when searching for nodes, validating configurations, accessing templates, managing workflows, managing credentials, auditing instance security, or using any n8n-mcp tool. Provides tool selection guidance, parameter formats, and common patterns. IMPORTANT — Always consult this skill before calling any n8n-mcp tool — it prevents common mistakes like wrong nodeType formats, incorrect parameter structures, and inefficient tool usage. If the user mentions n8n, workflows, nodes, or automation and you have n8n MCP tools available, use this skill first.

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-mcp-tools-expert [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Expert guide for using n8n-mcp MCP tools effectively. Use when searching for nodes, validating configurations,
  accessing templates, managing workflows, managing credentials, auditing instance security, or using any n8n-mcp tool.
  Provides tool selection guidance, parameter formats, and common patterns. IMPORTANT — Always consult this skill before
  calling any n8n-mcp tool — it prevents common mistakes like wrong nodeType formats, incorrect parameter structures,
  and inefficient tool usage. If the user mentions n8n, workflows, nodes, or automation and you have n8n MCP tools
  available, use this skill first.
```

## `claude claude command n8n-mcp-skills n8n-node-configuration [INPUT]`

Operation-aware node configuration guidance. Use when configuring nodes, understanding property dependencies, determining required fields, choosing between get_node detail levels, or learning common configuration patterns by node type. Always use this skill when setting up node parameters — it explains which fields are required for each operation, how displayOptions control field visibility, and when to use patchNodeField for surgical edits vs full node updates.

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-node-configuration [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Operation-aware node configuration guidance. Use when configuring nodes, understanding property dependencies,
  determining required fields, choosing between get_node detail levels, or learning common configuration patterns by
  node type. Always use this skill when setting up node parameters — it explains which fields are required for each
  operation, how displayOptions control field visibility, and when to use patchNodeField for surgical edits vs full node
  updates.
```

## `claude claude command n8n-mcp-skills n8n-validation-expert [INPUT]`

Interpret validation errors and guide fixing them. Use when encountering validation errors, validation warnings, false positives, operator structure issues, or need help understanding validation results. Also use when asking about validation profiles, error types, the validation loop process, or auto-fix capabilities. Consult this skill whenever a validate_node or validate_workflow call returns errors or warnings — it knows which warnings are false positives and which errors need real fixes.

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-validation-expert [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Interpret validation errors and guide fixing them. Use when encountering validation errors, validation warnings, false
  positives, operator structure issues, or need help understanding validation results. Also use when asking about
  validation profiles, error types, the validation loop process, or auto-fix capabilities. Consult this skill whenever a
  validate_node or validate_workflow call returns errors or warnings — it knows which warnings are false positives and
  which errors need real fixes.
```

## `claude claude command n8n-mcp-skills n8n-workflow-patterns [INPUT]`

Proven workflow architectural patterns from real n8n workflows. Use when building new workflows, designing workflow structure, choosing workflow patterns, planning workflow architecture, or asking about webhook processing, HTTP API integration, database operations, AI agent workflows, batch processing, or scheduled tasks. Always consult this skill when the user asks to create, build, or design an n8n workflow, automate a process, or connect services — even if they don't explicitly mention 'patterns'. Covers webhook, API, database, AI, batch processing, and scheduled automation architectures.

```
USAGE
  $ claude claude command n8n-mcp-skills n8n-workflow-patterns [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Proven workflow architectural patterns from real n8n workflows. Use when building new workflows, designing workflow
  structure, choosing workflow patterns, planning workflow architecture, or asking about webhook processing, HTTP API
  integration, database operations, AI agent workflows, batch processing, or scheduled tasks. Always consult this skill
  when the user asks to create, build, or design an n8n workflow, automate a process, or connect services — even if they
  don't explicitly mention 'patterns'. Covers webhook, API, database, AI, batch processing, and scheduled automation
  architectures.
```

## `claude claude command peer-review cloud-peer-review [INPUT]`

Execute comprehensive peer review workflow to verify the code changes for a Jira issue in the Cloud

```
USAGE
  $ claude claude command peer-review cloud-peer-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <issueKey> <testEnv> [repo] [branch]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Execute comprehensive peer review workflow to verify the code changes for a Jira issue in the Cloud
```

## `claude claude command peer-review deploy-test-server [INPUT]`

Deploy the current branch to a test server environment

```
USAGE
  $ claude claude command peer-review deploy-test-server [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <testEnv> [repo] [branch]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Deploy the current branch to a test server environment
```

## `claude claude command peer-review peer-review [INPUT]`

Comprehensive peer review workflow to verify the code changes for a Jira issue

```
USAGE
  $ claude claude command peer-review peer-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <issueKey> <testEnv>

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Comprehensive peer review workflow to verify the code changes for a Jira issue
```

## `claude claude command plugin-dev agent-development [INPUT]`

This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent frontmatter", "when to use description", "agent examples", "agent tools", "agent colors", "autonomous agent", or needs guidance on agent structure, system prompts, triggering conditions, or agent development best practices for Claude Code plugins.

```
USAGE
  $ claude claude command plugin-dev agent-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent
  frontmatter", "when to use description", "agent examples", "agent tools", "agent colors", "autonomous agent", or needs
  guidance on agent structure, system prompts, triggering conditions, or agent development best practices for Claude
  Code plugins.
```

## `claude claude command plugin-dev command-development [INPUT]`

This skill should be used when the user asks to "create a slash command", "add a command", "write a custom command", "define command arguments", "use command frontmatter", "organize commands", "create command with file references", "interactive command", "use AskUserQuestion in command", or needs guidance on slash command structure, YAML frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development best practices for Claude Code.

```
USAGE
  $ claude claude command plugin-dev command-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create a slash command", "add a command", "write a custom command",
  "define command arguments", "use command frontmatter", "organize commands", "create command with file references",
  "interactive command", "use AskUserQuestion in command", or needs guidance on slash command structure, YAML
  frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development
  best practices for Claude Code.
```

## `claude claude command plugin-dev create-plugin [INPUT]`

Guided end-to-end plugin creation workflow with component design, implementation, and validation

```
USAGE
  $ claude claude command plugin-dev create-plugin [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Optional plugin description

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Guided end-to-end plugin creation workflow with component design, implementation, and validation
```

## `claude claude command plugin-dev hook-development [INPUT]`

This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate tool use", "implement prompt-based hooks", "use ${CLAUDE_PLUGIN_ROOT}", "set up event-driven automation", "block dangerous commands", or mentions hook events (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd, UserPromptSubmit, PreCompact, Notification). Provides comprehensive guidance for creating and implementing Claude Code plugin hooks with focus on advanced prompt-based hooks API.

```
USAGE
  $ claude claude command plugin-dev hook-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate
  tool use", "implement prompt-based hooks", "use ${CLAUDE_PLUGIN_ROOT}", "set up event-driven automation", "block
  dangerous commands", or mentions hook events (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd,
  UserPromptSubmit, PreCompact, Notification). Provides comprehensive guidance for creating and implementing Claude Code
  plugin hooks with focus on advanced prompt-based hooks API.
```

## `claude claude command plugin-dev mcp-integration [INPUT]`

This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use .mcp.json", "set up Model Context Protocol", "connect external service", mentions "${CLAUDE_PLUGIN_ROOT} with MCP", or discusses MCP server types (SSE, stdio, HTTP, WebSocket). Provides comprehensive guidance for integrating Model Context Protocol servers into Claude Code plugins for external tool and service integration.

```
USAGE
  $ claude claude command plugin-dev mcp-integration [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use
  .mcp.json", "set up Model Context Protocol", "connect external service", mentions "${CLAUDE_PLUGIN_ROOT} with MCP", or
  discusses MCP server types (SSE, stdio, HTTP, WebSocket). Provides comprehensive guidance for integrating Model
  Context Protocol servers into Claude Code plugins for external tool and service integration.
```

## `claude claude command plugin-dev plugin-settings [INPUT]`

This skill should be used when the user asks about "plugin settings", "store plugin configuration", "user-configurable plugin", ".local.md files", "plugin state files", "read YAML frontmatter", "per-project plugin settings", or wants to make plugin behavior configurable. Documents the .claude/plugin-name.local.md pattern for storing plugin-specific configuration with YAML frontmatter and markdown content.

```
USAGE
  $ claude claude command plugin-dev plugin-settings [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks about "plugin settings", "store plugin configuration", "user-configurable
  plugin", ".local.md files", "plugin state files", "read YAML frontmatter", "per-project plugin settings", or wants to
  make plugin behavior configurable. Documents the .claude/plugin-name.local.md pattern for storing plugin-specific
  configuration with YAML frontmatter and markdown content.
```

## `claude claude command plugin-dev plugin-structure [INPUT]`

This skill should be used when the user asks to "create a plugin", "scaffold a plugin", "understand plugin structure", "organize plugin components", "set up plugin.json", "use ${CLAUDE_PLUGIN_ROOT}", "add commands/agents/skills/hooks", "configure auto-discovery", or needs guidance on plugin directory layout, manifest configuration, component organization, file naming conventions, or Claude Code plugin architecture best practices.

```
USAGE
  $ claude claude command plugin-dev plugin-structure [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create a plugin", "scaffold a plugin", "understand plugin structure",
  "organize plugin components", "set up plugin.json", "use ${CLAUDE_PLUGIN_ROOT}", "add commands/agents/skills/hooks",
  "configure auto-discovery", or needs guidance on plugin directory layout, manifest configuration, component
  organization, file naming conventions, or Claude Code plugin architecture best practices.
```

## `claude claude command plugin-dev skill-development [INPUT]`

This skill should be used when the user wants to "create a skill", "add a skill to plugin", "write a new skill", "improve skill description", "organize skill content", or needs guidance on skill structure, progressive disclosure, or skill development best practices for Claude Code plugins.

```
USAGE
  $ claude claude command plugin-dev skill-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user wants to "create a skill", "add a skill to plugin", "write a new skill",
  "improve skill description", "organize skill content", or needs guidance on skill structure, progressive disclosure,
  or skill development best practices for Claude Code plugins.
```

## `claude claude command pr-review-toolkit review-pr [INPUT]`

Comprehensive PR review using specialized agents

```
USAGE
  $ claude claude command pr-review-toolkit review-pr [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [review-aspects]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Comprehensive PR review using specialized agents
```

## `claude claude command prompt-engineering prompt-engineering [INPUT]`

This skill should be used when the user asks to "improve this prompt", "optimize my prompt", "rewrite this prompt", "make this prompt better", "review my prompt", "fix my system prompt", "why isn't my prompt working", "apply prompt engineering best practices", "my prompt gives inconsistent results", "the model ignores my instructions", or shares an existing prompt and wants higher-quality, more reliable, or more consistent outputs from an LLM.

```
USAGE
  $ claude claude command prompt-engineering prompt-engineering [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "improve this prompt", "optimize my prompt", "rewrite this prompt",
  "make this prompt better", "review my prompt", "fix my system prompt", "why isn't my prompt working", "apply prompt
  engineering best practices", "my prompt gives inconsistent results", "the model ignores my instructions", or shares an
  existing prompt and wants higher-quality, more reliable, or more consistent outputs from an LLM.
```

## `claude claude command recap [INPUT]`

Generate a one-line session recap now

```
USAGE
  $ claude claude command recap [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Generate a one-line session recap now
```

## `claude claude command reflex-workflows jira-intake-analyzer [INPUT]`

Analyzes a Jira ticket for developer intake readiness. Returns a verdict (APPROVED, NEEDS ATTENTION, NO ACTION, or ERROR) with a per-dimension breakdown explaining the reasoning.

```
USAGE
  $ claude claude command reflex-workflows jira-intake-analyzer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Analyzes a Jira ticket for developer intake readiness. Returns a verdict (APPROVED, NEEDS ATTENTION, NO ACTION, or
  ERROR) with a per-dimension breakdown explaining the reasoning.
```

## `claude claude command reflex-workflows jira-plan-implementer [INPUT]`

Implements a plan.md produced by jira-plan-writer. Creates a git worktree, executes tasks, runs scoped tests, iterates on review until passing, commits, pushes, and opens a PR. Returns a verdict the orchestrator acts on.

```
USAGE
  $ claude claude command reflex-workflows jira-plan-implementer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Implements a plan.md produced by jira-plan-writer. Creates a git worktree, executes tasks, runs scoped tests, iterates
  on review until passing, commits, pushes, and opens a PR. Returns a verdict the orchestrator acts on.
```

## `claude claude command reflex-workflows jira-plan-writer [INPUT]`

Writes a comprehensive, zero-context implementation plan for an Approved Jira ticket. Greps the codebase for exact file paths, generates real code snippets, and saves a checkbox-driven plan.md the engineer can execute task-by-task.

```
USAGE
  $ claude claude command reflex-workflows jira-plan-writer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Writes a comprehensive, zero-context implementation plan for an Approved Jira ticket. Greps the codebase for exact
  file paths, generates real code snippets, and saves a checkbox-driven plan.md the engineer can execute task-by-task.
```

## `claude claude command reload-skills [INPUT]`

Pick up skills added or changed on disk during this session

```
USAGE
  $ claude claude command reload-skills [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Pick up skills added or changed on disk during this session
```

## `claude claude command remotion-best-practices [INPUT]`

Best practices for Remotion - Video creation in React

```
USAGE
  $ claude claude command remotion-best-practices [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Best practices for Remotion - Video creation in React
```

## `claude claude command review [INPUT]`

Review a GitHub pull request; for your working diff use /code-review

```
USAGE
  $ claude claude command review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [pr number]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review a GitHub pull request; for your working diff use /code-review
```

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

_See code: [src/commands/claude/command/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/command/run.ts)_

## `claude claude command run-skill-generator [INPUT]`

Author or improve the run-<unit> skill — a per-project skill that tells agents how to build, launch, and drive this project's app. Use when the user asks to set up the project, get it running, write run instructions, or verify build/run steps work from a clean environment.

```
USAGE
  $ claude claude command run-skill-generator [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Author or improve the run-<unit> skill — a per-project skill that tells agents how to build, launch, and drive this
  project's app. Use when the user asks to set up the project, get it running, write run instructions, or verify
  build/run steps work from a clean environment.
```

## `claude claude command security-review [INPUT]`

Complete a security review of the pending changes on the current branch

```
USAGE
  $ claude claude command security-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Complete a security review of the pending changes on the current branch
```

## `claude claude command sentry seer [INPUT]`

Ask natural language questions about your Sentry environment and get detailed insights using the Sentry MCP server

```
USAGE
  $ claude claude command sentry seer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Ask natural language questions about your Sentry environment and get detailed insights using the Sentry MCP server
```

## `claude claude command sentry sentry-android-sdk [INPUT]`

Full Sentry SDK setup for Android. Use when asked to "add Sentry to Android", "install sentry-android", "setup Sentry in Android", or configure error monitoring, tracing, profiling, session replay, or logging for Android applications. Supports Kotlin and Java codebases.

```
USAGE
  $ claude claude command sentry sentry-android-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Android. Use when asked to "add Sentry to Android", "install sentry-android", "setup Sentry
  in Android", or configure error monitoring, tracing, profiling, session replay, or logging for Android applications.
  Supports Kotlin and Java codebases.
```

## `claude claude command sentry sentry-browser-sdk [INPUT]`

Full Sentry SDK setup for browser JavaScript. Use when asked to "add Sentry to a website", "install @sentry/browser", or configure error monitoring, tracing, session replay, or logging for vanilla JavaScript, jQuery, static sites, or WordPress.

```
USAGE
  $ claude claude command sentry sentry-browser-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for browser JavaScript. Use when asked to "add Sentry to a website", "install @sentry/browser",
  or configure error monitoring, tracing, session replay, or logging for vanilla JavaScript, jQuery, static sites, or
  WordPress.
```

## `claude claude command sentry sentry-cloudflare-sdk [INPUT]`

Full Sentry SDK setup for Cloudflare Workers and Pages. Use when asked to "add Sentry to Cloudflare Workers", "install @sentry/cloudflare", or configure error monitoring, tracing, logging, crons, or AI monitoring for Cloudflare Workers, Pages, Durable Objects, Queues, Workflows, or Hono on Cloudflare.

```
USAGE
  $ claude claude command sentry sentry-cloudflare-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Cloudflare Workers and Pages. Use when asked to "add Sentry to Cloudflare Workers", "install
  @sentry/cloudflare", or configure error monitoring, tracing, logging, crons, or AI monitoring for Cloudflare Workers,
  Pages, Durable Objects, Queues, Workflows, or Hono on Cloudflare.
```

## `claude claude command sentry sentry-cocoa-sdk [INPUT]`

Full Sentry SDK setup for Apple platforms (iOS, macOS, tvOS, watchOS, visionOS). Use when asked to "add Sentry to iOS", "add Sentry to Swift", "install sentry-cocoa", or configure error monitoring, tracing, profiling, session replay, or logging for Apple applications. Supports SwiftUI and UIKit.

```
USAGE
  $ claude claude command sentry sentry-cocoa-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Apple platforms (iOS, macOS, tvOS, watchOS, visionOS). Use when asked to "add Sentry to
  iOS", "add Sentry to Swift", "install sentry-cocoa", or configure error monitoring, tracing, profiling, session
  replay, or logging for Apple applications. Supports SwiftUI and UIKit.
```

## `claude claude command sentry sentry-code-review [INPUT]`

Analyze and resolve Sentry comments on GitHub Pull Requests. Use this when asked to review or fix issues identified by Sentry in PR comments. Can review specific PRs by number or automatically find recent PRs with Sentry feedback.

```
USAGE
  $ claude claude command sentry sentry-code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Analyze and resolve Sentry comments on GitHub Pull Requests. Use this when asked to review or fix issues identified by
  Sentry in PR comments. Can review specific PRs by number or automatically find recent PRs with Sentry feedback.
```

## `claude claude command sentry sentry-create-alert [INPUT]`

Create Sentry alerts using the workflow engine API. Use when asked to create alerts, set up notifications, configure issue priority alerts, or build workflow automations. Supports email, Slack, PagerDuty, Discord, and other notification actions.

```
USAGE
  $ claude claude command sentry sentry-create-alert [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Create Sentry alerts using the workflow engine API. Use when asked to create alerts, set up notifications, configure
  issue priority alerts, or build workflow automations. Supports email, Slack, PagerDuty, Discord, and other
  notification actions.
```

## `claude claude command sentry sentry-dotnet-sdk [INPUT]`

Full Sentry SDK setup for .NET. Use when asked to "add Sentry to .NET", "install Sentry for C#", or configure error monitoring, tracing, profiling, logging, or crons for ASP.NET Core, MAUI, WPF, WinForms, Blazor, Azure Functions, or any other .NET application.

```
USAGE
  $ claude claude command sentry sentry-dotnet-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for .NET. Use when asked to "add Sentry to .NET", "install Sentry for C#", or configure error
  monitoring, tracing, profiling, logging, or crons for ASP.NET Core, MAUI, WPF, WinForms, Blazor, Azure Functions, or
  any other .NET application.
```

## `claude claude command sentry sentry-elixir-sdk [INPUT]`

Full Sentry SDK setup for Elixir. Use when asked to "add Sentry to Elixir", "install sentry for Elixir", or configure error monitoring, tracing, logging, or crons for Elixir, Phoenix, or Plug applications. Supports Phoenix, Plug, LiveView, Oban, and Quantum.

```
USAGE
  $ claude claude command sentry sentry-elixir-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Elixir. Use when asked to "add Sentry to Elixir", "install sentry for Elixir", or configure
  error monitoring, tracing, logging, or crons for Elixir, Phoenix, or Plug applications. Supports Phoenix, Plug,
  LiveView, Oban, and Quantum.
```

## `claude claude command sentry sentry-feature-setup [INPUT]`

Configure specific Sentry features beyond basic SDK setup. Use when asked to monitor AI/LLM calls, set up OpenTelemetry pipelines, or create alerts and notifications.

```
USAGE
  $ claude claude command sentry sentry-feature-setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Configure specific Sentry features beyond basic SDK setup. Use when asked to monitor AI/LLM calls, set up
  OpenTelemetry pipelines, or create alerts and notifications.
```

## `claude claude command sentry sentry-fix-issues [INPUT]`

Find and fix issues from Sentry using MCP. Use when asked to fix Sentry errors, debug production issues, investigate exceptions, or resolve bugs reported in Sentry. Methodically analyzes stack traces, breadcrumbs, traces, and context to identify root causes.

```
USAGE
  $ claude claude command sentry sentry-fix-issues [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Find and fix issues from Sentry using MCP. Use when asked to fix Sentry errors, debug production issues, investigate
  exceptions, or resolve bugs reported in Sentry. Methodically analyzes stack traces, breadcrumbs, traces, and context
  to identify root causes.
```

## `claude claude command sentry sentry-flutter-sdk [INPUT]`

Full Sentry SDK setup for Flutter and Dart. Use when asked to "add Sentry to Flutter", "install sentry_flutter", "setup Sentry in Dart", or configure error monitoring, tracing, profiling, session replay, or logging for Flutter applications. Supports Android, iOS, macOS, Linux, Windows, and Web.

```
USAGE
  $ claude claude command sentry sentry-flutter-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Flutter and Dart. Use when asked to "add Sentry to Flutter", "install sentry_flutter",
  "setup Sentry in Dart", or configure error monitoring, tracing, profiling, session replay, or logging for Flutter
  applications. Supports Android, iOS, macOS, Linux, Windows, and Web.
```

## `claude claude command sentry sentry-go-sdk [INPUT]`

Full Sentry SDK setup for Go. Use when asked to "add Sentry to Go", "install sentry-go", "setup Sentry in Go", or configure error monitoring, tracing, logging, metrics, or crons for Go applications. Supports net/http, Gin, Echo, Fiber, FastHTTP, Iris, and Negroni.

```
USAGE
  $ claude claude command sentry sentry-go-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Go. Use when asked to "add Sentry to Go", "install sentry-go", "setup Sentry in Go", or
  configure error monitoring, tracing, logging, metrics, or crons for Go applications. Supports net/http, Gin, Echo,
  Fiber, FastHTTP, Iris, and Negroni.
```

## `claude claude command sentry sentry-nestjs-sdk [INPUT]`

Full Sentry SDK setup for NestJS. Use when asked to "add Sentry to NestJS", "install @sentry/nestjs", "setup Sentry in NestJS", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for NestJS applications. Supports Express and Fastify adapters, GraphQL, microservices, WebSockets, and background jobs.

```
USAGE
  $ claude claude command sentry sentry-nestjs-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for NestJS. Use when asked to "add Sentry to NestJS", "install @sentry/nestjs", "setup Sentry in
  NestJS", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for NestJS
  applications. Supports Express and Fastify adapters, GraphQL, microservices, WebSockets, and background jobs.
```

## `claude claude command sentry sentry-nextjs-sdk [INPUT]`

Full Sentry SDK setup for Next.js. Use when asked to "add Sentry to Next.js", "install @sentry/nextjs", or configure error monitoring, tracing, session replay, logging, profiling, AI monitoring, or crons for Next.js applications. Supports Next.js 13+ with App Router and Pages Router.

```
USAGE
  $ claude claude command sentry sentry-nextjs-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Next.js. Use when asked to "add Sentry to Next.js", "install @sentry/nextjs", or configure
  error monitoring, tracing, session replay, logging, profiling, AI monitoring, or crons for Next.js applications.
  Supports Next.js 13+ with App Router and Pages Router.
```

## `claude claude command sentry sentry-node-sdk [INPUT]`

Full Sentry SDK setup for Node.js, Bun, and Deno. Use when asked to "add Sentry to Node.js", "add Sentry to Bun", "add Sentry to Deno", "install @sentry/node", "@sentry/bun", or "@sentry/deno", or configure error monitoring, tracing, logging, profiling, metrics, crons, or AI monitoring for server-side JavaScript/TypeScript runtimes.

```
USAGE
  $ claude claude command sentry sentry-node-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Node.js, Bun, and Deno. Use when asked to "add Sentry to Node.js", "add Sentry to Bun", "add
  Sentry to Deno", "install @sentry/node", "@sentry/bun", or "@sentry/deno", or configure error monitoring, tracing,
  logging, profiling, metrics, crons, or AI monitoring for server-side JavaScript/TypeScript runtimes.
```

## `claude claude command sentry sentry-otel-exporter-setup [INPUT]`

Configure the OpenTelemetry Collector with Sentry Exporter for multi-project routing and automatic project creation. Use when setting up OTel with Sentry, configuring collector pipelines for traces and logs, or routing telemetry from multiple services to Sentry projects.

```
USAGE
  $ claude claude command sentry sentry-otel-exporter-setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Configure the OpenTelemetry Collector with Sentry Exporter for multi-project routing and automatic project creation.
  Use when setting up OTel with Sentry, configuring collector pipelines for traces and logs, or routing telemetry from
  multiple services to Sentry projects.
```

## `claude claude command sentry sentry-php-sdk [INPUT]`

Full Sentry SDK setup for PHP. Use when asked to "add Sentry to PHP", "install sentry/sentry", "setup Sentry in PHP", or configure error monitoring, tracing, profiling, logging, metrics, or crons for PHP applications. Supports plain PHP, Laravel, and Symfony.

```
USAGE
  $ claude claude command sentry sentry-php-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for PHP. Use when asked to "add Sentry to PHP", "install sentry/sentry", "setup Sentry in PHP",
  or configure error monitoring, tracing, profiling, logging, metrics, or crons for PHP applications. Supports plain
  PHP, Laravel, and Symfony.
```

## `claude claude command sentry sentry-pr-code-review [INPUT]`

Review a project's PRs to check for issues detected in code review by Seer Bug Prediction. Use when asked to review or fix issues identified by Sentry in PR comments, or to find recent PRs with Sentry feedback.

```
USAGE
  $ claude claude command sentry sentry-pr-code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review a project's PRs to check for issues detected in code review by Seer Bug Prediction. Use when asked to review or
  fix issues identified by Sentry in PR comments, or to find recent PRs with Sentry feedback.
```

## `claude claude command sentry sentry-python-sdk [INPUT]`

Full Sentry SDK setup for Python. Use when asked to "add Sentry to Python", "install sentry-sdk", "setup Sentry in Python", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for Python applications. Supports Django, Flask, FastAPI, Celery, Starlette, AIOHTTP, Tornado, and more.

```
USAGE
  $ claude claude command sentry sentry-python-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Python. Use when asked to "add Sentry to Python", "install sentry-sdk", "setup Sentry in
  Python", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for Python
  applications. Supports Django, Flask, FastAPI, Celery, Starlette, AIOHTTP, Tornado, and more.
```

## `claude claude command sentry sentry-react-native-sdk [INPUT]`

Full Sentry SDK setup for React Native and Expo. Use when asked to "add Sentry to React Native", "install @sentry/react-native", "setup Sentry in Expo", or configure error monitoring, tracing, profiling, session replay, or logging for React Native applications. Supports Expo managed, Expo bare, and vanilla React Native.

```
USAGE
  $ claude claude command sentry sentry-react-native-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for React Native and Expo. Use when asked to "add Sentry to React Native", "install
  @sentry/react-native", "setup Sentry in Expo", or configure error monitoring, tracing, profiling, session replay, or
  logging for React Native applications. Supports Expo managed, Expo bare, and vanilla React Native.
```

## `claude claude command sentry sentry-react-sdk [INPUT]`

Full Sentry SDK setup for React. Use when asked to "add Sentry to React", "install @sentry/react", or configure error monitoring, tracing, session replay, profiling, or logging for React applications. Supports React 16+, React Router v5-v7, TanStack Router, Redux, Vite, and webpack.

```
USAGE
  $ claude claude command sentry sentry-react-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for React. Use when asked to "add Sentry to React", "install @sentry/react", or configure error
  monitoring, tracing, session replay, profiling, or logging for React applications. Supports React 16+, React Router
  v5-v7, TanStack Router, Redux, Vite, and webpack.
```

## `claude claude command sentry sentry-ruby-sdk [INPUT]`

Full Sentry SDK setup for Ruby. Use when asked to add Sentry to Ruby, install sentry-ruby, setup Sentry in Rails/Sinatra/Rack, or configure error monitoring, tracing, logging, metrics, profiling, or crons for Ruby applications. Also handles migration from AppSignal, Honeybadger, Bugsnag, Rollbar, or Airbrake. Supports Rails, Sinatra, Rack, Sidekiq, and Resque.

```
USAGE
  $ claude claude command sentry sentry-ruby-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Ruby. Use when asked to add Sentry to Ruby, install sentry-ruby, setup Sentry in
  Rails/Sinatra/Rack, or configure error monitoring, tracing, logging, metrics, profiling, or crons for Ruby
  applications. Also handles migration from AppSignal, Honeybadger, Bugsnag, Rollbar, or Airbrake. Supports Rails,
  Sinatra, Rack, Sidekiq, and Resque.
```

## `claude claude command sentry sentry-sdk-setup [INPUT]`

Set up Sentry in any language or framework. Detects the user's platform and loads the right SDK skill. Use when asked to add Sentry, install an SDK, or set up error monitoring in a project.

```
USAGE
  $ claude claude command sentry sentry-sdk-setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Set up Sentry in any language or framework. Detects the user's platform and loads the right SDK skill. Use when asked
  to add Sentry, install an SDK, or set up error monitoring in a project.
```

## `claude claude command sentry sentry-sdk-skill-creator [INPUT]`

Create a complete Sentry SDK skill bundle for any platform. Use when asked to "create an SDK skill", "add a new platform skill", "write a Sentry skill for X", or build a new sentry-<platform>-sdk skill bundle with wizard flow and feature reference files.

```
USAGE
  $ claude claude command sentry sentry-sdk-skill-creator [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Create a complete Sentry SDK skill bundle for any platform. Use when asked to "create an SDK skill", "add a new
  platform skill", "write a Sentry skill for X", or build a new sentry-<platform>-sdk skill bundle with wizard flow and
  feature reference files.
```

## `claude claude command sentry sentry-sdk-upgrade [INPUT]`

Upgrade the Sentry JavaScript SDK across major versions. Use when asked to upgrade Sentry, migrate to a newer version, fix deprecated Sentry APIs, or resolve breaking changes after a Sentry version bump.

```
USAGE
  $ claude claude command sentry sentry-sdk-upgrade [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Upgrade the Sentry JavaScript SDK across major versions. Use when asked to upgrade Sentry, migrate to a newer version,
  fix deprecated Sentry APIs, or resolve breaking changes after a Sentry version bump.
```

## `claude claude command sentry sentry-setup-ai-monitoring [INPUT]`

Setup Sentry AI Agent Monitoring in any project. Use when asked to monitor LLM calls, track AI agents, or instrument OpenAI/Anthropic/Vercel AI/LangChain/Google GenAI/Pydantic AI. Detects installed AI SDKs and configures appropriate integrations.

```
USAGE
  $ claude claude command sentry sentry-setup-ai-monitoring [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Setup Sentry AI Agent Monitoring in any project. Use when asked to monitor LLM calls, track AI agents, or instrument
  OpenAI/Anthropic/Vercel AI/LangChain/Google GenAI/Pydantic AI. Detects installed AI SDKs and configures appropriate
  integrations.
```

## `claude claude command sentry sentry-svelte-sdk [INPUT]`

Full Sentry SDK setup for Svelte and SvelteKit. Use when asked to "add Sentry to Svelte", "add Sentry to SvelteKit", "install @sentry/sveltekit", or configure error monitoring, tracing, session replay, or logging for Svelte or SvelteKit applications.

```
USAGE
  $ claude claude command sentry sentry-svelte-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Svelte and SvelteKit. Use when asked to "add Sentry to Svelte", "add Sentry to SvelteKit",
  "install @sentry/sveltekit", or configure error monitoring, tracing, session replay, or logging for Svelte or
  SvelteKit applications.
```

## `claude claude command sentry sentry-workflow [INPUT]`

Fix production issues and review code with Sentry context. Use when asked to fix Sentry errors, debug issues, triage exceptions, review PR comments from Sentry, or resolve bugs.

```
USAGE
  $ claude claude command sentry sentry-workflow [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Fix production issues and review code with Sentry context. Use when asked to fix Sentry errors, debug issues, triage
  exceptions, review PR comments from Sentry, or resolve bugs.
```

## `claude claude command simplify [INPUT]`

Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.

```
USAGE
  $ claude claude command simplify [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [<target>]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality
  only — it does not hunt for bugs; use /code-review for that.
```

## `claude claude command ssh-remote-server ssh-remote-server [INPUT]`

This skill should be used when the user asks to "ssh into remote server", "execute artisan command remotely", "run bash command in remote server", "execute artisan in pod", "remote artisan cache clear", mentions SSH chaining. Provides remote command execution via SSH through bastion hosts to Kubernetes pods, supporting Laravel artisan commands, bash commands, and PHP tinker operations.

```
USAGE
  $ claude claude command ssh-remote-server ssh-remote-server [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [command] [server] [component] [--all]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "ssh into remote server", "execute artisan command remotely", "run
  bash command in remote server", "execute artisan in pod", "remote artisan cache clear", mentions SSH chaining.
  Provides remote command execution via SSH through bastion hosts to Kubernetes pods, supporting Laravel artisan
  commands, bash commands, and PHP tinker operations.
```

## `claude claude command team-onboarding [INPUT]`

Help teammates ramp on Claude Code with a guide from your usage

```
USAGE
  $ claude claude command team-onboarding [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Help teammates ramp on Claude Code with a guide from your usage
```

## `claude claude command terminal-recorder terminal-recorder [INPUT]`

This skill should be used when the user wants to record a terminal session and convert it to an animated GIF. Use when the user says phrases like "record my terminal", "capture terminal session", "create a terminal GIF", "record a demo", "make a terminal recording", "convert cast to GIF", or needs to produce shareable terminal demos.

```
USAGE
  $ claude claude command terminal-recorder terminal-recorder [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user wants to record a terminal session and convert it to an animated GIF. Use when
  the user says phrases like "record my terminal", "capture terminal session", "create a terminal GIF", "record a demo",
  "make a terminal recording", "convert cast to GIF", or needs to produce shareable terminal demos.
```

## `claude claude command trello-qa-triage analyze-serenity-report [INPUT]`

This skill should be used when the user provides a Jenkins-hosted Serenity BDD test report URL (an HTML-publisher page such as http://<jenkins-host>/view/<view>/job/<job>/Test_20Report/) and asks to "download this test report", "analyze this Serenity report", "focus on the failure steps", "read the failure screenshots", or "tell me the symptom". Downloads the full report via the Jenkins *zip* endpoint, locates the failing scenarios, extracts the failing steps and exceptions verbatim, reads the attached screenshots, and reports the findings only — no root-cause suggestions or recommendations.

```
USAGE
  $ claude claude command trello-qa-triage analyze-serenity-report [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user provides a Jenkins-hosted Serenity BDD test report URL (an HTML-publisher page
  such as http://<jenkins-host>/view/<view>/job/<job>/Test_20Report/) and asks to "download this test report", "analyze
  this Serenity report", "focus on the failure steps", "read the failure screenshots", or "tell me the symptom".
  Downloads the full report via the Jenkins *zip* endpoint, locates the failing scenarios, extracts the failing steps
  and exceptions verbatim, reads the attached screenshots, and reports the findings only — no root-cause suggestions or
  recommendations.
```

## `claude claude command trello-qa-triage investigate [INPUT]`

Investigate a Trello QA card — parse the card, pull the Jenkins test report as source of truth, replicate, and root-cause the Selenium failure across the relevant systems

```
USAGE
  $ claude claude command trello-qa-triage investigate [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <CARDID>

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Investigate a Trello QA card — parse the card, pull the Jenkins test report as source of truth, replicate, and
  root-cause the Selenium failure across the relevant systems
```

## `claude claude command update-config [INPUT]`

Use this skill to configure the Claude Code harness via settings.json. Automated behaviors ("from now on when X", "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these, not Claude, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json files. Examples: "allow npm commands", "add bq permission to global settings", "move permission to user settings", "set DEBUG=true", "when claude stops show X". For simple settings like theme/model, suggest the /config command.

```
USAGE
  $ claude claude command update-config [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill to configure the Claude Code harness via settings.json. Automated behaviors ("from now on when X",
  "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these,
  not Claude, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move
  permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json
  files. Examples: "allow npm commands", "add bq permission to global settings", "move permission to user settings",
  "set DEBUG=true", "when claude stops show X". For simple settings like theme/model, suggest the /config command.
```

## `claude claude command usage [INPUT]`

Show session cost, plan usage, and what's contributing to your limits

```
USAGE
  $ claude claude command usage [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Show session cost, plan usage, and what's contributing to your limits
```

## `claude claude command verify [INPUT]`

Verify that a code change actually does what it's supposed to by exercising it end-to-end and observing behavior — drive the affected flow, not just tests or typecheck. Run before committing nontrivial changes. Don't invoke it on a diff that only touches tests, docs, or other code with no runtime surface to drive (a change to product source always has one) — there's nothing to observe.

```
USAGE
  $ claude claude command verify [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Verify that a code change actually does what it's supposed to by exercising it end-to-end and observing behavior —
  drive the affected flow, not just tests or typecheck. Run before committing nontrivial changes. Don't invoke it on a
  diff that only touches tests, docs, or other code with no runtime surface to drive (a change to product source always
  has one) — there's nothing to observe.
```

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

_See code: [src/commands/claude/list/index.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/index.ts)_

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

_See code: [src/commands/claude/list/agents.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/agents.ts)_

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

_See code: [src/commands/claude/list/mcp-servers.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/mcp-servers.ts)_

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

_See code: [src/commands/claude/list/tools.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/list/tools.ts)_

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

_See code: [src/commands/claude/prompt/index.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/index.ts)_

## `claude claude prompt add [NAME] [BODY]`

Create a saved prompt

```
USAGE
  $ claude claude prompt add [NAME] [BODY] [-d <value>] [-s <value>]

ARGUMENTS
  [NAME]  Prompt name
  [BODY]  Prompt text to save

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

_See code: [src/commands/claude/prompt/add.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/add.ts)_

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

_See code: [src/commands/claude/prompt/delete.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/delete.ts)_

## `claude claude prompt edit [NAME] [BODY]`

Edit a saved prompt

```
USAGE
  $ claude claude prompt edit [NAME] [BODY] [-d <value>] [-f] [-s <value>]

ARGUMENTS
  [NAME]  Prompt name
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

_See code: [src/commands/claude/prompt/edit.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/edit.ts)_

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

_See code: [src/commands/claude/prompt/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/run.ts)_

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

_See code: [src/commands/claude/prompt/show.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/prompt/show.ts)_

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

_See code: [src/commands/claude/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/run.ts)_

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

_See code: [src/commands/claude/session/index.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/index.ts)_

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

_See code: [src/commands/claude/session/delete.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/delete.ts)_

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

_See code: [src/commands/claude/session/fork.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/fork.ts)_

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

_See code: [src/commands/claude/session/rename.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/rename.ts)_

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

_See code: [src/commands/claude/session/resume.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/resume.ts)_

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

_See code: [src/commands/claude/session/show.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/show.ts)_

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

_See code: [src/commands/claude/session/tag.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/session/tag.ts)_

## `claude claude skill api extract-api [INPUT]`

This skill should be used when the user asks to "extract API from", "import API from", "add commands from this repo", "register API from docs", "convert docs to CLI commands", "import Postman collection", or provides a GitHub repository URL, a documentation site URL, a Postman collection file/URL, or a local API documentation file and wants it imported as sdkck CLI commands.

```
USAGE
  $ claude claude skill api extract-api [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <github-url|docs-url|file-path> [--name <name>]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "extract API from", "import API from", "add commands from this repo",
  "register API from docs", "convert docs to CLI commands", "import Postman collection", or provides a GitHub repository
  URL, a documentation site URL, a Postman collection file/URL, or a local API documentation file and wants it imported
  as sdkck CLI commands.
```

## `claude claude skill ax-agent [INPUT]`

This skill helps an LLM generate correct core AxAgent code using @ax-llm/ax. Use when the user asks about agent(), child agents, namespaced functions, discovery mode, clarification, bubbleErrors, host-side final/clarification protocol, or ordinary agent runtime behavior. For RLM/code-runtime work use ax-agent-rlm; for callbacks and telemetry use ax-agent-observability; for recall/memory/skill loading use ax-agent-memory-skills; for agent.optimize(...) use ax-agent-optimize.

```
USAGE
  $ claude claude skill ax-agent [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct core AxAgent code using @ax-llm/ax. Use when the user asks about agent(),
  child agents, namespaced functions, discovery mode, clarification, bubbleErrors, host-side final/clarification
  protocol, or ordinary agent runtime behavior. For RLM/code-runtime work use ax-agent-rlm; for callbacks and telemetry
  use ax-agent-observability; for recall/memory/skill loading use ax-agent-memory-skills; for agent.optimize(...) use
  ax-agent-optimize.
```

## `claude claude skill ax-agent-memory-skills [INPUT]`

This skill helps an LLM generate correct AxAgent memory retrieval, context-map, and dynamic skill-loading code using @ax-llm/ax. Use when the user asks about contextMap, AxAgentContextMap, onMemoriesSearch, recall(...), inputs.memories, onLoadedMemories, onUsedMemories, onSkillsSearch, discover({ skills }), onLoadedSkills, onUsedSkills, preloaded skills, loaded memory/skill IDs, or carrying memories across forward() calls.

```
USAGE
  $ claude claude skill ax-agent-memory-skills [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent memory retrieval, context-map, and dynamic skill-loading code using
  @ax-llm/ax. Use when the user asks about contextMap, AxAgentContextMap, onMemoriesSearch, recall(...),
  inputs.memories, onLoadedMemories, onUsedMemories, onSkillsSearch, discover({ skills }), onLoadedSkills, onUsedSkills,
  preloaded skills, loaded memory/skill IDs, or carrying memories across forward() calls.
```

## `claude claude skill ax-agent-observability [INPUT]`

This skill helps an LLM generate correct AxAgent observability code using @ax-llm/ax. Use when the user asks about actorTurnCallback, onContextEvent, agentStatusCallback, onFunctionCall, reportSuccess, reportFailure, getChatLog(), getUsage(), resetUsage(), debug traces, progress updates, or telemetry for AxAgent runs.

```
USAGE
  $ claude claude skill ax-agent-observability [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent observability code using @ax-llm/ax. Use when the user asks about
  actorTurnCallback, onContextEvent, agentStatusCallback, onFunctionCall, reportSuccess, reportFailure, getChatLog(),
  getUsage(), resetUsage(), debug traces, progress updates, or telemetry for AxAgent runs.
```

## `claude claude skill ax-agent-optimize [INPUT]`

This skill helps an LLM generate correct AxAgent tuning and evaluation code using @ax-llm/ax. Use when the user asks about agent.optimize(...), judgeOptions, eval datasets, optimization targets, saved optimizedProgram artifacts, or agent optimization guidance.

```
USAGE
  $ claude claude skill ax-agent-optimize [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent tuning and evaluation code using @ax-llm/ax. Use when the user asks
  about agent.optimize(...), judgeOptions, eval datasets, optimization targets, saved optimizedProgram artifacts, or
  agent optimization guidance.
```

## `claude claude skill ax-agent-rlm [INPUT]`

This skill helps an LLM generate correct AxAgent RLM/runtime code using @ax-llm/ax. Use when the user asks about RLM code execution, AxJSRuntime, contextFields, contextPolicy, liveRuntimeState, promptLevel, stage prompt controls, executorModelPolicy, maxRuntimeChars, agent.test(...), llmQuery(...), recursionOptions, or long-running agent runtime behavior.

```
USAGE
  $ claude claude skill ax-agent-rlm [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxAgent RLM/runtime code using @ax-llm/ax. Use when the user asks about RLM
  code execution, AxJSRuntime, contextFields, contextPolicy, liveRuntimeState, promptLevel, stage prompt controls,
  executorModelPolicy, maxRuntimeChars, agent.test(...), llmQuery(...), recursionOptions, or long-running agent runtime
  behavior.
```

## `claude claude skill ax-ai [INPUT]`

This skill helps an LLM generate correct AI provider setup and configuration code using @ax-llm/ax. Use when the user asks about ai(), providers, models, presets, embeddings, batch audio with ai.transcribe() or ai.speak(), extended thinking, context caching, or mentions OpenAI/Anthropic/Google/Azure/DeepSeek/Mistral/Cohere/Reka/Grok with @ax-llm/ax.

```
USAGE
  $ claude claude skill ax-ai [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AI provider setup and configuration code using @ax-llm/ax. Use when the user
  asks about ai(), providers, models, presets, embeddings, batch audio with ai.transcribe() or ai.speak(), extended
  thinking, context caching, or mentions OpenAI/Anthropic/Google/Azure/DeepSeek/Mistral/Cohere/Reka/Grok with
  @ax-llm/ax.
```

## `claude claude skill ax-audio [INPUT]`

This skill helps an LLM generate correct audio code with @ax-llm/ax. Use when the user asks about ai.transcribe(), ai.speak(), signature audio inputs or outputs, agent audio behavior, .chat() conversational audio, OpenAI audio or realtime models, Gemini Live native audio, Grok Voice Agent models, voices, formats, transcripts, or how audio fits with structured outputs.

```
USAGE
  $ claude claude skill ax-audio [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct audio code with @ax-llm/ax. Use when the user asks about ai.transcribe(),
  ai.speak(), signature audio inputs or outputs, agent audio behavior, .chat() conversational audio, OpenAI audio or
  realtime models, Gemini Live native audio, Grok Voice Agent models, voices, formats, transcripts, or how audio fits
  with structured outputs.
```

## `claude claude skill ax-flow [INPUT]`

This skill helps an LLM generate correct AxFlow workflow code using @ax-llm/ax. Use when the user asks about flow(), AxFlow, workflow orchestration, parallel execution, DAG workflows, conditional routing, map/reduce patterns, or multi-node AI pipelines.

```
USAGE
  $ claude claude skill ax-flow [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxFlow workflow code using @ax-llm/ax. Use when the user asks about flow(),
  AxFlow, workflow orchestration, parallel execution, DAG workflows, conditional routing, map/reduce patterns, or
  multi-node AI pipelines.
```

## `claude claude skill ax-gen [INPUT]`

This skill helps an LLM generate correct AxGen code using @ax-llm/ax. Use when the user asks about ax(), AxGen, generators, forward(), streamingForward(), validation, assertions, streaming assertions, field processors, step hooks, self-tuning, or structured outputs.

```
USAGE
  $ claude claude skill ax-gen [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxGen code using @ax-llm/ax. Use when the user asks about ax(), AxGen,
  generators, forward(), streamingForward(), validation, assertions, streaming assertions, field processors, step hooks,
  self-tuning, or structured outputs.
```

## `claude claude skill ax-gepa [INPUT]`

This skill helps an LLM generate correct AxGEPA optimization code using @ax-llm/ax. Use when the user asks about AxGEPA, GEPA, Pareto optimization, multi-objective prompt tuning, reflective prompt evolution, validationExamples, maxMetricCalls, or optimizing a generator, flow, or agent tree.

```
USAGE
  $ claude claude skill ax-gepa [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct AxGEPA optimization code using @ax-llm/ax. Use when the user asks about
  AxGEPA, GEPA, Pareto optimization, multi-objective prompt tuning, reflective prompt evolution, validationExamples,
  maxMetricCalls, or optimizing a generator, flow, or agent tree.
```

## `claude claude skill ax-llm [INPUT]`

This skill helps with using the @ax-llm/ax TypeScript library for building LLM applications. Use when the user asks about ax(), ai(), f(), s(), agent(), flow(), AxGen, AxAgent, AxFlow, signatures, streaming, or mentions @ax-llm/ax.

```
USAGE
  $ claude claude skill ax-llm [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps with using the @ax-llm/ax TypeScript library for building LLM applications. Use when the user asks
  about ax(), ai(), f(), s(), agent(), flow(), AxGen, AxAgent, AxFlow, signatures, streaming, or mentions @ax-llm/ax.
```

## `claude claude skill ax-refine [INPUT]`

Use this skill when writing or reviewing Ax bestOfN/refine code, reward functions, thresholds, native sample selection, serial attempts, generated advice, and attempt diagnostics.

```
USAGE
  $ claude claude skill ax-refine [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill when writing or reviewing Ax bestOfN/refine code, reward functions, thresholds, native sample
  selection, serial attempts, generated advice, and attempt diagnostics.
```

## `claude claude skill ax-signature [INPUT]`

This skill helps an LLM generate correct DSPy signature code using @ax-llm/ax. Use when the user asks about signatures, s(), f(), field types, string syntax, fluent builder API, validation constraints, or type-safe inputs/outputs.

```
USAGE
  $ claude claude skill ax-signature [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps an LLM generate correct DSPy signature code using @ax-llm/ax. Use when the user asks about
  signatures, s(), f(), field types, string syntax, fluent builder API, validation constraints, or type-safe
  inputs/outputs.
```

## `claude claude skill batch [INPUT]`

Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.

```
USAGE
  $ claude claude skill batch [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  <instruction>

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each
  open a PR.
```

## `claude claude skill browse-seeking admin-portal [INPUT]`

This skill should be used when verifying admin portal pages or business logic changes at https://admin-{test_env}.seeking.com. Use when a peer-review verification step has strategy "admin_portal", when navigating the Seeking admin dashboard to inspect member profiles, manage settings, apply moderation actions, or confirm backend changes are reflected in the admin UI.

```
USAGE
  $ claude claude skill browse-seeking admin-portal [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when verifying admin portal pages or business logic changes at
  https://admin-{test_env}.seeking.com. Use when a peer-review verification step has strategy "admin_portal", when
  navigating the Seeking admin dashboard to inspect member profiles, manage settings, apply moderation actions, or
  confirm backend changes are reflected in the admin UI.
```

## `claude claude skill browse-seeking webapp [INPUT]`

This skill should be used when verifying member-facing webapp features or user flows at https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp", when testing registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend feature visible to members.

```
USAGE
  $ claude claude skill browse-seeking webapp [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when verifying member-facing webapp features or user flows at
  https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp", when testing
  registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend feature
  visible to members.
```

## `claude claude skill browse-seeking webapp-mobile [INPUT]`

This skill should be used when verifying member-facing webapp features or user flows on mobile view (iPhone 15) at https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp-mobile", when testing registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend feature visible to members on mobile devices.

```
USAGE
  $ claude claude skill browse-seeking webapp-mobile [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when verifying member-facing webapp features or user flows on mobile view (iPhone 15) at
  https://members-{test_env}.seeking.com. Use when a peer-review verification step has strategy "webapp-mobile", when
  testing registration, login, profile management, search and discovery, messaging, subscription flows, or any frontend
  feature visible to members on mobile devices.
```

## `claude claude skill claude-api [INPUT]`

Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token counting, model migration.

```
USAGE
  $ claude claude skill claude-api [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching,
  token counting, model migration.
  TRIGGER — read BEFORE opening the target file; don't skip because it "looks like a one-liner" — whenever: the prompt
  names Claude/Anthropic in any form (Claude, Anthropic, Fable, Opus, Sonnet, Haiku, `anthropic`, `@anthropic-ai`,
  `claude-*`, `us.anthropic.*`, `[1m]`); the user asks about an LLM (pricing/model choice/limits/caching) — never answer
  from memory; OR the task is LLM-shaped with provider unstated
  (agent/MCP/tool-definition/multi-agent/RAG/LLM-judge/computer-use;
  generate/summarize/extract/classify/rewrite/converse over NL; debugging refusals/cutoffs/streaming/tool-calls/tokens).
  SKIP only when another provider is being worked on (overrides all triggers):
  OpenAI/GPT/Gemini/Llama/Mistral/Cohere/Ollama named in the query; OR `grep -rE
  'openai|langchain_openai|google.generativeai|genai|mistralai|cohere|ollama'` over the project hits (run this grep
  FIRST if no provider named — don't Read the file).
```

## `claude claude skill claude-md-management claude-md-improver [INPUT]`

Audit and improve CLAUDE.md files in repositories. Use when user asks to check, audit, update, improve, or fix CLAUDE.md files. Scans for all CLAUDE.md files, evaluates quality against templates, outputs quality report, then makes targeted updates. Also use when the user mentions "CLAUDE.md maintenance" or "project memory optimization".

```
USAGE
  $ claude claude skill claude-md-management claude-md-improver [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Audit and improve CLAUDE.md files in repositories. Use when user asks to check, audit, update, improve, or fix
  CLAUDE.md files. Scans for all CLAUDE.md files, evaluates quality against templates, outputs quality report, then
  makes targeted updates. Also use when the user mentions "CLAUDE.md maintenance" or "project memory optimization".
```

## `claude claude skill code-refactoring refactoring [INPUT]`

This skill should be used when the user asks to "refactor this code", "identify code smells", "clean up this class", "fix this design", "this method is too long", "reduce duplication", "simplify this conditional", "improve code quality", "detect code smell", "what refactoring should I apply", "how do I fix feature envy", "how do I fix large class", or asks about any named code smell or refactoring technique from Fowler or Kerievsky.

```
USAGE
  $ claude claude skill code-refactoring refactoring [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "refactor this code", "identify code smells", "clean up this class",
  "fix this design", "this method is too long", "reduce duplication", "simplify this conditional", "improve code
  quality", "detect code smell", "what refactoring should I apply", "how do I fix feature envy", "how do I fix large
  class", or asks about any named code smell or refactoring technique from Fowler or Kerievsky.
```

## `claude claude skill code-review [INPUT]`

Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings). Pass --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.

```
USAGE
  $ claude claude skill code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [low|medium|high|xhigh|max] [--fix] [--comment] [<target>]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level
  (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings). Pass
  --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.
```

## `claude claude skill codex adversarial-review [INPUT]`

Run a Codex review that challenges the implementation approach and design choices

```
USAGE
  $ claude claude skill codex adversarial-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [--wait|--background] [--base <ref>] [--scope auto|working-tree|branch] [focus ...]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a Codex review that challenges the implementation approach and design choices
```

## `claude claude skill codex cancel [INPUT]`

Cancel an active background Codex job in this repository

```
USAGE
  $ claude claude skill codex cancel [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [job-id]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Cancel an active background Codex job in this repository
```

## `claude claude skill codex result [INPUT]`

Show the stored final output for a finished Codex job in this repository

```
USAGE
  $ claude claude skill codex result [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [job-id]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Show the stored final output for a finished Codex job in this repository
```

## `claude claude skill codex review [INPUT]`

Run a Codex code review against local git state

```
USAGE
  $ claude claude skill codex review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [--wait|--background] [--base <ref>] [--scope auto|working-tree|branch]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a Codex code review against local git state
```

## `claude claude skill codex status [INPUT]`

Show active and recent Codex jobs for this repository, including review-gate status

```
USAGE
  $ claude claude skill codex status [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [job-id] [--wait] [--timeout-ms <ms>] [--all]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Show active and recent Codex jobs for this repository, including review-gate status
```

## `claude claude skill dataviz [INPUT]`

Use this skill whenever you are about to create ANY chart, graph, plot, dashboard, or data visualization, in ANY output medium — an HTML or React artifact, inline SVG, plotting code in any library (matplotlib, plotly, d3, Recharts, …), an image/PNG you will render and upload, or a chart shared into Slack. Read it BEFORE writing the first line of chart code, choosing chart colors, building a stat tile / meter / KPI row, or laying out a dashboard. Produces visualizations that read as one system — elegant, accessible, consistent in light and dark — using a brand-neutral placeholder palette you swap for your own. Teaches a design-system-agnostic method: a form heuristic, a color formula with a runnable validator, mark specs, and interaction rules. A validated default palette is documented in `references/palette.md` — swap that file's values for your brand's. Triggers on: "chart", "graph", "plot", "data viz", "visualization", "dashboard", "analytics", "visualize data", "categorical colors", "sequential / diverging palette", "stat tile", "sparkline", "heatmap", "legend", "axis", "tooltip", "chart colors", "color by series".

```
USAGE
  $ claude claude skill dataviz [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill whenever you are about to create ANY chart, graph, plot, dashboard, or data visualization, in ANY
  output medium — an HTML or React artifact, inline SVG, plotting code in any library (matplotlib, plotly, d3, Recharts,
  …), an image/PNG you will render and upload, or a chart shared into Slack. Read it BEFORE writing the first line of
  chart code, choosing chart colors, building a stat tile / meter / KPI row, or laying out a dashboard. Produces
  visualizations that read as one system — elegant, accessible, consistent in light and dark — using a brand-neutral
  placeholder palette you swap for your own. Teaches a design-system-agnostic method: a form heuristic, a color formula
  with a runnable validator, mark specs, and interaction rules. A validated default palette is documented in
  `references/palette.md` — swap that file's values for your brand's. Triggers on: "chart", "graph", "plot", "data viz",
  "visualization", "dashboard", "analytics", "visualize data", "categorical colors", "sequential / diverging palette",
  "stat tile", "sparkline", "heatmap", "legend", "axis", "tooltip", "chart colors", "color by series".
```

## `claude claude skill debug [INPUT]`

Enable debug logging for this session and help diagnose issues

```
USAGE
  $ claude claude skill debug [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [issue description]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Enable debug logging for this session and help diagnose issues
```

## `claude claude skill deep-research [INPUT]`

Deep research harness — fan-out web searches, fetch sources, adversarially verify claims, synthesize a cited report. (dynamic workflow)

```
USAGE
  $ claude claude skill deep-research [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Deep research harness — fan-out web searches, fetch sources, adversarially verify claims, synthesize a cited report.
  (dynamic workflow)
```

## `claude claude skill design-patterns design-patterns [INPUT]`

This skill should be used when the user asks to "implement singleton", "apply observer pattern", "use factory method", "implement strategy pattern", "add decorator pattern", "which design pattern should I use", "how should I structure this code", "I need to decouple these classes", "refactor using a pattern", "which pattern fits this problem", "I have a telescoping constructor", "switch on type problem", "add behavior without subclassing", "need undo/redo", or mentions any GoF pattern by name. Covers all 22 GoF patterns across Creational, Structural, and Behavioral categories with guidance on when to apply — and when not to — each pattern.

```
USAGE
  $ claude claude skill design-patterns design-patterns [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "implement singleton", "apply observer pattern", "use factory method",
  "implement strategy pattern", "add decorator pattern", "which design pattern should I use", "how should I structure
  this code", "I need to decouple these classes", "refactor using a pattern", "which pattern fits this problem", "I have
  a telescoping constructor", "switch on type problem", "add behavior without subclassing", "need undo/redo", or
  mentions any GoF pattern by name. Covers all 22 GoF patterns across Creational, Structural, and Behavioral categories
  with guidance on when to apply — and when not to — each pattern.
```

## `claude claude skill design-sync [INPUT]`

Push a React design system to claude.ai/design. This runs a converter that bundles the real component code (from Storybook or a bare package) and uploads it. Use when the user runs /design-sync or says "sync my design system to Claude Design".

```
USAGE
  $ claude claude skill design-sync [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [<project hint, e.g. "Acme DS">]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Push a React design system to claude.ai/design. This runs a converter that bundles the real component code (from
  Storybook or a bare package) and uploads it. Use when the user runs /design-sync or says "sync my design system to
  Claude Design".
```

## `claude claude skill fewer-permission-prompts [INPUT]`

Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritized allowlist to project .claude/settings.json to reduce permission prompts.

```
USAGE
  $ claude claude skill fewer-permission-prompts [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritized allowlist to project
  .claude/settings.json to reduce permission prompts.
```

## `claude claude skill figma figma-code-connect [INPUT]`

Creates and maintains Figma Code Connect template files that map Figma components to code snippets. Use when the user mentions Code Connect, Figma component mapping, design-to-code translation, or asks to create/update .figma.ts or .figma.js files.

```
USAGE
  $ claude claude skill figma figma-code-connect [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Creates and maintains Figma Code Connect template files that map Figma components to code snippets. Use when the user
  mentions Code Connect, Figma component mapping, design-to-code translation, or asks to create/update .figma.ts or
  .figma.js files.
```

## `claude claude skill figma figma-create-new-file [INPUT]`

**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `create_new_file` tool call. NEVER call `create_new_file` directly without loading this skill first. Trigger whenever the user wants a new blank Figma file — a new design, FigJam, or Slides file — or when you need a fresh file before calling `use_figma`. Usage — /figma-create-new-file [editorType] [fileName] (e.g. /figma-create-new-file figjam My Whiteboard, /figma-create-new-file slides Q3 Review)

```
USAGE
  $ claude claude skill figma figma-create-new-file [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `create_new_file` tool call. NEVER call
  `create_new_file` directly without loading this skill first. Trigger whenever the user wants a new blank Figma file —
  a new design, FigJam, or Slides file — or when you need a fresh file before calling `use_figma`. Usage —
  /figma-create-new-file [editorType] [fileName] (e.g. /figma-create-new-file figjam My Whiteboard,
  /figma-create-new-file slides Q3 Review)
```

## `claude claude skill figma figma-generate-design [INPUT]`

Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page and build it in Figma', 'create a screen', 'build a landing page in Figma', 'update the Figma screen to match code', 'convert this modal/dialog/drawer/panel to Figma'. This is the preferred workflow skill whenever the user wants to build or update a full page, modal, dialog, drawer, sidebar, panel, or any composed multi-section view in Figma from code or a description. Discovers design system components, variables, and styles from Code Connect files, existing screens, and library search, then imports them and assembles views incrementally section-by-section using design system tokens instead of hardcoded values.

```
USAGE
  $ claude claude skill figma figma-generate-design [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section
  layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page
  and build it in Figma', 'create a screen', 'build a landing page in Figma', 'update the Figma screen to match code',
  'convert this modal/dialog/drawer/panel to Figma'. This is the preferred workflow skill whenever the user wants to
  build or update a full page, modal, dialog, drawer, sidebar, panel, or any composed multi-section view in Figma from
  code or a description. Discovers design system components, variables, and styles from Code Connect files, existing
  screens, and library search, then imports them and assembles views incrementally section-by-section using design
  system tokens instead of hardcoded values.
```

## `claude claude skill figma figma-generate-diagram [INPUT]`

MANDATORY prerequisite — load this skill BEFORE every `generate_diagram` tool call. NEVER call `generate_diagram` directly without loading this skill first. Trigger whenever the user asks to create, generate, draw, render, sketch, or build a diagram — flowchart, architecture diagram, sequence diagram, ERD or entity-relationship diagram, state diagram or state machine, gantt chart, or timeline. Also trigger when the user mentions Mermaid syntax or wants a system architecture, decision tree, dependency graph, API call flow, auth handshake, schema, or pipeline visualized in FigJam. Routes to type-specific guidance, sets universal Mermaid constraints, and tells you when to use a different diagram type or skip the tool entirely (mindmaps, pie charts, class diagrams, etc.).

```
USAGE
  $ claude claude skill figma figma-generate-diagram [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  MANDATORY prerequisite — load this skill BEFORE every `generate_diagram` tool call. NEVER call `generate_diagram`
  directly without loading this skill first. Trigger whenever the user asks to create, generate, draw, render, sketch,
  or build a diagram — flowchart, architecture diagram, sequence diagram, ERD or entity-relationship diagram, state
  diagram or state machine, gantt chart, or timeline. Also trigger when the user mentions Mermaid syntax or wants a
  system architecture, decision tree, dependency graph, API call flow, auth handshake, schema, or pipeline visualized in
  FigJam. Routes to type-specific guidance, sets universal Mermaid constraints, and tells you when to use a different
  diagram type or skip the tool entirely (mindmaps, pie charts, class diagrams, etc.).
```

## `claude claude skill figma figma-generate-library [INPUT]`

Build or update a professional-grade design system in Figma from a codebase. Use when the user wants to create variables/tokens, build component libraries, create individual components with proper variant sets and variable bindings, set up theming (light/dark modes), document foundations, or reconcile gaps between code and Figma. Also use when the user asks to create or generate any component in Figma — even a single one — since components require proper variable foundations, variant states, and design token bindings to be production-quality. This skill teaches WHAT to build and in WHAT ORDER — it complements the `figma-use` skill which teaches HOW to call the Plugin API. Both skills should be loaded together.

```
USAGE
  $ claude claude skill figma figma-generate-library [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Build or update a professional-grade design system in Figma from a codebase. Use when the user wants to create
  variables/tokens, build component libraries, create individual components with proper variant sets and variable
  bindings, set up theming (light/dark modes), document foundations, or reconcile gaps between code and Figma. Also use
  when the user asks to create or generate any component in Figma — even a single one — since components require proper
  variable foundations, variant states, and design token bindings to be production-quality. This skill teaches WHAT to
  build and in WHAT ORDER — it complements the `figma-use` skill which teaches HOW to call the Plugin API. Both skills
  should be loaded together.
```

## `claude claude skill figma figma-implement-motion [INPUT]`

Translates Figma motion and animations into production-ready application code. Use when implementing animation/motion from a Figma design — user mentions "implement this motion", "add animation from Figma", "animate this component", provides a Figma URL whose node is animated, or when `get_design_context` returns motion data or instructs you to call `get_motion_context`.

```
USAGE
  $ claude claude skill figma figma-implement-motion [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Translates Figma motion and animations into production-ready application code. Use when implementing animation/motion
  from a Figma design — user mentions "implement this motion", "add animation from Figma", "animate this component",
  provides a Figma URL whose node is animated, or when `get_design_context` returns motion data or instructs you to call
  `get_motion_context`.
```

## `claude claude skill figma figma-swiftui [INPUT]`

SwiftUI ↔ Figma translation. Use whenever the user mentions Swift, SwiftUI, iOS, iPhone, or iPad — in EITHER direction — translating a Figma design into SwiftUI (design → code), or pushing SwiftUI views / screens / tokens back into a Figma file (code → design). Triggers on phrases like 'implement this Figma design in SwiftUI', 'build this screen in Swift', 'push this SwiftUI view to Figma', 'mirror my Swift code in a Figma file', or whenever a Figma URL appears alongside `.swift` files / an `.xcodeproj`. Routes to a direction-specific reference doc; loads alongside `figma-use` for the code → design path.

```
USAGE
  $ claude claude skill figma figma-swiftui [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  SwiftUI ↔ Figma translation. Use whenever the user mentions Swift, SwiftUI, iOS, iPhone, or iPad — in EITHER direction
  — translating a Figma design into SwiftUI (design → code), or pushing SwiftUI views / screens / tokens back into a
  Figma file (code → design). Triggers on phrases like 'implement this Figma design in SwiftUI', 'build this screen in
  Swift', 'push this SwiftUI view to Figma', 'mirror my Swift code in a Figma file', or whenever a Figma URL appears
  alongside `.swift` files / an `.xcodeproj`. Routes to a direction-specific reference doc; loads alongside `figma-use`
  for the code → design path.
```

## `claude claude skill figma figma-use [INPUT]`

**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically.

```
USAGE
  $ claude claude skill figma figma-use [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma`
  directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the
  user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file
  context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout
  or fills, bind variables to properties, or inspect file structure programmatically.
```

## `claude claude skill figma figma-use-figjam [INPUT]`

This skill helps agents use Figma's use_figma MCP tool in the FigJam context. Can be used alongside figma-use which has foundational context for using the use_figma tool.

```
USAGE
  $ claude claude skill figma figma-use-figjam [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps agents use Figma's use_figma MCP tool in the FigJam context. Can be used alongside figma-use which
  has foundational context for using the use_figma tool.
```

## `claude claude skill figma figma-use-motion [INPUT]`

Motion / animation context for the `use_figma` MCP tool — animating Figma nodes via manual keyframes, animation styles, easing, and timeline duration. Load alongside figma-use whenever a task involves adding, editing, or inspecting animation on a node.

```
USAGE
  $ claude claude skill figma figma-use-motion [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Motion / animation context for the `use_figma` MCP tool — animating Figma nodes via manual keyframes, animation
  styles, easing, and timeline duration. Load alongside figma-use whenever a task involves adding, editing, or
  inspecting animation on a node.
```

## `claude claude skill figma figma-use-slides [INPUT]`

This skill helps agents use Figma's use_figma MCP tool in the Slides context. Can be used alongside figma-use which has foundational context for using the use_figma tool.

```
USAGE
  $ claude claude skill figma figma-use-slides [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill helps agents use Figma's use_figma MCP tool in the Slides context. Can be used alongside figma-use which
  has foundational context for using the use_figma tool.
```

## `claude claude skill frontend-design frontend-design [INPUT]`

Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.

```
USAGE
  $ claude claude skill frontend-design frontend-design [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with
  aesthetic direction, typography, and making choices that don't read as templated defaults.
```

## `claude claude skill loop [INPUT]`

Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo). Omit the interval to let the model self-pace.

```
USAGE
  $ claude claude skill loop [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [interval] [prompt]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo). Omit the interval to let the model
  self-pace.
```

## `claude claude skill n8n-mcp-skills n8n-code-javascript [INPUT]`

Write JavaScript code in n8n Code nodes. Use when writing JavaScript in n8n, using $input/$json/$node syntax, making HTTP requests with $helpers, working with dates using DateTime, troubleshooting Code node errors, choosing between Code node modes, or doing any custom data transformation in n8n. Always use this skill when a workflow needs a Code node — whether for data aggregation, filtering, API calls, format conversion, batch processing logic, or any custom JavaScript. Covers SplitInBatches loop patterns, cross-iteration data, pairedItem, and real-world production patterns.

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-code-javascript [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Write JavaScript code in n8n Code nodes. Use when writing JavaScript in n8n, using $input/$json/$node syntax, making
  HTTP requests with $helpers, working with dates using DateTime, troubleshooting Code node errors, choosing between
  Code node modes, or doing any custom data transformation in n8n. Always use this skill when a workflow needs a Code
  node — whether for data aggregation, filtering, API calls, format conversion, batch processing logic, or any custom
  JavaScript. Covers SplitInBatches loop patterns, cross-iteration data, pairedItem, and real-world production patterns.
```

## `claude claude skill n8n-mcp-skills n8n-code-python [INPUT]`

Write Python code in n8n Code nodes. Use when writing Python in n8n, using _input/_json/_node syntax, working with standard library, or need to understand Python limitations in n8n Code nodes. Use this skill when the user specifically requests Python for an n8n Code node. Note — JavaScript is recommended for 95% of use cases — only use Python when the user explicitly prefers it or the task requires Python-specific standard library capabilities (regex, hashlib, statistics).

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-code-python [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Write Python code in n8n Code nodes. Use when writing Python in n8n, using _input/_json/_node syntax, working with
  standard library, or need to understand Python limitations in n8n Code nodes. Use this skill when the user
  specifically requests Python for an n8n Code node. Note — JavaScript is recommended for 95% of use cases — only use
  Python when the user explicitly prefers it or the task requires Python-specific standard library capabilities (regex,
  hashlib, statistics).
```

## `claude claude skill n8n-mcp-skills n8n-expression-syntax [INPUT]`

Validate n8n expression syntax and fix common errors. Use when writing n8n expressions, using {{}} syntax, accessing $json/$node variables, troubleshooting expression errors, mapping data between nodes, or referencing webhook data in workflows. Use this skill whenever configuring node fields that reference data from previous nodes — expressions are how n8n passes data between nodes, and getting the syntax wrong is the most common source of workflow errors.

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-expression-syntax [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Validate n8n expression syntax and fix common errors. Use when writing n8n expressions, using {{}} syntax, accessing
  $json/$node variables, troubleshooting expression errors, mapping data between nodes, or referencing webhook data in
  workflows. Use this skill whenever configuring node fields that reference data from previous nodes — expressions are
  how n8n passes data between nodes, and getting the syntax wrong is the most common source of workflow errors.
```

## `claude claude skill n8n-mcp-skills n8n-mcp-tools-expert [INPUT]`

Expert guide for using n8n-mcp MCP tools effectively. Use when searching for nodes, validating configurations, accessing templates, managing workflows, managing credentials, auditing instance security, or using any n8n-mcp tool. Provides tool selection guidance, parameter formats, and common patterns. IMPORTANT — Always consult this skill before calling any n8n-mcp tool — it prevents common mistakes like wrong nodeType formats, incorrect parameter structures, and inefficient tool usage. If the user mentions n8n, workflows, nodes, or automation and you have n8n MCP tools available, use this skill first.

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-mcp-tools-expert [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Expert guide for using n8n-mcp MCP tools effectively. Use when searching for nodes, validating configurations,
  accessing templates, managing workflows, managing credentials, auditing instance security, or using any n8n-mcp tool.
  Provides tool selection guidance, parameter formats, and common patterns. IMPORTANT — Always consult this skill before
  calling any n8n-mcp tool — it prevents common mistakes like wrong nodeType formats, incorrect parameter structures,
  and inefficient tool usage. If the user mentions n8n, workflows, nodes, or automation and you have n8n MCP tools
  available, use this skill first.
```

## `claude claude skill n8n-mcp-skills n8n-node-configuration [INPUT]`

Operation-aware node configuration guidance. Use when configuring nodes, understanding property dependencies, determining required fields, choosing between get_node detail levels, or learning common configuration patterns by node type. Always use this skill when setting up node parameters — it explains which fields are required for each operation, how displayOptions control field visibility, and when to use patchNodeField for surgical edits vs full node updates.

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-node-configuration [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Operation-aware node configuration guidance. Use when configuring nodes, understanding property dependencies,
  determining required fields, choosing between get_node detail levels, or learning common configuration patterns by
  node type. Always use this skill when setting up node parameters — it explains which fields are required for each
  operation, how displayOptions control field visibility, and when to use patchNodeField for surgical edits vs full node
  updates.
```

## `claude claude skill n8n-mcp-skills n8n-validation-expert [INPUT]`

Interpret validation errors and guide fixing them. Use when encountering validation errors, validation warnings, false positives, operator structure issues, or need help understanding validation results. Also use when asking about validation profiles, error types, the validation loop process, or auto-fix capabilities. Consult this skill whenever a validate_node or validate_workflow call returns errors or warnings — it knows which warnings are false positives and which errors need real fixes.

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-validation-expert [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Interpret validation errors and guide fixing them. Use when encountering validation errors, validation warnings, false
  positives, operator structure issues, or need help understanding validation results. Also use when asking about
  validation profiles, error types, the validation loop process, or auto-fix capabilities. Consult this skill whenever a
  validate_node or validate_workflow call returns errors or warnings — it knows which warnings are false positives and
  which errors need real fixes.
```

## `claude claude skill n8n-mcp-skills n8n-workflow-patterns [INPUT]`

Proven workflow architectural patterns from real n8n workflows. Use when building new workflows, designing workflow structure, choosing workflow patterns, planning workflow architecture, or asking about webhook processing, HTTP API integration, database operations, AI agent workflows, batch processing, or scheduled tasks. Always consult this skill when the user asks to create, build, or design an n8n workflow, automate a process, or connect services — even if they don't explicitly mention 'patterns'. Covers webhook, API, database, AI, batch processing, and scheduled automation architectures.

```
USAGE
  $ claude claude skill n8n-mcp-skills n8n-workflow-patterns [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Proven workflow architectural patterns from real n8n workflows. Use when building new workflows, designing workflow
  structure, choosing workflow patterns, planning workflow architecture, or asking about webhook processing, HTTP API
  integration, database operations, AI agent workflows, batch processing, or scheduled tasks. Always consult this skill
  when the user asks to create, build, or design an n8n workflow, automate a process, or connect services — even if they
  don't explicitly mention 'patterns'. Covers webhook, API, database, AI, batch processing, and scheduled automation
  architectures.
```

## `claude claude skill plugin-dev agent-development [INPUT]`

This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent frontmatter", "when to use description", "agent examples", "agent tools", "agent colors", "autonomous agent", or needs guidance on agent structure, system prompts, triggering conditions, or agent development best practices for Claude Code plugins.

```
USAGE
  $ claude claude skill plugin-dev agent-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent
  frontmatter", "when to use description", "agent examples", "agent tools", "agent colors", "autonomous agent", or needs
  guidance on agent structure, system prompts, triggering conditions, or agent development best practices for Claude
  Code plugins.
```

## `claude claude skill plugin-dev command-development [INPUT]`

This skill should be used when the user asks to "create a slash command", "add a command", "write a custom command", "define command arguments", "use command frontmatter", "organize commands", "create command with file references", "interactive command", "use AskUserQuestion in command", or needs guidance on slash command structure, YAML frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development best practices for Claude Code.

```
USAGE
  $ claude claude skill plugin-dev command-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create a slash command", "add a command", "write a custom command",
  "define command arguments", "use command frontmatter", "organize commands", "create command with file references",
  "interactive command", "use AskUserQuestion in command", or needs guidance on slash command structure, YAML
  frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development
  best practices for Claude Code.
```

## `claude claude skill plugin-dev hook-development [INPUT]`

This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate tool use", "implement prompt-based hooks", "use ${CLAUDE_PLUGIN_ROOT}", "set up event-driven automation", "block dangerous commands", or mentions hook events (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd, UserPromptSubmit, PreCompact, Notification). Provides comprehensive guidance for creating and implementing Claude Code plugin hooks with focus on advanced prompt-based hooks API.

```
USAGE
  $ claude claude skill plugin-dev hook-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate
  tool use", "implement prompt-based hooks", "use ${CLAUDE_PLUGIN_ROOT}", "set up event-driven automation", "block
  dangerous commands", or mentions hook events (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd,
  UserPromptSubmit, PreCompact, Notification). Provides comprehensive guidance for creating and implementing Claude Code
  plugin hooks with focus on advanced prompt-based hooks API.
```

## `claude claude skill plugin-dev mcp-integration [INPUT]`

This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use .mcp.json", "set up Model Context Protocol", "connect external service", mentions "${CLAUDE_PLUGIN_ROOT} with MCP", or discusses MCP server types (SSE, stdio, HTTP, WebSocket). Provides comprehensive guidance for integrating Model Context Protocol servers into Claude Code plugins for external tool and service integration.

```
USAGE
  $ claude claude skill plugin-dev mcp-integration [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use
  .mcp.json", "set up Model Context Protocol", "connect external service", mentions "${CLAUDE_PLUGIN_ROOT} with MCP", or
  discusses MCP server types (SSE, stdio, HTTP, WebSocket). Provides comprehensive guidance for integrating Model
  Context Protocol servers into Claude Code plugins for external tool and service integration.
```

## `claude claude skill plugin-dev plugin-settings [INPUT]`

This skill should be used when the user asks about "plugin settings", "store plugin configuration", "user-configurable plugin", ".local.md files", "plugin state files", "read YAML frontmatter", "per-project plugin settings", or wants to make plugin behavior configurable. Documents the .claude/plugin-name.local.md pattern for storing plugin-specific configuration with YAML frontmatter and markdown content.

```
USAGE
  $ claude claude skill plugin-dev plugin-settings [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks about "plugin settings", "store plugin configuration", "user-configurable
  plugin", ".local.md files", "plugin state files", "read YAML frontmatter", "per-project plugin settings", or wants to
  make plugin behavior configurable. Documents the .claude/plugin-name.local.md pattern for storing plugin-specific
  configuration with YAML frontmatter and markdown content.
```

## `claude claude skill plugin-dev plugin-structure [INPUT]`

This skill should be used when the user asks to "create a plugin", "scaffold a plugin", "understand plugin structure", "organize plugin components", "set up plugin.json", "use ${CLAUDE_PLUGIN_ROOT}", "add commands/agents/skills/hooks", "configure auto-discovery", or needs guidance on plugin directory layout, manifest configuration, component organization, file naming conventions, or Claude Code plugin architecture best practices.

```
USAGE
  $ claude claude skill plugin-dev plugin-structure [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "create a plugin", "scaffold a plugin", "understand plugin structure",
  "organize plugin components", "set up plugin.json", "use ${CLAUDE_PLUGIN_ROOT}", "add commands/agents/skills/hooks",
  "configure auto-discovery", or needs guidance on plugin directory layout, manifest configuration, component
  organization, file naming conventions, or Claude Code plugin architecture best practices.
```

## `claude claude skill plugin-dev skill-development [INPUT]`

This skill should be used when the user wants to "create a skill", "add a skill to plugin", "write a new skill", "improve skill description", "organize skill content", or needs guidance on skill structure, progressive disclosure, or skill development best practices for Claude Code plugins.

```
USAGE
  $ claude claude skill plugin-dev skill-development [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user wants to "create a skill", "add a skill to plugin", "write a new skill",
  "improve skill description", "organize skill content", or needs guidance on skill structure, progressive disclosure,
  or skill development best practices for Claude Code plugins.
```

## `claude claude skill prompt-engineering prompt-engineering [INPUT]`

This skill should be used when the user asks to "improve this prompt", "optimize my prompt", "rewrite this prompt", "make this prompt better", "review my prompt", "fix my system prompt", "why isn't my prompt working", "apply prompt engineering best practices", "my prompt gives inconsistent results", "the model ignores my instructions", or shares an existing prompt and wants higher-quality, more reliable, or more consistent outputs from an LLM.

```
USAGE
  $ claude claude skill prompt-engineering prompt-engineering [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "improve this prompt", "optimize my prompt", "rewrite this prompt",
  "make this prompt better", "review my prompt", "fix my system prompt", "why isn't my prompt working", "apply prompt
  engineering best practices", "my prompt gives inconsistent results", "the model ignores my instructions", or shares an
  existing prompt and wants higher-quality, more reliable, or more consistent outputs from an LLM.
```

## `claude claude skill reflex-workflows jira-intake-analyzer [INPUT]`

Analyzes a Jira ticket for developer intake readiness. Returns a verdict (APPROVED, NEEDS ATTENTION, NO ACTION, or ERROR) with a per-dimension breakdown explaining the reasoning.

```
USAGE
  $ claude claude skill reflex-workflows jira-intake-analyzer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Analyzes a Jira ticket for developer intake readiness. Returns a verdict (APPROVED, NEEDS ATTENTION, NO ACTION, or
  ERROR) with a per-dimension breakdown explaining the reasoning.
```

## `claude claude skill reflex-workflows jira-plan-implementer [INPUT]`

Implements a plan.md produced by jira-plan-writer. Creates a git worktree, executes tasks, runs scoped tests, iterates on review until passing, commits, pushes, and opens a PR. Returns a verdict the orchestrator acts on.

```
USAGE
  $ claude claude skill reflex-workflows jira-plan-implementer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Implements a plan.md produced by jira-plan-writer. Creates a git worktree, executes tasks, runs scoped tests, iterates
  on review until passing, commits, pushes, and opens a PR. Returns a verdict the orchestrator acts on.
```

## `claude claude skill reflex-workflows jira-plan-writer [INPUT]`

Writes a comprehensive, zero-context implementation plan for an Approved Jira ticket. Greps the codebase for exact file paths, generates real code snippets, and saves a checkbox-driven plan.md the engineer can execute task-by-task.

```
USAGE
  $ claude claude skill reflex-workflows jira-plan-writer [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Writes a comprehensive, zero-context implementation plan for an Approved Jira ticket. Greps the codebase for exact
  file paths, generates real code snippets, and saves a checkbox-driven plan.md the engineer can execute task-by-task.
```

## `claude claude skill remotion-best-practices [INPUT]`

Best practices for Remotion - Video creation in React

```
USAGE
  $ claude claude skill remotion-best-practices [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Best practices for Remotion - Video creation in React
```

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

_See code: [src/commands/claude/skill/run.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/skill/run.ts)_

## `claude claude skill run-skill-generator [INPUT]`

Author or improve the run-<unit> skill — a per-project skill that tells agents how to build, launch, and drive this project's app. Use when the user asks to set up the project, get it running, write run instructions, or verify build/run steps work from a clean environment.

```
USAGE
  $ claude claude skill run-skill-generator [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Author or improve the run-<unit> skill — a per-project skill that tells agents how to build, launch, and drive this
  project's app. Use when the user asks to set up the project, get it running, write run instructions, or verify
  build/run steps work from a clean environment.
```

## `claude claude skill sentry sentry-android-sdk [INPUT]`

Full Sentry SDK setup for Android. Use when asked to "add Sentry to Android", "install sentry-android", "setup Sentry in Android", or configure error monitoring, tracing, profiling, session replay, or logging for Android applications. Supports Kotlin and Java codebases.

```
USAGE
  $ claude claude skill sentry sentry-android-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Android. Use when asked to "add Sentry to Android", "install sentry-android", "setup Sentry
  in Android", or configure error monitoring, tracing, profiling, session replay, or logging for Android applications.
  Supports Kotlin and Java codebases.
```

## `claude claude skill sentry sentry-browser-sdk [INPUT]`

Full Sentry SDK setup for browser JavaScript. Use when asked to "add Sentry to a website", "install @sentry/browser", or configure error monitoring, tracing, session replay, or logging for vanilla JavaScript, jQuery, static sites, or WordPress.

```
USAGE
  $ claude claude skill sentry sentry-browser-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for browser JavaScript. Use when asked to "add Sentry to a website", "install @sentry/browser",
  or configure error monitoring, tracing, session replay, or logging for vanilla JavaScript, jQuery, static sites, or
  WordPress.
```

## `claude claude skill sentry sentry-cloudflare-sdk [INPUT]`

Full Sentry SDK setup for Cloudflare Workers and Pages. Use when asked to "add Sentry to Cloudflare Workers", "install @sentry/cloudflare", or configure error monitoring, tracing, logging, crons, or AI monitoring for Cloudflare Workers, Pages, Durable Objects, Queues, Workflows, or Hono on Cloudflare.

```
USAGE
  $ claude claude skill sentry sentry-cloudflare-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Cloudflare Workers and Pages. Use when asked to "add Sentry to Cloudflare Workers", "install
  @sentry/cloudflare", or configure error monitoring, tracing, logging, crons, or AI monitoring for Cloudflare Workers,
  Pages, Durable Objects, Queues, Workflows, or Hono on Cloudflare.
```

## `claude claude skill sentry sentry-cocoa-sdk [INPUT]`

Full Sentry SDK setup for Apple platforms (iOS, macOS, tvOS, watchOS, visionOS). Use when asked to "add Sentry to iOS", "add Sentry to Swift", "install sentry-cocoa", or configure error monitoring, tracing, profiling, session replay, or logging for Apple applications. Supports SwiftUI and UIKit.

```
USAGE
  $ claude claude skill sentry sentry-cocoa-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Apple platforms (iOS, macOS, tvOS, watchOS, visionOS). Use when asked to "add Sentry to
  iOS", "add Sentry to Swift", "install sentry-cocoa", or configure error monitoring, tracing, profiling, session
  replay, or logging for Apple applications. Supports SwiftUI and UIKit.
```

## `claude claude skill sentry sentry-code-review [INPUT]`

Analyze and resolve Sentry comments on GitHub Pull Requests. Use this when asked to review or fix issues identified by Sentry in PR comments. Can review specific PRs by number or automatically find recent PRs with Sentry feedback.

```
USAGE
  $ claude claude skill sentry sentry-code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Analyze and resolve Sentry comments on GitHub Pull Requests. Use this when asked to review or fix issues identified by
  Sentry in PR comments. Can review specific PRs by number or automatically find recent PRs with Sentry feedback.
```

## `claude claude skill sentry sentry-create-alert [INPUT]`

Create Sentry alerts using the workflow engine API. Use when asked to create alerts, set up notifications, configure issue priority alerts, or build workflow automations. Supports email, Slack, PagerDuty, Discord, and other notification actions.

```
USAGE
  $ claude claude skill sentry sentry-create-alert [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Create Sentry alerts using the workflow engine API. Use when asked to create alerts, set up notifications, configure
  issue priority alerts, or build workflow automations. Supports email, Slack, PagerDuty, Discord, and other
  notification actions.
```

## `claude claude skill sentry sentry-dotnet-sdk [INPUT]`

Full Sentry SDK setup for .NET. Use when asked to "add Sentry to .NET", "install Sentry for C#", or configure error monitoring, tracing, profiling, logging, or crons for ASP.NET Core, MAUI, WPF, WinForms, Blazor, Azure Functions, or any other .NET application.

```
USAGE
  $ claude claude skill sentry sentry-dotnet-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for .NET. Use when asked to "add Sentry to .NET", "install Sentry for C#", or configure error
  monitoring, tracing, profiling, logging, or crons for ASP.NET Core, MAUI, WPF, WinForms, Blazor, Azure Functions, or
  any other .NET application.
```

## `claude claude skill sentry sentry-elixir-sdk [INPUT]`

Full Sentry SDK setup for Elixir. Use when asked to "add Sentry to Elixir", "install sentry for Elixir", or configure error monitoring, tracing, logging, or crons for Elixir, Phoenix, or Plug applications. Supports Phoenix, Plug, LiveView, Oban, and Quantum.

```
USAGE
  $ claude claude skill sentry sentry-elixir-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Elixir. Use when asked to "add Sentry to Elixir", "install sentry for Elixir", or configure
  error monitoring, tracing, logging, or crons for Elixir, Phoenix, or Plug applications. Supports Phoenix, Plug,
  LiveView, Oban, and Quantum.
```

## `claude claude skill sentry sentry-feature-setup [INPUT]`

Configure specific Sentry features beyond basic SDK setup. Use when asked to monitor AI/LLM calls, set up OpenTelemetry pipelines, or create alerts and notifications.

```
USAGE
  $ claude claude skill sentry sentry-feature-setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Configure specific Sentry features beyond basic SDK setup. Use when asked to monitor AI/LLM calls, set up
  OpenTelemetry pipelines, or create alerts and notifications.
```

## `claude claude skill sentry sentry-fix-issues [INPUT]`

Find and fix issues from Sentry using MCP. Use when asked to fix Sentry errors, debug production issues, investigate exceptions, or resolve bugs reported in Sentry. Methodically analyzes stack traces, breadcrumbs, traces, and context to identify root causes.

```
USAGE
  $ claude claude skill sentry sentry-fix-issues [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Find and fix issues from Sentry using MCP. Use when asked to fix Sentry errors, debug production issues, investigate
  exceptions, or resolve bugs reported in Sentry. Methodically analyzes stack traces, breadcrumbs, traces, and context
  to identify root causes.
```

## `claude claude skill sentry sentry-flutter-sdk [INPUT]`

Full Sentry SDK setup for Flutter and Dart. Use when asked to "add Sentry to Flutter", "install sentry_flutter", "setup Sentry in Dart", or configure error monitoring, tracing, profiling, session replay, or logging for Flutter applications. Supports Android, iOS, macOS, Linux, Windows, and Web.

```
USAGE
  $ claude claude skill sentry sentry-flutter-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Flutter and Dart. Use when asked to "add Sentry to Flutter", "install sentry_flutter",
  "setup Sentry in Dart", or configure error monitoring, tracing, profiling, session replay, or logging for Flutter
  applications. Supports Android, iOS, macOS, Linux, Windows, and Web.
```

## `claude claude skill sentry sentry-go-sdk [INPUT]`

Full Sentry SDK setup for Go. Use when asked to "add Sentry to Go", "install sentry-go", "setup Sentry in Go", or configure error monitoring, tracing, logging, metrics, or crons for Go applications. Supports net/http, Gin, Echo, Fiber, FastHTTP, Iris, and Negroni.

```
USAGE
  $ claude claude skill sentry sentry-go-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Go. Use when asked to "add Sentry to Go", "install sentry-go", "setup Sentry in Go", or
  configure error monitoring, tracing, logging, metrics, or crons for Go applications. Supports net/http, Gin, Echo,
  Fiber, FastHTTP, Iris, and Negroni.
```

## `claude claude skill sentry sentry-nestjs-sdk [INPUT]`

Full Sentry SDK setup for NestJS. Use when asked to "add Sentry to NestJS", "install @sentry/nestjs", "setup Sentry in NestJS", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for NestJS applications. Supports Express and Fastify adapters, GraphQL, microservices, WebSockets, and background jobs.

```
USAGE
  $ claude claude skill sentry sentry-nestjs-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for NestJS. Use when asked to "add Sentry to NestJS", "install @sentry/nestjs", "setup Sentry in
  NestJS", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for NestJS
  applications. Supports Express and Fastify adapters, GraphQL, microservices, WebSockets, and background jobs.
```

## `claude claude skill sentry sentry-nextjs-sdk [INPUT]`

Full Sentry SDK setup for Next.js. Use when asked to "add Sentry to Next.js", "install @sentry/nextjs", or configure error monitoring, tracing, session replay, logging, profiling, AI monitoring, or crons for Next.js applications. Supports Next.js 13+ with App Router and Pages Router.

```
USAGE
  $ claude claude skill sentry sentry-nextjs-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Next.js. Use when asked to "add Sentry to Next.js", "install @sentry/nextjs", or configure
  error monitoring, tracing, session replay, logging, profiling, AI monitoring, or crons for Next.js applications.
  Supports Next.js 13+ with App Router and Pages Router.
```

## `claude claude skill sentry sentry-node-sdk [INPUT]`

Full Sentry SDK setup for Node.js, Bun, and Deno. Use when asked to "add Sentry to Node.js", "add Sentry to Bun", "add Sentry to Deno", "install @sentry/node", "@sentry/bun", or "@sentry/deno", or configure error monitoring, tracing, logging, profiling, metrics, crons, or AI monitoring for server-side JavaScript/TypeScript runtimes.

```
USAGE
  $ claude claude skill sentry sentry-node-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Node.js, Bun, and Deno. Use when asked to "add Sentry to Node.js", "add Sentry to Bun", "add
  Sentry to Deno", "install @sentry/node", "@sentry/bun", or "@sentry/deno", or configure error monitoring, tracing,
  logging, profiling, metrics, crons, or AI monitoring for server-side JavaScript/TypeScript runtimes.
```

## `claude claude skill sentry sentry-otel-exporter-setup [INPUT]`

Configure the OpenTelemetry Collector with Sentry Exporter for multi-project routing and automatic project creation. Use when setting up OTel with Sentry, configuring collector pipelines for traces and logs, or routing telemetry from multiple services to Sentry projects.

```
USAGE
  $ claude claude skill sentry sentry-otel-exporter-setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Configure the OpenTelemetry Collector with Sentry Exporter for multi-project routing and automatic project creation.
  Use when setting up OTel with Sentry, configuring collector pipelines for traces and logs, or routing telemetry from
  multiple services to Sentry projects.
```

## `claude claude skill sentry sentry-php-sdk [INPUT]`

Full Sentry SDK setup for PHP. Use when asked to "add Sentry to PHP", "install sentry/sentry", "setup Sentry in PHP", or configure error monitoring, tracing, profiling, logging, metrics, or crons for PHP applications. Supports plain PHP, Laravel, and Symfony.

```
USAGE
  $ claude claude skill sentry sentry-php-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for PHP. Use when asked to "add Sentry to PHP", "install sentry/sentry", "setup Sentry in PHP",
  or configure error monitoring, tracing, profiling, logging, metrics, or crons for PHP applications. Supports plain
  PHP, Laravel, and Symfony.
```

## `claude claude skill sentry sentry-pr-code-review [INPUT]`

Review a project's PRs to check for issues detected in code review by Seer Bug Prediction. Use when asked to review or fix issues identified by Sentry in PR comments, or to find recent PRs with Sentry feedback.

```
USAGE
  $ claude claude skill sentry sentry-pr-code-review [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review a project's PRs to check for issues detected in code review by Seer Bug Prediction. Use when asked to review or
  fix issues identified by Sentry in PR comments, or to find recent PRs with Sentry feedback.
```

## `claude claude skill sentry sentry-python-sdk [INPUT]`

Full Sentry SDK setup for Python. Use when asked to "add Sentry to Python", "install sentry-sdk", "setup Sentry in Python", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for Python applications. Supports Django, Flask, FastAPI, Celery, Starlette, AIOHTTP, Tornado, and more.

```
USAGE
  $ claude claude skill sentry sentry-python-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Python. Use when asked to "add Sentry to Python", "install sentry-sdk", "setup Sentry in
  Python", or configure error monitoring, tracing, profiling, logging, metrics, crons, or AI monitoring for Python
  applications. Supports Django, Flask, FastAPI, Celery, Starlette, AIOHTTP, Tornado, and more.
```

## `claude claude skill sentry sentry-react-native-sdk [INPUT]`

Full Sentry SDK setup for React Native and Expo. Use when asked to "add Sentry to React Native", "install @sentry/react-native", "setup Sentry in Expo", or configure error monitoring, tracing, profiling, session replay, or logging for React Native applications. Supports Expo managed, Expo bare, and vanilla React Native.

```
USAGE
  $ claude claude skill sentry sentry-react-native-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for React Native and Expo. Use when asked to "add Sentry to React Native", "install
  @sentry/react-native", "setup Sentry in Expo", or configure error monitoring, tracing, profiling, session replay, or
  logging for React Native applications. Supports Expo managed, Expo bare, and vanilla React Native.
```

## `claude claude skill sentry sentry-react-sdk [INPUT]`

Full Sentry SDK setup for React. Use when asked to "add Sentry to React", "install @sentry/react", or configure error monitoring, tracing, session replay, profiling, or logging for React applications. Supports React 16+, React Router v5-v7, TanStack Router, Redux, Vite, and webpack.

```
USAGE
  $ claude claude skill sentry sentry-react-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for React. Use when asked to "add Sentry to React", "install @sentry/react", or configure error
  monitoring, tracing, session replay, profiling, or logging for React applications. Supports React 16+, React Router
  v5-v7, TanStack Router, Redux, Vite, and webpack.
```

## `claude claude skill sentry sentry-ruby-sdk [INPUT]`

Full Sentry SDK setup for Ruby. Use when asked to add Sentry to Ruby, install sentry-ruby, setup Sentry in Rails/Sinatra/Rack, or configure error monitoring, tracing, logging, metrics, profiling, or crons for Ruby applications. Also handles migration from AppSignal, Honeybadger, Bugsnag, Rollbar, or Airbrake. Supports Rails, Sinatra, Rack, Sidekiq, and Resque.

```
USAGE
  $ claude claude skill sentry sentry-ruby-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Ruby. Use when asked to add Sentry to Ruby, install sentry-ruby, setup Sentry in
  Rails/Sinatra/Rack, or configure error monitoring, tracing, logging, metrics, profiling, or crons for Ruby
  applications. Also handles migration from AppSignal, Honeybadger, Bugsnag, Rollbar, or Airbrake. Supports Rails,
  Sinatra, Rack, Sidekiq, and Resque.
```

## `claude claude skill sentry sentry-sdk-setup [INPUT]`

Set up Sentry in any language or framework. Detects the user's platform and loads the right SDK skill. Use when asked to add Sentry, install an SDK, or set up error monitoring in a project.

```
USAGE
  $ claude claude skill sentry sentry-sdk-setup [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Set up Sentry in any language or framework. Detects the user's platform and loads the right SDK skill. Use when asked
  to add Sentry, install an SDK, or set up error monitoring in a project.
```

## `claude claude skill sentry sentry-sdk-skill-creator [INPUT]`

Create a complete Sentry SDK skill bundle for any platform. Use when asked to "create an SDK skill", "add a new platform skill", "write a Sentry skill for X", or build a new sentry-<platform>-sdk skill bundle with wizard flow and feature reference files.

```
USAGE
  $ claude claude skill sentry sentry-sdk-skill-creator [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Create a complete Sentry SDK skill bundle for any platform. Use when asked to "create an SDK skill", "add a new
  platform skill", "write a Sentry skill for X", or build a new sentry-<platform>-sdk skill bundle with wizard flow and
  feature reference files.
```

## `claude claude skill sentry sentry-sdk-upgrade [INPUT]`

Upgrade the Sentry JavaScript SDK across major versions. Use when asked to upgrade Sentry, migrate to a newer version, fix deprecated Sentry APIs, or resolve breaking changes after a Sentry version bump.

```
USAGE
  $ claude claude skill sentry sentry-sdk-upgrade [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Upgrade the Sentry JavaScript SDK across major versions. Use when asked to upgrade Sentry, migrate to a newer version,
  fix deprecated Sentry APIs, or resolve breaking changes after a Sentry version bump.
```

## `claude claude skill sentry sentry-setup-ai-monitoring [INPUT]`

Setup Sentry AI Agent Monitoring in any project. Use when asked to monitor LLM calls, track AI agents, or instrument OpenAI/Anthropic/Vercel AI/LangChain/Google GenAI/Pydantic AI. Detects installed AI SDKs and configures appropriate integrations.

```
USAGE
  $ claude claude skill sentry sentry-setup-ai-monitoring [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Setup Sentry AI Agent Monitoring in any project. Use when asked to monitor LLM calls, track AI agents, or instrument
  OpenAI/Anthropic/Vercel AI/LangChain/Google GenAI/Pydantic AI. Detects installed AI SDKs and configures appropriate
  integrations.
```

## `claude claude skill sentry sentry-svelte-sdk [INPUT]`

Full Sentry SDK setup for Svelte and SvelteKit. Use when asked to "add Sentry to Svelte", "add Sentry to SvelteKit", "install @sentry/sveltekit", or configure error monitoring, tracing, session replay, or logging for Svelte or SvelteKit applications.

```
USAGE
  $ claude claude skill sentry sentry-svelte-sdk [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Full Sentry SDK setup for Svelte and SvelteKit. Use when asked to "add Sentry to Svelte", "add Sentry to SvelteKit",
  "install @sentry/sveltekit", or configure error monitoring, tracing, session replay, or logging for Svelte or
  SvelteKit applications.
```

## `claude claude skill sentry sentry-workflow [INPUT]`

Fix production issues and review code with Sentry context. Use when asked to fix Sentry errors, debug issues, triage exceptions, review PR comments from Sentry, or resolve bugs.

```
USAGE
  $ claude claude skill sentry sentry-workflow [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Fix production issues and review code with Sentry context. Use when asked to fix Sentry errors, debug issues, triage
  exceptions, review PR comments from Sentry, or resolve bugs.
```

## `claude claude skill simplify [INPUT]`

Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.

```
USAGE
  $ claude claude skill simplify [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [<target>]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality
  only — it does not hunt for bugs; use /code-review for that.
```

## `claude claude skill ssh-remote-server ssh-remote-server [INPUT]`

This skill should be used when the user asks to "ssh into remote server", "execute artisan command remotely", "run bash command in remote server", "execute artisan in pod", "remote artisan cache clear", mentions SSH chaining. Provides remote command execution via SSH through bastion hosts to Kubernetes pods, supporting Laravel artisan commands, bash commands, and PHP tinker operations.

```
USAGE
  $ claude claude skill ssh-remote-server ssh-remote-server [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  [command] [server] [component] [--all]

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user asks to "ssh into remote server", "execute artisan command remotely", "run
  bash command in remote server", "execute artisan in pod", "remote artisan cache clear", mentions SSH chaining.
  Provides remote command execution via SSH through bastion hosts to Kubernetes pods, supporting Laravel artisan
  commands, bash commands, and PHP tinker operations.
```

## `claude claude skill terminal-recorder terminal-recorder [INPUT]`

This skill should be used when the user wants to record a terminal session and convert it to an animated GIF. Use when the user says phrases like "record my terminal", "capture terminal session", "create a terminal GIF", "record a demo", "make a terminal recording", "convert cast to GIF", or needs to produce shareable terminal demos.

```
USAGE
  $ claude claude skill terminal-recorder terminal-recorder [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user wants to record a terminal session and convert it to an animated GIF. Use when
  the user says phrases like "record my terminal", "capture terminal session", "create a terminal GIF", "record a demo",
  "make a terminal recording", "convert cast to GIF", or needs to produce shareable terminal demos.
```

## `claude claude skill trello-qa-triage analyze-serenity-report [INPUT]`

This skill should be used when the user provides a Jenkins-hosted Serenity BDD test report URL (an HTML-publisher page such as http://<jenkins-host>/view/<view>/job/<job>/Test_20Report/) and asks to "download this test report", "analyze this Serenity report", "focus on the failure steps", "read the failure screenshots", or "tell me the symptom". Downloads the full report via the Jenkins *zip* endpoint, locates the failing scenarios, extracts the failing steps and exceptions verbatim, reads the attached screenshots, and reports the findings only — no root-cause suggestions or recommendations.

```
USAGE
  $ claude claude skill trello-qa-triage analyze-serenity-report [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  This skill should be used when the user provides a Jenkins-hosted Serenity BDD test report URL (an HTML-publisher page
  such as http://<jenkins-host>/view/<view>/job/<job>/Test_20Report/) and asks to "download this test report", "analyze
  this Serenity report", "focus on the failure steps", "read the failure screenshots", or "tell me the symptom".
  Downloads the full report via the Jenkins *zip* endpoint, locates the failing scenarios, extracts the failing steps
  and exceptions verbatim, reads the attached screenshots, and reports the findings only — no root-cause suggestions or
  recommendations.
```

## `claude claude skill update-config [INPUT]`

Use this skill to configure the Claude Code harness via settings.json. Automated behaviors ("from now on when X", "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these, not Claude, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json files. Examples: "allow npm commands", "add bq permission to global settings", "move permission to user settings", "set DEBUG=true", "when claude stops show X". For simple settings like theme/model, suggest the /config command.

```
USAGE
  $ claude claude skill update-config [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Use this skill to configure the Claude Code harness via settings.json. Automated behaviors ("from now on when X",
  "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these,
  not Claude, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move
  permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json
  files. Examples: "allow npm commands", "add bq permission to global settings", "move permission to user settings",
  "set DEBUG=true", "when claude stops show X". For simple settings like theme/model, suggest the /config command.
```

## `claude claude skill verify [INPUT]`

Verify that a code change actually does what it's supposed to by exercising it end-to-end and observing behavior — drive the affected flow, not just tests or typecheck. Run before committing nontrivial changes. Don't invoke it on a diff that only touches tests, docs, or other code with no runtime surface to drive (a change to product source always has one) — there's nothing to observe.

```
USAGE
  $ claude claude skill verify [INPUT...] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

ARGUMENTS
  [INPUT...]  Additional input to forward to the agent

FLAGS
  -p, --profile=<value>      Authentication profile name
  -w, --workspace=<value>    Workspace name (uses current directory if omitted)
      --allow-tools=<value>  Comma-separated list of tools the agent may use (e.g. Read,Edit,Glob)
      --repo=<value>         Filter workspace context to this repo name
      --stream               Stream assistant text as it arrives
      --system=<value>       Custom system prompt for the agent

DESCRIPTION
  Verify that a code change actually does what it's supposed to by exercising it end-to-end and observing behavior —
  drive the affected flow, not just tests or typecheck. Run before committing nontrivial changes. Don't invoke it on a
  diff that only touches tests, docs, or other code with no runtime surface to drive (a change to product source always
  has one) — there's nothing to observe.
```

## `claude claude workflow`

List saved workflows

```
USAGE
  $ claude claude workflow [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List saved workflows

EXAMPLES
  $ claude claude workflow
```

_See code: [src/commands/claude/workflow/index.ts](https://github.com/hesedcasa/claude/blob/v0.3.0/src/commands/claude/workflow/index.ts)_

## `claude claude workflow run NAME [INPUT]`

Run a saved workflow by name

```
USAGE
  $ claude claude workflow run NAME [INPUT] [--allow-tools <value>] [-p <value>] [--repo <value>] [--stream] [--system
    <value>] [-w <value>]

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
  $ claude claude workspace add [--json] [--mode local|sandbox] [--repo <value>...] [-w <value>]

FLAGS
  -w, --workspace=<value>  Workspace name
      --mode=<option>      'local' uses real repo dirs; 'sandbox' clones git URLs into a virtual bash
                           <options: local|sandbox>
      --repo=<value>...    Named repo entry as name=path or name=git-url (repeatable)

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
  $ claude claude workspace delete [--json] [-w <value>]

FLAGS
  -w, --workspace=<value>  Workspace name

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
