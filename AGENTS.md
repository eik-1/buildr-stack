# Working on buildr-stack

buildr-stack distributes project documents and agent skills. `skills/` holds the
instructions; `templates/` holds the four starter documents.

- Always read and apply [buildr-unslop](skills/buildr-unslop/SKILL.md) when starting
  a session. Apply it to every response and every piece of prose you write or edit.
- Inspect git status before editing. Preserve unrelated work.
- Keep the installer dependency-free, using Node.js built-in modules and Node.js 22+.
- Install skills once in `.agents/skills/`. Keep direct file routing in the
  generated AGENTS.md for hosts without native discovery of that directory.
- Never overwrite a different existing file or write through a managed symlink.
- Do not install tools, edit global settings, contact services, or initialize a
  user's Git repository from the installer.
- Keep skills useful without paid providers or subagents. Report missing access
  and use an available fallback.
- Keep usage and troubleshooting in README.md. Read [research](docs/research.md)
  before changing the reasoning behind the workflow.
- For installer changes, run the focused preservation tests. Static file checks
  do not establish native skill discovery or model behavior.
- Use current official documentation for agent discovery and MCP formats. Prefer
  Context7 when available and cite sources for changed integration guidance.
- Never include secrets or private project content in reports or examples.
- Do not commit, push, publish, or trigger paid calls unless the user requests them.

## Commit messages

When a commit is authorized, use `vMAJOR.MINOR: concise description` as its subject.
Read the latest version-prefixed commit and increase its integer minor by one,
so v0.1 becomes v0.2 and v0.9 becomes v0.10. Keep this sequence separate from
document and package versions. Review the staged diff and commit only intended files.
