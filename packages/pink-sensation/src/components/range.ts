import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PsFormControl } from '../internal/form-control.js';
import { hostStyles } from '../internal/styles.js';

/** A form-associated range slider. @csspart input - Native range. @csspart output - Current value. */
@customElement('ps-range')
export class PsRange extends PsFormControl {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      input {
        accent-color: var(--ps-color-primary);
        width: 100%;
        min-height: 2.5rem;
        cursor: pointer;
      }
      output {
        min-width: 3ch;
        font-weight: 900;
        color: var(--ps-color-primary-text);
      }
    `,
  ];
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ attribute: 'aria-label' }) accessibleLabel = '';
  @query('input') private inputElement!: HTMLInputElement;
  override focus(options?: FocusOptions): void {
    this.inputElement?.focus(options);
  }
  private onInput(event: Event): void {
    event.stopPropagation();
    this.setValue((event.target as HTMLInputElement).value);
  }
  private onChange(event: Event): void {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  override render() {
    return html`<input
        part="input"
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${this.value || String(this.min)}
        aria-label=${this.accessibleLabel || this.name || 'Range'}
        ?disabled=${this.disabled}
        @input=${this.onInput}
        @change=${this.onChange}
      /><output part="output">${this.value || this.min}</output>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-range': PsRange;
  }
}
