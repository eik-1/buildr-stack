# Research behind buildr-stack

Checked on 2026-10-13. This is a decision record for the initial implementation,
not a ranking of every AI development tool. Repository descriptions, dependency
requirements, and discovery behavior can change after this date.

Updated on 2026-10-16 for Claude Code instruction loading. Its
[current documentation](https://code.claude.com/docs/en/memory#agentsmd) confirms
direct AGENTS.md support from v2.1.277. The starter now keeps one AGENTS.md and
does not generate a CLAUDE.md wrapper. Existing project or ancestor CLAUDE.md files
can take precedence under default settings; the README covers that setting and
unsupported sessions.

## Question

What reusable system can turn the author's Refrakt workflow into a general-purpose
starter that other people can inspect, adopt, and adapt across AI coding tools?

The owner's constraints are practical: usable outcomes, maintainable code, deliberate
design, current documentation, and learning by reading and attempting the code.
They also want a public repository that demonstrates these decisions. GitHub stars
are a hoped-for result, not a metric this research can predict.

## Method and provenance

- Read the actual Refrakt instruction, product, roadmap, design, and sync documents.
- Reviewed six relevant earlier threads about design records, frontend skill
  overlap, simplifying AI-generated complexity, daily planning, and guided building.
- Read current primary repository descriptions and README files for the comparison
  below. Inspected representative skill files or methodology documents for gstack,
  backnotprop/pstack, phthomas/pstack, and Spec Kit.
- Used Context7 to resolve and query Codex, Claude Code, Context7, and GitHub Actions
  documentation. Opened official agent, Paper, and Agent Skills documentation.
- Read two research abstracts with different results on repository context files.
  Their findings inform a cautious design; they do not validate this toolkit.

Private thread transcripts, account details, private design links, customer media,
and project credentials are excluded from this repository. The generalized findings
below describe the workflow rather than republishing those materials.

## Comparable systems

Several unrelated repositories use the name pstack. Comparing one as if it
represented the others would produce a misleading result.

| System | What the inspected sources establish | Lesson for buildr-stack |
|---|---|---|
| [gstack](https://github.com/garrytan/gstack) | Specialist roles for product, engineering, design, review, and QA, with executable tooling and setup requirements including Bun | Make task roles discoverable; keep this starter's runtime small and use the host's browser |
| [backnotprop/pstack](https://github.com/backnotprop/pstack) | A standalone collection of engineering skills and principles; some skills have dependencies on other skills or external tooling | Give each bundled skill a narrow role and avoid hidden required providers |
| [phthomas/pstack](https://github.com/phthomas/pstack) | A Markdown workflow for converting a brain dump into product records and phased specs, with capability-aware execution | Start from rough input and keep ownership explicit; do not spec every future phase by default |
| [no-session/pstack](https://github.com/no-session/pstack) | A gstack fork oriented toward solo founders and product validation | Preserve useful product questions without imposing a particular business model |
| [Superpowers](https://github.com/obra/superpowers) | A composable methodology with brainstorming, planning, test-first development, and subagent execution | Borrow task discipline; retain the project's own risk-based verification and permission scope |
| [Spec Kit](https://github.com/github/spec-kit) | A CLI and customizable workflows for spec-driven development and related processes | Keep intent and implementation connected; use fewer records for small projects |
| [GSD Core](https://github.com/open-gsd/gsd-core) | A discuss, plan, execute, verify, and ship loop with an installer and fresh-context delegation | Make resumability useful without requiring delegation or a fixed agent fleet |

The former [GSD repository](https://github.com/gsd-build/get-shit-done) now directs
users to GSD Core. This was checked during research rather than assuming the old
home remained current.

These systems have useful capabilities that buildr-stack does not implement. buildr-stack
is a smaller option for durable project records, design reconciliation, and guided
learning. It is not a browser engine, deployment tool, autonomous scheduler, or
multi-agent orchestration framework.

## Findings from the author's workflow

### Document ownership reduces repeated decisions

Root instructions became more useful when they held only working rules and links.
Product intent, current technical decisions, visual values, and daily outcomes
changed independently. The public starter preserves those owners and adds a
next action in the roadmap so a fresh session can resume work.

One observed limitation was a stale product summary coexisting with newer decisions
and roadmap status. buildr-stack allows current product sections to change, rather
than making only an append-only log writable.

### Design needs evidence and synchronization

The workflow used references, shared controls, an explicit design record, Paper,
and actual browser inspection. A token file alone did not settle composition or
prove that code matched the reference. The starter keeps token-to-component mapping,
truthful media slots, and design/code reconciliation explicit.

Overlapping generic design skills introduced conflicting directions and unnecessary
steps. The public guidance recommends one selected role at a time and lets the
project's accepted direction take precedence.

### Planning should produce usable outcomes

The owner replaced task lists of research, testing, and broad hardening with
roughly two-hour sessions that changed the product. Prerequisites remained visible
but did not become artificial build days. This became the roadmap template.

### Verification must observe the claimed behavior

The owner objected to duplicate tests, impossible internal states, and research
assertions retained at runtime. The generalized rule names a reachable cause before
adding unusual handling. It still protects authentication, ownership, persisted
money state, external input, and reproduced regressions.

Browser/manual checks and focused automated tests are both available. The system
does not turn one project's low-test preference into a universal ban on tests.

### Learning is a different execution mode

Earlier tutorial sessions showed a useful pattern: explain the current code path,
give one edit and a hint, inspect the owner's attempt, then check it. The owner
could ask the agent to take over an individual step. Pair mode makes that contract
explicit without reducing the agent's ability to finish authorized build work.

## What the research does and does not prove

[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) reports that context files
did not generally improve task success in its tested settings and increased
inference cost on average. Its authors identify a role for nonstandard practices,
while questioning broad repository overviews.

[On the Impact of AGENTS.md Files](https://arxiv.org/abs/2601.20404) reports lower
median runtime and output-token use across its sample of repositories and pull
requests, with comparable completion behavior. The studies use different settings
and measures. Neither establishes an improvement for buildr-stack or every project.

Our inference is to keep always-loaded instructions short, route conditional
detail, remove stale or redundant records, and evaluate the actual behavior.
There is no measured speedup, token saving, correctness guarantee, or star forecast
for this kit. Local structural checks and live-agent evaluations are separate.

## Decisions made for this release

| Decision | Reason | When to reconsider |
|---|---|---|
| Plain SKILL.md and Markdown records | Inspectable and easy to adapt; format has documented agent support | A user needs an integration that plain files cannot support |
| Python standard-library installer | No package installation or remote execution; available across major desktop platforms | Installation friction is observed in real adoption |
| Project-local installation | Preserves global settings and scopes behavior to the project | Users explicitly request a global installation mode |
| Copies for both-agent installation | Avoids symlink requirements and Git checkout differences on Windows | Copy drift becomes a demonstrated maintenance problem |
| No automatic MCP installation | Accounts, permissions, paths, and costs differ by environment | A narrow opt-in adapter can be tested and justified |
| No default framework or visual palette | Keeps the starter useful for web apps, libraries, CLIs, and services | A separate stack-specific preset has real users |
| Build and pair modes | Supports both delivery and understanding the code | Live sessions show unclear mode boundaries |
| Focused verification | Matches the changed behavior and consequence | Project release requirements need broader gates |

## Name and public presentation

The owner selected `buildr-stack` on 2026-10-14. Earlier naming research found
existing repositories for candidates including Startloom, Seedframe, Buildseed,
and Seedwright. No availability claim is made for the selected name. Trademark,
domain, and package-name clearance were not part of this rename.

The public repository should demonstrate its mechanics: a short quickstart,
inspectable skills, a design workflow, preservation checks, and
honest validation status. An attractive README helps explain the system; fabricated
benchmarks or a broad list of unverified integrations would weaken the evidence.

## Primary implementation sources

- [Agent Skills specification](https://agentskills.io/specification), folder layout,
  naming, frontmatter, and progressive disclosure.
- [Codex skills](https://learn.chatgpt.com/docs/build-skills) and
  [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), local
  discovery and scoped instructions.
- [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), HTTP configuration
  and environment-sourced headers.
- [Claude Code skills](https://code.claude.com/docs/en/skills) and
  [memory](https://code.claude.com/docs/en/memory), project skills and shared imports.
- [Context7](https://github.com/upstash/context7), current documentation retrieval
  and remote MCP configuration.
- [Paper MCP](https://paper.design/docs/mcp) and [tokens](https://paper.design/docs/tokens),
  the current desktop/CLI connection flow and design values.
- [GitHub Actions Python guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/python),
  focused cross-platform checks. Action references also checked in their primary
  repositories before writing the workflow.

No third-party workflow code or skill files are vendored. Comparative descriptions
and source links acknowledge the reviewed systems; the bundled skills and templates
were written for this project.
