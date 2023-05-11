import { Observable, fromEvent } from 'rxjs';

/**
 * Function to extend an object with new and updated properties
 * @private
 * @returns {object}
 */
function assign() {
  return Object.assign(...arguments);
}

/**
 * Router constants
 */
const POP_STATE = 'popstate';
const REG_PATHNAME = /^\/(?=[^?]*)/;
const HISTORY_UNSUPPORTED = 'History unsupported!';
const INVALID_ROUTE = 'Route string is not a pure route';
const VIRTUAL_PUSHSTATE = 'vpushstate';
const QRY = '?';
const EMPTY = '';
const UNDEF$1 = void 0;
const TYPEOF_STR = typeof EMPTY;
const TYPEOF_BOOL = typeof true;
const TYPEOF_UNDEF$1 = typeof UNDEF$1;
const TYPEOF_FUNC = typeof (() => {});
const STATE = 'State';
const PUSH = `push${STATE}`;
const REPLACE = `replace${STATE}`;

function getGlobal() {
  return typeof globalThis !== TYPEOF_UNDEF$1 ? globalThis : global || self;
}

/*!
 * Deparam plugin converts query string to a valid JavaScript object
 * Released under MIT license
 * @name Deparam.js
 * @author Sachin Singh <https://github.com/scssyworks/deparam.js>
 * @version 3.0.6
 * @license MIT
 */
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var isNumber = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};

var isObject = function isObject(x) {
	return typeof x === 'object' && x !== null;
};

var UNDEF = void 0; // Results to undefined
// Typeof undefined

var TYPEOF_UNDEF = _typeof(UNDEF); // Typeof string


_typeof(""); // location var


(typeof window === "undefined" ? "undefined" : _typeof(window)) !== TYPEOF_UNDEF ? window.location : null; // Shorthand for built-ins

/**
 * Shorthand for Object.keys
 */
const oKeys = Object.keys;

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
 * Loops over an array like object
 * @param {object} arrayObj Array or array like object
 * @param {function} callback Callback function
 */
function each(arrayObj, callback) {
  if (isObject(arrayObj)) {
    const keys = oKeys(arrayObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const cont = callback(arrayObj[key], isNumber(key) ? +key : key);
      if (typeof cont === TYPEOF_BOOL) {
        if (!cont) {
          break;
        }
      }
    }
  }
}

/**
 * Function to trigger custom event
 * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
 * @param {string} eventType Event type
 * @param {any[]} data Data to be passed to handler
 */
function trigger(target, eventType, data) {
  target = Array.from(target instanceof Node ? [target] : target);
  if (target.length && typeof eventType === TYPEOF_STR) {
    each(target, el => {
      const win = getGlobal();
      const customEvent = new win.CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: data || []
      });
      el.dispatchEvent(customEvent);
    });
  }
}

/**
 * Sets the current route
 * @private
 * @typedef {import('./types').RouteConfig} RouteConfig
 * @param {string} routeStr Route string
 * @param {RouteConfig} [routeConfig] Route config
 * @returns {void}
 */
function set(routeStr) {
  let routeConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
      }, UNDEF$1, this]);
    }
  } else {
    throw new TypeError(INVALID_ROUTE);
  }
}

const getPath = (isHash, location) => {
  return trim(isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
};

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

function collate() {
  return observable => new Observable(subscriber => {
    const subn = observable.subscribe({
      next: event => {
        const routerInstance = event.detail[2];
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
  return observable => new Observable(subscriber => {
    const subn = observable.subscribe(subscriber);
    if (!isDone) {
      isDone = true;
      if (init && path) {
        subscriber.next(new RouterEvent([{
          path,
          hash
        }, UNDEF$1, this]));
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
  /**
   * Router core constructor
   * @typedef {import('./types').RouterCoreConfig} RouterCoreConfig
   * @param {RouterCoreConfig} routerCoreConfig Route core configuration
   */
  constructor(_ref) {
    let {
      global,
      history,
      context,
      location,
      hash
    } = _ref;
    if (!history[PUSH]) {
      throw new Error(HISTORY_UNSUPPORTED);
    }
    this.__paths__ = [];
    this.popStateSubscription = fromEvent(global, POP_STATE).subscribe(e => {
      const path = getPath(hash, location);
      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path,
          hash
        }, e, this]);
      }
    });
    this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(this));
  }
  pipe() {
    for (var _len = arguments.length, ops = new Array(_len), _key = 0; _key < _len; _key++) {
      ops[_key] = arguments[_key];
    }
    return this.listeners.pipe(callOnce.apply(this), ...ops);
  }
  subscribe() {
    return this.pipe().subscribe(...arguments);
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
    this.__paths__.length = 0;
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
  constructor() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const global = getGlobal();
    const {
      history,
      location,
      document
    } = global;
    const context = document.body;
    super({
      global,
      history,
      location,
      context,
      hash: config.hashRouting
    });
    this.config = Object.freeze(assign({
      init: true,
      hashRouting: false,
      preservePath: false
    }, config, {
      context,
      history,
      location
    }));
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

export { Router, RouterCore };
//# sourceMappingURL=silkrouter.esm.js.map
