/**!
 * Router plugin for single page applications with routes
 * Released under MIT license
 * @name Silk router
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version 3.4.3
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
    return !isNaN(+key);
  }
  function isObject(value) {
    return value && _typeof(value) === 'object';
  }
  function isPureObject(value) {
    return isObject(value) && !isArr(value);
  }
  function def(value, defaultValue) {
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
  function keys(obj) {
    return obj ? Object.keys(obj) : [];
  }

  var loc = window.location;

  function extractParams(expr, path) {
    path = def(path, loc.pathname);
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

  function buildQuery(qsList, key, obj) {
    if (isObject(obj)) {
      keys(obj).forEach(function (obKey) {
        buildQuery(qsList, "".concat(key, "[").concat(isArr(obj) ? '' : obKey, "]"), obj[obKey]);
      });
    } else if (typeof obj !== 'function') {
      qsList.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj)));
    }
  }
  function toQueryString(obj) {
    var qsList = [];
    if (isObject(obj)) {
      keys(obj).forEach(function (key) {
        buildQuery(qsList, key, obj[key]);
      });
      return qsList.join('&');
    }
    return typeof obj === 'string' ? obj : '';
  }

  function ifComplex(q) {
    return /\[/.test(q);
  }
  function deparam(qs, coerce) {
    var _this = this;
    qs = trim(def(qs, loc.search));
    if (qs.charAt(0) === '?') {
      qs = qs.replace('?', '');
    }
    var queryObject = {};
    if (qs) {
      qs.split('&').forEach(function (qq) {
        var qArr = qq.split('=').map(function (part) {
          return decodeURIComponent(part);
        });
        (ifComplex(qArr[0]) ? complex : simple).apply(_this, [].concat(qArr, [queryObject, def(coerce, false), false]));
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
    return isNextNumber ? typeof ob === 'undefined' ? [] : ob : toObject(ob);
  }
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
  function complex(key, value, obj, coercion) {
    coercion = def(coercion, true);
    var match = key.match(/([^\[]+)\[([^\[]*)\]/) || [];
    if (match.length === 3) {
      var prop = match[1];
      var nextProp = match[2];
      key = key.replace(/\[([^\[]*)\]/, '');
      if (ifComplex(key)) {
        if (nextProp === '') nextProp = '0';
        key = key.replace(/[^\[]+/, nextProp);
        complex(key, value, obj[prop] = resolveObj(obj[prop], nextProp).ob, coercion);
      } else if (nextProp) {
        var resolved = resolveObj(obj[prop], nextProp);
        obj[prop] = resolved.ob;
        var coercedValue = coercion ? coerce(value) : value;
        if (resolved.push) {
          var tempObj = {};
          tempObj[nextProp] = coercedValue;
          obj[prop].push(tempObj);
        } else {
          obj[prop][nextProp] = coercedValue;
        }
      } else {
        simple(prop, value, obj, coercion, true);
      }
    }
  }
  function simple(key, value, queryObject, coercion, toArray) {
    if (def(coercion, true)) {
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
  }
  function lib() {
    return deparam.apply(this, arguments);
  }

  function loopFunc(ref, target) {
    if (isObject(ref)) {
      keys(ref).forEach(function (key) {
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

  function Libs() {
    this.handlers = [];
  }
  assign(Libs.prototype, {
    getDataFromStore: function getDataFromStore(path, isHash) {
      var paths = assign(store.get('routeStore'));
      return paths["".concat(isHash ? '#' : '').concat(path)];
    },
    setDataToStore: function setDataToStore(path, isHash, data) {
      var paths = assign(store.get('routeStore'));
      if (paths[path]) {
        if (!data || isPureObject(data) && keys(data).length === 0) {
          return false;
        }
      }
      var newPath = {};
      newPath["".concat(isHash ? '#' : '').concat(path)] = data;
      paths = assign({}, paths, newPath);
      return store.set('routeStore', paths, true);
    },
    contains: function contains(fn) {
      return !!this.handlers.filter(fn).length;
    },
    remove: function remove(item) {
      this.handlers.splice(this.handlers.indexOf(item), 1).length;
    }
  });
  var libs = new Libs();

  function resolveQuery(route, isHash, queryString, append) {
    queryString = trim(queryString.substring(+(queryString.charAt(0) === '?')));
    var search = (append || '') && loc.search;
    if (!isHash) {
      return "".concat(route).concat(search).concat(queryString ? "".concat(search ? '&' : '?').concat(queryString) : '');
    }
    return "".concat(loc.pathname).concat(search, "#").concat(route).concat(queryString ? "?".concat(queryString) : '');
  }

  function getQueryParams() {
    var hashQuery = loc.hash.match(REG_HASH_QUERY);
    return assign({}, lib(), hashQuery ? assign({}, lib(hashQuery[0])) : {});
  }

  function testRoute(route, url, originalData) {
    var isHash = isHashURL(url);
    url = url.substring(+isHash);
    var path = url.split('?')[0];
    originalData = assign(originalData);
    if (keys(originalData).length) {
      libs.setDataToStore(path, isHash, originalData);
    }
    var params = extractParams(route, url);
    return {
      hasMatch: keys(params).length > 0 || isValidRoute(url) && (route === url || route === '*'),
      data: libs.getDataFromStore(path, isHash),
      params: params
    };
  }

  function execListeners(eventName, rc, originalData) {
    originalData = assign(originalData);
    libs.handlers.forEach(function (ob) {
      if (ob.eventName === eventName) {
        var currentPath = loc[rc.hash ? 'hash' : 'pathname'];
        var tr = testRoute(ob.isCaseInsensitive ? ob.route.toLowerCase() : ob.route, ob.isCaseInsensitive ? currentPath.toLowerCase() : currentPath, originalData);
        if (tr.hasMatch && (!ob.hash || ob.hash && rc.hash)) {
          ob.handler(assign({}, rc, {
            data: tr.data,
            params: tr.params,
            query: getQueryParams()
          }));
        }
      }
    });
  }

  function triggerRoute(ob) {
    ob.type = ob.hash ? HASH_CHANGE : POP_STATE;
    var originalData = def(ob.originalData, {});
    ob.originalEvent = def(ob.originalEvent, getPopStateEvent(ob.type, originalData));
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
      var pureRoute = routeParts[0].substring(+hash);
      var queryString = toQueryString(trim(routeParts[1]) || trim(ro.queryString));
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
        throw new TypeError(INVALID_ROUTE);
      }
    }
  }

  function bindGenericRoute(route, handler) {
    var _this = this;
    if (!libs.contains(function (ob) {
      return ob.prevHandler === handler;
    })) {
      bindRoute(function (e) {
        if (isFunc(handler) && route.indexOf("".concat(e.hash ? '#' : '').concat(e.route.substring(+e.hash))) > -1) {
          handler.apply(_this, [e]);
        }
      }, handler);
    }
  }
  function bindRoute(route, handler, prevHandler) {
    var caseIgnored = typeof route === 'string' && route.indexOf(CASE_INSENSITIVE_FLAG) === 0;
    if (isFunc(route)) {
      prevHandler = handler;
      handler = route;
      route = '*';
    }
    if (isArr(route)) {
      return bindGenericRoute(route, handler);
    }
    route = route.substring(caseIgnored ? CASE_INSENSITIVE_FLAG.length : 0);
    var containsHash = isHashURL(route);
    route = route.substring(+containsHash);
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
      var containsHash = isHashURL(currentPath);
      var tr = testRoute(caseIgnored ? route.toLowerCase() : route, caseIgnored ? currentPath.toLowerCase() : currentPath);
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
    route = isRouteList ? '*' : route;
    libs.handlers.forEach(function (ob) {
      var test = ob.route === route;
      var singleArg = args.length === 1;
      if (!(singleArg && typeof route === 'string' && !isRouteList)) {
        if (singleArg && isFunc(route)) {
          handler = route;
          route = '*';
        }
        test = test && (ob.handler === handler || ob.prevHandler === handler);
      }
      if (test) {
        libs.remove(ob);
      }
    });
    return prevLength - libs.handlers.length;
  }

  function initRouterEvents() {
    window.addEventListener("".concat(POP_STATE), function (e) {
      var paths = "".concat(loc.pathname).concat(loc.hash).split('#');
      var defaultConfig = {
        originalEvent: e,
        originalData: assign(e.state && e.state.data)
      };
      triggerRoute(assign({}, defaultConfig, {
        route: paths[0],
        hash: false
      }));
      if (paths[1]) {
        triggerRoute(assign({}, defaultConfig, {
          route: "#".concat(paths[1]),
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
//# sourceMappingURL=index.js.map
