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

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var isObject = function isObject(x) {
  	return typeof x === 'object' && x !== null;
  };

  var isObject$1 = /*@__PURE__*/getDefaultExportFromCjs(isObject);

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
   * Checks if input value is a string
   * @param {any} str String value
   * @returns {boolean}
   */
  function isString(str) {
    return typeof str === 'string';
  }

  /**
   * Safely trims string
   * @param {string} str String
   */
  function trim(str) {
    return isString(str) ? str.trim() : EMPTY;
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
   * @param {RouteConfig} [rConfig] Route config
   */
  function set(routeStr, rConfig) {
    const routeConfig = isObject$1(rConfig) ? rConfig : {};
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
    let routeString = trim(route);
    if (isValidRoute(routeString)) {
      const path = routeString;
      if (hash) {
        routeString = `${preservePath ? '' : '/'}#${routeString}`;
      }
      // Append query string
      routeString = `${routeString}${trim(queryString ? `${QRY + queryString}` : EMPTY)}`;
      const savedState = history.state || {
        idx: 0
      };
      history[replace ? REPLACE : PUSH]({
        data,
        idx: savedState.idx + 1
      }, pageTitle, routeString);
      if (!preventDefault && path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path,
          hash
        }, undefined, this]);
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
    /**
     * Creates a instance of router event
     * @typedef {import('./types').RouteInfo} RouteInfo
     * @param {RouteInfo} routeInfo Route information
     * @param {CustomEvent} currentEvent Current event object
     */
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
      this.index = +idx;
    }
  }

  /**
   * Calls the handler once on initialization
   * @param {boolean} [isd] Optional flag used as a switch
   * @returns {(observable: Observable<any>) => Observable<any>}
   */
  function callOnce(isd) {
    let isDone = isd;
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
          }, undefined, this]));
        }
      }
      return () => {
        subn.unsubscribe();
      };
    });
  }

  /**
   * Attaches a route handler
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

  /**
   * Core router class to handle basic routing functionality
   */
  class RouterCore {
    static get global() {
      return typeof globalThis !== 'undefined' ? globalThis : global || self;
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
     * @typedef {import('rxjs').Observable} Observable
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
     * @typedef {import('../routerEvent/index').RouterEvent} RouterEvent
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
      if (typeof callback === 'function') {
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
      config = isObject$1(config) ? config : {};
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

}));
//# sourceMappingURL=silkrouter.js.map
