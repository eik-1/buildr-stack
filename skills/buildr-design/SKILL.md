---
name: buildr-design
description: "Create or reconcile a project's visual system and carry it into implemented UI. Use for design direction, Paper-to-code work, or shared component consistency, not backend-only changes."
license: MIT
---

# Design and implement a consistent interface

Read the relevant DESIGN.md sections, real product content, current components,
and the rendered path. Preserve the owner's accepted direction and scope.

1. Name the user's task and the page's job. Select a few references only when a
   direction is missing. Record their URLs or supplied images, the exact layout,
   hierarchy, interaction, or state to adapt, and why it fits. A mood label is
   insufficient. Do not copy brand assets or claim references were inspected
   when only search snippets were available.
2. If Paper or another design workspace is available, inspect the specific file
   and frames before editing. Read their structure, token roles, and relevant
   screenshots through exposed tools. Record the selected file in DESIGN.md and
   confirm the requested edits are in scope. If unavailable, use DESIGN.md and a preview; disclose
   that the design file was not inspected or synchronized.
3. Define the smallest token and component set needed by the path. Record semantic
   colors, type roles, spacing, states, responsive behavior, keyboard access, and
   reduced motion in DESIGN.md. Reuse the project's existing component library.
   Do not impose a fixed aesthetic, font, framework, or marketing layout.
4. Choose a medium for each important visual. Real media demonstrates the product;
   native code renders UI and text; generated imagery needs a specific subject
   and purpose. Missing proof becomes a named placeholder with aspect ratio, crop,
   source requirement, and replacement path. Never fabricate customer results.
5. Implement the selected path. Use shared primitives for repeated controls and
   truthful states. Design system consistency does not require every section to
   have the same composition. Copy should help a person act or recover.
6. Inspect the actual rendered path at a narrow phone width and a small laptop
   width suited to the layout. Exercise focus, keyboard navigation, loading/error
   states, and motion where changed. Check relevant console and network output.
   Prefer the environment's shared browser; respect human-controlled tabs.

Resolve disagreement between design frames, accepted records, and code using the
current request and evidence. Update the affected tokens and components together.
Do not silently export an entire design or turn a generated mockup into completion
evidence. Report missing assets and any owner-only or unavailable checks.
