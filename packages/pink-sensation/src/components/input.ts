import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PsFormControl } from '../internal/form-control.js';
import { controlStyles, hostStyles } from '../internal/styles.js';
import { validSize } from '../types.js';

/** A form-associated text input. @slot prefix - Leading content. @slot suffix - Trailing content. @csspart base - Wrapper. @csspart input - Native input. */
@customElement('ps-input')
export class PsInput extends PsFormControl {
  static override styles = [
    hostStyles,
    controlStyles,
    css`
      :host {
        display: block;
      }
      .base {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .control {
        flex: 1;
        min-width: 0;
      }
      .control[aria-invalid='true'] {
        border-color: var(--ps-color-danger);
      }
    `,
  ];
  @property() type: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' = 'text';
  @property() placeholder = '';
  @property({ attribute: 'autocomplete' }) autocomplete = '';
  @property({ attribute: 'aria-label' }) accessibleLabel = '';
  @query('input') private inputElement!: HTMLInputElement;

  override focus(options?: FocusOptions): void {
    this.inputElement?.focus(options);
  }
  select(): void {
    this.inputElement?.select();
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
    const size = validSize(this.size);
    if (size !== this.size) queueMicrotask(() => (this.size = size));
    return html`<div class="base" part="base">
      <slot name="prefix"></slot
      ><input
        class="control"
        part="input"
        .value=${this.value}
        type=${this.type}
        placeholder=${this.placeholder}
        autocomplete=${this.autocomplete}
        aria-label=${this.accessibleLabel || this.placeholder || this.name || 'Text input'}
        aria-invalid=${!this.validity.valid}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @input=${this.onInput}
        @change=${this.onChange}
      /><slot name="suffix"></slot>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-input': PsInput;
  }
}
