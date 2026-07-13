import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A friendly zero-data message. @slot illustration - Illustration. @slot heading - Heading. @slot - Description. @slot actions - Actions. @csspart base - Container. */
@customElement('ps-empty-state')
export class PsEmptyState extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .empty {
        text-align: center;
        padding: 2rem;
        border: 2px dashed var(--ps-color-border);
        border-radius: var(--ps-radius-lg);
        background: var(--ps-color-surface-raised);
      }
      .illustration {
        font-size: 3rem;
      }
      .heading {
        margin: 0.5rem 0;
        font-family: var(--ps-font-display);
        font-size: 1.5rem;
      }
      .actions {
        margin-top: 1rem;
      }
    `,
  ];
  override render() {
    return html`<section class="empty" part="base">
      <div class="illustration" part="illustration"><slot name="illustration">✦</slot></div>
      <div class="heading" part="heading"><slot name="heading">Nothing here yet</slot></div>
      <div part="description"><slot></slot></div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </section>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-empty-state': PsEmptyState;
  }
}
