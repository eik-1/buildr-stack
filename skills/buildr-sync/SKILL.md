---
name: buildr-sync
description: "Keep the live project document, its versioned logs, roadmap progress, and design rules current after meaningful work. Use when ending a session or updating project documents."
license: MIT
---

# Update the live project records

Read the current user request, affected code and diff, relevant project sections,
and actual check results. Use the conversation and known edits when Git has no
commits or no useful diff. No new fact means no entry or version bump.

## Route each fact

| Fact | Destination |
|---|---|
| Accepted product or technical decision and reason | PROJECT.md Decision log |
| What was built, verification evidence, or a remaining check | PROJECT.md Progress log |
| Observed failure, constraint, cause, and fix | PROJECT.md Learnings and gotchas |
| Unresolved decision for selected work | PROJECT.md Open questions |
| Measured cost, timing, usage, or product result | PROJECT.md Metrics |
| Owner-selected parked idea | PROJECT.md Backlog |
| Detailed steps, dependencies, completion status, next action | IMPLEMENTATION_PHASES.md |
| Tokens, typography, layout, interaction, components, or assets | DESIGN.md |

Use the project's existing section names when they differ. Split mixed facts.
Record only a short progress summary in PROJECT.md; keep daily work in the roadmap.
Design values belong in DESIGN.md, not the project decision log.

## Update PROJECT.md

1. Read its Doc version, affected living sections, and relevant current product
   sections. Avoid duplicate entries. Date facts YYYY-MM-DD using the actual session date.
2. Replace an affected seed entry with evidence-backed content. Mark superseded
   decisions clearly. Remove resolved questions after recording their answers.
   Do not invent a missing result, metric, approval, or rationale.
3. If an accepted decision changes the current Product, Scope, Architecture,
   Constraints, or Status, correct only that affected text and explain it in the
   Decision log. Keep unrelated sections unchanged.
4. When a living section changed, increase the minor Doc version once for this
   sync and add one newest-first Changelog entry with the same version, date,
   and a concise description. For example, v0.9 becomes v0.10 and v2.15 becomes v2.16.
   Read the actual version; never reset an existing project's numbering.
5. Leave the version unchanged for a no-op, typo correction, or design-only change
   with no project facts to record. If the existing project uses another version
   convention, preserve it. Add a missing version only within an authorized document setup.

## Check the roadmap and design record

Mark an outcome complete only when its stated completion check has evidence.
Record owner-reported checks as such. Keep built-but-unverified work pending.
Update the next action beside its outcome, not in a separate session file.

For design work, update affected DESIGN.md rules and code tokens. If a Paper file
or derived design sidecar exists, update its affected values only within scope.
If unavailable, report the exact mismatch and follow-up. Do not claim a complete sync.

Finish with the files and sections changed, the new Doc version if bumped, and
unresolved checks. Do not repeat the whole document. Apply buildr-unslop to the edits.
This skill does not authorize commits, publishing, deployment, or paid calls.
