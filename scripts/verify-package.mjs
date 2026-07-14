import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

function capture(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: root, ...options });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolvePromise(stdout);
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}\n${stderr}`));
    });
  });
}

await run('npm', ['run', 'build', '-w', 'pink-sensation']);
await run('npm', ['run', 'manifest', '-w', 'pink-sensation']);

const artifacts = resolve(root, 'artifacts');
await mkdir(artifacts, { recursive: true });
await rm(resolve(artifacts, 'pink-sensation-0.1.0.tgz'), { force: true });
const packedOutput = JSON.parse(
  await capture('npm', [
    'pack',
    './packages/pink-sensation',
    '--json',
    '--pack-destination',
    artifacts,
  ]),
);
const packed = Array.isArray(packedOutput) ? packedOutput : Object.values(packedOutput);
const pack = packed[0];
if (!pack) throw new Error('npm pack did not return package metadata.');

const fileNames = new Set(pack.files.map((file) => file.path));
const required = [
  'package.json',
  'README.md',
  'LICENSE',
  'custom-elements.json',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/theme.css',
  'dist/theme.css.d.ts',
  'dist/components/button.js',
  'dist/components/button.d.ts',
  'dist/fonts/OFL-Shrikhand.txt',
  'dist/fonts/OFL-Nunito-Sans.txt',
  'dist/fonts/shrikhand-latin-400-normal.woff2',
  'dist/fonts/nunito-sans-latin-wght-normal.woff2',
];
for (const file of required)
  if (!fileNames.has(file)) throw new Error(`Tarball is missing ${file}.`);
for (const file of fileNames) {
  if (file.startsWith('src/') || file.startsWith('test/')) {
    throw new Error(`Tarball unexpectedly contains ${file}.`);
  }
}

const expectedFonts = new Set([
  'dist/fonts/OFL-Shrikhand.txt',
  'dist/fonts/OFL-Nunito-Sans.txt',
  'dist/fonts/shrikhand-latin-400-normal.woff2',
  'dist/fonts/nunito-sans-latin-wght-normal.woff2',
]);
const packedFonts = [...fileNames].filter((file) => file.startsWith('dist/fonts/'));
for (const file of packedFonts) {
  if (!expectedFonts.has(file)) throw new Error(`Tarball unexpectedly contains font file ${file}.`);
}
for (const file of expectedFonts) {
  if (!fileNames.has(file)) throw new Error(`Tarball is missing font file ${file}.`);
}
if ([...fileNames].some((file) => file.toLowerCase().includes('righteous'))) {
  throw new Error('Tarball unexpectedly contains the retired Righteous font.');
}
const showroomArtwork = [
  'after-hours-mall',
  'arcade-after-dark',
  'boombox-beat',
  'cassette-tower',
  'electric-heart',
  'glam-flatlay',
  'heart-handbag',
  'heart-perfume',
  'hotline-phone',
  'midnight-drive',
  'nail-bar',
  'pop-icon',
  'poolside-radio',
  'roller-glam',
  'roller-rink-dream',
  'soda-shoppe',
  'star-vanity',
  'sunset-cruise',
  'synth-station',
];
if ([...fileNames].some((file) => showroomArtwork.some((name) => file.includes(name)))) {
  throw new Error('Tarball unexpectedly contains showroom-only artwork.');
}

const manifest = JSON.parse(
  await readFile(resolve(root, 'packages/pink-sensation/custom-elements.json'), 'utf8'),
);
const declarations = manifest.modules.flatMap((module) => module.declarations ?? []);
const customElements = declarations.filter((declaration) => declaration.customElement);
if (customElements.length !== 39) {
  throw new Error(`Expected 39 custom elements in the manifest, found ${customElements.length}.`);
}

const consumer = await mkdtemp(resolve(tmpdir(), 'pink-sensation-consumer-'));
try {
  await writeFile(
    resolve(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'pink-sensation-consumer',
        private: true,
        type: 'module',
        scripts: { build: 'tsc --noEmit && vite build' },
      },
      null,
      2,
    ),
  );
  await writeFile(
    resolve(consumer, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        lib: ['ES2022', 'DOM'],
      },
      include: ['src'],
    }),
  );
  await mkdir(resolve(consumer, 'src'));
  await writeFile(
    resolve(consumer, 'src/main.ts'),
    `import 'pink-sensation';
import 'pink-sensation/components/button';
import 'pink-sensation/theme.css';
import { PsButton, type ToastOptions } from 'pink-sensation';

const options: ToastOptions = { message: 'Ready', variant: 'success' };
const button = new PsButton();
button.textContent = options.message;
document.querySelector('#app')?.append(button);
`,
  );
  await writeFile(
    resolve(consumer, 'index.html'),
    '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>',
  );
  const tarball = resolve(artifacts, pack.filename);
  await run('npm', ['install', tarball, 'vite@8.1.4', 'typescript@6.0.3'], { cwd: consumer });
  await run('npm', ['run', 'build'], { cwd: consumer });
  console.log(`Verified ${basename(tarball)} (${pack.size} bytes, ${pack.files.length} files).`);
} finally {
  await rm(consumer, { recursive: true, force: true });
}
