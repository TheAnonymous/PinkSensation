import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A breadcrumb navigation wrapper. @slot - Links or list items. @csspart list - Breadcrumb list. */
@customElement('ps-breadcrumbs')
export class PsBreadcrumbs extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.45rem;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .separator {
        color: var(--ps-color-muted);
      }
      ::slotted(*) {
        color: var(--ps-color-primary);
        font-weight: 750;
      }
    `,
  ];
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Breadcrumb';
  override render() {
    return html`<nav aria-label=${this.accessibleLabel}>
      <div class="list" part="list"><slot></slot></div>
    </nav>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-breadcrumbs': PsBreadcrumbs;
  }
}
