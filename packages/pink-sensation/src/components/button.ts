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
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-height: 2.75rem;
        padding: 0.62rem 1.1rem;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-md);
        background: var(--ps-color-primary);
        color: var(--ps-color-primary-contrast);
        box-shadow: var(--ps-shadow-md);
        cursor: pointer;
        font-weight: 850;
        letter-spacing: 0.01em;
        text-shadow: 0 1px 0 color-mix(in srgb, white 34%, transparent);
        transform: translateY(0);
        transition:
          transform var(--ps-duration-normal) var(--ps-ease-pop, ease-out),
          box-shadow var(--ps-duration-normal) var(--ps-ease-pop, ease-out);
      }
      button::before {
        content: '';
        position: absolute;
        inset: 3px 8px auto;
        height: 26%;
        border-radius: 99px;
        background: color-mix(in srgb, white 55%, transparent);
        opacity: 0.48;
        pointer-events: none;
      }
      button:hover:not(:disabled) {
        transform: translateY(-3px) rotate(-0.45deg) scale(1.015);
        box-shadow:
          0 9px 0 var(--ps-color-border),
          0 16px 28px color-mix(in srgb, var(--ps-color-primary) 28%, transparent);
      }
      button:active:not(:disabled) {
        transform: translateY(4px) scale(0.975);
        box-shadow: var(--ps-shadow-sm);
      }
      :host([variant='secondary']) button {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ps-color-secondary) 68%, white),
          var(--ps-color-secondary) 34% 74%,
          color-mix(in srgb, var(--ps-color-secondary) 72%, var(--ps-color-border))
        );
        color: #fff;
      }
      :host([variant='outline']) button {
        background: linear-gradient(
          180deg,
          var(--ps-color-surface),
          var(--ps-color-surface-raised)
        );
        color: var(--ps-color-primary-text);
      }
      :host([variant='ghost']) button {
        border-color: transparent;
        background: transparent;
        color: var(--ps-color-primary-text);
        box-shadow: none;
        text-shadow: none;
      }
      :host([variant='ghost']) button::before {
        display: none;
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
        transition: transform var(--ps-duration-normal) var(--ps-ease-pop, ease-out);
      }
      button:hover:not(:disabled) ::slotted([slot='prefix']) {
        transform: translateX(-0.12rem) rotate(-8deg);
      }
      button:hover:not(:disabled) ::slotted([slot='suffix']) {
        transform: translateX(0.18rem) rotate(5deg);
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
