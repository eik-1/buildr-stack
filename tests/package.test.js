import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROOT, VERSION } from '../src/installer.js';

test('packed npm package runs through npm exec offline without the source checkout', (t) => {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    t.skip('Run npm test to include the npm package smoke test.');
    return;
  }
  const root = mkdtempSync(join(tmpdir(), 'buildr-stack-package-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const cache = join(root, 'cache');
  const consumer = join(root, 'consumer');
  mkdirSync(consumer);
  const npm = (args, cwd) => execFileSync(process.execPath, [npmCli, ...args], {
    cwd, encoding: 'utf8', timeout: 60_000,
    env: { ...process.env, npm_config_cache: cache, npm_config_offline: 'true' },
  });
  const [packed] = JSON.parse(npm(['pack', '--json', '--ignore-scripts', '--pack-destination', root], ROOT));
  const paths = new Set(packed.files.map((file) => file.path));
  for (const file of ['package.json', 'bin/buildr-stack.js', 'src/installer.js', 'src/cli.js',
    'LICENSE', 'README.md', 'AGENTS.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
    'assets/banner.jpg', 'docs/research.md', 'docs/releases.md',
    'templates/AGENTS.md', 'templates/PROJECT.md', 'templates/DESIGN.md', 'templates/IMPLEMENTATION_PHASES.md']) {
    assert.ok(paths.has(file), `Missing packaged file: ${file}`);
  }
  for (const name of ['start', 'plan', 'pair', 'research', 'design', 'review', 'sync', 'unslop']) {
    assert.ok(paths.has(`skills/buildr-${name}/SKILL.md`));
  }
  assert.equal([...paths].some((path) => /^(tests|node_modules|\.github)\//.test(path) || path.endsWith('.py')), false);
  const tarball = join(root, packed.filename);
  const exec = (args, cwd = consumer) => npm([
    'exec', '--yes', '--offline', '--ignore-scripts', '--package', tarball, '--', 'buildr-stack', ...args,
  ], cwd);
  assert.equal(exec(['--version']).trim(), `buildr-stack ${VERSION}`);
  assert.match(exec(['init', 'my-project', '--name', 'Packed project']), /Templates copied/);
  const project = join(consumer, 'my-project');
  assert.match(readFileSync(join(project, 'PROJECT.md'), 'utf8'), /Packed project/);
  assert.ok(existsSync(join(project, '.agents/skills/buildr-start/SKILL.md')));
  assert.match(exec(['check'], project), /local file links passed/);
  assert.match(exec(['init', 'preview', '--dry-run']), /Would create/);
  assert.equal(existsSync(join(consumer, 'preview')), false);
});
