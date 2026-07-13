import { afterEach, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../src/index.js';
import type {
  PsButton,
  PsCheckbox,
  PsDialog,
  PsDrawer,
  PsInput,
  PsRadioGroup,
  PsSelect,
  PsTabs,
} from '../src/index.js';

const tags = [
  'ps-button',
  'ps-icon-button',
  'ps-button-group',
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
  'ps-avatar',
  'ps-badge',
  'ps-chip',
  'ps-card',
  'ps-divider',
  'ps-empty-state',
  'ps-table',
  'ps-alert',
  'ps-progress',
  'ps-spinner',
  'ps-toast-stack',
  'ps-toast',
  'ps-navbar',
  'ps-breadcrumbs',
  'ps-tabs',
  'ps-tab',
  'ps-tab-panel',
  'ps-pagination',
  'ps-accordion',
  'ps-accordion-item',
  'ps-dialog',
  'ps-drawer',
  'ps-dropdown',
  'ps-menu',
  'ps-menu-item',
  'ps-tooltip',
] as const;

afterEach(() => {
  document.body.replaceChildren();
});

describe('registration and component contracts', () => {
  test('registers the complete toolkit and uses open shadow roots', () => {
    for (const tag of tags) {
      expect(customElements.get(tag)).toBeTypeOf('function');
      const element = document.createElement(tag);
      document.body.append(element);
      expect(element.shadowRoot).not.toBeNull();
    }
  });

  test('normalizes an unknown button size and exposes its part', async () => {
    const button = document.createElement('ps-button') as PsButton;
    button.size = 'enormous' as never;
    document.body.append(button);
    await button.updateComplete;
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(button.size).toBe('md');
    expect(button.shadowRoot?.querySelector('[part="button"]')).toBeInstanceOf(HTMLButtonElement);
  });

  test('suppresses disabled button activation', async () => {
    const button = document.createElement('ps-button') as PsButton;
    button.disabled = true;
    const clicked = vi.fn();
    button.addEventListener('click', clicked);
    document.body.append(button);
    await button.updateComplete;
    (button.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
    expect(clicked).not.toHaveBeenCalled();
  });
});

describe('form association', () => {
  test('submits input values, validates required state, emits composed events, and resets', async () => {
    const form = document.createElement('form');
    const input = document.createElement('ps-input') as PsInput;
    input.name = 'nickname';
    input.value = 'Starlight';
    input.required = true;
    form.append(input);
    document.body.append(form);
    await input.updateComplete;
    expect(new FormData(form).get('nickname')).toBe('Starlight');
    const changes = vi.fn();
    form.addEventListener('change', changes);
    const native = input.shadowRoot?.querySelector('input') as HTMLInputElement;
    native.value = 'Neon';
    native.dispatchEvent(new Event('input', { bubbles: true }));
    native.dispatchEvent(new Event('change', { bubbles: true }));
    expect(input.value).toBe('Neon');
    expect(changes).toHaveBeenCalledOnce();
    form.reset();
    expect(input.value).toBe('Starlight');
    input.value = '';
    await input.updateComplete;
    expect(input.validity.valueMissing).toBe(true);
  });

  test('submits checked controls only and restores the default on reset', async () => {
    const form = document.createElement('form');
    const checkbox = document.createElement('ps-checkbox') as PsCheckbox;
    checkbox.name = 'extras';
    checkbox.value = 'sparkles';
    checkbox.checked = true;
    form.append(checkbox);
    document.body.append(form);
    await checkbox.updateComplete;
    expect(new FormData(form).get('extras')).toBe('sparkles');
    (checkbox.shadowRoot?.querySelector('input') as HTMLInputElement).click();
    expect(new FormData(form).has('extras')).toBe(false);
    form.reset();
    expect(checkbox.checked).toBe(true);
  });

  test('maps declarative options into a single native selection', async () => {
    const select = document.createElement('ps-select') as PsSelect;
    select.name = 'store';
    select.innerHTML =
      '<ps-option value="records">Records</ps-option><ps-option value="arcade">Arcade</ps-option>';
    document.body.append(select);
    await select.updateComplete;
    await new Promise(requestAnimationFrame);
    const native = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
    expect(native.options).toHaveLength(3);
    native.value = 'arcade';
    native.dispatchEvent(new Event('change', { bubbles: true }));
    expect(select.value).toBe('arcade');
  });
});

describe('compound keyboard and overlays', () => {
  test('moves radio selection with arrow keys', async () => {
    const group = document.createElement('ps-radio-group') as PsRadioGroup;
    group.value = 'one';
    group.innerHTML = '<ps-radio value="one">One</ps-radio><ps-radio value="two">Two</ps-radio>';
    document.body.append(group);
    await group.updateComplete;
    await new Promise(requestAnimationFrame);
    const first = group.querySelector('ps-radio') as HTMLElement;
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(group.value).toBe('two');
  });

  test('coordinates tabs and arrow-key selection', async () => {
    const tabs = document.createElement('ps-tabs') as PsTabs;
    tabs.value = 'one';
    tabs.innerHTML =
      '<ps-tab value="one">One</ps-tab><ps-tab value="two">Two</ps-tab><ps-tab-panel value="one">First</ps-tab-panel><ps-tab-panel value="two">Second</ps-tab-panel>';
    document.body.append(tabs);
    await tabs.updateComplete;
    await new Promise(requestAnimationFrame);
    (tabs.querySelector('ps-tab') as HTMLElement).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs.value).toBe('two');
    expect(tabs.querySelectorAll('ps-tab-panel')[1]?.hasAttribute('active')).toBe(true);
  });

  test('opens and closes a native modal while restoring focus', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open';
    const dialog = document.createElement('ps-dialog') as PsDialog;
    dialog.innerHTML = '<span slot="heading">Title</span><button>Inside</button>';
    document.body.append(trigger, dialog);
    trigger.focus();
    await dialog.showModal();
    expect(dialog.open).toBe(true);
    expect(dialog.shadowRoot?.querySelector('dialog')?.open).toBe(true);
    dialog.close('done');
    await dialog.updateComplete;
    expect(dialog.returnValue).toBe('done');
    expect(document.activeElement).toBe(trigger);
  });

  test('opens and dismisses a drawer with its public methods', async () => {
    const trigger = document.createElement('button');
    const drawer = document.createElement('ps-drawer') as PsDrawer;
    document.body.append(trigger, drawer);
    trigger.focus();
    await drawer.show();
    expect(drawer.open).toBe(true);
    drawer.hide();
    expect(drawer.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  test('ships explicit reduced-motion rules for animated feedback', () => {
    const spinner = document.createElement('ps-spinner');
    document.body.append(spinner);
    const css = String(
      (customElements.get('ps-spinner') as typeof HTMLElement & { styles: unknown }).styles,
    );
    expect(css).toContain('prefers-reduced-motion');
  });
});
