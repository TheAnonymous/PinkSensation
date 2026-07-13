import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** Groups related buttons. @slot - Buttons. @csspart group - Group wrapper. */
@customElement('ps-button-group')
export class PsButtonGroup extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }
      .group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }
    `,
  ];
  @property() label = 'Button group';
  override render() {
    return html`<div class="group" part="group" role="group" aria-label=${this.label}>
      <slot></slot>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-button-group': PsButtonGroup;
  }
}
