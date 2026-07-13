import { LitElement, css, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { hostStyles } from '../internal/styles.js';
import type { PsAccordionItem } from './accordion-item.js';
import './accordion-item.js';

/** Groups disclosure sections. @slot - ps-accordion-item elements. @csspart base - Accordion. */
@customElement('ps-accordion')
export class PsAccordion extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }
      .accordion {
        display: grid;
        gap: 0.75rem;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) multiple = false;
  @queryAssignedElements({ selector: 'ps-accordion-item' }) private items!: PsAccordionItem[];
  private onToggle(event: CustomEvent<{ open: boolean }>): void {
    if (this.multiple || !event.detail.open) return;
    for (const item of this.items ?? []) if (item !== event.target) item.open = false;
  }
  override render() {
    return html`<div class="accordion" part="base" @toggle=${this.onToggle}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ps-accordion': PsAccordion;
  }
}
