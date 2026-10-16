![buildr-stack. Project documents and skills for building with AI.](assets/banner.jpg)

# buildr-stack

A starter for building projects with AI coding tools, based on the workflow I use.
It includes four project documents, eight skills, and a local installer. Choose
your own framework, model, editor, and deployment tools.

## Start a new project

Clone or download this repository. From its directory, run with Python 3.10+:

```bash
python3 buildr_stack.py init ../my-project --name "My project"
```

The command creates `my-project` beside the toolkit. Open that new directory in
your coding agent and describe your idea:

```text
Read .agents/skills/buildr-start/SKILL.md and follow it.
I want a booking tool for a local sports club.
Help me define the first useful version and leave unknown decisions explicit.
```

`--name` only labels the project. The installer creates documents and skills;
`buildr-start` handles the conversation about what you want to build. If you give
only a name, it must ask who the project is for, what problem it solves, and what
the first version should let someone do. It waits for that answer before choosing
scope, a framework, or application code. If your idea or existing project already
answers those questions, it reuses the facts and asks only about missing decisions.

Then ask it to plan one small outcome:

```text
Use buildr-plan to define the first roughly two-hour outcome and how to check it.
```

Ask the agent to implement that outcome normally. For a tutorial, use `buildr-pair`
so it explains one step, lets you try the code, and reviews your edit. You can set
that default during installation with `--mode pair` or change it in chat.

Use `buildr-design` when UI decisions need work, `buildr-review` to review a change,
and `buildr-sync` to update the project documents after meaningful work. Use
`buildr-research` when a decision needs external evidence. These are available
when needed; a small change does not need every skill.

## Shared agent setup

Every full install creates one `AGENTS.md` and one `.agents/skills/` directory.
There is no agent-selection flag or duplicate skill installation. AGENTS.md maps
each task to its skill file, so an agent can read the instructions directly.

Codex discovers this directory and supports `$buildr-start`. In hosts without
native discovery of the shared directory, including Claude Code, use the
plain-language prompt above. Reading a skill file does not register a slash command.
See the official [Codex](https://learn.chatgpt.com/docs/build-skills) and
[Claude Code](https://code.claude.com/docs/en/skills#choose-where-skills-load)
guides for native discovery behavior.

Claude Code v2.1.277+ supports AGENTS.md directly. Check **Project instructions**
in `/config` if those rules are not loading, and consult its
[instruction-loading guide](https://code.claude.com/docs/en/memory#agentsmd).
For another agent, ask it to read AGENTS.md and the relevant SKILL.md file.
On Windows, use `py -3` if that is your Python command.

## The four project documents

- `AGENTS.md` contains working rules and links to the other documents.
- `PROJECT.md` contains scope, architecture, decisions, and constraints.
- `IMPLEMENTATION_PHASES.md` contains daily outcomes, progress, checks, and the next action.
- `DESIGN.md` contains visual rules, components, tokens, and references such as Paper frames.

The installer fills in the project name and default mode. The remaining prompts
stay open until you and the agent make the actual product decisions. A nonvisual
project can mark design not applicable. Start a later session by asking the agent
to read the next incomplete roadmap outcome and relevant code.

PROJECT.md is a live document, following the versioned approach used in Refrakt.
It starts at `Doc version: v0.1` and includes decision, progress, learning, question,
metric, backlog, and changelog sections. After meaningful work, `buildr-sync`
updates only affected sections, increases the minor version once, and adds a dated
changelog entry. A no-op, typo fix, or design-only update does not bump the project version.

AGENTS.md also tells the agent to use version-prefixed commit subjects when you
authorize a commit, such as `v0.1: add the first working booking flow`, followed by
`v0.2: allow booking cancellation`. It reads the existing Git history before
choosing the next number. Commit numbering is separate from document and release
versions. Existing projects keep their established convention unless you change it.

The working rules carry over the owner's preferences: maintainable code, small
usable outcomes, checks at real boundaries, browser/manual verification, and no
redundant tests or hypothetical recovery code. The chosen framework remains yours.

`buildr-unslop` is copied from the author's system skill. AGENTS.md requires it
for every response and written change, with a direct file path for agents that
do not discover it. Its name is changed and the source's automatic-invocation
blocker is removed; the writing rules are otherwise preserved. These instructions
guide the agent; no background process enforces model behavior.

## Use an existing project

Preview the installation, then add only the skills:

```bash
python3 buildr_stack.py init ../existing-project --skills-only --dry-run
python3 buildr_stack.py init ../existing-project --skills-only
```

This adds skills, license notices, and installation metadata. It leaves existing
project documents intact. Ask `buildr-start` to reuse your current records and
preserve established rules. If your documents have different filenames, add their
roles and links to the instruction file your agent already reads.
Add `Always use buildr-unslop for every response and written change` to those
existing rules. Also tell the agent to read relevant instructions from
`.agents/skills/<skill-name>/SKILL.md` when they are absent from its catalog.
A skills-only install deliberately leaves existing rules untouched.

An identical repeat install skips existing files. Different existing files cause
the installer to stop before writing. Merge changes manually; there is no overwrite
option. Run one installer at a time. If an unexpected filesystem error interrupts
installation, review the error and rerun to preserve the identical files already created.

## What happens under the hood?

`buildr_stack.py` reads `templates/`, replaces the project-name and mode placeholders,
and copies the skills into `.agents/skills/`. It checks every planned
path for conflicts and symlinks before writing, then creates files without replacing
existing ones. A dry run reports that plan and writes nothing.

The generated `.buildr-stack.json` records the kit version, project name, mode,
and whether the install was skills-only. The checker reads it to determine
which files to expect. It does not track coding sessions. Each installed skill
includes its license notice, and BUILDR_STACK_LICENSE.txt covers the copied kit files.
Your project's own license remains your choice.

After installation, your coding agent reads the Markdown instructions and uses
its normal coding tools. It edits your project and updates its documents. Build
and pair modes are instructions to that agent. The installer itself does not run
a model, generate application code, or enforce the agent's behavior.

The installer makes no network requests, starts no background service, and changes
no global agent settings. It does not install a framework, connect MCP servers,
create commits, or deploy anything. Add services only when the project needs them.

## Repository folders

- `templates/` holds the four documents copied into a new project.
- `skills/` holds seven task instructions and the always-required `buildr-unslop`.
  Each folder contains a SKILL.md with a
  name, description, and steps for that task.
- `docs/` holds three optional guides: [MCP setup](docs/mcp.md),
  [design workflow](docs/design-workflow.md), and [research](docs/research.md).
- `tests/` checks that the installer preserves existing files.
- `.github/workflows/` runs file and installer checks on GitHub.
- `assets/` holds the transparent mascot logo and the wide README/social banner. Installation leaves these here.

AGENTS.md at the root guides changes to the toolkit itself. The AGENTS.md in
`templates/` is copied into users' projects and governs work in those projects.
They have different scopes; changes to the root rules are not installed into a project.
README.md explains use, LICENSE contains the MIT terms, and .gitignore excludes
local files and caches. The root script is the installer and checker.

## Brand assets

[logo.png](assets/logo.png) is Chip, the transparent beaver mascot.
[banner.jpg](assets/banner.jpg) is the 2:1 README cover and social-preview image.
Both were made with native image generation. The banner uses a bold geometric
wordmark prompted in the style of Space Grotesk Bold, with IBM Plex Sans-style
supporting text. Its exact copy is `buildr-stack`,
`Project documents and skills`, and `for building with AI.`

The banner is exported as a 1774 by 887 JPEG, about 288 KB, within
[GitHub's social-preview guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).
Upload it in your GitHub repository's Settings under Social preview.

<details>
<summary>Native generation prompts</summary>

The mascot was refined from an initial beaver concept; the finished mascot then
provided the identity reference for the banner. The final prompts are below.

Mascot refinement:

```text
Use case: style-transfer, logo-brand. This image is the identity reference and edit target for Chip, buildr-stack's beaver mascot. Refine this exact character into a simpler, more distinctive developer-tool mascot logo. Preserve its blue cap, broad beaver tail, two front teeth, cheerful competent personality, compact silhouette, and pose holding a small blue building block. Change the rendering to bold flat editorial ink: charcoal-black body shapes with warm ivory facial and belly cutouts, flat cobalt #2746db cap and block, very few orange-brown accent shapes. Remove all glossy highlights, gradients, fur shading and tiny linework. Make the block a simple flat geometric block WITHOUT a toy stud. Use clear irregular-but-clean ink outlines, strong negative space, minimal whiskers, small expressive eyes. It should feel like an indie open-source developer mascot, clear at 48 pixels, not a children's toy illustration. Keep one centered full-body character in a square composition with enough clear margin, genuinely transparent background and preserved alpha. No words, no letter marks, no border badge, no multiple variants, no mockup, no scenery. Render the actual finished mascot image.
```

Banner, with the mascot as its identity reference:

```text
Use case: ads-marketing / logo-brand. Asset type: final GitHub repository cover and social preview for buildr-stack, an open-source starter of project documents and skills for AI coding tools. Create ONE very wide horizontal banner with EXACT 2:1 aspect ratio, ideally 2048 pixels wide and 1024 pixels high. The supplied image is the identity reference for Chip, the original beaver mascot; use the SAME recognizable beaver, cobalt builder's cap, front teeth, tail and plain blue block. This is a newly composed banner, not a square mascot image. Composition: spacious editorial design, warm near-white/pale-blue #edf1fb canvas, dark charcoal #151820 text. Left 60% is typography with generous safe margins. Right 35% shows Chip as a large clean full-body ink illustration on the same background, with no border box. Wordmark uses confident large bold lowercase geometric grotesk typography in the style of Space Grotesk Bold, carefully kerned and easily readable at GitHub thumbnail size. Supporting copy uses clean IBM Plex Sans-style sans typography with comfortable line spacing. Include ONLY this exact text, correctly spelled and with a normal hyphen: largest wordmark 'buildr-stack'; two supporting lines 'Project documents and skills' and 'for building with AI.' Spell the wordmark b-u-i-l-d-r hyphen s-t-a-c-k. Make the wordmark fill most of its available left column without colliding with the mascot. The supporting two lines are smaller but still prominent. Use a small cobalt accent with restraint. Flat expressive editorial ink illustration, subtle paper feel, simple deliberate layout; no glossy 3D, no gradients, no dashboard mockups, no charts, no badges, no tiny technical labels, no fake metrics, no extra text, no watermark. Preserve a generous safe area at every edge. The final file must be the finished full-bleed wide banner, not a mockup of a banner.
```

Final banner refinement, using the first banner as the edit target:

```text
Use case: precise-object-edit. The attached banner is the EDIT TARGET. Make an upload-ready GitHub social-preview version. Preserve this exact design, original beaver mascot, colors, composition, generous margins, bold lowercase geometric typography and all spelling. Exact text unchanged: 'buildr-stack'; 'Project documents and skills'; 'for building with AI.' Keep the normal hyphen in buildr-stack. The only changes are smaller output and flat clean rendering: target 1280 by 640 pixels, exactly 2:1, a PNG file under 1 MB. Remove the paper grain, noise, fine texture and mottled shading, using crisp flat color fills and clean antialiasing so the image compresses well. Use a uniform pale blue background #edf1fb. Keep the mascot recognizable, with cobalt cap, blue block, two teeth, orange-brown fur, ivory face and belly, dark outlines, and large paddle tail. Preserve the strong type, same line breaks, no extra text, no watermark, no border. Render the finished banner itself, no mockup.
```

The generator retained the larger canvas. The selected result was exported as
JPEG at quality 93 to meet the upload size guidance without changing the layout.

</details>

## Checks and current limits

```bash
python3 buildr_stack.py check
python3 buildr_stack.py check ../my-project
python3 -m unittest discover -s tests -v
```

These commands check the file structure, the kit's one-line skill frontmatter,
local file links, and installer preservation. They do not prove native skill
discovery or model behavior. Fresh agent sessions, live MCP access, and GitHub CI
still need verification in their actual environments.

## Contribute or report a problem

Include the agent, command or prompt, expected result, and observed result. Run
the relevant checks for a change and remove private project content from reports.
For a security issue, use a private maintainer contact or private GitHub report if
available. Never post credentials, signed URLs, or customer data.

[MIT license](LICENSE)
