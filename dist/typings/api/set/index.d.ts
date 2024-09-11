/**
 * Sets the current route
 * @private
 * @typedef {import('./types').RouteConfig} RouteConfig
 * @param {string} routeStr Route string
 * @param {RouteConfig} [rConfig] Route config
 */
export default function set(routeStr: string, rConfig?: RouteConfig): void;
/**
 * Sets the current route
 */
export type RouteConfig = import("./types").RouteConfig;
