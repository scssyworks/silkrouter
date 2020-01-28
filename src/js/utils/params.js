import { REG_ROUTE_PARAMS } from './constants';
import { loc } from './vars';

/**
 * Parses current path and returns params object
 * @private
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {object}
 */
export function extractParams(expr, path = loc.pathname) {
    const params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
        const pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^/\\]+/g, "([^\\/]+)"));
        REG_ROUTE_PARAMS.lastIndex = 0;
        if (pathRegex.test(path)) {
            const keys = [...expr.match(REG_ROUTE_PARAMS)].map(key => key.replace(':', ''));
            const values = [...path.match(pathRegex)];
            values.shift();
            keys.forEach((key, index) => {
                params[key] = values[index];
            });
        }
    }
    return params;
}