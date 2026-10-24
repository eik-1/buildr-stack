![buildr-stack. Project documents and skills for building with AI.](assets/banner.jpg)

# buildr-stack

[npm package](https://www.npmjs.com/package/buildr-stack) ·
[Checks](https://github.com/eik-1/buildr-stack/actions/workflows/check.yml) ·
[Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md)

buildr-stack gives your coding agent project documents and task instructions.
Run `buildr-start` to answer questions about your project, create its folder
structure, and fill the documents.

## Start a new project

### 1. Install the starter

Install [Node.js 22 or later](https://nodejs.org/en/download), which includes npm
and npx. Then run this command from the directory where you want your project:

```bash
npx buildr-stack@latest init my-project --name "My project"
```

This downloads buildr-stack and copies templates and skills into `my-project`.
The documents contain placeholders until you run the next step.

No repository clone or Python installation is needed.

### 2. Manually invoke buildr-start

Open `my-project` in your coding agent. In Codex, run:

```text
$buildr-start
```

Use `/buildr-start` if your agent lists that command. Otherwise send:

```text
Use buildr-start.
```

The skill asks what you are building, who will use it, and what the first version
should do. It then asks about tools, design, constraints, and whether you want to
build directly or learn step by step. Answer in the chat.

It uses your answers to create folders, starter files, and configuration, then
fills the four project documents. It reuses the layout of an existing project.
Decisions you have not made stay marked as open questions.

### 3. Start building

Ask the agent to implement the next task in IMPLEMENTATION_PHASES.md.
Use `buildr-pair` to learn by trying each step, or set that default during
installation with `--mode pair`.

## Project documents

| File                     | Purpose                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| AGENTS.md                | Agent instructions, project structure, commands, and document links   |
| PROJECT.md               | Product, scope, architecture, decisions, and progress                 |
| IMPLEMENTATION_PHASES.md | Work plan, checks, and next action                                    |
| DESIGN.md                | Visual rules, tokens, components, and references such as Paper frames |

PROJECT.md starts at v0.1. After work changes the project, `buildr-sync` updates
the relevant sections, bumps the document version, and adds a changelog entry.
Commit messages use a separate sequence, such as `v0.1: initial setup` and
`v0.2: add booking cancellation`, when you authorize commits.

To resume later, ask the agent to read the next unfinished task and its code.

## Skills

| Skill             | Use                                                                 |
| ----------------- | ------------------------------------------------------------------- |
| `buildr-start`    | Ask about the project, create its structure, and fill the documents |
| `buildr-plan`     | Plan the next two-hour work session                                 |
| `buildr-pair`     | Guide you through implementation one step at a time                 |
| `buildr-research` | Compare options using current sources                               |
| `buildr-design`   | Define the design and check that the UI matches it                  |
| `buildr-review`   | Review code changes                                                 |
| `buildr-sync`     | Update the project documents after work                             |
| `buildr-unslop`   | Remove AI writing patterns                                          |

AGENTS.md requires `buildr-unslop` for every response and written change.

## Use an existing project

From the parent directory, preview the installation, then add only the skills:

```bash
npx buildr-stack@latest init existing-project --skills-only --dry-run
npx buildr-stack@latest init existing-project --skills-only
```

If your terminal is already inside that project, use `.` as the destination.

Open that repository and run `buildr-start`. It asks what you want to keep or
change, reads the existing work, and fills or updates the documents. It keeps
existing document names. Provide any context from other sessions.

If you already installed the full templates and still see `[OPEN: ...]` or seed
entries, invoke `buildr-start`; you do not need to reinstall.

## Check an installation

```bash
npx buildr-stack@latest check my-project
```

Run `npx buildr-stack@latest check` inside a project to check the current directory.
These checks cover installed files, skill metadata, and local links. Agent behavior
and MCP connections need separate checks in the agent you use.

Use `npx buildr-stack@latest --help` to see all options.

## Troubleshooting

- If npx reports `ETARGET` immediately after a release, refresh npm's cached
  package information with
  `npx --prefer-online buildr-stack@latest init my-project`.
- If npx reports that it could not determine an executable and the registry shows
  `0.0.0-stage`, npm is serving a staging placeholder. The maintainer must finish
  npm's release process before the actual CLI is available. See the
  [release guide](docs/releases.md).
- If Node.js is older than 22, update it before running buildr-stack.
- If installation reports conflicting files, it leaves them untouched. Choose a
  new directory, or use `--skills-only` to preserve existing project documents.
  Review existing skill files yourself if they also conflict.
- If installation reports a managed symlink, choose a destination with regular
  files and directories. The installer refuses to write through managed symlinks.
- `check` expects `.buildr-stack.json` in the project. Run `init` before checking.
  If it reports a version mismatch, run `npx buildr-stack@<version> check` using
  the version recorded in that file.

## Development

From a checkout, run:

```bash
npm ci --ignore-scripts
npm run check
npm test
npm pack --dry-run
```

There are no package dependencies to install. The tests cover file preservation,
CLI commands, and running the packed package through npm from another directory.
The package test uses a local tarball and an isolated offline npm cache.

To try changes from a checkout, run
`node bin/buildr-stack.js init ../my-project`. Read [Contributing](CONTRIBUTING.md)
for the code layout and checks, and the [release guide](docs/releases.md) before
publishing a new version.

The package includes the CLI, templates, skills, documentation, and license.
Installation copies project-local files; it does not install dependencies, change
global settings, initialize Git, or call an AI service. npm handles downloading
the package before the installer runs.

[MIT license](LICENSE)
