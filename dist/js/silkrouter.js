/**!
 * Router plugin for single page applications with routes
 * Released under MIT license
 * @name Silk router
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version 3.3.0
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lzstorage')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lzstorage'], factory) :
  (global = global || self, factory(global.silkrouter = {}, global.LZStorage));
}(this, function (exports, LZStorage) { 'use strict';

  LZStorage = LZStorage && LZStorage.hasOwnProperty('default') ? LZStorage['default'] : LZStorage;

  var HASH_CHANGE = 'hashchange';
  var POP_STATE = 'popstate';
  var ROUTE_CHANGED = 'route.changed';
  var REG_ROUTE_PARAMS = /:[^\/]+/g;
  var REG_PATHNAME = /^\/(?=[^?]*)/;
  var REG_HASH_QUERY = /\?.+/;
  var REG_TRIM_SPECIALCHARS = /^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g;
  var INVALID_ROUTE = 'Route string is not a pure route';
  var CASE_INSENSITIVE_FLAG = '$$';

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

  function loopFunc(ref, target) {
    if (ref != null && _typeof(ref) === 'object') {
      Object.keys(ref).forEach(function (key) {
        target[key] = ref[key];
      });
    }
  }

  function assign() {
    var i = 0;
    var target = _typeof(arguments[0]) !== 'object' || arguments[0] == null ? {} : arguments[0];

    for (i = 1; i < arguments.length; i++) {
      loopFunc(arguments[i], target);
    }

    return target;
  }

  var store = new LZStorage({
    compression: true
  });

  var libs = {

    getDataFromStore: function getDataFromStore(path, isHash) {
      var paths = store.get('routeStore') || {};
      return paths["".concat(isHash ? '#' : '').concat(path)];
    },

    setDataToStore: function setDataToStore(path, isHash, data) {
      var paths = store.get('routeStore') || {};

      if (paths[path]) {
        if (!data || _typeof(data) === 'object' && Object.keys(data).length === 0) {

          return false;
        }
      }

      var newPath = {};
      newPath["".concat(isHash ? '#' : '').concat(path)] = data;
      paths = assign({}, paths, newPath);
      return store.set('routeStore', paths, true);
    },

    handlers: []
  };

  var isArr = Array.isArray;

  function trim(str) {
    return typeof str === 'string' ? str.trim() : '';
  }

  function isNumber(key) {
    key = trim("".concat(key));
    if (['null', 'undefined', ''].indexOf(key) > -1) return false;
    return !isNaN(Number(key));
  }

  function isObject(key) {
    return key != null && !isArr(key) && key.toString() === "[object Object]";
  }

  function setDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
  }

  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function isValidRoute(route) {
    return typeof route === 'string' && REG_PATHNAME.test(route);
  }

  function extractParams(expr) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.pathname;

    if (REG_ROUTE_PARAMS.test(expr)) {
      var pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
      var params = {};

      if (pathRegex.test(path)) {
        REG_ROUTE_PARAMS.lastIndex = 0;
        var keys = toArray(expr.match(REG_ROUTE_PARAMS)).map(function (key) {
          return key.replace(REG_TRIM_SPECIALCHARS, '');
        });
        var values = toArray(path.match(pathRegex));
        values.shift();
        keys.forEach(function (key, index) {
          params[key] = values[index];
        });
      }

      return params;
    }

    return {};
  }

  function buildQueryString(queryStringParts, key, obj) {
    if (obj && _typeof(obj) === 'object') {
      var isCurrObjArray = isArr(obj);
      Object.keys(obj).forEach(function (obKey) {
        var qKey = isCurrObjArray ? '' : obKey;
        buildQueryString(queryStringParts, "".concat(key, "[").concat(qKey, "]"), obj[obKey]);
      });
    } else if (['string', 'number', 'boolean', 'undefined', 'object'].indexOf(_typeof(obj)) > -1) {
      queryStringParts.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj)));
    }
  }

  function toQueryString(obj) {
    var queryStringParts = [];

    if (obj && _typeof(obj) === 'object') {
      Object.keys(obj).forEach(function (key) {
        buildQueryString(queryStringParts, key, obj[key]);
      });
      return queryStringParts.join('&');
    } else if (typeof obj === 'string') {
      return obj;
    }

    return '';
  }

  var loc = window.location;

  function ifComplex(q) {
    return /\[/.test(q);
  }

  function deparam(qs, coerce) {
    var _this = this;

    qs = trim(setDefault(qs, loc.search));
    coerce = setDefault(coerce, true);

    if (qs.charAt(0) === "?") {
      qs = qs.replace("?", "");
    }

    var queryParamList = qs.split("&");
    var queryObject = {};

    if (qs) {
      queryParamList.forEach(function (qq) {
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

  function toObject(arr) {
    var convertedObj = {};

    if (isArr(arr)) {
      arr.forEach(function (value, index) {
        convertedObj[index] = value;
      });
    }

    return convertedObj;
  }

  function resolve(ob, isNextNumber) {
    if (typeof ob === "undefined") return isNextNumber ? [] : {};
    return isNextNumber ? ob : toObject(ob);
  }

  function resolveObj(ob, nextProp) {
    if (isObject(ob)) return {
      ob: ob
    };
    if (isArr(ob) || typeof ob === "undefined") return {
      ob: resolve(ob, isNumber(nextProp))
    };
    return {
      ob: [ob],
      push: ob !== null
    };
  }

  function complex(key, value, obj, doCoerce) {
    doCoerce = setDefault(doCoerce, true);
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
        var _resolveObj = resolveObj(obj[prop], nextProp),
            ob = _resolveObj.ob,
            push = _resolveObj.push;

        obj[prop] = ob;

        if (push) {
          var tempObj = {};
          tempObj[nextProp] = doCoerce ? coerce(value) : value;
          obj[prop].push(tempObj);
        } else {
          obj[prop][nextProp] = doCoerce ? coerce(value) : value;
        }
      } else {
        simple([match[1], value], obj, true);
      }
    }
  }

  function simple(qArr, queryObject, toArray, doCoerce) {
    doCoerce = setDefault(doCoerce, true);
    var key = qArr[0];
    var value = qArr[1];

    if (doCoerce) {
      value = coerce(value);
    }

    if (key in queryObject) {
      queryObject[key] = isArr(queryObject[key]) ? queryObject[key] : [queryObject[key]];
      queryObject[key].push(value);
    } else {
      queryObject[key] = toArray ? [value] : value;
    }
  }

  function coerce(value) {
    if (value == null) return "";
    if (typeof value !== "string") return value;
    value = trim(value);
    if (isNumber(value)) return +value;

    switch (value) {
      case "null":
        return null;

      case "undefined":
        return undefined;

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

  function lib() {
    return deparam.apply(this, arguments);
  }

  function triggerRoute(_ref) {
    var originalEvent = _ref.originalEvent,
        route = _ref.route,
        type = _ref.type,
        hash = _ref.hash,
        originalData = _ref.originalData;
    trigger(ROUTE_CHANGED, {
      originalEvent: originalEvent,
      route: route,
      type: type,
      hash: hash
    }, originalData);
  }

  function resolveQuery(route, isHash, queryString, append) {
    queryString = trim(queryString.substring(queryString.charAt(0) === '?' ? 1 : 0));

    if (!isHash) {
      if (append) {
        return "".concat(route).concat(loc.search).concat(queryString ? "&".concat(queryString) : '');
      }

      return "".concat(route).concat(queryString ? "?".concat(queryString) : '');
    }

    return "".concat(loc.pathname).concat(loc.search, "#").concat(route).concat(queryString ? "?".concat(queryString) : '');
  }

  function getQueryParams() {
    var qsObject = lib(loc.search, false);
    var hashStringParams = {};
    var hashQuery = loc.hash.match(REG_HASH_QUERY);

    if (hashQuery) {
      hashStringParams = assign({}, hashStringParams, lib(hashQuery[0], false));
    }

    return assign({}, qsObject, hashStringParams);
  }

  function execRoute(route, replaceMode, noTrigger) {
    var routeObject = typeof route === 'string' ? {
      route: route
    } : assign({}, route);
    routeObject = assign({}, routeObject, {
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
      var routeParts = trim(sroute).split('?');
      var pureRoute = routeParts[0];
      var queryString = trim(routeParts[1]);
      var routeMethod = "".concat(rm ? 'replace' : 'push', "State");
      queryString = toQueryString(queryString || qs);
      pureRoute = pureRoute.substring(isHash);

      if (isValidRoute(pureRoute)) {
        libs.setDataToStore(pureRoute, isHash === 1, data);
        var completeRoute = resolveQuery(pureRoute, isHash === 1, queryString, appendQuery);
        history[routeMethod]({
          data: data
        }, title, completeRoute);

        if (!nt) {
          triggerRoute({
            originalEvent: {},
            route: "".concat(isHash ? '#' : '').concat(pureRoute),
            type: isHash ? HASH_CHANGE : POP_STATE,
            hash: isHash === 1,
            originalData: {}
          });
        }
      } else {
        throw new Error(INVALID_ROUTE);
      }
    }
  }

  function bindGenericRoute(route, handler) {
    var _this = this;

    if (libs.handlers.filter(function (ob) {
      return ob.prevHandler === handler;
    }).length) {
      return;
    }

    bindRoute(function () {
      if (typeof handler === 'function') {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var e = args[0];
        var compareRoute = e.route;

        if (compareRoute.charAt(0) === '#') {
          compareRoute = compareRoute.substring(1);
        }

        if (route.indexOf(compareRoute) > -1) {
          handler.apply(_this, args);
        } else if (route.indexOf("#".concat(compareRoute)) > -1 && e.hash) {
          handler.apply(_this, args);
        }
      }
    }, handler);
  }

  function bindRoute(route, handler, prevHandler) {

    var isCaseInsensitive = false;

    if (typeof route === 'function') {
      prevHandler = handler;
      handler = route;
      route = '*';
    }

    if (isArr(route)) {
      bindGenericRoute(route, handler);
      return;
    }

    if (route.indexOf(CASE_INSENSITIVE_FLAG) === 0) {
      isCaseInsensitive = true;
      route = route.substring(CASE_INSENSITIVE_FLAG.length);
    }

    var startIndex = route.charAt(0) === '#' ? 1 : 0;
    route = route.substring(startIndex);

    var exists = libs.handlers.filter(function (ob) {
      return ob.handler === handler && ob.route === route;
    }).length;

    if (!exists && typeof handler === 'function') {
      libs.handlers.push({
        eventName: ROUTE_CHANGED,
        handler: handler,
        prevHandler: prevHandler,
        route: route,
        hash: startIndex === 1,
        isCaseInsensitive: isCaseInsensitive
      });
    }

    var pathname = loc.pathname,
        hash = loc.hash;
    var paths = startIndex === 1 ? [hash] : [pathname, hash];
    paths.filter(function (path) {
      return trim(path);
    }).forEach(function (currentPath) {
      var cRoute = route;
      var cCurrentPath = currentPath;

      if (isCaseInsensitive) {
        cRoute = cRoute.toLowerCase();
        cCurrentPath = cCurrentPath.toLowerCase();
      }

      var pathIndex = currentPath.charAt(0) === '#' ? 1 : 0;

      var _testRoute = testRoute(cRoute, cCurrentPath),
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
          query: getQueryParams(),
          isCaseInsensitive: isCaseInsensitive
        });
      }
    });
  }

  function unbindRoute() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var route = args[0],
        handler = args[1];
    var prevLength = libs.handlers.length;
    var isRouteList = false;

    if (args.length === 0) {
      libs.handlers.length = 0;
    }

    if (isArr(route)) {
      route = '*';
      isRouteList = true;
    }

    libs.handlers = libs.handlers.filter(function (ob) {
      if (args.length === 1 && typeof args[0] === 'string' && !isRouteList) {
        return ob.route !== route;
      }

      if (args.length === 1 && typeof args[0] === 'function') {
        handler = args[0];
        route = '*';
      }

      return !(ob.route === route && (ob.handler === handler || ob.prevHandler === handler));
    });
    return prevLength > libs.handlers.length;
  }

  function testRoute(route, url, originalData) {
    originalData = assign(originalData);
    var isHash = url.charAt(0) === '#';

    if (isHash) {
      url = url.substring(1);
    }

    var path = url.split('?')[0];

    if (!!Object.keys(originalData).length) {
      libs.setDataToStore(path, isHash, originalData);
    }

    var data = libs.getDataFromStore(path, isHash);
    var params = extractParams(route, url);
    var hasMatch = Object.keys(params).length > 0 || isValidRoute(url) && (route === url || route === '*');
    return {
      hasMatch: hasMatch,
      data: data,
      params: params
    };
  }

  function execListeners(eventName, routeConfig, originalData) {
    originalData = assign(originalData);
    var isHash = routeConfig.hash;
    var hash = loc.hash,
        pathname = loc.pathname;
    libs.handlers.forEach(function (ob) {
      if (ob.eventName === eventName) {
        var cRoute = ob.route;
        var cCurrentPath = isHash ? hash : pathname;

        if (ob.isCaseInsensitive) {
          cRoute = cRoute.toLowerCase();
          cCurrentPath = cCurrentPath.toLowerCase();
        }

        var _testRoute2 = testRoute(cRoute, cCurrentPath, originalData),
            hasMatch = _testRoute2.hasMatch,
            data = _testRoute2.data,
            params = _testRoute2.params;

        if (hasMatch && (!ob.hash || ob.hash && isHash)) {
          ob.handler(assign({}, routeConfig, {
            data: data,
            params: params,
            query: getQueryParams()
          }));
        }
      }
    });
  }

  function trigger() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return execListeners.apply(this, args);
  }

  function initRouterEvents() {
    window.addEventListener("".concat(POP_STATE), function (e) {
      var completePath = "".concat(loc.pathname).concat(loc.hash);
      var pathParts = completePath.split('#');
      var pathname = pathParts[0];
      var hashstring = pathParts[1];
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

  var router = {

    api: {

      trigger: function trigger$1() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return trigger.apply(this, args);
      },

      extractParams: function extractParams$1() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return extractParams.apply(this, args);
      },

      toQueryString: function toQueryString$1() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return toQueryString.apply(this, args);
      }
    },

    set: function set() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return execRoute.apply(this, args);
    }
  };

  function route() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return bindRoute.apply(this, args);
  }

  function routeIgnoreCase(firstArg) {
    if (typeof firstArg === 'string') {
      for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      route.apply(this, ["".concat(CASE_INSENSITIVE_FLAG).concat(firstArg)].concat(args));
    }
  }

  function unroute() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return unbindRoute.apply(this, args);
  }

  initRouterEvents();

  exports.deparam = lib;
  exports.param = toQueryString;
  exports.route = route;
  exports.routeIgnoreCase = routeIgnoreCase;
  exports.routeParams = extractParams;
  exports.router = router;
  exports.unroute = unroute;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=silkrouter.js.map
