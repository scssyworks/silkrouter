import { gzipSizeSync } from 'gzip-size';
import fs from 'node:fs';
import path from 'node:path';

const fileContent = fs.readFileSync(
  path.resolve('./dist/esm/silkrouter.esm.js'),
  {
    encoding: 'utf-8',
  }
);

console.log(
  'GZIPPED ==>',
  `${(gzipSizeSync(fileContent) / 1024).toFixed(2)}kb`
);
