import { EMPTY, REG_PATHNAME } from '../constants';

/**
 * Checks if input value is a string
 * @param {any} str String value
 * @returns {boolean}
 */
export function isString(str) {
  return typeof str === 'string';
}

/**
 * Safely trims string
 * @param {string} str String
 */
export function trim(str) {
  return isString(str) ? str.trim() : EMPTY;
}

/**
 * Checks if given route is valid
 * @private
 * @param {string} route Route string
 */
export function isValidRoute(route) {
  return REG_PATHNAME.test(route);
}
