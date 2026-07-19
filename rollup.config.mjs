import { readFileSync } from 'node:fs';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json' with { type: 'json' };
import { copyPublic } from './plugins/copy-public.mjs';
import { filesize } from './plugins/rollup-size-plugin.mjs';
import { memoryServe } from './plugins/dev-server.mjs';

const isDevelopment = process.env.MODE.trim() === 'development';
const startServer = process.env.SERVE.trim() === 'true';
const input = process.env.INPUT.trim();

// Keep the watcher's exclusions in sync with .gitignore instead of a
// hardcoded list - anything untracked/build-output should never retrigger.
const watchExclude = readFileSync(
  new URL('./.gitignore', import.meta.url),
  'utf8',
)
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'))
  .map(line => `**/${line.replace(/\/$/, '')}/**`);

const rxjs = 'rxjs';

const minExtReg = /\.min\.js$/;
const umdPathReg = /\/umd\//;

const pathMap = {
  umd: pkg.main,
  umdDev: pkg.main.replace(minExtReg, '.js'),
  esm: pkg.module,
  esmDev: pkg.module.replace(minExtReg, '.js'),
  iife: pkg.main
    .replace(umdPathReg, '/render/')
    .replace(minExtReg, '.iife.min.js'),
  iifeDev: pkg.main
    .replace(umdPathReg, '/render/')
    .replace(minExtReg, '.iife.js'),
};

const config = {
  input,
  output: (startServer ? ['iife'] : ['esm', 'umd']).map(format => {
    return {
      name: pkg.name,
      sourcemap: isDevelopment,
      file: isDevelopment ? pathMap[`${format}Dev`] : pathMap[format],
      format,
      globals: { rxjs },
    };
  }),
  external: startServer ? [] : [...Object.keys(pkg.peerDependencies)],
  watch: {
    exclude: watchExclude,
  },
  plugins: [
    copyPublic(),
    ...(isDevelopment && startServer ? [] : [filesize()]),
    resolve({
      customResolveOptions: {
        moduleDirectories: ['node_modules'],
      },
      preferBuiltins: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    ...(isDevelopment
      ? startServer
        ? [
            json({
              exclude: ['node_modules/**'],
              compact: true,
              preferConst: true,
            }),
            memoryServe({ host: 'localhost', port: 3030 }),
            livereload({
              watch: 'public',
              verbose: false,
            }),
          ]
        : []
      : [
          ...(startServer
            ? [
                json({
                  exclude: ['node_modules/**'],
                  compact: true,
                  preferConst: true,
                }),
              ]
            : []),
          terser({
            output: {
              comments: false,
            },
          }),
        ]),
  ],
};

export default [config];
