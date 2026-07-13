import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { FeedbackVariant } from '../types.js';

/** A prominent feedback message. @slot icon - Icon. @slot heading - Heading. @slot - Message. @csspart base - Alert. @csspart close-button - Close button. */
@customElement('ps-alert')
export class PsAlert extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .alert {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 0.75rem;
        align-items: start;
        padding: 1rem;
        border: 2px solid var(--ps-color-border);
        border-left: 8px solid var(--ps-color-secondary);
        border-radius: var(--ps-radius-md);
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-md);
      }
      :host([variant='success']) .alert {
        border-left-color: var(--ps-color-success);
      }
      :host([variant='warning']) .alert {
        border-left-color: var(--ps-color-warning);
      }
      :host([variant='danger']) .alert {
        border-left-color: var(--ps-color-danger);
      }
      .heading {
        font-weight: 900;
      }
      .heading:empty {
        display: none;
      }
      button {
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 1.4rem;
        cursor: pointer;
      }
    `,
  ];
  @property({ reflect: true }) variant: FeedbackVariant = 'info';
  @property({ type: Boolean, reflect: true }) closable = false;
  private close(): void {
    this.dispatchEvent(new CustomEvent('close', { detail: {}, bubbles: true, composed: true }));
    this.remove();
  }
  override render() {
    const live = this.variant === 'danger' ? 'assertive' : 'polite';
    return html`<div
      class="alert"
      part="base"
      role=${this.variant === 'danger' ? 'alert' : 'status'}
      aria-live=${live}
    >
      <slot name="icon">◆</slot>
      <div>
        <div class="heading" part="heading"><slot name="heading"></slot></div>
        <slot></slot>
      </div>
      ${this.closable ? html`<button part="close-button" aria-label="Close" @click=${this.close}>×</button>` : ''}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-alert': PsAlert;
  }
}
