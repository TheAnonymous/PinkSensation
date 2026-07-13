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
        transition: background var(--ps-duration-fast);
      }
      .mark {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #fff;
        transition: transform var(--ps-duration-fast);
        font-size: 0;
      }
      .box[data-checked] {
        background: var(--ps-color-primary);
      }
      .box[data-checked] .mark {
        transform: translateX(1.25rem);
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
