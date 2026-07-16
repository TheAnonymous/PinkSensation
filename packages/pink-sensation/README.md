# Pink Sensation

Glossy, accessible Web Components with a bubblegum 80s mall-pop point of view.

```sh
npm install pink-sensation
```

Register the full toolkit and load its inheritable tokens:

```js
import 'pink-sensation';
import 'pink-sensation/theme.css';
```

Or register one component:

```js
import 'pink-sensation/components/button';
```

```html
<main data-ps-theme="midnight">
  <ps-button variant="primary">Start dancing</ps-button>
</main>
```

The default theme is `bubblegum`. Set `data-ps-theme` on any ancestor to `bubblegum`, `midnight`, or `pastel`. All components use open Shadow DOM, expose the documented `::part()` hooks, and inherit public `--ps-*` custom properties.

Shrikhand is self-hosted as the default for `--ps-font-display`; Nunito Sans remains the self-hosted `--ps-font-body` default for body copy and controls. Override either public token to use a custom type stack. No other font families ship in the package.

Use `--ps-color-primary`, `--ps-color-secondary`, and `--ps-color-accent` for vivid fills and decoration. Their `*-text` partners are contrast-safe foregrounds for text on the theme's background and surface colors; `--ps-color-primary-contrast` remains the foreground for primary-filled controls.

Interactive motion inherits `--ps-duration-fast`, `--ps-duration-normal`, `--ps-duration-slow`, `--ps-ease-snap`, and `--ps-ease-pop`. The duration tokens resolve to `0ms` under `prefers-reduced-motion`, so the same components keep their state clarity without the spring and travel.

The three themes share a bold chrome-and-neon surface language while keeping distinct identities: high-chroma Bubblegum, night-mode Midnight, and softer Pastel. Artwork shown in the online showroom is presentation-only and does not ship with this package.

Form controls use `ElementInternals`, so `name`, `value`, `disabled`, `required`, form reset, validation, and form submission behave like native controls. Sizes are `sm`, `md`, and `lg`; unknown sizes fall back to `md`.

See the full component catalog and interactive examples at <https://theanonymous.github.io/PinkSensation/>.

MIT © 2026 TheAnonymous
