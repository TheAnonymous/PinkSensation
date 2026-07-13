import { LitElement, css, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { PsTab } from './tab.js';
import type { PsTabPanel } from './tab-panel.js';
import './tab.js';
import './tab-panel.js';

/** Keyboard-complete tabs. @slot - ps-tab and ps-tab-panel elements. @csspart tablist - Tab list. @csspart panels - Panel region. */
@customElement('ps-tabs')
export class PsTabs extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .tablist {
        display: flex;
        gap: 0.25rem;
        overflow: auto;
      }
      .panels {
        display: contents;
      }
    `,
  ];
  @property({ reflect: true }) value = '';
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Tabs';
  @queryAssignedElements({ slot: 'tabs', selector: 'ps-tab' }) private tabs!: PsTab[];
  @queryAssignedElements({ slot: 'panels', selector: 'ps-tab-panel' })
  private panels!: PsTabPanel[];
  private observer?: MutationObserver;
  override connectedCallback(): void {
    super.connectedCallback();
    this.assignSlots();
    this.observer = new MutationObserver(() => {
      this.assignSlots();
      this.sync();
    });
    this.observer.observe(this, { childList: true });
  }
  override disconnectedCallback(): void {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }
  private assignSlots(): void {
    for (const child of this.children) {
      if (child.matches('ps-tab')) child.setAttribute('slot', 'tabs');
      if (child.matches('ps-tab-panel')) child.setAttribute('slot', 'panels');
    }
  }
  private sync(): void {
    const tabs = this.tabs ?? [];
    const panels = this.panels ?? [];
    const enabled = tabs.filter((tab) => !tab.disabled);
    if (!enabled.some((tab) => tab.value === this.value)) this.value = enabled[0]?.value ?? '';
    tabs.forEach((tab, index) => {
      tab.id ||= `ps-tab-${index}-${Math.random().toString(36).slice(2, 7)}`;
    });
    panels.forEach((panel, index) => {
      panel.id ||= `ps-panel-${index}-${Math.random().toString(36).slice(2, 7)}`;
    });
    tabs.forEach((tab) => {
      tab.active = tab.value === this.value;
      tab.focusIndex = tab.active ? 0 : -1;
      tab.panelId = panels.find((item) => item.value === tab.value)?.id ?? '';
    });
    panels.forEach((panel) => {
      panel.active = panel.value === this.value;
      panel.tabId = tabs.find((item) => item.value === panel.value)?.id ?? '';
    });
  }
  private onSlotChange(): void {
    this.sync();
  }
  private onSelect(event: CustomEvent<{ value: string }>): void {
    event.stopPropagation();
    this.value = event.detail.value;
    this.sync();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  private onKeydown(event: KeyboardEvent): void {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const tabs = (this.tabs ?? []).filter((tab) => !tab.disabled);
    if (!tabs.length) return;
    event.preventDefault();
    const current = tabs.findIndex((tab) => tab.active);
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (current + (event.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length;
    const next = tabs[index];
    if (!next) return;
    this.value = next.value;
    this.sync();
    next.focus();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  protected override updated(): void {
    this.sync();
  }
  override render() {
    return html`<div
        class="tablist"
        part="tablist"
        role="tablist"
        aria-label=${this.accessibleLabel}
        @ps-tab-select=${this.onSelect}
        @keydown=${this.onKeydown}
      >
        <slot name="tabs" @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="panels" part="panels">
        <slot name="panels" @slotchange=${this.onSlotChange}></slot>
      </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-tabs': PsTabs;
  }
}
