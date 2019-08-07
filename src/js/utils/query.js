/**
 * Builds query string recursively
 * @private
 * @param {string[]} queryStringParts List of query string key value pairs
 * @param {*} key Key
 * @param {*} obj Value
 */
function buildQueryString(queryStringParts, key, obj) {
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(obKey => {
            buildQueryString(queryStringParts, `${key}[${obKey}]`, obj[obKey]);
        });
    } else if (['string', 'number', 'boolean', 'undefined', 'object'].indexOf(typeof obj) > -1) {
        queryStringParts.push(`${key}=${obj}`);
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
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            buildQueryString(queryStringParts, key, obj[key]);
        });
        return queryStringParts.join('&');
    } else if (typeof obj === 'string') {
        return obj;
    }
    return '';
}