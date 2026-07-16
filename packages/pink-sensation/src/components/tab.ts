import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A tab trigger used inside ps-tabs. @slot - Label. @csspart tab - Native tab button. */
@customElement('ps-tab')
export class PsTab extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: var(--ps-radius-sm) var(--ps-radius-sm) 0 0;
      }
      :host(:focus-visible) {
        outline: 3px solid var(--ps-color-focus);
        outline-offset: 3px;
      }
      :host([active]) {
        border-color: var(--ps-color-border);
        border-bottom-color: var(--ps-color-surface);
        background: linear-gradient(
          180deg,
          var(--ps-color-surface-raised),
          var(--ps-color-surface)
        );
        color: var(--ps-color-primary-text);
        box-shadow: inset 0 2px 0 color-mix(in srgb, white 65%, transparent);
      }
      .tab {
        display: block;
        min-height: 2.65rem;
        padding: 0.55rem 0.9rem;
        font-weight: 850;
      }
    `,
  ];
  @property() value = '';
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number, attribute: false }) focusIndex = -1;
  @property({ attribute: false }) panelId = '';
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
  }
  override focus(options?: FocusOptions): void {
    HTMLElement.prototype.focus.call(this, options);
  }
  private select(): void {
    if (!this.disabled)
      this.dispatchEvent(
        new CustomEvent('ps-tab-select', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
  }
  protected override updated(): void {
    this.tabIndex = this.disabled ? -1 : this.focusIndex;
    this.setAttribute('aria-selected', String(this.active));
    this.setAttribute('aria-disabled', String(this.disabled));
    if (this.panelId) this.setAttribute('aria-controls', this.panelId);
    else this.removeAttribute('aria-controls');
  }
  override render() {
    return html`<span class="tab" part="tab" @click=${this.select}><slot></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-tab': PsTab;
  }
}
