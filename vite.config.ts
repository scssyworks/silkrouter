import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        web: path.resolve(__dirname, 'src/web/main.ts'),
      },
      name: 'silkrouter',
      fileName: (format, entry) =>
        `${entry}/${format}/index.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
    minify: 'terser',
  },
  plugins: [
    dts({
      entryRoot: 'src',
      insertTypesEntry: false,
      bundleTypes: false,
    }),
  ],
});
