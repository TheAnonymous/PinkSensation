import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { ToastOptions } from '../types.js';
import { PsToast } from './toast.js';

/** A live region that manages toasts. @slot - ps-toast elements. @csspart stack - Stack. */
@customElement('ps-toast-stack')
export class PsToastStack extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        position: fixed;
        z-index: 1000;
        right: 1rem;
        bottom: 1rem;
        max-width: calc(100vw - 2rem);
      }
      .stack {
        display: grid;
        gap: 0.75rem;
      }
    `,
  ];
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Notifications';
  push(options: ToastOptions): PsToast {
    const toast = new PsToast();
    toast.variant = options.variant ?? 'info';
    toast.duration = options.duration ?? 5000;
    toast.closable = options.closable ?? true;
    if (options.title) {
      const title = document.createElement('span');
      title.slot = 'title';
      title.textContent = options.title;
      toast.append(title);
    }
    toast.append(document.createTextNode(options.message));
    this.append(toast);
    return toast;
  }
  override render() {
    return html`<div
      class="stack"
      part="stack"
      role="region"
      aria-label=${this.accessibleLabel}
      aria-live="polite"
    >
      <slot></slot>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-toast-stack': PsToastStack;
  }
}
