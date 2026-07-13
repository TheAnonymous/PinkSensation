import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

export abstract class PsFormControl extends LitElement {
  static formAssociated = true;

  @property({ reflect: true }) name = '';
  @property() value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ reflect: true }) size = 'md';

  protected readonly internals: ElementInternals;
  protected defaultValue = '';

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get validity(): ValidityState {
    return this.internals.validity;
  }

  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.defaultValue = this.value;
    this.syncFormValue();
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('value') || changed.has('disabled') || changed.has('required'))
      this.syncFormValue();
  }

  protected syncFormValue(): void {
    this.internals.setFormValue(this.disabled ? null : this.value);
    const missing = this.required && !this.value;
    this.internals.setValidity(
      missing ? { valueMissing: true } : {},
      missing ? 'Please fill out this field.' : '',
    );
    this.internals.ariaDisabled = String(this.disabled);
  }

  protected setValue(value: string, emitInput = true): void {
    if (this.disabled || this.value === value) return;
    this.value = value;
    this.syncFormValue();
    if (emitInput) this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
    this.syncFormValue();
  }

  formResetCallback(): void {
    this.value = this.defaultValue;
    this.syncFormValue();
  }
}
