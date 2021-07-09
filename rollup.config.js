import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';
import json from '@rollup/plugin-json';

const isDevelopment = process.env.MODE.trim() === 'development';
const startServer = process.env.SERVE.trim() === 'true';
const input = process.env.INPUT.trim();

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
  output: (startServer ? ['iife'] : ['esm', 'umd']).map((format) => {
    return {
      name: pkg.name,
      sourcemap: isDevelopment,
      file: isDevelopment ? pathMap[`${format}Dev`] : pathMap[format],
      format,
      globals: { rxjs },
    };
  }),
  external: startServer ? [] : [...Object.keys(pkg.peerDependencies)],
  plugins: [
    ...(isDevelopment && startServer
      ? [
          eslint({
            exclude: [
              'node_modules/**',
              'json/**',
              'package.json',
              'package-lock.json',
            ],
            throwOnError: true,
          }),
        ]
      : []),
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
            serve({
              open: true,
              contentBase: ['dist'],
              host: 'localhost',
              port: '3030',
              historyApiFallback: true,
            }),
            livereload({
              watch: 'dist',
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
