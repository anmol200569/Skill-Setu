import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@skill-setu/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
});
