import { LitElement, css, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { PsMenuItem } from './menu-item.js';
import './menu-item.js';

/** A keyboard-navigable action menu. @slot - ps-menu-item elements. @csspart menu - Menu. */
@customElement('ps-menu')
export class PsMenu extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .menu {
        display: grid;
        gap: 0.15rem;
      }
    `,
  ];
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Menu';
  @queryAssignedElements({ selector: 'ps-menu-item' }) private items!: PsMenuItem[];
  private enabled(): PsMenuItem[] {
    return (this.items ?? []).filter((item) => !item.disabled);
  }
  private sync(): void {
    this.enabled().forEach((item, index) => (item.focusIndex = index === 0 ? 0 : -1));
  }
  private onKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const items = this.enabled();
    if (!items.length) return;
    event.preventDefault();
    const path = event.composedPath();
    let index = items.findIndex((item) => path.includes(item));
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = items.length - 1;
    else
      index =
        (Math.max(0, index) + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
    items[index]?.focus();
  }
  override render() {
    return html`<div
      class="menu"
      part="menu"
      role="menu"
      aria-label=${this.accessibleLabel}
      @keydown=${this.onKeydown}
    >
      <slot @slotchange=${this.sync}></slot>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-menu': PsMenu;
  }
}
