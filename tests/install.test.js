import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  rmSync, statSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { check, install, installationFiles, KitError, MARKER, ROOT, VERSION } from '../src/installer.js';

const cli = join(ROOT, 'bin/buildr-stack.js');
const quiet = { log() {} };

function workspace(t) {
  const root = mkdtempSync(join(tmpdir(), 'buildr-stack-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function symlink(t, source, destination, type = 'dir') {
  try { symlinkSync(source, destination, type); }
  catch (error) {
    if (['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) {
      t.skip('This environment does not permit symlink creation.');
      return false;
    }
    throw error;
  }
  return true;
}

function run(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}

test('conflicts preserve existing work and write nothing else', (t) => {
  const target = workspace(t);
  writeFileSync(join(target, 'PROJECT.md'), "owner's work");
  assert.throws(() => install(target, installationFiles('Example'), quiet), /Existing files differ; nothing written/);
  assert.equal(readFileSync(join(target, 'PROJECT.md'), 'utf8'), "owner's work");
  assert.deepEqual(readdirSync(target), ['PROJECT.md']);
});

test('managed symlink parents are rejected before any write', (t) => {
  const root = workspace(t);
  const target = join(root, 'project');
  const outside = join(root, 'outside');
  mkdirSync(target);
  mkdirSync(outside);
  if (!symlink(t, outside, join(target, '.agents'))) return;
  assert.throws(() => install(target, installationFiles('Example'), quiet), /managed symlink/);
  assert.deepEqual(readdirSync(outside), []);
  assert.deepEqual(readdirSync(target), ['.agents']);
});

test('a symlink project root is rejected', (t) => {
  const root = workspace(t);
  const outside = join(root, 'outside');
  const target = join(root, 'project');
  mkdirSync(outside);
  if (!symlink(t, outside, target)) return;
  assert.throws(() => install(target, installationFiles('Example'), quiet), /managed symlink/);
  assert.deepEqual(readdirSync(outside), []);
});

test('a dangling managed file symlink is rejected', (t) => {
  const root = workspace(t);
  const link = join(root, 'PROJECT.md');
  if (!symlink(t, join(root, 'missing'), link, 'file')) return;
  assert.throws(() => install(root, installationFiles('Example'), quiet), /managed symlink/);
  assert.equal(lstatSync(link).isSymbolicLink(), true);
  assert.deepEqual(readdirSync(root), ['PROJECT.md']);
});

test('dry runs leave nonexistent destinations uncreated', (t) => {
  const target = join(workspace(t), 'new');
  const result = install(target, installationFiles('Example'), { ...quiet, dryRun: true });
  assert.ok(result.created > 0);
  assert.equal(existsSync(target), false);
});

test('repeat installs preserve file modification times in paths with spaces', (t) => {
  const target = join(workspace(t), 'path with spaces');
  const files = installationFiles('Small project', 'pair');
  install(target, files, quiet);
  const times = () => [...files.keys()].map((name) => statSync(join(target, name), { bigint: true }).mtimeNs);
  const originalTimes = times();
  assert.deepEqual(install(target, files, quiet), { created: 0, unchanged: files.size });
  assert.deepEqual(times(), originalTimes);
  assert.deepEqual(check(target), []);
});

test('skills-only preserves existing project documents', (t) => {
  const target = workspace(t);
  writeFileSync(join(target, 'AGENTS.md'), 'existing project rules');
  install(target, installationFiles('Example', 'build', true), quiet);
  assert.equal(readFileSync(join(target, 'AGENTS.md'), 'utf8'), 'existing project rules');
  assert.equal(existsSync(join(target, 'PROJECT.md')), false);
  assert.equal(existsSync(join(target, '.agents/skills/buildr-start/SKILL.md')), true);
  assert.deepEqual(check(target), []);
});

test('exclusive creation preserves a file added after preflight', (t) => {
  const target = workspace(t);
  const files = new Map([['PROJECT.md', Buffer.from('template')]]);
  assert.throws(() => install(target, files, {
    log() { writeFileSync(join(target, 'PROJECT.md'), "owner's new work"); },
  }), { code: 'EEXIST' });
  assert.equal(readFileSync(join(target, 'PROJECT.md'), 'utf8'), "owner's new work");
});

test('invalid project names fail before creating a directory', (t) => {
  const cwd = workspace(t);
  for (const name of ['', ' ', 'a\nb', 'x'.repeat(101)]) {
    const result = run(['init', 'new', '--name', name], cwd);
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /Project name must be/);
    assert.equal(existsSync(join(cwd, 'new')), false);
  }
});

test('CLI installs templates, Unicode names, pair mode, and all skills from another directory', (t) => {
  const cwd = workspace(t);
  const result = run(['init', 'path with spaces', '--name', 'Café $& {{session_mode}}', '--mode', 'pair'], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /manually invoke buildr-start/);
  const target = join(cwd, 'path with spaces');
  assert.match(readFileSync(join(target, 'PROJECT.md'), 'utf8'), /Café \$& \{\{session_mode\}\}/);
  assert.deepEqual(JSON.parse(readFileSync(join(target, MARKER), 'utf8')), {
    version: VERSION, name: 'Café $& {{session_mode}}', mode: 'pair', skills_only: false,
  });
  for (const [name, content] of installationFiles('Café $& {{session_mode}}', 'pair')) {
    assert.deepEqual(readFileSync(join(target, name)), content, name);
  }
  assert.equal(existsSync(join(target, '.git')), false);
  assert.equal(run(['check'], target).status, 0);
});

test('CLI dry run, help, and version work from another directory', (t) => {
  const cwd = workspace(t);
  const preview = run(['init', 'new', '--skills-only', '--dry-run'], cwd);
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /Would create/);
  assert.equal(existsSync(join(cwd, 'new')), false);
  for (const args of [[], ['--help'], ['init', '--help'], ['check', '--help']]) {
    const result = run(args, cwd);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage: buildr-stack/);
  }
  assert.equal(run(['--version'], cwd).stdout.trim(), `buildr-stack ${VERSION}`);
});

test('CLI rejects invalid commands and options without writing', (t) => {
  const cwd = workspace(t);
  const invalid = [
    ['nope'], ['init'], ['init', 'new', 'extra'], ['init', 'new', '--unknown'],
    ['init', 'new', '--mode', 'wrong'], ['init', 'new', '--name'],
    ['check', '.', '--skills-only'], ['check', '.', 'extra'],
  ];
  for (const args of invalid) {
    const result = run(args, cwd);
    assert.equal(result.status, 2, `${args.join(' ')}: ${result.stderr}`);
    assert.match(result.stderr, /^Error:/);
  }
  assert.deepEqual(readdirSync(cwd), []);
});

test('check reports missing installed files and broken local links', (t) => {
  const target = workspace(t);
  install(target, installationFiles('Example'), quiet);
  rmSync(join(target, '.agents/skills/buildr-plan/SKILL.md'));
  writeFileSync(join(target, 'PROJECT.md'), '[Missing](missing.md)\n');
  const result = run(['check', target], target);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /Missing skill:/);
  assert.match(result.stderr, /missing local link target missing.md/);
});

test('check rejects symlinks and invalid metadata', (t) => {
  const root = workspace(t);
  const target = join(root, 'project');
  install(target, installationFiles('Example'), quiet);
  for (const metadata of [null, [], {}, { skills_only: true, version: 'other' }]) {
    writeFileSync(join(target, MARKER), JSON.stringify(metadata));
    assert.throws(() => check(target), KitError);
  }
  rmSync(join(target, MARKER));
  const outside = join(root, 'outside.json');
  writeFileSync(outside, JSON.stringify({ version: VERSION, skills_only: false }));
  if (!symlink(t, outside, join(target, MARKER), 'file')) return;
  assert.throws(() => check(target), /managed symlink/);
});
