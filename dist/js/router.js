/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Deparam plugin
 * Converts a querystring to a JavaScript object
 * @project      Deparam plugin
 * @date         2018-06-24
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @version      1.0.0
 */

/**
 * Converts query string to JavaScript object
 * @param {string} qs query string argument (defaults to url query string)
 */
function deparam(qs = window.location.search) {
    qs = decodeURIComponent(qs).replace("?", "").trim();
    if (qs === "") return {};
    const queryParamList = qs.split("&"),
        queryObject = {};
    queryParamList.forEach((qq) => {
        const qArr = qq.split("=");
        if (_isComplex(...qArr)) {
            _handleComplexQuery(...qArr, queryObject);
        } else {
            _handleSimpleQuery(qArr, queryObject);
        }
    });
    return queryObject;
}

/**
 * Checks if input is a number
 * @param {*} key 
 */
function isNumber(key) {
    if (key == null || typeof key === 'boolean') return false;
    if (!key.toString().trim()) return false;
    return !isNaN(Number(key));
}

/**
 * Checks if query parameter key is a complex notation
 * @param {string} q 
 */
function _isComplex(q) {
    return (/\[/.test(q));
}

/**
 * Resolves the target object for next iteration
 * @param {Object} ob current reference object
 * @param {string} nextProp reference property in current object
 */
function _resolveTargetObject(ob, nextProp) {
    // handle null value
    if (ob === null) return { ob: [null] };
    // Check if object
    if (typeof ob === 'object') return { ob };
    // Check if array
    if (Array.isArray(ob) && !isNumber(nextProp)) return { ob: _convertToObject(ob) };
    // Check if undefined
    if (typeof ob === "undefined") return { ob: (isNumber(nextProp) ? [] : {}) };
    return { ob: [ob], push: true };
}

/**
 * Handles complex query parameters
 * @param {string} key 
 * @param {string} value 
 * @param {Object} obj 
 */
function _handleComplexQuery(key, value, obj) {
    const match = key.match(/([^\[]+)\[([^\[]*)\]/);
    if (match && match.length === 3) {
        let [, prop, nextProp] = match;
        key = key.replace(/\[([^\[]*)\]/, "");
        if (_isComplex(key)) {
            if (nextProp === "") nextProp = "0";
            key = key.replace(/[^\[]+/, nextProp);
            _handleComplexQuery(key, value, obj[prop] = _resolveTargetObject(obj[prop], nextProp).ob);
        } else {
            if (nextProp) {
                const { ob, push } = _resolveTargetObject(obj[prop], nextProp);
                obj[prop] = ob;
                if (push) {
                    obj[prop].push({
                        [nextProp]: _val(value)
                    });
                } else {
                    obj[prop][nextProp] = _val(value);
                }
            } else {
                _handleSimpleQuery([match[1], value], obj, true);
            }
        }
    }
}

/**
 * Handles simple query
 * @param {array} qArr 
 * @param {Object} queryObject 
 * @param {boolean} convertToArray 
 */
function _handleSimpleQuery(qArr, queryObject, convertToArray) {
    let [key, value] = qArr;
    // Convert to appropriate type
    value = _val(value);
    if (key in queryObject) {
        queryObject[key] = Array.isArray(queryObject[key]) ? queryObject[key] : [queryObject[key]];
        queryObject[key].push(value);
    } else {
        queryObject[key] = convertToArray ? [value] : value;
    }
}

/**
 * Restores values to their original type
 * @param {string} value 
 */
function _val(value) {
    if (value == null) return "";
    value = value.toString().trim();
    if (value === "undefined") return;
    if (value === "null") return null;
    if (value === "NaN") return NaN;
    if (!isNaN(+value)) return +value;
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
    return value;
}

/**
 * Converts an array to an object
 * @param {array} arr 
 */
function _convertToObject(arr) {
    var convertedObj = {};
    if (Array.isArray(arr)) {
        arr.forEach((value, index) => {
            convertedObj[index] = value;
        });
        return convertedObj;
    }
    return {};
}

// Check if global jQuery object exists, then plug-in deparam function as a static method
if (window.jQuery) {
    jQuery.deparam = deparam;
}

/* harmony default export */ __webpack_exports__["default"] = (deparam);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.router = exports.route = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Routing plugin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @project      Routing plugin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date         2018-06-24
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author       Sachin Singh <ssingh.300889@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @dependencies jQuery
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @version      2.0.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

// Import dependencies


var _jquerydeparam = __webpack_require__(0);

var _jquerydeparam2 = _interopRequireDefault(_jquerydeparam);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = { handlers: [] },
    isHistorySupported = history && history.pushState,
    cache = { trigger: true },
    regex = {
    pathname: /^\/(?=[^?]*)/,
    routeparams: /:[^\/]+/g
},
    eventNames = {
    routeChanged: "routeChanged",
    hashchange: "hashchange",
    popstate: "popstate"
},
    errorMessage = {
    invalidPath: "Path needs to be a valid string or object",
    invalidQueryString: "Query string is of invalid type"
};

/**
 * Converts any list to JavaScript array
 * @param {array} arr 
 */
function _arr(arr) {
    return Array.prototype.slice.call(arr);
}

/**
 * Checks if handler function is callable
 * @param {Function} fn handler function
 */
function _isCallable(fn) {
    return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * Attaches a route handler
 * @param {string} sRoute route
 * @param {Function} callback callback function
 */
function route(sRoute, callback) {
    if (_isCallable(sRoute)) {
        callback = sRoute;
        sRoute = '*';
    }
    if (typeof sRoute === 'string' && _isCallable(callback)) {
        var _sRoute$split = sRoute.split('?'),
            _sRoute$split2 = _slicedToArray(_sRoute$split, 2),
            path = _sRoute$split2[0],
            query = _sRoute$split2[1];

        router.handlers.push({
            eventName: eventNames.routeChanged,
            handler: callback.bind(this),
            el: this,
            path: path,
            query: query,
            isGeneric: sRoute === '*'
        });
    }
}

/**
 * Sets a route handler
 * @param {string|Object} route route options
 * @param {Boolean} replace activates replace mode (defaults to false)
 * @param {Boolean} trigger disables route handler if false (defaults to true)
 */
function _set() {
    var _arguments = Array.prototype.slice.call(arguments),
        path = _arguments[0],
        _arguments$ = _arguments[1],
        replace = _arguments$ === undefined ? false : _arguments$,
        _arguments$2 = _arguments[2],
        trigger = _arguments$2 === undefined ? true : _arguments$2;

    if (path == null) throw new TypeError(errorMessage.invalidPath);
    // Convert route string to object
    if ((typeof path === "undefined" ? "undefined" : _typeof(path)) !== 'object') {
        path = { route: path.toString() };
    }
    // Destructure route object to get route parts
    var _path = path,
        route = _path.route,
        _path$data = _path.data,
        data = _path$data === undefined ? {} : _path$data,
        _path$queryString = _path.queryString,
        queryString = _path$queryString === undefined ? '' : _path$queryString,
        _path$exact = _path.exact,
        exact = _path$exact === undefined ? false : _path$exact;

    if (typeof queryString !== 'string') throw new TypeError(errorMessage.invalidQueryString);
    // Get query string from path if not specified

    var _route$split = route.split('?');

    var _route$split2 = _slicedToArray(_route$split, 2);

    route = _route$split2[0];
    var _route$split2$ = _route$split2[1];
    queryString = _route$split2$ === undefined ? '' : _route$split2$;
}

var jqrouter = {
    set: function set() {
        return _set.apply(this, arguments);
    },
    init: function init() {
        return this.set(window.location.pathname + window.location.search);
    }
};

exports.route = route;
exports.router = jqrouter;

/***/ })
/******/ ]);
//# sourceMappingURL=router.js.map