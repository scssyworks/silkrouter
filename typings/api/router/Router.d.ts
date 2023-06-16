/**
 * Browser router to handle routing logic
 */
export class Router extends RouterCore {
    /**
     * Router constructor
     * @typedef {import('./types').RouterConfig} RouterConfig
     * @param {RouterConfig} config
     */
    constructor(config: import("./types").RouterConfig);
    config: Readonly<{
        init: boolean;
        hashRouting: boolean;
        preservePath: boolean;
        context: HTMLElement;
        history: History;
        location: Location;
    }>;
    /**
     * Sets the current route path
     * @typedef {import('../set/types').RouteConfig} RouteConfig
     * @param {string} path Route path
     * @param {RouteConfig} routeConfig Route config
     */
    set(path: string, routeConfig: import("../set/types").RouteConfig): void;
}
import { RouterCore } from './RouterCore';
