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
