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
        background: linear-gradient(
          145deg,
          var(--ps-color-surface) 0 72%,
          color-mix(in srgb, var(--ps-color-surface-raised) 82%, var(--ps-color-primary)) 100%
        );
        box-shadow:
          inset 0 2px 0 color-mix(in srgb, white 72%, transparent),
          var(--ps-shadow-lg);
      }
      .header,
      .body,
      .footer {
        padding: var(--ps-space-4);
      }
      .header {
        border-bottom: 2px solid var(--ps-color-border);
        background: linear-gradient(
          110deg,
          var(--ps-color-surface-raised),
          color-mix(in srgb, var(--ps-color-surface-raised) 66%, var(--ps-color-primary))
        );
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
