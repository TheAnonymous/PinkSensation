import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A presentational shell around slotted native table markup. @slot - Native table. @csspart scroller - Scroll container. */
@customElement('ps-table')
export class PsTable extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .scroller {
        overflow: auto;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-md);
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-md);
      }
      ::slotted(table) {
        width: 100%;
        border-collapse: collapse;
      }
      ::slotted(table) {
        font: inherit;
        color: inherit;
      }
    `,
  ];
  override render() {
    return html`<div class="scroller" part="scroller"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-table': PsTable;
  }
}
