import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A focus-trapped side panel. @slot heading - Heading. @slot - Body. @slot footer - Actions. @csspart backdrop - Backdrop. @csspart panel - Panel. */
@customElement('ps-drawer')
export class PsDrawer extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        position: fixed;
        z-index: 900;
        inset: 0;
        display: block;
        pointer-events: none;
      }
      :host(:not([open])) {
        visibility: hidden;
      }
      .backdrop {
        position: absolute;
        inset: 0;
        background: rgb(20 7 31 / 65%);
        opacity: 0;
        transition: opacity var(--ps-duration-normal);
      }
      .panel {
        position: absolute;
        inset-block: 0;
        right: 0;
        display: grid;
        grid-template-rows: auto 1fr auto;
        width: min(26rem, 90vw);
        border-left: 2px solid var(--ps-color-border);
        background: linear-gradient(
          145deg,
          var(--ps-color-surface),
          var(--ps-color-surface-raised)
        );
        box-shadow: var(--ps-shadow-lg);
        transform: translateX(102%);
        transition: transform var(--ps-duration-normal);
      }
      :host([placement='start']) .panel {
        right: auto;
        left: 0;
        border-right: 2px solid var(--ps-color-border);
        border-left: 0;
        transform: translateX(-102%);
      }
      :host([open]) {
        pointer-events: auto;
        visibility: visible;
      }
      :host([open]) .backdrop {
        opacity: 1;
      }
      :host([open]) .panel {
        transform: translateX(0);
      }
      header,
      footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 2px solid var(--ps-color-border);
        background: linear-gradient(
          110deg,
          var(--ps-color-surface-raised),
          color-mix(in srgb, var(--ps-color-primary) 28%, var(--ps-color-surface-raised))
        );
      }
      footer {
        border-top: 2px solid var(--ps-color-border);
        border-bottom: 0;
      }
      .body {
        overflow: auto;
        padding: 1rem;
      }
      h2 {
        margin: 0;
        font: 1.5rem var(--ps-font-display);
      }
      button {
        border: 2px solid var(--ps-color-border);
        border-radius: 50%;
        background: var(--ps-color-surface);
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) placement: 'start' | 'end' = 'end';
  @property() label = 'Drawer';
  @query('.panel') private panel!: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  async show(): Promise<void> {
    if (this.open) return;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.open = true;
    await this.updateComplete;
    this.panel.querySelector<HTMLElement>('button,[href],[tabindex="0"]')?.focus();
  }
  hide(): void {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { detail: {}, bubbles: true, composed: true }));
    this.previouslyFocused?.focus();
  }
  private cancel(): void {
    const allowed = this.dispatchEvent(
      new Event('cancel', { bubbles: true, composed: true, cancelable: true }),
    );
    if (allowed) this.hide();
  }
  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }
    if (event.key !== 'Tab') return;
    const nodes = [
      ...this.renderRoot.querySelectorAll<HTMLElement>(
        'button,[href],[tabindex]:not([tabindex="-1"])',
      ),
    ].filter((node) => !node.hasAttribute('disabled'));
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes.at(-1);
    const active = this.shadowRoot?.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  override render() {
    return html`<div class="backdrop" part="backdrop" @click=${this.cancel}></div>
      <aside
        class="panel"
        part="panel"
        role="dialog"
        aria-modal="true"
        aria-label=${this.label}
        @keydown=${this.onKeydown}
      >
        <header part="header">
          <h2><slot name="heading">${this.label}</slot></h2>
          <button part="close-button" type="button" aria-label="Close drawer" @click=${this.hide}>
            ×
          </button>
        </header>
        <div class="body" part="body"><slot></slot></div>
        <footer part="footer"><slot name="footer"></slot></footer>
      </aside>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-drawer': PsDrawer;
  }
}
