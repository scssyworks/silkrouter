import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export function copyPublic() {
  const isDevServe =
    process.env.MODE?.trim() === 'development' &&
    process.env.SERVE?.trim() === 'true';

  return {
    name: 'copy-public',
    buildStart() {
      if (isDevServe) {
        return;
      }
      copyPublicDir();
    },
    writeBundle() {
      if (isDevServe) {
        return;
      }
      copyPublicDir();
    },
  };
}

function copyPublicDir() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  if (!statSync(publicDir, { throwIfNoEntry: false })?.isDirectory?.()) {
    return;
  }

  mkdirSync(distDir, { recursive: true });

  const walk = currentDir => {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);
      const targetPath = path.join(
        distDir,
        path.relative(publicDir, entryPath),
      );

      if (entry.isDirectory()) {
        mkdirSync(targetPath, { recursive: true });
        walk(entryPath);
      } else if (entry.isFile()) {
        mkdirSync(path.dirname(targetPath), { recursive: true });
        copyFileSync(entryPath, targetPath);
      }
    }
  };

  walk(publicDir);
}
