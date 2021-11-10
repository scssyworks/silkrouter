/**!
 * Router plugin for single page applications with routes
 * Released under MIT license
 * @name Silk router
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version 3.5.9
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.silkrouter = {}));
})(this, (function (exports) { 'use strict';

  var HASH_CHANGE = 'hashchange';
  var POP_STATE = 'popstate';
  var ROUTE_CHANGED = 'route.changed';
  var REG_ROUTE_PARAMS = /:[^\/]+/g;
  var REG_PATHNAME = /^\/(?=[^?]*)/;
  var REG_HASH_QUERY = /\?.+/;
  var INVALID_ROUTE = 'Route string is not a pure route';
  var INVALID_LIST = 'Provide a valid list of routes';
  var CASE_INSENSITIVE_FLAG = '$$';
  var LOCAL_ENV = ['localhost', '0.0.0.0', '127.0.0.1', null];

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
  function hasOwn(ob, key) {
    return Object.prototype.hasOwnProperty.call(ob, key);
  }
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

  var loc = window.location;
  var f = String.fromCharCode;

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

  function _update(context, bitsPerChar, getCharFromInt) {
    if (context.context_data_position == bitsPerChar - 1) {
      context.context_data_position = 0;
      context.context_data.push(getCharFromInt(context.context_data_val));
      context.context_data_val = 0;
    } else {
      context.context_data_position++;
    }
  }
  function _updateContextNumBits(context) {
    context.context_enlargeIn--;
    if (context.context_enlargeIn == 0) {
      context.context_enlargeIn = Math.pow(2, context.context_numBits);
      context.context_numBits++;
    }
  }
  function _updateContext(context, bitsPerChar, getCharFromInt) {
    if (hasOwn(context.context_dictionaryToCreate, context.context_w)) {
      if (context.context_w.charCodeAt(0) < 256) {
        for (var i = 0; i < context.context_numBits; i++) {
          context.context_data_val = context.context_data_val << 1;
          _update(context, bitsPerChar, getCharFromInt);
        }
        context.value = context.context_w.charCodeAt(0);
        for (var _i = 0; _i < 8; _i++) {
          context.context_data_val = context.context_data_val << 1 | context.value & 1;
          _update(context, bitsPerChar, getCharFromInt);
          context.value = context.value >> 1;
        }
      } else {
        context.value = 1;
        for (var _i2 = 0; _i2 < context.context_numBits; _i2++) {
          context.context_data_val = context.context_data_val << 1 | context.value;
          _update(context, bitsPerChar, getCharFromInt);
          context.value = 0;
        }
        context.value = context.context_w.charCodeAt(0);
        for (var _i3 = 0; _i3 < 16; _i3++) {
          context.context_data_val = context.context_data_val << 1 | context.value & 1;
          _update(context, bitsPerChar, getCharFromInt);
          context.value = context.value >> 1;
        }
      }
      _updateContextNumBits(context);
      delete context.context_dictionaryToCreate[context.context_w];
    } else {
      context.value = context.context_dictionary[context.context_w];
      for (var _i4 = 0; _i4 < context.context_numBits; _i4++) {
        context.context_data_val = context.context_data_val << 1 | context.value & 1;
        _update(context, bitsPerChar, getCharFromInt);
        context.value = context.value >> 1;
      }
    }
    _updateContextNumBits(context);
  }
  function compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    var context = {
      context_dictionary: {},
      context_dictionaryToCreate: {},
      context_data: [],
      context_c: "",
      context_wc: "",
      context_w: "",
      context_enlargeIn: 2,
      context_dictSize: 3,
      context_numBits: 2,
      context_data_val: 0,
      context_data_position: 0
    };
    var i = 0;
    for (var ii = 0; ii < uncompressed.length; ii += 1) {
      context.context_c = uncompressed.charAt(ii);
      if (!hasOwn(context.context_dictionary, context.context_c)) {
        context.context_dictionary[context.context_c] = context.context_dictSize++;
        context.context_dictionaryToCreate[context.context_c] = true;
      }
      context.context_wc = context.context_w + context.context_c;
      if (hasOwn(context.context_dictionary, context.context_wc)) {
        context.context_w = context.context_wc;
      } else {
        _updateContext(context, bitsPerChar, getCharFromInt);
        context.context_dictionary[context.context_wc] = context.context_dictSize++;
        context.context_w = String(context.context_c);
      }
    }
    if (context.context_w !== "") {
      _updateContext(context, bitsPerChar, getCharFromInt);
    }
    context.value = 2;
    for (i = 0; i < context.context_numBits; i++) {
      context.context_data_val = context.context_data_val << 1 | context.value & 1;
      _update(context, bitsPerChar, getCharFromInt);
      context.value = context.value >> 1;
    }
    while (true) {
      context.context_data_val = context.context_data_val << 1;
      if (context.context_data_position == bitsPerChar - 1) {
        context.context_data.push(getCharFromInt(context.context_data_val));
        break;
      } else context.context_data_position++;
    }
    return context.context_data.join('');
  }

  function _commonRep3(data, maxpower, resetValue, getNextValue) {
    var bits = 0;
    var power = 1;
    while (power !== maxpower) {
      var resb = data.val & data.position;
      data.position >>= 1;
      if (data.position === 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }
    return bits;
  }
  function decompress(length, resetValue, getNextValue) {
    var dictionary = [];
    var data = {
      val: getNextValue(0),
      position: resetValue,
      index: 1
    };
    var result = [];
    var enlargeIn = 4;
    var dictSize = 4;
    var numBits = 3;
    var entry = '';
    var w;
    var c;
    for (var i = 0; i < 3; i++) {
      dictionary[i] = i;
    }
    switch (_commonRep3(data, Math.pow(2, 2), resetValue, getNextValue)) {
      case 0:
        c = f(_commonRep3(data, Math.pow(2, 8), resetValue, getNextValue));
        break;
      case 1:
        c = f(_commonRep3(data, Math.pow(2, 16), resetValue, getNextValue));
        break;
      case 2:
        return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return '';
      }
      switch (c = _commonRep3(data, Math.pow(2, numBits), resetValue, getNextValue)) {
        case 0:
          dictionary[dictSize++] = f(_commonRep3(data, Math.pow(2, 8), resetValue, getNextValue));
          c = dictSize - 1;
          enlargeIn--;
          break;
        case 1:
          dictionary[dictSize++] = f(_commonRep3(data, Math.pow(2, 16), resetValue, getNextValue));
          c = dictSize - 1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }
      if (enlargeIn === 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;
      w = entry;
      if (enlargeIn === 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
    }
  }

  function toUTF16(input) {
    if (input == null) return '';
    return compress(input, 15, function (a) {
      return f(a + 32);
    }) + ' ';
  }
  function fromUTF16(compressed) {
    if (compressed == null) return '';
    if (compressed === '') return null;
    return decompress(compressed.length, 16384, function (index) {
      return compressed.charCodeAt(index) - 32;
    });
  }

  function setCookie(key, value) {
    if (key && typeof value !== 'undefined') {
      var domain = loc.hostname;
      var isSecure = loc.protocol === 'https:';
      var transformedValue = value;
      if (isObject(value)) {
        transformedValue = JSON.stringify(value);
      }
      var cookiePath = "; path=/";
      var cookieDomain = LOCAL_ENV.indexOf(domain) === -1 ? "; domain=".concat(trim(domain)) : '';
      var secureFlag = isSecure ? '; secure' : '';
      document.cookie = "".concat(key, " = ").concat(transformedValue).concat(cookieDomain).concat(cookiePath).concat(secureFlag);
    }
  }
  function getCookie(key) {
    if (key) {
      var cookieStr = decodeURIComponent(document.cookie);
      var value = '';
      each(cookieStr.split(';'), function (cookiePair) {
        var keyPart = "".concat(key, "=");
        var indexOfKey = cookiePair.indexOf(keyPart);
        if (indexOfKey > -1) {
          value = trim(cookiePair.substring(indexOfKey + keyPart.length, cookiePair.length));
          return false;
        }
      });
      return value;
    }
    return '';
  }
  function isStorageAvailable() {
    try {
      sessionStorage.setItem('testKey', 'testValue');
      sessionStorage.removeItem('testKey');
      return true;
    } catch (e) {
      return false;
    }
  }
  function set(key, value) {
    if (isStorageAvailable()) {
      return sessionStorage.setItem(key, toUTF16(isObject(value) ? JSON.stringify(value) : value));
    }
    return setCookie(key, value);
  }
  function get(key) {
    if (isStorageAvailable()) {
      var value = fromUTF16(sessionStorage.getItem(key));
      try {
        value = JSON.parse(value);
        return value;
      } catch (e) {
        return value;
      }
    }
    return getCookie(key);
  }

  var store = {
    set: function set$1() {
      return set.apply(this, arguments);
    },
    get: function get$1() {
      return get.apply(this, arguments);
    }
  };

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
      return store.set('routeStore', paths);
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
    var isCaseInsensitive = typeof route === 'string' && route.indexOf(CASE_INSENSITIVE_FLAG) === 0;
    if (isFunc(route)) {
      prevHandler = handler;
      handler = route;
      route = '*';
    }
    if (isArr(route)) {
      return bindGenericRoute(route, handler);
    }
    route = route.substring(isCaseInsensitive ? CASE_INSENSITIVE_FLAG.length : 0);
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
        isCaseInsensitive: isCaseInsensitive
      });
    }
    var paths = containsHash ? [loc.hash] : [loc.pathname, loc.hash];
    paths.filter(function (path) {
      return trim(path);
    }).forEach(function (currentPath) {
      var containsHash = isHashURL(currentPath);
      var tr = testRoute(isCaseInsensitive ? route.toLowerCase() : route, isCaseInsensitive ? currentPath.toLowerCase() : currentPath);
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
          isCaseInsensitive: isCaseInsensitive
        });
      }
    });
  }

  function unbindRoute(route, handler) {
    var prevLength = libs.handlers.length;
    var isRouteList = isArr(route);
    if (isRouteList && !handler) return 0;
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

  function includesRoute(list, route) {
    route = trim(route);
    if (!Array.isArray(list)) {
      throw new TypeError(INVALID_LIST);
    }
    var result = false;
    for (var index = 0; index < list.length; index++) {
      var listItem = trim(list[index]);
      if (['*', route].indexOf(listItem) > -1 || !!Object.keys(extractParams(listItem, route)).length) {
        result = true;
        break;
      }
    }
    return result;
  }

  var router = {
    set: function set() {
      return execRoute.apply(this, arguments);
    },
    includes: function includes() {
      return includesRoute.apply(this, arguments);
    },
    list: function list() {
      var routeList = [];
      libs.handlers.forEach(function (handler) {
        var route = "".concat(handler.hash ? '#' : '').concat(handler.route);
        if (routeList.indexOf(route) === -1) {
          routeList.push(route);
        }
      });
      return routeList;
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
