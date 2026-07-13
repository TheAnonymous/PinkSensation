import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** Labels and describes a form control. @slot label - Label. @slot - Control. @slot help - Help text. @slot error - Error text. @csspart label - Label. @csspart help - Help. @csspart error - Error. */
@customElement('ps-field')
export class PsField extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: grid;
        gap: 0.4rem;
      }
      .label {
        font-weight: 850;
      }
      .help {
        color: var(--ps-color-muted);
        font-size: 0.875rem;
      }
      .error {
        color: var(--ps-color-danger);
        font-size: 0.875rem;
        font-weight: 750;
      }
      .error:empty,
      .help:empty {
        display: none;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) required = false;
  override render() {
    return html`<div class="label" part="label">
        <slot name="label"></slot>${this.required ? html` <span aria-hidden="true">*</span>` : ''}
      </div>
      <slot></slot>
      <div class="help" part="help"><slot name="help"></slot></div>
      <div class="error" part="error" role="alert"><slot name="error"></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-field': PsField;
  }
}
