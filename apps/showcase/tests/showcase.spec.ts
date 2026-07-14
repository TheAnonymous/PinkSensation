import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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
  await expect(images).toHaveCount(25);
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
});

test('searches and filters the complete catalog', async ({ page }) => {
  const allFilter = page.getByRole('button', { name: 'All', exact: true });
  const formsFilter = page.getByRole('button', { name: 'Forms', exact: true });
  await expect(allFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(formsFilter).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#catalog-search input').fill('dialog');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(1);
  await expect(page.locator('#ps-dialog')).toBeVisible();
  await page.locator('#catalog-search input').fill('');
  await formsFilter.click();
  await expect(formsFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(allFilter).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(10);
});

test('persists all three themes', async ({ page }) => {
  for (const theme of ['bubblegum', 'midnight', 'pastel']) {
    await page.locator('#theme-switcher').selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-ps-theme', theme);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ps-theme', 'pastel');
});

test('supports responsive site navigation selection and Escape', async ({ page }) => {
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
});

test('tracks scroll progress and the active navigation location', async ({ page }) => {
  const tokenSection = page.locator('#tokens');
  await tokenSection.evaluate((element) => element.scrollIntoView());
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
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary', '#007d89');
  await page.getByRole('button', { name: 'Reset tokens' }).click();
  expect(
    await page
      .locator('html')
      .evaluate((element) => element.style.getPropertyValue('--ps-color-primary')),
  ).toBe('');
});

test('has no serious axe violations on landing, catalog, forms, and open overlays', async ({
  page,
}) => {
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/motion-ok/);
  await expect(page.locator('html')).not.toHaveClass(/pointer-glow/);
  const motionStyles = await page.evaluate(() => {
    const marquee = document.querySelector('.marquee div');
    const reveal = document.querySelector<HTMLElement>('[data-reveal]');
    const picture = document.querySelector('picture');
    return {
      marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : '',
      revealOpacity: reveal ? getComputedStyle(reveal).opacity : '',
      revealTransform: reveal ? getComputedStyle(reveal).transform : '',
      revealTransition: reveal ? getComputedStyle(reveal).transitionDuration : '',
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      shimmerAnimation: picture ? getComputedStyle(picture, '::after').animationName : '',
      shimmerContent: picture ? getComputedStyle(picture, '::after').content : '',
    };
  });
  expect(motionStyles).toEqual({
    marqueeAnimation: 'none',
    revealOpacity: '1',
    revealTransform: 'none',
    revealTransition: '0s',
    scrollBehavior: 'auto',
    shimmerAnimation: 'none',
    shimmerContent: 'none',
  });
  const artwork = page.locator('.lookbook-card').first();
  await artwork.scrollIntoViewIfNeeded();
  await artwork.hover();
  expect(await artwork.evaluate((element) => element.style.getPropertyValue('--shine-x'))).toBe('');
  await page.locator('#theme-switcher').selectOption('midnight');
  await expect(page.locator('html')).not.toHaveClass(/theme-transitioning/);
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
}
