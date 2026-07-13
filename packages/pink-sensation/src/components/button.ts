import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { ButtonVariant, ComponentSize } from '../types.js';
import { validSize } from '../types.js';

/** A chunky action button. @slot - Button label. @slot prefix - Leading icon. @slot suffix - Trailing icon. @csspart button - Native button. */
@customElement('ps-button')
export class PsButton extends LitElement {
  static formAssociated = true;
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-height: 2.75rem;
        padding: 0.62rem 1.1rem;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-sm);
        background: var(--ps-color-primary);
        color: var(--ps-color-primary-contrast);
        box-shadow: var(--ps-shadow-md);
        cursor: pointer;
        font-weight: 850;
        letter-spacing: 0.01em;
        transform: translateY(0);
        transition:
          transform var(--ps-duration-fast),
          box-shadow var(--ps-duration-fast);
      }
      button:hover:not(:disabled) {
        transform: translateY(-2px);
      }
      button:active:not(:disabled) {
        transform: translateY(4px);
        box-shadow: var(--ps-shadow-sm);
      }
      :host([variant='secondary']) button {
        background: var(--ps-color-secondary);
        color: #fff;
      }
      :host([variant='outline']) button {
        background: var(--ps-color-surface);
        color: var(--ps-color-primary);
      }
      :host([variant='ghost']) button {
        border-color: transparent;
        background: transparent;
        color: var(--ps-color-primary);
        box-shadow: none;
      }
      :host([size='sm']) button {
        min-height: 2.25rem;
        padding: 0.4rem 0.75rem;
        font-size: 0.875rem;
      }
      :host([size='lg']) button {
        min-height: 3.25rem;
        padding: 0.78rem 1.4rem;
        font-size: 1.125rem;
      }
      ::slotted([slot='prefix']),
      ::slotted([slot='suffix']) {
        line-height: 1;
      }
    `,
  ];

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ComponentSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

  protected readonly internals = this.attachInternals();

  protected activate(): void {
    if (this.disabled) return;
    if (this.type === 'submit') this.internals.form?.requestSubmit();
    if (this.type === 'reset') this.internals.form?.reset();
  }

  override render() {
    const size = validSize(this.size);
    if (size !== this.size) queueMicrotask(() => (this.size = size));
    return html`<button
      part="button"
      type="button"
      ?disabled=${this.disabled}
      @click=${this.activate}
    >
      <slot name="prefix"></slot><slot></slot><slot name="suffix"></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ps-button': PsButton;
  }
}
