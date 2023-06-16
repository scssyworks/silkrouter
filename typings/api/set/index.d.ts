/**
 * Sets the current route
 * @private
 * @typedef {import('./types').RouteConfig} RouteConfig
 * @param {string} routeStr Route string
 * @param {RouteConfig} [routeConfig] Route config
 * @returns {void}
 */
export default function set(routeStr: string, routeConfig?: RouteConfig): void;
/**
 * Sets the current route
 */
export type RouteConfig = import('./types').RouteConfig;
