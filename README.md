# Pink Sensation

[![Verify and deploy Pages](https://github.com/TheAnonymous/PinkSensation/actions/workflows/pages.yml/badge.svg)](https://github.com/TheAnonymous/PinkSensation/actions/workflows/pages.yml)

A glossy, accessible Web Components toolkit with an 80s mall-pop point of view. Explore the live showroom at **<https://theanonymous.github.io/PinkSensation/>**.

Pink Sensation v0.1.0 ships 39 framework-neutral custom elements, open Shadow DOM, typed ESM entry points, native form participation, documented slots and parts, and three inheritable themes: Bubblegum, Midnight, and Pastel.

## Quick start

```sh
npm install pink-sensation
```

```ts
import 'pink-sensation';
import 'pink-sensation/theme.css';
```

```html
<main data-ps-theme="bubblegum">
  <ps-button size="lg">Start dancing</ps-button>
</main>
```

Individual elements self-register too:

```ts
import 'pink-sensation/components/button';
```

The theme self-hosts Shrikhand for its bubbly display hierarchy and Nunito Sans for readable body text and controls. Override `--ps-font-display` or `--ps-font-body` to supply your own type stack; no other font families ship in the package.

The package is npm-ready but v0.1.0 is intentionally not published to npm. Run `npm run pack:verify` to produce and consumer-test `artifacts/pink-sensation-0.1.0.tgz`.

## Catalog

- Actions: button, icon button, and button group
- Forms: field, input, textarea, select/option, checkbox, radio group/radio, switch, and range
- Display: avatar, badge, chip, card, divider, empty state, and table shell
- Feedback: alert, progress, spinner, toast stack, and toast
- Navigation: navbar, breadcrumbs, tabs/tab/panel, and pagination
- Disclosure and overlays: accordion/item, dialog, drawer, dropdown, menu/item, and tooltip

## Development

Node 24 LTS and npm 11 are pinned in the repository.

```sh
npm ci
npx playwright install chromium firefox webkit
npm run verify
npm run pack:verify
```

`npm run verify` checks formatting, ESLint, strict TypeScript, both production builds, the custom-elements manifest, browser component tests, axe scans, smoke tests in Chromium/Firefox/WebKit, responsive behavior, reduced motion, and visual baselines.

## Browser support

The latest two stable releases of Chrome/Edge, Firefox, and Safari. No legacy polyfills are included.

## License

MIT © 2026 TheAnonymous
