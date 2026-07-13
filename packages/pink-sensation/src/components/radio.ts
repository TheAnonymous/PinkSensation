import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A radio option used inside ps-radio-group. @slot - Label. @csspart control - Radio circle. @csspart label - Label. */
@customElement('ps-radio')
export class PsRadio extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .radio {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        border: 0;
        background: none;
        padding: 0.25rem;
        color: inherit;
        font: inherit;
        font-weight: 750;
        cursor: pointer;
      }
      .dot {
        display: grid;
        place-items: center;
        width: 1.35rem;
        height: 1.35rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 50%;
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-sm);
      }
      .dot::after {
        content: '';
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 50%;
        background: var(--ps-color-primary);
        transform: scale(0);
        transition: transform var(--ps-duration-fast);
      }
      .radio[aria-checked='true'] .dot::after {
        transform: scale(1);
      }
    `,
  ];
  @property() value = '';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number, attribute: false }) focusIndex = -1;
  @query('button') private buttonElement!: HTMLButtonElement;
  override focus(options?: FocusOptions): void {
    this.buttonElement?.focus(options);
  }
  private select(): void {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('ps-radio-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
  override render() {
    return html`<button
      class="radio"
      part="label"
      type="button"
      role="radio"
      aria-checked=${this.checked}
      ?disabled=${this.disabled}
      tabindex=${this.focusIndex}
      @click=${this.select}
    >
      <span class="dot" part="control" aria-hidden="true"></span><slot></slot>
    </button>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-radio': PsRadio;
  }
}
