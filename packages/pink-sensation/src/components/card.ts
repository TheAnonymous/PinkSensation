import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A sticker-like content surface. @slot header - Header. @slot - Content. @slot footer - Footer. @csspart base - Card. @csspart header - Header. @csspart body - Body. @csspart footer - Footer. */
@customElement('ps-card')
export class PsCard extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .card {
        overflow: hidden;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-lg);
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-lg);
      }
      .header,
      .body,
      .footer {
        padding: var(--ps-space-4);
      }
      .header {
        border-bottom: 2px solid var(--ps-color-border);
        background: var(--ps-color-surface-raised);
        font-family: var(--ps-font-display);
        font-size: 1.25rem;
      }
      .footer {
        border-top: 2px solid var(--ps-color-border);
      }
      .header:empty,
      .footer:empty {
        display: none;
      }
    `,
  ];
  override render() {
    return html`<article class="card" part="base">
      <header class="header" part="header"><slot name="header"></slot></header>
      <div class="body" part="body"><slot></slot></div>
      <footer class="footer" part="footer"><slot name="footer"></slot></footer>
    </article>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-card': PsCard;
  }
}
