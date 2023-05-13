(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'rxjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.silkrouter = {}, global.rxjs));
})(this, (function (exports, rxjs) { 'use strict';

  /**
   * Router constants
   */
  const POP_STATE = 'popstate';
  const REG_ROUTE_PARAMS = /:[^/]+/g;
  const REG_PATHNAME = /^\/(?=[^?]*)/;
  const HISTORY_UNSUPPORTED = 'History is not supported in this environment!';
  const INVALID_ROUTE = 'Route format is incorrect!';
  const VIRTUAL_PUSHSTATE = 'vpushstate';
  const QRY = '?';
  const EMPTY = '';
  const UNDEF = void 0;
  const TYPEOF_STR = typeof EMPTY;
  const TYPEOF_UNDEF = typeof UNDEF;
  const TYPEOF_FUNC = typeof (() => {});
  const STATE = 'State';
  const PUSH = `push${STATE}`;
  const REPLACE = `replace${STATE}`;

  /**
   * Parses current path and returns params object
   * @param {string} expr Route expression
   * @param {string} path URL path
   * @returns {{[key: string]: any}}
   */
  function resolveParams(expr, path) {
    const params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
      const pathRegex = new RegExp(expr.replace(/\//g, '\\/').replace(/:[^/\\]+/g, '([^\\/]+)'));
      REG_ROUTE_PARAMS.lastIndex = 0;
      if (pathRegex.test(path)) {
        const keys = Array.from(expr.match(REG_ROUTE_PARAMS)).map(key => key.replace(':', EMPTY));
        const values = Array.from(path.match(pathRegex));
        values.shift();
        keys.forEach((key, index) => {
          params[key] = values[index];
        });
      }
    }
    return params;
  }

  var isObject = function isObject(x) {
  	return typeof x === 'object' && x !== null;
  };

  /**
   * Function to trigger custom event
   * @param {HTMLElement} context Context element
   * @param {string} eventType Event type
   * @param {any[]} data Data to be passed to handler
   */
  function trigger(context, eventType, data) {
    context.dispatchEvent(new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail: data || []
    }));
  }

  /**
   * Safely trims string
   * @param {string} str String
   */
  function trim(str) {
    return typeof str === TYPEOF_STR ? str.trim() : EMPTY;
  }

  /**
   * Checks if given route is valid
   * @private
   * @param {string} route Route string
   */
  function isValidRoute(route) {
    return REG_PATHNAME.test(route);
  }

  /**
   * Sets the current route
   * @private
   * @typedef {import('./types').RouteConfig} RouteConfig
   * @param {string} routeStr Route string
   * @param {RouteConfig} [routeConfig] Route config
   * @returns {void}
   */
  function set(routeStr, routeConfig) {
    routeConfig = isObject(routeConfig) ? routeConfig : {};
    const [route, qs] = routeStr.split(QRY);
    const {
      replace = false,
      preventDefault = false,
      queryString = qs,
      data,
      pageTitle = null
    } = routeConfig;
    const {
      preservePath,
      hashRouting: hash,
      history,
      context
    } = this.config;
    // Resolve to URL query string if it's not explicitly passed
    routeStr = trim(route);
    if (isValidRoute(routeStr)) {
      const path = routeStr;
      if (hash) {
        routeStr = `${preservePath ? '' : '/'}#${routeStr}`;
      }
      // Append query string
      routeStr = `${routeStr}${trim(queryString ? `${QRY + queryString}` : EMPTY)}`;
      const savedState = history.state || {
        idx: 0
      };
      history[replace ? REPLACE : PUSH]({
        data,
        idx: savedState.idx + 1
      }, pageTitle, routeStr);
      if (!preventDefault && path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path,
          hash
        }, UNDEF, this]);
      }
    } else {
      throw new TypeError(INVALID_ROUTE);
    }
  }

  const getPath = (isHash, location) => {
    return trim(isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
  };

  /**
   * Creates an instance of router event
   */
  class RouterEvent {
    constructor(routeInfo, currentEvent) {
      // Set relevant parameters
      const [routeObject, originalEvent, routerInstance] = routeInfo;
      const {
        location,
        history
      } = routerInstance.config;
      this.route = routeObject.path;
      this.isHashRoute = routeObject.hash;
      this.router = routerInstance;
      this.currentEvent = originalEvent || currentEvent;
      this.query = {
        path: trim(location.search.substring(1)),
        hash: trim(location.hash.split(QRY)[1])
      };
      const {
        state
      } = originalEvent || {};
      const {
        data,
        idx = 0
      } = state || history.state || {};
      this.data = data;
      this.index = idx;
    }
  }

  /**
   * Attaches a rount handler
   * @returns {(observable: Observable<any>) => Observable<any>}
   */
  function collate() {
    return observable => new rxjs.Observable(subscriber => {
      const subn = observable.subscribe({
        next: event => {
          const [,, routerInstance] = event.detail;
          if (routerInstance === this) {
            subscriber.next(new RouterEvent(event.detail, event));
          }
        },
        error: subscriber.error,
        complete: subscriber.complete
      });
      return () => {
        subn.unsubscribe();
      };
    });
  }

  function callOnce(isDone) {
    const {
      hashRouting: hash,
      location,
      init
    } = this.config;
    const path = getPath(hash, location);
    return observable => new rxjs.Observable(subscriber => {
      const subn = observable.subscribe(subscriber);
      if (!isDone) {
        isDone = true;
        if (init && path) {
          subscriber.next(new RouterEvent([{
            path,
            hash
          }, UNDEF, this]));
        }
      }
      return () => {
        subn.unsubscribe();
      };
    });
  }

  /**
   * Core router class to handle basic routing functionality
   */
  class RouterCore {
    static get global() {
      return typeof globalThis !== TYPEOF_UNDEF ? globalThis : global || self;
    }
    /**
     * Router core constructor
     * @typedef {import('./types').RouterCoreConfig} RouterCoreConfig
     * @param {RouterCoreConfig} routerCoreConfig Route core configuration
     */
    constructor(_ref) {
      let {
        history,
        context,
        location,
        hash
      } = _ref;
      if (!history[PUSH]) {
        throw new Error(HISTORY_UNSUPPORTED);
      }
      this.popStateSubscription = rxjs.fromEvent(RouterCore.global, POP_STATE).subscribe(e => {
        const path = getPath(hash, location);
        if (path) {
          trigger(context, VIRTUAL_PUSHSTATE, [{
            path,
            hash
          }, e, this]);
        }
      });
      this.listeners = rxjs.fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(this));
    }
    /**
     * Allows you to add operators for any pre-processing before a handler is called
     * @typedef {import('./types').Operator} Operator
     * @param  {...Operator} ops Operators
     * @returns {Observable<any>}
     */
    pipe() {
      for (var _len = arguments.length, ops = new Array(_len), _key = 0; _key < _len; _key++) {
        ops[_key] = arguments[_key];
      }
      return this.listeners.pipe(callOnce.apply(this), ...ops);
    }
    /**
     * Attaches a route handler
     * @param {(event: RouterEvent) => void} fn Route handler
     */
    subscribe(fn) {
      return this.pipe().subscribe(fn);
    }
    /**
     * Destroys current router instance
     * @param {() => void} callback Callback for destroy function
     */
    destroy(callback) {
      if (typeof callback === TYPEOF_FUNC) {
        callback();
      }
      this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
    }
  }

  /**
   * Browser router to handle routing logic
   */
  class Router extends RouterCore {
    /**
     * Router constructor
     * @typedef {import('./types').RouterConfig} RouterConfig
     * @param {RouterConfig} config
     */
    constructor(config) {
      config = isObject(config) ? config : {};
      const {
        history,
        location,
        document
      } = RouterCore.global;
      const context = document.body;
      super({
        history,
        location,
        context,
        hash: config.hashRouting
      });
      this.config = Object.freeze({
        init: true,
        hashRouting: false,
        preservePath: false,
        context,
        history,
        location,
        ...config
      });
      if (config.hashRouting && !location.hash) {
        this.set('/', {
          replace: true,
          preventDefault: true // Don't execute route handlers
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

  exports.Router = Router;
  exports.RouterCore = RouterCore;
  exports.resolveParams = resolveParams;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=silkrouter.js.map
