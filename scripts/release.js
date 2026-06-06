#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

const baseVersion = process.argv[2];

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const packageName = packageJson.name;

let versions = [];

try {
  versions = execSync(`npm view ${packageName} versions --json`, {
    encoding: 'utf-8',
  });
} catch {
  versions = [];
}

const rcVersions = versions
  .filter((v) => v.startsWith(`${baseVersion}-rc.`))
  .map((v) => Number(v.split('-rc.')[1]))
  .filter(Number.isFinite);

const nextRc = rcVersions.length > 0 ? Math.max(...rcVersions) + 1 : 1;

process.stdout.write(String(nextRc));
