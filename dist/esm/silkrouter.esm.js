import { Observable, fromEvent } from 'rxjs';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * Router constants
 */
var POP_STATE = 'popstate';
var REG_ROUTE_PARAMS = /:[^/]+/g;
var REG_PATHNAME = /^\/(?=[^?]*)/;
var REG_COMPLEX = /\[/;
var REG_VARIABLE = /([^[]+)\[([^[]*)\]/;
var REG_REPLACE_BRACKETS = /\[([^[]*)\]/;
var REG_REPLACE_NEXTPROP = /[^[]+/;
var HISTORY_UNSUPPORTED = 'Current browser does not support history object';
var INVALID_ROUTE = 'Route string is not a pure route';
var VIRTUAL_PUSHSTATE = 'vpushstate';
var CACHED_FIELDS = ['route', 'hashRouting', 'path', 'hash', 'search', 'hashSearch', 'data'];

/**
 * Shorthand for Array.isArray
 */

var isArr = Array.isArray;
/**
 * Safely trims string
 * @param {string} str String
 */

function trim(str) {
  return typeof str === 'string' ? str.trim() : '';
}
/**
 * Checks if value is an object
 * @param {*} value Any type of value
 */

function isObject(value) {
  return value && _typeof(value) === 'object';
}
/**
 * Checks if key is a true object
 * @param {*} value Any type of value
 */

function isPureObject(value) {
  return isObject(value) && !isArr(value);
}
/**
 * Checks if given route is valid
 * @private
 * @param {string} route Route string
 */

function isValidRoute(route) {
  return typeof route === 'string' && REG_PATHNAME.test(route);
}
/**
 * Loops over an array like object
 * @param {object} arrayObj Array or array like object
 * @param {function} callback Callback function
 */

function each(arrayObj, callback) {
  if (arrayObj && arrayObj.length) {
    for (var index = 0; index < arrayObj.length; index += 1) {
      if (typeof callback === 'function') {
        var continueTheLoop = callback.apply(arrayObj, [arrayObj[index], index]);

        if (typeof continueTheLoop === 'boolean') {
          if (continueTheLoop) {
            continue;
          } else {
            break;
          }
        }
      }
    }
  }
}

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */

function loopFunc(ref, target) {
  if (isObject(ref)) {
    Object.keys(ref).forEach(function (key) {
      target[key] = ref[key];
    });
  }
}
/**
 * Polyfill for Object.assign only smaller and with less features
 * @private
 * @returns {object}
 */


function assign() {
  var target = isObject(arguments[0]) ? arguments[0] : {};

  for (var i = 1; i < arguments.length; i++) {
    loopFunc(arguments[i], target);
  }

  return target;
}

if (typeof window.CustomEvent === 'undefined') {
  var CustomEvent = function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
} // Internal function


function isValidTarget(target) {
  return target instanceof NodeList || target instanceof HTMLCollection || Array.isArray(target);
}
/**
 * Function to trigger custom event
 * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
 * @param {string} eventType Event type
 * @param {any[]} data Data to be passed to handler
 */


function trigger(target, eventType, data) {
  if (target instanceof Node) {
    target = [target];
  }

  if (isValidTarget(target) && typeof eventType === 'string') {
    each(target, function (el) {
      var customEvent = new window.CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: data || []
      });
      el.dispatchEvent(customEvent);
    });
  }
}

var RouterEvent = function RouterEvent(routeInfo, currentEvent) {
  _classCallCheck(this, RouterEvent);

  // Set relevant parameters
  var _routeInfo = _slicedToArray(routeInfo, 3),
      routeObject = _routeInfo[0],
      originalEvent = _routeInfo[1],
      routerInstance = _routeInfo[2];

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
  this.hashSearch = trim(location.hash && location.hash.split('?')[1]);
  var state = this.originalEvent.state;
  this.data = state && state.data || history.state && history.state.data;
};

function collate() {
  var currentRouterInstance = this;
  return function (observable) {
    return new Observable(function (subscriber) {
      var subn = observable.subscribe({
        next: function next(event) {
          var _event$detail = _slicedToArray(event.detail, 3),
              routerInstance = _event$detail[2];

          if (routerInstance === currentRouterInstance) {
            subscriber.next(new RouterEvent(event.detail, event));
          }
        },
        error: function error() {
          subscriber.error.apply(subscriber, arguments);
        },
        complete: function complete() {
          subscriber.complete();
        }
      });
      return function () {
        subn.unsubscribe();
      };
    });
  };
}

function bindRouterEvents() {
  var _this = this;

  var _this$config = this.config,
      context = _this$config.context,
      location = _this$config.location,
      hashRouting = _this$config.hashRouting;
  this.popStateSubscription = fromEvent(window, POP_STATE).subscribe(function (e) {
    var path = trim(hashRouting ? location.hash.substring(1).split('?')[0] : location.pathname);

    if (path) {
      trigger(context, VIRTUAL_PUSHSTATE, [{
        path: path,
        hash: hashRouting
      }, e, _this]);
    }
  });
  this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(this));

  if (hashRouting && !location.hash) {
    this.set('/', true, false); // Replace current hash path without executing anythings
  }
}

/**
 * Builds query string recursively
 * @private
 * @param {string[]} qsList List of query string key value pairs
 * @param {*} key Key
 * @param {*} obj Value
 */

function buildQuery(qsList, key, obj) {
  if (isObject(obj)) {
    Object.keys(obj).forEach(function (obKey) {
      buildQuery(qsList, "".concat(key, "[").concat(isArr(obj) ? '' : obKey, "]"), obj[obKey]);
    });
  } else if (typeof obj !== 'function') {
    qsList.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj)));
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
    Object.keys(obj).forEach(function (key) {
      buildQuery(qsList, key, obj[key]);
    });
    return qsList.join('&');
  }

  return typeof obj === 'string' ? obj : '';
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

var loc = window.location;

/**
 * Checks if query parameter key is a complex notation
 * @param {string} q
 */

function ifComplex(q) {
  return REG_COMPLEX.test(q);
}
/**
 * Converts query string to JavaScript object
 * @param {string} qs query string argument (defaults to url query string)
 */


function deparam$1() {
  var _this = this;

  var qs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : loc.search;
  var coerce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  qs = trim(qs);

  if (qs.charAt(0) === '?') {
    qs = qs.replace('?', '');
  }

  var queryObject = Object.create(null);

  if (qs) {
    qs.split('&').forEach(function (qq) {
      var qArr = qq.split('=').map(function (part) {
        return decodeURIComponent(part);
      });
      (ifComplex(qArr[0]) ? complex : simple).apply(_this, [].concat(_toConsumableArray(qArr), [queryObject, coerce, false]));
    });
  }

  return queryObject;
}
/**
 * Converts an array to an object
 * @param {array} arr
 */


function toObject(arr) {
  var convertedObj = Object.create(null);

  if (isArr(arr)) {
    arr.forEach(function (value, index) {
      convertedObj[index] = value;
    });
  }

  return convertedObj;
}
/**
 * Resolves an array to object if required
 * @param {array} ob An array object
 * @param {boolean} isNumber flag to test if next key is number
 */


function resolve(ob, isNextNumber) {
  return isNextNumber ? typeof ob === 'undefined' ? [] : ob : toObject(ob);
}
/**
 * Resolves the target object for next iteration
 * @param {Object} ob current reference object
 * @param {string} nextProp reference property in current object
 */


function resolveObj(ob, nextProp) {
  if (isPureObject(ob)) return {
    ob: ob
  };
  if (isArr(ob) || typeof ob === 'undefined') return {
    ob: resolve(ob, isNumber(nextProp))
  };
  return {
    ob: [ob],
    push: ob !== null
  };
}
/**
 * Handles complex query parameters
 * @param {string} key
 * @param {string} value
 * @param {Object} obj
 */


function complex(key, value, obj, coercion) {
  var match = key.match(REG_VARIABLE) || [];

  if (match.length === 3) {
    var prop = match[1];
    var nextProp = match[2];
    key = key.replace(REG_REPLACE_BRACKETS, '');

    if (ifComplex(key)) {
      if (nextProp === '') nextProp = '0';
      key = key.replace(REG_REPLACE_NEXTPROP, nextProp);
      complex(key, value, obj[prop] = resolveObj(obj[prop], nextProp).ob, coercion);
    } else if (nextProp) {
      var resolved = resolveObj(obj[prop], nextProp);
      obj[prop] = resolved.ob;
      var coercedValue = coercion ? coerce(value) : value;

      if (resolved.push) {
        obj[prop].push(_defineProperty({}, nextProp, coercedValue));
      } else {
        obj[prop][nextProp] = coercedValue;
      }
    } else {
      simple(prop, value, obj, coercion, true);
    }
  }
}
/**
 * Handles simple query
 * @param {array} qArr
 * @param {Object} queryObject
 * @param {boolean} toArray
 */


function simple(key, value, queryObject, coercion, toArray) {
  if (coercion) {
    value = coerce(value);
  }

  if (key in queryObject) {
    queryObject[key] = isArr(queryObject[key]) ? queryObject[key] : [queryObject[key]];
    queryObject[key].push(value);
  } else {
    queryObject[key] = toArray ? [value] : value;
  }
}
/**
 * Restores values to their original type
 * @param {string} value undefined or string value
 */


function coerce(value) {
  if (value == null) return '';
  if (typeof value !== 'string') return value;
  if (isNumber(value = trim(value))) return +value;

  switch (value) {
    case 'null':
      return null;

    case 'undefined':
      return undefined;

    case 'true':
      return true;

    case 'false':
      return false;

    case 'NaN':
      return NaN;

    default:
      return value;
  }
} // Library encapsulation


function lib() {
  return deparam$1.apply(this, arguments);
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
  var existingQuery = hashRouting ? trim(location.hash.split('?')[1]) : trim(search);
  if (!existingQuery) return queryString;
  return toQueryString(assign(lib(search), lib(existingQuery), lib(queryString)));
}

function set(route) {
  var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var exec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var _this$config = this.config,
      preservePath = _this$config.preservePath,
      hashRouting = _this$config.hashRouting,
      history = _this$config.history;
  var routeObject = assign({
    replace: replace,
    exec: exec
  }, typeof route === 'string' ? {
    route: route
  } : route);
  replace = routeObject.replace;
  exec = routeObject.exec;
  var routeStr = routeObject.route,
      queryString = routeObject.queryString;
  var preserveQuery = routeObject.preserveQuery,
      data = routeObject.data,
      _routeObject$pageTitl = routeObject.pageTitle,
      pageTitle = _routeObject$pageTitl === void 0 ? document.querySelector('head > title').textContent : _routeObject$pageTitl;
  var routeParts = routeStr.split('?'); // Check if query string is an object

  if (isObject(queryString)) {
    queryString = toQueryString(queryString);
  } // Resolve to URL query string if it's not explicitly passed


  queryString = trim(queryString ? queryString : routeParts[1]);
  routeStr = trim(routeParts[0]); // Check if query preservation is required. Resolve query accordingly

  if (preserveQuery) {
    queryString = resolveQuery.apply(this, [queryString, hashRouting]);
  }

  if (isValidRoute(routeStr)) {
    var unmodifiedRoute = routeStr;

    if (hashRouting) {
      routeStr = "/#".concat(routeStr); // Path preservation should only work for hash routing

      if (preservePath) {
        routeStr = "".concat(routeStr.substring(1));
      }
    } // Append query string


    routeStr = "".concat(routeStr).concat(queryString ? "?".concat(queryString) : '');
    history[replace ? 'replaceState' : 'pushState']({
      data: data
    }, pageTitle, routeStr);

    if (exec && unmodifiedRoute) {
      trigger(this.config.context, VIRTUAL_PUSHSTATE, [{
        path: unmodifiedRoute,
        hash: hashRouting
      }, undefined, this]);
    }
  } else {
    throw new TypeError(INVALID_ROUTE);
  }

  return this;
}

function callOnce(isDone) {
  var _this = this;

  var _this$config = this.config,
      hashRouting = _this$config.hashRouting,
      location = _this$config.location;
  var path = trim(hashRouting ? location.hash.substring(1).split('?')[0] : location.pathname);
  return function (observable) {
    return new Observable(function (subscriber) {
      var subn = observable.subscribe({
        next: function next() {
          subscriber.next.apply(subscriber, arguments);
        },
        error: function error() {
          subscriber.error.apply(subscriber, arguments);
        },
        complete: function complete() {
          subscriber.complete();
        }
      });

      if (!isDone) {
        isDone = true;

        if (path) {
          subscriber.next(new RouterEvent([{
            path: path,
            hash: hashRouting
          }, undefined, _this]));
        }
      }

      return function () {
        subn.unsubscribe();
      };
    });
  };
}

var Router = /*#__PURE__*/function () {
  function Router() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Router);

    if (!window.history.pushState) {
      throw new Error(HISTORY_UNSUPPORTED);
    }

    config = assign({
      hashRouting: false,
      // Switch to hash routing
      preservePath: false,
      // Works for hash routing
      context: document.body,
      // To change the context of "vpushstate" event
      location: window.location,
      // Should remain unchanged
      history: window.history // History object

    }, config);
    this.config = Object.freeze(config);
    this.__paths__ = [];
    bindRouterEvents.apply(this);
  }

  _createClass(Router, [{
    key: "pipe",
    value: function pipe() {
      var _this$listeners;

      return (_this$listeners = this.listeners).pipe.apply(_this$listeners, [callOnce.apply(this)].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "subscribe",
    value: function subscribe() {
      var _this$listeners$pipe;

      return (_this$listeners$pipe = this.listeners.pipe(callOnce.apply(this))).subscribe.apply(_this$listeners$pipe, arguments);
    }
  }, {
    key: "set",
    value: function set$1() {
      return set.apply(this, arguments);
    }
  }, {
    key: "destroy",
    value: function destroy(callback) {
      if (typeof callback === 'function') {
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

function extractParams(expr) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : loc.pathname;
  var params = {};

  if (REG_ROUTE_PARAMS.test(expr)) {
    var pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^/\\]+/g, "([^\\/]+)"));
    REG_ROUTE_PARAMS.lastIndex = 0;

    if (pathRegex.test(path)) {
      var keys = _toConsumableArray(expr.match(REG_ROUTE_PARAMS)).map(function (key) {
        return key.replace(':', '');
      });

      var values = _toConsumableArray(path.match(pathRegex));

      values.shift();
      keys.forEach(function (key, index) {
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
  if (typeof routerInstance === 'boolean') {
    ignoreCase = routerInstance;
    routerInstance = undefined;
  }

  routeStr = trim(routeStr);

  if (routerInstance instanceof Router) {
    var paths = routerInstance.__paths__;

    if (paths.indexOf(routeStr) === -1) {
      paths.push(routeStr);
    }
  }

  return function (observable) {
    return new Observable(function (subscriber) {
      var subn = observable.subscribe({
        next: function next(event) {
          var incomingRoute = event.route;

          if (isValidRoute(routeStr)) {
            if (ignoreCase) {
              routeStr = routeStr.toLowerCase();
              incomingRoute = incomingRoute.toLowerCase();
            }

            var params = extractParams(routeStr, incomingRoute);
            var paramsLength = Object.keys(params).length;

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
        error: function error() {
          subscriber.error.apply(subscriber, arguments);
        },
        complete: function complete() {
          subscriber.complete();
        }
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

function deparam() {
  var coerce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (observable) {
    return new Observable(function (subscriber) {
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
        error: function error() {
          subscriber.error.apply(subscriber, arguments);
        },
        complete: function complete() {
          subscriber.complete();
        }
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
    return new Observable(function (subscriber) {
      var subn = observable.subscribe({
        next: function next(event) {
          if (routerInstance instanceof Router) {
            var paths = routerInstance.__paths__;

            if (paths.length > 0) {
              var currentRoute = event.route;
              var match = false;

              for (var i = 0; i < paths.length; i++) {
                if (paths[i] === currentRoute || Object.keys(extractParams(paths[i], currentRoute)).length) {
                  match = true;
                  break;
                }
              }

              if (!match) {
                event.noMatch = true;
                subscriber.next(event);
              }
            }
          }
        },
        error: function error() {
          subscriber.error.apply(subscriber, arguments);
        },
        complete: function complete() {
          subscriber.complete();
        }
      });
      return function () {
        subn.unsubscribe();
      };
    });
  };
}

function deepComparison(first, second, result) {
  each(Object.keys(first), function (key) {
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
  var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var cache = {};

  if (typeof keys === 'boolean') {
    deep = keys;
    keys = CACHED_FIELDS;
  }

  return function (observable) {
    return new Observable(function (subscriber) {
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
        error: function error() {
          subscriber.error.apply(subscriber, arguments);
        },
        complete: function complete() {
          subscriber.complete();
        }
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

export { Router, index as operators };
//# sourceMappingURL=silkrouter.esm.js.map
