# {{project_name}} design

Status: undecided. For a CLI, library, or backend-only project, mark visual design
not applicable and keep any relevant output-format conventions.

## Direction and references

[OPEN: audience, primary task, tone, and a few references with exact lessons to
adapt. If Paper or another design file exists, record its link and relevant frame
names here. Do not copy another product's content, logo, or private assets.]

## Tokens

[OPEN: semantic color roles, typography, spacing, radii, and motion as needed.]

Record exact values only after a direction is selected. Map them to code token
names. Do not adopt buildr-stack's branding as the project's design.

## Components and states

[OPEN: smallest reusable component set needed by the first path. Include loading,
empty, success, error, disabled, focus, and validation states where relevant.]

## Layout and interaction

[OPEN: density, content order, responsive behavior, keyboard access, and reduced
motion. Derive breakpoints from the layout rather than arbitrary device names.]

## Assets

| Slot | Purpose | Medium | Source or target | Size and crop | Readiness |
|---|---|---|---|---|---|

Choose real product media for evidence, native code for UI, generated images for
specific artwork, and named placeholders for unavailable assets. Never fabricate
customer proof, screenshots, output, or readable interface text in images.

## Source of truth and verification

DESIGN.md owns accepted current visual decisions. Paper frames and code tokens
must reflect them. If they disagree, inspect the changed frame and rendered UI,
resolve the intended change with available evidence, and update the affected
records. Do not silently pick the newest timestamp.

Record the changed path, viewport sizes, states, and any unavailable checks.
A generated mockup is not proof that the implemented screen matches.
