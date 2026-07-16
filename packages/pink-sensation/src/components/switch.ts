import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PsCheckbox } from './checkbox.js';
import { hostStyles } from '../internal/styles.js';

/** A form-associated on/off switch. @slot - Label. @csspart control - Switch track. @csspart label - Label. */
@customElement('ps-switch')
export class PsSwitch extends PsCheckbox {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }
      .label {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        font-weight: 750;
        cursor: pointer;
      }
      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      .box {
        position: relative;
        width: 2.8rem;
        height: 1.5rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 99px;
        background: var(--ps-color-muted);
        box-shadow: var(--ps-shadow-sm);
        transition:
          background var(--ps-duration-fast) ease,
          transform var(--ps-duration-normal) var(--ps-ease-pop, ease-out),
          box-shadow var(--ps-duration-normal) var(--ps-ease-pop, ease-out);
      }
      .mark {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 0 rgb(0 0 0 / 18%);
        transition:
          transform var(--ps-duration-normal) var(--ps-ease-pop, ease-out),
          box-shadow var(--ps-duration-fast) ease;
        font-size: 0;
      }
      .box[data-checked] {
        background: linear-gradient(
          90deg,
          var(--ps-color-primary),
          color-mix(in srgb, var(--ps-color-primary) 58%, var(--ps-color-secondary))
        );
        box-shadow:
          var(--ps-shadow-sm),
          0 0 0 0.2rem color-mix(in srgb, var(--ps-color-primary) 16%, transparent);
        transform: rotate(-1deg) scale(1.03);
      }
      .box[data-checked] .mark {
        box-shadow: -0.2rem 0 0 color-mix(in srgb, white 36%, transparent);
        transform: translateX(1.25rem) rotate(180deg) scale(1.08);
      }
      input:focus-visible + .box {
        outline: 3px solid var(--ps-color-focus);
        outline-offset: 3px;
      }
    `,
  ];
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-switch': PsSwitch;
  }
}
