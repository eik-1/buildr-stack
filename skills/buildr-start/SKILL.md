---
name: buildr-start
description: "Turn a rough idea or an existing repository into a scoped project brief and the first usable outcome. Use when starting a project or adopting buildr-stack, not for ordinary feature edits."
license: MIT
---

# Start a project

Use the idea in chat, existing project notes, and code as evidence. Identify
whether this is a new project, an existing codebase, or an extension of a project
already using these documents. Preserve existing instructions and decisions.

The installer supplies a name, not a product brief. Before planning or writing
application code, establish who the project is for, the problem it solves, and
the first useful result. Use facts already supplied in chat, documents, or code.
If the owner has supplied only a name, ask: "What are you building, who is it for,
and what should someone be able to do in the first version?" Wait for the answer
before choosing product scope, a framework, or features. Repository inspection
can continue while waiting. Do not infer a product from its name.

1. Inspect repository status and the existing entry points. Read only documents
   relevant to the product's first user and current path. Do not scan secrets.
2. State the first user, their problem, one useful result, and explicit exclusions.
   Separate facts, preferences, assumptions, and unresolved decisions.
3. Resolve observable facts yourself. Ask only questions that change scope or a
   decision the owner must make. Group at most a few related questions at a time.
   Ask about platform, cost, access, or design constraints when they affect the
   selected result. Do not repeat answered questions or require a fixed intake form.
   Continue independent work while waiting. Keep missing facts open; silence is
   neither a product decision nor spending authorization.
4. Update PROJECT.md and the first outcome in IMPLEMENTATION_PHASES.md. Keep the
   project's existing filenames when they already cover these roles. Link them
   from AGENTS.md. Keep PROJECT.md's living logs and Doc version current using
   buildr-sync's update rules. Put daily steps and the next action in the roadmap.
5. Keep selected tools, access requirements, and costs in PROJECT.md only when
   they affect the work. Put visual decisions in DESIGN.md. For nonvisual work,
   mark design not applicable. Do not choose a service just to fill a template.

If installed with skills only, use the owner's existing documents first. Request
or create missing records within the authorized adoption scope, not an entire
parallel documentation system. A small utility may need only a concise brief.
When setting up the project's agent rules, require buildr-unslop for every
response and piece of prose. Preserve the owner's other instructions.

Finish with the selected first result, real prerequisites, unresolved decisions,
and the next action. Do not claim that scaffolding means the product works.
