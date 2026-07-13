import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A page navigation control. @csspart nav - Navigation. @csspart button - Page buttons. */
@customElement('ps-pagination')
export class PsPagination extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .nav {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.4rem;
      }
      button {
        display: grid;
        place-items: center;
        min-width: 2.45rem;
        height: 2.45rem;
        padding: 0.35rem;
        border: 2px solid var(--ps-color-border);
        border-radius: var(--ps-radius-sm);
        background: var(--ps-color-surface);
        color: inherit;
        font-weight: 850;
        cursor: pointer;
        box-shadow: var(--ps-shadow-sm);
      }
      button[aria-current='page'] {
        background: var(--ps-color-primary);
        color: var(--ps-color-primary-contrast);
      }
    `,
  ];
  @property({ type: Number }) page = 1;
  @property({ type: Number }) count = 1;
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Pagination';
  private go(page: number): void {
    const next = Math.max(1, Math.min(this.count, page));
    if (next === this.page) return;
    this.page = next;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { page: next }, bubbles: true, composed: true }),
    );
  }
  override render() {
    const pages = Array.from(
      { length: Math.max(1, Math.min(this.count, 9)) },
      (_, index) => index + 1,
    );
    return html`<nav class="nav" part="nav" aria-label=${this.accessibleLabel}>
      <button
        part="button"
        type="button"
        aria-label="Previous page"
        ?disabled=${this.page <= 1}
        @click=${() => this.go(this.page - 1)}
      >
        ‹</button
      >${pages.map((page) => html`<button part="button" type="button" aria-label=${`Page ${page}`} aria-current=${page === this.page ? 'page' : undefined} @click=${() => this.go(page)}>${page}</button>`)}<button
        part="button"
        type="button"
        aria-label="Next page"
        ?disabled=${this.page >= this.count}
        @click=${() => this.go(this.page + 1)}
      >
        ›
      </button>
    </nav>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-pagination': PsPagination;
  }
}
