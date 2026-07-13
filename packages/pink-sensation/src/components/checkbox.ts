import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PsFormControl } from '../internal/form-control.js';
import { hostStyles } from '../internal/styles.js';

/** A form-associated checkbox. @slot - Label. @csspart control - Checkbox. @csspart label - Label. */
@customElement('ps-checkbox')
export class PsCheckbox extends PsFormControl {
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
      .box {
        display: grid;
        place-items: center;
        width: 1.35rem;
        height: 1.35rem;
        border: 2px solid var(--ps-color-border);
        border-radius: 0.35rem;
        background: var(--ps-color-surface);
        box-shadow: var(--ps-shadow-sm);
      }
      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      input:focus-visible + .box {
        outline: 3px solid var(--ps-color-focus);
        outline-offset: 3px;
      }
      .mark {
        opacity: 0;
        font-weight: 1000;
      }
      .box[data-checked] {
        background: var(--ps-color-primary);
        color: var(--ps-color-primary-contrast);
      }
      .box[data-checked] .mark {
        opacity: 1;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) checked = false;
  @query('input') private inputElement!: HTMLInputElement;
  private defaultChecked = false;
  override connectedCallback(): void {
    super.connectedCallback();
    this.defaultChecked = this.checked;
    this.syncFormValue();
  }
  protected override syncFormValue(): void {
    this.internals.setFormValue(this.disabled || !this.checked ? null : this.value || 'on');
    const missing = this.required && !this.checked;
    this.internals.setValidity(
      missing ? { valueMissing: true } : {},
      missing ? 'Please check this box.' : '',
    );
  }
  override formResetCallback(): void {
    this.checked = this.defaultChecked;
    this.syncFormValue();
  }
  override focus(options?: FocusOptions): void {
    this.inputElement?.focus(options);
  }
  private onChange(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.checked = (event.target as HTMLInputElement).checked;
    this.syncFormValue();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  override render() {
    return html`<label class="label" part="label"
      ><input
        type="checkbox"
        .checked=${this.checked}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @change=${this.onChange} /><span
        class="box"
        part="control"
        ?data-checked=${this.checked}
        aria-hidden="true"
        ><span class="mark">✓</span></span
      ><slot></slot
    ></label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-checkbox': PsCheckbox;
  }
}
