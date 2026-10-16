#!/usr/bin/env python3
"""Install local project records and skills without replacing existing files."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

VERSION = "0.1.0"
ROOT = Path(__file__).resolve().parent
MARKER = ".buildr-stack.json"
AGENT_ROOTS = {
    "codex": (".agents/skills",),
    "claude": (".claude/skills",),
    "both": (".agents/skills", ".claude/skills"),
    "manual": ("skills",),
}
TOKENS = {"project_name", "session_mode"}


class KitError(Exception):
    pass


def project_path(value: str) -> Path:
    return Path(value).expanduser().absolute()


def installation_files(
    name: str, agent: str, mode: str, skills_only: bool
) -> dict[str, bytes]:
    if not name.strip() or len(name) > 100 or any(ord(c) < 32 for c in name):
        raise KitError(
            "Project name must be a nonempty single line of at most 100 characters."
        )
    files: dict[str, bytes] = {}
    if not skills_only:
        for source in sorted((ROOT / "templates").rglob("*")):
            if source.is_file():
                content = source.read_text(encoding="utf-8")
                for key, value in {"project_name": name, "session_mode": mode}.items():
                    content = content.replace("{{" + key + "}}", value)
                files[source.relative_to(ROOT / "templates").as_posix()] = (
                    content.encode("utf-8")
                )
    notice = (ROOT / "LICENSE").read_bytes()
    files["BUILDR_STACK_LICENSE.txt"] = notice
    for skill_root in AGENT_ROOTS[agent]:
        for source in sorted((ROOT / "skills").rglob("*")):
            if source.is_file():
                relative = source.relative_to(ROOT / "skills").as_posix()
                files[f"{skill_root}/{relative}"] = source.read_bytes()
        for skill in sorted((ROOT / "skills").iterdir()):
            if skill.is_dir():
                files[f"{skill_root}/{skill.name}/LICENSE.txt"] = notice
    metadata = {
        "version": VERSION,
        "name": name,
        "agent": agent,
        "mode": mode,
        "skills_only": skills_only,
    }
    files[MARKER] = (json.dumps(metadata, indent=2, ensure_ascii=False) + "\n").encode(
        "utf-8"
    )
    return files


def guard_path(target: Path, relative: str) -> Path:
    destination = target / relative
    # Inspect only managed parents, including the requested project root.
    for parent in Path(relative).parents:
        candidate = target / parent
        if candidate.is_symlink():
            raise KitError(f"Refusing a managed symlink: {candidate}")
        if candidate.exists() and not candidate.is_dir():
            raise KitError(f"Expected a directory: {candidate}")
    if destination.is_symlink():
        raise KitError(f"Refusing a managed symlink: {destination}")
    return destination


def install(
    target: Path, files: dict[str, bytes], dry_run: bool = False
) -> tuple[int, int]:
    create: list[tuple[Path, bytes]] = []
    unchanged = 0
    conflicts: list[str] = []
    for relative, content in files.items():
        destination = guard_path(target, relative)
        if destination.exists():
            if destination.is_file() and destination.read_bytes() == content:
                unchanged += 1
            else:
                conflicts.append(relative)
        else:
            create.append((destination, content))
    if conflicts:
        raise KitError(
            "Existing files differ; nothing written:\n  "
            + "\n  ".join(conflicts)
            + "\nUse a new directory, or --skills-only for an existing project. See README.md."
        )
    for destination, content in create:
        print(
            f"{'Would create' if dry_run else 'Create'} {destination.relative_to(target).as_posix()}"
        )
        if not dry_run:
            guard_path(target, destination.relative_to(target).as_posix())
            destination.parent.mkdir(parents=True, exist_ok=True)
            # Exclusive creation preserves files added after preflight too.
            with destination.open("xb") as output:
                output.write(content)
    return len(create), unchanged


def validate_skill(path: Path) -> list[str]:
    content = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n", content, re.S)
    if not match:
        return [f"{path}: missing frontmatter"]
    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        key, separator, value = line.partition(":")
        if not separator or key in fields:
            return [f"{path}: invalid or duplicate field"]
        value = value.strip()
        # The shipped skills deliberately use only one-line string fields.
        if value.startswith('"'):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                return [f"{path}: invalid quoted field"]
        if not isinstance(value, str):
            return [f"{path}: field must be a string"]
        fields[key] = value
    name = fields.get("name", "")
    errors = []
    if (
        not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name)
        or len(name) > 64
        or name != path.parent.name
    ):
        errors.append(
            f"{path}: name must match its folder and use lowercase words with hyphens"
        )
    if not 1 <= len(fields.get("description", "")) <= 1024:
        errors.append(f"{path}: description must contain 1 to 1024 characters")
    if not content[match.end() :].strip():
        errors.append(f"{path}: empty instructions")
    return errors


def validate_links(paths: list[Path]) -> list[str]:
    errors = []
    for path in paths:
        content = path.read_text(encoding="utf-8")
        # Check local file targets; this is not a full Markdown or anchor parser.
        for link in re.findall(r"!?\[[^\]\n]*\]\(([^\s)]+)\)", content):
            url = urlsplit(link)
            if url.scheme or link.startswith("#"):
                continue
            linked = path.parent / unquote(url.path)
            if not linked.exists():
                errors.append(f"{path}: missing local link target {link}")
    return errors


def check(target: Path) -> list[str]:
    errors = []
    if (target / MARKER).exists():
        guard_path(target, MARKER)
        metadata = json.loads((target / MARKER).read_text(encoding="utf-8"))
        if not isinstance(metadata, dict) or metadata.get("agent") not in AGENT_ROOTS:
            raise KitError("Invalid installation metadata: expected a known agent.")
        if not isinstance(metadata.get("skills_only"), bool):
            raise KitError(
                "Invalid installation metadata: skills_only must be boolean."
            )
        if metadata.get("version") != VERSION:
            raise KitError(
                f"Installation version differs from checker {VERSION}; use the matching toolkit checkout."
            )
        roots = AGENT_ROOTS[metadata["agent"]]
        skills = []
        docs = []
        expected = [
            source.relative_to(ROOT / "skills")
            for source in sorted((ROOT / "skills").rglob("SKILL.md"))
        ]
        for root in roots:
            for relative in expected:
                path = guard_path(target, f"{root}/{relative.as_posix()}")
                if path.is_file():
                    skills.append(path)
                else:
                    errors.append(f"Missing skill: {path}")
                notice = guard_path(
                    target, f"{root}/{relative.parent.as_posix()}/LICENSE.txt"
                )
                if not notice.is_file():
                    errors.append(f"Missing skill license notice: {notice}")
        if not guard_path(target, "BUILDR_STACK_LICENSE.txt").is_file():
            errors.append("Missing BUILDR_STACK_LICENSE.txt attribution notice.")
        if not metadata["skills_only"]:
            for source in sorted((ROOT / "templates").rglob("*.md")):
                path = guard_path(
                    target, source.relative_to(ROOT / "templates").as_posix()
                )
                if path.is_file():
                    docs.append(path)
                else:
                    errors.append(f"Missing document: {path}")
        if len(roots) == 2:
            for relative in expected:
                left, right = (target / root / relative for root in roots)
                if (
                    left.is_file()
                    and right.is_file()
                    and left.read_bytes() != right.read_bytes()
                ):
                    errors.append(f"Skill copies differ: {relative.parent.name}")
    elif target == ROOT:
        skills = sorted((ROOT / "skills").rglob("SKILL.md"))
        docs = sorted(path for path in ROOT.rglob("*.md") if ".git" not in path.parts)
        if not skills:
            errors.append("No source skills found.")
        for path in (ROOT / "templates").rglob("*.md"):
            unknown = (
                set(re.findall(r"\{\{(.*?)\}\}", path.read_text(encoding="utf-8")))
                - TOKENS
            )
            if unknown:
                errors.append(f"{path}: unknown template tokens {sorted(unknown)}")
    else:
        raise KitError(
            "No .buildr-stack.json found. Use check without a path for source validation."
        )
    for path in skills:
        errors.extend(validate_skill(path))
    errors.extend(validate_links(docs + skills))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--version", action="version", version=f"buildr-stack {VERSION}"
    )
    commands = parser.add_subparsers(dest="command", required=True)
    init = commands.add_parser(
        "init", help="Install in a new project, or add only skills to an existing one"
    )
    init.add_argument("directory")
    init.add_argument(
        "--name", help="Project name; defaults to the destination folder name"
    )
    init.add_argument("--agent", choices=AGENT_ROOTS, default="codex")
    init.add_argument("--mode", choices=("build", "pair"), default="build")
    init.add_argument(
        "--skills-only",
        action="store_true",
        help="Preserve all existing project documents",
    )
    init.add_argument(
        "--dry-run", action="store_true", help="Show the install plan without writing"
    )
    inspect = commands.add_parser(
        "check",
        help="Check kit structure and local file links, not live agent behavior",
    )
    inspect.add_argument("directory", nargs="?", default=str(ROOT))
    args = parser.parse_args()
    try:
        target = project_path(args.directory)
        if args.command == "init":
            files = installation_files(
                args.name or target.name, args.agent, args.mode, args.skills_only
            )
            created, unchanged = install(target, files, args.dry_run)
            print(
                f"{'Planned' if args.dry_run else 'Installed'} {created} files; {unchanged} identical files preserved."
            )
            if not args.dry_run:
                print(
                    "Next: open the project in your agent and use buildr-start with your idea."
                )
        else:
            errors = check(target)
            if errors:
                print("\n".join(errors), file=sys.stderr)
                return 1
            print("Structure, buildr-stack frontmatter, and local file links passed.")
            print(
                "This does not verify agent discovery, MCP access, or product behavior."
            )
    except (KitError, OSError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
