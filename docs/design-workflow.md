# Design with Paper and carry it into code

Use Paper when a visual workspace helps you make and inspect design choices.
The same workflow can use another design tool or an implemented local preview.
A library or backend-only project can skip it.

## Establish the task and direction

Start with the user's task and real content. Inspect the current interface before
redesigning it. Save a small number of references with the exact hierarchy,
composition, interaction, or state you want to adapt. A reference is evidence for
a choice, not permission to copy another product's assets or claims.

Choose a direction within the owner's scope. If they already asked you to build
that direction, proceed. Ask only about material unresolved choices, paid work,
or a scope change that needs their judgment.

## Create the smallest useful system

In a new design file, establish semantic token roles and shared controls needed
by the first screen. Then create representative screens with real content and
the important states. Avoid building a huge component catalog before one flow works.

Paper's [token documentation](https://paper.design/docs/tokens) explains reusable
design values. Use its current tools to inspect or edit the named file. Record
relevant frame names and the accepted rules in DESIGN.md. Never store private
credentials or account tokens alongside that reference.

## Map decisions to code

| Design decision | Code record |
|---|---|
| Semantic colors and typography | Existing theme tokens or variables |
| Repeated actions and form controls | Shared components and their supported variants |
| Loading, empty, failed, and saved states | Real product state and concise recovery copy |
| Screen composition and density | Layout rules for the relevant viewport sizes |
| Motion | Purpose, interruption, exit, and reduced-motion behavior |

Use a battle-tested component library when it fits the chosen stack. buildr-stack
does not require shadcn, React, or any other library. Reuse the existing library
before adding a parallel one.

## Decide where assets belong

Real screenshots and outputs prove product behavior. Native UI renders controls,
prices, and text. Generated images can supply specific artwork when the subject
calls for it. Placeholders keep a missing asset visible without pretending it exists.

Every missing asset should have a named slot, repository target, dimensions or
aspect ratio, crop, source requirement, and replacement instruction. Keep the UI
usable without optional decoration. Never generate fake dashboards, customer
testimonials, or unsupported output as product evidence.

## Inspect the implementation

Use the environment's shared browser first. Check the changed flow at a narrow
phone width and a small laptop width, then any other size the layout needs.
Exercise keyboard focus, affected interactions, loading/error states, and reduced
motion. Inspect the relevant console and network request.

Compare the rendered screen with the accepted design decisions. A Paper screenshot
or an AI mockup does not prove the code matches. Record unavailable checks and
ask the owner to perform the exact account-dependent action when needed.

## Keep records current

DESIGN.md owns accepted visual rules. Code tokens and relevant Paper frames reflect
them. A deliberate change in any of those places requires a focused reconciliation,
not a blind full export. The current request and inspected evidence determine
whether the design or implementation needs correction.

If Paper is disconnected, use DESIGN.md and the code preview for independent work.
Report which frames remain unsynchronized. The current
[Paper MCP setup](https://paper.design/docs/mcp) uses the desktop app's connection
flow and Paper CLI. Do not assume an old fixed localhost endpoint still applies.
