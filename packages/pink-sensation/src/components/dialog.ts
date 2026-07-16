import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A modal dialog with focus trapping and restoration. @slot heading - Heading. @slot - Body. @slot footer - Actions. @csspart dialog - Native dialog. @csspart close-button - Close button. */
@customElement('ps-dialog')
export class PsDialog extends LitElement {
  static override styles = [
    hostStyles,
    css`
      dialog {
        width: min(36rem, calc(100vw - 2rem));
        max-height: calc(100vh - 2rem);
        padding: 0;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-lg);
        background: linear-gradient(
          145deg,
          var(--ps-color-surface),
          var(--ps-color-surface-raised)
        );
        color: var(--ps-color-text);
        box-shadow: var(--ps-shadow-lg);
      }
      dialog::backdrop {
        background: rgb(20 7 31 / 68%);
        backdrop-filter: blur(3px);
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-bottom: 2px solid var(--ps-color-border);
        background: linear-gradient(
          110deg,
          var(--ps-color-surface-raised),
          color-mix(in srgb, var(--ps-color-primary) 28%, var(--ps-color-surface-raised))
        );
      }
      h2 {
        margin: 0;
        font: 1.6rem var(--ps-font-display);
      }
      .body {
        padding: 1.25rem;
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-top: 2px solid var(--ps-color-border);
      }
      button {
        display: grid;
        place-items: center;
        width: 2.3rem;
        height: 2.3rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 50%;
        background: var(--ps-color-surface);
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform var(--ps-duration-normal) var(--ps-ease-pop, ease-out);
      }
      button:hover {
        transform: rotate(8deg) scale(1.08);
      }
      button:active {
        transform: rotate(-4deg) scale(0.94);
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property() returnValue = '';
  @property() label = 'Dialog';
  @query('dialog') private dialogElement!: HTMLDialogElement;
  private previouslyFocused: HTMLElement | null = null;
  async showModal(): Promise<void> {
    if (this.open) return;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.open = true;
    await this.updateComplete;
    this.dialogElement.showModal();
  }
  close(returnValue = ''): void {
    this.returnValue = returnValue;
    if (this.dialogElement?.open) this.dialogElement.close(returnValue);
    else this.finishClose();
  }
  private finishClose(): void {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('close', {
        detail: { returnValue: this.returnValue },
        bubbles: true,
        composed: true,
      }),
    );
    this.previouslyFocused?.focus();
  }
  private onNativeClose(event: Event): void {
    event.stopPropagation();
    this.returnValue = this.dialogElement.returnValue;
    this.finishClose();
  }
  private onCancel(event: Event): void {
    event.preventDefault();
    const allowed = this.dispatchEvent(
      new Event('cancel', { bubbles: true, composed: true, cancelable: true }),
    );
    if (allowed) this.close();
  }
  protected override updated(): void {
    if (!this.open && this.dialogElement?.open) this.dialogElement.close(this.returnValue);
  }
  override render() {
    return html`<dialog
      part="dialog"
      aria-label=${this.label}
      @close=${this.onNativeClose}
      @cancel=${this.onCancel}
    >
      <header class="header" part="header">
        <h2><slot name="heading">${this.label}</slot></h2>
        <button
          part="close-button"
          type="button"
          aria-label="Close dialog"
          @click=${() => this.close()}
        >
          ×
        </button>
      </header>
      <div class="body" part="body"><slot></slot></div>
      <footer class="footer" part="footer"><slot name="footer"></slot></footer>
    </dialog>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-dialog': PsDialog;
  }
}
