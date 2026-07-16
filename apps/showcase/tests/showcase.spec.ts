import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

type Rgb = [number, number, number];

const parseCssColor = (value: string): Rgb => {
  const color = value.trim();
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const expanded = hex.length === 3 ? [...hex].map((part) => `${part}${part}`).join('') : hex;
    if (expanded.length === 6)
      return [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16)) as Rgb;
  }
  const channels = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  if (channels?.length === 3)
    return (
      color.startsWith('color(srgb') ? channels.map((channel) => channel * 255) : channels
    ) as Rgb;
  throw new Error(`Unsupported CSS color: ${value}`);
};

const relativeLuminance = ([red, green, blue]: Rgb) => {
  const linear = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  }) as Rgb;
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
};

const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = relativeLuminance(parseCssColor(foreground));
  const backgroundLuminance = relativeLuminance(parseCssColor(background));
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
};

const inlinePlaygroundTokens = (page: Page) =>
  page.locator('html').evaluate((element) => ({
    primary: element.style.getPropertyValue('--ps-color-primary'),
    primaryContrast: element.style.getPropertyValue('--ps-color-primary-contrast'),
    primaryText: element.style.getPropertyValue('--ps-color-primary-text'),
    radius: element.style.getPropertyValue('--ps-radius-md'),
    shadow: element.style.getPropertyValue('--ps-shadow-md'),
  }));

const resetPlaygroundTokens = async (page: Page, programmatic = false) => {
  const reset = page.locator('#reset-tokens');
  if (programmatic) await reset.evaluate((element) => (element as HTMLElement).click());
  else await reset.click();
  await expect
    .poll(() => inlinePlaygroundTokens(page))
    .toEqual({
      primary: '',
      primaryContrast: '',
      primaryText: '',
      radius: '',
      shadow: '',
    });
};

const prepareHeroVisual = async (page: Page) => {
  await page.evaluate(() => document.fonts.ready);
  const images = page.locator('.hero img');
  await expect(images).toHaveCount(5);
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  const viewport = page.viewportSize();
  if (viewport && viewport.width <= 500) {
    const heroHeight = await page.locator('.hero').evaluate((hero) => Math.ceil(hero.scrollHeight));
    if (heroHeight > viewport.height) {
      await page.setViewportSize({ width: viewport.width, height: heroHeight });
    }
  }
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const artwork = element as HTMLImageElement;
            return artwork.complete && artwork.naturalWidth > 0;
          }),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

const prepareLookbookVisual = async (page: Page, paintFullSection = false) => {
  await page.evaluate(() => document.fonts.ready);
  const lookbook = page.locator('[data-artwork-gallery]');
  const images = lookbook.locator('img');
  await expect(images).toHaveCount(6);
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  await lookbook.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const artwork = element as HTMLImageElement;
            return artwork.complete && artwork.naturalWidth > 0;
          }),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
  await images.evaluateAll((elements) =>
    Promise.all(elements.map((element) => (element as HTMLImageElement).decode())),
  );
  if (paintFullSection) {
    const viewport = page.viewportSize();
    const lookbookHeight = await lookbook.evaluate((element) => Math.ceil(element.scrollHeight));
    if (viewport && lookbookHeight > viewport.height) {
      await page.setViewportSize({ width: viewport.width, height: lookbookHeight });
    }
  }
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

const prepareCampaignVisual = async (page: Page, paintFullSection = false) => {
  await page.evaluate(() => document.fonts.ready);
  const campaigns = page.locator('.campaigns');
  const images = campaigns.locator('img');
  await expect(images).toHaveCount(4);
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  await campaigns.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const artwork = element as HTMLImageElement;
            return artwork.complete && artwork.naturalWidth > 0;
          }),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
  await images.evaluateAll((elements) =>
    Promise.all(elements.map((element) => (element as HTMLImageElement).decode())),
  );
  if (paintFullSection) {
    const viewport = page.viewportSize();
    const campaignHeight = await campaigns.evaluate((element) => Math.ceil(element.scrollHeight));
    if (viewport && campaignHeight > viewport.height) {
      await page.setViewportSize({ width: viewport.width, height: campaignHeight });
    }
  }
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

const prepareGlamVisual = async (page: Page, paintFullSection = false) => {
  await page.evaluate(() => document.fonts.ready);
  const glamKit = page.locator('.glam-kit');
  const images = glamKit.locator('img');
  await expect(images).toHaveCount(6);
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  await glamKit.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const artwork = element as HTMLImageElement;
            return artwork.complete && artwork.naturalWidth > 0;
          }),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
  await images.evaluateAll((elements) =>
    Promise.all(elements.map((element) => (element as HTMLImageElement).decode())),
  );
  await expect(glamKit.locator('.glam-kit-heading')).toHaveClass(/is-revealed/);
  if (paintFullSection) {
    const viewport = page.viewportSize();
    const glamHeight = await glamKit.evaluate((element) => Math.ceil(element.scrollHeight));
    if (viewport && glamHeight > viewport.height) {
      await page.setViewportSize({ width: viewport.width, height: glamHeight });
    }
  }
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

const prepareQuickStartVisual = async (page: Page) => {
  await page.evaluate(() => document.fonts.ready);
  const quickStart = page.locator('.quick-start');
  const image = quickStart.locator('img');
  await expect(image).toHaveCount(1);
  await image.evaluate((element) => ((element as HTMLImageElement).loading = 'eager'));
  await quickStart.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        image.evaluate((element) => {
          const artwork = element as HTMLImageElement;
          return artwork.complete && artwork.naturalWidth > 0;
        }),
      { timeout: 15_000 },
    )
    .toBe(true);
  await image.evaluate((element) => (element as HTMLImageElement).decode());
  const reveals = quickStart.locator('[data-reveal]');
  await expect(reveals).toHaveCount(2);
  await expect(reveals.first()).toHaveClass(/is-revealed/);
  await expect(reveals.last()).toHaveClass(/is-revealed/);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

const prepareSectionVisual = async (page: Page, selector: string) => {
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator(selector);
  const images = section.locator('img');
  await section.scrollIntoViewIfNeeded();
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  if ((await images.count()) > 0) {
    await expect
      .poll(
        () =>
          images.evaluateAll((elements) =>
            elements.every((element) => {
              const artwork = element as HTMLImageElement;
              return artwork.complete && artwork.naturalWidth > 0;
            }),
          ),
        { timeout: 15_000 },
      )
      .toBe(true);
    await images.evaluateAll((elements) =>
      Promise.all(elements.map((element) => (element as HTMLImageElement).decode())),
    );
  }
  await section.locator('[data-reveal]').evaluateAll((elements) => {
    for (const element of elements) element.classList.add('is-revealed');
  });
  await section.locator('[data-motion-card]').evaluateAll((elements) => {
    for (const element of elements) element.classList.add('is-motion-visible');
  });
  if (await section.getAttribute('data-reveal'))
    await section.evaluate((element) => element.classList.add('is-revealed'));
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
};

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('body')).toBeVisible();
});

test('loads the landing page and all component documentation', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: /pink sensation/i })).toBeVisible();
  await expect(page.locator('[data-component-card]')).toHaveCount(39);
  await expect(page.locator('ps-button').first()).toBeVisible();
  const favicon = page.locator('link[rel="icon"]');
  await expect(favicon).toHaveAttribute('type', 'image/svg+xml');
  const faviconUrl = await favicon.getAttribute('href');
  expect(faviconUrl).toBeTruthy();
  const faviconResponse = await page.request.get(new URL(faviconUrl!, page.url()).href);
  expect(faviconResponse.status()).toBe(200);
  expect(faviconResponse.headers()['content-type']).toContain('image/svg+xml');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('assigns unique serials and the six editorial feature cards without reordering', async ({
  page,
}) => {
  const cards = page.locator('[data-component-card]');
  const serials = await cards.evaluateAll((elements) =>
    elements.map((element) => (element as HTMLElement).dataset.serial),
  );
  expect(serials).toEqual(
    Array.from({ length: 39 }, (_, index) => `PS-${String(index + 1).padStart(3, '0')}`),
  );
  expect(new Set(serials).size).toBe(39);

  const featureTags = await page
    .locator('[data-feature-card]')
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(featureTags).toEqual([
    'ps-button',
    'ps-input',
    'ps-card',
    'ps-alert',
    'ps-tabs',
    'ps-dialog',
  ]);
  await expect(page.locator('[data-feature-card] [data-feature-artwork]')).toHaveCount(6);
  await expect(page.locator('[data-feature-card] .demo')).toHaveCount(6);
  const featureColumns = await page
    .locator('[data-feature-card]')
    .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).gridColumnEnd));
  expect(featureColumns.every((value) => value === '-1')).toBe(true);
});

test('loads optimized original hero artwork with stable dimensions', async ({ page }) => {
  test.slow();
  await prepareHeroVisual(page);
  const artwork = await page.locator('.hero img').evaluateAll((images) =>
    images.map((element) => {
      const image = element as HTMLImageElement;
      return {
        alt: image.alt,
        complete: image.complete,
        height: image.height,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        width: image.width,
      };
    }),
  );
  expect(artwork.every((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(artwork.every((image) => image.width > 0 && image.height > 0)).toBe(true);
  expect(artwork.every((image) => image.alt === '')).toBe(true);
  await expect(page.locator('.hero picture source[type="image/avif"]')).toHaveCount(5);
});

test('loads the editorial lookbook artwork with stable dimensions', async ({ page }) => {
  test.slow();
  await prepareLookbookVisual(page);
  const artwork = await page.locator('[data-artwork-gallery] img').evaluateAll((images) =>
    images.map((element) => {
      const image = element as HTMLImageElement;
      return {
        alt: image.alt,
        complete: image.complete,
        height: image.height,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        width: image.width,
      };
    }),
  );
  expect(artwork.every((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(artwork.every((image) => image.width > 0 && image.height > 0)).toBe(true);
  expect(artwork.every((image) => image.alt.length > 0)).toBe(true);
  await expect(
    page.locator('[data-artwork-gallery] picture source[type="image/avif"]'),
  ).toHaveCount(6);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('loads the expanded campaign artwork with stable dimensions', async ({ page }) => {
  test.slow();
  const images = page.locator('[data-expanded-artwork] img');
  await expect(images).toHaveCount(10);
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const artwork = element as HTMLImageElement;
            return artwork.complete && artwork.naturalWidth > 0;
          }),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
  const artwork = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      return {
        alt: image.alt,
        height: image.height,
        naturalWidth: image.naturalWidth,
        width: image.width,
      };
    }),
  );
  expect(artwork.every((image) => image.width > 0 && image.height > 0)).toBe(true);
  expect(artwork.every((image) => image.alt.length > 0)).toBe(true);
  await expect(
    page.locator('[data-expanded-artwork] picture source[type="image/avif"]'),
  ).toHaveCount(10);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('marks every decoded artwork state as loaded', async ({ page }) => {
  test.slow();
  const images = page.locator('picture img');
  await expect(images).toHaveCount(31);
  await images.evaluateAll((elements) => {
    for (const element of elements) (element as HTMLImageElement).loading = 'eager';
  });
  await expect
    .poll(
      () =>
        page
          .locator('picture')
          .evaluateAll((pictures) =>
            pictures.every((picture) => (picture as HTMLElement).dataset.imageState === 'loaded'),
          ),
      { timeout: 15_000 },
    )
    .toBe(true);
  const dimensions = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      return {
        height: image.height,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        width: image.width,
      };
    }),
  );
  expect(
    dimensions.every(
      (image) =>
        image.naturalWidth > 0 && image.naturalHeight > 0 && image.width > 0 && image.height > 0,
    ),
  ).toBe(true);
  await expect(page.locator('picture source[type="image/avif"]')).toHaveCount(31);
});

test('searches and filters the complete catalog', async ({ page }) => {
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'));
  const allFilter = page.getByRole('button', { name: 'All', exact: true });
  const formsFilter = page.getByRole('button', { name: 'Forms', exact: true });
  await expect(allFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(formsFilter).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#catalog-search input').fill('dialog');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(1);
  await expect(page.locator('#ps-dialog')).toBeVisible();
  await page.locator('#catalog-search input').fill('');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(39);
  await formsFilter.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await formsFilter.click();
  await expect(formsFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(allFilter).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(10);
  await expect(page.locator('#result-count')).toHaveText('10 components');
  expect(
    await page
      .locator('[data-component-card]:visible')
      .evaluateAll((elements) => elements.map((element) => element.id)),
  ).toEqual([
    'ps-field',
    'ps-input',
    'ps-textarea',
    'ps-select',
    'ps-option',
    'ps-checkbox',
    'ps-radio-group',
    'ps-radio',
    'ps-switch',
    'ps-range',
  ]);
  await page.locator('#catalog-search input').fill('input');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(1);
  await expect(page.locator('#ps-input')).toHaveAttribute('data-feature-card', '');
  await expect(page.locator('#result-count')).toHaveText('1 component');
});

test('persists all three themes', async ({ page }) => {
  for (const theme of ['bubblegum', 'midnight', 'pastel']) {
    await page.locator('#theme-switcher').selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-ps-theme', theme);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ps-theme', 'pastel');
});

test('keeps readable text roles and code samples in every theme', async ({ page }) => {
  test.slow();
  await page.addStyleTag({
    content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
  });
  const tokenNames = [
    '--ps-color-bg',
    '--ps-color-surface',
    '--ps-color-surface-raised',
    '--ps-color-text',
    '--ps-color-muted',
    '--ps-color-primary',
    '--ps-color-primary-text',
    '--ps-color-primary-contrast',
    '--ps-color-secondary-text',
    '--ps-color-accent-text',
  ];

  for (const theme of ['bubblegum', 'midnight', 'pastel']) {
    await page.locator('#theme-switcher').selectOption(theme);
    const tokens = await page.locator('html').evaluate((element, names) => {
      const styles = getComputedStyle(element);
      return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
    }, tokenNames);
    const token = (name: string) => {
      const value = tokens[name];
      if (!value) throw new Error(`${theme}: missing ${name}`);
      return value;
    };
    const surfaces = ['--ps-color-bg', '--ps-color-surface', '--ps-color-surface-raised'];
    for (const foreground of [
      '--ps-color-text',
      '--ps-color-muted',
      '--ps-color-primary-text',
      '--ps-color-secondary-text',
      '--ps-color-accent-text',
    ]) {
      for (const surface of surfaces) {
        expect(
          contrastRatio(token(foreground), token(surface)),
          `${theme}: ${foreground} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
    expect(
      contrastRatio(token('--ps-color-primary-contrast'), token('--ps-color-primary')),
      `${theme}: primary control foreground`,
    ).toBeGreaterThanOrEqual(4.5);

    const categoryTextColors = await page
      .locator('.component-heading .eyebrow, .component-serial, .stage-label')
      .evaluateAll((elements) => [
        ...new Set(elements.map((element) => getComputedStyle(element).color)),
      ]);
    for (const foreground of categoryTextColors) {
      for (const surface of surfaces) {
        expect(
          contrastRatio(foreground, token(surface)),
          `${theme}: catalog label ${foreground} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }

    const codeSample = await page
      .locator('.feature-code')
      .first()
      .evaluate((element) => ({
        background: getComputedStyle(element).backgroundColor,
        foreground: getComputedStyle(element.querySelector('code')!).color,
      }));
    expect(
      contrastRatio(codeSample.foreground, codeSample.background),
      `${theme}: feature code sample`,
    ).toBeGreaterThanOrEqual(4.5);

    for (const customPrimary of ['#f20a86', '#7929d6', '#007d89']) {
      await page.locator('[name="primary"]').selectOption(customPrimary);
      const customTokens = await page.locator('html').evaluate((element, names) => {
        const styles = getComputedStyle(element);
        return Object.fromEntries(
          names.map((name) => [name, styles.getPropertyValue(name).trim()]),
        );
      }, tokenNames);
      for (const surface of surfaces) {
        expect(
          contrastRatio(customTokens['--ps-color-primary-text']!, customTokens[surface]!),
          `${theme}: custom ${customPrimary} text on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
      expect(
        contrastRatio(
          customTokens['--ps-color-primary-contrast']!,
          customTokens['--ps-color-primary']!,
        ),
        `${theme}: custom ${customPrimary} control foreground`,
      ).toBeGreaterThanOrEqual(4.5);
    }
    await resetPlaygroundTokens(page, true);
  }
});

test('supports responsive site navigation selection and Escape', async ({ page }) => {
  test.slow();
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Toggle site navigation' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.site-header nav')).toBeVisible();
  await page.getByRole('link', { name: 'Scenes', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.site-header nav')).toBeHidden();

  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.site-header nav')).toBeHidden();
  await expect(toggle).toBeFocused();

  await expect(page.locator('.site-header nav a > span')).toHaveCount(5);
  expect(await page.locator('.site-header nav a > span').allTextContents()).toEqual([
    '01',
    '02',
    '03',
    '04',
    '05',
  ]);
  const filters = page.locator('.category-filters');
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'));
  await filters.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await expect(filters).toHaveCSS('scroll-snap-type', 'x');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('tracks scroll progress and the active navigation location', async ({ page }) => {
  const tokenSection = page.locator('#tokens');
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'));
  await tokenSection.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await expect(page.locator('.site-header')).toHaveClass(/is-compact/);
  await expect(page.locator('.site-header nav a[href="#tokens"]')).toHaveAttribute(
    'aria-current',
    'location',
  );
  await expect(page.locator('.site-header nav a[href="#lookbook"]')).not.toHaveAttribute(
    'aria-current',
    'location',
  );
  const progressWidth = await page
    .locator('.scroll-progress i')
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(progressWidth).toBeGreaterThan(0);
});

test('shows short-lived copy feedback while keeping the toast', async ({ page }) => {
  test.slow();
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (const element of document.querySelectorAll('[data-reveal]')) {
      element.classList.add('is-revealed');
    }
  });
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  const copyButton = page.locator('.quick-start [data-copy]');
  await copyButton.click();
  await expect(copyButton).toHaveText('Copied!');
  await expect(copyButton).toHaveAttribute('data-copy-state', 'success');
  await expect(page.getByText('Ready for your project.')).toBeVisible();
  await expect(copyButton).toHaveText('Copy imports', { timeout: 3000 });
  await expect(copyButton).not.toHaveAttribute('data-copy-state', 'success');
});

test('runs form, tabs, accordion, menu, dialog, drawer, and toast interactions', async ({
  page,
}) => {
  test.slow();
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (const element of document.querySelectorAll('[data-reveal]')) {
      element.classList.add('is-revealed');
    }
  });
  const input = page.locator('#ps-input ps-input input');
  await input.fill('Arcade');
  await expect(input).toHaveValue('Arcade');
  const tabs = page.locator('#ps-tabs ps-tabs');
  await tabs.locator('ps-tab').nth(1).click();
  await expect(tabs).toHaveAttribute('value', 'mixes');
  const accordion = page.locator('#ps-accordion ps-accordion-item').nth(1);
  await accordion.locator('summary').click();
  await expect(accordion).toHaveAttribute('open', '');
  const dropdown = page.locator('#ps-dropdown ps-dropdown');
  await dropdown.locator('[slot="trigger"]').click();
  await expect(dropdown).toHaveAttribute('open', '');
  await dropdown.locator('ps-menu-item').first().click();
  await page.locator('#ps-dialog [data-open-dialog]').click();
  await expect(page.getByRole('dialog', { name: 'After-hours special' })).toBeVisible();
  await page.getByRole('button', { name: 'Lovely' }).click();
  await page.locator('#ps-drawer [data-open-drawer]').click();
  await expect(page.getByRole('dialog', { name: 'Shopping bag' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('#ps-toast-stack [data-demo-toast]').click();
  await expect(page.getByText('Your look is now extra glossy.')).toBeVisible();
});

test('token controls accept only documented selections', async ({ page }) => {
  await page.locator('[name="primary"]').selectOption('#007d89');
  await page.locator('[name="radius"]').selectOption('1.5rem');
  await page.locator('[name="shadow"]').selectOption('0 10px 0 var(--ps-color-border)');
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary', '#007d89');
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary-text', '#00627a');
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary-contrast', '#ffffff');
  await page.locator('#theme-switcher').selectOption('midnight');
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary-text', '#55e6f8');
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary-contrast', '#ffffff');
  await expect(page.locator('[data-receipt-primary]')).toHaveText('Pool teal · #007d89');
  await expect(page.locator('[data-receipt-radius]')).toHaveText('Bubble · 1.5rem');
  await expect(page.locator('[data-receipt-shadow]')).toHaveText('Extra · 10px');
  await resetPlaygroundTokens(page);
  await expect(page.locator('[data-receipt-primary]')).toHaveText('Hot pink · #f20a86');
  await expect(page.locator('[data-receipt-radius]')).toHaveText('Soft · 0.9rem');
  await expect(page.locator('[data-receipt-shadow]')).toHaveText('Classic · 6px');
});

test('has no serious axe violations on landing, catalog, forms, and open overlays', async ({
  page,
}) => {
  test.slow();
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await page.locator('[data-reveal]').evaluateAll((elements) => {
    for (const element of elements) element.classList.add('is-revealed');
  });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const landing = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    landing.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    ),
  ).toEqual([]);
  await page.locator('#ps-dialog [data-open-dialog]').click();
  const overlay = await new AxeBuilder({ page }).include('#ps-dialog').analyze();
  expect(
    overlay.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    ),
  ).toEqual([]);
});

test('honors reduced motion', async ({ page }) => {
  test.slow();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/motion-ok/);
  await expect(page.locator('html')).not.toHaveClass(/pointer-glow/);
  const motionStyles = await page.evaluate(() => {
    const normalizedTransform = (element: Element | null) => {
      if (!element) return '';
      const value = getComputedStyle(element).transform;
      return value === 'matrix(1, 0, 0, 1, 0, 0)' ? 'none' : value;
    };
    const marquee = document.querySelector('.marquee div');
    const reveal = document.querySelector<HTMLElement>('[data-reveal]');
    const picture = document.querySelector('.player-art picture');
    const tape = document.querySelector('.hero-issue');
    const featureArtwork = document.querySelector('.feature-artwork img');
    const receipt = document.querySelector('.style-receipt');
    return {
      featureArtworkTransform: normalizedTransform(featureArtwork),
      featureArtworkTransition: featureArtwork
        ? getComputedStyle(featureArtwork).transitionDuration
        : '',
      marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : '',
      receiptTransform: normalizedTransform(receipt),
      revealOpacity: reveal ? getComputedStyle(reveal).opacity : '',
      revealTransform: normalizedTransform(reveal),
      revealTransition: reveal ? getComputedStyle(reveal).transitionDuration : '',
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      shimmerAnimation: picture ? getComputedStyle(picture, '::after').animationName : '',
      shimmerContent: picture ? getComputedStyle(picture, '::after').content : '',
      tapeAnimation: tape ? getComputedStyle(tape).animationName : '',
      tapeTransform: normalizedTransform(tape),
    };
  });
  expect(motionStyles).toEqual({
    featureArtworkTransform: 'none',
    featureArtworkTransition: '0s',
    marqueeAnimation: 'none',
    receiptTransform: 'none',
    revealOpacity: '1',
    revealTransform: 'none',
    revealTransition: '0s',
    scrollBehavior: 'auto',
    shimmerAnimation: 'none',
    shimmerContent: 'none',
    tapeAnimation: 'none',
    tapeTransform: 'none',
  });
  const artwork = page.locator('.lookbook-card').first();
  await artwork.scrollIntoViewIfNeeded();
  await artwork.hover();
  expect(await artwork.evaluate((element) => element.style.getPropertyValue('--shine-x'))).toBe('');
  await page.locator('#theme-switcher').selectOption('midnight');
  await expect(page.locator('html')).not.toHaveClass(/theme-transitioning/);
  const featureArtwork = page.locator('[data-feature-artwork]').first();
  await featureArtwork.hover();
  expect(
    await featureArtwork.evaluate((element) => element.style.getPropertyValue('--shine-x')),
  ).toBe('');
});

test('uses scroll and pointer input for tactile motion', async ({ page }, testInfo) => {
  test.slow();
  test.skip(testInfo.project.name === 'mobile-chromium');
  await expect(page.locator('html')).toHaveClass(/motion-ok/);
  await expect(page.locator('.hero-board')).toHaveCSS('animation-name', 'hero-cover-arrive');

  await page.evaluate(async () => {
    window.scrollTo(0, 240);
    window.dispatchEvent(new Event('scroll'));
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  await expect
    .poll(
      () =>
        page
          .locator('.hero')
          .evaluate((element) => element.style.getPropertyValue('--hero-scroll')),
      { timeout: 15_000 },
    )
    .not.toBe('0.000');

  const artwork = page.locator('.lookbook-card').first();
  await artwork.scrollIntoViewIfNeeded();
  const bounds = await artwork.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.move(bounds!.x + 24, bounds!.y + 24, { steps: 3 });
  await expect
    .poll(() => artwork.evaluate((element) => element.style.getPropertyValue('--tilt-y')), {
      timeout: 15_000,
    })
    .not.toBe('0deg');
  await page.mouse.move(0, 0);
  await expect
    .poll(() => artwork.evaluate((element) => element.style.getPropertyValue('--tilt-y')))
    .toBe('0deg');
});

for (const theme of ['bubblegum', 'midnight', 'pastel']) {
  test(`visual baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(!['chromium', 'mobile-chromium'].includes(testInfo.project.name));
    await page.locator('#theme-switcher').selectOption(theme);
    await prepareHeroVisual(page);
    await page.locator('.site-header, .skip-link').evaluateAll((elements) => {
      for (const element of elements) (element as HTMLElement).style.visibility = 'hidden';
    });
    await expect(page.locator('.hero')).toHaveScreenshot(`hero-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`component surface baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.locator('#theme-switcher').selectOption(theme);
    await page.evaluate(() => document.fonts.ready);
    const panel = page.locator('.token-layout');
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toHaveScreenshot(`tokens-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`lookbook baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.locator('#theme-switcher').selectOption(theme);
    await page.locator('[data-artwork-gallery]').evaluate((element) => {
      (element as HTMLElement).style.zoom = '0.7';
    });
    await prepareLookbookVisual(page, true);
    await page.locator('.site-header, .skip-link').evaluateAll((elements) => {
      for (const element of elements) (element as HTMLElement).style.visibility = 'hidden';
    });
    await expect(page.locator('[data-artwork-gallery]')).toHaveScreenshot(`lookbook-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`campaign baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.locator('#theme-switcher').selectOption(theme);
    await page.locator('.campaigns').evaluate((element) => {
      (element as HTMLElement).style.zoom = '0.7';
    });
    await prepareCampaignVisual(page, true);
    await page.locator('.site-header, .skip-link').evaluateAll((elements) => {
      for (const element of elements) (element as HTMLElement).style.visibility = 'hidden';
    });
    await expect(page.locator('.campaigns')).toHaveScreenshot(`campaign-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`glam kit baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.locator('#theme-switcher').selectOption(theme);
    await page.locator('.glam-kit').evaluate((element) => {
      (element as HTMLElement).style.zoom = '0.7';
    });
    await prepareGlamVisual(page, true);
    await page.locator('.site-header, .skip-link').evaluateAll((elements) => {
      for (const element of elements) (element as HTMLElement).style.visibility = 'hidden';
    });
    await expect(page.locator('.glam-kit')).toHaveScreenshot(`glam-kit-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`quick start baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.locator('#theme-switcher').selectOption(theme);
    await prepareQuickStartVisual(page);
    await page.locator('.site-header, .skip-link').evaluateAll((elements) => {
      for (const element of elements) (element as HTMLElement).style.visibility = 'hidden';
    });
    await expect(page.locator('.quick-start')).toHaveScreenshot(`quick-start-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`390px editorial baselines: ${theme}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium');
    await expect.poll(() => page.viewportSize()?.width).toBe(390);
    await page.locator('#theme-switcher').selectOption(theme);
    await page.locator('.site-header, .skip-link').evaluateAll((elements) => {
      for (const element of elements) (element as HTMLElement).style.visibility = 'hidden';
    });

    await prepareSectionVisual(page, '#lookbook');
    await expect(page.locator('#lookbook')).toHaveScreenshot(`lookbook-${theme}-390.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });

    await prepareSectionVisual(page, '#campaigns');
    await expect(page.locator('#campaigns')).toHaveScreenshot(`campaign-${theme}-390.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });

    await prepareSectionVisual(page, '#ps-button');
    await expect(page.locator('#ps-button')).toHaveScreenshot(`feature-${theme}-390.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });

    await prepareSectionVisual(page, '.quick-start');
    await expect(page.locator('.quick-start')).toHaveScreenshot(`quick-start-${theme}-390.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });

    await prepareSectionVisual(page, '.token-layout');
    await expect(page.locator('.token-layout')).toHaveScreenshot(`tokens-${theme}-390.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
}
