import { basename } from 'node:path';
import { parseArgs } from 'node:util';
import { check, installationFiles, install, KitError, projectPath, VERSION } from './installer.js';

const HELP = `Usage: buildr-stack <command> [options]

Install project documents and skills without replacing existing files.

Commands:
  init <directory>     Install templates and skills in a project
  check [directory]   Check installed files; defaults to the current directory

Options for init:
  --name <name>       Project name; defaults to the destination folder name
  --mode <mode>       build or pair; defaults to build
  --skills-only       Preserve all existing project documents
  --dry-run           Show the install plan without writing

General options:
  -h, --help          Show help
  -v, --version       Show version
`;

export function main(args = process.argv.slice(2), { log = console.log, error = console.error } = {}) {
  try {
    const { values, positionals } = parseArgs({
      args,
      allowPositionals: true,
      options: {
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
        name: { type: 'string' },
        mode: { type: 'string' },
        'skills-only': { type: 'boolean' },
        'dry-run': { type: 'boolean' },
      },
    });
    if (values.version) { log(`buildr-stack ${VERSION}`); return 0; }
    if (values.help || !args.length) { log(HELP); return 0; }
    const [command, directory] = positionals;
    if (command !== 'init' && command !== 'check') {
      throw new KitError('Expected init or check. Run buildr-stack --help for usage.');
    }
    if (positionals.length > 2) throw new KitError(`Too many arguments for ${command}.`);
    if (command === 'init') {
      if (!directory) throw new KitError('init requires a destination directory.');
      const mode = values.mode ?? 'build';
      if (mode !== 'build' && mode !== 'pair') throw new KitError('--mode must be build or pair.');
      const target = projectPath(directory);
      const files = installationFiles(values.name ?? basename(target), mode, values['skills-only'] ?? false);
      const { created, unchanged } = install(target, files, { dryRun: values['dry-run'], log });
      log(`${values['dry-run'] ? 'Planned' : 'Installed'} ${created} files; ${unchanged} identical files preserved.`);
      if (!values['dry-run']) {
        log(values['skills-only']
          ? 'Skills copied. Existing project documents are unchanged.'
          : 'Templates copied. Project documents still need project facts.');
        log('The installer does not inspect your work or run an AI agent.');
        log(`\nNext: open ${target} in your coding agent and manually invoke buildr-start.`);
        log('In Codex: $buildr-start');
        log('If the skill is not in your agent\'s catalog, send:\n');
        log('Use buildr-start. Read .agents/skills/buildr-start/SKILL.md and follow it.');
        log('\nThe skill asks about your project first. After your answers, it creates the needed structure and fills the project documents.');
      }
    } else {
      if (['name', 'mode', 'skills-only', 'dry-run'].some((option) => values[option] !== undefined)) {
        throw new KitError('check does not accept init options.');
      }
      const errors = check(projectPath(directory ?? '.'));
      if (errors.length) { error(errors.join('\n')); return 1; }
      log('Structure, buildr-stack frontmatter, and local file links passed.');
      log('This does not verify agent discovery, MCP access, or product behavior.');
    }
    return 0;
  } catch (failure) {
    error(`Error: ${failure.message}`);
    return 2;
  }
}
