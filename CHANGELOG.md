# Changelog

## [0.4.0](https://github.com/hesedcasa/claude/compare/v0.3.0...v0.4.0) (2026-07-07)


### 🎉 Features

* **chat:** add interactive chat command using SDK streaming input mode ([5657859](https://github.com/hesedcasa/claude/commit/565785943a31b21f70f5c92fd0aa8c49e21789f0))
* **chat:** interactive streaming-input chat as the root claude command ([4c284a2](https://github.com/hesedcasa/claude/commit/4c284a269af1ad206c847ee8b233f397c8a30079))
* **cli:** promote command and skill to top-level topics with run subcommands ([86b1242](https://github.com/hesedcasa/claude/commit/86b1242e18a194447b0f19a102c4f655897db029))
* **cli:** render oclif topic help for claude command/claude skill ([3945bac](https://github.com/hesedcasa/claude/commit/3945bacdc8509e12f2820d8f385d7add8e8fa12f))
* **cli:** render oclif topic help for claude command/claude skill ([08ce2da](https://github.com/hesedcasa/claude/commit/08ce2dac4fb5ec3aaddea697b364a00fadc04adc))
* **prompt:** add interactive TTY wizard, confirmations, and JSONL store ([1fac5c6](https://github.com/hesedcasa/claude/commit/1fac5c6512eff864b7a19ae0cb014de5c6c76651))
* **prompt:** interactive wizard, confirmations, and JSONL store ([8523914](https://github.com/hesedcasa/claude/commit/8523914e69ec013544fef19fa5082727f88faaf3))
* **session:** add session management commands and resume/continue/fork support ([547b6cd](https://github.com/hesedcasa/claude/commit/547b6cd24784a75e22035812e8d061cbda9f07af))
* **session:** confirm before deleting a session ([b89deab](https://github.com/hesedcasa/claude/commit/b89deabc7296cece409eaa848340f638ad81f821))


### 🛠️ Fixes

* **chat:** make piped multi-turn input reach the chat loop intact ([1c6dbe3](https://github.com/hesedcasa/claude/commit/1c6dbe33fba92ef188c497d2ad8a9a0f9e8aa44d))


### ♻️ Chores

* **chat:** make chat the root claude command via index.ts ([0468021](https://github.com/hesedcasa/claude/commit/04680217c0a368d7aeab4422977d17500c30e692))
* **chat:** replace JSON/TOON result output with plain text ([e8df7ae](https://github.com/hesedcasa/claude/commit/e8df7aef180a360ca03e7d240253f81a019a2bdf))
* **cli:** replace TOON output with --json flag, add capability metadata ([ea13d0f](https://github.com/hesedcasa/claude/commit/ea13d0faaaca26190e8fb64d4685295def1c6f2c))
* **cli:** replace TOON output with --json flag, add capability metadata ([46da500](https://github.com/hesedcasa/claude/commit/46da50025d2ecf44f2ebcb88a63e0e76efdd76fb))
* remove workflow commands ([bb90e5b](https://github.com/hesedcasa/claude/commit/bb90e5bc7910e2e297513384dad388415b3a25e2))
* remove workflow commands ([8be1801](https://github.com/hesedcasa/claude/commit/8be180101ef6a9f18dbe983a4e42c8aeae8b0647))

## [0.3.0](https://github.com/hesedcasa/claude/compare/v0.2.0...v0.3.0) (2026-06-29)


### 🎉 Features

* add workflow list and run commands ([f2bdf9a](https://github.com/hesedcasa/claude/commit/f2bdf9aba883f9b26ab2d7d8d4d81999ea7b2ddd))
* add workflow list and run commands ([b415f5c](https://github.com/hesedcasa/claude/commit/b415f5c4ebf526a7e24d8b9ce537851a0080132b))
* **prompt:** add saved-prompt commands with system prompt and templating ([28323e7](https://github.com/hesedcasa/claude/commit/28323e7756bb5b0735a04c9f2e63c6099550ef1b))
* **prompt:** add saved-prompt commands with system prompt and templating ([5b53823](https://github.com/hesedcasa/claude/commit/5b53823d22bed550b90ee4418f2238bf24d9d316))


### 🛠️ Fixes

* **prompt:** build workspace system prompt before dry-run output ([3c1e73c](https://github.com/hesedcasa/claude/commit/3c1e73c31fd70da2b7cfecdfb5d0660855a4b84f))
* **prompt:** keep --dry-run a side-effect-free preview ([c1e89fa](https://github.com/hesedcasa/claude/commit/c1e89fa49baac4f671aa1fd3352f2771a06a058c))
* refuse to run when an explicit workspace cannot be resolved ([cd18349](https://github.com/hesedcasa/claude/commit/cd1834980943e378f0ee8588ee2a555f40739823))
* surface config read errors and fail workflow run on agent error ([a5483fe](https://github.com/hesedcasa/claude/commit/a5483fed52b5f95cac55d4b454494fc0b7f6a9b2))

## [0.2.0](https://github.com/hesedcasa/claude/compare/v0.1.0...v0.2.0) (2026-06-12)


### 🎉 Features

* add capability commands, hooks, workspace-bash, and list subcommands ([5b06c0d](https://github.com/hesedcasa/claude/commit/5b06c0da41abe460442a95483be97f5b9c8426cb))
* add sandbox read/write/edit MCP tools and improve workspace validation ([d132376](https://github.com/hesedcasa/claude/commit/d1323768e552bafa6309aa9698a4f79fb6c575a6))
* add workspace support to list command ([99bb4cf](https://github.com/hesedcasa/claude/commit/99bb4cfa65fc9e2b56e3e190e7ffc6cc1b9e462d))


### 🛠️ Fixes

* allow sandbox bash with empty tool allow-list ([9baee59](https://github.com/hesedcasa/claude/commit/9baee59c790604def7f5b3bbe087adea4f4d16ab))


### ♻️ Chores

* remove command_not_found hook in favour of init-hook registration ([270a6b4](https://github.com/hesedcasa/claude/commit/270a6b46880af315c126acaced0ba4876d077389))
* remove log param from readWorkspace/readWorkspaces and add interactive prompts ([de29ede](https://github.com/hesedcasa/claude/commit/de29edeb8472a7e3b7c41aafb5357937048d8d82))
* share auth config filename ([eaef05d](https://github.com/hesedcasa/claude/commit/eaef05d41e6f3f57ab079082bd54d9bc1c99e0be))
* split config.ts into focused modules and expand workspace/auth tests ([cec47ca](https://github.com/hesedcasa/claude/commit/cec47ca559e4c94cb4ebc9d87023ee1b298ee830))
* split config.ts into focused modules and expand workspace/auth tests ([bf2412f](https://github.com/hesedcasa/claude/commit/bf2412f5711719a6dc2a55832d3a4742dea5b167))

## Changelog


## Changelog


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
