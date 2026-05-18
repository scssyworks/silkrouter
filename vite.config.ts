import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      silkrouter: path.resolve(__dirname, 'src/main.ts'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'silkrouter',
      fileName: (format) =>
        `${format}/index.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    dts({
      bundleTypes: true,
      insertTypesEntry: true,
    }),
  ],
});
