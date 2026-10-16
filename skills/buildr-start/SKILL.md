---
name: buildr-start
description: "Interview the owner about their project, then create its structure and populate the Markdown records. Invoke manually after installing buildr-stack or when adopting it in an existing project."
license: MIT
---

# Start a project

Read the project's agent instructions, apply buildr-unslop, and inspect Git status.
Preserve unrelated work.

## Ask about the project first

Ask at most three related questions at a time and wait for the answers.
Do not scaffold or populate documents while the intended product is unknown.

Start with:

- What are you building, who will use it, and what problem should it solve?
- What should the first usable version do? What is outside its scope?
- Is this new or existing work? What should be kept or changed?

Reuse answers already given. If the owner supplied a clear brief, state your
understanding and ask only about missing decisions. Code shows existing behavior;
it cannot establish the owner's intent. Use only context available to this session.

Then ask the relevant follow-up questions:

- What kind of project and platform is it: website, app, API, CLI, library, or something else?
- Is there a required stack, or should you choose the simplest suitable option?
- For visual work, are there references, brand rules, or a Paper/design file?
- What time, cost, privacy, deployment, or access constraints affect setup?
- Does the owner want direct building or guided pair mode?

Resolve observable technical facts yourself. Wait for decisions that affect the
structure or first outcome; other unknowns can stay open. Once enough is known,
continue setup without another approval round.

## Create the structure

For existing work, inspect relevant code, entry points, documents, and Git history.
Reuse the layout and established decisions rather than reorganizing working code.

For new work, create the directories, entry files, and configuration needed by the
first outcome. Use current official documentation, preferably Context7, for the
selected framework. Avoid empty placeholder trees, speculative packages, and a
default monorepo or stack. Add dependencies only for the selected setup.

Setup covers local scaffolding and documents. Respect a narrower discussion-only
or documents-only request. Leave product features for the next task, and follow
the project's authorization rules for external actions.

## Populate the Markdown files

Write the files from the answers and observed work. Reuse equivalent existing
records and filenames; create a missing record only when its role is needed.

| File | Contents |
|---|---|
| AGENTS.md | Confirmed working rules, structure, commands, document links, build/pair mode, and skill routing. Preserve established rules and require buildr-unslop for writing. |
| PROJECT.md | Users, problem, scope, exclusions, architecture, constraints, decisions, and progress. |
| IMPLEMENTATION_PHASES.md | Current baseline, next usable outcome, dependencies, steps, completion check, and next action. |
| DESIGN.md | Accepted visual direction, references, tokens, and components, or not applicable. Distinguish observed styling from confirmed decisions. |

Replace placeholders where facts are known. Keep unknowns explicit and distinguish
existing behavior from verified behavior. Do not invent metrics, past decisions,
or check results. Use buildr-sync's rules for living logs, dates, and document versions.

## Check and finish

Check that the files, entry points, links, and descriptions agree. Use one focused
check for a runnable scaffold when available; report unavailable checks accurately.

Report the structure created or reused, files written, unresolved questions,
checks, and next action. A chat summary alone does not complete setup.
