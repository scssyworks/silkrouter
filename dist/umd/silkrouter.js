(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'rxjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.silkrouter = {}, global.rxjs));
})(this, (function (exports, rxjs) { 'use strict';

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
  const REG_ROUTE_PARAMS = /:[^/]+/g;
  const REG_PATHNAME = /^\/(?=[^?]*)/;
  const HISTORY_UNSUPPORTED = 'History unsupported!';
  const INVALID_ROUTE = 'Route string is not a pure route';
  const VIRTUAL_PUSHSTATE = 'vpushstate';
  const CACHED_FIELDS = ['route', 'hashRouting', 'path', 'hash', 'search', 'hashSearch', 'data'];
  const AMP = '&';
  const QRY = '?';
  const EMPTY = '';
  const UNDEF$1 = void 0;
  const TYPEOF_STR$1 = typeof EMPTY;
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


  var TYPEOF_STR = _typeof(""); // location var


  var loc = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== TYPEOF_UNDEF ? window.location : null; // Shorthand for built-ins

  var isArr$1 = Array.isArray;
  /**
   * Checks if current key is safe
   * @param {string} key Current key
   * @returns {boolean}
   */

  function isSafe(key) {
    return ["__proto__", "prototype"].indexOf(key) === -1;
  }
  /**
   * Shorthand for Object.prototype.hasOwnProperty
   * @param {any} obj Any object
   * @param {string} key key
   * @returns {boolean} true or false if object has the property
   */


  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  /**
   * Returns true of input query string is complex
   * @param {string} q Query string
   * @returns {boolean} true or false
   */


  function ifComplex(q) {
    return /\[/.test(q);
  }
  /**
   * Returns an object without a prototype
   * @returns {{[key in string|number]: any}} Object without __proto__
   */


  function obNull() {
    return Object.create(null);
  }
  /**
   * Returns a parsed query object
   * @param {string} qs Query string
   * @param {boolean} coerce Coerce values
   * @returns {{[key in string|number]: any}} Query object
   */


  function lib(qs, coerce) {
    var _this = this;

    if (_typeof(qs) !== TYPEOF_STR) {
      qs = loc ? loc.search : "";
    }

    qs = qs.substring(qs.charAt(0) === "?");
    var queryObject = obNull();

    if (qs) {
      qs.split("&").forEach(function (qq) {
        var qArr = qq.split("=").map(function (part) {
          return decodeURIComponent(part);
        });

        if (ifComplex(qArr[0])) {
          complex.apply(_this, [].concat(qArr).concat([queryObject, coerce]));
        } else {
          simple.apply(_this, [qArr, queryObject, false, coerce]);
        }
      });
    }

    return queryObject;
  }
  /**
   * Converts an array to equivalent object
   * @param {any[]} arr Any array
   * @returns {any} Any object
   */


  function toObject(arr) {
    var convertedObj = obNull();

    if (isArr$1(arr)) {
      arr.forEach(function (value, index) {
        convertedObj[index] = value;
      });
    }

    return convertedObj;
  }
  /**
   * Converts array to an object if required
   * @param {any} ob Any object
   * @param {booleab} isNextNumber Test for next key
   * @returns {any} Any object
   */


  function resolve(ob, isNextNumber) {
    if (_typeof(ob) === TYPEOF_UNDEF) return isNextNumber ? [] : obNull();
    return isNextNumber ? ob : toObject(ob);
  }
  /**
   * Resolves the target object for next iteration
   * @param {any} ob current reference object
   * @param {string} nextProp reference property in current object
   * @returns {any} Resolved object for next iteration
   */


  function resolveObj(ob, nextProp) {
    if (isObject(ob) && !isArr$1(ob)) return {
      ob: ob
    };
    if (isArr$1(ob) || _typeof(ob) === TYPEOF_UNDEF) return {
      ob: resolve(ob, isNumber(nextProp))
    };
    return {
      ob: [ob],
      push: ob !== null
    };
  }
  /**
   * Handles complex query parameters
   * @param {string} key Query key
   * @param {string} value Query value
   * @param {Object} obj Query object
   * @returns {void}
   */


  function complex(key, value, obj, doCoerce) {
    var match = key.match(/([^\[]+)\[([^\[]*)\]/) || [];

    if (match.length === 3) {
      var prop = match[1];
      var nextProp = match[2];
      key = key.replace(/\[([^\[]*)\]/, "");

      if (ifComplex(key)) {
        if (nextProp === "") nextProp = "0";
        key = key.replace(/[^\[]+/, nextProp);
        complex(key, value, obj[prop] = resolveObj(obj[prop], nextProp).ob, doCoerce);
      } else if (nextProp) {
        if (isSafe(prop) && isSafe(nextProp)) {
          var _resolveObj = resolveObj(obj[prop], nextProp),
              ob = _resolveObj.ob,
              push = _resolveObj.push;

          obj[prop] = ob;
          var nextOb = push ? obNull() : obj[prop];
          nextOb[nextProp] = coerce(value, !doCoerce);

          if (push) {
            obj[prop].push(nextOb);
          }
        }
      } else {
        simple([match[1], value], obj, true, doCoerce);
      }
    }
  }
  /**
   * Handles simple query
   * @param {array} qArr Query list
   * @param {Object} queryObject Query object
   * @param {boolean} toArray Test for conversion to array
   * @returns {void}
   */


  function simple(qArr, queryObject, toArray, doCoerce) {
    var key = qArr[0];
    var value = qArr[1];

    if (isSafe(key)) {
      value = coerce(value, !doCoerce);

      if (hasOwn(queryObject, key)) {
        queryObject[key] = isArr$1(queryObject[key]) ? queryObject[key] : [queryObject[key]];
        queryObject[key].push(value);
      } else {
        queryObject[key] = toArray ? [value] : value;
      }
    }
  }
  /**
   * Converts input value to their appropriate types
   * @param {any} value Input value
   * @param {boolean} skip Test for skipping coercion
   * @returns {any} Coerced value
   */


  function coerce(value, skip) {
    // eslint-disable-next-line
    if (value == null) {
      return "";
    }

    if (skip || _typeof(value) !== TYPEOF_STR) {
      return value;
    }

    value = value.trim();

    if (isNumber(value)) {
      return +value;
    }

    switch (value) {
      case "null":
        return null;

      case TYPEOF_UNDEF:
        return UNDEF;

      case "true":
        return true;

      case "false":
        return false;

      case "NaN":
        return NaN;

      default:
        return value;
    }
  }

  /**
   * Shorthand for Array.isArray
   */
  const isArr = Array.isArray;

  /**
   * Shorthand for Object.keys
   */
  const oKeys = Object.keys;

  /**
   * Safely trims string
   * @param {string} str String
   */
  function trim(str) {
    return typeof str === TYPEOF_STR$1 ? str.trim() : EMPTY;
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
    if (target.length && typeof eventType === TYPEOF_STR$1) {
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

  class RouterEvent {
    constructor(routeInfo, currentEvent) {
      // Set relevant parameters
      const routeObject = routeInfo[0];
      const originalEvent = routeInfo[1];
      const routerInstance = routeInfo[2];
      const {
        location,
        history
      } = routerInstance.config;
      this.route = routeObject.path;
      this.hashRouting = routeObject.hash;
      this.routerInstance = routerInstance;
      this.virtualEvent = currentEvent || {};
      this.originalEvent = originalEvent || {};
      this.path = trim(location.pathname);
      this.hash = location.hash;
      this.search = trim(location.search.substring(1));
      this.hashSearch = trim(location.hash && location.hash.split(QRY)[1]);
      const {
        state
      } = this.originalEvent;
      this.data = state && state.data || history.state && history.state.data;
    }
  }

  function collate() {
    return observable => new rxjs.Observable(subscriber => {
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

  const getPath = (isHash, location) => {
    return trim(isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
  };

  function bindRouterEvents(inst) {
    const {
      context,
      location,
      hashRouting: hash
    } = inst.config;
    inst.popStateSubscription = rxjs.fromEvent(getGlobal(), POP_STATE).subscribe(e => {
      const path = getPath(hash, location);
      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path,
          hash
        }, e, inst]);
      }
    });
    inst.listeners = rxjs.fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(inst));
    if (hash && !location.hash) {
      inst.set('/', true, false); // Replace current hash path without executing anythings
    }
  }

  const encode = encodeURIComponent;

  /**
   * Builds query string recursively
   * @private
   * @param {string[]} qsList List of query string key value pairs
   * @param {*} key Key
   * @param {*} obj Value
   */
  function buildQuery(qsList, key, obj) {
    if (isObject(obj)) {
      each(obj, (prop, obKey) => {
        buildQuery(qsList, `${key}[${isArr(obj) ? EMPTY : obKey}]`, prop);
      });
    } else if (typeof obj !== TYPEOF_FUNC) {
      qsList.push(`${encode(key)}=${encode(obj)}`);
    }
  }

  /**
   * Converts an object to a query string
   * @private
   * @param {object} obj Object which should be converted to a string
   * @returns {string}
   */
  function toQueryString(obj) {
    let qsList = [];
    if (isObject(obj)) {
      each(obj, (prop, key) => {
        buildQuery(qsList, key, prop);
      });
      return qsList.join(AMP);
    }
    return typeof obj === TYPEOF_STR$1 ? obj : EMPTY;
  }

  /**
   * Resolves and analyzes existing query string
   * @private
   * @param {string} queryString Query string
   * @param {string} hashRouting Flag to test if hash routing is enabled
   */
  function resolveQuery(queryString, hashRouting) {
    const {
      location
    } = this.config;
    const search = trim(location.search && location.search.substring(1));
    const existingQuery = trim(hashRouting ? location.hash.split(QRY)[1] : search);
    if (!existingQuery) {
      return queryString;
    }
    return toQueryString(assign(lib(search), lib(existingQuery), lib(queryString)));
  }

  function set(route, replace, doExec) {
    let exec = true;
    if (typeof doExec === TYPEOF_BOOL) {
      exec = doExec;
    }
    const {
      preservePath,
      hashRouting,
      history
    } = this.config;
    const routeObject = assign({
      replace,
      exec
    }, typeof route === TYPEOF_STR$1 ? {
      route
    } : route);
    replace = routeObject.replace;
    exec = routeObject.exec;
    let {
      route: routeStr,
      queryString
    } = routeObject;
    const {
      preserveQuery,
      data,
      pageTitle = null
    } = routeObject;
    const routeParts = routeStr.split(QRY);
    // Check if query string is an object
    if (isObject(queryString)) {
      queryString = toQueryString(queryString);
    }
    // Resolve to URL query string if it's not explicitly passed
    queryString = trim(queryString ? queryString : routeParts[1]);
    routeStr = trim(routeParts[0]);
    // Check if query preservation is required. Resolve query accordingly
    if (preserveQuery) {
      queryString = resolveQuery.apply(this, [queryString, hashRouting]);
    }
    if (isValidRoute(routeStr)) {
      const unmodifiedRoute = routeStr;
      if (hashRouting) {
        routeStr = `/#${routeStr}`;
        // Path preservation should only work for hash routing
        if (preservePath) {
          routeStr = `${routeStr.substring(1)}`;
        }
      }
      // Append query string
      routeStr = `${routeStr}${queryString ? `${QRY + queryString}` : EMPTY}`;
      history[replace ? REPLACE : PUSH]({
        data
      }, pageTitle, routeStr);
      if (exec && unmodifiedRoute) {
        trigger(this.config.context, VIRTUAL_PUSHSTATE, [{
          path: unmodifiedRoute,
          hash: hashRouting
        }, UNDEF$1, this]);
      }
    } else {
      throw new TypeError(INVALID_ROUTE);
    }
    return this;
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
          }, UNDEF$1, this]));
        }
      }
      return () => {
        subn.unsubscribe();
      };
    });
  }

  class Router {
    constructor(config) {
      const {
        history,
        location,
        document
      } = getGlobal();
      if (!history[PUSH]) {
        throw new Error(HISTORY_UNSUPPORTED);
      }
      this.config = Object.freeze(assign({
        init: true,
        // Initialize as soon as route handler is attached
        hashRouting: false,
        // Switch to hash routing
        preservePath: false,
        // Works for hash routing
        context: document.body,
        // To change the context of "vpushstate" event
        location,
        // Should remain unchanged
        history // History object
      }, config || {}));
      this.__paths__ = [];
      bindRouterEvents(this);
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
    set() {
      for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
      }
      return set.apply(this, props);
    }
    destroy(callback) {
      if (typeof callback === TYPEOF_FUNC) {
        callback();
      }
      this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
      this.__paths__.length = 0;
    }
  }

  /**
   * Parses current path and returns params object
   * @private
   * @param {string} expr Route expression
   * @param {string} path URL path
   * @returns {object}
   */
  function extractParams(expr, path) {
    const params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
      const pathRegex = new RegExp(expr.replace(/\//g, '\\/').replace(/:[^/\\]+/g, '([^\\/]+)'));
      REG_ROUTE_PARAMS.lastIndex = 0;
      if (pathRegex.test(path)) {
        const keys = Array.from(expr.match(REG_ROUTE_PARAMS)).map(key => key.replace(':', EMPTY));
        const values = Array.from(path.match(pathRegex));
        values.shift();
        each(keys, (key, index) => {
          params[key] = values[index];
        });
      }
    }
    return params;
  }

  /**
   * Operator to compare a specific route
   * @param {string} routeStr Route string
   * @param {Router} routerInstance Current router object [optional]
   * @param {boolean} ignoreCase Ignore case in route string
   */
  function route(routeStr, routerInstance, ignoreCase) {
    if (typeof routerInstance === TYPEOF_BOOL) {
      ignoreCase = routerInstance;
      routerInstance = UNDEF$1;
    }
    routeStr = trim(routeStr);
    if (routerInstance instanceof Router) {
      const paths = routerInstance.__paths__;
      if (paths.indexOf(routeStr) === -1) {
        paths.push(routeStr);
      }
    }
    return observable => new rxjs.Observable(subscriber => {
      const subn = observable.subscribe({
        next(event) {
          let incomingRoute = event.route;
          if (isValidRoute(routeStr)) {
            if (ignoreCase) {
              routeStr = routeStr.toLowerCase();
              incomingRoute = incomingRoute.toLowerCase();
            }
            const params = extractParams(routeStr, incomingRoute);
            const paramsLength = oKeys(params).length;
            if (incomingRoute === routeStr || paramsLength > 0) {
              if (paramsLength > 0) {
                event.params = params;
              }
              subscriber.next(event);
            }
          } else {
            subscriber.error(new Error(INVALID_ROUTE));
          }
        },
        error: subscriber.error,
        complete: subscriber.complete
      });
      return () => {
        if (routerInstance instanceof Router) {
          const paths = routerInstance.__paths__;
          const existingRouteIndex = paths.indexOf(routeStr);
          if (existingRouteIndex > -1) {
            paths.splice(existingRouteIndex, 1);
          }
        }
        subn.unsubscribe();
      };
    });
  }

  /**
   * Converts search and hashSearch strings to object
   * @param {boolean} coerce Flag to enable value typecast
   */
  function deparam(coerce) {
    return observable => new rxjs.Observable(subscriber => {
      const subn = observable.subscribe({
        next(event) {
          try {
            event.search = lib(event.search, coerce);
            event.hashSearch = lib(event.hashSearch, coerce);
            subscriber.next(event);
          } catch (e) {
            subscriber.error(e);
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
   * Modifies current subscriber to detect errors
   * @param {Router} routerInstance Current router object
   */
  function noMatch(routerInstance) {
    return observable => new rxjs.Observable(subscriber => {
      const subn = observable.subscribe({
        next(event) {
          if (routerInstance instanceof Router) {
            const paths = routerInstance.__paths__;
            if (paths.length > 0) {
              const currentRoute = event.route;
              let match = false;
              each(paths, path => {
                if (path === currentRoute || oKeys(extractParams(path, currentRoute)).length) {
                  return !(match = true);
                }
              });
              if (!match) {
                event.noMatch = true;
                subscriber.next(event);
              }
            }
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
  function deepComparison(first, second, result) {
    each(oKeys(first), key => {
      if (isObject(first[key]) && isObject(second[key])) {
        deepComparison(first[key], second[key], result);
      } else {
        result.break = first[key] !== second[key];
      }
    });
  }

  /**
   * Caches incoming routes to avoid calling handler if there is no change
   * @param {string[]} keys
   * @param {boolean} deep
   */
  function cache() {
    let keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CACHED_FIELDS;
    let deep = arguments.length > 1 ? arguments[1] : undefined;
    let cache = {};
    if (typeof keys === TYPEOF_BOOL) {
      deep = keys;
      keys = CACHED_FIELDS;
    }
    return observable => new rxjs.Observable(subscriber => {
      const subn = observable.subscribe({
        next(event) {
          each(keys, key => {
            if (deep && isObject(event[key]) && isObject(cache[key])) {
              const result = {};
              deepComparison(event[key], cache[key], result);
              if (result.break) {
                assign(cache, event);
                subscriber.next(event);
                return false;
              }
            } else if (event[key] !== cache[key]) {
              assign(cache, event);
              subscriber.next(event);
              return false; // break loop
            }
          });
        },

        error: subscriber.error,
        complete: subscriber.complete
      });
      return () => {
        subn.unsubscribe();
        cache = {};
      };
    });
  }

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    route: route,
    deparam: deparam,
    noMatch: noMatch,
    cache: cache
  });

  exports.Router = Router;
  exports.operators = index;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=silkrouter.js.map
