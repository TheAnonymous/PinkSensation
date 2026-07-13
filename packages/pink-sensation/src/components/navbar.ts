import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A responsive navigation shell. @slot brand - Brand. @slot - Navigation links. @slot actions - Actions. @csspart nav - Navigation. @csspart toggle - Mobile toggle. */
@customElement('ps-navbar')
export class PsNavbar extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .nav {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem 1rem;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-lg);
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-md);
      }
      .brand {
        font-family: var(--ps-font-display);
        font-size: 1.25rem;
      }
      .links {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-inline: auto;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
      }
      .toggle {
        display: none;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-sm);
        background: var(--ps-color-surface-raised);
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
      }
      @media (max-width: 46rem) {
        .nav {
          flex-wrap: wrap;
        }
        .toggle {
          display: block;
          margin-left: auto;
        }
        .links {
          display: none;
          order: 3;
          flex-basis: 100%;
          flex-direction: column;
          align-items: stretch;
          margin: 0;
          padding-top: 0.75rem;
        }
        .actions {
          display: none;
          flex-basis: 100%;
        }
        :host([open]) .links,
        :host([open]) .actions {
          display: flex;
        }
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: 'menu-label' }) menuLabel = 'Main navigation';
  private toggle(): void {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true, composed: true }),
    );
  }
  override render() {
    return html`<nav class="nav" part="nav" aria-label=${this.menuLabel}>
      <div class="brand" part="brand"><slot name="brand"></slot></div>
      <button
        class="toggle"
        part="toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded=${this.open}
        @click=${this.toggle}
      >
        ☰
      </button>
      <div class="links" part="links"><slot></slot></div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </nav>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-navbar': PsNavbar;
  }
}
