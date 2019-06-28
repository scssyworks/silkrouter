import { REG_ROUTE_PARAMS, REG_TRIM_SPECIALCHARS } from './constants';

/**
 * Helper functions to test and extract params
 */

/**
 * Tests if route has parameters
 * @private
 * @param {string} expr Route expression
 * @returns {boolean}
 */
export function hasParams(expr) {
    return REG_ROUTE_PARAMS.test(expr);
};

/**
 * Parses current path and returns params object
 * @private
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {object}
 */
export function extractParams(expr, path = window.location.pathname) {
    if (hasParams(expr)) {
        const pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
        const params = {};
        if (pathRegex.test(path)) {
            REG_ROUTE_PARAMS.lastIndex = 0;
            const keys = [...expr.match(REG_ROUTE_PARAMS)].map(key => key.replace(REG_TRIM_SPECIALCHARS, ''));
            const values = [...path.match(pathRegex)];
            values.shift();
            keys.forEach((key, index) => {
                params[key] = values[index];
            });
        }
        return params;
    }
    return {};
}