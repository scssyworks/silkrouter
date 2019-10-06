/**!
 * Router plugin for single page applications with routes
 * Released under MIT license
 * @name Silk router
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version 3.4.0
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('argon-storage')) :
  typeof define === 'function' && define.amd ? define(['exports', 'argon-storage'], factory) :
  (global = global || self, factory(global.silkrouter = {}, global.ArgonStorage));
}(this, function (exports, ArgonStorage) { 'use strict';

  ArgonStorage = ArgonStorage && ArgonStorage.hasOwnProperty('default') ? ArgonStorage['default'] : ArgonStorage;

  var HASH_CHANGE = 'hashchange';
  var POP_STATE = 'popstate';
  var ROUTE_CHANGED = 'route.changed';
  var REG_ROUTE_PARAMS = /:[^\/]+/g;
  var REG_PATHNAME = /^\/(?=[^?]*)/;
  var REG_HASH_QUERY = /\?.+/;
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

  var isArr = Array.isArray;
  function trim(str) {
    return typeof str === 'string' ? str.trim() : '';
  }
  function isNumber(key) {
    key = trim("".concat(key));
    if (['null', 'undefined', ''].indexOf(key) > -1) return false;
    return !isNaN(Number(key));
  }
  function isObject(value) {
    return value && _typeof(value) === 'object' && !isArr(value);
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
  function isHashURL(URL) {
    return typeof URL === 'string' && URL.charAt(0) === '#';
  }
  function isFunc(fn) {
    return typeof fn === 'function';
  }
  function getPopStateEvent(type, data) {
    return {
      type: type,
      state: {
        data: data
      }
    };
  }

  var loc = window.location;

  function extractParams(expr, path) {
    path = setDefault(path, loc.pathname);
    var params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
      var pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
      REG_ROUTE_PARAMS.lastIndex = 0;
      if (pathRegex.test(path)) {
        var keys = toArray(expr.match(REG_ROUTE_PARAMS)).map(function (key) {
          return key.replace(':', '');
        });
        var values = toArray(path.match(pathRegex));
        values.shift();
        keys.forEach(function (key, index) {
          params[key] = values[index];
        });
      }
    }
    return params;
  }

  function buildQueryString(queryStringParts, key, obj) {
    var isCurrObjArray = false;
    if (isObject(obj) || (isCurrObjArray = isArr(obj))) {
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
    if (isObject(obj) || isArr(obj)) {
      Object.keys(obj).forEach(function (key) {
        buildQueryString(queryStringParts, key, obj[key]);
      });
      return queryStringParts.join('&');
    } else if (typeof obj === 'string') {
      return obj;
    }
    return '';
  }

  function ifComplex(q) {
    return /\[/.test(q);
  }
  function deparam(qs, coerce) {
    var _this = this;
    qs = trim(setDefault(qs, loc.search));
    coerce = setDefault(coerce, false);
    if (qs.charAt(0) === '?') {
      qs = qs.replace('?', '');
    }
    var queryParamList = qs.split('&');
    var queryObject = {};
    if (qs) {
      queryParamList.forEach(function (qq) {
        var qArr = qq.split('=').map(function (part) {
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
    if (typeof ob === 'undefined') {
      ob = [];
    }
    return isNextNumber ? ob : toObject(ob);
  }
  function resolveObj(ob, nextProp) {
    if (isObject(ob)) return {
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
  function complex(key, value, obj, doCoerce) {
    doCoerce = setDefault(doCoerce, true);
    var match = key.match(/([^\[]+)\[([^\[]*)\]/) || [];
    if (match.length === 3) {
      var prop = match[1];
      var nextProp = match[2];
      key = key.replace(/\[([^\[]*)\]/, '');
      if (ifComplex(key)) {
        if (nextProp === '') nextProp = '0';
        key = key.replace(/[^\[]+/, nextProp);
        complex(key, value, obj[prop] = resolveObj(obj[prop], nextProp).ob, doCoerce);
      } else if (nextProp) {
        var r = resolveObj(obj[prop], nextProp);
        obj[prop] = r.ob;
        var coercedValue = doCoerce ? coerce(value) : value;
        if (r.push) {
          var tempObj = {};
          tempObj[nextProp] = coercedValue;
          obj[prop].push(tempObj);
        } else {
          obj[prop][nextProp] = coercedValue;
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
    if (value == null) return '';
    if (typeof value !== 'string') return value;
    value = trim(value);
    if (isNumber(value)) return +value;
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
  }
  function lib() {
    return deparam.apply(this, arguments);
  }

  function loopFunc(ref, target) {
    if (isObject(ref)) {
      Object.keys(ref).forEach(function (key) {
        target[key] = ref[key];
      });
    }
  }
  function assign() {
    var target = isObject(arguments[0]) ? arguments[0] : {};
    for (var i = 1; i < arguments.length; i++) {
      loopFunc(arguments[i], target);
    }
    return target;
  }

  var store = new ArgonStorage({
    compress: true
  });
  var libs = {
    getDataFromStore: function getDataFromStore(path, isHash) {
      var paths = assign(store.get('routeStore'));
      return paths["".concat(isHash ? '#' : '').concat(path)];
    },
    setDataToStore: function setDataToStore(path, isHash, data) {
      var paths = assign(store.get('routeStore'));
      if (paths[path]) {
        if (!data || isObject(data) && Object.keys(data).length === 0) {
          return false;
        }
      }
      var newPath = {};
      newPath["".concat(isHash ? '#' : '').concat(path)] = data;
      paths = assign({}, paths, newPath);
      return store.set('routeStore', paths, true);
    },
    handlers: [],
    contains: function contains(fn) {
      return !!this.handlers.filter(fn).length;
    }
  };

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
    var qsObject = lib();
    var hashStringParams = {};
    var hashQuery = loc.hash.match(REG_HASH_QUERY);
    if (hashQuery) {
      hashStringParams = assign({}, lib(hashQuery[0]));
    }
    return assign({}, qsObject, hashStringParams);
  }

  function testRoute(route, url, originalData) {
    originalData = assign(originalData);
    var isHash = isHashURL(url);
    url = url.substring(isHash ? 1 : 0);
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

  function execListeners(eventName, rc, originalData) {
    originalData = assign(originalData);
    libs.handlers.forEach(function (ob) {
      if (ob.eventName === eventName) {
        var cRoute = ob.route;
        var cCurrentPath = rc.hash ? loc.hash : loc.pathname;
        if (ob.isCaseInsensitive) {
          cRoute = cRoute.toLowerCase();
          cCurrentPath = cCurrentPath.toLowerCase();
        }
        var _testRoute = testRoute(cRoute, cCurrentPath, originalData),
            hasMatch = _testRoute.hasMatch,
            data = _testRoute.data,
            params = _testRoute.params;
        if (hasMatch && (!ob.hash || ob.hash && rc.hash)) {
          ob.handler(assign({}, rc, {
            data: data,
            params: params,
            query: getQueryParams()
          }));
        }
      }
    });
  }

  function triggerRoute(ob) {
    ob.type = ob.hash ? HASH_CHANGE : POP_STATE;
    var originalData = setDefault(ob.originalData, {});
    ob.originalEvent = setDefault(ob.originalEvent, getPopStateEvent(ob.type, originalData));
    delete ob.originalData;
    execListeners(ROUTE_CHANGED, ob, originalData);
  }

  function execRoute(route, replaceMode, noTrigger) {
    var ro = assign({
      replaceMode: replaceMode,
      noTrigger: noTrigger
    }, typeof route === 'string' ? {
      route: route
    } : route);
    if (typeof ro.route === 'string') {
      var hash = isHashURL(ro.route);
      var routeParts = trim(ro.route).split('?');
      var pureRoute = routeParts[0].substring(hash ? 1 : 0);
      var queryString = trim(routeParts[1]);
      queryString = toQueryString(queryString || trim(ro.queryString));
      if (isValidRoute(pureRoute)) {
        libs.setDataToStore(pureRoute, hash, ro.data);
        var completeRoute = resolveQuery(pureRoute, hash, queryString, ro.appendQuery);
        history[ro.replaceMode ? 'replaceState' : 'pushState']({
          data: ro.data
        }, ro.title, completeRoute);
        if (!ro.noTrigger) {
          triggerRoute({
            route: "".concat(hash ? '#' : '').concat(pureRoute),
            hash: hash
          });
        }
      } else {
        throw new Error(INVALID_ROUTE);
      }
    }
  }

  function bindGenericRoute(route, handler) {
    var _this = this;
    if (libs.contains(function (ob) {
      return ob.prevHandler === handler;
    })) {
      return;
    }
    bindRoute(function (e) {
      if (isFunc(handler)) {
        if (route.indexOf("".concat(e.hash ? '#' : '').concat(e.route.substring(e.hash ? 1 : 0))) > -1) {
          handler.apply(_this, [e]);
        }
      }
    }, handler);
  }
  function bindRoute(route, handler, prevHandler) {
    var caseIgnored = typeof route === 'string' && route.indexOf(CASE_INSENSITIVE_FLAG) === 0;
    if (isFunc(route)) {
      prevHandler = handler;
      handler = route;
      route = '*';
    }
    if (isArr(route)) {
      bindGenericRoute(route, handler);
      return;
    }
    route = route.substring(caseIgnored ? CASE_INSENSITIVE_FLAG.length : 0);
    var containsHash = isHashURL(route);
    route = route.substring(containsHash ? 1 : 0);
    if (!libs.contains(function (ob) {
      return ob.handler === handler && ob.route === route;
    }) && isFunc(handler)) {
      libs.handlers.push({
        eventName: ROUTE_CHANGED,
        handler: handler,
        prevHandler: prevHandler,
        route: route,
        hash: containsHash,
        caseIgnored: caseIgnored,
        isCaseInsensitive: caseIgnored
      });
    }
    var paths = containsHash ? [loc.hash] : [loc.pathname, loc.hash];
    paths.filter(function (path) {
      return trim(path);
    }).forEach(function (currentPath) {
      var cRoute = caseIgnored ? route.toLowerCase() : route;
      var cCurrentPath = caseIgnored ? currentPath.toLowerCase() : currentPath;
      var containsHash = isHashURL(currentPath);
      var tr = testRoute(cRoute, cCurrentPath);
      if (tr.hasMatch && isFunc(handler)) {
        var eventName = containsHash ? HASH_CHANGE : POP_STATE;
        handler({
          originalEvent: getPopStateEvent(eventName, tr.data),
          route: currentPath,
          hash: containsHash,
          eventName: eventName,
          data: tr.data,
          params: tr.params,
          query: getQueryParams(),
          caseIgnored: caseIgnored,
          isCaseInsensitive: caseIgnored
        });
      }
    });
  }

  function unbindRoute(route, handler) {
    var prevLength = libs.handlers.length;
    var isRouteList = isArr(route);
    var args = toArray(arguments);
    if (args.length === 0) {
      libs.handlers.length = 0;
      return prevLength;
    }
    if (isRouteList) {
      route = '*';
    }
    libs.handlers = libs.handlers.filter(function (ob) {
      if (args.length === 1 && typeof route === 'string' && !isRouteList) {
        return ob.route !== route;
      }
      if (args.length === 1 && isFunc(route)) {
        handler = route;
        route = '*';
      }
      return !(ob.route === route && (ob.handler === handler || ob.prevHandler === handler));
    });
    return prevLength - libs.handlers.length;
  }

  function initRouterEvents() {
    window.addEventListener("".concat(POP_STATE), function (e) {
      var pathParts = "".concat(loc.pathname).concat(loc.hash).split('#');
      var defaultConfig = {
        originalEvent: e,
        originalData: assign(e.state && e.state.data)
      };
      triggerRoute(assign({}, defaultConfig, {
        route: pathParts[0],
        hash: false
      }));
      if (pathParts[1]) {
        triggerRoute(assign({}, defaultConfig, {
          route: "#".concat(pathParts[1]),
          hash: true
        }));
      }
    });
  }

  var router = {
    set: function set() {
      return execRoute.apply(this, arguments);
    }
  };
  function route() {
    return bindRoute.apply(this, arguments);
  }
  function routeIgnoreCase(firstArg) {
    if (typeof firstArg === 'string') {
      route.apply(this, ["".concat(CASE_INSENSITIVE_FLAG).concat(firstArg), toArray(arguments).slice(1)]);
    }
  }
  function unroute() {
    return unbindRoute.apply(this, arguments);
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
