import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  build: {
    lib: { entry: resolve(import.meta.dirname, 'src/index.ts'), formats: ['es'] },
    sourcemap: true,
    rollupOptions: {
      external: [/^lit(?:\/|$)/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
    include: ['test/**/*.test.ts'],
  },
});
