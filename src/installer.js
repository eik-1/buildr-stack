import {
  existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const VERSION = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
export const MARKER = '.buildr-stack.json';
const SKILL_ROOT = '.agents/skills';
const TOKENS = new Set(['project_name', 'session_mode']);

export class KitError extends Error {}

export function projectPath(value) {
  if (value === '~') return homedir();
  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return resolve(homedir(), value.slice(2));
  }
  return resolve(value);
}

function stat(path) {
  return lstatSync(path, { throwIfNoEntry: false });
}

function text(path) {
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
}

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).sort((a, b) => (
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  )).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new KitError(`Refusing a managed symlink: ${path}`);
    if (entry.isDirectory()) return walkFiles(path);
    return entry.isFile() ? [path] : [];
  });
}

function relativePosix(root, path) {
  return relative(root, path).split(sep).join('/');
}

export function installationFiles(name, mode = 'build', skillsOnly = false) {
  if (!name.trim() || [...name].length > 100 || /[\x00-\x1f]/.test(name)) {
    throw new KitError('Project name must be a nonempty single line of at most 100 characters.');
  }
  const files = new Map();
  if (!skillsOnly) {
    const templates = join(ROOT, 'templates');
    for (const source of walkFiles(templates)) {
      const content = text(source).replace(/\{\{(project_name|session_mode)\}\}/g, (_, key) => (
        key === 'project_name' ? name : mode
      ));
      files.set(relativePosix(templates, source), Buffer.from(content));
    }
  }
  const notice = readFileSync(join(ROOT, 'LICENSE'));
  files.set('BUILDR_STACK_LICENSE.txt', notice);
  const skills = join(ROOT, 'skills');
  for (const source of walkFiles(skills)) {
    files.set(`${SKILL_ROOT}/${relativePosix(skills, source)}`, readFileSync(source));
  }
  for (const skill of readdirSync(skills, { withFileTypes: true })) {
    if (skill.isDirectory()) files.set(`${SKILL_ROOT}/${skill.name}/LICENSE.txt`, notice);
  }
  files.set(MARKER, Buffer.from(`${JSON.stringify({
    version: VERSION, name, mode, skills_only: skillsOnly,
  }, null, 2)}\n`));
  return files;
}

export function guardPath(target, relativePath) {
  const destination = join(target, relativePath);
  // Inspect only managed parents, including the requested project root.
  let parent = dirname(destination);
  while (true) {
    const info = stat(parent);
    if (info?.isSymbolicLink()) throw new KitError(`Refusing a managed symlink: ${parent}`);
    if (info && !info.isDirectory()) throw new KitError(`Expected a directory: ${parent}`);
    if (parent === target) break;
    parent = dirname(parent);
  }
  if (stat(destination)?.isSymbolicLink()) {
    throw new KitError(`Refusing a managed symlink: ${destination}`);
  }
  return destination;
}

export function install(target, files, { dryRun = false, log = console.log } = {}) {
  target = resolve(target);
  const create = [];
  let unchanged = 0;
  const conflicts = [];
  for (const [relativePath, content] of files) {
    const destination = guardPath(target, relativePath);
    const info = stat(destination);
    if (!info) create.push([relativePath, content]);
    else if (info.isFile() && readFileSync(destination).equals(content)) unchanged++;
    else conflicts.push(relativePath);
  }
  if (conflicts.length) {
    throw new KitError(`Existing files differ; nothing written:\n  ${conflicts.join('\n  ')}\nUse a new directory, or --skills-only for an existing project. See README.md.`);
  }
  for (const [relativePath, content] of create) {
    log(`${dryRun ? 'Would create' : 'Create'} ${relativePath}`);
    if (!dryRun) {
      const destination = guardPath(target, relativePath);
      mkdirSync(dirname(destination), { recursive: true });
      // Exclusive creation also preserves files added after preflight.
      writeFileSync(destination, content, { flag: 'wx' });
    }
  }
  return { created: create.length, unchanged };
}

export function validateSkill(path) {
  const content = text(path);
  const match = /^---\n(.*?)\n---\n/s.exec(content);
  if (!match) return [`${path}: missing frontmatter`];
  const fields = new Map();
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    const key = line.slice(0, colon);
    if (colon < 0 || fields.has(key)) return [`${path}: invalid or duplicate field`];
    let value = line.slice(colon + 1).trim();
    // The shipped skills deliberately use only one-line string fields.
    if (value.startsWith('"')) {
      try { value = JSON.parse(value); }
      catch { return [`${path}: invalid quoted field`]; }
    }
    if (typeof value !== 'string') return [`${path}: field must be a string`];
    fields.set(key, value);
  }
  const name = fields.get('name') ?? '';
  const errors = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64 || name !== basename(dirname(path))) {
    errors.push(`${path}: name must match its folder and use lowercase words with hyphens`);
  }
  const description = fields.get('description') ?? '';
  if (!description.length || [...description].length > 1024) {
    errors.push(`${path}: description must contain 1 to 1024 characters`);
  }
  if (!content.slice(match[0].length).trim()) errors.push(`${path}: empty instructions`);
  return errors;
}

function validateLinks(paths) {
  const errors = [];
  for (const path of paths) {
    // Check local file targets; this is not a full Markdown or anchor parser.
    for (const [, link] of text(path).matchAll(/!?\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('#')) continue;
      const linked = resolve(dirname(path), decodeURIComponent(link.split(/[?#]/)[0]));
      if (!existsSync(linked)) errors.push(`${path}: missing local link target ${link}`);
    }
  }
  return errors;
}

export function check(target) {
  target = resolve(target);
  const errors = [];
  let skills = [];
  let docs = [];
  const marker = guardPath(target, MARKER);
  if (stat(marker)) {
    const metadata = JSON.parse(text(marker));
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      throw new KitError('Invalid installation metadata: expected an object.');
    }
    if (typeof metadata.skills_only !== 'boolean') {
      throw new KitError('Invalid installation metadata: skills_only must be boolean.');
    }
    if (metadata.version !== VERSION) {
      throw new KitError(`Installation version differs from checker ${VERSION}; use the matching buildr-stack version.`);
    }
    const sourceSkills = join(ROOT, 'skills');
    for (const source of walkFiles(sourceSkills).filter((path) => basename(path) === 'SKILL.md')) {
      const relativePath = relativePosix(sourceSkills, source);
      const path = guardPath(target, `${SKILL_ROOT}/${relativePath}`);
      if (stat(path)?.isFile()) skills.push(path);
      else errors.push(`Missing skill: ${path}`);
      const notice = guardPath(target, `${SKILL_ROOT}/${relativePosix(sourceSkills, dirname(source))}/LICENSE.txt`);
      if (!stat(notice)?.isFile()) errors.push(`Missing skill license notice: ${notice}`);
    }
    if (!stat(guardPath(target, 'BUILDR_STACK_LICENSE.txt'))?.isFile()) {
      errors.push('Missing BUILDR_STACK_LICENSE.txt attribution notice.');
    }
    if (!metadata.skills_only) {
      const templates = join(ROOT, 'templates');
      for (const source of walkFiles(templates).filter((path) => path.endsWith('.md'))) {
        const path = guardPath(target, relativePosix(templates, source));
        if (stat(path)?.isFile()) docs.push(path);
        else errors.push(`Missing document: ${path}`);
      }
    }
  } else if (target === resolve(ROOT)) {
    skills = walkFiles(join(ROOT, 'skills')).filter((path) => basename(path) === 'SKILL.md');
    docs = [...readdirSync(ROOT).filter((name) => name.endsWith('.md')).map((name) => join(ROOT, name)),
      ...['templates', 'skills', 'docs'].flatMap((directory) => walkFiles(join(ROOT, directory))),
    ].filter((path) => path.endsWith('.md'));
    if (!skills.length) errors.push('No source skills found.');
    for (const path of walkFiles(join(ROOT, 'templates')).filter((path) => path.endsWith('.md'))) {
      const unknown = [...new Set([...text(path).matchAll(/\{\{(.*?)\}\}/g)].map((match) => match[1]))]
        .filter((token) => !TOKENS.has(token));
      if (unknown.length) errors.push(`${path}: unknown template tokens ${unknown.sort().join(', ')}`);
    }
  } else {
    throw new KitError('No .buildr-stack.json found. Run init first, or check a buildr-stack source directory.');
  }
  for (const path of skills) errors.push(...validateSkill(path));
  errors.push(...validateLinks([...docs, ...skills]));
  return errors;
}
