![buildr-stack. Project documents and skills for building with AI.](assets/banner.jpg)

# buildr-stack

Project setup and reusable skills for AI coding agents. Choose your own framework,
model, editor, and deployment tools.

## Start a new project

### 1. Install the starter

Clone or download this repository, then run with Python 3.10+:

```bash
python3 buildr_stack.py init ../my-project --name "My project"
```

This copies templates and skills into `my-project`. The project documents still
contain placeholders; the installer does not run an AI agent.

### 2. Manually invoke buildr-start

Open `my-project` in your coding agent. In Codex, invoke:

```text
$buildr-start
```

Use `/buildr-start` if your agent lists that command. Otherwise send:

```text
Use buildr-start. Read .agents/skills/buildr-start/SKILL.md and follow it.
```

The skill asks what you are building, who it is for, and what the first version
needs to do. It follows up about the platform, stack, design, constraints, and
build or pair mode. Answer its questions; you do not need to prepare a brief.

After your answers, it creates the needed folders, entry files, and configuration,
then populates the four project documents. Existing projects keep their layout.
Unknown decisions stay open.

### 3. Build the first outcome

Ask the agent to implement the next outcome in IMPLEMENTATION_PHASES.md.
Use `buildr-pair` to learn by trying each step, or set that default during
installation with `--mode pair`.

## Project documents

| File | Purpose |
|---|---|
| AGENTS.md | Working rules, structure, commands, and links to relevant records |
| PROJECT.md | Product, scope, architecture, decisions, and progress |
| IMPLEMENTATION_PHASES.md | Selected outcomes, completion checks, and next action |
| DESIGN.md | Visual rules, tokens, components, and references such as Paper frames |

PROJECT.md starts at document version v0.1. `buildr-sync` updates affected sections,
increments the minor version once per meaningful update, and records the change.
Commit subjects use a separate sequence, such as `v0.1: initial setup` and
`v0.2: add booking cancellation`, when you authorize commits.

To resume later, ask the agent to read the next incomplete roadmap outcome and
the relevant code.

## Skills

| Skill | Use |
|---|---|
| `buildr-start` | Ask about the project, create its structure, and populate the documents |
| `buildr-plan` | Detail the next roughly two-hour outcome |
| `buildr-pair` | Guide you through implementation one step at a time |
| `buildr-research` | Resolve a decision using current sources |
| `buildr-design` | Choose or reconcile visual rules and implemented UI |
| `buildr-review` | Review a changed path |
| `buildr-sync` | Update project records after meaningful work |
| `buildr-unslop` | Edit every response and written change using the bundled writing rules |

Use task skills when needed. AGENTS.md requires `buildr-unslop` for all writing;
it is copied from the author's system skill with its name and invocation setting
adapted for this kit.

All skills live in `.agents/skills/`. AGENTS.md maps tasks to their files for
agents without native discovery, including Claude Code. Direct file reads do not
register slash commands. See the official [Codex skill guide](https://learn.chatgpt.com/docs/build-skills)
and [Claude Code skill guide](https://code.claude.com/docs/en/skills#choose-where-skills-load).

Claude Code v2.1.277+ can read AGENTS.md directly. If the rules are not loading,
check **Project instructions** in `/config` and its
[instruction-loading guide](https://code.claude.com/docs/en/memory#agentsmd).
On Windows, use `py -3` if that is your Python command.

## Use an existing project

Preview the installation, then add only the skills:

```bash
python3 buildr_stack.py init ../existing-project --skills-only --dry-run
python3 buildr_stack.py init ../existing-project --skills-only
```

Open that repository and manually invoke `buildr-start`. It asks what you want to
keep or change, inspects existing work, and updates the project records. Equivalent
documents keep their names. Supply any context from sessions the agent cannot access.

If you already installed the full templates and still see `[OPEN: ...]` or seed
entries, invoke `buildr-start`; you do not need to reinstall.

## How installation works

The Python installer copies `templates/` and `skills/`, replacing the project-name
and mode placeholders. It checks for conflicts and managed symlinks before writing.
Identical files are skipped; different existing files stop the installation.
There is no overwrite option.

`.buildr-stack.json` records the kit version and installation options for the
checker. Copied kit files retain their MIT notices; your project's license is
your choice. The installer makes no network requests or global settings changes.
The coding agent performs the interview, scaffolding, and document updates.

## Repository folders

| Folder | Contents |
|---|---|
| `templates/` | The four starter documents |
| `skills/` | The eight SKILL.md instructions |
| `docs/` | Optional [MCP setup](docs/mcp.md), [design workflow](docs/design-workflow.md), and [research](docs/research.md) |
| `tests/` | Installer file-preservation checks |
| `.github/workflows/` | GitHub checks for Linux, macOS, and Windows |
| `assets/` | The mascot and banner |

Root AGENTS.md guides changes to this toolkit. The template copy guides work in
the projects it creates.

## Brand assets

[logo.png](assets/logo.png) is Chip, the transparent beaver mascot.
[banner.jpg](assets/banner.jpg) is the 1774 by 887 repository cover, about 288 KB.
Both use native image generation, with Space Grotesk Bold-style lettering and
IBM Plex Sans-style supporting text in the banner.

Upload the banner in your repository's Settings under Social preview.
See [GitHub's preview guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).

## Checks

```bash
python3 buildr_stack.py check
python3 buildr_stack.py check ../my-project
python3 -m unittest discover -s tests -v
```

These check structure, skill frontmatter, local file links, and installer
preservation. Native discovery, interview behavior, and live MCP access require
checks in an actual agent session. Instructions guide model behavior; they do not
enforce it.

[MIT license](LICENSE)
