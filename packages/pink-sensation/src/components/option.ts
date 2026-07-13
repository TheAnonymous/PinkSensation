import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** An option consumed by ps-select. @slot - Option label. */
@customElement('ps-option')
export class PsOption extends LitElement {
  @property() value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  get label(): string {
    return this.textContent?.trim() || this.value;
  }
  override render() {
    return html`<slot></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-option': PsOption;
  }
}
