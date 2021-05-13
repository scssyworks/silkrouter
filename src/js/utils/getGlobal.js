export function getGlobal() {
  return typeof globalThis !== 'undefined' ? globalThis : global || self;
}
