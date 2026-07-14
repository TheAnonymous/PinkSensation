import 'pink-sensation/theme.css';
import 'pink-sensation';
import type { PsDialog, PsDrawer, PsInput, PsToastStack, ThemeName } from 'pink-sensation';
import afterHoursMallAvif from './assets/after-hours-mall.avif';
import afterHoursMallWebp from './assets/after-hours-mall.webp';
import arcadeAfterDarkAvif from './assets/arcade-after-dark.avif';
import arcadeAfterDarkWebp from './assets/arcade-after-dark.webp';
import boomboxBeatAvif from './assets/boombox-beat.avif';
import boomboxBeatWebp from './assets/boombox-beat.webp';
import cassetteTowerAvif from './assets/cassette-tower.avif';
import cassetteTowerWebp from './assets/cassette-tower.webp';
import electricHeartAvif from './assets/electric-heart.avif';
import electricHeartWebp from './assets/electric-heart.webp';
import glamFlatlayAvif from './assets/glam-flatlay.avif';
import glamFlatlayWebp from './assets/glam-flatlay.webp';
import heartHandbagAvif from './assets/heart-handbag.avif';
import heartHandbagWebp from './assets/heart-handbag.webp';
import heartPerfumeAvif from './assets/heart-perfume.avif';
import heartPerfumeWebp from './assets/heart-perfume.webp';
import hotlinePhoneAvif from './assets/hotline-phone.avif';
import hotlinePhoneWebp from './assets/hotline-phone.webp';
import midnightDriveAvif from './assets/midnight-drive.avif';
import midnightDriveWebp from './assets/midnight-drive.webp';
import nailBarAvif from './assets/nail-bar.avif';
import nailBarWebp from './assets/nail-bar.webp';
import popIconAvif from './assets/pop-icon.avif';
import popIconWebp from './assets/pop-icon.webp';
import poolsideRadioAvif from './assets/poolside-radio.avif';
import poolsideRadioWebp from './assets/poolside-radio.webp';
import rollerGlamAvif from './assets/roller-glam.avif';
import rollerGlamWebp from './assets/roller-glam.webp';
import rollerRinkDreamAvif from './assets/roller-rink-dream.avif';
import rollerRinkDreamWebp from './assets/roller-rink-dream.webp';
import sodaShoppeAvif from './assets/soda-shoppe.avif';
import sodaShoppeWebp from './assets/soda-shoppe.webp';
import starVanityAvif from './assets/star-vanity.avif';
import starVanityWebp from './assets/star-vanity.webp';
import sunsetCruiseAvif from './assets/sunset-cruise.avif';
import sunsetCruiseWebp from './assets/sunset-cruise.webp';
import synthStationAvif from './assets/synth-station.avif';
import synthStationWebp from './assets/synth-station.webp';
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
    <span class="scroll-progress" aria-hidden="true"><i></i></span>
    <a class="mini-logo" href="#top" aria-label="Pink Sensation home">PS<span>✦</span></a>
    <nav aria-label="Primary navigation">
      <a href="#lookbook">Lookbook</a><a href="#campaigns">Scenes</a><a href="#catalog">Components</a><a href="#tokens">Tokens</a><a href="#accessibility">Accessibility</a>
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
      <div class="sparkle sparkle-one">✦</div><div class="sparkle sparkle-two">✧</div><div class="hero-squiggle" aria-hidden="true">⌁</div>
      <div class="hero-board">
        <div class="hero-brand-panel">
          <p class="kicker">Web Components · v0.1.0</p>
          <h1 id="hero-title"><span>Pink</span><span>Sensation</span></h1>
          <p class="hero-copy">Accessible components for interfaces that deserve more gloss, more joy, and a little more mall after dark.</p>
          <div class="hero-actions"><ps-button size="lg" data-scroll-catalog>See the collection <span slot="suffix">→</span></ps-button><ps-button size="lg" variant="outline" data-copy="npm install pink-sensation">npm install</ps-button></div>
          <div class="cover-strip" aria-label="Original Pink Sensation artwork">
            <picture><source type="image/avif" srcset="${electricHeartAvif}"><img src="${electricHeartWebp}" width="768" height="768" alt="" loading="lazy" decoding="async"></picture>
            <picture><source type="image/avif" srcset="${midnightDriveAvif}"><img src="${midnightDriveWebp}" width="768" height="768" alt="" loading="lazy" decoding="async"></picture>
            <p><strong>Original artwork</strong><span>Chrome, cassette tape, and midnight neon.</span></p>
          </div>
        </div>

        <section class="hero-dashboard-panel" aria-label="Toolkit highlights">
          <header class="dashboard-panel-header"><div><span class="status-dot"></span><strong>Toolkit status</strong></div><ps-badge variant="success">Ready to glow</ps-badge></header>
          <div class="hero-metrics">
            <ps-card class="metric-card"><span slot="header">Elements <span aria-hidden="true">✦</span></span><strong>39</strong><small>One complete collection</small></ps-card>
            <ps-card class="metric-card"><span slot="header">Themes <span aria-hidden="true">◉</span></span><strong>03</strong><small>One expressive system</small></ps-card>
            <ps-card class="metric-card"><span slot="header">Type safety <span aria-hidden="true">⌁</span></span><strong>100%</strong><small>Typed ESM and manifests</small></ps-card>
            <ps-card class="metric-card"><span slot="header">Focus <span aria-hidden="true">⚡</span></span><strong>AA</strong><small>Keyboard complete</small></ps-card>
          </div>
          <div class="hero-activity">
            <div class="activity-heading"><div><span class="eyebrow">Fresh from the mall</span><h2>Recently polished</h2></div><span>Live components</span></div>
            <article><picture><source type="image/avif" srcset="${electricHeartAvif}"><img src="${electricHeartWebp}" width="768" height="768" alt="" loading="lazy" decoding="async"></picture><div><strong>Glossy actions</strong><span>Buttons · icon buttons · groups</span></div><ps-badge>Hot</ps-badge></article>
            <article><picture><source type="image/avif" srcset="${midnightDriveAvif}"><img src="${midnightDriveWebp}" width="768" height="768" alt="" loading="lazy" decoding="async"></picture><div><strong>Midnight navigation</strong><span>Tabs · menus · breadcrumbs</span></div><ps-badge>New</ps-badge></article>
          </div>
        </section>

        <article class="now-playing">
          <div class="player-art"><picture><source type="image/avif" srcset="${popIconAvif}"><img src="${popIconWebp}" width="960" height="1200" alt="" fetchpriority="high" decoding="async"></picture><span class="player-kicker">Now playing</span><span class="player-menu" aria-hidden="true">⋮</span></div>
          <div class="player-copy"><span>Neon Dreams</span><strong>Jessie Stardust</strong></div>
          <ps-progress value="68" aria-label="Showcase progress"></ps-progress>
          <div class="player-time"><span>2:41</span><span>3:52</span></div>
          <div class="player-controls" aria-hidden="true"><span>↝</span><span>◀</span><b>▶</b><span>▶</span><span>♡</span></div>
        </article>
      </div>
    </section>

    <div class="marquee" aria-label="Pink Sensation features"><div>OPEN SHADOW DOM ✦ FORM ASSOCIATED ✦ THREE THEMES ✦ TYPESCRIPT ✦ COPY, PASTE, SPARKLE ✦ OPEN SHADOW DOM ✦ FORM ASSOCIATED ✦ THREE THEMES ✦ TYPESCRIPT ✦</div></div>

    <section id="lookbook" class="lookbook section-shell" aria-labelledby="lookbook-title" data-artwork-gallery>
      <div class="magazine-label" aria-hidden="true"><span>Issue 01 · The Lookbook</span><i>✦</i></div>
      <div class="lookbook-heading">
        <div><span class="eyebrow">The visual mixtape</span><h2 id="lookbook-title">Mall lights. Big nights.</h2></div>
        <p>Original artwork built for the world around the components: chrome, beauty counters, roller-rink drama, and one perfect drive into sunset.</p>
      </div>
      <div class="lookbook-grid">
        <figure class="lookbook-card lookbook-mall">
          <picture><source type="image/avif" srcset="${afterHoursMallAvif}"><img src="${afterHoursMallWebp}" width="1200" height="800" alt="Pink-lit mall atrium with chrome escalators and palm trees." loading="lazy" decoding="async"></picture>
          <figcaption><span>01 · After hours</span><strong>Mall lights forever</strong></figcaption>
        </figure>
        <figure class="lookbook-card lookbook-perfume">
          <picture><source type="image/avif" srcset="${heartPerfumeAvif}"><img src="${heartPerfumeWebp}" width="720" height="1080" alt="Heart-shaped pink perfume bottle with a chrome star cap." loading="lazy" decoding="async"></picture>
          <figcaption><span>02 · Beauty counter</span><strong>Heart notes</strong></figcaption>
        </figure>
        <figure class="lookbook-card lookbook-roller">
          <picture><source type="image/avif" srcset="${rollerGlamAvif}"><img src="${rollerGlamWebp}" width="720" height="720" alt="Hot-pink chrome roller skate on a cosmic checkerboard plinth." loading="lazy" decoding="async"></picture>
          <figcaption><span>03 · Friday night</span><strong>Starstruck</strong></figcaption>
        </figure>
        <figure class="lookbook-card lookbook-flatlay">
          <picture><source type="image/avif" srcset="${glamFlatlayAvif}"><img src="${glamFlatlayWebp}" width="720" height="720" alt="Pink sunglasses, makeup, pearls, and a cassette arranged on a vanity." loading="lazy" decoding="async"></picture>
          <figcaption><span>04 · Get ready</span><strong>Vanity mix</strong></figcaption>
        </figure>
        <figure class="lookbook-card lookbook-boombox">
          <picture><source type="image/avif" srcset="${boomboxBeatAvif}"><img src="${boomboxBeatWebp}" width="960" height="640" alt="Chrome-and-pink boombox glowing against a violet starburst." loading="lazy" decoding="async"></picture>
          <figcaption><span>05 · Turn it up</span><strong>Big beat energy</strong></figcaption>
        </figure>
        <figure class="lookbook-card lookbook-cruise">
          <picture><source type="image/avif" srcset="${sunsetCruiseAvif}"><img src="${sunsetCruiseWebp}" width="1200" height="800" alt="View from a pink convertible on a palm-lined road at neon sunset." loading="lazy" decoding="async"></picture>
          <figcaption><span>06 · One more song</span><strong>Sunset cruise</strong></figcaption>
        </figure>
      </div>
    </section>

    <div class="editorial-expansion" data-expanded-artwork>
      <section id="campaigns" class="campaigns section-shell" aria-labelledby="campaigns-title">
        <div class="magazine-label" aria-hidden="true"><span>Issue 02 · Campaign Worlds</span><i>✧</i></div>
        <div class="campaigns-heading">
          <div><span class="eyebrow">Four places to be</span><h2 id="campaigns-title">Meet me after dark.</h2></div>
          <p>Big, cinematic worlds give the toolkit a life beyond the component canvas—from the first arcade token to the last spin under the mirror ball.</p>
        </div>
        <div class="campaign-grid">
          <figure class="campaign-card campaign-arcade">
            <picture><source type="image/avif" srcset="${arcadeAfterDarkAvif}"><img src="${arcadeAfterDarkWebp}" width="1200" height="800" alt="Empty neon arcade with checkerboard floors and glowing game cabinets." loading="lazy" decoding="async"></picture>
            <figcaption><span>8:08 PM · High score energy</span><strong>Arcade after dark</strong></figcaption>
          </figure>
          <figure class="campaign-card campaign-rink">
            <picture><source type="image/avif" srcset="${rollerRinkDreamAvif}"><img src="${rollerRinkDreamWebp}" width="1200" height="800" alt="Pink roller rink glowing beneath a giant mirror ball." loading="lazy" decoding="async"></picture>
            <figcaption><span>9:22 PM · One more lap</span><strong>Rink royalty</strong></figcaption>
          </figure>
          <figure class="campaign-card campaign-pool">
            <picture><source type="image/avif" srcset="${poolsideRadioAvif}"><img src="${poolsideRadioWebp}" width="960" height="640" alt="Translucent pink radio and striped sunglasses beside a swimming pool." loading="lazy" decoding="async"></picture>
            <figcaption><span>4:45 PM · Before the party</span><strong>Poolside frequency</strong></figcaption>
          </figure>
          <figure class="campaign-card campaign-soda">
            <picture><source type="image/avif" srcset="${sodaShoppeAvif}"><img src="${sodaShoppeWebp}" width="960" height="640" alt="Strawberry milkshake and chrome accessories on a pink diner counter." loading="lazy" decoding="async"></picture>
            <figcaption><span>11:57 PM · Cherry on top</span><strong>Sweetest stop</strong></figcaption>
          </figure>
        </div>
      </section>

      <section class="glam-kit section-shell" aria-labelledby="glam-kit-title">
        <div class="magazine-label" aria-hidden="true"><span>Issue 03 · The Glam Kit</span><i>✦</i></div>
        <div class="glam-kit-heading">
          <div><span class="eyebrow">The prop closet</span><h2 id="glam-kit-title">Pack the glam kit.</h2></div>
          <p>Six glossy scene-stealers turn controls, cards, and product surfaces into a complete little pop universe.</p>
        </div>
        <div class="glam-kit-grid">
          <figure class="glam-card glam-bag">
            <picture><source type="image/avif" srcset="${heartHandbagAvif}"><img src="${heartHandbagWebp}" width="720" height="1080" alt="Hot-pink heart-shaped handbag with a chunky chrome chain." loading="lazy" decoding="async"></picture>
            <figcaption><span>Carry the feeling</span><strong>Heart to go</strong></figcaption>
          </figure>
          <figure class="glam-card glam-phone">
            <picture><source type="image/avif" srcset="${hotlinePhoneAvif}"><img src="${hotlinePhoneWebp}" width="720" height="720" alt="Translucent pink telephone with chrome buttons and acrylic stars." loading="lazy" decoding="async"></picture>
            <figcaption><span>Call me anytime</span><strong>Hotline pink</strong></figcaption>
          </figure>
          <figure class="glam-card glam-cassettes">
            <picture><source type="image/avif" srcset="${cassetteTowerAvif}"><img src="${cassetteTowerWebp}" width="720" height="720" alt="Tower of translucent pink, violet, and cyan cassette tapes." loading="lazy" decoding="async"></picture>
            <figcaption><span>Rewind the night</span><strong>Mixtape stack</strong></figcaption>
          </figure>
          <figure class="glam-card glam-synth">
            <picture><source type="image/avif" srcset="${synthStationAvif}"><img src="${synthStationWebp}" width="960" height="640" alt="Pink-and-chrome synthesizer with geometric controls and headphones." loading="lazy" decoding="async"></picture>
            <figcaption><span>Make it electric</span><strong>Synth sensation</strong></figcaption>
          </figure>
          <figure class="glam-card glam-vanity">
            <picture><source type="image/avif" srcset="${starVanityAvif}"><img src="${starVanityWebp}" width="720" height="1080" alt="Star-shaped illuminated vanity mirror with pearls and beauty accessories." loading="lazy" decoding="async"></picture>
            <figcaption><span>Ready in five</span><strong>Star treatment</strong></figcaption>
          </figure>
          <figure class="glam-card glam-nails">
            <picture><source type="image/avif" srcset="${nailBarAvif}"><img src="${nailBarWebp}" width="960" height="640" alt="Pink, coral, lilac, violet, and cyan nail polish on a glossy vanity." loading="lazy" decoding="async"></picture>
            <figcaption><span>Pick your power color</span><strong>Polish party</strong></figcaption>
          </figure>
        </div>
      </section>
    </div>

    <section class="quick-start section-shell" aria-labelledby="start-title">
      <div class="quick-start-copy"><span class="eyebrow">One tiny ritual</span><h2 id="start-title">Get glossy in two imports.</h2><p>Register everything or import only the self-registering component you need. Then put a theme on any ancestor.</p><figure class="quick-start-artwork"><picture><source type="image/avif" srcset="${synthStationAvif}"><img src="${synthStationWebp}" width="960" height="640" alt="" loading="lazy" decoding="async"></picture><figcaption><span>Side A · Quick start</span><strong>Plug in the pink.</strong></figcaption></figure></div>
      <div class="code-window"><div class="window-bar"><i></i><i></i><i></i><span>main.ts</span></div><pre><code>import 'pink-sensation';
import 'pink-sensation/theme.css';

document.body.dataset.psTheme = 'bubblegum';</code></pre><button type="button" data-copy="import 'pink-sensation';\nimport 'pink-sensation/theme.css';">Copy imports</button></div>
    </section>

    <section id="catalog" class="catalog section-shell" aria-labelledby="catalog-title">
      <div class="section-heading"><div><span class="eyebrow">The whole collection</span><h2 id="catalog-title">Component showroom</h2><p>Search all ${catalog.length} custom elements. Every demo below is the real package.</p></div><div class="catalog-search"><ps-input id="catalog-search" type="search" placeholder="Search components" aria-label="Search components"><span slot="prefix">⌕</span></ps-input><span id="result-count" aria-live="polite">${catalog.length} components</span></div></div>
      <div class="category-filters" role="group" aria-label="Filter component category"><button type="button" class="active" data-category-filter="all" aria-pressed="true">All</button>${categories.map((category) => `<button type="button" data-category-filter="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)}</button>`).join('')}</div>
      <div class="component-grid">${cards}</div>
      <ps-empty-state id="no-results" hidden><span slot="illustration">⌕</span><span slot="heading">No sparkle found</span>Try another component name or category.</ps-empty-state>
    </section>

    <section id="tokens" class="tokens section-shell" aria-labelledby="tokens-title">
      <div class="section-heading"><div><span class="eyebrow">Safe knobs only</span><h2 id="tokens-title">Token playground</h2><p>Choose documented values; this playground never evaluates pasted markup or CSS.</p></div></div>
      <div class="token-layout">
        <form class="token-controls" id="token-form">
          <label>Primary color<select name="primary"><option value="#f20a86">Hot pink</option><option value="#7929d6">Electric violet</option><option value="#007d89">Pool teal</option></select></label>
          <label>Corner style<select name="radius"><option value="0.9rem">Soft</option><option value="0.5rem">Compact</option><option value="1.5rem">Bubble</option></select></label>
          <label>Chunky shadow<select name="shadow"><option value="0 6px 0 var(--ps-color-border)">Classic</option><option value="0 3px 0 var(--ps-color-border)">Subtle</option><option value="0 10px 0 var(--ps-color-border)">Extra</option></select></label>
          <ps-button type="button" variant="outline" id="reset-tokens">Reset tokens</ps-button>
        </form>
        <div class="token-preview" aria-label="Token preview">
          <ps-card><span slot="header" class="token-card-header"><picture><source type="image/avif" srcset="${heartHandbagAvif}"><img src="${heartHandbagWebp}" width="720" height="1080" alt="" loading="lazy" decoding="async"></picture><span><small>Fashion card · 1988</small>Friday night look</span></span><ps-avatar size="lg" alt="PS">PS</ps-avatar><h3>Chrome Hearts</h3><p>Roller-rink polish with a bubblegum beat.</p><ps-chip removable>Neon</ps-chip> <ps-badge variant="success">In stock</ps-badge><div slot="footer"><ps-button>Add to bag</ps-button></div></ps-card>
        </div>
      </div>
    </section>

    <section id="accessibility" class="accessibility section-shell" aria-labelledby="accessibility-title">
      <div class="accessibility-heading"><span class="eyebrow">Built into the choreography</span><h2 id="accessibility-title">Focus should feel as considered as color.</h2><picture class="accessibility-artwork"><source type="image/avif" srcset="${heartPerfumeAvif}"><img src="${heartPerfumeWebp}" width="720" height="1080" alt="" loading="lazy" decoding="async"></picture></div>
      <div class="principles"><article><b>01</b><h3>Keyboard complete</h3><p>Roving focus for tabs, menus, and radios. Escape, trapping, and restoration for overlays.</p></article><article><b>02</b><h3>Native where it counts</h3><p>ElementInternals for forms, native dialog and details semantics, and composed familiar events.</p></article><article><b>03</b><h3>Motion with consent</h3><p>Animations collapse or soften when the operating system asks for reduced motion.</p></article></div>
    </section>
  </main>

  <footer><picture class="footer-artwork" aria-hidden="true"><source type="image/avif" srcset="${cassetteTowerAvif}"><img src="${cassetteTowerWebp}" width="720" height="720" alt="" loading="lazy" decoding="async"></picture><a class="mini-logo" href="#top">PS<span>✦</span></a><p><strong>Keep the mixtape playing.</strong><span>Pink Sensation v0.1.0 · MIT © 2026 TheAnonymous</span></p><a href="https://github.com/TheAnonymous/PinkSensation">GitHub <span aria-hidden="true">↗</span></a></footer>
  <ps-toast-stack id="global-toasts"></ps-toast-stack>
`;

const themes: ThemeName[] = ['bubblegum', 'midnight', 'pastel'];
const themeSwitcher = document.querySelector<HTMLSelectElement>('#theme-switcher');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let themeTransitionTimer = 0;
const savedTheme = document.documentElement.dataset.psTheme as ThemeName;
if (themeSwitcher) themeSwitcher.value = themes.includes(savedTheme) ? savedTheme : 'bubblegum';
themeSwitcher?.addEventListener('change', () => {
  const theme = themes.includes(themeSwitcher.value as ThemeName)
    ? (themeSwitcher.value as ThemeName)
    : 'bubblegum';
  if (!motionQuery.matches) {
    document.documentElement.classList.add('theme-transitioning');
    window.clearTimeout(themeTransitionTimer);
    themeTransitionTimer = window.setTimeout(
      () => document.documentElement.classList.remove('theme-transitioning'),
      420,
    );
  }
  document.documentElement.dataset.psTheme = theme;
  try {
    localStorage.setItem('ps-theme', theme);
  } catch {
    /* Storage may be unavailable in privacy modes. */
  }
});

const toastStack = document.querySelector<PsToastStack>('#global-toasts');
const copyFeedbackTimers = new WeakMap<HTMLElement, number>();
document.querySelectorAll<HTMLElement>('[data-copy]').forEach((button) => {
  button.dataset.copyLabel = button.textContent?.trim() ?? 'Copy';
  button.setAttribute('aria-live', 'polite');
});
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
      const previousTimer = copyFeedbackTimers.get(action);
      if (previousTimer) window.clearTimeout(previousTimer);
      action.textContent = 'Copied!';
      action.dataset.copyState = 'success';
      copyFeedbackTimers.set(
        action,
        window.setTimeout(() => {
          action.textContent = action.dataset.copyLabel ?? 'Copy';
          delete action.dataset.copyState;
          copyFeedbackTimers.delete(action);
        }, 1600),
      );
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
    document
      .querySelector('#catalog')
      ?.scrollIntoView({ behavior: motionQuery.matches ? 'auto' : 'smooth' });
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
    document.querySelectorAll<HTMLButtonElement>('[data-category-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
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
const primaryNavigation = document.querySelector<HTMLElement>('.site-header nav');
const mobileBreakpoint = window.matchMedia('(max-width: 54rem)');
const closeMobileNavigation = (restoreFocus = false) => {
  if (!document.body.classList.contains('nav-open')) return;
  document.body.classList.remove('nav-open');
  mobileToggle?.setAttribute('aria-expanded', 'false');
  if (restoreFocus) mobileToggle?.focus();
};
mobileToggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  mobileToggle.setAttribute('aria-expanded', String(open));
});
primaryNavigation?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) closeMobileNavigation();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
    event.preventDefault();
    closeMobileNavigation(true);
  }
});
mobileBreakpoint.addEventListener('change', (event) => {
  if (!event.matches) closeMobileNavigation();
});

const siteHeader = document.querySelector<HTMLElement>('.site-header');
const hero = document.querySelector<HTMLElement>('.hero');
const navigationLinks = [...document.querySelectorAll<HTMLAnchorElement>('.site-header nav a')];
const navigationSections = navigationLinks
  .map((link) => {
    const id = link.hash.slice(1);
    const section = document.getElementById(id);
    return section ? { link, section } : undefined;
  })
  .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } => Boolean(entry));
let viewportFrame = 0;
const syncViewportState = () => {
  viewportFrame = 0;
  if (!siteHeader) return;
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - document.documentElement.clientHeight,
  );
  siteHeader.style.setProperty(
    '--scroll-progress',
    `${Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100))}%`,
  );
  const compactAt = hero ? hero.offsetTop + hero.offsetHeight - siteHeader.offsetHeight : 120;
  siteHeader.classList.toggle('is-compact', window.scrollY >= compactAt);

  const checkpoint = window.scrollY + siteHeader.offsetHeight + window.innerHeight * 0.18;
  const current = [...navigationSections]
    .reverse()
    .find(({ section }) => section.offsetTop <= checkpoint);
  navigationLinks.forEach((link) => {
    if (link === current?.link) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};
const requestViewportSync = () => {
  if (viewportFrame) return;
  viewportFrame = window.requestAnimationFrame(syncViewportState);
};
window.addEventListener('scroll', requestViewportSync, { passive: true });
window.addEventListener('resize', requestViewportSync);

const revealElements = [
  ...document.querySelectorAll<HTMLElement>(
    '.lookbook-heading, .campaigns-heading, .glam-kit-heading, .quick-start > *, .catalog .section-heading, .category-filters, .component-card, .tokens .section-heading, .token-layout, .accessibility > *, .magazine-label',
  ),
];
revealElements.forEach((element, index) => {
  element.dataset.reveal = '';
  element.style.setProperty('--reveal-delay', `${(index % 6) * 65}ms`);
});
if (motionQuery.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-revealed'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}

const artworkCards = [
  ...document.querySelectorAll<HTMLElement>(
    '.lookbook-card, .campaign-card, .glam-card, .quick-start-artwork',
  ),
];
artworkCards.forEach((card) => {
  card.dataset.artworkCard = '';
  card.addEventListener('pointermove', (event) => {
    if (motionQuery.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--shine-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--shine-y', `${event.clientY - bounds.top}px`);
  });
});

document.querySelectorAll<HTMLPictureElement>('picture').forEach((picture) => {
  const image = picture.querySelector('img');
  if (!image) return;
  picture.dataset.imageState = 'loading';
  const markDecoded = async () => {
    try {
      await image.decode();
      picture.dataset.imageState = 'loaded';
    } catch {
      picture.dataset.imageState = image.complete && image.naturalWidth > 0 ? 'loaded' : 'error';
    }
  };
  if (image.complete) void markDecoded();
  else {
    image.addEventListener('load', () => void markDecoded(), { once: true });
    image.addEventListener('error', () => (picture.dataset.imageState = 'error'), { once: true });
  }
});

const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const syncMotionPreferences = () => {
  document.documentElement.classList.toggle('motion-ok', !motionQuery.matches);
  document.documentElement.classList.toggle(
    'pointer-glow',
    !motionQuery.matches && finePointerQuery.matches,
  );
  if (motionQuery.matches) document.documentElement.classList.remove('theme-transitioning');
};
motionQuery.addEventListener('change', syncMotionPreferences);
finePointerQuery.addEventListener('change', syncMotionPreferences);
syncMotionPreferences();
syncViewportState();
document.documentElement.classList.add('showcase-ready');
