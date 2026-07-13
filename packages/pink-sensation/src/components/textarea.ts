import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PsFormControl } from '../internal/form-control.js';
import { controlStyles, hostStyles } from '../internal/styles.js';

/** A form-associated multiline input. @csspart textarea - Native textarea. */
@customElement('ps-textarea')
export class PsTextarea extends PsFormControl {
  static override styles = [
    hostStyles,
    controlStyles,
    css`
      :host {
        display: block;
      }
      .control {
        display: block;
        resize: vertical;
      }
    `,
  ];
  @property() placeholder = '';
  @property({ type: Number }) rows = 4;
  @property({ attribute: 'aria-label' }) accessibleLabel = '';
  @query('textarea') private textareaElement!: HTMLTextAreaElement;
  override focus(options?: FocusOptions): void {
    this.textareaElement?.focus(options);
  }
  select(): void {
    this.textareaElement?.select();
  }
  private onInput(event: Event): void {
    event.stopPropagation();
    this.setValue((event.target as HTMLTextAreaElement).value);
  }
  private onChange(event: Event): void {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  override render() {
    return html`<textarea
      class="control"
      part="textarea"
      .value=${this.value}
      rows=${this.rows}
      placeholder=${this.placeholder}
      aria-label=${this.accessibleLabel || this.placeholder || this.name || 'Text area'}
      ?required=${this.required}
      ?disabled=${this.disabled}
      @input=${this.onInput}
      @change=${this.onChange}
    ></textarea>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-textarea': PsTextarea;
  }
}
