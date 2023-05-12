import set from '../set';
import { RouterCore } from './RouterCore';

/**
 * Browser router to handle routing logic
 */
export class Router extends RouterCore {
  /**
   * Router constructor
   * @typedef {import('./types').RouterConfig} RouterConfig
   * @param {RouterConfig} config
   */
  constructor(config = {}) {
    const { history, location, document } = RouterCore.global;
    const context = document.body;
    super({
      history,
      location,
      context,
      hash: config.hashRouting,
    });
    this.config = Object.freeze({
      init: true,
      hashRouting: false,
      preservePath: false,
      context,
      history,
      location,
      ...config,
    });
    if (config.hashRouting && !location.hash) {
      this.set('/', {
        replace: true,
        preventDefault: true, // Don't execute route handlers
      });
    }
  }
  /**
   * Sets the current route path
   * @typedef {import('../set/types').RouteConfig} RouteConfig
   * @param {string} path Route path
   * @param {RouteConfig} routeConfig Route config
   */
  set(path, routeConfig) {
    set.apply(this, [path, routeConfig]);
  }
}
