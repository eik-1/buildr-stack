---
name: buildr-plan
description: "Plan the next usable outcome in a roughly two-hour session, with dependencies and a concrete completion check. Use for roadmap or daily-session planning, not implementation."
license: MIT
---

# Plan one useful session

Read the roadmap, relevant decisions, and code on the selected
path. The roadmap's checked box alone does not establish the baseline.

- Verify what already exists through a focused read or available check. Distinguish
  incomplete code, unverified behavior, and an actual blocker. Do not audit unrelated
  subsystems or add a new day for a hypothetical issue.
- Choose the next selected outcome, or the user's requested one. Describe what
  someone can do afterward. A library or CLI can have an operational outcome
  such as a working command, API call, or exported function.
- Resolve prerequisites before scheduling dependent work. Name missing access,
  decisions, or spend approval. Research and generic audits are not build outcomes.
- Break the outcome into the minimum end-to-end steps. For each step name the
  relevant files, why it exists, what changes, and how to check it. Do not write
  complete implementations when the request is planning or learning.
- Use two hours as a scope guide. Split oversized work at a usable boundary;
  never abandon an unsafe partial write just because the time box expires.
- Define completion from an observable path and focused verification. Include
  one exact owner checklist when credentials or account state are required.

Update IMPLEMENTATION_PHASES.md or the mapped roadmap. Keep the selected next
outcome detailed and later outcomes brief. Re-rank displaced work; do not pull
future features into the current session to fill time.

Finish with the outcome, actual prerequisites, steps, and completion check.
Do not mark anything built or complete during a planning-only request.
