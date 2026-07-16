import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { FeedbackVariant } from '../types.js';

/** A temporary notification. @slot - Message. @slot title - Title. @csspart base - Toast. @csspart close-button - Close button. */
@customElement('ps-toast')
export class PsToast extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        transform-origin: right center;
        animation: arrive var(--ps-duration-slow, 480ms) var(--ps-ease-pop, ease-out);
      }
      .toast {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.75rem;
        min-width: min(22rem, calc(100vw - 2rem));
        padding: 0.9rem 1rem;
        border: 2px solid var(--ps-color-border);
        border-left: 8px solid var(--ps-color-secondary);
        border-radius: var(--ps-radius-md);
        background: linear-gradient(
          135deg,
          var(--ps-color-surface),
          color-mix(in srgb, var(--ps-color-surface-raised) 76%, var(--ps-color-primary))
        );
        box-shadow:
          inset 0 2px 0 color-mix(in srgb, white 66%, transparent),
          var(--ps-shadow-lg);
      }
      :host([variant='success']) .toast {
        border-left-color: var(--ps-color-success);
      }
      :host([variant='warning']) .toast {
        border-left-color: var(--ps-color-warning);
      }
      :host([variant='danger']) .toast {
        border-left-color: var(--ps-color-danger);
      }
      .title {
        font-weight: 900;
      }
      .title:empty {
        display: none;
      }
      button {
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 1.35rem;
        cursor: pointer;
        transition: transform var(--ps-duration-normal) var(--ps-ease-pop, ease-out);
      }
      button:hover {
        transform: rotate(9deg) scale(1.12);
      }
      @keyframes arrive {
        from {
          opacity: 0;
          transform: translateX(2rem) rotate(2deg) scale(0.92);
        }
        72% {
          transform: translateX(-0.2rem) rotate(-0.35deg) scale(1.015);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host {
          animation: none;
        }
      }
    `,
  ];
  @property({ reflect: true }) variant: FeedbackVariant = 'info';
  @property({ type: Number }) duration = 5000;
  @property({ type: Boolean }) closable = true;
  private timer?: number;
  override connectedCallback(): void {
    super.connectedCallback();
    if (this.duration > 0) this.timer = window.setTimeout(() => this.close(), this.duration);
  }
  override disconnectedCallback(): void {
    window.clearTimeout(this.timer);
    super.disconnectedCallback();
  }
  close(): void {
    this.dispatchEvent(new CustomEvent('close', { detail: {}, bubbles: true, composed: true }));
    this.remove();
  }
  override render() {
    return html`<div
      class="toast"
      part="base"
      role=${this.variant === 'danger' ? 'alert' : 'status'}
    >
      <div>
        <div class="title" part="title"><slot name="title"></slot></div>
        <slot></slot>
      </div>
      ${this.closable ? html`<button part="close-button" type="button" aria-label="Close notification" @click=${this.close}>×</button>` : ''}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-toast': PsToast;
  }
}
