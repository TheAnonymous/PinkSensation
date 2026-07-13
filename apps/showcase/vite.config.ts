import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/PinkSensation/',
  resolve: {
    alias: [
      {
        find: 'pink-sensation/theme.css',
        replacement: resolve(import.meta.dirname, '../../packages/pink-sensation/src/theme.css'),
      },
      {
        find: /^pink-sensation$/,
        replacement: resolve(import.meta.dirname, '../../packages/pink-sensation/src/index.ts'),
      },
    ],
  },
  build: { outDir: 'dist', sourcemap: true },
});
