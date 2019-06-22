/**!
 * Router plugin for single page applications with routes
 * Released under MIT license
 * @name Silk router
 * @author Sachin Singh <ssingh.300889@gmail.com>
 * @version 3.0.2
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('deparam.js'), require('lzstorage')) :
  typeof define === 'function' && define.amd ? define(['exports', 'deparam.js', 'lzstorage'], factory) :
  (global = global || self, factory(global.silkrouter = {}, global.deparam, global.LZStorage));
}(this, function (exports, deparam, LZStorage) { 'use strict';

  deparam = deparam && deparam.hasOwnProperty('default') ? deparam['default'] : deparam;
  LZStorage = LZStorage && LZStorage.hasOwnProperty('default') ? LZStorage['default'] : LZStorage;

  function _typeof(obj) {
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

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * Router constants
   */
  var HASH_CHANGE = 'hashchange';
  var POP_STATE = 'popstate';
  var ROUTE_CHANGED = 'route.changed';
  var REG_ROUTE_PARAMS = /:[^\/]+/g;
  var REG_PATHNAME = /^\/(?=[^?]*)/;
  var REG_HASH_QUERY = /\?.+/;
  var INVALID_ROUTE = 'Route string is not a pure route';

  var store = new LZStorage({
    compression: true
  });
  /**
   * Store library
   * @namespace libs
   * @type {object}
   * @private
   */

  var libs = {
    /**
     * Get's decompressed data from store
     * @private
     * @method getDataFromStore
     * @memberof libs
     * @param {string} path URL path
     * @param {boolean} isHash Flag to determine if it's a pathname or hash
     * @returns {*}
     */
    getDataFromStore: function getDataFromStore(path, isHash) {
      var paths = store.get('routeStore') || {};
      return paths["".concat(isHash ? '#' : '').concat(path)];
    },

    /**
     * @private
     * @method setDataToStore
     * @memberof libs
     * @param {string} path URL path
     * @param {boolean} isHash Flag to determine if it's a pathname or hash
     * @param {any} data Data
     * @returns {boolean}
     */
    setDataToStore: function setDataToStore(path, isHash, data) {
      var paths = store.get('routeStore') || {};

      if (paths[path]) {
        if (!data || _typeof(data) === 'object' && Object.keys(data).length === 0) {
          // Don't change existing data
          return false;
        }
      }

      paths = _objectSpread({}, paths, _defineProperty({}, "".concat(isHash ? '#' : '').concat(path), data));
      return store.set('routeStore', paths, true);
    },

    /**
     * @namespace handlers
     * @type {object[]}
     * @private
     */
    handlers: []
  };

  /**
   * Trims leading/trailing special characters
   * @private
   * @param {string} param Parameters
   */

  function sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
  }
  /**
   * Triggers "route.changed" event
   * @private
   * @param {object} config Route event configuration
   * @param {object} config.originalEvent Original "popstate" event object
   * @param {string} config.route route string
   * @param {string} config.type Type of event
   * @param {boolean} config.hash Flag that determines type of event expected
   * @param {object} config.originalData Original data persisted by history API
   */


  function triggerRoute(_ref) {
    var _ref$originalEvent = _ref.originalEvent,
        originalEvent = _ref$originalEvent === void 0 ? {} : _ref$originalEvent,
        route = _ref.route,
        type = _ref.type,
        _ref$hash = _ref.hash,
        hash = _ref$hash === void 0 ? false : _ref$hash,
        _ref$originalData = _ref.originalData,
        originalData = _ref$originalData === void 0 ? {} : _ref$originalData;
    trigger(ROUTE_CHANGED, {
      originalEvent: originalEvent,
      route: route,
      type: type,
      hash: hash
    }, originalData);
  }
  /**
   * Checks if given route is valid
   * @private
   * @param {string} route Route string
   */


  function isValidRoute(route) {
    if (typeof route !== "string") {
      return false;
    }
    return REG_PATHNAME.test(route);
  }
  /**
   * Adds a query string
   * @private
   * @param {string} route Route string
   * @param {string} qString Query string
   * @param {boolean} appendQString Append query string flag
   */


  function resolveQuery() {
    var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var isHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var queryString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var append = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    queryString = queryString.charAt(0) === '?' ? queryString.substring(1).trim() : queryString.trim();

    if (!isHash) {
      if (append) {
        if (queryString) {
          return "".concat(route).concat(location.search, "&").concat(queryString);
        }

        return "".concat(route).concat(location.search);
      } else if (queryString) {
        return "".concat(route, "?").concat(queryString);
      }

      return route;
    } else if (queryString) {
      return "".concat(location.pathname).concat(location.search, "#").concat(route, "?").concat(queryString);
    }

    return "".concat(location.pathname).concat(location.search, "#").concat(route);
  }
  /**
   * Converts current query string into an object
   * @private
   */


  function getQueryParams() {
    var coerce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var qsObject = deparam(window.location.search, coerce);
    var hashStringParams = {};

    if (window.location.hash.match(REG_HASH_QUERY)) {
      hashStringParams = _objectSpread({}, hashStringParams, deparam(window.location.hash.match(REG_HASH_QUERY)[0], coerce));
    }

    return _objectSpread({}, qsObject, hashStringParams);
  }
  /**
   * Set route for given view
   * @private
   * @param {string|object} oRoute Route string or object
   * @param {boolean} replaceMode Replace mode
   * @param {boolean} noTrigger Do not trigger handler
   */


  function execRoute() {
    var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var replaceMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var noTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var routeObject = typeof route === 'string' ? {
      route: route
    } : _objectSpread({}, route);
    routeObject = _objectSpread({}, routeObject, {
      replaceMode: replaceMode,
      noTrigger: noTrigger
    });
    var _routeObject = routeObject,
        sroute = _routeObject.route,
        rm = _routeObject.replaceMode,
        nt = _routeObject.noTrigger,
        _routeObject$queryStr = _routeObject.queryString,
        qs = _routeObject$queryStr === void 0 ? '' : _routeObject$queryStr,
        data = _routeObject.data,
        _routeObject$title = _routeObject.title,
        title = _routeObject$title === void 0 ? null : _routeObject$title,
        appendQuery = _routeObject.appendQuery;

    if (typeof sroute === 'string') {
      var isHash = sroute.charAt(0) === '#' ? 1 : 0;

      var _sroute$trim$split = sroute.trim().split('?'),
          _sroute$trim$split2 = _slicedToArray(_sroute$trim$split, 2),
          pureRoute = _sroute$trim$split2[0],
          _sroute$trim$split2$ = _sroute$trim$split2[1],
          queryString = _sroute$trim$split2$ === void 0 ? '' : _sroute$trim$split2$;

      var routeMethod = "".concat(rm ? 'replace' : 'push', "State");
      queryString = queryString || qs;
      pureRoute = pureRoute.substring(isHash);

      if (isValidRoute(pureRoute)) {
        libs.setDataToStore(pureRoute, isHash === 1, data);
        var completeRoute = resolveQuery(pureRoute, isHash === 1, queryString, appendQuery);
        history[routeMethod]({
          data: data
        }, title, completeRoute);

        if (!nt) {
          triggerRoute({
            route: "".concat(isHash ? '#' : '').concat(pureRoute),
            type: isHash ? HASH_CHANGE : POP_STATE,
            hash: isHash === 1
          });
        }
      } else {
        throw new Error(INVALID_ROUTE);
      }
    }
  }
  /**
   * Attaches a route handler function
   * @private
   * @param {string} route Route string
   * @param {function} handler Callback function
   */

  function bindRoute(route, handler) {
    // Resolve generic route
    if (typeof route === 'function') {
      handler = route;
      route = '*';
    }

    var startIndex = route.charAt(0) === '#' ? 1 : 0;
    route = route.substring(startIndex); // Check existence

    var exists = libs.handlers.filter(function (ob) {
      return ob.handler === handler && ob.route === route;
    }).length; // Attach handler

    if (!exists && typeof handler === 'function') {
      libs.handlers.push({
        eventName: ROUTE_CHANGED,
        handler: handler,
        route: route,
        hash: startIndex === 1
      });
    } // Execute handler if matches current route (Replaces init method in version 2.0)


    var _window$location = window.location,
        pathname = _window$location.pathname,
        hash = _window$location.hash;
    var paths = startIndex === 1 ? [hash] : [pathname, hash];
    paths.filter(function (path) {
      return path.trim();
    }).forEach(function (currentPath) {
      var pathIndex = currentPath.charAt(0) === '#' ? 1 : 0;

      var _testRoute = testRoute(route, currentPath),
          hasMatch = _testRoute.hasMatch,
          data = _testRoute.data,
          params = _testRoute.params;

      if (hasMatch && typeof handler === 'function') {
        handler({
          route: currentPath,
          hash: pathIndex === 1,
          eventName: pathIndex === 1 ? HASH_CHANGE : POP_STATE,
          data: data,
          params: params,
          query: getQueryParams()
        });
      }
    });
  }
  /**
   * Unbinds route handlers
   * @private
   * @param {string} route Route string
   * @param {function} handler Callback function
   */

  function unbindRoute(route, handler) {
    var args = arguments;

    if (args.length === 0) {
      libs.handlers.length = 0;
    }

    libs.handlers = libs.handlers.filter(function (ob) {
      if (args.length === 1 && typeof args[0] === 'string') {
        return ob.route !== route;
      } // Check for generic route


      if (args.length === 1 && typeof args[0] === 'function') {
        handler = args[0];
        route = '*'; // Generic route
      }

      return !(ob.route === route && ob.handler === handler);
    });
  }
  /**
   * Compares route with current URL
   * @private
   * @param {string} route Route string
   * @param {string} url Current url
   * @param {object} params Parameters
   */

  function testRoute(route, url) {
    var originalData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isHash = url.charAt(0) === '#';

    if (isHash) {
      url = url.substring(1);
    }

    var _url$split = url.split('?'),
        _url$split2 = _slicedToArray(_url$split, 1),
        path = _url$split2[0];

    if (!!Object.keys(originalData).length) {
      libs.setDataToStore(path, isHash, originalData); // Sync store with event data.
    }

    var data = libs.getDataFromStore(path, isHash);
    var params = {};
    var hasMatch = false;
    REG_ROUTE_PARAMS.lastIndex = 0;

    if (REG_ROUTE_PARAMS.test(route)) {
      var pathRegex = new RegExp(route.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));

      if (pathRegex.test(url)) {
        hasMatch = true;
        REG_ROUTE_PARAMS.lastIndex = 0;

        var keys = _toConsumableArray(route.match(REG_ROUTE_PARAMS)).map(sanitize);

        var values = _toConsumableArray(url.match(pathRegex));

        values.shift();
        keys.forEach(function (key, index) {
          params[key] = values[index];
        });
      }
    } else {
      hasMatch = isValidRoute(url) && (route === url || route === '*');
    }

    return {
      hasMatch: hasMatch,
      data: data,
      params: params
    };
  }
  /**
   * Triggers a router event
   * @private
   * @param {string} eventName Name of route event
   * @param {object} params Parameters
   */


  function execListeners(eventName, routeConfig) {
    var originalData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isHash = routeConfig.hash;
    var _window$location2 = window.location,
        hash = _window$location2.hash,
        pathname = _window$location2.pathname;
    libs.handlers.forEach(function (ob) {
      if (ob.eventName === eventName) {
        var _testRoute2 = testRoute(ob.route, isHash ? hash : pathname, originalData),
            hasMatch = _testRoute2.hasMatch,
            data = _testRoute2.data,
            params = _testRoute2.params;

        if (hasMatch && (!ob.hash || ob.hash && isHash)) {
          ob.handler(_objectSpread({}, routeConfig, {
            data: data,
            params: params,
            query: getQueryParams()
          }));
        }
      }
    });
  }
  /**
   * Internal method to trigger a routing event
   * @private
   */


  function trigger() {
    return execListeners.apply(this, arguments);
  }
  /**
   * Initializes router events
   * @private
   */

  function initRouterEvents() {
    window.addEventListener("".concat(POP_STATE), function (e) {
      var completePath = "".concat(location.pathname).concat(location.hash);

      var _completePath$split = completePath.split('#'),
          _completePath$split2 = _slicedToArray(_completePath$split, 2),
          pathname = _completePath$split2[0],
          hashstring = _completePath$split2[1];

      var originalData = {};

      if (e.state) {
        var data = e.state.data;

        if (data) {
          originalData = data;
        }
      }

      triggerRoute({
        originalEvent: e,
        route: pathname,
        type: e.type,
        hash: false,
        originalData: originalData
      });

      if (hashstring) {
        triggerRoute({
          originalEvent: e,
          route: "#".concat(hashstring),
          type: HASH_CHANGE,
          hash: true,
          originalData: originalData
        });
      }
    });
  }

  /**
   * @namespace router
   * @public
   * @type {object}
   */

  var router = {
    /**
     * @namespace api
     * @memberof router
     * @type {object}
     */
    api: {
      /**
       * Triggers a custom route event
       * @method trigger
       * @public
       * @memberof router.api
       * @param {...*} arguments
       */
      trigger: function trigger$1() {
        return trigger.apply(this, arguments);
      }
    },

    /**
     * Sets a route url
     * @public
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set: function set() {
      return execRoute.apply(this, arguments);
    }
  };
  /**
   * Attaches a route handler
   * @public
   * @param {string|function} route Route string or handler function (in case of generic route)
   * @param {function} handler Handler function
   */

  function route() {
    return bindRoute.apply(this, arguments);
  }
  /**
   * Detaches a route handler
   * @public
   * @param {string|function} route Route string or handler function (in case of generic route)
   * @param {function} handler Handler function
   */


  function unroute() {
    return unbindRoute.apply(this, arguments);
  }

  initRouterEvents();

  exports.route = route;
  exports.router = router;
  exports.unroute = unroute;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=silkrouter.js.map
