import 'pink-sensation/theme.css';
import 'pink-sensation';
import type { PsDialog, PsDrawer, PsInput, PsToastStack, ThemeName } from 'pink-sensation';
import { catalog, categories, type DocRow } from './catalog.js';
import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Showcase root is missing.');

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const table = (label: string, rows: DocRow[]) => `
  <div class="api-table-wrap">
    <table class="api-table">
      <caption>${label}</caption>
      <thead><tr><th scope="col">Name</th><th scope="col">Contract</th></tr></thead>
      <tbody>${(rows.length ? rows : ([['—', 'None']] as const)).map(([name, detail]) => `<tr><td><code>${escapeHtml(name)}</code></td><td>${escapeHtml(detail)}</td></tr>`).join('')}</tbody>
    </table>
  </div>`;

const cards = catalog
  .map(
    (item) => `
      <article class="component-card" data-component-card data-search="${escapeHtml(`${item.tag} ${item.title} ${item.category} ${item.description}`.toLowerCase())}" data-category="${escapeHtml(item.category)}" id="${item.tag}">
        <div class="component-heading">
          <div><span class="eyebrow">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><code>&lt;${item.tag}&gt;</code></div>
          <a class="anchor" href="#${item.tag}" aria-label="Link to ${escapeHtml(item.title)}">#</a>
        </div>
        <p>${escapeHtml(item.description)}</p>
        <div class="demo" data-demo-for="${item.tag}">${item.demo}</div>
        <div class="example-bar"><span>HTML</span><button type="button" data-copy="${escapeHtml(item.example)}">Copy</button></div>
        <pre><code>${escapeHtml(item.example)}</code></pre>
        <details class="api-details"><summary>API details</summary><div class="api-grid">${table('Properties & methods', item.properties)}${table('Events', item.events)}${table('Slots', item.slots)}${table('Parts', item.parts)}</div></details>
      </article>`,
  )
  .join('');

app.innerHTML = `
  <header class="site-header" id="top">
    <a class="mini-logo" href="#top" aria-label="Pink Sensation home">PS<span>✦</span></a>
    <nav aria-label="Primary navigation">
      <a href="#catalog">Components</a><a href="#tokens">Tokens</a><a href="#accessibility">Accessibility</a>
    </nav>
    <label class="theme-control">Theme
      <select id="theme-switcher" aria-label="Color theme">
        <option value="bubblegum">Bubblegum</option><option value="midnight">Midnight</option><option value="pastel">Pastel</option>
      </select>
    </label>
    <button class="mobile-nav" type="button" aria-label="Toggle site navigation" aria-expanded="false">☰</button>
  </header>

  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="sparkle sparkle-one">✦</div><div class="sparkle sparkle-two">✧</div>
      <p class="kicker">Web Components · v0.1.0</p>
      <h1 id="hero-title"><span>Pink</span><span>Sensation</span></h1>
      <p class="hero-copy">Accessible components for interfaces that deserve more gloss, more joy, and a little more mall after dark.</p>
      <div class="hero-actions"><ps-button size="lg" data-scroll-catalog>See the collection <span slot="suffix">→</span></ps-button><ps-button size="lg" variant="outline" data-copy="npm install pink-sensation">npm install</ps-button></div>
      <div class="hero-stickers" aria-label="Toolkit qualities">
        <ps-card class="sticker sticker-one"><span slot="header">39 elements</span>Small enough to know. Complete enough to ship.</ps-card>
        <ps-card class="sticker sticker-two"><span slot="header">Zero framework lock-in</span>Standards, slots, parts, and ESM.</ps-card>
        <ps-card class="sticker sticker-three"><span slot="header">AA-minded</span>Keyboard complete and focus forward.</ps-card>
      </div>
    </section>

    <div class="marquee" aria-label="Pink Sensation features"><div>OPEN SHADOW DOM ✦ FORM ASSOCIATED ✦ THREE THEMES ✦ TYPESCRIPT ✦ COPY, PASTE, SPARKLE ✦ OPEN SHADOW DOM ✦ FORM ASSOCIATED ✦ THREE THEMES ✦ TYPESCRIPT ✦</div></div>

    <section class="quick-start section-shell" aria-labelledby="start-title">
      <div><span class="eyebrow">One tiny ritual</span><h2 id="start-title">Get glossy in two imports.</h2><p>Register everything or import only the self-registering component you need. Then put a theme on any ancestor.</p></div>
      <div class="code-window"><div class="window-bar"><i></i><i></i><i></i><span>main.ts</span></div><pre><code>import 'pink-sensation';
import 'pink-sensation/theme.css';

document.body.dataset.psTheme = 'bubblegum';</code></pre><button type="button" data-copy="import 'pink-sensation';\nimport 'pink-sensation/theme.css';">Copy imports</button></div>
    </section>

    <section id="catalog" class="catalog section-shell" aria-labelledby="catalog-title">
      <div class="section-heading"><div><span class="eyebrow">The whole collection</span><h2 id="catalog-title">Component showroom</h2><p>Search all ${catalog.length} custom elements. Every demo below is the real package.</p></div><div class="catalog-search"><ps-input id="catalog-search" type="search" placeholder="Search components" aria-label="Search components"><span slot="prefix">⌕</span></ps-input><span id="result-count" aria-live="polite">${catalog.length} components</span></div></div>
      <div class="category-filters" role="group" aria-label="Filter component category"><button type="button" class="active" data-category-filter="all">All</button>${categories.map((category) => `<button type="button" data-category-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('')}</div>
      <div class="component-grid">${cards}</div>
      <ps-empty-state id="no-results" hidden><span slot="illustration">⌕</span><span slot="heading">No sparkle found</span>Try another component name or category.</ps-empty-state>
    </section>

    <section id="tokens" class="tokens section-shell" aria-labelledby="tokens-title">
      <div class="section-heading"><div><span class="eyebrow">Safe knobs only</span><h2 id="tokens-title">Token playground</h2><p>Choose documented values; this playground never evaluates pasted markup or CSS.</p></div></div>
      <div class="token-layout">
        <form class="token-controls" id="token-form">
          <label>Primary color<select name="primary"><option value="#c41468">Hot pink</option><option value="#7a36c9">Electric violet</option><option value="#007c83">Pool teal</option></select></label>
          <label>Corner style<select name="radius"><option value="0.9rem">Soft</option><option value="0.5rem">Compact</option><option value="1.5rem">Bubble</option></select></label>
          <label>Chunky shadow<select name="shadow"><option value="0 6px 0 var(--ps-color-border)">Classic</option><option value="0 3px 0 var(--ps-color-border)">Subtle</option><option value="0 10px 0 var(--ps-color-border)">Extra</option></select></label>
          <ps-button type="button" variant="outline" id="reset-tokens">Reset tokens</ps-button>
        </form>
        <div class="token-preview" aria-label="Token preview">
          <ps-card><span slot="header">Friday night look</span><ps-avatar size="lg" alt="PS">PS</ps-avatar><h3>Chrome Hearts</h3><p>Roller-rink polish with a bubblegum beat.</p><ps-chip removable>Neon</ps-chip> <ps-badge variant="success">In stock</ps-badge><div slot="footer"><ps-button>Add to bag</ps-button></div></ps-card>
        </div>
      </div>
    </section>

    <section id="accessibility" class="accessibility section-shell" aria-labelledby="accessibility-title">
      <div><span class="eyebrow">Built into the choreography</span><h2 id="accessibility-title">Focus should feel as considered as color.</h2></div>
      <div class="principles"><article><b>01</b><h3>Keyboard complete</h3><p>Roving focus for tabs, menus, and radios. Escape, trapping, and restoration for overlays.</p></article><article><b>02</b><h3>Native where it counts</h3><p>ElementInternals for forms, native dialog and details semantics, and composed familiar events.</p></article><article><b>03</b><h3>Motion with consent</h3><p>Animations collapse or soften when the operating system asks for reduced motion.</p></article></div>
    </section>
  </main>

  <footer><a class="mini-logo" href="#top">PS<span>✦</span></a><p>Pink Sensation v0.1.0 · MIT © 2026 TheAnonymous</p><a href="https://github.com/TheAnonymous/PinkSensation">GitHub</a></footer>
  <ps-toast-stack id="global-toasts"></ps-toast-stack>
`;

const themes: ThemeName[] = ['bubblegum', 'midnight', 'pastel'];
const themeSwitcher = document.querySelector<HTMLSelectElement>('#theme-switcher');
const savedTheme = document.documentElement.dataset.psTheme as ThemeName;
if (themeSwitcher) themeSwitcher.value = themes.includes(savedTheme) ? savedTheme : 'bubblegum';
themeSwitcher?.addEventListener('change', () => {
  const theme = themes.includes(themeSwitcher.value as ThemeName)
    ? (themeSwitcher.value as ThemeName)
    : 'bubblegum';
  document.documentElement.dataset.psTheme = theme;
  try {
    localStorage.setItem('ps-theme', theme);
  } catch {
    /* Storage may be unavailable in privacy modes. */
  }
});

const toastStack = document.querySelector<PsToastStack>('#global-toasts');
document.addEventListener('click', async (event) => {
  const path = event.composedPath();
  const action = path.find(
    (node): node is HTMLElement =>
      node instanceof HTMLElement &&
      (node.dataset.copy !== undefined ||
        node.hasAttribute('data-scroll-catalog') ||
        node.hasAttribute('data-demo-toast') ||
        node.hasAttribute('data-open-dialog') ||
        node.hasAttribute('data-close-dialog') ||
        node.hasAttribute('data-open-drawer') ||
        node.hasAttribute('data-close-drawer')),
  );
  if (!action) return;
  if (action.dataset.copy !== undefined) {
    try {
      await navigator.clipboard.writeText(action.dataset.copy);
      toastStack?.push({
        title: 'Copied',
        message: 'Ready for your project.',
        variant: 'success',
        duration: 2200,
      });
    } catch {
      toastStack?.push({ message: 'Clipboard permission was unavailable.', variant: 'warning' });
    }
  }
  if (action.hasAttribute('data-scroll-catalog'))
    document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' });
  if (action.hasAttribute('data-demo-toast'))
    toastStack?.push({
      title: 'Totally saved',
      message: 'Your look is now extra glossy.',
      variant: 'success',
    });
  if (action.hasAttribute('data-open-dialog'))
    action.parentElement?.querySelector<PsDialog>('ps-dialog')?.showModal();
  if (action.hasAttribute('data-close-dialog'))
    action.closest<PsDialog>('ps-dialog')?.close('confirmed');
  if (action.hasAttribute('data-open-drawer'))
    action.parentElement?.querySelector<PsDrawer>('ps-drawer')?.show();
  if (action.hasAttribute('data-close-drawer')) action.closest<PsDrawer>('ps-drawer')?.hide();
});

let currentCategory = 'all';
let currentQuery = '';
const filterCatalog = () => {
  let visible = 0;
  document.querySelectorAll<HTMLElement>('[data-component-card]').forEach((card) => {
    const matchCategory = currentCategory === 'all' || card.dataset.category === currentCategory;
    const matchQuery = card.dataset.search?.includes(currentQuery) ?? false;
    card.hidden = !(matchCategory && matchQuery);
    if (!card.hidden) visible += 1;
  });
  const resultCount = document.querySelector('#result-count');
  if (resultCount) resultCount.textContent = `${visible} component${visible === 1 ? '' : 's'}`;
  const noResults = document.querySelector<HTMLElement>('#no-results');
  if (noResults) noResults.hidden = visible !== 0;
};

document.querySelector<PsInput>('#catalog-search')?.addEventListener('input', (event) => {
  currentQuery = (event.currentTarget as PsInput).value.trim().toLowerCase();
  filterCatalog();
});
document.querySelectorAll<HTMLButtonElement>('[data-category-filter]').forEach((button) =>
  button.addEventListener('click', () => {
    currentCategory = button.dataset.categoryFilter ?? 'all';
    document
      .querySelectorAll('[data-category-filter]')
      .forEach((item) => item.classList.toggle('active', item === button));
    filterCatalog();
  }),
);

const tokenForm = document.querySelector<HTMLFormElement>('#token-form');
const applyTokens = () => {
  if (!tokenForm) return;
  const values = new FormData(tokenForm);
  document.documentElement.style.setProperty('--ps-color-primary', String(values.get('primary')));
  document.documentElement.style.setProperty('--ps-radius-md', String(values.get('radius')));
  document.documentElement.style.setProperty('--ps-shadow-md', String(values.get('shadow')));
};
tokenForm?.addEventListener('change', applyTokens);
document.querySelector('#reset-tokens')?.addEventListener('click', () => {
  tokenForm?.reset();
  for (const token of ['--ps-color-primary', '--ps-radius-md', '--ps-shadow-md'])
    document.documentElement.style.removeProperty(token);
});

const mobileToggle = document.querySelector<HTMLButtonElement>('.mobile-nav');
mobileToggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  mobileToggle.setAttribute('aria-expanded', String(open));
});
