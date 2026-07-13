import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A compact label that can be removable. @slot - Chip text. @slot prefix - Leading content. @csspart base - Chip. @csspart remove-button - Remove button. */
@customElement('ps-chip')
export class PsChip extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        min-height: 2rem;
        padding: 0.2rem 0.65rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 99px;
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ps-color-surface-raised) 65%, white),
          var(--ps-color-surface-raised)
        );
        font-size: 0.875rem;
        font-weight: 800;
        box-shadow: var(--ps-shadow-sm);
      }
      button {
        display: grid;
        place-items: center;
        width: 1.35rem;
        height: 1.35rem;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: var(--ps-color-primary);
        color: var(--ps-color-primary-contrast);
        cursor: pointer;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) removable = false;
  @property() removeLabel = 'Remove';
  private dismiss(): void {
    this.dispatchEvent(new CustomEvent('close', { detail: {}, bubbles: true, composed: true }));
  }
  override render() {
    return html`<span class="chip" part="base"
      ><slot name="prefix"></slot
      ><slot></slot
      >${this.removable ? html`<button part="remove-button" type="button" aria-label=${this.removeLabel} @click=${this.dismiss}>×</button>` : ''}</span
    >`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-chip': PsChip;
  }
}
