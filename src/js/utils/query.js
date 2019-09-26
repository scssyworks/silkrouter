import { isArr, isObject } from './utils';

/**
 * Builds query string recursively
 * @private
 * @param {string[]} queryStringParts List of query string key value pairs
 * @param {*} key Key
 * @param {*} obj Value
 */
function buildQueryString(queryStringParts, key, obj) {
    if (isObject(obj)) {
        const isCurrObjArray = isArr(obj);
        Object.keys(obj).forEach(obKey => {
            let qKey = isCurrObjArray ? '' : obKey;
            buildQueryString(queryStringParts, `${key}[${qKey}]`, obj[obKey]);
        });
    } else if (['string', 'number', 'boolean', 'undefined', 'object'].indexOf(typeof obj) > -1) {
        queryStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj)}`);
    }
}

/**
 * Converts an object to a query string
 * @private
 * @param {object} obj Object which should be converted to a string
 * @returns {string}
 */
export function toQueryString(obj) {
    let queryStringParts = [];
    if (isObject(obj)) {
        Object.keys(obj).forEach(key => {
            buildQueryString(queryStringParts, key, obj[key]);
        });
        return queryStringParts.join('&');
    } else if (typeof obj === 'string') {
        return obj;
    }
    return '';
}