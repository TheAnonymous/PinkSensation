import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** An anchored popup. @slot trigger - Trigger. @slot - Popup content. @csspart popup - Popup. */
@customElement('ps-dropdown')
export class PsDropdown extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        position: relative;
        display: inline-block;
      }
      .popup {
        position: absolute;
        z-index: 100;
        top: calc(100% + 0.55rem);
        left: 0;
        min-width: 12rem;
        padding: 0.5rem;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-md);
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-lg);
      }
      :host([placement='end']) .popup {
        right: 0;
        left: auto;
      }
      :host(:not([open])) .popup {
        display: none;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) placement: 'start' | 'end' = 'start';
  @query('.popup') private popup!: HTMLElement;
  private syncTrigger(): void {
    const trigger = this.querySelector<HTMLElement>('[slot="trigger"]');
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', String(this.open));
  }
  private outside = (event: PointerEvent) => {
    if (!event.composedPath().includes(this)) this.hide();
  };
  show(): void {
    if (this.open) return;
    this.open = true;
    this.syncTrigger();
    document.addEventListener('pointerdown', this.outside);
    queueMicrotask(() =>
      this.popup
        ?.querySelector<HTMLElement>('[role="menuitem"],button,[href],[tabindex="0"]')
        ?.focus(),
    );
  }
  hide(): void {
    if (!this.open) return;
    this.open = false;
    this.syncTrigger();
    document.removeEventListener('pointerdown', this.outside);
    this.dispatchEvent(new CustomEvent('close', { detail: {}, bubbles: true, composed: true }));
  }
  private toggle(): void {
    if (this.open) this.hide();
    else this.show();
  }
  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.hide();
      const trigger = this.querySelector<HTMLElement>('[slot="trigger"]');
      trigger?.focus();
    }
  }
  override disconnectedCallback(): void {
    document.removeEventListener('pointerdown', this.outside);
    super.disconnectedCallback();
  }
  protected override updated(): void {
    this.syncTrigger();
  }
  override render() {
    return html`<span @click=${this.toggle}
        ><slot name="trigger" @slotchange=${this.syncTrigger}></slot
      ></span>
      <div class="popup" part="popup" @keydown=${this.onKeydown}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-dropdown': PsDropdown;
  }
}
