import { css, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { PsFormControl } from '../internal/form-control.js';
import { controlStyles, hostStyles } from '../internal/styles.js';
import type { PsOption } from './option.js';
import './option.js';

/** A form-associated single-selection control. @slot - ps-option elements. @csspart select - Native select. */
@customElement('ps-select')
export class PsSelect extends PsFormControl {
  static override styles = [
    hostStyles,
    controlStyles,
    css`
      :host {
        display: block;
      }
      .control {
        appearance: auto;
      }
    `,
  ];
  @property() placeholder = 'Choose an option';
  @property({ attribute: 'aria-label' }) accessibleLabel = '';
  @queryAssignedElements({ selector: 'ps-option' }) private optionElements!: PsOption[];
  private options(): PsOption[] {
    return this.optionElements ?? [];
  }
  private onSlotChange(): void {
    const selected = this.options().find((option) => option.selected);
    if (!this.value && selected) this.value = selected.value;
    this.syncFormValue();
    this.requestUpdate();
  }
  private onChange(event: Event): void {
    event.stopPropagation();
    this.setValue((event.target as HTMLSelectElement).value, false);
    for (const option of this.options()) option.selected = option.value === this.value;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  override render() {
    return html`<select
        class="control"
        part="select"
        .value=${this.value}
        aria-label=${this.accessibleLabel || this.name || 'Select'}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @change=${this.onChange}
      >
        <option value="" ?disabled=${this.required}>${this.placeholder}</option>
        ${this.options().map((option) => html`<option value=${option.value} ?disabled=${option.disabled} ?selected=${option.value === this.value}>${option.label}</option>`)}</select
      ><slot hidden @slotchange=${this.onSlotChange}></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-select': PsSelect;
  }
}
