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

Form controls use `ElementInternals`, so `name`, `value`, `disabled`, `required`, form reset, validation, and form submission behave like native controls. Sizes are `sm`, `md`, and `lg`; unknown sizes fall back to `md`.

See the full component catalog and interactive examples at <https://theanonymous.github.io/PinkSensation/>.

MIT © 2026 TheAnonymous
