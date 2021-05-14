
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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

  /**
   * Shorthand for Array.isArray
   */

  var isArr = Array.isArray;
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

  function isObject$1(value) {
    return value && _typeof(value) === TYPEOF_OBJ;
  }
  /**
   * Checks if key is a true object
   * @param {*} value Any type of value
   */

  function isPureObject(value) {
    return isObject$1(value) && !isArr(value);
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
    if (arrayObj && arrayObj.length) {
      for (var index = 0; index < arrayObj.length; index += 1) {
        if (_typeof(callback) === TYPEOF_FUNC) {
          var continueTheLoop = callback.apply(arrayObj, [arrayObj[index], index]);

          if (_typeof(continueTheLoop) === TYPEOF_BOOL) {
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

      for (var i = 0; i < arrayLike.length; i++) {
        arr.push(arrayLike[i]);
      }

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
    if (isObject$1(ref)) {
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


  function assign() {
    var target = isObject$1(arguments.length <= 0 ? undefined : arguments[0]) ? arguments.length <= 0 ? undefined : arguments[0] : {};

    for (var i = 1; i < arguments.length; i++) {
      loopFunc(i < 0 || arguments.length <= i ? undefined : arguments[i], target);
    }

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
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isFunction(x) {
      return typeof x === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config = {
      Promise: undefined,
      set useDeprecatedSynchronousErrorHandling(value) {
          if (value) {
              var error = /*@__PURE__*/ new Error();
              /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
          }
          _enable_super_gross_mode_that_will_cause_bad_things = value;
      },
      get useDeprecatedSynchronousErrorHandling() {
          return _enable_super_gross_mode_that_will_cause_bad_things;
      },
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function hostReportError(err) {
      setTimeout(function () { throw err; }, 0);
  }

  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
  var empty = {
      closed: true,
      next: function (value) { },
      error: function (err) {
          if (config.useDeprecatedSynchronousErrorHandling) {
              throw err;
          }
          else {
              hostReportError(err);
          }
      },
      complete: function () { }
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isObject(x) {
      return x !== null && typeof x === 'object';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
      function UnsubscriptionErrorImpl(errors) {
          Error.call(this);
          this.message = errors ?
              errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
          this.name = 'UnsubscriptionError';
          this.errors = errors;
          return this;
      }
      UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
      return UnsubscriptionErrorImpl;
  })();
  var UnsubscriptionError = UnsubscriptionErrorImpl;

  /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
  var Subscription = /*@__PURE__*/ (function () {
      function Subscription(unsubscribe) {
          this.closed = false;
          this._parentOrParents = null;
          this._subscriptions = null;
          if (unsubscribe) {
              this._ctorUnsubscribe = true;
              this._unsubscribe = unsubscribe;
          }
      }
      Subscription.prototype.unsubscribe = function () {
          var errors;
          if (this.closed) {
              return;
          }
          var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
          this.closed = true;
          this._parentOrParents = null;
          this._subscriptions = null;
          if (_parentOrParents instanceof Subscription) {
              _parentOrParents.remove(this);
          }
          else if (_parentOrParents !== null) {
              for (var index = 0; index < _parentOrParents.length; ++index) {
                  var parent_1 = _parentOrParents[index];
                  parent_1.remove(this);
              }
          }
          if (isFunction(_unsubscribe)) {
              if (_ctorUnsubscribe) {
                  this._unsubscribe = undefined;
              }
              try {
                  _unsubscribe.call(this);
              }
              catch (e) {
                  errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
              }
          }
          if (isArray(_subscriptions)) {
              var index = -1;
              var len = _subscriptions.length;
              while (++index < len) {
                  var sub = _subscriptions[index];
                  if (isObject(sub)) {
                      try {
                          sub.unsubscribe();
                      }
                      catch (e) {
                          errors = errors || [];
                          if (e instanceof UnsubscriptionError) {
                              errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                          }
                          else {
                              errors.push(e);
                          }
                      }
                  }
              }
          }
          if (errors) {
              throw new UnsubscriptionError(errors);
          }
      };
      Subscription.prototype.add = function (teardown) {
          var subscription = teardown;
          if (!teardown) {
              return Subscription.EMPTY;
          }
          switch (typeof teardown) {
              case 'function':
                  subscription = new Subscription(teardown);
              case 'object':
                  if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                      return subscription;
                  }
                  else if (this.closed) {
                      subscription.unsubscribe();
                      return subscription;
                  }
                  else if (!(subscription instanceof Subscription)) {
                      var tmp = subscription;
                      subscription = new Subscription();
                      subscription._subscriptions = [tmp];
                  }
                  break;
              default: {
                  throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
              }
          }
          var _parentOrParents = subscription._parentOrParents;
          if (_parentOrParents === null) {
              subscription._parentOrParents = this;
          }
          else if (_parentOrParents instanceof Subscription) {
              if (_parentOrParents === this) {
                  return subscription;
              }
              subscription._parentOrParents = [_parentOrParents, this];
          }
          else if (_parentOrParents.indexOf(this) === -1) {
              _parentOrParents.push(this);
          }
          else {
              return subscription;
          }
          var subscriptions = this._subscriptions;
          if (subscriptions === null) {
              this._subscriptions = [subscription];
          }
          else {
              subscriptions.push(subscription);
          }
          return subscription;
      };
      Subscription.prototype.remove = function (subscription) {
          var subscriptions = this._subscriptions;
          if (subscriptions) {
              var subscriptionIndex = subscriptions.indexOf(subscription);
              if (subscriptionIndex !== -1) {
                  subscriptions.splice(subscriptionIndex, 1);
              }
          }
      };
      Subscription.EMPTY = (function (empty) {
          empty.closed = true;
          return empty;
      }(new Subscription()));
      return Subscription;
  }());
  function flattenUnsubscriptionErrors(errors) {
      return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var rxSubscriber = /*@__PURE__*/ (function () {
      return typeof Symbol === 'function'
          ? /*@__PURE__*/ Symbol('rxSubscriber')
          : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
  })();

  /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
  var Subscriber = /*@__PURE__*/ (function (_super) {
      __extends(Subscriber, _super);
      function Subscriber(destinationOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this.syncErrorValue = null;
          _this.syncErrorThrown = false;
          _this.syncErrorThrowable = false;
          _this.isStopped = false;
          switch (arguments.length) {
              case 0:
                  _this.destination = empty;
                  break;
              case 1:
                  if (!destinationOrNext) {
                      _this.destination = empty;
                      break;
                  }
                  if (typeof destinationOrNext === 'object') {
                      if (destinationOrNext instanceof Subscriber) {
                          _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                          _this.destination = destinationOrNext;
                          destinationOrNext.add(_this);
                      }
                      else {
                          _this.syncErrorThrowable = true;
                          _this.destination = new SafeSubscriber(_this, destinationOrNext);
                      }
                      break;
                  }
              default:
                  _this.syncErrorThrowable = true;
                  _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                  break;
          }
          return _this;
      }
      Subscriber.prototype[rxSubscriber] = function () { return this; };
      Subscriber.create = function (next, error, complete) {
          var subscriber = new Subscriber(next, error, complete);
          subscriber.syncErrorThrowable = false;
          return subscriber;
      };
      Subscriber.prototype.next = function (value) {
          if (!this.isStopped) {
              this._next(value);
          }
      };
      Subscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              this.isStopped = true;
              this._error(err);
          }
      };
      Subscriber.prototype.complete = function () {
          if (!this.isStopped) {
              this.isStopped = true;
              this._complete();
          }
      };
      Subscriber.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.isStopped = true;
          _super.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function (value) {
          this.destination.next(value);
      };
      Subscriber.prototype._error = function (err) {
          this.destination.error(err);
          this.unsubscribe();
      };
      Subscriber.prototype._complete = function () {
          this.destination.complete();
          this.unsubscribe();
      };
      Subscriber.prototype._unsubscribeAndRecycle = function () {
          var _parentOrParents = this._parentOrParents;
          this._parentOrParents = null;
          this.unsubscribe();
          this.closed = false;
          this.isStopped = false;
          this._parentOrParents = _parentOrParents;
          return this;
      };
      return Subscriber;
  }(Subscription));
  var SafeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this._parentSubscriber = _parentSubscriber;
          var next;
          var context = _this;
          if (isFunction(observerOrNext)) {
              next = observerOrNext;
          }
          else if (observerOrNext) {
              next = observerOrNext.next;
              error = observerOrNext.error;
              complete = observerOrNext.complete;
              if (observerOrNext !== empty) {
                  context = Object.create(observerOrNext);
                  if (isFunction(context.unsubscribe)) {
                      _this.add(context.unsubscribe.bind(context));
                  }
                  context.unsubscribe = _this.unsubscribe.bind(_this);
              }
          }
          _this._context = context;
          _this._next = next;
          _this._error = error;
          _this._complete = complete;
          return _this;
      }
      SafeSubscriber.prototype.next = function (value) {
          if (!this.isStopped && this._next) {
              var _parentSubscriber = this._parentSubscriber;
              if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                  this.__tryOrUnsub(this._next, value);
              }
              else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
              if (this._error) {
                  if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(this._error, err);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, this._error, err);
                      this.unsubscribe();
                  }
              }
              else if (!_parentSubscriber.syncErrorThrowable) {
                  this.unsubscribe();
                  if (useDeprecatedSynchronousErrorHandling) {
                      throw err;
                  }
                  hostReportError(err);
              }
              else {
                  if (useDeprecatedSynchronousErrorHandling) {
                      _parentSubscriber.syncErrorValue = err;
                      _parentSubscriber.syncErrorThrown = true;
                  }
                  else {
                      hostReportError(err);
                  }
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.complete = function () {
          var _this = this;
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              if (this._complete) {
                  var wrappedComplete = function () { return _this._complete.call(_this._context); };
                  if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(wrappedComplete);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                      this.unsubscribe();
                  }
              }
              else {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              this.unsubscribe();
              if (config.useDeprecatedSynchronousErrorHandling) {
                  throw err;
              }
              else {
                  hostReportError(err);
              }
          }
      };
      SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
          if (!config.useDeprecatedSynchronousErrorHandling) {
              throw new Error('bad call');
          }
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              if (config.useDeprecatedSynchronousErrorHandling) {
                  parent.syncErrorValue = err;
                  parent.syncErrorThrown = true;
                  return true;
              }
              else {
                  hostReportError(err);
                  return true;
              }
          }
          return false;
      };
      SafeSubscriber.prototype._unsubscribe = function () {
          var _parentSubscriber = this._parentSubscriber;
          this._context = null;
          this._parentSubscriber = null;
          _parentSubscriber.unsubscribe();
      };
      return SafeSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
  function canReportError(observer) {
      while (observer) {
          var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
          if (closed_1 || isStopped) {
              return false;
          }
          else if (destination && destination instanceof Subscriber) {
              observer = destination;
          }
          else {
              observer = null;
          }
      }
      return true;
  }

  /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
  function toSubscriber(nextOrObserver, error, complete) {
      if (nextOrObserver) {
          if (nextOrObserver instanceof Subscriber) {
              return nextOrObserver;
          }
          if (nextOrObserver[rxSubscriber]) {
              return nextOrObserver[rxSubscriber]();
          }
      }
      if (!nextOrObserver && !error && !complete) {
          return new Subscriber(empty);
      }
      return new Subscriber(nextOrObserver, error, complete);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function identity(x) {
      return x;
  }

  /** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
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

  /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
  var Observable = /*@__PURE__*/ (function () {
      function Observable(subscribe) {
          this._isScalar = false;
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
          var operator = this.operator;
          var sink = toSubscriber(observerOrNext, error, complete);
          if (operator) {
              sink.add(operator.call(sink, this.source));
          }
          else {
              sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                  this._subscribe(sink) :
                  this._trySubscribe(sink));
          }
          if (config.useDeprecatedSynchronousErrorHandling) {
              if (sink.syncErrorThrowable) {
                  sink.syncErrorThrowable = false;
                  if (sink.syncErrorThrown) {
                      throw sink.syncErrorValue;
                  }
              }
          }
          return sink;
      };
      Observable.prototype._trySubscribe = function (sink) {
          try {
              return this._subscribe(sink);
          }
          catch (err) {
              if (config.useDeprecatedSynchronousErrorHandling) {
                  sink.syncErrorThrown = true;
                  sink.syncErrorValue = err;
              }
              if (canReportError(sink)) {
                  sink.error(err);
              }
              else {
                  console.warn(err);
              }
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
                      if (subscription) {
                          subscription.unsubscribe();
                      }
                  }
              }, reject, resolve);
          });
      };
      Observable.prototype._subscribe = function (subscriber) {
          var source = this.source;
          return source && source.subscribe(subscriber);
      };
      Observable.prototype[observable] = function () {
          return this;
      };
      Observable.prototype.pipe = function () {
          var operations = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              operations[_i] = arguments[_i];
          }
          if (operations.length === 0) {
              return this;
          }
          return pipeFromArray(operations)(this);
      };
      Observable.prototype.toPromise = function (promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var value;
              _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
          });
      };
      Observable.create = function (subscribe) {
          return new Observable(subscribe);
      };
      return Observable;
  }());
  function getPromiseCtor(promiseCtor) {
      if (!promiseCtor) {
          promiseCtor = Promise;
      }
      if (!promiseCtor) {
          throw new Error('no Promise impl found');
      }
      return promiseCtor;
  }

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function map(project, thisArg) {
      return function mapOperation(source) {
          if (typeof project !== 'function') {
              throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
          }
          return source.lift(new MapOperator(project, thisArg));
      };
  }
  var MapOperator = /*@__PURE__*/ (function () {
      function MapOperator(project, thisArg) {
          this.project = project;
          this.thisArg = thisArg;
      }
      MapOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
      };
      return MapOperator;
  }());
  var MapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MapSubscriber, _super);
      function MapSubscriber(destination, project, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.count = 0;
          _this.thisArg = thisArg || _this;
          return _this;
      }
      MapSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.project.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return MapSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
  function fromEvent(target, eventName, options, resultSelector) {
      if (isFunction(options)) {
          resultSelector = options;
          options = undefined;
      }
      if (resultSelector) {
          return fromEvent(target, eventName, options).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
      }
      return new Observable(function (subscriber) {
          function handler(e) {
              if (arguments.length > 1) {
                  subscriber.next(Array.prototype.slice.call(arguments));
              }
              else {
                  subscriber.next(e);
              }
          }
          setupSubscription(target, eventName, handler, subscriber, options);
      });
  }
  function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
      var unsubscribe;
      if (isEventTarget(sourceObj)) {
          var source_1 = sourceObj;
          sourceObj.addEventListener(eventName, handler, options);
          unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
      }
      else if (isJQueryStyleEventEmitter(sourceObj)) {
          var source_2 = sourceObj;
          sourceObj.on(eventName, handler);
          unsubscribe = function () { return source_2.off(eventName, handler); };
      }
      else if (isNodeStyleEventEmitter(sourceObj)) {
          var source_3 = sourceObj;
          sourceObj.addListener(eventName, handler);
          unsubscribe = function () { return source_3.removeListener(eventName, handler); };
      }
      else if (sourceObj && sourceObj.length) {
          for (var i = 0, len = sourceObj.length; i < len; i++) {
              setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
          }
      }
      else {
          throw new TypeError('Invalid event target');
      }
      subscriber.add(unsubscribe);
  }
  function isNodeStyleEventEmitter(sourceObj) {
      return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
  }
  function isJQueryStyleEventEmitter(sourceObj) {
      return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
  }
  function isEventTarget(sourceObj) {
      return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
  }

  var g = getGlobal(); // Internal function

  function isValidTarget(target) {
    return target instanceof NodeList || target instanceof HTMLCollection || Array.isArray(target);
  }
  /**
   * Function to trigger custom event
   * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
   * @param {string} eventType Event type
   * @param {any[]} data Data to be passed to handler
   */


  function trigger(target, eventType, data) {
    if (target instanceof Node) {
      target = [target];
    }

    if (isValidTarget(target) && _typeof(eventType) === TYPEOF_STR) {
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
    if (isObject$1(obj)) {
      Object.keys(obj).forEach(function (obKey) {
        buildQuery(qsList, "".concat(key, "[").concat(isArr(obj) ? EMPTY : obKey, "]"), obj[obKey]);
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

    if (isObject$1(obj)) {
      Object.keys(obj).forEach(function (key) {
        buildQuery(qsList, key, obj[key]);
      });
      return qsList.join(AMP);
    }

    return _typeof(obj) === TYPEOF_STR ? obj : EMPTY;
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

    var queryObject = Object.create(null);

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
    var convertedObj = Object.create(null);

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

    if (isObject$1(queryString)) {
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
        location = _this$config.location;
    var path = trim(hash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
    return function (observable) {
      return new Observable(function (subscriber) {
        var subn = observable.subscribe(subscriber);

        if (!isDone) {
          isDone = true;

          if (path) {
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
    function Router() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Router);

      var _getGlobal = getGlobal(),
          history = _getGlobal.history,
          location = _getGlobal.location,
          document = _getGlobal.document;

      if (!history[PUSH]) {
        throw new Error(HISTORY_UNSUPPORTED);
      }

      config = assign({
        hashRouting: false,
        // Switch to hash routing
        preservePath: false,
        // Works for hash routing
        context: document.body,
        // To change the context of "vpushstate" event
        location: location,
        // Should remain unchanged
        history: history // History object

      }, config);
      this.config = Object.freeze(config);
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
        keys.forEach(function (key, index) {
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
              var paramsLength = Object.keys(params).length;

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

                for (var i = 0; i < paths.length; i++) {
                  if (paths[i] === currentRoute || Object.keys(extractParams(paths[i], currentRoute)).length) {
                    match = true;
                    break;
                  }
                }

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
    each(Object.keys(first), function (key) {
      if (isObject$1(first[key]) && isObject$1(second[key])) {
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
              if (deep && isObject$1(event[key]) && isObject$1(cache[key])) {
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

  const name="silkrouter";const version="4.2.0";const description="Silk router is an app routing library";const main="dist/umd/silkrouter.js";const module="dist/esm/silkrouter.esm.js";const types="src/typings/silkrouter.d.ts";const scripts={start:"rollup -c --watch --environment SERVE:true",build:"npm run test && rollup -c",test:"jest tests/*",deploy:"gh-pages -d dist"};const author="scssyworks";const license="MIT";const devDependencies={"@babel/core":"^7.14.0","@babel/preset-env":"^7.14.1","@rollup/plugin-babel":"^5.3.0","@rollup/plugin-commonjs":"^11.1.0","@rollup/plugin-json":"^4.1.0","@rollup/plugin-node-resolve":"^6.1.0","@types/jest":"^25.2.3","babel-eslint":"^10.1.0","gh-pages":"^2.2.0",jest:"^25.5.4",rollup:"^2.47.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-livereload":"^1.3.0","rollup-plugin-serve":"^1.1.0","rollup-plugin-terser":"^7.0.2",rxjs:"^6.6.7"};const keywords=["router","routing","single page apps","single page application","SPA","silk","silk router","history","browser","url","hash","hash routing","pushState","popstate","hashchange","observables","observer","subscriber","subscribe","subscription","rxjs","reactivex"];const files=["dist/umd/","dist/esm/","src/typings/"];const repository={type:"git",url:"git+https://github.com/scssyworks/silkrouter.git"};const bugs={url:"https://github.com/scssyworks/silkrouter/issues"};const homepage="https://scssyworks.github.io/silkrouter";const peerDependencies={rxjs:"^6.5.4"};const dependencies={"is-number":"^7.0.0"};var pkg = {name:name,version:version,description:description,main:main,module:module,types:types,scripts:scripts,author:author,license:license,devDependencies:devDependencies,keywords:keywords,files:files,repository:repository,bugs:bugs,homepage:homepage,peerDependencies:peerDependencies,dependencies:dependencies};

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
    router.pipe(route(paramsRoute)).subscribe(function (e) {
      q('.params-data pre').forEach(function (el) {
        el.textContent = JSON.stringify(e.params, null, 2);
      });
      q('.params-data, .query-next-step').forEach(function (el) {
        el.classList.remove('d-none');
      });

      if (e.search) {
        q('.query-data').forEach(function (el) {
          el.querySelector('pre').textContent = e.search;
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
    window.cache = cache; // Test route

    var testRoute = new Router();
    testRoute.subscribe(function (e) {
      console.log(e.data);
    });
    window.testRoute = testRoute;
  }

  initializeRouting();
  renderDecorators();
  renderVersion();
  setGlobals();

}());
//# sourceMappingURL=silkrouter.iife.js.map
