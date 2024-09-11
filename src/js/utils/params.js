import { EMPTY, REG_ROUTE_PARAMS } from '../constants';

/**
 * Parses current path and returns params object
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {{[key: string]: any}}
 */
export function resolveParams(expr, path) {
  const params = {};
  if (REG_ROUTE_PARAMS.test(expr)) {
    const pathRegex = new RegExp(
      expr.replace(/\//g, '\\/').replace(/:[^/\\]+/g, '([^\\/]+)'),
    );
    REG_ROUTE_PARAMS.lastIndex = 0;
    if (pathRegex.test(path)) {
      const keys = Array.from(expr.match(REG_ROUTE_PARAMS)).map(key =>
        key.replace(':', EMPTY),
      );
      const values = Array.from(path.match(pathRegex));
      values.shift();
      keys.forEach((key, index) => {
        params[key] = values[index];
      });
    }
  }
  return params;
}
