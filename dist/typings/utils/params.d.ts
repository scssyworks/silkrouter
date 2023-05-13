/**
 * Parses current path and returns params object
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {{[key: string]: any}}
 */
export function resolveParams(expr: string, path: string): {
    [key: string]: any;
};
