(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'rxjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.silkrouter = {}, global.rxjs));
})(this, (function (exports, rxjs) { 'use strict';

  function _typeof$1(obj) {
    "@babel/helpers - typeof";

    return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof$1(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /**
   * Function to extend an object with new and updated properties
   * @private
   * @returns {object}
   */
  function assign() {
    return Object.assign.apply(Object, arguments);
  }

  /**
   * Router constants
   */
  var POP_STATE = 'popstate';
  var REG_ROUTE_PARAMS = /:[^/]+/g;
  var REG_PATHNAME = /^\/(?=[^?]*)/;
  var HISTORY_UNSUPPORTED = 'History unsupported!';
  var INVALID_ROUTE = 'Route string is not a pure route';
  var VIRTUAL_PUSHSTATE = 'vpushstate';
  var CACHED_FIELDS = ['route', 'hashRouting', 'path', 'hash', 'search', 'hashSearch', 'data'];
  var AMP = '&';
  var QRY = '?';
  var EMPTY = '';
  var UNDEF$1 = void 0;
  var TYPEOF_STR$1 = _typeof$1(EMPTY);
  var TYPEOF_BOOL = _typeof$1(true);
  var TYPEOF_UNDEF$1 = _typeof$1(UNDEF$1);
  _typeof$1({});
  _typeof$1(0);
  var TYPEOF_FUNC = _typeof$1(function () {});
  var STATE = 'State';
  var PUSH = "push".concat(STATE);
  var REPLACE = "replace".concat(STATE);

  function getGlobal() {
    return (typeof globalThis === "undefined" ? "undefined" : _typeof$1(globalThis)) !== TYPEOF_UNDEF$1 ? globalThis : global || self;
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
  var isArr = Array.isArray;

  /**
   * Shorthand for Object.keys
   */
  var oKeys = Object.keys;

  /**
   * Safely trims string
   * @param {string} str String
   */
  function trim(str) {
    return _typeof$1(str) === TYPEOF_STR$1 ? str.trim() : EMPTY;
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
      var keys = oKeys(arrayObj);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var cont = callback(arrayObj[key], isNumber(key) ? +key : key);
        if (_typeof$1(cont) === TYPEOF_BOOL) {
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
    if (target.length && _typeof$1(eventType) === TYPEOF_STR$1) {
      each(target, function (el) {
        var win = getGlobal();
        var customEvent = new win.CustomEvent(eventType, {
          bubbles: true,
          cancelable: true,
          detail: data || []
        });
        el.dispatchEvent(customEvent);
      });
    }
  }

  var RouterEvent = /*#__PURE__*/_createClass(function RouterEvent(routeInfo, currentEvent) {
    _classCallCheck(this, RouterEvent);
    // Set relevant parameters
    var routeObject = routeInfo[0];
    var originalEvent = routeInfo[1];
    var routerInstance = routeInfo[2];
    var _routerInstance$confi = routerInstance.config,
      location = _routerInstance$confi.location,
      history = _routerInstance$confi.history;
    this.route = routeObject.path;
    this.hashRouting = routeObject.hash;
    this.routerInstance = routerInstance;
    this.virtualEvent = currentEvent || {};
    this.originalEvent = originalEvent || {};
    this.path = trim(location.pathname);
    this.hash = location.hash;
    this.search = trim(location.search.substring(1));
    this.hashSearch = trim(location.hash && location.hash.split(QRY)[1]);
    var state = this.originalEvent.state;
    this.data = state && state.data || history.state && history.state.data;
  });

  function collate() {
    var _this = this;
    return function (observable) {
      return new rxjs.Observable(function (subscriber) {
        var subn = observable.subscribe({
          next: function next(event) {
            var routerInstance = event.detail[2];
            if (routerInstance === _this) {
              subscriber.next(new RouterEvent(event.detail, event));
            }
          },
          error: subscriber.error,
          complete: subscriber.complete
        });
        return function () {
          subn.unsubscribe();
        };
      });
    };
  }

  var getPath = function getPath(isHash, location) {
    return trim(isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
  };

  function bindRouterEvents(inst) {
    var _inst$config = inst.config,
      context = _inst$config.context,
      location = _inst$config.location,
      hash = _inst$config.hashRouting;
    inst.popStateSubscription = rxjs.fromEvent(getGlobal(), POP_STATE).subscribe(function (e) {
      var path = getPath(hash, location);
      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path: path,
          hash: hash
        }, e, inst]);
      }
    });
    inst.listeners = rxjs.fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(inst));
    if (hash && !location.hash) {
      inst.set('/', true, false); // Replace current hash path without executing anythings
    }
  }

  var encode = encodeURIComponent;

  /**
   * Builds query string recursively
   * @private
   * @param {string[]} qsList List of query string key value pairs
   * @param {*} key Key
   * @param {*} obj Value
   */
  function buildQuery(qsList, key, obj) {
    if (isObject(obj)) {
      each(obj, function (prop, obKey) {
        buildQuery(qsList, "".concat(key, "[").concat(isArr(obj) ? EMPTY : obKey, "]"), prop);
      });
    } else if (_typeof$1(obj) !== TYPEOF_FUNC) {
      qsList.push("".concat(encode(key), "=").concat(encode(obj)));
    }
  }

  /**
   * Converts an object to a query string
   * @private
   * @param {object} obj Object which should be converted to a string
   * @returns {string}
   */
  function toQueryString(obj) {
    var qsList = [];
    if (isObject(obj)) {
      each(obj, function (prop, key) {
        buildQuery(qsList, key, prop);
      });
      return qsList.join(AMP);
    }
    return _typeof$1(obj) === TYPEOF_STR$1 ? obj : EMPTY;
  }

  /**
   * Resolves and analyzes existing query string
   * @private
   * @param {string} queryString Query string
   * @param {string} hashRouting Flag to test if hash routing is enabled
   */
  function resolveQuery(queryString, hashRouting) {
    var location = this.config.location;
    var search = trim(location.search && location.search.substring(1));
    var existingQuery = trim(hashRouting ? location.hash.split(QRY)[1] : search);
    if (!existingQuery) {
      return queryString;
    }
    return toQueryString(assign(lib(search), lib(existingQuery), lib(queryString)));
  }

  function set(route, replace, doExec) {
    var exec = true;
    if (_typeof$1(doExec) === TYPEOF_BOOL) {
      exec = doExec;
    }
    var _this$config = this.config,
      preservePath = _this$config.preservePath,
      hashRouting = _this$config.hashRouting,
      history = _this$config.history;
    var routeObject = assign({
      replace: replace,
      exec: exec
    }, _typeof$1(route) === TYPEOF_STR$1 ? {
      route: route
    } : route);
    replace = routeObject.replace;
    exec = routeObject.exec;
    var routeStr = routeObject.route,
      queryString = routeObject.queryString;
    var preserveQuery = routeObject.preserveQuery,
      data = routeObject.data,
      _routeObject$pageTitl = routeObject.pageTitle,
      pageTitle = _routeObject$pageTitl === void 0 ? null : _routeObject$pageTitl;
    var routeParts = routeStr.split(QRY);
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
      var unmodifiedRoute = routeStr;
      if (hashRouting) {
        routeStr = "/#".concat(routeStr);
        // Path preservation should only work for hash routing
        if (preservePath) {
          routeStr = "".concat(routeStr.substring(1));
        }
      }
      // Append query string
      routeStr = "".concat(routeStr).concat(queryString ? "".concat(QRY + queryString) : EMPTY);
      history[replace ? REPLACE : PUSH]({
        data: data
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
    var _this = this;
    var _this$config = this.config,
      hash = _this$config.hashRouting,
      location = _this$config.location,
      init = _this$config.init;
    var path = getPath(hash, location);
    return function (observable) {
      return new rxjs.Observable(function (subscriber) {
        var subn = observable.subscribe(subscriber);
        if (!isDone) {
          isDone = true;
          if (init && path) {
            subscriber.next(new RouterEvent([{
              path: path,
              hash: hash
            }, UNDEF$1, _this]));
          }
        }
        return function () {
          subn.unsubscribe();
        };
      });
    };
  }

  var Router = /*#__PURE__*/function () {
    function Router(config) {
      _classCallCheck(this, Router);
      var _getGlobal = getGlobal(),
        history = _getGlobal.history,
        location = _getGlobal.location,
        document = _getGlobal.document;
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
        location: location,
        // Should remain unchanged
        history: history // History object
      }, config || {}));
      this.__paths__ = [];
      bindRouterEvents(this);
    }
    _createClass(Router, [{
      key: "pipe",
      value: function pipe() {
        var _this$listeners;
        for (var _len = arguments.length, ops = new Array(_len), _key = 0; _key < _len; _key++) {
          ops[_key] = arguments[_key];
        }
        return (_this$listeners = this.listeners).pipe.apply(_this$listeners, [callOnce.apply(this)].concat(ops));
      }
    }, {
      key: "subscribe",
      value: function subscribe() {
        var _this$pipe;
        return (_this$pipe = this.pipe()).subscribe.apply(_this$pipe, arguments);
      }
    }, {
      key: "set",
      value: function set$1() {
        for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          props[_key2] = arguments[_key2];
        }
        return set.apply(this, props);
      }
    }, {
      key: "destroy",
      value: function destroy(callback) {
        if (_typeof$1(callback) === TYPEOF_FUNC) {
          callback();
        }
        this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
        this.__paths__.length = 0;
      }
    }]);
    return Router;
  }();

  /**
   * Parses current path and returns params object
   * @private
   * @param {string} expr Route expression
   * @param {string} path URL path
   * @returns {object}
   */
  function extractParams(expr, path) {
    var params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
      var pathRegex = new RegExp(expr.replace(/\//g, '\\/').replace(/:[^/\\]+/g, '([^\\/]+)'));
      REG_ROUTE_PARAMS.lastIndex = 0;
      if (pathRegex.test(path)) {
        var keys = Array.from(expr.match(REG_ROUTE_PARAMS)).map(function (key) {
          return key.replace(':', EMPTY);
        });
        var values = Array.from(path.match(pathRegex));
        values.shift();
        each(keys, function (key, index) {
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
    if (_typeof$1(routerInstance) === TYPEOF_BOOL) {
      ignoreCase = routerInstance;
      routerInstance = UNDEF$1;
    }
    routeStr = trim(routeStr);
    if (routerInstance instanceof Router) {
      var paths = routerInstance.__paths__;
      if (paths.indexOf(routeStr) === -1) {
        paths.push(routeStr);
      }
    }
    return function (observable) {
      return new rxjs.Observable(function (subscriber) {
        var subn = observable.subscribe({
          next: function next(event) {
            var incomingRoute = event.route;
            if (isValidRoute(routeStr)) {
              if (ignoreCase) {
                routeStr = routeStr.toLowerCase();
                incomingRoute = incomingRoute.toLowerCase();
              }
              var params = extractParams(routeStr, incomingRoute);
              var paramsLength = oKeys(params).length;
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
        return function () {
          if (routerInstance instanceof Router) {
            var _paths = routerInstance.__paths__;
            var existingRouteIndex = _paths.indexOf(routeStr);
            if (existingRouteIndex > -1) {
              _paths.splice(existingRouteIndex, 1);
            }
          }
          subn.unsubscribe();
        };
      });
    };
  }

  /**
   * Converts search and hashSearch strings to object
   * @param {boolean} coerce Flag to enable value typecast
   */
  function deparam(coerce) {
    return function (observable) {
      return new rxjs.Observable(function (subscriber) {
        var subn = observable.subscribe({
          next: function next(event) {
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
        return function () {
          subn.unsubscribe();
        };
      });
    };
  }

  /**
   * Modifies current subscriber to detect errors
   * @param {Router} routerInstance Current router object
   */
  function noMatch(routerInstance) {
    return function (observable) {
      return new rxjs.Observable(function (subscriber) {
        var subn = observable.subscribe({
          next: function next(event) {
            if (routerInstance instanceof Router) {
              var paths = routerInstance.__paths__;
              if (paths.length > 0) {
                var currentRoute = event.route;
                var match = false;
                each(paths, function (path) {
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
        return function () {
          subn.unsubscribe();
        };
      });
    };
  }
  function deepComparison(first, second, result) {
    each(oKeys(first), function (key) {
      if (isObject(first[key]) && isObject(second[key])) {
        deepComparison(first[key], second[key], result);
      } else {
        result["break"] = first[key] !== second[key];
      }
    });
  }

  /**
   * Caches incoming routes to avoid calling handler if there is no change
   * @param {string[]} keys
   * @param {boolean} deep
   */
  function cache() {
    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CACHED_FIELDS;
    var deep = arguments.length > 1 ? arguments[1] : undefined;
    var cache = {};
    if (_typeof$1(keys) === TYPEOF_BOOL) {
      deep = keys;
      keys = CACHED_FIELDS;
    }
    return function (observable) {
      return new rxjs.Observable(function (subscriber) {
        var subn = observable.subscribe({
          next: function next(event) {
            each(keys, function (key) {
              if (deep && isObject(event[key]) && isObject(cache[key])) {
                var result = {};
                deepComparison(event[key], cache[key], result);
                if (result["break"]) {
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
        return function () {
          subn.unsubscribe();
          cache = {};
        };
      });
    };
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
