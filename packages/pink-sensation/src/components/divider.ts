import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A horizontal or vertical separator. @csspart divider - Separator line. */
@customElement('ps-divider')
export class PsDivider extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        margin: 1rem 0;
      }
      .divider {
        border-top: 2px solid var(--ps-color-border);
      }
      :host([orientation='vertical']) {
        display: inline-block;
        height: 2rem;
        margin: 0 1rem;
        vertical-align: middle;
      }
      .divider[aria-orientation='vertical'] {
        height: 100%;
        border-top: 0;
        border-left: 2px solid var(--ps-color-border);
      }
    `,
  ];
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  override render() {
    return html`<div
      class="divider"
      part="divider"
      role="separator"
      aria-orientation=${this.orientation}
    ></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-divider': PsDivider;
  }
}
