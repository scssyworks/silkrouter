import { AMP, EMPTY, TYPEOF_FUNC, TYPEOF_STR } from './constants';
import { isArr, isObject } from './utils';

/**
 * Builds query string recursively
 * @private
 * @param {string[]} qsList List of query string key value pairs
 * @param {*} key Key
 * @param {*} obj Value
 */
function buildQuery(qsList, key, obj) {
  if (isObject(obj)) {
    Object.keys(obj).forEach((obKey) => {
      buildQuery(qsList, `${key}[${isArr(obj) ? EMPTY : obKey}]`, obj[obKey]);
    });
  } else if (typeof obj !== TYPEOF_FUNC) {
    qsList.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj)}`);
  }
}

/**
 * Converts an object to a query string
 * @private
 * @param {object} obj Object which should be converted to a string
 * @returns {string}
 */
export function toQueryString(obj) {
  let qsList = [];
  if (isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      buildQuery(qsList, key, obj[key]);
    });
    return qsList.join(AMP);
  }
  return typeof obj === TYPEOF_STR ? obj : EMPTY;
}
