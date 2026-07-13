import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PsButton } from './button.js';
import { hostStyles } from '../internal/styles.js';

/** A square icon-only action. An accessible label is required. @slot - Icon. @csspart button - Native button. */
@customElement('ps-icon-button')
export class PsIconButton extends PsButton {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }
      button {
        display: grid;
        place-items: center;
        width: 2.75rem;
        height: 2.75rem;
        padding: 0;
        border: 2px solid var(--ps-color-border);
        border-radius: 50%;
        background: var(--ps-color-primary);
        color: var(--ps-color-primary-contrast);
        box-shadow: var(--ps-shadow-md);
        cursor: pointer;
        transition: transform var(--ps-duration-fast);
      }
      button:hover:not(:disabled) {
        transform: translateY(-2px) rotate(-3deg);
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
        background: transparent;
        color: var(--ps-color-primary);
        box-shadow: none;
        border-color: transparent;
      }
      :host([size='sm']) button {
        width: 2.25rem;
        height: 2.25rem;
      }
      :host([size='lg']) button {
        width: 3.25rem;
        height: 3.25rem;
        font-size: 1.25rem;
      }
    `,
  ];
  @property({ attribute: 'label' }) label = '';

  override render() {
    return html`<button
      part="button"
      type="button"
      aria-label=${this.label || 'Action'}
      ?disabled=${this.disabled}
      @click=${this.activate}
    >
      <slot></slot>
    </button>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-icon-button': PsIconButton;
  }
}
