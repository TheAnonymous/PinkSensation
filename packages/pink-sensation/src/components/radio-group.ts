import { css, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { PsFormControl } from '../internal/form-control.js';
import { hostStyles } from '../internal/styles.js';
import type { PropertyValues } from 'lit';
import type { PsRadio } from './radio.js';
import './radio.js';

/** A form-associated, keyboard-complete radio group. @slot - ps-radio elements. @csspart group - Group wrapper. */
@customElement('ps-radio-group')
export class PsRadioGroup extends PsFormControl {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .group {
        display: grid;
        gap: 0.45rem;
      }
    `,
  ];
  @property({ attribute: 'aria-label' }) accessibleLabel = '';
  @property() orientation: 'horizontal' | 'vertical' = 'vertical';
  @queryAssignedElements({ selector: 'ps-radio' }) private radios!: PsRadio[];
  private available(): PsRadio[] {
    return (this.radios ?? []).filter((radio) => !radio.disabled);
  }
  private syncRadios(): void {
    const available = this.available();
    let active = available.find((radio) => radio.value === this.value) ?? available[0];
    if (!this.value && active?.checked) this.value = active.value;
    active = available.find((radio) => radio.value === this.value) ?? active;
    for (const radio of this.radios ?? []) {
      radio.checked = radio.value === this.value;
      radio.focusIndex = radio === active ? 0 : -1;
    }
  }
  private onSlotChange(): void {
    this.syncRadios();
    this.syncFormValue();
  }
  private onSelect(event: CustomEvent<{ value: string }>): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.setValue(event.detail.value, false);
    this.syncRadios();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  private onKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(event.key)) return;
    const radios = this.available();
    if (!radios.length) return;
    event.preventDefault();
    const current = radios.findIndex((radio) => radio === event.composedPath()[0] || radio.checked);
    const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const next = radios[(Math.max(0, current) + delta + radios.length) % radios.length];
    if (!next) return;
    this.setValue(next.value, false);
    this.syncRadios();
    next.focus();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has('value') || changed.has('disabled')) this.syncRadios();
  }
  override render() {
    return html`<div
      class="group"
      part="group"
      role="radiogroup"
      aria-label=${this.accessibleLabel || this.name || 'Options'}
      aria-orientation=${this.orientation}
      @ps-radio-select=${this.onSelect}
      @keydown=${this.onKeydown}
    >
      <slot @slotchange=${this.onSlotChange}></slot>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-radio-group': PsRadioGroup;
  }
}
