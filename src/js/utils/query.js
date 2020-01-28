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
        Object.keys(obj).forEach(obKey => {
            buildQuery(qsList, `${key}[${isArr(obj) ? '' : obKey}]`, obj[obKey]);
        });
    } else if (typeof obj !== 'function') {
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
        Object.keys(obj).forEach(key => {
            buildQuery(qsList, key, obj[key]);
        });
        return qsList.join('&');
    }
    return typeof obj === 'string' ? obj : '';
}