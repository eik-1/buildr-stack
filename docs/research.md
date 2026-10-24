# Research behind buildr-stack

Initial research: 2026-10-13. Shared instruction and skill discovery updated:
2026-10-16. Installer distribution updated: 2026-10-24. Tool behavior and
repository details below reflect those checks.

The starting point was the owner's Refrakt workflow: separate product, design,
roadmap, and agent instructions, with roughly two-hour outcomes and an option to
learn through guided implementation.

## Compared workflows

The research reviewed primary repositories and representative workflow files.
Several unrelated projects use the name pstack, so they are listed separately.

| System | Relevant approach | Decision for buildr-stack |
|---|---|---|
| [gstack](https://github.com/garrytan/gstack) | Specialist product, engineering, design, and QA roles with executable tools | Keep roles discoverable while using the host's tools |
| [backnotprop/pstack](https://github.com/backnotprop/pstack) | Engineering skills and principles, with some external dependencies | Give each skill a narrow role and disclose prerequisites |
| [phthomas/pstack](https://github.com/phthomas/pstack) | Brain dump, product records, and phased specifications | Start with questions and plan the first useful outcome |
| [no-session/pstack](https://github.com/no-session/pstack) | A gstack fork focused on founders and product validation | Keep product questions without imposing a business model |
| [Superpowers](https://github.com/obra/superpowers) | Composable planning, testing, and delegated execution | Reuse task discipline while preserving the owner's verification preferences |
| [Spec Kit](https://github.com/github/spec-kit) | CLI workflows for specification-driven development | Keep intent and implementation connected with fewer records |
| [GSD Core](https://github.com/open-gsd/gsd-core) | Discuss, plan, execute, verify, and ship | Support resuming work without requiring delegation |

## Design decisions

| Decision | Reason |
|---|---|
| Separate product, design, roadmap, and agent records | Each changes independently; clear ownership reduces repeated or conflicting decisions |
| Keep the current project baseline editable | Refrakt showed that an outdated summary can conflict with newer decisions and progress |
| Interview before scaffolding | A project name does not establish users, scope, or a suitable stack |
| Plan roughly two-hour usable outcomes | Research and checks support an outcome rather than becoming artificial build days |
| Reconcile design records, Paper frames, and rendered code | Tokens or mockups alone do not establish that the implementation matches |
| Use focused verification at reachable failure paths | Avoid duplicate tests and hypothetical internal corruption while preserving security, ownership, money, and persistence checks |
| Offer build and pair modes | Pair mode explains one step, lets the owner try, then reviews the actual edit |
| Distribute a Node.js installer through npm | Let users run `npx buildr-stack@latest init my-project` without a checkout or Python; keep the installer dependency-free |
| Install project-local files in one shared directory | Preserve global settings and avoid duplicate skill copies or symlink requirements |
| Let the owner select frameworks and services | Keep the workflow useful for apps, CLIs, libraries, and services |
| Configure MCP separately | Access, credentials, permissions, and costs differ by environment |

The shared directory is `.agents/skills/`, with direct file routing in AGENTS.md.
[Claude Code's instruction guide](https://code.claude.com/docs/en/memory#agentsmd)
documents AGENTS.md support from v2.1.277. Its
[skill guide](https://code.claude.com/docs/en/skills#choose-where-skills-load)
does not document native discovery from the shared directory. Those sessions read
the skill files directly instead of using registered slash commands.

## Evidence on instruction files

[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) reports that context files
did not generally improve task success in its tested settings and increased
inference cost on average. Its authors identify a role for nonstandard practices
while questioning broad repository overviews.

[On the Impact of AGENTS.md Files](https://arxiv.org/abs/2601.20404) reports lower
median runtime and output-token use across its repository and pull-request sample,
with comparable completion behavior. The studies use different settings and measures.

Our inference is to keep always-loaded instructions short, load conditional detail
when needed, and check actual agent behavior. Neither study measures buildr-stack;
local structure and installer checks do not establish model adherence.

## Implementation sources

- [Agent Skills specification](https://agentskills.io/specification): layout, naming,
  frontmatter, and progressive disclosure.
- [Codex skills](https://learn.chatgpt.com/docs/build-skills) and
  [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md):
  local discovery and scoped instructions.
- [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli):
  configuration scope and environment-sourced tokens.
- [Claude Code skills](https://code.claude.com/docs/en/skills) and
  [project instructions](https://code.claude.com/docs/en/memory): loading behavior.
- [Context7](https://github.com/upstash/context7): documentation retrieval and MCP setup.
- [Paper MCP](https://paper.design/docs/mcp) and [tokens](https://paper.design/docs/tokens):
  connection setup and reusable design values.
- [npm package metadata](https://docs.npmjs.com/cli/configuring-npm/package-json)
  and [npm exec](https://docs.npmjs.com/cli/commands/npm-exec): executable commands,
  bundled files, and running a downloaded package.
- [Node.js argument parsing](https://nodejs.org/api/util.html#utilparseargsconfig)
  and [test runner](https://nodejs.org/api/test.html): CLI parsing and tests using
  built-in modules.

The task skills and templates were written for this project. `buildr-unslop` was
copied from the owner's system skill with its name and invocation setting adapted.
The compared projects are referenced, not bundled.
