import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { ComponentSize } from '../types.js';
import { validSize } from '../types.js';

/** An image or initials avatar. @slot - Fallback content. @csspart image - Image. @csspart fallback - Fallback. */
@customElement('ps-avatar')
export class PsAvatar extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-grid;
        vertical-align: middle;
      }
      .avatar {
        display: grid;
        place-items: center;
        width: 2.75rem;
        height: 2.75rem;
        overflow: hidden;
        border: 2px solid var(--ps-color-border);
        border-radius: 50%;
        background: var(--ps-color-secondary);
        color: #fff;
        box-shadow: var(--ps-shadow-sm);
        font-weight: 900;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      :host([size='sm']) .avatar {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
      }
      :host([size='lg']) .avatar {
        width: 4rem;
        height: 4rem;
        font-size: 1.25rem;
      }
    `,
  ];
  @property() src = '';
  @property() alt = '';
  @property({ reflect: true }) size: ComponentSize = 'md';
  private failed = false;
  override render() {
    const size = validSize(this.size);
    if (size !== this.size) queueMicrotask(() => (this.size = size));
    return html`<span class="avatar"
      >${
        this.src && !this.failed
          ? html`<img
              part="image"
              src=${this.src}
              alt=${this.alt}
              @error=${() => {
                this.failed = true;
                this.requestUpdate();
              }}
            />`
          : html`<span part="fallback" aria-label=${this.alt}
              ><slot>${this.alt.slice(0, 2).toUpperCase()}</slot></span
            >`
      }</span
    >`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-avatar': PsAvatar;
  }
}
