# Changelog

Package versions follow semantic versioning. Commit subjects use the separate
sequence described in AGENTS.md.

## Unreleased

- Add contribution and release guides, including npm staging and cache troubleshooting.
- Check installation from the packed npm package in CI across Linux, macOS, and Windows.
- Keep text files consistent across operating systems with LF line endings.

## 0.2.0 - 2026-10-24

- Publish a dependency-free Node.js CLI runnable with
  `npx buildr-stack@latest init my-project`.
- Replace the Python installer. Require Node.js 22 or later.
- Bundle all starter documents, eight skills, and license notices in the npm package.
- Preserve `init`, `check`, `--name`, `--mode`, `--skills-only`, and `--dry-run`.
- Keep conflicting files untouched, reject managed symlinks, and preserve
  identical files on repeat installs.
- Default `check` to the current directory.
- Verify file preservation and CLI behavior with Node's built-in test runner.
