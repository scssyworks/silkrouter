export function getWindow() {
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return window;
  }
  return;
}
