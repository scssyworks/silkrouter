/**
 * Router constants
 */
export const POP_STATE = 'popstate';
export const REG_ROUTE_PARAMS = /:[^/]+/g;
export const REG_PATHNAME = /^\/(?=[^?]*)/;
export const HISTORY_UNSUPPORTED =
  'History is not supported in this environment!';
export const INVALID_ROUTE = 'Route format is incorrect!';
export const VIRTUAL_PUSHSTATE = 'vpushstate';
export const QRY = '?';
export const EMPTY = '';
export const UNDEF = void 0;
export const TYPEOF_STR = typeof EMPTY;
export const TYPEOF_BOOL = typeof true;
export const TYPEOF_UNDEF = typeof UNDEF;
export const TYPEOF_FUNC = typeof (() => {});
export const STATE = 'State';
export const PUSH = `push${STATE}`;
export const REPLACE = `replace${STATE}`;
