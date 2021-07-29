
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
  var AMP = '&';
  var QRY = '?';
  var EQ = '=';
  var EMPTY = '';
  var UNDEF = void 0;
  var TYPEOF_STR = _typeof(EMPTY);
  var TYPEOF_BOOL = _typeof(true);
  var TYPEOF_UNDEF = _typeof(UNDEF);
  var TYPEOF_OBJ = _typeof({});
  _typeof(0);
  var TYPEOF_FUNC = _typeof(function () {});
  var STATE = 'State';
  var PUSH = "push".concat(STATE);
  var REPLACE = "replace".concat(STATE);

  function getGlobal() {
    return (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) !== TYPEOF_UNDEF ? globalThis : global || self;
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
    return _typeof(str) === TYPEOF_STR ? str.trim() : EMPTY;
  }
  /**
   * Checks if value is an object
   * @param {*} value Any type of value
   */

  function isObject(value) {
    return value && _typeof(value) === TYPEOF_OBJ;
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
    return _typeof(route) === TYPEOF_STR && REG_PATHNAME.test(route);
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

        if (_typeof(cont) === TYPEOF_BOOL) {
          if (cont) {
            continue;
          } else {
            break;
          }
        }
      }
    }
  }

  var g$1 = getGlobal();

  if (_typeof(g$1.CustomEvent) === TYPEOF_UNDEF) {
    var CustomEvent = function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: UNDEF
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = g$1.Event.prototype;
    g$1.CustomEvent = CustomEvent;
  } // Polyfill Array.from


  if (!Array.from) {
    Array.from = function (arrayLike) {
      if (isArr(arrayLike)) {
        return arrayLike;
      }

      var arr = [];
      each(arrayLike, function (value) {
        arr.push(value);
      });
      return arr;
    };
  }

  /**
   * Inner loop function for assign
   * @private
   * @param {object} ref Argument object
   * @param {object} target First object
   */

  function loopFunc(ref, target) {
    if (isObject(ref)) {
      each(ref, function (prop, key) {
        target[key] = prop;
      });
    }
  }
  /**
   * Polyfill for Object.assign only smaller and with less features
   * @private
   * @returns {object}
   */


  function assign() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var target = isObject(args[0]) ? args[0] : {};
    each(args, function (arg) {
      loopFunc(arg, target);
    });
    return target;
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  function __spreadArray(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
          to[j] = from[i];
      return to;
  }

  function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
  }

  function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
      function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
      function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
      function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
      function fulfill(value) { resume("next", value); }
      function reject(value) { resume("throw", value); }
      function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
  }

  function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
      function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
      function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
  }

  function isFunction(value) {
      return typeof value === 'function';
  }

  function createErrorClass(createImpl) {
      var _super = function (instance) {
          Error.call(instance);
          instance.stack = new Error().stack;
      };
      var ctorFunc = createImpl(_super);
      ctorFunc.prototype = Object.create(Error.prototype);
      ctorFunc.prototype.constructor = ctorFunc;
      return ctorFunc;
  }

  var UnsubscriptionError = createErrorClass(function (_super) {
      return function UnsubscriptionErrorImpl(errors) {
          _super(this);
          this.message = errors
              ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
              : '';
          this.name = 'UnsubscriptionError';
          this.errors = errors;
      };
  });

  function arrRemove(arr, item) {
      if (arr) {
          var index = arr.indexOf(item);
          0 <= index && arr.splice(index, 1);
      }
  }

  var Subscription = (function () {
      function Subscription(initialTeardown) {
          this.initialTeardown = initialTeardown;
          this.closed = false;
          this._parentage = null;
          this._teardowns = null;
      }
      Subscription.prototype.unsubscribe = function () {
          var e_1, _a, e_2, _b;
          var errors;
          if (!this.closed) {
              this.closed = true;
              var _parentage = this._parentage;
              if (_parentage) {
                  this._parentage = null;
                  if (Array.isArray(_parentage)) {
                      try {
                          for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                              var parent_1 = _parentage_1_1.value;
                              parent_1.remove(this);
                          }
                      }
                      catch (e_1_1) { e_1 = { error: e_1_1 }; }
                      finally {
                          try {
                              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                          }
                          finally { if (e_1) throw e_1.error; }
                      }
                  }
                  else {
                      _parentage.remove(this);
                  }
              }
              var initialTeardown = this.initialTeardown;
              if (isFunction(initialTeardown)) {
                  try {
                      initialTeardown();
                  }
                  catch (e) {
                      errors = e instanceof UnsubscriptionError ? e.errors : [e];
                  }
              }
              var _teardowns = this._teardowns;
              if (_teardowns) {
                  this._teardowns = null;
                  try {
                      for (var _teardowns_1 = __values(_teardowns), _teardowns_1_1 = _teardowns_1.next(); !_teardowns_1_1.done; _teardowns_1_1 = _teardowns_1.next()) {
                          var teardown_1 = _teardowns_1_1.value;
                          try {
                              execTeardown(teardown_1);
                          }
                          catch (err) {
                              errors = errors !== null && errors !== void 0 ? errors : [];
                              if (err instanceof UnsubscriptionError) {
                                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                              }
                              else {
                                  errors.push(err);
                              }
                          }
                      }
                  }
                  catch (e_2_1) { e_2 = { error: e_2_1 }; }
                  finally {
                      try {
                          if (_teardowns_1_1 && !_teardowns_1_1.done && (_b = _teardowns_1.return)) _b.call(_teardowns_1);
                      }
                      finally { if (e_2) throw e_2.error; }
                  }
              }
              if (errors) {
                  throw new UnsubscriptionError(errors);
              }
          }
      };
      Subscription.prototype.add = function (teardown) {
          var _a;
          if (teardown && teardown !== this) {
              if (this.closed) {
                  execTeardown(teardown);
              }
              else {
                  if (teardown instanceof Subscription) {
                      if (teardown.closed || teardown._hasParent(this)) {
                          return;
                      }
                      teardown._addParent(this);
                  }
                  (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(teardown);
              }
          }
      };
      Subscription.prototype._hasParent = function (parent) {
          var _parentage = this._parentage;
          return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
      };
      Subscription.prototype._addParent = function (parent) {
          var _parentage = this._parentage;
          this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
      };
      Subscription.prototype._removeParent = function (parent) {
          var _parentage = this._parentage;
          if (_parentage === parent) {
              this._parentage = null;
          }
          else if (Array.isArray(_parentage)) {
              arrRemove(_parentage, parent);
          }
      };
      Subscription.prototype.remove = function (teardown) {
          var _teardowns = this._teardowns;
          _teardowns && arrRemove(_teardowns, teardown);
          if (teardown instanceof Subscription) {
              teardown._removeParent(this);
          }
      };
      Subscription.EMPTY = (function () {
          var empty = new Subscription();
          empty.closed = true;
          return empty;
      })();
      return Subscription;
  }());
  function isSubscription(value) {
      return (value instanceof Subscription ||
          (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
  }
  function execTeardown(teardown) {
      if (isFunction(teardown)) {
          teardown();
      }
      else {
          teardown.unsubscribe();
      }
  }

  var config = {
      onUnhandledError: null,
      onStoppedNotification: null,
      Promise: undefined,
      useDeprecatedSynchronousErrorHandling: false,
      useDeprecatedNextContext: false,
  };

  var timeoutProvider = {
      setTimeout: function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var delegate = timeoutProvider.delegate;
          return ((delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout).apply(void 0, __spreadArray([], __read(args)));
      },
      clearTimeout: function (handle) {
          var delegate = timeoutProvider.delegate;
          return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
      },
      delegate: undefined,
  };

  function reportUnhandledError(err) {
      timeoutProvider.setTimeout(function () {
          {
              throw err;
          }
      });
  }

  function noop() { }

  var context = null;
  function errorContext(cb) {
      if (config.useDeprecatedSynchronousErrorHandling) {
          var isRoot = !context;
          if (isRoot) {
              context = { errorThrown: false, error: null };
          }
          cb();
          if (isRoot) {
              var _a = context, errorThrown = _a.errorThrown, error = _a.error;
              context = null;
              if (errorThrown) {
                  throw error;
              }
          }
      }
      else {
          cb();
      }
  }

  var Subscriber = (function (_super) {
      __extends(Subscriber, _super);
      function Subscriber(destination) {
          var _this = _super.call(this) || this;
          _this.isStopped = false;
          if (destination) {
              _this.destination = destination;
              if (isSubscription(destination)) {
                  destination.add(_this);
              }
          }
          else {
              _this.destination = EMPTY_OBSERVER;
          }
          return _this;
      }
      Subscriber.create = function (next, error, complete) {
          return new SafeSubscriber(next, error, complete);
      };
      Subscriber.prototype.next = function (value) {
          if (this.isStopped) ;
          else {
              this._next(value);
          }
      };
      Subscriber.prototype.error = function (err) {
          if (this.isStopped) ;
          else {
              this.isStopped = true;
              this._error(err);
          }
      };
      Subscriber.prototype.complete = function () {
          if (this.isStopped) ;
          else {
              this.isStopped = true;
              this._complete();
          }
      };
      Subscriber.prototype.unsubscribe = function () {
          if (!this.closed) {
              this.isStopped = true;
              _super.prototype.unsubscribe.call(this);
              this.destination = null;
          }
      };
      Subscriber.prototype._next = function (value) {
          this.destination.next(value);
      };
      Subscriber.prototype._error = function (err) {
          try {
              this.destination.error(err);
          }
          finally {
              this.unsubscribe();
          }
      };
      Subscriber.prototype._complete = function () {
          try {
              this.destination.complete();
          }
          finally {
              this.unsubscribe();
          }
      };
      return Subscriber;
  }(Subscription));
  var SafeSubscriber = (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          var next;
          if (isFunction(observerOrNext)) {
              next = observerOrNext;
          }
          else if (observerOrNext) {
              (next = observerOrNext.next, error = observerOrNext.error, complete = observerOrNext.complete);
              var context_1;
              if (_this && config.useDeprecatedNextContext) {
                  context_1 = Object.create(observerOrNext);
                  context_1.unsubscribe = function () { return _this.unsubscribe(); };
              }
              else {
                  context_1 = observerOrNext;
              }
              next = next === null || next === void 0 ? void 0 : next.bind(context_1);
              error = error === null || error === void 0 ? void 0 : error.bind(context_1);
              complete = complete === null || complete === void 0 ? void 0 : complete.bind(context_1);
          }
          _this.destination = {
              next: next ? wrapForErrorHandling(next) : noop,
              error: wrapForErrorHandling(error !== null && error !== void 0 ? error : defaultErrorHandler),
              complete: complete ? wrapForErrorHandling(complete) : noop,
          };
          return _this;
      }
      return SafeSubscriber;
  }(Subscriber));
  function wrapForErrorHandling(handler, instance) {
      return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          try {
              handler.apply(void 0, __spreadArray([], __read(args)));
          }
          catch (err) {
              {
                  reportUnhandledError(err);
              }
          }
      };
  }
  function defaultErrorHandler(err) {
      throw err;
  }
  var EMPTY_OBSERVER = {
      closed: true,
      next: noop,
      error: defaultErrorHandler,
      complete: noop,
  };

  var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

  function identity(x) {
      return x;
  }

  function pipeFromArray(fns) {
      if (fns.length === 0) {
          return identity;
      }
      if (fns.length === 1) {
          return fns[0];
      }
      return function piped(input) {
          return fns.reduce(function (prev, fn) { return fn(prev); }, input);
      };
  }

  var Observable = (function () {
      function Observable(subscribe) {
          if (subscribe) {
              this._subscribe = subscribe;
          }
      }
      Observable.prototype.lift = function (operator) {
          var observable = new Observable();
          observable.source = this;
          observable.operator = operator;
          return observable;
      };
      Observable.prototype.subscribe = function (observerOrNext, error, complete) {
          var _this = this;
          var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
          errorContext(function () {
              var _a = _this, operator = _a.operator, source = _a.source;
              subscriber.add(operator
                  ?
                      operator.call(subscriber, source)
                  : source
                      ?
                          _this._subscribe(subscriber)
                      :
                          _this._trySubscribe(subscriber));
          });
          return subscriber;
      };
      Observable.prototype._trySubscribe = function (sink) {
          try {
              return this._subscribe(sink);
          }
          catch (err) {
              sink.error(err);
          }
      };
      Observable.prototype.forEach = function (next, promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var subscription;
              subscription = _this.subscribe(function (value) {
                  try {
                      next(value);
                  }
                  catch (err) {
                      reject(err);
                      subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
                  }
              }, reject, resolve);
          });
      };
      Observable.prototype._subscribe = function (subscriber) {
          var _a;
          return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
      };
      Observable.prototype[observable] = function () {
          return this;
      };
      Observable.prototype.pipe = function () {
          var operations = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              operations[_i] = arguments[_i];
          }
          return operations.length ? pipeFromArray(operations)(this) : this;
      };
      Observable.prototype.toPromise = function (promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var value;
              _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
          });
      };
      Observable.create = function (subscribe) {
          return new Observable(subscribe);
      };
      return Observable;
  }());
  function getPromiseCtor(promiseCtor) {
      var _a;
      return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
  }
  function isObserver(value) {
      return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
      return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
  }

  function hasLift(source) {
      return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
      return function (source) {
          if (hasLift(source)) {
              return source.lift(function (liftedSource) {
                  try {
                      return init(liftedSource, this);
                  }
                  catch (err) {
                      this.error(err);
                  }
              });
          }
          throw new TypeError('Unable to lift unknown Observable type');
      };
  }

  var OperatorSubscriber = (function (_super) {
      __extends(OperatorSubscriber, _super);
      function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
          var _this = _super.call(this, destination) || this;
          _this.onFinalize = onFinalize;
          _this._next = onNext
              ? function (value) {
                  try {
                      onNext(value);
                  }
                  catch (err) {
                      destination.error(err);
                  }
              }
              : _super.prototype._next;
          _this._error = onError
              ? function (err) {
                  try {
                      onError(err);
                  }
                  catch (err) {
                      destination.error(err);
                  }
                  finally {
                      this.unsubscribe();
                  }
              }
              : _super.prototype._error;
          _this._complete = onComplete
              ? function () {
                  try {
                      onComplete();
                  }
                  catch (err) {
                      destination.error(err);
                  }
                  finally {
                      this.unsubscribe();
                  }
              }
              : _super.prototype._complete;
          return _this;
      }
      OperatorSubscriber.prototype.unsubscribe = function () {
          var _a;
          var closed = this.closed;
          _super.prototype.unsubscribe.call(this);
          !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
      };
      return OperatorSubscriber;
  }(Subscriber));

  function scheduleArray(input, scheduler) {
      return new Observable(function (subscriber) {
          var i = 0;
          return scheduler.schedule(function () {
              if (i === input.length) {
                  subscriber.complete();
              }
              else {
                  subscriber.next(input[i++]);
                  if (!subscriber.closed) {
                      this.schedule();
                  }
              }
          });
      });
  }

  var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

  function isPromise(value) {
      return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }

  function getSymbolIterator() {
      if (typeof Symbol !== 'function' || !Symbol.iterator) {
          return '@@iterator';
      }
      return Symbol.iterator;
  }
  var iterator = getSymbolIterator();

  function isInteropObservable(input) {
      return isFunction(input[observable]);
  }

  function isIterable(input) {
      return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
  }

  function isAsyncIterable(obj) {
      return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }

  function createInvalidObservableTypeError(input) {
      return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }

  function readableStreamLikeToAsyncGenerator(readableStream) {
      return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
          var reader, _a, value, done;
          return __generator(this, function (_b) {
              switch (_b.label) {
                  case 0:
                      reader = readableStream.getReader();
                      _b.label = 1;
                  case 1:
                      _b.trys.push([1, , 9, 10]);
                      _b.label = 2;
                  case 2:
                      return [4, __await(reader.read())];
                  case 3:
                      _a = _b.sent(), value = _a.value, done = _a.done;
                      if (!done) return [3, 5];
                      return [4, __await(void 0)];
                  case 4: return [2, _b.sent()];
                  case 5: return [4, __await(value)];
                  case 6: return [4, _b.sent()];
                  case 7:
                      _b.sent();
                      return [3, 2];
                  case 8: return [3, 10];
                  case 9:
                      reader.releaseLock();
                      return [7];
                  case 10: return [2];
              }
          });
      });
  }
  function isReadableStreamLike(obj) {
      return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }

  function innerFrom(input) {
      if (input instanceof Observable) {
          return input;
      }
      if (input != null) {
          if (isInteropObservable(input)) {
              return fromInteropObservable(input);
          }
          if (isArrayLike(input)) {
              return fromArrayLike(input);
          }
          if (isPromise(input)) {
              return fromPromise(input);
          }
          if (isAsyncIterable(input)) {
              return fromAsyncIterable(input);
          }
          if (isIterable(input)) {
              return fromIterable(input);
          }
          if (isReadableStreamLike(input)) {
              return fromReadableStreamLike(input);
          }
      }
      throw createInvalidObservableTypeError(input);
  }
  function fromInteropObservable(obj) {
      return new Observable(function (subscriber) {
          var obs = obj[observable]();
          if (isFunction(obs.subscribe)) {
              return obs.subscribe(subscriber);
          }
          throw new TypeError('Provided object does not correctly implement Symbol.observable');
      });
  }
  function fromArrayLike(array) {
      return new Observable(function (subscriber) {
          for (var i = 0; i < array.length && !subscriber.closed; i++) {
              subscriber.next(array[i]);
          }
          subscriber.complete();
      });
  }
  function fromPromise(promise) {
      return new Observable(function (subscriber) {
          promise
              .then(function (value) {
              if (!subscriber.closed) {
                  subscriber.next(value);
                  subscriber.complete();
              }
          }, function (err) { return subscriber.error(err); })
              .then(null, reportUnhandledError);
      });
  }
  function fromIterable(iterable) {
      return new Observable(function (subscriber) {
          var e_1, _a;
          try {
              for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                  var value = iterable_1_1.value;
                  subscriber.next(value);
                  if (subscriber.closed) {
                      return;
                  }
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
              }
              finally { if (e_1) throw e_1.error; }
          }
          subscriber.complete();
      });
  }
  function fromAsyncIterable(asyncIterable) {
      return new Observable(function (subscriber) {
          process(asyncIterable, subscriber).catch(function (err) { return subscriber.error(err); });
      });
  }
  function fromReadableStreamLike(readableStream) {
      return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
  }
  function process(asyncIterable, subscriber) {
      var asyncIterable_1, asyncIterable_1_1;
      var e_2, _a;
      return __awaiter(this, void 0, void 0, function () {
          var value, e_2_1;
          return __generator(this, function (_b) {
              switch (_b.label) {
                  case 0:
                      _b.trys.push([0, 5, 6, 11]);
                      asyncIterable_1 = __asyncValues(asyncIterable);
                      _b.label = 1;
                  case 1: return [4, asyncIterable_1.next()];
                  case 2:
                      if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
                      value = asyncIterable_1_1.value;
                      subscriber.next(value);
                      if (subscriber.closed) {
                          return [2];
                      }
                      _b.label = 3;
                  case 3: return [3, 1];
                  case 4: return [3, 11];
                  case 5:
                      e_2_1 = _b.sent();
                      e_2 = { error: e_2_1 };
                      return [3, 11];
                  case 6:
                      _b.trys.push([6, , 9, 10]);
                      if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
                      return [4, _a.call(asyncIterable_1)];
                  case 7:
                      _b.sent();
                      _b.label = 8;
                  case 8: return [3, 10];
                  case 9:
                      if (e_2) throw e_2.error;
                      return [7];
                  case 10: return [7];
                  case 11:
                      subscriber.complete();
                      return [2];
              }
          });
      });
  }

  function internalFromArray(input, scheduler) {
      return scheduler ? scheduleArray(input, scheduler) : fromArrayLike(input);
  }

  function map(project, thisArg) {
      return operate(function (source, subscriber) {
          var index = 0;
          source.subscribe(new OperatorSubscriber(subscriber, function (value) {
              subscriber.next(project.call(thisArg, value, index++));
          }));
      });
  }

  var isArray = Array.isArray;
  function callOrApply(fn, args) {
      return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
  }
  function mapOneOrManyArgs(fn) {
      return map(function (args) { return callOrApply(fn, args); });
  }

  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalTeardown) {
      var buffer = [];
      var active = 0;
      var index = 0;
      var isComplete = false;
      var checkComplete = function () {
          if (isComplete && !buffer.length && !active) {
              subscriber.complete();
          }
      };
      var outerNext = function (value) { return (active < concurrent ? doInnerSub(value) : buffer.push(value)); };
      var doInnerSub = function (value) {
          expand && subscriber.next(value);
          active++;
          var innerComplete = false;
          innerFrom(project(value, index++)).subscribe(new OperatorSubscriber(subscriber, function (innerValue) {
              onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
              if (expand) {
                  outerNext(innerValue);
              }
              else {
                  subscriber.next(innerValue);
              }
          }, function () {
              innerComplete = true;
          }, undefined, function () {
              if (innerComplete) {
                  try {
                      active--;
                      var _loop_1 = function () {
                          var bufferedValue = buffer.shift();
                          innerSubScheduler ? subscriber.add(innerSubScheduler.schedule(function () { return doInnerSub(bufferedValue); })) : doInnerSub(bufferedValue);
                      };
                      while (buffer.length && active < concurrent) {
                          _loop_1();
                      }
                      checkComplete();
                  }
                  catch (err) {
                      subscriber.error(err);
                  }
              }
          }));
      };
      source.subscribe(new OperatorSubscriber(subscriber, outerNext, function () {
          isComplete = true;
          checkComplete();
      }));
      return function () {
          additionalTeardown === null || additionalTeardown === void 0 ? void 0 : additionalTeardown();
      };
  }

  function mergeMap(project, resultSelector, concurrent) {
      if (concurrent === void 0) { concurrent = Infinity; }
      if (isFunction(resultSelector)) {
          return mergeMap(function (a, i) { return map(function (b, ii) { return resultSelector(a, b, i, ii); })(innerFrom(project(a, i))); }, concurrent);
      }
      else if (typeof resultSelector === 'number') {
          concurrent = resultSelector;
      }
      return operate(function (source, subscriber) { return mergeInternals(source, subscriber, project, concurrent); });
  }

  var nodeEventEmitterMethods = ['addListener', 'removeListener'];
  var eventTargetMethods = ['addEventListener', 'removeEventListener'];
  var jqueryMethods = ['on', 'off'];
  function fromEvent(target, eventName, options, resultSelector) {
      if (isFunction(options)) {
          resultSelector = options;
          options = undefined;
      }
      if (resultSelector) {
          return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
      }
      var _a = __read(isEventTarget(target)
          ? eventTargetMethods.map(function (methodName) { return function (handler) { return target[methodName](eventName, handler, options); }; })
          :
              isNodeStyleEventEmitter(target)
                  ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
                  : isJQueryStyleEventEmitter(target)
                      ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
                      : [], 2), add = _a[0], remove = _a[1];
      if (!add) {
          if (isArrayLike(target)) {
              return mergeMap(function (subTarget) { return fromEvent(subTarget, eventName, options); })(internalFromArray(target));
          }
      }
      if (!add) {
          throw new TypeError('Invalid event target');
      }
      return new Observable(function (subscriber) {
          var handler = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              return subscriber.next(1 < args.length ? args : args[0]);
          };
          add(handler);
          return function () { return remove(handler); };
      });
  }
  function toCommonHandlerRegistry(target, eventName) {
      return function (methodName) { return function (handler) { return target[methodName](eventName, handler); }; };
  }
  function isNodeStyleEventEmitter(target) {
      return isFunction(target.addListener) && isFunction(target.removeListener);
  }
  function isJQueryStyleEventEmitter(target) {
      return isFunction(target.on) && isFunction(target.off);
  }
  function isEventTarget(target) {
      return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
  }

  var g = getGlobal();
  /**
   * Function to trigger custom event
   * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
   * @param {string} eventType Event type
   * @param {any[]} data Data to be passed to handler
   */

  function trigger(target, eventType, data) {
    target = Array.from(target instanceof Node ? [target] : target);

    if (target.length && _typeof(eventType) === TYPEOF_STR) {
      each(target, function (el) {
        var customEvent = new g.CustomEvent(eventType, {
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
  };

  function collate() {
    var _this = this;

    return function (observable) {
      return new Observable(function (subscriber) {
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

  function bindRouterEvents() {
    var _this = this;

    var _this$config = this.config,
        context = _this$config.context,
        location = _this$config.location,
        hashRouting = _this$config.hashRouting;
    this.popStateSubscription = fromEvent(getGlobal(), POP_STATE).subscribe(function (e) {
      var path = trim(hashRouting ? location.hash.substring(1).split(QRY)[0] : location.pathname);

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
      each(obj, function (prop, obKey) {
        buildQuery(qsList, "".concat(key, "[").concat(isArr(obj) ? EMPTY : obKey, "]"), prop);
      });
    } else if (_typeof(obj) !== TYPEOF_FUNC) {
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
      each(obj, function (prop, key) {
        buildQuery(qsList, key, prop);
      });
      return qsList.join(AMP);
    }

    return _typeof(obj) === TYPEOF_STR ? obj : EMPTY;
  }

  function obNull() {
    return Object.create(null);
  }
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


  function lib(qs, coerce) {
    var _this = this;

    qs = trim(qs);

    if (qs.charAt(0) === QRY) {
      qs = qs.replace(QRY, EMPTY);
    }

    var queryObject = obNull();

    if (qs) {
      qs.split(AMP).forEach(function (qq) {
        var qArr = qq.split(EQ).map(function (part) {
          return decodeURIComponent(part);
        });
        (ifComplex(qArr[0]) ? complex : simple).apply(_this, qArr.concat([queryObject, coerce, false]));
      });
    }

    return queryObject;
  }
  /**
   * Converts an array to an object
   * @param {array} arr
   */


  function toObject(arr) {
    var convertedObj = obNull();

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
    return isNextNumber ? _typeof(ob) === TYPEOF_UNDEF ? [] : ob : toObject(ob);
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
    if (isArr(ob) || _typeof(ob) === TYPEOF_UNDEF) return {
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
      key = key.replace(REG_REPLACE_BRACKETS, EMPTY);

      if (ifComplex(key)) {
        if (nextProp === EMPTY) nextProp = '0';
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
    if (value == null) return EMPTY;
    if (_typeof(value) !== TYPEOF_STR) return value;
    if (isNumber(value = trim(value))) return +value;

    switch (value) {
      case 'null':
        return null;

      case TYPEOF_UNDEF:
        return UNDEF;

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

  /**
   * Resolves and analyzes existing query string
   * @private
   * @param {string} queryString Query string
   * @param {string} hashRouting Flag to test if hash routing is enabled
   */

  function resolveQuery(queryString, hashRouting) {
    var location = this.config.location;
    var search = trim(location.search && location.search.substring(1));
    var existingQuery = hashRouting ? trim(location.hash.split(QRY)[1]) : trim(search);
    if (!existingQuery) return queryString;
    return toQueryString(assign(lib(search), lib(existingQuery), lib(queryString)));
  }

  function set(route, replace, exec) {
    exec = exec || true;
    var _this$config = this.config,
        preservePath = _this$config.preservePath,
        hashRouting = _this$config.hashRouting,
        history = _this$config.history;
    var routeObject = assign({
      replace: replace,
      exec: exec
    }, _typeof(route) === TYPEOF_STR ? {
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
    var routeParts = routeStr.split(QRY); // Check if query string is an object

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


      routeStr = "".concat(routeStr).concat(queryString ? "".concat(QRY + queryString) : EMPTY);
      history[replace ? REPLACE : PUSH]({
        data: data
      }, pageTitle, routeStr);

      if (exec && unmodifiedRoute) {
        trigger(this.config.context, VIRTUAL_PUSHSTATE, [{
          path: unmodifiedRoute,
          hash: hashRouting
        }, UNDEF, this]);
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
    var path = trim(hash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
    return function (observable) {
      return new Observable(function (subscriber) {
        var subn = observable.subscribe(subscriber);

        if (!isDone) {
          isDone = true;

          if (init && path) {
            subscriber.next(new RouterEvent([{
              path: path,
              hash: hash
            }, UNDEF, _this]));
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
      bindRouterEvents.apply(this);
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
        var _this$listeners$pipe;

        return (_this$listeners$pipe = this.listeners.pipe(callOnce.apply(this))).subscribe.apply(_this$listeners$pipe, arguments);
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
        if (_typeof(callback) === TYPEOF_FUNC) {
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
    if (_typeof(routerInstance) === TYPEOF_BOOL) {
      ignoreCase = routerInstance;
      routerInstance = UNDEF;
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
      return new Observable(function (subscriber) {
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

    if (_typeof(keys) === TYPEOF_BOOL) {
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

  const name="silkrouter";const version="4.2.1";const description="Silk router is an app routing library";const main="dist/umd/silkrouter.min.js";const module="dist/esm/silkrouter.esm.min.js";const types="src/typings/silkrouter.d.ts";const scripts={start:"env-cmd -f ./.env.start rollup -c --watch",dev:"env-cmd -f ./.env.dev rollup -c","dev:serve":"env-cmd -f ./.env.start.prod rollup -c",prod:"env-cmd rollup -c",build:"npm run test && npm run dev && npm run dev:serve && npm run prod",test:"jest tests/*",deploy:"gh-pages -d dist"};const author="scssyworks";const license="MIT";const devDependencies={"@babel/core":"^7.14.6","@babel/preset-env":"^7.14.7","@rollup/plugin-babel":"^5.3.0","@rollup/plugin-commonjs":"^19.0.0","@rollup/plugin-json":"^4.1.0","@rollup/plugin-node-resolve":"^13.0.0","@types/jest":"^26.0.24","babel-eslint":"^10.1.0","env-cmd":"^10.1.0","gh-pages":"^3.2.3",jest:"^27.0.6",rollup:"^2.52.8","rollup-plugin-eslint":"^7.0.0","rollup-plugin-livereload":"^2.0.5","rollup-plugin-serve":"^1.1.0","rollup-plugin-terser":"^7.0.2",rxjs:"^7.2.0"};const peerDependencies={rxjs:"^7.2.0"};const keywords=["router","routing","single page apps","single page application","SPA","silk","silk router","history","browser","url","hash","hash routing","pushState","popstate","hashchange","observables","observer","subscriber","subscribe","subscription","rxjs","reactivex"];const files=["dist/umd/","dist/esm/","src/typings/"];const repository={type:"git",url:"git+https://github.com/scssyworks/silkrouter.git"};const bugs={url:"https://github.com/scssyworks/silkrouter/issues"};const homepage="https://scssyworks.github.io/silkrouter";const dependencies={"is-number":"^7.0.0"};var pkg = {name:name,version:version,description:description,main:main,module:module,types:types,scripts:scripts,author:author,license:license,devDependencies:devDependencies,peerDependencies:peerDependencies,keywords:keywords,files:files,repository:repository,bugs:bugs,homepage:homepage,dependencies:dependencies};

  function q(selector) {
    var _document;

    if (typeof selector === 'string') {
      var elArray = [];
      selector.split(',').map(function (selectorPart) {
        return selectorPart.trim();
      }).forEach(function (selectorPart) {
        var selected = _toConsumableArray(document.querySelectorAll(selectorPart));

        selected.forEach(function (el) {
          if (!elArray.includes(el)) {
            elArray.push(el);
          }
        });
      });
      return elArray;
    }

    return _toConsumableArray((_document = document).querySelectorAll.apply(_document, arguments));
  }

  function keywordHighlight(text) {
    ['(new|throw|let|const|var|typeof|instanceof|in|of|import|case|extends|delete)(\\s)', '(function|class|try|catch|finally|do|else)(\\s|{)', '(for|while|if)(\\s|\\()', '(return|break|continue)(\\s|;)'].forEach(function (matcher) {
      var regex = new RegExp(matcher, 'g');

      if (regex.test(text)) {
        text = text.replace(regex, function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var keyword = args[1],
              extra = args[2];
          return "<span class=\"keyword\">".concat(keyword, "</span>").concat(extra);
        });
      }
    });
    return text;
  }

  function methodHighlight(text) {
    text = text.replace(/(\.)([^;:'",.())?|\\/^*@%#!~+-[\]{}=]+)(\()/g, function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var dot = args[1],
          method = args[2],
          brace = args[3];
      return "".concat(dot, "<span class=\"method\">").concat(method, "</span>").concat(brace);
    });
    return text;
  }

  function suppressComments(text) {
    text = text.replace(/\/\/[^\n]+/g, function (comment) {
      return "<span class=\"comment\">".concat(comment, "</span>");
    });
    return text;
  }

  function highlightFatArrow(text) {
    text = text.replace(/\s=&gt;\s/g, function (fatArrow) {
      return "<span class=\"fat-arrow\">".concat(fatArrow, "</span>");
    });
    return text;
  }

  function highlightString(text) {
    text = text.replace(/['"`].*['"`]/g, function (str) {
      return "<span class=\"str\">".concat(str.replace(/\//g, '&#47;'), "</span>");
    });
    return text;
  }

  function jsHighlight(text) {
    text = highlightString(text);
    text = keywordHighlight(text);
    text = methodHighlight(text);
    text = suppressComments(text);
    text = highlightFatArrow(text);
    return text;
  }

  function renderDecorators() {
    q('code pre').forEach(function (decorator) {
      var html = decorator.innerHTML;
      var pattern = html.match(/^\s+/);
      var originalIndent = pattern && pattern[0].length;
      html = html.split('\n').map(function (codePart) {
        return codePart.substring(originalIndent);
      }).join('\n');
      decorator.innerHTML = jsHighlight(html.trim());
    });
  }

  function renderVersion() {
    q('.version').forEach(function (el) {
      return el.querySelector('span').textContent = pkg.version;
    });
  }

  function initializeRouting() {
    q('#checkHash').forEach(function (el) {
      el.checked = window.sessionStorage.getItem('checkedStatus') === '1';
    });
    var router = new Router();
    var childRouter = router;
    router.subscribe(function (e) {
      var eventRoute = location.hostname === 'scssyworks.github.io' ? e.route.replace(/\/silkrouter\//, '/') : e.route;
      q('[data-route]').forEach(function (el) {
        el.classList.remove('active');
        var elRoute = el.getAttribute('data-route');

        if (elRoute === '/' && eventRoute === elRoute) {
          el.classList.add('active');
        } else if (elRoute !== '/' && eventRoute.includes(elRoute)) {
          el.classList.add('active');
        }
      });
      q('[data-section]').forEach(function (el) {
        el.classList.add('d-none');
        var elSection = el.getAttribute('data-section');

        if (elSection === '/' && eventRoute === elSection) {
          el.classList.remove('d-none');
        } else if (elSection !== '/' && eventRoute.includes(elSection)) {
          el.classList.remove('d-none');
        }
      });
      q('.params-data, .query-next-step, .query-data, .data-next-step, .state-data, .pass-data-tutorial').forEach(function (el) {
        el.classList.add('d-none');
      });
    });
    var paramsRoute = location.hostname === 'scssyworks.github.io' ? '/silkrouter/tab3/:firstname/:lastname' : '/tab3/:firstname/:lastname';
    router.pipe(route(paramsRoute), deparam(true)).subscribe(function (e) {
      q('.params-data pre').forEach(function (el) {
        el.textContent = JSON.stringify(e.params, null, 2);
      });
      q('.params-data, .query-next-step').forEach(function (el) {
        el.classList.remove('d-none');
      });

      if (Object.keys(e.search).length) {
        q('.query-data').forEach(function (el) {
          el.querySelector('pre').textContent = JSON.stringify(e.search, null, 2);
          el.classList.remove('d-none');
        });
        q('.data-next-step').forEach(function (el) {
          el.classList.remove('d-none');
        });
      }

      if (e.data) {
        q('.state-data').forEach(function (el) {
          el.querySelector('pre').textContent = e.data;
          el.classList.remove('d-none');
        });
        q('.pass-data-tutorial').forEach(function (el) {
          el.classList.remove('d-none');
        });
      }
    });
    document.addEventListener('click', function (e) {
      q('[data-route]').forEach(function (el) {
        if (el.contains(e.target)) {
          var isRelative = el.hasAttribute('data-relative');

          var _route = isRelative && q('#checkHash:checked').length === 0 ? el.closest('section').getAttribute('data-section') + el.getAttribute('data-route') : el.getAttribute('data-route');

          if (location.hostname === 'scssyworks.github.io') {
            _route = "/silkrouter".concat(_route);
          }

          if (isRelative) {
            if (location.hostname === 'scssyworks.github.io' && childRouter.config.hashRouting) {
              _route = _route.replace(/\/silkrouter\//, '/');
            }

            childRouter.set(_route);
          } else {
            router.set(_route);
          }
        }
      });
      q('.btn-primary.clear-session').forEach(function (el) {
        if (el.contains(e.target)) {
          window.sessionStorage.clear();
          window.location.href = location.hostname === 'scssyworks.github.io' ? '/silkrouter/tab2/' : '/tab2/';
        }
      });
      q('.append-param').forEach(function (el) {
        if (el.contains(e.target)) {
          router.set("".concat(location.hostname === 'scssyworks.github.io' ? '/silkrouter' : '', "/tab3/john/doe"));
        }
      });
      q('.append-query').forEach(function (el) {
        if (el.contains(e.target)) {
          router.set({
            route: "".concat(location.hostname === 'scssyworks.github.io' ? '/silkrouter' : '', "/tab3/john/doe"),
            queryString: 'q=HelloWorld'
          });
        }
      });
      q('.append-data').forEach(function (el) {
        if (el.contains(e.target)) {
          router.set({
            route: "".concat(location.hostname === 'scssyworks.github.io' ? '/silkrouter' : '', "/tab3/john/doe"),
            queryString: 'q=HelloWorld',
            data: 'Hi there!'
          });
        }
      });
    });
    q('#checkHash').forEach(function (el) {
      el.addEventListener('change', function () {
        window.sessionStorage.setItem('checkedStatus', "".concat(q('#checkHash:checked').length));
        window.location.href = "".concat(location.hostname === 'scssyworks.github.io' ? '/silkrouter' : '', "/tab2/");
      });
    });

    if (q('#checkHash:checked').length) {
      var hashRouter = new Router({
        hashRouting: true,
        preservePath: true
      });
      hashRouter.subscribe(function (e) {
        q('[data-route][data-relative]').forEach(function (el) {
          el.classList.remove('active');

          if (e.route.includes(el.getAttribute('data-route'))) {
            el.classList.add('active');
          }
        });
      });
      childRouter = hashRouter;
    }
  }

  function setGlobals() {
    window.Router = Router;
    window.route = route;
    window.deparam = deparam;
    window.noMatch = noMatch;
    window.cache = cache;
  }

  initializeRouting();
  renderDecorators();
  renderVersion();
  setGlobals();

}());
//# sourceMappingURL=silkrouter.iife.js.map
