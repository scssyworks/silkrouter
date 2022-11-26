
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _typeof$1(obj) {
    "@babel/helpers - typeof";

    return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof$1(obj);
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
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
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
   * Function to extend an object with new and updated properties
   * @private
   * @returns {object}
   */
  function assign() {
    return Object.assign.apply(Object, arguments);
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
  var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
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
          return (clearTimeout)(handle);
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

  function refCount() {
      return operate(function (source, subscriber) {
          var connection = null;
          source._refCount++;
          var refCounter = createOperatorSubscriber(subscriber, undefined, undefined, undefined, function () {
              if (!source || source._refCount <= 0 || 0 < --source._refCount) {
                  connection = null;
                  return;
              }
              var sharedConnection = source._connection;
              var conn = connection;
              connection = null;
              if (sharedConnection && (!conn || sharedConnection === conn)) {
                  sharedConnection.unsubscribe();
              }
              subscriber.unsubscribe();
          });
          source.subscribe(refCounter);
          if (!refCounter.closed) {
              connection = source.connect();
          }
      });
  }

  ((function (_super) {
      __extends(ConnectableObservable, _super);
      function ConnectableObservable(source, subjectFactory) {
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.subjectFactory = subjectFactory;
          _this._subject = null;
          _this._refCount = 0;
          _this._connection = null;
          if (hasLift(source)) {
              _this.lift = source.lift;
          }
          return _this;
      }
      ConnectableObservable.prototype._subscribe = function (subscriber) {
          return this.getSubject().subscribe(subscriber);
      };
      ConnectableObservable.prototype.getSubject = function () {
          var subject = this._subject;
          if (!subject || subject.isStopped) {
              this._subject = this.subjectFactory();
          }
          return this._subject;
      };
      ConnectableObservable.prototype._teardown = function () {
          this._refCount = 0;
          var _connection = this._connection;
          this._subject = this._connection = null;
          _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
      };
      ConnectableObservable.prototype.connect = function () {
          var _this = this;
          var connection = this._connection;
          if (!connection) {
              connection = this._connection = new Subscription();
              var subject_1 = this.getSubject();
              connection.add(this.source.subscribe(createOperatorSubscriber(subject_1, undefined, function () {
                  _this._teardown();
                  subject_1.complete();
              }, function (err) {
                  _this._teardown();
                  subject_1.error(err);
              }, function () { return _this._teardown(); })));
              if (connection.closed) {
                  this._connection = null;
                  connection = Subscription.EMPTY;
              }
          }
          return connection;
      };
      ConnectableObservable.prototype.refCount = function () {
          return refCount()(this);
      };
      return ConnectableObservable;
  })(Observable));

  var performanceTimestampProvider = {
      now: function () {
          return (performanceTimestampProvider.delegate || performance).now();
      },
      delegate: undefined,
  };

  var animationFrameProvider = {
      schedule: function (callback) {
          var request = requestAnimationFrame;
          var cancel = cancelAnimationFrame;
          var handle = request(function (timestamp) {
              cancel = undefined;
              callback(timestamp);
          });
          return new Subscription(function () { return cancel === null || cancel === void 0 ? void 0 : cancel(handle); });
      },
      requestAnimationFrame: function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var delegate = animationFrameProvider.delegate;
          return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
      },
      cancelAnimationFrame: function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return (cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
      },
      delegate: undefined,
  };

  function animationFramesFactory(timestampProvider) {
      var schedule = animationFrameProvider.schedule;
      return new Observable(function (subscriber) {
          var subscription = new Subscription();
          var provider = timestampProvider || performanceTimestampProvider;
          var start = provider.now();
          var run = function (timestamp) {
              var now = provider.now();
              subscriber.next({
                  timestamp: timestampProvider ? now : timestamp,
                  elapsed: now - start,
              });
              if (!subscriber.closed) {
                  subscription.add(schedule(run));
              }
          };
          subscription.add(schedule(run));
          return subscription;
      });
  }
  animationFramesFactory();

  var ObjectUnsubscribedError = createErrorClass(function (_super) {
      return function ObjectUnsubscribedErrorImpl() {
          _super(this);
          this.name = 'ObjectUnsubscribedError';
          this.message = 'object unsubscribed';
      };
  });

  var Subject = (function (_super) {
      __extends(Subject, _super);
      function Subject() {
          var _this = _super.call(this) || this;
          _this.closed = false;
          _this.currentObservers = null;
          _this.observers = [];
          _this.isStopped = false;
          _this.hasError = false;
          _this.thrownError = null;
          return _this;
      }
      Subject.prototype.lift = function (operator) {
          var subject = new AnonymousSubject(this, this);
          subject.operator = operator;
          return subject;
      };
      Subject.prototype._throwIfClosed = function () {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
      };
      Subject.prototype.next = function (value) {
          var _this = this;
          errorContext(function () {
              var e_1, _a;
              _this._throwIfClosed();
              if (!_this.isStopped) {
                  if (!_this.currentObservers) {
                      _this.currentObservers = Array.from(_this.observers);
                  }
                  try {
                      for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                          var observer = _c.value;
                          observer.next(value);
                      }
                  }
                  catch (e_1_1) { e_1 = { error: e_1_1 }; }
                  finally {
                      try {
                          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                      }
                      finally { if (e_1) throw e_1.error; }
                  }
              }
          });
      };
      Subject.prototype.error = function (err) {
          var _this = this;
          errorContext(function () {
              _this._throwIfClosed();
              if (!_this.isStopped) {
                  _this.hasError = _this.isStopped = true;
                  _this.thrownError = err;
                  var observers = _this.observers;
                  while (observers.length) {
                      observers.shift().error(err);
                  }
              }
          });
      };
      Subject.prototype.complete = function () {
          var _this = this;
          errorContext(function () {
              _this._throwIfClosed();
              if (!_this.isStopped) {
                  _this.isStopped = true;
                  var observers = _this.observers;
                  while (observers.length) {
                      observers.shift().complete();
                  }
              }
          });
      };
      Subject.prototype.unsubscribe = function () {
          this.isStopped = this.closed = true;
          this.observers = this.currentObservers = null;
      };
      Object.defineProperty(Subject.prototype, "observed", {
          get: function () {
              var _a;
              return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
          },
          enumerable: false,
          configurable: true
      });
      Subject.prototype._trySubscribe = function (subscriber) {
          this._throwIfClosed();
          return _super.prototype._trySubscribe.call(this, subscriber);
      };
      Subject.prototype._subscribe = function (subscriber) {
          this._throwIfClosed();
          this._checkFinalizedStatuses(subscriber);
          return this._innerSubscribe(subscriber);
      };
      Subject.prototype._innerSubscribe = function (subscriber) {
          var _this = this;
          var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
          if (hasError || isStopped) {
              return EMPTY_SUBSCRIPTION;
          }
          this.currentObservers = null;
          observers.push(subscriber);
          return new Subscription(function () {
              _this.currentObservers = null;
              arrRemove(observers, subscriber);
          });
      };
      Subject.prototype._checkFinalizedStatuses = function (subscriber) {
          var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
          if (hasError) {
              subscriber.error(thrownError);
          }
          else if (isStopped) {
              subscriber.complete();
          }
      };
      Subject.prototype.asObservable = function () {
          var observable = new Observable();
          observable.source = this;
          return observable;
      };
      Subject.create = function (destination, source) {
          return new AnonymousSubject(destination, source);
      };
      return Subject;
  }(Observable));
  var AnonymousSubject = (function (_super) {
      __extends(AnonymousSubject, _super);
      function AnonymousSubject(destination, source) {
          var _this = _super.call(this) || this;
          _this.destination = destination;
          _this.source = source;
          return _this;
      }
      AnonymousSubject.prototype.next = function (value) {
          var _a, _b;
          (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
      };
      AnonymousSubject.prototype.error = function (err) {
          var _a, _b;
          (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
      };
      AnonymousSubject.prototype.complete = function () {
          var _a, _b;
          (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
      };
      AnonymousSubject.prototype._subscribe = function (subscriber) {
          var _a, _b;
          return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
      };
      return AnonymousSubject;
  }(Subject));

  ((function (_super) {
      __extends(BehaviorSubject, _super);
      function BehaviorSubject(_value) {
          var _this = _super.call(this) || this;
          _this._value = _value;
          return _this;
      }
      Object.defineProperty(BehaviorSubject.prototype, "value", {
          get: function () {
              return this.getValue();
          },
          enumerable: false,
          configurable: true
      });
      BehaviorSubject.prototype._subscribe = function (subscriber) {
          var subscription = _super.prototype._subscribe.call(this, subscriber);
          !subscription.closed && subscriber.next(this._value);
          return subscription;
      };
      BehaviorSubject.prototype.getValue = function () {
          var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
          if (hasError) {
              throw thrownError;
          }
          this._throwIfClosed();
          return _value;
      };
      BehaviorSubject.prototype.next = function (value) {
          _super.prototype.next.call(this, (this._value = value));
      };
      return BehaviorSubject;
  })(Subject));

  var dateTimestampProvider = {
      now: function () {
          return (dateTimestampProvider.delegate || Date).now();
      },
      delegate: undefined,
  };

  ((function (_super) {
      __extends(ReplaySubject, _super);
      function ReplaySubject(_bufferSize, _windowTime, _timestampProvider) {
          if (_bufferSize === void 0) { _bufferSize = Infinity; }
          if (_windowTime === void 0) { _windowTime = Infinity; }
          if (_timestampProvider === void 0) { _timestampProvider = dateTimestampProvider; }
          var _this = _super.call(this) || this;
          _this._bufferSize = _bufferSize;
          _this._windowTime = _windowTime;
          _this._timestampProvider = _timestampProvider;
          _this._buffer = [];
          _this._infiniteTimeWindow = true;
          _this._infiniteTimeWindow = _windowTime === Infinity;
          _this._bufferSize = Math.max(1, _bufferSize);
          _this._windowTime = Math.max(1, _windowTime);
          return _this;
      }
      ReplaySubject.prototype.next = function (value) {
          var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
          if (!isStopped) {
              _buffer.push(value);
              !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
          }
          this._trimBuffer();
          _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype._subscribe = function (subscriber) {
          this._throwIfClosed();
          this._trimBuffer();
          var subscription = this._innerSubscribe(subscriber);
          var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
          var copy = _buffer.slice();
          for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
              subscriber.next(copy[i]);
          }
          this._checkFinalizedStatuses(subscriber);
          return subscription;
      };
      ReplaySubject.prototype._trimBuffer = function () {
          var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
          var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
          _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
          if (!_infiniteTimeWindow) {
              var now = _timestampProvider.now();
              var last = 0;
              for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                  last = i;
              }
              last && _buffer.splice(0, last + 1);
          }
      };
      return ReplaySubject;
  })(Subject));

  ((function (_super) {
      __extends(AsyncSubject, _super);
      function AsyncSubject() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._value = null;
          _this._hasValue = false;
          _this._isComplete = false;
          return _this;
      }
      AsyncSubject.prototype._checkFinalizedStatuses = function (subscriber) {
          var _a = this, hasError = _a.hasError, _hasValue = _a._hasValue, _value = _a._value, thrownError = _a.thrownError, isStopped = _a.isStopped, _isComplete = _a._isComplete;
          if (hasError) {
              subscriber.error(thrownError);
          }
          else if (isStopped || _isComplete) {
              _hasValue && subscriber.next(_value);
              subscriber.complete();
          }
      };
      AsyncSubject.prototype.next = function (value) {
          if (!this.isStopped) {
              this._value = value;
              this._hasValue = true;
          }
      };
      AsyncSubject.prototype.complete = function () {
          var _a = this, _hasValue = _a._hasValue, _value = _a._value, _isComplete = _a._isComplete;
          if (!_isComplete) {
              this._isComplete = true;
              _hasValue && _super.prototype.next.call(this, _value);
              _super.prototype.complete.call(this);
          }
      };
      return AsyncSubject;
  })(Subject));

  var Action = (function (_super) {
      __extends(Action, _super);
      function Action(scheduler, work) {
          return _super.call(this) || this;
      }
      Action.prototype.schedule = function (state, delay) {
          return this;
      };
      return Action;
  }(Subscription));

  var intervalProvider = {
      setInterval: function (handler, timeout) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
              args[_i - 2] = arguments[_i];
          }
          return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
      },
      clearInterval: function (handle) {
          return (clearInterval)(handle);
      },
      delegate: undefined,
  };

  var AsyncAction = (function (_super) {
      __extends(AsyncAction, _super);
      function AsyncAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          _this.pending = false;
          return _this;
      }
      AsyncAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) { delay = 0; }
          if (this.closed) {
              return this;
          }
          this.state = state;
          var id = this.id;
          var scheduler = this.scheduler;
          if (id != null) {
              this.id = this.recycleAsyncId(scheduler, id, delay);
          }
          this.pending = true;
          this.delay = delay;
          this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
          return this;
      };
      AsyncAction.prototype.requestAsyncId = function (scheduler, _id, delay) {
          if (delay === void 0) { delay = 0; }
          return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
      };
      AsyncAction.prototype.recycleAsyncId = function (_scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          if (delay != null && this.delay === delay && this.pending === false) {
              return id;
          }
          intervalProvider.clearInterval(id);
          return undefined;
      };
      AsyncAction.prototype.execute = function (state, delay) {
          if (this.closed) {
              return new Error('executing a cancelled action');
          }
          this.pending = false;
          var error = this._execute(state, delay);
          if (error) {
              return error;
          }
          else if (this.pending === false && this.id != null) {
              this.id = this.recycleAsyncId(this.scheduler, this.id, null);
          }
      };
      AsyncAction.prototype._execute = function (state, _delay) {
          var errored = false;
          var errorValue;
          try {
              this.work(state);
          }
          catch (e) {
              errored = true;
              errorValue = e ? e : new Error('Scheduled action threw falsy error');
          }
          if (errored) {
              this.unsubscribe();
              return errorValue;
          }
      };
      AsyncAction.prototype.unsubscribe = function () {
          if (!this.closed) {
              var _a = this, id = _a.id, scheduler = _a.scheduler;
              var actions = scheduler.actions;
              this.work = this.state = this.scheduler = null;
              this.pending = false;
              arrRemove(actions, this);
              if (id != null) {
                  this.id = this.recycleAsyncId(scheduler, id, null);
              }
              this.delay = null;
              _super.prototype.unsubscribe.call(this);
          }
      };
      return AsyncAction;
  }(Action));

  var nextHandle = 1;
  var resolved;
  var activeHandles = {};
  function findAndClearHandle(handle) {
      if (handle in activeHandles) {
          delete activeHandles[handle];
          return true;
      }
      return false;
  }
  var Immediate = {
      setImmediate: function (cb) {
          var handle = nextHandle++;
          activeHandles[handle] = true;
          if (!resolved) {
              resolved = Promise.resolve();
          }
          resolved.then(function () { return findAndClearHandle(handle) && cb(); });
          return handle;
      },
      clearImmediate: function (handle) {
          findAndClearHandle(handle);
      },
  };

  var setImmediate = Immediate.setImmediate, clearImmediate = Immediate.clearImmediate;
  var immediateProvider = {
      setImmediate: function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var delegate = immediateProvider.delegate;
          return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray([], __read(args)));
      },
      clearImmediate: function (handle) {
          return (clearImmediate)(handle);
      },
      delegate: undefined,
  };

  var AsapAction = (function (_super) {
      __extends(AsapAction, _super);
      function AsapAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          if (delay !== null && delay > 0) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          scheduler.actions.push(this);
          return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, undefined)));
      };
      AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
              return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }
          if (!scheduler.actions.some(function (action) { return action.id === id; })) {
              immediateProvider.clearImmediate(id);
              scheduler._scheduled = undefined;
          }
          return undefined;
      };
      return AsapAction;
  }(AsyncAction));

  var Scheduler = (function () {
      function Scheduler(schedulerActionCtor, now) {
          if (now === void 0) { now = Scheduler.now; }
          this.schedulerActionCtor = schedulerActionCtor;
          this.now = now;
      }
      Scheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) { delay = 0; }
          return new this.schedulerActionCtor(this, work).schedule(state, delay);
      };
      Scheduler.now = dateTimestampProvider.now;
      return Scheduler;
  }());

  var AsyncScheduler = (function (_super) {
      __extends(AsyncScheduler, _super);
      function AsyncScheduler(SchedulerAction, now) {
          if (now === void 0) { now = Scheduler.now; }
          var _this = _super.call(this, SchedulerAction, now) || this;
          _this.actions = [];
          _this._active = false;
          _this._scheduled = undefined;
          return _this;
      }
      AsyncScheduler.prototype.flush = function (action) {
          var actions = this.actions;
          if (this._active) {
              actions.push(action);
              return;
          }
          var error;
          this._active = true;
          do {
              if ((error = action.execute(action.state, action.delay))) {
                  break;
              }
          } while ((action = actions.shift()));
          this._active = false;
          if (error) {
              while ((action = actions.shift())) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AsyncScheduler;
  }(Scheduler));

  var AsapScheduler = (function (_super) {
      __extends(AsapScheduler, _super);
      function AsapScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AsapScheduler.prototype.flush = function (action) {
          this._active = true;
          var flushId = this._scheduled;
          this._scheduled = undefined;
          var actions = this.actions;
          var error;
          action = action || actions.shift();
          do {
              if ((error = action.execute(action.state, action.delay))) {
                  break;
              }
          } while ((action = actions[0]) && action.id === flushId && actions.shift());
          this._active = false;
          if (error) {
              while ((action = actions[0]) && action.id === flushId && actions.shift()) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AsapScheduler;
  }(AsyncScheduler));

  new AsapScheduler(AsapAction);

  new AsyncScheduler(AsyncAction);

  var QueueAction = (function (_super) {
      __extends(QueueAction, _super);
      function QueueAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      QueueAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) { delay = 0; }
          if (delay > 0) {
              return _super.prototype.schedule.call(this, state, delay);
          }
          this.delay = delay;
          this.state = state;
          this.scheduler.flush(this);
          return this;
      };
      QueueAction.prototype.execute = function (state, delay) {
          return (delay > 0 || this.closed) ?
              _super.prototype.execute.call(this, state, delay) :
              this._execute(state, delay);
      };
      QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          return scheduler.flush(this);
      };
      return QueueAction;
  }(AsyncAction));

  var QueueScheduler = (function (_super) {
      __extends(QueueScheduler, _super);
      function QueueScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return QueueScheduler;
  }(AsyncScheduler));

  new QueueScheduler(QueueAction);

  var AnimationFrameAction = (function (_super) {
      __extends(AnimationFrameAction, _super);
      function AnimationFrameAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          if (delay !== null && delay > 0) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          scheduler.actions.push(this);
          return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(function () { return scheduler.flush(undefined); }));
      };
      AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
              return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }
          if (!scheduler.actions.some(function (action) { return action.id === id; })) {
              animationFrameProvider.cancelAnimationFrame(id);
              scheduler._scheduled = undefined;
          }
          return undefined;
      };
      return AnimationFrameAction;
  }(AsyncAction));

  var AnimationFrameScheduler = (function (_super) {
      __extends(AnimationFrameScheduler, _super);
      function AnimationFrameScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AnimationFrameScheduler.prototype.flush = function (action) {
          this._active = true;
          var flushId = this._scheduled;
          this._scheduled = undefined;
          var actions = this.actions;
          var error;
          action = action || actions.shift();
          do {
              if ((error = action.execute(action.state, action.delay))) {
                  break;
              }
          } while ((action = actions[0]) && action.id === flushId && actions.shift());
          this._active = false;
          if (error) {
              while ((action = actions[0]) && action.id === flushId && actions.shift()) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AnimationFrameScheduler;
  }(AsyncScheduler));

  new AnimationFrameScheduler(AnimationFrameAction);

  ((function (_super) {
      __extends(VirtualTimeScheduler, _super);
      function VirtualTimeScheduler(schedulerActionCtor, maxFrames) {
          if (schedulerActionCtor === void 0) { schedulerActionCtor = VirtualAction; }
          if (maxFrames === void 0) { maxFrames = Infinity; }
          var _this = _super.call(this, schedulerActionCtor, function () { return _this.frame; }) || this;
          _this.maxFrames = maxFrames;
          _this.frame = 0;
          _this.index = -1;
          return _this;
      }
      VirtualTimeScheduler.prototype.flush = function () {
          var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
          var error;
          var action;
          while ((action = actions[0]) && action.delay <= maxFrames) {
              actions.shift();
              this.frame = action.delay;
              if ((error = action.execute(action.state, action.delay))) {
                  break;
              }
          }
          if (error) {
              while ((action = actions.shift())) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      VirtualTimeScheduler.frameTimeFactor = 10;
      return VirtualTimeScheduler;
  })(AsyncScheduler));
  var VirtualAction = (function (_super) {
      __extends(VirtualAction, _super);
      function VirtualAction(scheduler, work, index) {
          if (index === void 0) { index = (scheduler.index += 1); }
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          _this.index = index;
          _this.active = true;
          _this.index = scheduler.index = index;
          return _this;
      }
      VirtualAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) { delay = 0; }
          if (Number.isFinite(delay)) {
              if (!this.id) {
                  return _super.prototype.schedule.call(this, state, delay);
              }
              this.active = false;
              var action = new VirtualAction(this.scheduler, this.work);
              this.add(action);
              return action.schedule(state, delay);
          }
          else {
              return Subscription.EMPTY;
          }
      };
      VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) { delay = 0; }
          this.delay = scheduler.frame + delay;
          var actions = scheduler.actions;
          actions.push(this);
          actions.sort(VirtualAction.sortActions);
          return true;
      };
      VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          return undefined;
      };
      VirtualAction.prototype._execute = function (state, delay) {
          if (this.active === true) {
              return _super.prototype._execute.call(this, state, delay);
          }
      };
      VirtualAction.sortActions = function (a, b) {
          if (a.delay === b.delay) {
              if (a.index === b.index) {
                  return 0;
              }
              else if (a.index > b.index) {
                  return 1;
              }
              else {
                  return -1;
              }
          }
          else if (a.delay > b.delay) {
              return 1;
          }
          else {
              return -1;
          }
      };
      return VirtualAction;
  }(AsyncAction));

  new Observable(function (subscriber) { return subscriber.complete(); });

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

  var NotificationKind;
  (function (NotificationKind) {
      NotificationKind["NEXT"] = "N";
      NotificationKind["ERROR"] = "E";
      NotificationKind["COMPLETE"] = "C";
  })(NotificationKind || (NotificationKind = {}));

  createErrorClass(function (_super) { return function EmptyErrorImpl() {
      _super(this);
      this.name = 'EmptyError';
      this.message = 'no elements in sequence';
  }; });

  createErrorClass(function (_super) {
      return function ArgumentOutOfRangeErrorImpl() {
          _super(this);
          this.name = 'ArgumentOutOfRangeError';
          this.message = 'argument out of range';
      };
  });

  createErrorClass(function (_super) {
      return function NotFoundErrorImpl(message) {
          _super(this);
          this.name = 'NotFoundError';
          this.message = message;
      };
  });

  createErrorClass(function (_super) {
      return function SequenceErrorImpl(message) {
          _super(this);
          this.name = 'SequenceError';
          this.message = message;
      };
  });

  createErrorClass(function (_super) {
      return function TimeoutErrorImpl(info) {
          if (info === void 0) { info = null; }
          _super(this);
          this.message = 'Timeout has occurred';
          this.name = 'TimeoutError';
          this.info = info;
      };
  });

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
          expand && subscriber.next(value);
          active++;
          var innerComplete = false;
          innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function (innerValue) {
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
                          if (innerSubScheduler) {
                              executeSchedule(subscriber, innerSubScheduler, function () { return doInnerSub(bufferedValue); });
                          }
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
          additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
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

  new Observable(noop);

  /**
   * Router constants
   */
  var POP_STATE = 'popstate';
  var REG_ROUTE_PARAMS = /:[^/]+/g;
  var REG_PATHNAME = /^\/(?=[^?]*)/;
  var HISTORY_UNSUPPORTED = 'History unsupported!';
  var INVALID_ROUTE = 'Route string is not a pure route';
  var VIRTUAL_PUSHSTATE = 'vpushstate';
  var CACHED_FIELDS = ['route', 'hashRouting', 'path', 'hash', 'search', 'hashSearch', 'data'];
  var AMP = '&';
  var QRY = '?';
  var EMPTY = '';
  var UNDEF$1 = void 0;
  var TYPEOF_STR$1 = _typeof$1(EMPTY);
  var TYPEOF_BOOL = _typeof$1(true);
  var TYPEOF_UNDEF$1 = _typeof$1(UNDEF$1);
  _typeof$1({});
  _typeof$1(0);
  var TYPEOF_FUNC = _typeof$1(function () {});
  var STATE = 'State';
  var PUSH = "push".concat(STATE);
  var REPLACE = "replace".concat(STATE);

  function getGlobal() {
    return (typeof globalThis === "undefined" ? "undefined" : _typeof$1(globalThis)) !== TYPEOF_UNDEF$1 ? globalThis : global || self;
  }

  /*!
   * Deparam plugin converts query string to a valid JavaScript object
   * Released under MIT license
   * @name Deparam.js
   * @author Sachin Singh <https://github.com/scssyworks/deparam.js>
   * @version 3.0.6
   * @license MIT
   */
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
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

  var isObject = function isObject(x) {
  	return typeof x === 'object' && x !== null;
  };

  var UNDEF = void 0; // Results to undefined
  // Typeof undefined

  var TYPEOF_UNDEF = _typeof(UNDEF); // Typeof string


  var TYPEOF_STR = _typeof(""); // location var


  var loc = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== TYPEOF_UNDEF ? window.location : null; // Shorthand for built-ins

  var isArr$1 = Array.isArray;
  /**
   * Checks if current key is safe
   * @param {string} key Current key
   * @returns {boolean}
   */

  function isSafe(key) {
    return ["__proto__", "prototype"].indexOf(key) === -1;
  }
  /**
   * Shorthand for Object.prototype.hasOwnProperty
   * @param {any} obj Any object
   * @param {string} key key
   * @returns {boolean} true or false if object has the property
   */


  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  /**
   * Returns true of input query string is complex
   * @param {string} q Query string
   * @returns {boolean} true or false
   */


  function ifComplex(q) {
    return /\[/.test(q);
  }
  /**
   * Returns an object without a prototype
   * @returns {{[key in string|number]: any}} Object without __proto__
   */


  function obNull() {
    return Object.create(null);
  }
  /**
   * Returns a parsed query object
   * @param {string} qs Query string
   * @param {boolean} coerce Coerce values
   * @returns {{[key in string|number]: any}} Query object
   */


  function lib(qs, coerce) {
    var _this = this;

    if (_typeof(qs) !== TYPEOF_STR) {
      qs = loc ? loc.search : "";
    }

    qs = qs.substring(qs.charAt(0) === "?");
    var queryObject = obNull();

    if (qs) {
      qs.split("&").forEach(function (qq) {
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
  /**
   * Converts an array to equivalent object
   * @param {any[]} arr Any array
   * @returns {any} Any object
   */


  function toObject(arr) {
    var convertedObj = obNull();

    if (isArr$1(arr)) {
      arr.forEach(function (value, index) {
        convertedObj[index] = value;
      });
    }

    return convertedObj;
  }
  /**
   * Converts array to an object if required
   * @param {any} ob Any object
   * @param {booleab} isNextNumber Test for next key
   * @returns {any} Any object
   */


  function resolve(ob, isNextNumber) {
    if (_typeof(ob) === TYPEOF_UNDEF) return isNextNumber ? [] : obNull();
    return isNextNumber ? ob : toObject(ob);
  }
  /**
   * Resolves the target object for next iteration
   * @param {any} ob current reference object
   * @param {string} nextProp reference property in current object
   * @returns {any} Resolved object for next iteration
   */


  function resolveObj(ob, nextProp) {
    if (isObject(ob) && !isArr$1(ob)) return {
      ob: ob
    };
    if (isArr$1(ob) || _typeof(ob) === TYPEOF_UNDEF) return {
      ob: resolve(ob, isNumber(nextProp))
    };
    return {
      ob: [ob],
      push: ob !== null
    };
  }
  /**
   * Handles complex query parameters
   * @param {string} key Query key
   * @param {string} value Query value
   * @param {Object} obj Query object
   * @returns {void}
   */


  function complex(key, value, obj, doCoerce) {
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
        if (isSafe(prop) && isSafe(nextProp)) {
          var _resolveObj = resolveObj(obj[prop], nextProp),
              ob = _resolveObj.ob,
              push = _resolveObj.push;

          obj[prop] = ob;
          var nextOb = push ? obNull() : obj[prop];
          nextOb[nextProp] = coerce(value, !doCoerce);

          if (push) {
            obj[prop].push(nextOb);
          }
        }
      } else {
        simple([match[1], value], obj, true, doCoerce);
      }
    }
  }
  /**
   * Handles simple query
   * @param {array} qArr Query list
   * @param {Object} queryObject Query object
   * @param {boolean} toArray Test for conversion to array
   * @returns {void}
   */


  function simple(qArr, queryObject, toArray, doCoerce) {
    var key = qArr[0];
    var value = qArr[1];

    if (isSafe(key)) {
      value = coerce(value, !doCoerce);

      if (hasOwn(queryObject, key)) {
        queryObject[key] = isArr$1(queryObject[key]) ? queryObject[key] : [queryObject[key]];
        queryObject[key].push(value);
      } else {
        queryObject[key] = toArray ? [value] : value;
      }
    }
  }
  /**
   * Converts input value to their appropriate types
   * @param {any} value Input value
   * @param {boolean} skip Test for skipping coercion
   * @returns {any} Coerced value
   */


  function coerce(value, skip) {
    // eslint-disable-next-line
    if (value == null) {
      return "";
    }

    if (skip || _typeof(value) !== TYPEOF_STR) {
      return value;
    }

    value = value.trim();

    if (isNumber(value)) {
      return +value;
    }

    switch (value) {
      case "null":
        return null;

      case TYPEOF_UNDEF:
        return UNDEF;

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
    return _typeof$1(str) === TYPEOF_STR$1 ? str.trim() : EMPTY;
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

        if (_typeof$1(cont) === TYPEOF_BOOL) {
          if (!cont) {
            break;
          }
        }
      }
    }
  }

  /**
   * Function to trigger custom event
   * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
   * @param {string} eventType Event type
   * @param {any[]} data Data to be passed to handler
   */

  function trigger(target, eventType, data) {
    target = Array.from(target instanceof Node ? [target] : target);

    if (target.length && _typeof$1(eventType) === TYPEOF_STR$1) {
      each(target, function (el) {
        var win = getGlobal();
        var customEvent = new win.CustomEvent(eventType, {
          bubbles: true,
          cancelable: true,
          detail: data || []
        });
        el.dispatchEvent(customEvent);
      });
    }
  }

  var RouterEvent = /*#__PURE__*/_createClass(function RouterEvent(routeInfo, currentEvent) {
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
  });

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

  var getPath = function getPath(isHash, location) {
    return trim(isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname);
  };

  function bindRouterEvents(inst) {
    var _inst$config = inst.config,
        context = _inst$config.context,
        location = _inst$config.location,
        hash = _inst$config.hashRouting;
    inst.popStateSubscription = fromEvent(getGlobal(), POP_STATE).subscribe(function (e) {
      var path = getPath(hash, location);

      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{
          path: path,
          hash: hash
        }, e, inst]);
      }
    });
    inst.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(collate.apply(inst));

    if (hash && !location.hash) {
      inst.set('/', true, false); // Replace current hash path without executing anythings
    }
  }

  var encode = encodeURIComponent;
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
    } else if (_typeof$1(obj) !== TYPEOF_FUNC) {
      qsList.push("".concat(encode(key), "=").concat(encode(obj)));
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

    return _typeof$1(obj) === TYPEOF_STR$1 ? obj : EMPTY;
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
    var existingQuery = trim(hashRouting ? location.hash.split(QRY)[1] : search);

    if (!existingQuery) {
      return queryString;
    }

    return toQueryString(assign(lib(search), lib(existingQuery), lib(queryString)));
  }

  function set(route, replace, doExec) {
    var exec = true;

    if (_typeof$1(doExec) === TYPEOF_BOOL) {
      exec = doExec;
    }

    var _this$config = this.config,
        preservePath = _this$config.preservePath,
        hashRouting = _this$config.hashRouting,
        history = _this$config.history;
    var routeObject = assign({
      replace: replace,
      exec: exec
    }, _typeof$1(route) === TYPEOF_STR$1 ? {
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
        }, UNDEF$1, this]);
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
    var path = getPath(hash, location);
    return function (observable) {
      return new Observable(function (subscriber) {
        var subn = observable.subscribe(subscriber);

        if (!isDone) {
          isDone = true;

          if (init && path) {
            subscriber.next(new RouterEvent([{
              path: path,
              hash: hash
            }, UNDEF$1, _this]));
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
      bindRouterEvents(this);
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
        var _this$pipe;

        return (_this$pipe = this.pipe()).subscribe.apply(_this$pipe, arguments);
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
        if (_typeof$1(callback) === TYPEOF_FUNC) {
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
    if (_typeof$1(routerInstance) === TYPEOF_BOOL) {
      ignoreCase = routerInstance;
      routerInstance = UNDEF$1;
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

    if (_typeof$1(keys) === TYPEOF_BOOL) {
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

  const name="silkrouter";const version="4.2.15";const description="Silk router is an app routing library";const main="dist/umd/silkrouter.min.js";const module="dist/esm/silkrouter.esm.min.js";const types="src/typings/silkrouter.d.ts";const scripts={start:"env-cmd -f ./.env.start rollup -c --watch",dev:"env-cmd -f ./.env.dev rollup -c","dev:serve":"env-cmd -f ./.env.start.prod rollup -c",prod:"env-cmd rollup -c",build:"npm run test && npm run dev && npm run dev:serve && npm run prod",test:"jest tests/*",deploy:"gh-pages -d dist",format:"rome format ./src --write",lint:"rome check ./src","check:sanity":"npm run lint && npm run format"};const author="scssyworks";const license="MIT";const keywords=["router","routing","single page apps","single page application","SPA","silk","silk router","history","browser","url","hash","hash routing","pushState","popstate","hashchange","observables","observer","subscriber","subscribe","subscription","rxjs","reactivex"];const files=["dist/umd/","dist/esm/","src/typings/","LICENSE"];const repository={type:"git",url:"git+https://github.com/scssyworks/silkrouter.git"};const bugs={url:"https://github.com/scssyworks/silkrouter/issues"};const homepage="https://scssyworks.github.io/silkrouter";const dependencies={"deparam.js":"^3.0.6"};const devDependencies={"@babel/core":"^7.18.9","@babel/eslint-parser":"^7.18.9","@babel/preset-env":"^7.18.9","@rollup/plugin-babel":"^5.3.1","@rollup/plugin-commonjs":"^22.0.1","@rollup/plugin-eslint":"^8.0.2","@rollup/plugin-json":"^4.1.0","@rollup/plugin-node-resolve":"^13.3.0","@types/jest":"^28.1.6","env-cmd":"^10.1.0",eslint:"^8.20.0","gh-pages":"^4.0.0",jest:"^28.1.3",rollup:"^2.77.0","rollup-plugin-livereload":"^2.0.5","rollup-plugin-serve":"^2.0.0","rollup-plugin-terser":"^7.0.2",rome:"^10.0.1",rxjs:"^7.5.6"};const peerDependencies={rxjs:"^7.5.6"};var pkg = {name:name,version:version,description:description,main:main,module:module,types:types,scripts:scripts,author:author,license:license,keywords:keywords,files:files,repository:repository,bugs:bugs,homepage:homepage,dependencies:dependencies,devDependencies:devDependencies,peerDependencies:peerDependencies};

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

})();
//# sourceMappingURL=silkrouter.iife.js.map
