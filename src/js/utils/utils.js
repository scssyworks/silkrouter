import { EMPTY, REG_PATHNAME, TYPEOF_STR } from '../constants';

/**
 * Safely trims string
 * @param {string} str String
 */
export function trim(str) {
  return typeof str === TYPEOF_STR ? str.trim() : EMPTY;
}

/**
 * Checks if given route is valid
 * @private
 * @param {string} route Route string
 */
export function isValidRoute(route) {
  return REG_PATHNAME.test(route);
}
