
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  /**
   * Router constants
   */
  const POP_STATE = 'popstate';
  const REG_ROUTE_PARAMS = /:[^/]+/g;
  const REG_PATHNAME = /^\/(?=[^?]*)/;
  const HISTORY_UNSUPPORTED = 'History is not supported in this environment!';
  const INVALID_ROUTE = 'Route format is incorrect!';
  const VIRTUAL_PUSHSTATE = 'vpushstate';
  const QRY = '?';
  const EMPTY = '';
  const STATE = 'State';
  const PUSH = `push${STATE}`;
  const REPLACE = `replace${STATE}`;

  /**
   * Parses current path and returns params object
   * @param {string} expr Route expression
   * @param {string} path URL path
   * @returns {{[key: string]: any}}
   */
  function resolveParams(expr, path) {
    const params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
      const pathRegex = new RegExp(expr.replace(/\//g, '\\/').replace(/:[^/\\]+/g, '([^\\/]+)'));
      REG_ROUTE_PARAMS.lastIndex = 0;
      if (pathRegex.test(path)) {
        const keys = Array.from(expr.match(REG_ROUTE_PARAMS)).map(key => key.replace(':', EMPTY));
        const values = Array.from(path.match(pathRegex));
        values.shift();
        keys.forEach((key, index) => {
          params[key] = values[index];
        });
      }
    }
    return params;
  }

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var isObject = function isObject(x) {
  	return typeof x === 'object' && x !== null;
  };

  var isObject$1 = /*@__PURE__*/getDefaultExportFromCjs(isObject);

  /**
   * Function to trigger custom event
   * @param {HTMLElement} context Context element
   * @param {string} eventType Event type
   * @param {any[]} data Data to be passed to handler
   */
  function trigger(context, eventType, data) {
    context.dispatchEvent(new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail: data || []
    }));
  }

  /**
   * Checks if input value is a string
   * @param {any} str String value
   * @returns {boolean}
   */
  function isString(str) {
    return typeof str === 'string';
  }

  /**
   * Safely trims string
   * @param {string} str String
   */
  function trim(str) {
    return isString(str) ? str.trim() : EMPTY;
  }

  /**
   * Checks if given route is valid
   * @private
   * @param {string} route Route string
   */
  function isValidRoute(route) {
    return REG_PATHNAME.test(route);
  }

  /**
   * Sets the current route
   * @private
   * @typedef {import('./types').RouteConfig} RouteConfig
   * @param {string} routeStr Route string
   * @param {RouteConfig} [rConfig] Route config
   */
  function set(routeStr, rConfig) {
    const routeConfig = isObject$1(rConfig) ? rConfig : {};
    const [route, qs] = routeStr.split(QRY);
    const {
      replace = false,
      preventDefault = false,
      queryString = qs,
      data,
      pageTitle = null
    } = routeConfig;
    const {
      preservePath,
      hashRouting: hash,
      history,
      context
    } = this.config;
    // Resolve to URL query string if it's not explicitly passed
    let routeString = trim(route);
    if (isValidRoute(routeString)) {
      const path = routeString;
      if (hash) {
        routeString = `${preservePath ? '' : '/'}#${routeString}`;
      }
      // Append query string
      routeString = `${routeString}${trim(queryString ? `${QRY + queryString}` : EMPTY)}`;
      const savedState = history.state || {
        idx: 0
      };
      history[replace ? REPLACE : PUSH]({
        data,
        idx: savedState.idx + 1
      }, pageTitle, routeString);
      if (!preventDefault && path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path,
          hash
        }, undefined, this]);
      }
    } else {
      throw new TypeError(INVALID_ROUTE);
    }
  }

  /******************************************************************************
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
  /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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

  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }

  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
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

  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

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
          this._finalizers = null;
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
              var initialFinalizer = this.initialTeardown;
              if (isFunction(initialFinalizer)) {
                  try {
                      initialFinalizer();
                  }
                  catch (e) {
                      errors = e instanceof UnsubscriptionError ? e.errors : [e];
                  }
              }
              var _finalizers = this._finalizers;
              if (_finalizers) {
                  this._finalizers = null;
                  try {
                      for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                          var finalizer = _finalizers_1_1.value;
                          try {
                              execFinalizer(finalizer);
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
                          if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
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
                  execFinalizer(teardown);
              }
              else {
                  if (teardown instanceof Subscription) {
                      if (teardown.closed || teardown._hasParent(this)) {
                          return;
                      }
                      teardown._addParent(this);
                  }
                  (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
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
          var _finalizers = this._finalizers;
          _finalizers && arrRemove(_finalizers, teardown);
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
  Subscription.EMPTY;
  function isSubscription(value) {
      return (value instanceof Subscription ||
          (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
  }
  function execFinalizer(finalizer) {
      if (isFunction(finalizer)) {
          finalizer();
      }
      else {
          finalizer.unsubscribe();
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
      setTimeout: function (handler, timeout) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
              args[_i - 2] = arguments[_i];
          }
          return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
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

  function errorContext(cb) {
      {
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
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
      return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = (function () {
      function ConsumerObserver(partialObserver) {
          this.partialObserver = partialObserver;
      }
      ConsumerObserver.prototype.next = function (value) {
          var partialObserver = this.partialObserver;
          if (partialObserver.next) {
              try {
                  partialObserver.next(value);
              }
              catch (error) {
                  handleUnhandledError(error);
              }
          }
      };
      ConsumerObserver.prototype.error = function (err) {
          var partialObserver = this.partialObserver;
          if (partialObserver.error) {
              try {
                  partialObserver.error(err);
              }
              catch (error) {
                  handleUnhandledError(error);
              }
          }
          else {
              handleUnhandledError(err);
          }
      };
      ConsumerObserver.prototype.complete = function () {
          var partialObserver = this.partialObserver;
          if (partialObserver.complete) {
              try {
                  partialObserver.complete();
              }
              catch (error) {
                  handleUnhandledError(error);
              }
          }
      };
      return ConsumerObserver;
  }());
  var SafeSubscriber = (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          var partialObserver;
          if (isFunction(observerOrNext) || !observerOrNext) {
              partialObserver = {
                  next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                  error: error !== null && error !== void 0 ? error : undefined,
                  complete: complete !== null && complete !== void 0 ? complete : undefined,
              };
          }
          else {
              var context_1;
              if (_this && config.useDeprecatedNextContext) {
                  context_1 = Object.create(observerOrNext);
                  context_1.unsubscribe = function () { return _this.unsubscribe(); };
                  partialObserver = {
                      next: observerOrNext.next && bind(observerOrNext.next, context_1),
                      error: observerOrNext.error && bind(observerOrNext.error, context_1),
                      complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                  };
              }
              else {
                  partialObserver = observerOrNext;
              }
          }
          _this.destination = new ConsumerObserver(partialObserver);
          return _this;
      }
      return SafeSubscriber;
  }(Subscriber));
  function handleUnhandledError(error) {
      {
          reportUnhandledError(error);
      }
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
              var subscriber = new SafeSubscriber({
                  next: function (value) {
                      try {
                          next(value);
                      }
                      catch (err) {
                          reject(err);
                          subscriber.unsubscribe();
                      }
                  },
                  error: reject,
                  complete: resolve,
              });
              _this.subscribe(subscriber);
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
          return pipeFromArray(operations)(this);
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

  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
      return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = (function (_super) {
      __extends(OperatorSubscriber, _super);
      function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
          var _this = _super.call(this, destination) || this;
          _this.onFinalize = onFinalize;
          _this.shouldUnsubscribe = shouldUnsubscribe;
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
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
              var closed_1 = this.closed;
              _super.prototype.unsubscribe.call(this);
              !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
          }
      };
      return OperatorSubscriber;
  }(Subscriber));

  var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

  function isPromise(value) {
      return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }

  function isInteropObservable(input) {
      return isFunction(input[observable]);
  }

  function isAsyncIterable(obj) {
      return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }

  function createInvalidObservableTypeError(input) {
      return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }

  function getSymbolIterator() {
      if (typeof Symbol !== 'function' || !Symbol.iterator) {
          return '@@iterator';
      }
      return Symbol.iterator;
  }
  var iterator = getSymbolIterator();

  function isIterable(input) {
      return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
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

  function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
      if (delay === void 0) { delay = 0; }
      if (repeat === void 0) { repeat = false; }
      var scheduleSubscription = scheduler.schedule(function () {
          work();
          if (repeat) {
              parentSubscription.add(this.schedule(null, delay));
          }
          else {
              this.unsubscribe();
          }
      }, delay);
      parentSubscription.add(scheduleSubscription);
      if (!repeat) {
          return scheduleSubscription;
      }
  }

  function map(project, thisArg) {
      return operate(function (source, subscriber) {
          var index = 0;
          source.subscribe(createOperatorSubscriber(subscriber, function (value) {
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

  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
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
          active++;
          var innerComplete = false;
          innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function (innerValue) {
              {
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
                          if (innerSubScheduler) ;
                          else {
                              doInnerSub(bufferedValue);
                          }
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
      source.subscribe(createOperatorSubscriber(subscriber, outerNext, function () {
          isComplete = true;
          checkComplete();
      }));
      return function () {
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
              return mergeMap(function (subTarget) { return fromEvent(subTarget, eventName, options); })(innerFrom(target));
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

  const getPath = (isHash, location) => {
    return trim(isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
  };

  /**
   * Creates an instance of router event
   */
  class RouterEvent {
    /**
     * Creates a instance of router event
     * @typedef {import('./types').RouteInfo} RouteInfo
     * @param {RouteInfo} routeInfo Route information
     * @param {CustomEvent} currentEvent Current event object
     */
    constructor(routeInfo, currentEvent) {
      // Set relevant parameters
      const [routeObject, originalEvent, routerInstance] = routeInfo;
      const {
        location,
        history
      } = routerInstance.config;
      this.route = routeObject.path;
      this.isHashRoute = routeObject.hash;
      this.router = routerInstance;
      this.currentEvent = originalEvent || currentEvent;
      this.query = {
        path: trim(location.search.substring(1)),
        hash: trim(location.hash.split(QRY)[1])
      };
      const {
        state
      } = originalEvent || {};
      const {
        data,
        idx = 0
      } = state || history.state || {};
      this.data = data;
      this.index = +idx;
    }
  }

  /**
   * Calls the handler once on initialization
   * @param {boolean} [isd] Optional flag used as a switch
   * @returns {(observable: Observable<any>) => Observable<any>}
   */
  function callOnce(isd) {
    let isDone = isd;
    const {
      hashRouting: hash,
      location,
      init
    } = this.config;
    const path = getPath(hash, location);
    return observable => new Observable(subscriber => {
      const subn = observable.subscribe(subscriber);
      if (!isDone) {
        isDone = true;
        if (init && path) {
          subscriber.next(new RouterEvent([{
            path,
            hash
          }, undefined, this]));
        }
      }
      return () => {
        subn.unsubscribe();
      };
    });
  }

  /**
   * Attaches a route handler
   * @returns {(observable: Observable<any>) => Observable<any>}
   */
  function collate() {
    return observable => new Observable(subscriber => {
      const subn = observable.subscribe({
        next: event => {
          const [,, routerInstance] = event.detail;
          if (routerInstance === this) {
            subscriber.next(new RouterEvent(event.detail, event));
          }
        },
        error: subscriber.error,
        complete: subscriber.complete
      });
      return () => {
        subn.unsubscribe();
      };
    });
  }

  /**
   * Core router class to handle basic routing functionality
   */
  class RouterCore {
    static get global() {
      return typeof globalThis !== 'undefined' ? globalThis : global || self;
    }
    /**
     * Router core constructor
     * @typedef {import('./types').RouterCoreConfig} RouterCoreConfig
     * @param {RouterCoreConfig} routerCoreConfig Route core configuration
     */
    constructor(_ref) {
      let {
        history,
        context,
        location,
        hash
      } = _ref;
      if (!history[PUSH]) {
        throw new Error(HISTORY_UNSUPPORTED);
      }
      this.popStateSubscription = fromEvent(RouterCore.global, POP_STATE).subscribe(e => {
        const path = getPath(hash, location);
        if (path) {
          trigger(context, VIRTUAL_PUSHSTATE, [{
            path,
            hash
          }, e, this]);
        }
      });
      this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(this));
    }
    /**
     * Allows you to add operators for any pre-processing before a handler is called
     * @typedef {import('./types').Operator} Operator
     * @typedef {import('rxjs').Observable} Observable
     * @param  {...Operator} ops Operators
     * @returns {Observable<any>}
     */
    pipe() {
      for (var _len = arguments.length, ops = new Array(_len), _key = 0; _key < _len; _key++) {
        ops[_key] = arguments[_key];
      }
      return this.listeners.pipe(callOnce.apply(this), ...ops);
    }
    /**
     * Attaches a route handler
     * @typedef {import('../routerEvent/index').RouterEvent} RouterEvent
     * @param {(event: RouterEvent) => void} fn Route handler
     */
    subscribe(fn) {
      return this.pipe().subscribe(fn);
    }
    /**
     * Destroys current router instance
     * @param {() => void} callback Callback for destroy function
     */
    destroy(callback) {
      if (typeof callback === 'function') {
        callback();
      }
      this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
    }
  }

  /**
   * Browser router to handle routing logic
   */
  class Router extends RouterCore {
    /**
     * Router constructor
     * @typedef {import('./types').RouterConfig} RouterConfig
     * @param {RouterConfig} config
     */
    constructor(config) {
      config = isObject$1(config) ? config : {};
      const {
        history,
        location,
        document
      } = RouterCore.global;
      const context = document.body;
      super({
        history,
        location,
        context,
        hash: config.hashRouting
      });
      this.config = Object.freeze({
        init: true,
        hashRouting: false,
        preservePath: false,
        context,
        history,
        location,
        ...config
      });
      if (config.hashRouting && !location.hash) {
        this.set('/', {
          replace: true,
          preventDefault: true // Don't execute route handlers
        });
      }
    }
    /**
     * Sets the current route path
     * @typedef {import('../set/types').RouteConfig} RouteConfig
     * @param {string} path Route path
     * @param {RouteConfig} routeConfig Route config
     */
    set(path, routeConfig) {
      set.apply(this, [path, routeConfig]);
    }
  }

  const name="silkrouter";const version="5.0.1";const description="Silk router is an app routing library";const main="dist/umd/silkrouter.min.js";const module="dist/esm/silkrouter.esm.min.js";const types="dist/typings/index.d.ts";const scripts={start:"env-cmd -f ./.env.start rollup -c --watch",dev:"env-cmd -f ./.env.dev rollup -c","dev:serve":"env-cmd -f ./.env.start.prod rollup -c",dist:"npm run dev && npm run dev:serve && npm run prod",prod:"env-cmd rollup -c",build:"npm run check:sanity && npm run test && npm run dist && npm run typings",test:"jest tests/* --coverage",deploy:"gh-pages -d dist","check:sanity":"biome check --write src/",typings:"tsc src/js/index.js --declaration --allowJs --emitDeclarationOnly --outDir dist/typings"};const author="scssyworks";const license="MIT";const keywords=["router","browserrouter","silkrouter","pushstate","popstate","history","rxjs","observables"];const files=["dist/umd/","dist/esm/","dist/typings/","LICENSE"];const repository={type:"git",url:"git+https://github.com/scssyworks/silkrouter.git"};const bugs={url:"https://github.com/scssyworks/silkrouter/issues"};const homepage="https://scssyworks.github.io/silkrouter";const peerDependencies={rxjs:"^7.8.1"};const dependencies={"core-js":"^3.32.0","is-number":"^7.0.0","is-object":"^1.0.2"};const devDependencies={"@babel/core":"^7.25.2","@babel/eslint-parser":"^7.25.1","@babel/preset-env":"^7.25.4","@biomejs/biome":"^1.8.3","@rollup/plugin-babel":"^6.0.4","@rollup/plugin-commonjs":"^26.0.1","@rollup/plugin-eslint":"^9.0.5","@rollup/plugin-json":"^6.1.0","@rollup/plugin-node-resolve":"^15.2.3","@rollup/plugin-terser":"^0.4.4","@types/jest":"^29.5.12","env-cmd":"^10.1.0",eslint:"^9.9.1","gh-pages":"^6.1.1",jest:"^29.7.0",rollup:"^4.21.2","rollup-plugin-filesize":"^10.0.0","rollup-plugin-livereload":"^2.0.5","rollup-plugin-serve":"^1.1.1",rxjs:"^7.8.1",typescript:"^5.5.4"};var pkg = {name:name,version:version,description:description,main:main,module:module,types:types,scripts:scripts,author:author,license:license,keywords:keywords,files:files,repository:repository,bugs:bugs,homepage:homepage,peerDependencies:peerDependencies,dependencies:dependencies,devDependencies:devDependencies};

  function q(selector) {
    if (typeof selector === 'string') {
      const elArray = [];
      selector.split(',').map(selectorPart => selectorPart.trim()).forEach(selectorPart => {
        const selected = [...document.querySelectorAll(selectorPart)];
        selected.forEach(el => {
          if (!elArray.includes(el)) {
            elArray.push(el);
          }
        });
      });
      return elArray;
    }
    return [...document.querySelectorAll(...arguments)];
  }
  function renderVersion() {
    q('.version').forEach(el => {
      const wrapper = el.querySelector('span');
      if (wrapper) {
        wrapper.textContent = pkg.version;
      }
    });
  }
  function initializeRouting() {
    q('#checkHash').forEach(el => {
      el.checked = window.sessionStorage.getItem('checkedStatus') === '1';
    });
    const router = new Router();
    let childRouter = router;
    router.subscribe(e => {
      const eventRoute = location.hostname === 'scssyworks.github.io' ? e.route.replace(/\/silkrouter\//, '/') : e.route;
      q('a.nav-link').forEach(el => {
        el.classList.remove('active');
        const elRoute = el.getAttribute('href');
        if (elRoute === '/' && eventRoute === elRoute || elRoute !== '/' && eventRoute.includes(elRoute)) {
          el.classList.add('active');
        }
      });
      q('[data-section]').forEach(el => {
        el.classList.add('d-none');
        const elSection = el.getAttribute('data-section');
        if (elSection === '/' && eventRoute === elSection) {
          el.classList.remove('d-none');
        } else if (elSection !== '/' && eventRoute.includes(elSection)) {
          el.classList.remove('d-none');
        }
      });
      q('.params-data, .query-next-step, .query-data, .data-next-step, .state-data, .pass-data-tutorial').forEach(el => {
        el.classList.add('d-none');
      });
    });
    const paramsRoute = location.hostname === 'scssyworks.github.io' ? '/silkrouter/tab3/:firstname/:lastname' : '/tab3/:firstname/:lastname';
    router.subscribe(e => {
      const params = resolveParams(paramsRoute, e.route);
      if (Object.keys(params).length) {
        q('.params-data').forEach(el => {
          el.textContent = JSON.stringify(params, null, 2);
        });
        q('.params-data, .query-next-step').forEach(el => {
          el.classList.remove('d-none');
        });
        if (e.query.path) {
          q('.query-data').forEach(el => {
            el.textContent = e.query.path;
            el.classList.remove('d-none');
          });
          q('.data-next-step').forEach(el => {
            el.classList.remove('d-none');
          });
        }
        if (e.data) {
          q('.state-data').forEach(el => {
            el.textContent = e.data;
            el.classList.remove('d-none');
          });
          q('.pass-data-tutorial').forEach(el => {
            el.classList.remove('d-none');
          });
        }
      }
    });
    document.addEventListener('click', e => {
      q('a.nav-link').forEach(el => {
        if (el.contains(e.target)) {
          e.preventDefault();
          const isRelative = el.hasAttribute('data-relative');
          let route = isRelative && q('#checkHash:checked').length === 0 ? el.closest('section').getAttribute('data-section') + el.getAttribute('href') : el.getAttribute('href');
          if (location.hostname === 'scssyworks.github.io') {
            route = `/silkrouter${route}`;
          }
          if (isRelative) {
            if (location.hostname === 'scssyworks.github.io' && childRouter.config.hashRouting) {
              route = route.replace(/\/silkrouter\//, '/');
            }
            childRouter.set(route);
          } else {
            router.set(route);
          }
        }
      });
      q('.btn-primary.clear-session').forEach(el => {
        if (el.contains(e.target)) {
          window.sessionStorage.clear();
          window.location.href = location.hostname === 'scssyworks.github.io' ? '/silkrouter/tab2/' : '/tab2/';
        }
      });
      q('.append-param').forEach(el => {
        if (el.contains(e.target)) {
          router.set(`${location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''}/tab3/john/doe`);
        }
      });
      q('.append-query').forEach(el => {
        if (el.contains(e.target)) {
          router.set(`${location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''}/tab3/john/doe`, {
            queryString: 'q=HelloWorld'
          });
        }
      });
      q('.append-data').forEach(el => {
        if (el.contains(e.target)) {
          router.set(`${location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''}/tab3/john/doe`, {
            queryString: 'q=HelloWorld',
            data: 'Hi there!'
          });
        }
      });
    });
    q('#checkHash').forEach(el => {
      el.addEventListener('change', () => {
        window.sessionStorage.setItem('checkedStatus', `${q('#checkHash:checked').length}`);
        window.location.href = `${location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''}/tab2/`;
      });
    });
    if (q('#checkHash:checked').length) {
      const hashRouter = new Router({
        hashRouting: true,
        preservePath: true
      });
      hashRouter.subscribe(e => {
        q('a.nav-link[data-relative]').forEach(el => {
          el.classList.remove('active');
          if (e.route.includes(el.getAttribute('href'))) {
            el.classList.add('active');
          }
        });
      });
      childRouter = hashRouter;
    }
  }
  function setGlobals() {
    window.Router = Router;
    window.RouterCore = RouterCore;
  }
  initializeRouting();
  renderVersion();
  setGlobals();

})();
//# sourceMappingURL=silkrouter.iife.js.map
