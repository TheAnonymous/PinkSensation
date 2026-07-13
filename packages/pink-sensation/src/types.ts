export type ComponentSize = 'sm' | 'md' | 'lg';
export type ThemeName = 'bubblegum' | 'midnight' | 'pastel';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type FeedbackVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  message: string;
  title?: string;
  variant?: FeedbackVariant;
  duration?: number;
  closable?: boolean;
}

export interface PsEventMap {
  input: Event;
  change: Event;
  toggle: CustomEvent<{ open: boolean }>;
  close: CustomEvent<{ returnValue?: string }>;
  cancel: Event;
}

export const validSize = (
  value: string | null | undefined,
  fallback: ComponentSize = 'md',
): ComponentSize => (value === 'sm' || value === 'lg' || value === 'md' ? value : fallback);
