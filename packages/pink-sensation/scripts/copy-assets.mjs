import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
await mkdir(resolve(root, 'dist/fonts'), { recursive: true });
await cp(resolve(root, 'src/theme.css'), resolve(root, 'dist/theme.css'));
await cp(resolve(root, 'src/theme.css.d.ts'), resolve(root, 'dist/theme.css.d.ts'));
await cp(resolve(root, 'src/fonts'), resolve(root, 'dist/fonts'), { recursive: true });
