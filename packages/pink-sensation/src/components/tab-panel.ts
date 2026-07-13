import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A tab panel used inside ps-tabs. @slot - Panel content. @csspart panel - Panel. */
@customElement('ps-tab-panel')
export class PsTabPanel extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .panel {
        padding: 1rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 0 var(--ps-radius-md) var(--ps-radius-md);
        background: var(--ps-color-surface);
      }
      :host(:not([active])) {
        display: none;
      }
    `,
  ];
  @property() value = '';
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ attribute: false }) tabId = '';
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    this.tabIndex = 0;
  }
  protected override updated(): void {
    if (this.tabId) this.setAttribute('aria-labelledby', this.tabId);
    else this.removeAttribute('aria-labelledby');
  }
  override render() {
    return html`<div class="panel" part="panel"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-tab-panel': PsTabPanel;
  }
}
