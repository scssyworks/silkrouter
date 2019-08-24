import { REG_ROUTE_PARAMS, REG_TRIM_SPECIALCHARS } from './constants';

/**
 * Converts array like object to array
 * @param {any[]} arr Arraylike object
 */
function toArray(arr) {
    return Array.prototype.slice.call(arr);
}

/**
 * Parses current path and returns params object
 * @private
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {object}
 */
export function extractParams(expr, path = window.location.pathname) {
    if (REG_ROUTE_PARAMS.test(expr)) {
        const pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
        const params = {};
        if (pathRegex.test(path)) {
            REG_ROUTE_PARAMS.lastIndex = 0;
            const keys = [].concat(toArray(expr.match(REG_ROUTE_PARAMS))).map(key => key.replace(REG_TRIM_SPECIALCHARS, ''));
            const values = [].concat(toArray(path.match(pathRegex)));
            values.shift();
            keys.forEach((key, index) => {
                params[key] = values[index];
            });
        }
        return params;
    }
    return {};
}