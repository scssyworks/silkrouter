/**
 * Router constants
 */
export const POP_STATE = 'popstate';
export const REG_ROUTE_PARAMS = /:[^/]+/g;
export const REG_PATHNAME = /^\/(?=[^?]*)/;
export const REG_COMPLEX = /\[/;
export const REG_VARIABLE = /([^[]+)\[([^[]*)\]/;
export const REG_REPLACE_BRACKETS = /\[([^[]*)\]/;
export const REG_REPLACE_NEXTPROP = /[^[]+/;
export const HISTORY_UNSUPPORTED =
  'Current browser does not support history object';
export const INVALID_ROUTE = 'Route string is not a pure route';
export const VIRTUAL_PUSHSTATE = 'vpushstate';
export const CACHED_FIELDS = [
  'route',
  'hashRouting',
  'path',
  'hash',
  'search',
  'hashSearch',
  'data',
];
export const AMP = '&';
export const QRY = '?';
export const EQ = '=';
export const EMPTY = '';
export const UNDEF = void 0;
export const TYPEOF_STR = typeof EMPTY;
export const TYPEOF_BOOL = typeof true;
export const TYPEOF_UNDEF = typeof UNDEF;
export const TYPEOF_OBJ = typeof {};
export const TYPEOF_NUM = typeof 0;
export const TYPEOF_FUNC = typeof (() => {});
export const STATE = 'State';
export const PUSH = `push${STATE}`;
export const REPLACE = `replace${STATE}`;
