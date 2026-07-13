export function emit<T>(target: EventTarget, type: string, detail?: T): boolean {
  const event =
    detail === undefined
      ? new Event(type, { bubbles: true, composed: true, cancelable: type === 'cancel' })
      : new CustomEvent(type, {
          detail,
          bubbles: true,
          composed: true,
          cancelable: type === 'cancel',
        });
  return target.dispatchEvent(event);
}
