const { defineConfig } = require('rollup');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');

module.exports = config => {
  const conf = defineConfig({
    ...config,
    plugins: [
      ...config.plugins,
      serve({
        open: true,
        contentBase: ['dist/app/iife'],
        host: 'localhost',
        port: '3030',
        historyApiFallback: true,
        verbose: false,
      }),
      livereload({
        watch: 'dist/app/iife',
        verbose: false,
      }),
    ],
  });
  return conf;
};
