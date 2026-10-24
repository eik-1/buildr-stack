# Contributing to buildr-stack

Use [GitHub issues](https://github.com/eik-1/buildr-stack/issues) to report bugs or
discuss changes. For an installer bug, include the buildr-stack version, Node.js
and npm versions, operating system, command, expected result, and actual output.
Mention whether you used a new directory or an existing project.

## Local setup

Use Node.js 22 or later and npm:

```bash
git clone https://github.com/eik-1/buildr-stack.git
cd buildr-stack
npm ci --ignore-scripts
npm run check
npm test
```

There are no runtime or development package dependencies. npm uses the lockfile
to check the package setup. The CLI runs directly from source without a build:

```bash
node bin/buildr-stack.js --help
node bin/buildr-stack.js init ../example --dry-run
```

## Where to make changes

- `bin/buildr-stack.js` is the executable entry point.
- `src/cli.js` handles arguments, help, and output.
- `src/installer.js` copies files and checks project records.
- `templates/` contains the four starter documents.
- `skills/` contains the agent instructions installed in `.agents/skills/`.
- `tests/` covers file preservation, CLI behavior, and the npm tarball.
- `docs/` contains workflow research, integrations, and release instructions.

Keep the installer dependency-free. Preserve existing files and reject managed
symlinks. It should write only the requested project files, without initializing
Git, changing global configuration, installing tools, or calling an AI service.

## Before submitting a change

Run `npm run check` and `npm test`. For packaging changes, also inspect
`npm pack --dry-run`. The package test packs the checkout and runs its CLI from a
different directory using an isolated, offline npm cache. It checks that the
templates, skills, and license ship with the executable.

Add a focused regression test when changing file preservation or CLI behavior.
Update usage and troubleshooting in README.md when commands change. Keep an
Unreleased entry in CHANGELOG.md for changes after the latest npm release.

Describe the problem, resulting behavior, and verification in your pull request.
File checks do not verify native skill discovery or model behavior; report any
agent testing separately.

See the [release guide](docs/releases.md) for publishing. Contributions use the
project's [MIT license](LICENSE).
