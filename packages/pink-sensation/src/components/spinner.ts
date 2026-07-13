import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { ComponentSize } from '../types.js';

/** An animated loading indicator. @csspart spinner - Spinner ring. */
@customElement('ps-spinner')
export class PsSpinner extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-grid;
      }
      .spinner {
        width: 2rem;
        height: 2rem;
        border: 0.28rem solid color-mix(in srgb, var(--ps-color-primary) 25%, transparent);
        border-top-color: var(--ps-color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      :host([size='sm']) .spinner {
        width: 1.35rem;
        height: 1.35rem;
        border-width: 0.2rem;
      }
      :host([size='lg']) .spinner {
        width: 3rem;
        height: 3rem;
        border-width: 0.38rem;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation-duration: 2.4s;
        }
      }
    `,
  ];
  @property({ reflect: true }) size: ComponentSize = 'md';
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Loading';
  override render() {
    return html`<span
      class="spinner"
      part="spinner"
      role="status"
      aria-label=${this.accessibleLabel}
    ></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-spinner': PsSpinner;
  }
}
