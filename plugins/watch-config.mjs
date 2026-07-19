import { existsSync, readdirSync, watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

// Rollup's own --watch mode reloads when rollup.config.mjs changes, but it
// never notices edits to the files that config imports (plugins/**), nor
// .env* files, which are consumed by env-cmd before rollup even starts. This
// supervises the whole `env-cmd ... rollup -c --watch` process and restarts
// it from scratch whenever any of those actually move.

const rootDir = process.cwd();
const sepIndex = process.argv.indexOf('--');
const command = process.argv.slice(sepIndex + 1);

if (sepIndex === -1 || command.length === 0) {
  console.error('Usage: watch-config.mjs -- <command> [args...]');
  process.exit(1);
}

let child;
let restarting = false;
let debounceTimer;

function start() {
  child = spawn(command[0], command.slice(1), {
    stdio: 'inherit',
    detached: process.platform !== 'win32',
  });
  child.on('exit', code => {
    if (!restarting) {
      process.exit(code ?? 0);
    }
  });
}

function killChild(signal) {
  if (!child) {
    return;
  }
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f']);
    return;
  }
  try {
    process.kill(-child.pid, signal);
  } catch {
    // Already exited.
  }
}

function scheduleRestart(label) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => restart(label), 150);
}

function restart(label) {
  if (!child || restarting) {
    return;
  }
  restarting = true;
  console.log(`\n[watch-config] ${label} changed - restarting dev server...\n`);
  child.once('exit', () => {
    restarting = false;
    start();
  });
  killChild('SIGTERM');
}

function stop(signal) {
  killChild(signal);
  process.exit(0);
}

process.once('SIGINT', () => stop('SIGINT'));
process.once('SIGTERM', () => stop('SIGTERM'));

function watchPath(target, recursive) {
  if (!existsSync(target)) {
    return;
  }
  watch(target, { recursive }, (_event, filename) => {
    const changed = filename ? path.join(target, filename) : target;
    scheduleRestart(path.relative(rootDir, changed));
  });
}

watchPath(path.resolve(rootDir, 'rollup.config.mjs'), false);
watchPath(path.resolve(rootDir, 'package.json'), false);
watchPath(path.resolve(rootDir, 'plugins'), true);

for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.startsWith('.env')) {
    watchPath(path.resolve(rootDir, entry.name), false);
  }
}

start();
