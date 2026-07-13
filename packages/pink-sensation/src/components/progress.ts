import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';

/** A determinate or indeterminate progress bar. @csspart track - Track. @csspart indicator - Indicator. */
@customElement('ps-progress')
export class PsProgress extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .track {
        height: 1rem;
        overflow: hidden;
        border: 2px solid var(--ps-color-border);
        border-radius: 99px;
        background: var(--ps-color-surface-raised);
        box-shadow: inset 0 2px 4px color-mix(in srgb, var(--ps-color-border) 24%, transparent);
      }
      .indicator {
        height: 100%;
        background: linear-gradient(
          90deg,
          var(--ps-color-primary),
          var(--ps-color-secondary),
          var(--ps-color-accent)
        );
        box-shadow: inset 0 2px 0 color-mix(in srgb, white 55%, transparent);
        transition: width var(--ps-duration-normal);
      }
      :host([indeterminate]) .indicator {
        width: 40% !important;
        animation: travel 1.2s ease-in-out infinite alternate;
      }
      @keyframes travel {
        from {
          transform: translateX(-20%);
        }
        to {
          transform: translateX(170%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host([indeterminate]) .indicator {
          animation: none;
          width: 100% !important;
          opacity: 0.65;
        }
      }
    `,
  ];
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ attribute: 'aria-label' }) accessibleLabel = 'Progress';
  override render() {
    const percent = Math.min(100, Math.max(0, (this.value / Math.max(1, this.max)) * 100));
    return html`<div
      class="track"
      part="track"
      role="progressbar"
      aria-label=${this.accessibleLabel}
      aria-valuemin="0"
      aria-valuemax=${this.max}
      aria-valuenow=${this.indeterminate ? undefined : this.value}
    >
      <div class="indicator" part="indicator" style=${`width:${percent}%`}></div>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-progress': PsProgress;
  }
}
