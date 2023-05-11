import { assign } from '../../utils/assign';
import set from '../set';
import { getGlobal } from '../../utils/getGlobal';
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
    const global = getGlobal();
    const { history, location, document } = global;
    const context = document.body;
    super({
      global,
      history,
      location,
      context,
      hash: config.hashRouting,
    });
    this.config = Object.freeze(
      assign({ init: true, hashRouting: false, preservePath: false }, config, {
        context,
        history,
        location,
      })
    );
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
