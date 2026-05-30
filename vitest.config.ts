import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
      include: [
        'src/**/*.{ts,tsx}',
        '!src/main.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/types/**',
        '!src/test-utils/**',
      ],
    },
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
