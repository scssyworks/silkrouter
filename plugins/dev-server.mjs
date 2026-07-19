import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

function getMimeType(filePath) {
  if (filePath.endsWith('.html')) {
    return 'text/html; charset=utf-8';
  }
  if (filePath.endsWith('.js')) {
    return 'application/javascript; charset=utf-8';
  }
  if (filePath.endsWith('.css')) {
    return 'text/css; charset=utf-8';
  }
  if (filePath.endsWith('.json')) {
    return 'application/json; charset=utf-8';
  }
  if (filePath.endsWith('.svg')) {
    return 'image/svg+xml';
  }
  if (filePath.endsWith('.png')) {
    return 'image/png';
  }
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  return 'application/octet-stream';
}

const GLOBAL_KEY = '__silkrouterMemoryServe__';

export function memoryServe({ host = 'localhost', port = 3030 } = {}) {
  let server;
  let bundleCode = '';
  let bundlePath = '/render/silkrouter.iife.js';
  const rootDir = process.cwd();
  const publicDir = path.resolve(rootDir, 'public');
  const displayHost = host === 'localhost' ? '127.0.0.1' : host;
  const files = new Map();
  const clients = new Set();

  const injectReloadScript = body => {
    if (body.includes('__SILKROUTER_LIVERELOAD__')) {
      return body;
    }
    const script = `
      <script id="__SILKROUTER_LIVERELOAD__">
        (() => {
          const source = new EventSource('/__livereload');
          source.onmessage = () => window.location.reload();
          source.onerror = () => {
            try { source.close(); } catch (error) {}
          };
        })();
      </script>`;
    return body.replace(/<\/body>/i, `${script}</body>`);
  };

  const broadcastReload = () => {
    for (const client of clients) {
      try {
        client.write('event: reload\ndata: update\n\n');
      } catch {
        clients.delete(client);
      }
    }
  };

  const walkPublicFiles = (currentDir, pluginContext) => {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walkPublicFiles(entryPath, pluginContext);
      } else if (entry.isFile()) {
        const relativePath = path
          .relative(publicDir, entryPath)
          .split(path.sep)
          .join('/');
        files.set(`/${relativePath}`, readFileSync(entryPath));
        pluginContext?.addWatchFile?.(entryPath);
      }
    }
  };

  const resolvePublicFile = requestPath => {
    const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
    const withoutLeadingSlash = normalizedPath.replace(/^\/+/, '');
    const candidatePaths = [];

    if (!withoutLeadingSlash) {
      candidatePaths.push('index.html');
    } else {
      candidatePaths.push(withoutLeadingSlash);
      if (!withoutLeadingSlash.includes('.')) {
        candidatePaths.push(`${withoutLeadingSlash}/index.html`);
        candidatePaths.push(`${withoutLeadingSlash}.html`);
      }
      if (withoutLeadingSlash.endsWith('/')) {
        candidatePaths.push(`${withoutLeadingSlash}index.html`);
      }
    }

    for (const candidate of candidatePaths) {
      const fullPath = path.resolve(publicDir, candidate);
      if (existsSync(fullPath) && statSync(fullPath).isFile()) {
        return fullPath;
      }
    }

    return null;
  };

  const isNavigationRequest = requestPath => {
    const lastSegment = requestPath.split('/').pop();
    return !lastSegment.includes('.');
  };

  const startServer = () => {
    if (server?.listening) {
      return;
    }

    const requestHandler = (req, res) => {
      const requestUrl = new URL(req.url || '/', `http://${host}:${port}`);
      const requestPath = decodeURIComponent(requestUrl.pathname);

      if (requestPath === '/__livereload') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });
        res.write(': connected\n\n');
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
      }

      if (requestPath === bundlePath) {
        res.writeHead(200, {
          'Content-Type': 'application/javascript; charset=utf-8',
        });
        res.end(bundleCode);
        return;
      }

      const filePath = resolvePublicFile(requestPath);
      if (filePath) {
        const body = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        const payload = getMimeType(filePath).startsWith('text/html')
          ? injectReloadScript(body.toString())
          : body;
        res.end(payload);
        return;
      }

      const cachedFile = files.get(requestPath);
      if (cachedFile) {
        res.writeHead(200, { 'Content-Type': getMimeType(requestPath) });
        res.end(cachedFile);
        return;
      }

      if (isNavigationRequest(requestPath)) {
        const fallbackPath = path.resolve(publicDir, 'index.html');
        if (existsSync(fallbackPath) && statSync(fallbackPath).isFile()) {
          const body = readFileSync(fallbackPath);
          res.writeHead(200, { 'Content-Type': getMimeType(fallbackPath) });
          res.end(injectReloadScript(body.toString()));
          return;
        }
      }

      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    };

    const launch = () => {
      server = createServer(requestHandler);
      server.on('error', error => {
        console.error(`Dev server failed to start: ${error.message}`);
      });
      server.listen(port, displayHost, () => {
        globalThis[GLOBAL_KEY].server = server;
        console.log(`Dev server running at http://${displayHost}:${port}`);
      });
    };

    // Rollup reloads a changed config file in the same process, re-running
    // this factory without tearing down the previous server. Close whatever
    // instance a prior config load left listening before binding again.
    const previous = globalThis[GLOBAL_KEY].server;
    if (previous?.listening) {
      previous.close(launch);
    } else {
      launch();
    }
  };

  globalThis[GLOBAL_KEY] ??= {};

  const shutdown = () => {
    if (globalThis[GLOBAL_KEY].server?.listening) {
      globalThis[GLOBAL_KEY].server.close();
    }
    process.exit(0);
  };

  if (!globalThis[GLOBAL_KEY].handlersInstalled) {
    globalThis[GLOBAL_KEY].handlersInstalled = true;
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  }

  startServer();

  return {
    name: 'memory-serve',
    buildStart() {
      files.clear();
      if (existsSync(publicDir)) {
        walkPublicFiles(publicDir, this);
      }
      startServer();
    },
    generateBundle(outputOptions, bundle) {
      const chunks = Object.values(bundle).filter(
        item => item.type === 'chunk',
      );
      if (chunks.length) {
        bundleCode = chunks.map(chunk => chunk.code).join('\n');
      }
      const outputFile = outputOptions.file || outputOptions.dir;
      if (outputFile) {
        bundlePath = `/${path
          .relative(path.resolve(rootDir, 'dist'), path.resolve(outputFile))
          .split(path.sep)
          .join('/')}`;
      }
    },
    writeBundle(outputOptions) {
      const outputFile = outputOptions.file;
      if (outputFile) {
        rmSync(path.resolve(rootDir, outputFile), { force: true });
        rmSync(`${path.resolve(rootDir, outputFile)}.map`, { force: true });
      }
      if (outputOptions.dir) {
        rmSync(path.resolve(rootDir, outputOptions.dir), { force: true });
      }
      // Bundle code and the public file cache are both fresh by now, for
      // every rebuild regardless of what triggered it - safe to always tell
      // open tabs to reload.
      broadcastReload();
    },
    watchChange(id) {
      if (id.endsWith('.html')) {
        files.clear();
        if (existsSync(publicDir)) {
          walkPublicFiles(publicDir, this);
        }
      }
    },
    closeBundle() {
      // Keep the preview server alive for the full watch session.
    },
  };
}
