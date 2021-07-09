import { AMP, EMPTY, TYPEOF_FUNC, TYPEOF_STR } from './constants';
import { each, isArr, isObject } from './utils';

/**
 * Builds query string recursively
 * @private
 * @param {string[]} qsList List of query string key value pairs
 * @param {*} key Key
 * @param {*} obj Value
 */
function buildQuery(qsList, key, obj) {
  if (isObject(obj)) {
    each(obj, (prop, obKey) => {
      buildQuery(qsList, `${key}[${isArr(obj) ? EMPTY : obKey}]`, prop);
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
    each(obj, (prop, key) => {
      buildQuery(qsList, key, prop);
    });
    return qsList.join(AMP);
  }
  return typeof obj === TYPEOF_STR ? obj : EMPTY;
}
