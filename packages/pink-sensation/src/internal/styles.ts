import { css } from 'lit';

export const hostStyles = css`
  :host {
    box-sizing: border-box;
    color: var(--ps-color-text, #29102d);
    font-family: var(--ps-font-body, system-ui, sans-serif);
    font-size: 1rem;
  }

  :host([hidden]) {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button,
  input,
  textarea,
  select {
    color: inherit;
    font: inherit;
  }

  button,
  [role='button'],
  input,
  textarea,
  select,
  [tabindex] {
    outline: none;
  }

  button:focus-visible,
  [role='button']:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible,
  [tabindex]:focus-visible {
    outline: 3px solid var(--ps-color-focus, #006b73);
    outline-offset: 3px;
  }

  button:disabled,
  input:disabled,
  textarea:disabled,
  select:disabled,
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.58;
  }
`;

export const controlStyles = css`
  .control {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.65rem 0.85rem;
    border: 2px solid var(--ps-color-border);
    border-radius: var(--ps-radius-md);
    background: linear-gradient(
      180deg,
      var(--ps-color-surface) 0 72%,
      color-mix(in srgb, var(--ps-color-surface-raised) 72%, var(--ps-color-primary)) 100%
    );
    box-shadow:
      inset 0 2px 0 color-mix(in srgb, white 82%, transparent),
      var(--ps-shadow-sm);
    transition:
      border-color var(--ps-duration-fast),
      box-shadow var(--ps-duration-fast);
  }

  .control:hover:not(:disabled) {
    border-color: var(--ps-color-primary);
    box-shadow:
      inset 0 2px 0 color-mix(in srgb, white 88%, transparent),
      0 4px 0 color-mix(in srgb, var(--ps-color-primary) 40%, transparent);
  }

  :host([size='sm']) .control {
    min-height: 2.25rem;
    padding: 0.45rem 0.65rem;
    font-size: 0.875rem;
  }

  :host([size='lg']) .control {
    min-height: 3.25rem;
    padding: 0.8rem 1rem;
    font-size: 1.125rem;
  }
`;
