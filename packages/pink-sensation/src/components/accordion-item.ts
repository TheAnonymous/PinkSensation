import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A disclosure section used inside ps-accordion. @slot summary - Trigger label. @slot - Content. @csspart summary - Summary. @csspart content - Content. */
@customElement('ps-accordion-item')
export class PsAccordionItem extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      details {
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-md);
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-sm);
        overflow: hidden;
      }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.85rem 1rem;
        font-weight: 900;
        cursor: pointer;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: '＋';
        color: var(--ps-color-primary);
        font-size: 1.25rem;
      }
      details[open] summary::after {
        content: '−';
      }
      .content {
        padding: 0 1rem 1rem;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  private onToggle(event: Event): void {
    const details = event.target as HTMLDetailsElement;
    if (this.disabled && details.open) {
      details.open = false;
      return;
    }
    this.open = details.open;
    this.dispatchEvent(
      new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true, composed: true }),
    );
  }
  override render() {
    return html`<details .open=${this.open} @toggle=${this.onToggle}>
      <summary part="summary" aria-disabled=${this.disabled}><slot name="summary"></slot></summary>
      <div class="content" part="content"><slot></slot></div>
    </details>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-accordion-item': PsAccordionItem;
  }
}
