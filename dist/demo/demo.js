(function () {
  'use strict';

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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var deparam = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    module.exports = factory();
  }(commonjsGlobal, (function () {
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
     * Deparam plugin
     * Converts a querystring to a JavaScript object
     * @project      Deparam plugin
     * @date         2018-08-18
     * @author       Sachin Singh <ssingh.300889@gmail.com>
     * @version      1.1.1
     */
    // Vars
    var isBrowser = typeof window !== "undefined";
    var isNode = typeof commonjsGlobal !== "undefined"; // Shorthand for built-ins

    var isArr = Array.isArray;
    /**
     * Checks if input is a number
     * @param {*} key 
     */

    function isNumber(key) {
      key = (key + "").trim();
      if (['null', 'undefined', ''].indexOf(key) > -1) return false;
      return !isNaN(Number(key));
    }
    /**
     * Checks if key is a true object
     * @param {*} key Any type of value
     */


    function isObject(key) {
      return key != null && !isArr(key) && key.toString() === "[object Object]";
    }
    /**
     * Checks if query parameter key is a complex notation
     * @param {string} q 
     */


    function ifComplex(q) {
      return /\[/.test(q);
    }
    /**
     * Converts query string to JavaScript object
     * @param {string} qs query string argument (defaults to url query string)
     */


    function deparam() {
      var qs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isBrowser ? window.location.search : "";
      qs = decodeURIComponent(qs).replace("?", "").trim();
      var queryParamList = qs.split("&");
      var queryObject = {};

      if (qs) {
        queryParamList.forEach(function (qq) {
          var qArr = qq.split("=");

          if (ifComplex.apply(void 0, _toConsumableArray(qArr))) {
            complex.apply(void 0, _toConsumableArray(qArr).concat([queryObject]));
          } else {
            simple(qArr, queryObject);
          }
        });
      }

      return queryObject;
    }
    /**
     * Converts an array to an object
     * @param {array} arr 
     */


    function toObject(arr) {
      var convertedObj = {};

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
      if (typeof ob === "undefined") return isNextNumber ? [] : {};
      return isNextNumber ? ob : toObject(ob);
    }
    /**
     * Resolves the target object for next iteration
     * @param {Object} ob current reference object
     * @param {string} nextProp reference property in current object
     */


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
    /**
     * Handles complex query parameters
     * @param {string} key 
     * @param {string} value 
     * @param {Object} obj 
     */


    function complex(key, value, obj) {
      var match = key.match(/([^\[]+)\[([^\[]*)\]/) || [];

      if (match.length === 3) {
        var _match = _slicedToArray(match, 3),
            prop = _match[1],
            nextProp = _match[2];

        key = key.replace(/\[([^\[]*)\]/, "");

        if (ifComplex(key)) {
          if (nextProp === "") nextProp = "0";
          key = key.replace(/[^\[]+/, nextProp);
          complex(key, value, obj[prop] = resolveObj(obj[prop], nextProp).ob);
        } else if (nextProp) {
          var _resolveObj = resolveObj(obj[prop], nextProp),
              ob = _resolveObj.ob,
              push = _resolveObj.push;

          obj[prop] = ob;

          if (push) {
            obj[prop].push(_defineProperty({}, nextProp, coerce(value)));
          } else {
            obj[prop][nextProp] = coerce(value);
          }
        } else {
          simple([match[1], value], obj, true);
        }
      }
    }
    /**
     * Handles simple query
     * @param {array} qArr 
     * @param {Object} queryObject 
     * @param {boolean} toArray 
     */


    function simple(qArr, queryObject, toArray) {
      var _qArr = _slicedToArray(qArr, 2),
          key = _qArr[0],
          value = _qArr[1]; // Convert to appropriate type


      value = coerce(value);

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
      if (value == null) return "";
      if (typeof value !== "string") return value;
      value = value.trim();
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
    } // Check if global jQuery object exists, then plug-in deparam function as a static method


    if (isBrowser && window.jQuery) {
      window.jQuery.deparam = lib;
    }

    if (isNode && commonjsGlobal.jQuery) {
      commonjsGlobal.jQuery.deparam = lib;
    }

    return lib;

  })));

  });

  /**
   * Simple selector engine with event handling
   */
  function isValidNode(el) {
    return el instanceof Node || el === window;
  }

  function isCallable(handler) {
    return typeof handler === 'function';
  }

  function getClassList(classSet) {
    return classSet.split(' ').map(function (st) {
      return !!st.trim();
    });
  }

  var Init =
  /*#__PURE__*/
  function () {
    function Init(selector) {
      var _this = this;

      _classCallCheck(this, Init);

      this.length = 0;
      selector = isValidNode(selector) ? [selector] : selector instanceof NodeList || selector instanceof HTMLCollection ? _toConsumableArray(selector) : typeof selector === 'string' ? _toConsumableArray(document.querySelectorAll(selector)) : Array.isArray(selector) ? selector.map(isValidNode) : selector instanceof select ? selector.map() : null;

      if (selector) {
        selector.forEach(function (el) {
          _this[_this.length++] = el;
        });
      }
    }

    _createClass(Init, [{
      key: "each",
      value: function each(handler) {
        for (var i = 0; i < this.length; i++) {
          if (isCallable(handler)) {
            var result = handler.apply(this[i], [i, this[i], this]);

            if (result === true) {
              continue;
            }

            if (result === false) {
              break;
            }
          }
        }

        return this;
      }
    }, {
      key: "addClass",
      value: function addClass(classNames) {
        if (typeof classNames === 'string') {
          var classList = getClassList(classNames);
          this.each(function () {
            var currentClassSet = this.getAttribute('class');

            if (typeof currentClassSet === 'string') {
              var currentClassList = getClassList(currentClassSet);
              classList.forEach(function (className) {
                if (currentClassList.indexOf(className) === -1) {
                  currentClassList.push(className);
                }
              });
              this.setAttribute('class', currentClassList.join(' '));
            } else {
              this.setAttribute('class', classList.join(' '));
            }
          });
        }

        return this;
      }
    }, {
      key: "removeClass",
      value: function removeClass(classNames) {
        if (typeof classNames === 'string') {
          var classList = getClassList(classNames);
          var removedCounter = 0;
          this.each(function () {
            var currentClassSet = this.getAttribute('class');

            if (typeof currentClassSet === 'string') {
              var currentClassList = getClassList(currentClassSet);
              classList.forEach(function (className) {
                var classIndex = currentClassList.indexOf(className);

                if (classIndex > -1) {
                  currentClassList.splice(classIndex, 1);
                  removedCounter += 1;
                }
              });

              if (removedCounter > 0) {
                this.setAttribute('class', currentClassList.join(' '));
              }
            }
          });
        }

        return this;
      }
    }, {
      key: "on",
      value: function on(eventName, handler, useCapture) {
        this.each(function (i, el) {
          el.addEventListener(eventName, function (_ref) {
            var detail = _ref.detail;
            var customData = detail && detail.customData ? _toConsumableArray(detail.customData) : [];

            if (isCallable(handler)) {
              handler.apply(this, [event].concat(_toConsumableArray(customData)));
            }
          }, useCapture);
        });
        return this;
      }
    }, {
      key: "trigger",
      value: function trigger(eventName, params) {
        var customEvent = new CustomEvent(eventName, {
          cancelable: true,
          bubbles: true,
          detail: {
            customData: params
          }
        });
        this.each(function (i, el) {
          el.dispatchEvent(customEvent);
        });
        return this;
      }
    }, {
      key: "map",
      value: function map() {
        var map = [];
        this.each(function () {
          if (map.indexOf(this) === -1) {
            map.push(this);
          }
        });
        return map;
      }
    }, {
      key: "add",
      value: function add(selector) {
        var currentSelection = this.map();
        var newSelection = select(selector);
        var self = this;
        newSelection.each(function () {
          if (currentSelection.indexOf(this) === -1) {
            self[self.length++] = this;
          }
        });
        return this;
      }
    }, {
      key: "filter",
      value: function filter(filterArg) {
        var newSelection = select();

        if (isCallable(filterArg)) {
          this.each(function () {
            if (filterArg(this)) {
              newSelection.add(this);
            }
          });
        } else {
          var matched = select(filterArg).map();
          this.each(function () {
            if (matched.indexOf(this) > -1) {
              newSelection.add(this);
            }
          });
        }

        return newSelection;
      }
    }, {
      key: "find",
      value: function find(selector) {
        var children = [];
        var newSelection = select();
        this.each(function () {
          var childrenEach = _toConsumableArray(this.childNodes);

          childrenEach.forEach(function (child) {
            if (children.indexOf(child) === -1 && child.nodeType === 1) {
              children.push(child);
            }
          });
        });
        var matched = select(selector).map();
        matched.forEach(function (el) {
          if (children.indexOf(el) > -1) {
            newSelection.add(el);
          }
        });
        return newSelection;
      }
    }, {
      key: "eq",
      value: function eq(index) {
        return select(this[index]);
      }
    }, {
      key: "first",
      value: function first() {
        return this.eq(0);
      }
    }, {
      key: "last",
      value: function last() {
        return this.eq(this.length - 1);
      }
    }, {
      key: "html",
      value: function html(htmlText) {
        if (typeof htmlText === 'undefined') {
          return this[0].innerHTML;
        } else if (typeof htmlText === 'string') {
          this.each(function () {
            this.innerHTML = htmlText;
          });
        }
      }
    }, {
      key: "text",
      value: function text(textData) {
        if (typeof textData === 'undefined') {
          return this[0].textContent;
        } else if (typeof textData === 'string') {
          this.each(function () {
            this.textContent = textData;
          });
        }
      }
    }]);

    return Init;
  }();

  function select(selector) {
    return new Init(selector);
  }

  select.fn = Init.prototype;

  var libs = {
    handlers: []
  }; // Variable to check if browser supports history API properly    

  var isHistorySupported = history && history.pushState; // Data cache

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
  /**
   * Converts any list to JavaScript array
   * @param {array} arr 
   */

  function _arr(arr) {
    return Array.prototype.slice.call(arr);
  }
  /**
   * Tests if parameter is a valid JavaScript object
   * @param {any} testObject Test object
   */


  function _resolveObject(testObject) {
    if (testObject !== null && _typeof(testObject) === 'object') {
      return testObject;
    }

    return {};
  }
  /**
   * Triggers "routeChanged" event unless "noTrigger" flag is true
   */


  function _triggerRoute(route, eventType) {
    var isHashRoute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (cache.noTrigger && eventType === eventNames.hashchange) {
      cache.noTrigger = false;
      return;
    }

    cache.data = _resolveObject(cache.data);

    var ref = cache.data.data = _resolveObject(cache.data.data);

    var routeOb = {
      eventType: eventType,
      hash: !!isHashRoute,
      route: route
    };
    cache.data.data = _objectSpread({}, ref, routeOb);
    router.events.trigger(eventNames.routeChanged, cache.data);
  }
  /**
   * Throw JavaScript errors with custom message
   * @param {string} message 
   */


  function _throwError(message) {
    throw new Error(message);
  }
  /**
   * Checks if given route is valid
   * @param {string} sRoute 
   */


  function _isValidRoute(sRoute) {
    if (typeof sRoute !== "string") {
      return false;
    }
    return regex.pathname.test(sRoute);
  }
  /**
   * Adds a query string
   * @param {string} sRoute 
   * @param {string} qString 
   * @param {boolean} appendQString 
   */


  function _resolveQueryString(sRoute, qString, appendQString) {
    if (!qString && !appendQString) return sRoute;

    if (typeof qString === "string") {
      if ((qString = qString.trim()) && appendQString) {
        return sRoute + window.location.search + "&" + qString.replace("?", "");
      } else if (qString) {
        return sRoute + "?" + qString.replace("?", "");
      } else {
        return sRoute;
      }
    }
  }
  /**
   * Converts current query string into an object
   */


  function _getQueryParams() {
    var qsObject = deparam(window.location.search),
        hashStringParams = {};

    if (window.location.hash.match(regex.hashQuery)) {
      hashStringParams = deparam(window.location.hash.match(regex.hashQuery)[0]);
    }

    return _objectSpread({}, qsObject, hashStringParams);
  }
  /**
   * Checks if route is valid and returns the valid route
   * @param {string} sRoute
   * @param {string} qString
   * @param {boolean} appendQString
   */


  function _validateRoute(sRoute, qString, appendQString) {
    if (_isValidRoute(sRoute)) {
      return _resolveQueryString(sRoute, qString, appendQString);
    }

    _throwError(errorMessage.invalidPath);
  }
  /**
   * Set route for given view
   * @param {string|object} oRoute 
   * @param {boolean} replaceMode 
   * @param {boolean} noTrigger 
   */


  function _setRoute(oRoute, replaceMode, noTrigger) {
    if (!oRoute) return;
    var title = null,
        sRoute = "",
        qString = "",
        appendQString = false,
        isHashString = false,
        routeMethod = replaceMode ? "replaceState" : "pushState";
    cache.noTrigger = noTrigger;

    if (_typeof(oRoute) === "object") {
      cache.data = {
        data: oRoute.data
      };
      title = oRoute.title;
      sRoute = oRoute.route;
      qString = oRoute.queryString;
      appendQString = oRoute.appendQuery;
    } else if (typeof oRoute === "string") {
      cache.data = {
        data: {}
      };
      sRoute = oRoute;
    } // Support for hash routes


    if (sRoute.charAt(0) === "#") {
      isHashString = true;
      sRoute = sRoute.replace("#", "");
    }

    if (isHistorySupported && !isHashString) {
      history[routeMethod](cache.data, title, _validateRoute(sRoute, qString, appendQString));

      if (!noTrigger) {
        var routeOb = {
          eventType: eventNames.popstate,
          hash: false,
          route: sRoute
        };
        var ref = cache.data.data;
        cache.data.data = _objectSpread({}, ref, routeOb);
        router.events.trigger(eventNames.routeChanged, cache.data);
      }
    } else {
      if (replaceMode) {
        window.location.replace("#" + _validateRoute(sRoute, qString, appendQString));
      } else {
        window.location.hash = _validateRoute(sRoute, qString, appendQString);
      }
    }
  }
  /**
   * Attaches a route handler function
   * @param {string} sRoute 
   * @param {function} callback 
   */


  function _route(sRoute, callback) {
    var _this = this;

    if (!libs.handlers.filter(function (ob) {
      return ob.originalHandler === callback && ob.route === sRoute && ob.element === _this;
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
   * Trims leading/trailing special characters
   * @param {string} param 
   */


  function _sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
  }
  /**
   * Compares route with current URL
   * @param {string} route 
   * @param {string} url 
   * @param {object} params 
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
   * @param {string} eventName 
   * @param {object} params 
   */


  function _routeTrigger(eventName, params) {
    // Ensures that params is always an object
    params = _resolveObject(params);
    params.data = _resolveObject(params.data);
    var isHashRoute = params.data.hash;
    libs.handlers.forEach(function (eventObject) {
      if (eventObject.eventName === eventName) {
        if (isHistorySupported && !isHashRoute && _matched(eventObject.route, window.location.pathname, params)) {
          eventObject.handler(params.data, params.params, _getQueryParams());
        } else if (isHashRoute) {
          if (!window.location.hash && !isHistorySupported && _matched(eventObject.route, window.location.pathname, params)) {
            cache.data = params.data;
            window.location.replace("#" + window.location.pathname); // <-- This will trigger router handler automatically
          } else if (_matched(eventObject.route, window.location.hash.substring(1), params)) {
            eventObject.handler(params.data, params.params, _getQueryParams());
          }
        }
      }
    });
  }
  /**
   * Initializes router events
   */


  function _bindRouterEvents() {
    select(window).on(eventNames.popstate, function (e) {
      _triggerRoute.apply(this, [window.location.pathname, e.type]);
    });
    select(window).on(eventNames.hashchange, function (e) {
      _triggerRoute.apply(this, [window.location.hash, e.type, true]);
    });
  }

  var router = {
    events: _objectSpread({}, eventNames, {
      trigger: function trigger(eventName, params) {
        return _routeTrigger.apply(this, [eventName, params]);
      }
    }),
    init: function init() {
      var settings = {
        eventType: isHistorySupported ? eventNames.popstate : eventNames.hashchange,
        hash: !isHistorySupported,
        route: isHistorySupported ? window.location.pathname : window.location.hash
      };
      this.events.trigger(eventNames.routeChanged, {
        data: settings
      });

      if (window.location.hash) {
        select(window).trigger(eventNames.hashchange);
      }
    },
    set: function set() {
      return _setRoute.apply(this, arguments);
    },
    historySupported: isHistorySupported
  };

  function route() {
    return _route.apply(this, arguments);
  } // Adds the router object to jQuery if available


  if (typeof jQuery === 'function' && jQuery.fn) {
    jQuery.route = jQuery.fn.route = route;
    jQuery.router = router;
  }

  _bindRouterEvents();

  select.router = select.fn.route = route;
  select.router = router;
  var demo = {
    updateCache: function updateCache() {// TODO
    },
    bindEvents: function bindEvents() {// TODO
    },
    init: function init() {
      this.updateCache();
      this.bindEvents();
      console.log("Demo initialized");
      select.router.init();
    }
  };
  demo.init();

}());
//# sourceMappingURL=demo.js.map
