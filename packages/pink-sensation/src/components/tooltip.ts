import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A hover and focus description. @slot - Trigger. @slot content - Tooltip content. @csspart tooltip - Tooltip bubble. */
@customElement('ps-tooltip')
export class PsTooltip extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        position: relative;
        display: inline-block;
      }
      .tooltip {
        position: absolute;
        z-index: 110;
        bottom: calc(100% + 0.55rem);
        left: 50%;
        width: max-content;
        max-width: 15rem;
        padding: 0.4rem 0.65rem;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-sm);
        background: var(--ps-color-text);
        color: var(--ps-color-bg);
        box-shadow: var(--ps-shadow-sm);
        font-size: 0.8rem;
        font-weight: 750;
        transform: translateX(-50%);
      }
      :host(:not([open])) .tooltip {
        display: none;
      }
      :host([placement='bottom']) .tooltip {
        top: calc(100% + 0.55rem);
        bottom: auto;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) placement: 'top' | 'bottom' = 'top';
  private show(): void {
    this.open = true;
  }
  private hide(): void {
    this.open = false;
  }
  override render() {
    return html`<span
        aria-describedby="tip"
        @pointerenter=${this.show}
        @pointerleave=${this.hide}
        @focusin=${this.show}
        @focusout=${this.hide}
        ><slot></slot></span
      ><span id="tip" class="tooltip" part="tooltip" role="tooltip"
        ><slot name="content"></slot
      ></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-tooltip': PsTooltip;
  }
}
