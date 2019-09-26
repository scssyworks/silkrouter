import { REG_ROUTE_PARAMS } from './constants';
import { toArray, setDefault } from './utils';
import { loc } from './vars';

/**
 * Parses current path and returns params object
 * @private
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {object}
 */
export function extractParams(expr, path) {
    path = setDefault(path, loc.pathname);
    const params = {};
    let matchedKeys;
    let matchedValues;
    if (matchedKeys = REG_ROUTE_PARAMS.exec(expr)) {
        const pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
        REG_ROUTE_PARAMS.lastIndex = 0;
        if (matchedValues = pathRegex.exec(path)) {
            const keys = toArray(matchedKeys).map(key => key.replace(':', ''));
            const values = toArray(matchedValues);
            values.shift();
            keys.forEach((key, index) => {
                params[key] = values[index];
            });
        }
    }
    return params;
}