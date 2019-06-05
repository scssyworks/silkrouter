/**
 * Router constants
 */
export const HASH_CHANGE = 'hashchange';
export const POP_STATE = 'popstate';
export const ROUTE_CHANGED = 'route.changed';
export const REG_ROUTE_PARAMS = /:[^\/]+/g;
export const REG_PATHNAME = /^\/(?=[^?]*)/;
export const REG_HASH_QUERY = /\?.+/;
export const INVALID_ROUTE = 'Route string is not a pure route';