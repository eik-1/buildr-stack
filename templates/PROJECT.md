# {{project_name}}

> Current product and architecture source of truth.
>
> **Status:** first useful outcome not selected
>
> **Doc version:** v0.1
> **Execution plan:** [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md)

## Product

[OPEN: the first user, their problem, and the first useful result from the conversation.]

## Scope

- First version: [OPEN: one usable end-to-end path.]
- Deferred: [OPEN: explicit exclusions.]

## Architecture

[OPEN: actual packages, entry points, data flow, and selected services. Choose the
simplest structure that supports the first path. Record commands and environment
variable names after they exist, never secret values.]

## Constraints

[OPEN: time, cost, privacy, platforms, deployment state, and permissions.]

# Living sections

Update only sections affected by meaningful work. Use dates from the actual
session in YYYY-MM-DD format. Replace a seed entry when its first real fact is
known. Record decisions and results from evidence, not assumptions.

## Decision log

_(seed)_ Accepted product or technical decisions, with the date and reason.
State when a decision supersedes an earlier one. Keep visual values in DESIGN.md.

## Progress log

_(seed)_ What is built, what was checked, and any remaining verification.
Distinguish local work from deployed behavior and owner-reported checks from agent checks.
The roadmap owns detailed steps and completion status.

## Learnings and gotchas

_(seed)_ Observed failures or constraints, their cause, and the useful correction.

## Open questions

_(seed)_ Questions that affect a selected outcome. Move resolved answers into the
relevant decision or current product section.

## Metrics

_(seed)_ Measured costs, timings, usage, or product results, with their source and date.
Do not invent values to fill this section.

## Backlog

_(seed)_ Parked ideas. Add only when the owner raises them or evidence supports them.
Remove an item when it is completed, rejected, or obsolete, and record the outcome.

## Changelog

_(seed)_ On a meaningful project update, increase the minor Doc version once and
add a newest-first entry: `v0.2, YYYY-MM-DD: what changed in this document.`
Use integer minor versions, so v0.9 becomes v0.10. Do not bump for an unchanged
sync, a typo, or a design-only update with no project facts to record.

Keep the current Product, Scope, Architecture, Constraints, and Status accurate
when an accepted decision changes them. Explain the change in the decision log.
Do not rewrite unchanged sections or copy a session transcript into this file.
