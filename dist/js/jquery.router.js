(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('jquerydeparam'), require('lzstorage')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'jquerydeparam', 'lzstorage'], factory) :
  (global = global || self, factory(global.jqueryrouter = {}, global.jQuery, global.deparam, global.LZStorage));
}(this, function (exports, $, deparam, LZStorage) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  deparam = deparam && deparam.hasOwnProperty('default') ? deparam['default'] : deparam;
  LZStorage = LZStorage && LZStorage.hasOwnProperty('default') ? LZStorage['default'] : LZStorage;

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
  var libs = {
    getDataFromStore: function getDataFromStore(path) {
      var paths = $.extend({}, store.get('routeStore'));
      return paths[path];
    },
    setDataToStore: function setDataToStore(path, data) {
      var paths = $.extend({}, store.get('routeStore'));
      $.extend(paths, _defineProperty({}, path, data));
      return store.set('routeStore', paths, true);
    },
    handlers: []
  };

  var isHistorySupported = !!(history && history.pushState); // Variable to ignore hashchange event

  var ignoreHashChange = false;
  /**
   * Trims leading/trailing special characters
   * @param {string} param Parameters
   */

  function sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
  }
  /**
   * Triggers "routeChanged" event unless "noTrigger" flag is true
   */


  function triggerRoute(route, eventType) {
    var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var noTrigger = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (noTrigger) {
      ignoreHashChange = false;
    } else {
      router.api.trigger(ROUTE_CHANGED, {
        route: route,
        eventType: eventType,
        hash: hash
      });
    }
  }
  /**
   * Checks if given route is valid
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
   * @param {string} route Route string
   * @param {string} qString Query string
   * @param {boolean} appendQString Append query string flag
   */


  function resolveQuery(route, queryString, append) {
    if (typeof queryString === 'string') {
      queryString = queryString.trim();

      if (queryString.charAt(0) === '?') {
        queryString = queryString.substring(1);
      }

      if (append && queryString) {
        return "".concat(route).concat(window.location.search, "&").concat(queryString);
      }

      if (!append && queryString) {
        return "".concat(route, "?").concat(queryString);
      }
    }

    return route;
  }
  /**
   * Converts current query string into an object
   */


  function getQueryParams() {
    var qsObject = deparam(window.location.search);
    var hashStringParams = {};

    if (window.location.hash.match(REG_HASH_QUERY)) {
      $.extend(hashStringParams, deparam(window.location.hash.match(REG_HASH_QUERY)[0]));
    }

    return $.extend(qsObject, hashStringParams);
  }
  /**
   * Set route for given view
   * @param {string|object} oRoute Route string or object
   * @param {boolean} replaceMode Replace mode
   * @param {boolean} noTrigger Do not trigger handler
   */


  function execRoute(route, replaceMode, noTrigger) {
    var routeObject = typeof route === 'string' ? {
      route: route
    } : $.extend({}, route);
    $.extend(routeObject, {
      replaceMode: replaceMode,
      noTrigger: noTrigger
    });
    var sroute = routeObject.route,
        rm = routeObject.replaceMode,
        nt = routeObject.noTrigger,
        qs = routeObject.queryString,
        data = routeObject.data,
        _routeObject$title = routeObject.title,
        title = _routeObject$title === void 0 ? null : _routeObject$title,
        appendQuery = routeObject.appendQuery;

    if (typeof sroute === 'string') {
      var isHash = sroute.charAt(0) === '#' ? 1 : 0;

      var _sroute$trim$split = sroute.trim().split('?'),
          _sroute$trim$split2 = _slicedToArray(_sroute$trim$split, 2),
          pureRoute = _sroute$trim$split2[0],
          queryString = _sroute$trim$split2[1];

      var routeMethod = "".concat(rm ? 'replace' : 'push', "State");
      queryString = queryString || qs;
      ignoreHashChange = nt;
      pureRoute = pureRoute.substring(isHash);

      if (isValidRoute(pureRoute)) {
        libs.setDataToStore(pureRoute, data);

        if (isHistorySupported && !isHash) {
          history[routeMethod]({
            data: data
          }, title, resolveQuery(pureRoute, queryString, appendQuery));

          if (!nt) {
            router.api.trigger(ROUTE_CHANGED, {
              route: pureRoute,
              eventType: POP_STATE,
              hash: false
            });
          }
        } else if (rm) {
          window.location.replace("#".concat(resolveQuery(pureRoute, queryString, appendQuery)));
        } else {
          window.location.hash = resolveQuery(pureRoute, queryString, appendQuery);
        }
      } else {
        throw new Error(INVALID_ROUTE);
      }
    }
  }
  /**
   * Attaches a route handler function
   * @param {string} route Route string
   * @param {function} handler Callback function
   */


  function bindRoute(route, handler) {
    var _this = this;

    var originalHandler = handler;
    var element = this;

    if (typeof handler === 'function') {
      handler = handler.bind(this);
    } // Resolve generic route


    if (typeof route === 'function') {
      originalHandler = route;
      handler = route.bind(this);
      route = '*';
    } // Check existence


    var exists = libs.handlers.filter(function (ob) {
      var test = ob.originalHandler === originalHandler && ob.route === route;

      if (_this) {
        test = test && ob.element === _this;
      }

      return test;
    }).length; // Attach handler

    if (!exists && typeof handler === 'function') {
      libs.handlers.push({
        eventName: ROUTE_CHANGED,
        originalHandler: originalHandler,
        handler: handler,
        element: element,
        route: route
      });
    } // Execute handler if matches current route (Replaces init method in version 2.0)


    var _window$location = window.location,
        pathname = _window$location.pathname,
        hash = _window$location.hash;
    [pathname, hash].forEach(function (currentPath) {
      var isHash = currentPath.charAt(0) === '#' ? 1 : 0;

      var _testRoute = testRoute(route, currentPath),
          hasMatch = _testRoute.hasMatch,
          data = _testRoute.data,
          params = _testRoute.params;

      if (hasMatch && typeof handler === 'function') {
        handler({
          route: currentPath,
          hash: isHash === 1,
          eventName: isHash ? HASH_CHANGE : POP_STATE,
          data: data,
          params: params,
          query: getQueryParams()
        });
      }
    });
  }
  /**
   * Unbinds route handlers
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
   * @param {string} route Route string
   * @param {string} url Current url
   * @param {object} params Parameters
   */


  function testRoute(route, url) {
    if (url.charAt(0) === '#') {
      url = url.substring(1);
    }

    var _url$split = url.split('?'),
        _url$split2 = _slicedToArray(_url$split, 1),
        path = _url$split2[0];

    var data = $.extend({}, libs.getDataFromStore(path));
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
   * @param {string} eventName Name of route event
   * @param {object} params Parameters
   */


  function execListeners(eventName, routeConfig) {
    var isHash = routeConfig.hash;
    var _window$location2 = window.location,
        hash = _window$location2.hash,
        pathname = _window$location2.pathname;
    libs.handlers.forEach(function (ob) {
      if (ob.eventName === eventName) {
        var _testRoute2 = testRoute(ob.route, isHistorySupported && !isHash ? pathname : hash || pathname),
            hasMatch = _testRoute2.hasMatch,
            data = _testRoute2.data,
            params = _testRoute2.params;

        if (!isHistorySupported && !hash) {
          // Fallback to hash routes for older browsers
          window.location.replace("#".concat(pathname));
        } else if (hasMatch) {
          ob.handler($.extend(routeConfig, {
            data: data,
            params: params,
            query: getQueryParams()
          }));
        }
      }
    });
  }
  /**
   * Initializes router events
   */


  function initRouterEvents() {
    $(window).on("".concat(POP_STATE, " ").concat(HASH_CHANGE), function (e) {
      var isHash = e.type === 'hashchange';
      var noTrigger = ignoreHashChange;
      return triggerRoute.apply(this, [window.location[isHash ? 'hash' : 'pathname'], e.type, isHash, noTrigger]);
    });
  }

  var router = {
    // Events object
    api: {
      /**
       * Triggers a custom route event
       * @param {string} eventName Name of event
       * @param {object} params Parameters object
       */
      trigger: function trigger(eventName, routeConfig) {
        return execListeners.apply(this, [eventName, routeConfig]);
      }
    },

    /**
     * Sets a route url
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set: function set() {
      return execRoute.apply(this, arguments);
    },
    // Flag to check if history API is supported in current browser
    isHistorySupported: isHistorySupported
    /**
     * Attaches a route handler
     * @param {string|function} route Route string or handler function (in case of generic route)
     * @param {function} handler Handler function
     */

  };

  function route() {
    return bindRoute.apply(this, arguments);
  }
  /**
   * Detaches a route handler
   * @param {string|function} route Route string or handler function (in case of generic route)
   * @param {function} handler Handler function
   */


  function unroute() {
    return unbindRoute.apply(this, arguments);
  } // Hooking route and router to jQuery


  if (typeof $ === 'function') {
    $.route = $.prototype.route = route;
    $.unroute = $.prototype.unroute = unroute;
    $.router = router;
  }

  initRouterEvents();

  exports.router = router;
  exports.route = route;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=jquery.router.js.map
