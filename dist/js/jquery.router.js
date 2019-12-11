(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('deparam.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'deparam.js'], factory) :
  (global = global || self, factory(global.jqueryrouter = {}, global.jQuery, global.deparam));
}(this, (function (exports, $, deparam) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  deparam = deparam && deparam.hasOwnProperty('default') ? deparam['default'] : deparam;

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

  var libs = {
    handlers: []
  }; // Variable to check if browser supports history API properly    

  var isHistorySupported = history && history.pushState; // Alias for window.location

  var loc = window.location; // Data cache

  var cache = {
    noTrigger: false
  }; // Regular expressions

  var regex = {
    pathname: /^\/(?=[^?]*)/,
    routeparams: /:[^\/]+/g,
    hashQuery: /\?.+/
  }; // Supported events

  var eventNames = {
    routeChanged: "routeChanged",
    hashchange: "hashchange",
    popstate: "popstate"
  }; // Error messages

  var errorMessage = {
    invalidPath: "Path is invalid"
  };
  /* eslint-disable */

  /**
   * Inner loop function for assign
   * @private
   * @param {object} ref Argument object
   * @param {object} target First object
   */

  function _loopFunc(ref, target) {
    if (ref != null && _typeof(ref) === 'object') {
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


  function _assign() {
    var i = 0;
    var target = arguments[0] && _typeof(arguments[0]) === 'object' ? arguments[0] : {};

    for (i = 1; i < arguments.length; i++) {
      _loopFunc(arguments[i], target);
    }

    return target;
  }
  /* eslint-enable */

  /**
   * Converts any list to JavaScript array
   * @param {any[]} arr Array like object
   */


  function _arr(arr) {
    return Array.prototype.slice.call(arr);
  }
  /**
   * Triggers "routeChanged" event unless "noTrigger" flag is true
   */


  function _triggerRoute(route, eventType) {
    var isHashRoute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isInit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (cache.noTrigger && eventType === eventNames.hashchange) {
      cache.noTrigger = false;
      return;
    }

    var currentData = _assign({}, cache.currentData);

    if (isHashRoute) {
      delete cache.currentData;
    }

    router.events.trigger(eventNames.routeChanged, {
      data: _assign({}, isHashRoute ? currentData : {}, {
        eventType: eventType,
        hash: !!isHashRoute,
        route: route,
        isInit: isInit
      })
    });
  }
  /**
   * Checks if given route is valid
   * @param {string} sRoute Route string
   */


  function _isValidRoute(sRoute) {
    return typeof sRoute === "string" && regex.pathname.test(sRoute);
  }
  /**
   * Adds a query string
   * @param {string} sRoute Route string
   * @param {string} qString Query string
   * @param {boolean} appendQString Append query string flag
   */


  function _resolveQueryString(sRoute, qString, appendQString) {
    if (!qString && !appendQString) return sRoute;

    if (typeof qString === "string") {
      if ((qString = qString.trim()) && appendQString) {
        return "".concat(sRoute).concat(loc.search, "&").concat(qString.replace("?", ""));
      } else if (qString) {
        return "".concat(sRoute, "?").concat(qString.replace("?", ""));
      } else {
        return sRoute;
      }
    }
  }
  /**
   * Converts current query string into an object
   */


  function _getQueryParams() {
    var coerce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var qsObject = deparam(loc.search, coerce),
        hashStringParams = {};

    if (loc.hash.match(regex.hashQuery)) {
      hashStringParams = deparam(loc.hash.match(regex.hashQuery)[0], coerce);
    }

    return _assign({}, qsObject, hashStringParams);
  }
  /**
   * Checks if route is valid and returns the valid route
   * @param {string} sRoute Route string
   * @param {string} qString Query string
   * @param {boolean} appendQString Append query string flag
   */


  function _validateRoute(sRoute, qString, appendQString) {
    if (_isValidRoute(sRoute)) {
      return _resolveQueryString(sRoute, qString, appendQString);
    }

    throw new TypeError(errorMessage.invalidPath);
  }
  /**
   * Set route for given view
   * @param {string|object} oRoute Route string or object
   * @param {boolean} replaceMode Replace mode
   * @param {boolean} noTrigger Do not trigger handler
   */


  function _setRoute(oRoute, replaceMode, noTrigger) {
    if (!oRoute) return;
    var title = null,
        sRoute = "",
        qString = "",
        appendQString = false,
        isHashString = false,
        routeMethod = replaceMode ? "replaceState" : "pushState",
        currentData = {};
    cache.noTrigger = noTrigger;

    if (_typeof(oRoute) === "object") {
      currentData = oRoute.data;
      title = oRoute.title;
      sRoute = oRoute.route;
      qString = oRoute.queryString;
      appendQString = oRoute.appendQuery;
    } else if (typeof oRoute === "string") {
      sRoute = oRoute;
    } // Support for hash routes


    if (sRoute.charAt(0) === "#") {
      isHashString = true;
      sRoute = sRoute.replace("#", "");
    }

    if (isHistorySupported && !isHashString) {
      history[routeMethod](cache.data, title, _validateRoute(sRoute, qString, appendQString));

      if (!noTrigger) {
        currentData = _assign({}, currentData, {
          eventType: eventNames.popstate,
          hash: false,
          route: sRoute
        });
        router.events.trigger(eventNames.routeChanged, {
          data: currentData
        });
      }
    } else {
      cache.currentData = currentData;

      if (replaceMode) {
        loc.replace("#" + _validateRoute(sRoute, qString, appendQString));
      } else {
        loc.hash = _validateRoute(sRoute, qString, appendQString);
      }
    }
  }
  /**
   * Attaches a route handler function
   * @param {string} sRoute Route string
   * @param {function} callback Callback function
   */


  function _route(sRoute, callback) {
    var _this = this;

    if (typeof sRoute === 'function') {
      callback = sRoute;
      sRoute = '*'; // Generic route
    }

    if (!libs.handlers.filter(function (ob) {
      var filterCriteria = ob.originalHandler === callback && ob.route === sRoute;

      if (_this) {
        filterCriteria = filterCriteria && ob.element === _this;
      }

      return filterCriteria;
    }).length) {
      libs.handlers.push({
        eventName: eventNames.routeChanged,
        originalHandler: callback,
        handler: callback.bind(this),
        element: this,
        route: sRoute
      });
    }
  }
  /**
   * 
   * @param {string} sRoute Route string
   * @param {function} callback Callback function
   */


  function _unroute(sRoute, callback) {
    var args = arguments.length;

    if (args.length === 0) {
      libs.handlers.length = 0;
    }

    libs.handlers = libs.handlers.filter(function (routeOb) {
      if (args.length === 1 && typeof args[0] === 'string') {
        return routeOb.route !== sRoute;
      } // Check for generic route


      if (args.length === 1 && typeof args[0] === 'function') {
        callback = args[0];
        sRoute = '*'; // Generic route
      }

      return !(routeOb.route === sRoute && routeOb.handler === callback);
    });
  }
  /**
   * Trims leading/trailing special characters
   * @param {string} param Parameters
   */


  function _sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
  }
  /**
   * Compares route with current URL
   * @param {string} route Route string
   * @param {string} url Current url
   * @param {object} params Parameters
   */


  function _matched(route, url, params) {
    if (~url.indexOf("?")) {
      url = url.substring(0, url.indexOf("?"));
    }

    regex.routeparams.lastIndex = 0;

    if (regex.routeparams.test(route)) {
      params.params = {};
      var pathRegex = new RegExp(route.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));

      if (pathRegex.test(url)) {
        regex.routeparams.lastIndex = 0;

        var keys = _arr(route.match(regex.routeparams)).map(_sanitize),
            values = _arr(url.match(pathRegex));

        values.shift();
        keys.forEach(function (key, index) {
          params.params[key] = values[index];
        });
        return true;
      }
    } else {
      return route === url || route === "*";
    }

    return false;
  }
  /**
   * Triggers a router event
   * @param {string} eventName Name of route event
   * @param {object} params Parameters
   */


  function _routeTrigger(eventName, params) {
    // Ensures that params is always an object
    params = _assign(params);
    params.data = _assign(params.data);
    var _params$data = params.data,
        isHashRoute = _params$data.hash,
        isInit = _params$data.isInit;
    libs.handlers.forEach(function (eventObject) {
      if (eventObject.eventName === eventName) {
        if (isHistorySupported && !isHashRoute && _matched(eventObject.route, loc.pathname, params) && !(isInit && eventObject.called)) {
          eventObject.called = true;
          eventObject.handler(params.data, params.params, _getQueryParams(false));
        } else if (isHashRoute) {
          if (!loc.hash && !isHistorySupported && _matched(eventObject.route, loc.pathname, params)) {
            cache.data = params.data;
            loc.replace("#" + loc.pathname); // <-- This will trigger router handler automatically
          } else if (_matched(eventObject.route, loc.hash.substring(1), params) && !(isInit && eventObject.hashCalled)) {
            eventObject.hashCalled = true;
            eventObject.handler(params.data, params.params, _getQueryParams(false));
          }
        }
      }
    });
  }
  /**
   * Initializes router events
   */


  function _bindRouterEvents() {
    var $win = $(window);
    $win.on(eventNames.popstate, function (e) {
      _triggerRoute.apply(this, [loc.pathname, e.type]);
    });
    $win.on(eventNames.hashchange, function (e, isInit) {
      _triggerRoute.apply(this, [loc.hash, e.type, true, isInit]);
    });
  }

  var router = {
    // Events object
    events: _assign({
      /**
       * Triggers a custom route event
       * @param {string} eventName Name of event
       * @param {object} params Parameters object
       */
      trigger: function trigger(eventName, params) {
        return _routeTrigger.apply(this, [eventName, params]);
      }
    }, eventNames),

    /**
     * Initializes router
     */
    init: function init() {
      // Routing settings
      var settings = {
        eventType: isHistorySupported ? eventNames.popstate : eventNames.hashchange,
        hash: !isHistorySupported,
        route: isHistorySupported ? loc.pathname : loc.hash,
        isInit: true
      }; // Triggers route change event on initialize

      this.events.trigger(eventNames.routeChanged, {
        data: settings
      }); // Triggers a hashchange event on initialize if url hash is available

      if (loc.hash) {
        $(window).trigger(eventNames.hashchange, [true]);
      }
    },

    /**
     * Sets a route url
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set: function set() {
      return _setRoute.apply(this, arguments);
    },
    // Flag to check if history API is supported in current browser
    historySupported: !!isHistorySupported
  };
  /**
   * Attaches a route handler
   * @param {string|function} route Route string or handler function (in case of generic route)
   * @param {function} handler Handler function
   */

  function route() {
    return _route.apply(this, arguments);
  }
  /**
   * Detaches a route handler
   * @param {string|function} route Route string or handler function (in case of generic route)
   * @param {function} handler Handler function
   */


  function unroute() {
    return _unroute.apply(this, arguments);
  } // Hooking route and router to jQuery


  if (typeof $ === 'function') {
    $.route = $.prototype.route = route;
    $.unroute = $.prototype.unroute = unroute;
    $.router = router;
  }

  _bindRouterEvents();

  exports.route = route;
  exports.router = router;
  exports.unroute = unroute;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jquery.router.js.map
