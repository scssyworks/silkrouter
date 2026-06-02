import { defineConfig, Plugin } from 'vite';
import path from 'path';

function netifyRedirects(): Plugin {
  return {
    name: 'netify-redirects',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: `/* /index.html 200`,
      });
    },
  };
}

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [netifyRedirects()],
});
