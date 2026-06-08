import { execSync } from 'node:child_process';

const before = process.env.GITHUB_BEFORE;
const sha = process.env.GITHUB_SHA;

if (!before || /^0+$/.test(before)) {
  process.stdout.write('src_changed=true\n');
  process.stdout.write('playground_changed=true\n');
  process.exit(0);
}

const files = execSync(`git diff --name-only ${before} ${sha}`, {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

// Check if configuration files are changed. In this case, we want to run everything.
const globalChanged = files.some((file) =>
  [
    'vitest.config.ts',
    'vite.playground.config.ts',
    'vite.config.ts',
    'tsconfig.json',
    'package.json',
    'package-lock.json',
    '.prettierrc',
    'LICENSE',
  ].includes(file),
);

if (globalChanged) {
  process.stdout.write('src_changed=true\n');
  process.stdout.write('playground_changed=true\n');
  process.exit(0);
}

const srcChanged = files.some(
  (file) =>
    file.startsWith('src/') || file === 'README.md' || file === 'migration.md',
);

const playgroundChanged = files.some(
  (file) =>
    file.startsWith('playground/') ||
    file.startsWith('src/') ||
    file === 'index.html' ||
    file.startsWith('public/'),
);

process.stdout.write(`src_changed=${srcChanged}\n`);
process.stdout.write(`playground_changed=${playgroundChanged}\n`);
