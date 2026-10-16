---
name: buildr-review
description: "Review a changed diff or selected project path for demonstrated defects, scope drift, and missing verification. Use when asked to review or when a consequential change warrants it, not for a blanket repository audit."
license: MIT
---

# Review the changed path

Read the actual diff, relevant callers, selected outcome, and current constraints.
Identify the review boundary before looking for defects. A small change does not
need a pretend panel of reviewers or mandatory subagents.

For a proposed finding, establish:

- The exact file and behavior.
- A reachable UI, API, worker, provider, or migration trigger, or a reproduced failure.
- The consequence and evidence. Distinguish an observed defect from a risk and an
  optional improvement. Security and money boundaries may need to fail closed.
- The smallest correction and the check that proves it.

Review authentication and ownership when touched, trust-boundary validation,
persisted money state, supported failures, product truth, and unnecessary complexity.
For UI, compare the rendered path to accepted design roles and affected states.
Do not invent production data, backfills, or compatibility needs for local work.

Respect the requested scope. A read-only review reports findings; a review-and-fix
request permits relevant reversible fixes. It does not authorize commits, paid
calls, or deployment. Use a real independent reviewer only when available and
authorized; disclose self-review honestly.

Order findings by consequence. If none are supported, say so. Report the checks
run and unresolved verification limits. Avoid arbitrary scores, guaranteed safety,
or demanding tests that repeat the implementation.
