import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { FeedbackVariant } from '../types.js';

/** A compact status label. @slot - Badge text. @csspart base - Badge. */
@customElement('ps-badge')
export class PsBadge extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        min-height: 1.55rem;
        padding: 0.15rem 0.55rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 99px;
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ps-color-secondary) 68%, white),
          var(--ps-color-secondary) 45%
        );
        color: #fff;
        font-size: 0.75rem;
        font-weight: 900;
        line-height: 1;
        box-shadow: var(--ps-shadow-sm);
      }
      :host([variant='success']) .badge {
        background: var(--ps-color-success);
        color: var(--ps-color-bg);
      }
      :host([variant='warning']) .badge {
        background: var(--ps-color-warning);
        color: var(--ps-color-bg);
      }
      :host([variant='danger']) .badge {
        background: var(--ps-color-danger);
        color: var(--ps-color-bg);
      }
    `,
  ];
  @property({ reflect: true }) variant: FeedbackVariant = 'info';
  override render() {
    return html`<span class="badge" part="base"><slot></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-badge': PsBadge;
  }
}
