import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('body')).toBeVisible();
});

test('loads the landing page and all component documentation', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: /pink sensation/i })).toBeVisible();
  await expect(page.locator('[data-component-card]')).toHaveCount(39);
  await expect(page.locator('ps-button').first()).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('searches and filters the complete catalog', async ({ page }) => {
  await page.locator('#catalog-search input').fill('dialog');
  await expect(page.locator('[data-component-card]:visible')).toHaveCount(1);
  await expect(page.locator('#ps-dialog')).toBeVisible();
  await page.locator('#catalog-search input').fill('');
  await page.getByRole('button', { name: 'Forms', exact: true }).click();
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

test('supports responsive site navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Toggle site navigation' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.site-header nav')).toBeVisible();
});

test('runs form, tabs, accordion, menu, dialog, drawer, and toast interactions', async ({
  page,
}) => {
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
  await page.locator('[name="primary"]').selectOption('#007c83');
  await expect(page.locator('html')).toHaveCSS('--ps-color-primary', '#007c83');
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
  const animation = await page
    .locator('.marquee div')
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animation).toBe('none');
});

for (const theme of ['bubblegum', 'midnight', 'pastel']) {
  test(`visual baseline: ${theme}`, async ({ page }, testInfo) => {
    test.skip(!['chromium', 'mobile-chromium'].includes(testInfo.project.name));
    await page.locator('#theme-switcher').selectOption(theme);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.hero')).toHaveScreenshot(`hero-${theme}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
}
