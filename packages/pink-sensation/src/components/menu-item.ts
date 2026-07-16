import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A command in ps-menu. @slot - Label. @slot prefix - Icon. @csspart item - Native button. */
@customElement('ps-menu-item')
export class PsMenuItem extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      button {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        width: 100%;
        padding: 0.6rem 0.7rem;
        border: 0;
        border-radius: var(--ps-radius-sm);
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
      }
      button:hover,
      button:focus-visible {
        background: var(--ps-color-surface-raised);
        color: var(--ps-color-primary-text);
      }
    `,
  ];
  @property() value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number, attribute: false }) focusIndex = -1;
  @query('button') private buttonElement!: HTMLButtonElement;
  override focus(options?: FocusOptions): void {
    this.buttonElement?.focus(options);
  }
  private select(): void {
    if (!this.disabled)
      this.dispatchEvent(
        new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true }),
      );
  }
  override render() {
    return html`<button
      part="item"
      type="button"
      role="menuitem"
      tabindex=${this.focusIndex}
      ?disabled=${this.disabled}
      @click=${this.select}
    >
      <slot name="prefix"></slot><slot></slot>
    </button>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-menu-item': PsMenuItem;
  }
}
