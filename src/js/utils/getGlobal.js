import { TYPEOF_UNDEF } from './constants';

export function getGlobal() {
  return typeof globalThis !== TYPEOF_UNDEF ? globalThis : global || self;
}
