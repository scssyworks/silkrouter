/**
 * jQuery deparam plugin
 * Converts a querystring to a JavaScript object
 *
 * @project      Jquery deparam plugin
 * @date         2017-09-12
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery
 * @version      0.1.0
 */

(function (w, $) {
    if (!$) return;
    if (!$.deparam) {
        /**
         * Converts a query string into JavaScript object
         * @param {string} qs
         */
        $.deparam = function (qs) {
            if (typeof qs !== "string") return;
            qs = decodeURIComponent(qs).trim();
            if (qs.charAt(0) === '?') {
                qs = qs.replace("?", "");
            }
            if (qs === "") return {};
            var queryParamList = qs.split("&"),
                queryObject = {};
            queryParamList.forEach(function (qq) {
                var qArr = qq.split("=");
                if (_isComplex(qArr[0])) {
                    _handleComplexQuery(qArr[0], qArr[1], queryObject);
                } else {
                    _handleSimpleQuery(qArr, queryObject);
                }
            });
            return queryObject;
        };
    }
    /**
     * Checks if input is a number
     * @param {*} key 
     */
    function isNumber(key) {
        if (typeof key === "number") return true;
        if (typeof key === "string") {
            return !isNaN(+key);
        }
        return false;
    }
    /**
     * Checks if query parameter key is a complex notation
     * @param {string} q 
     */
    function _isComplex(q) {
        return (/\[/.test(q));
    }
    /**
     * Handles complex query parameters
     * @param {string} key 
     * @param {string} value 
     * @param {Object} obj 
     */
    function _handleComplexQuery(key, value, obj) {
        var match = key.match(/([^\[]+)\[([^\[]*)\]/),
            prop = match[1],
            nextProp = match[2];
        if (match && match.length === 3) {
            key = key.replace(/\[([^\[]*)\]/, "");
            var childObj = null;
            if (_isComplex(key)) {
                if (nextProp === "") {
                    nextProp = "0";
                }
                key = key.replace(/[^\[]+/, nextProp);
                // handle null value
                if (obj[prop] === null) obj[prop] = [null];
                // Check if array
                if (Array.isArray(obj[prop])) {
                    if (isNumber(nextProp)) {
                        childObj = obj[prop];
                    } else {
                        childObj = obj[prop] = _convertToObject(obj[prop]);
                    }
                } else if (typeof obj[prop] === "object") { // Check if object
                    childObj = obj[prop];
                } else if (typeof obj[prop] === "undefined") { // Check if undefined
                    if (isNumber(nextProp)) {
                        childObj = obj[prop] = [];
                    } else {
                        childObj = obj[prop] = {};
                    }
                } else {
                    childObj = obj[prop] = [obj[prop]];
                }
                _handleComplexQuery(key, value, childObj);
            } else {
                if (nextProp) {
                    // Check for null
                    if (obj[prop] === null) obj[prop] = [null];
                    // Check if array
                    if (Array.isArray(obj[prop])) {
                        if (isNumber(nextProp)) {
                            obj[prop][nextProp] = _val(value);
                        } else {
                            obj[prop] = _convertToObject(obj[prop]);
                            obj[prop][nextProp] = _val(value);
                        }
                    } else if (typeof obj[prop] === "object") { // Check if object
                        obj[prop][nextProp] = _val(value);
                    } else if (typeof obj[prop] === "undefined") { // Check if undefined
                        if (isNumber(nextProp)) {
                            obj[prop] = [];
                        } else {
                            obj[prop] = {};
                        }
                        obj[prop][nextProp] = _val(value);
                    } else { // Check if any other value
                        obj[prop] = [obj[prop]];
                        if (isNumber(nextProp)) {
                            obj[prop][nextProp] = _val(value);
                        } else {
                            childObj = {};
                            childObj[nextProp] = _val(value);
                            obj[prop].push(childObj);
                        }
                    }
                } else {
                    _handleSimpleQuery([match[1], value], obj, true);
                }
            }
        }
    }
    /**
     * 
     * @param {array} qArr 
     * @param {Object} queryObject 
     * @param {boolean} convertToArray 
     */
    function _handleSimpleQuery(qArr, queryObject, convertToArray) {
        var key = qArr[0],
            value = _val(qArr[1]);
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
        if (typeof value !== "string") return "";
        value = value.trim();
        if (!value) return "";
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
            arr.forEach(function (value, index) {
                convertedObj[index] = value;
            });
            return convertedObj;
        }
        return {};
    }
})(window, window.jQuery);
/**
 * jQuery router plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
 *
 * @project      Jquery Routing Plugin
 * @date         2017-08-08
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery
 * @version      1.0.1
 */

(function (w, $, history) {
    if (!$ || !$.fn) return;
    // Object containing a map of attached handlers
    var router = {
        handlers: []
    },
        // Variable to check if browser supports history API properly    
        isHistorySupported = history && history.pushState,
        // Data cache
        cache = {
            noTrigger: false
        },
        // Regular expressions
        regex = {
            pathname: /^\/(?=[^?]*)/,
            routeparams: /:[^\/]+/g
        },
        // Supported events
        eventNames = {
            routeChanged: "routeChanged",
            hashchange: "hashchange",
            popstate: "popstate"
        },
        // Error messages
        errorMessage = {
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
     * Triggers "routeChanged" event unless "noTrigger" flag is true
     */
    function _triggerRoute(route, eventType, isHashRoute) {
        isHashRoute = !!isHashRoute;
        if (cache.noTrigger && eventType === eventNames.hashchange) {
            cache.noTrigger = false;
            return;
        }
        cache.data = cache.data || {
            data: {}
        };
        cache.data.data = $.extend({}, cache.data.data, {
            eventType: eventType,
            hash: isHashRoute,
            route: route
        });
        $.router.events.trigger(eventNames.routeChanged, cache.data);
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
        if (typeof sRoute !== "string") return false;
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
                return sRoute + w.location.search + "&" + qString.replace("?", "");
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
        var qsObject = $.deparam(w.location.search),
            hashStringParams = {};
        if (w.location.hash.match(/\?.+/)) {
            hashStringParams = $.deparam(w.location.hash.match(/\?.+/)[0]);
        }
        return $.extend(qsObject, hashStringParams);
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
        } else {
            _throwError(errorMessage.invalidPath);
        }
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
        if (typeof oRoute === "object") {
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
        }
        // Support for hash routes
        if (sRoute.charAt(0) === "#") {
            isHashString = true;
            sRoute = sRoute.replace("#", "");
        }
        if (isHistorySupported && !isHashString) {
            history[routeMethod](cache.data, title, _validateRoute(sRoute, qString, appendQString));
            if (!noTrigger) {
                cache.data.data = $.extend({}, cache.data.data, {
                    eventType: eventNames.popstate,
                    hash: false,
                    route: sRoute
                });
                $.router.events.trigger(eventNames.routeChanged, cache.data);
            }
        } else {
            if (replaceMode) {
                w.location.replace("#" + _validateRoute(sRoute, qString, appendQString));
            } else {
                w.location.hash = _validateRoute(sRoute, qString, appendQString);
            }
        }
    }

    /**
     * Attaches a route handler function
     * @param {string} sRoute 
     * @param {function} callback 
     */
    function _route(sRoute, callback) {
        router.handlers.push({
            eventName: eventNames.routeChanged,
            handler: callback.bind(this),
            element: this,
            route: sRoute
        });
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
            return ((route === url) || (route === "*"));
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
        params = $.extend(params, {});
        params.data = $.extend({}, params.data);
        var isHashRoute = params.data.hash;
        router.handlers.forEach(function (eventObject) {
            if (eventObject.eventName === eventName) {
                if (isHistorySupported && !isHashRoute && _matched(eventObject.route, w.location.pathname, params)) {
                    eventObject.handler(params.data, params.params, _getQueryParams());
                } else {
                    if (isHashRoute) {
                        if (!w.location.hash && !isHistorySupported && _matched(eventObject.route, w.location.pathname, params)) {
                            cache.data = params.data;
                            w.location.replace("#" + w.location.pathname); // <-- This will trigger router handler automatically
                        } else if (_matched(eventObject.route, w.location.hash.substring(1), params)) {
                            eventObject.handler(params.data, params.params, _getQueryParams());
                        }
                    }
                }
            }
        });
    }

    /**
     * Initializes router events
     */
    function _bindRouterEvents() {
        $(w).on(eventNames.popstate, function (e) {
            _triggerRoute.apply(this, [w.location.pathname, e.type]);
        });
        $(w).on(eventNames.hashchange, function (e) {
            _triggerRoute.apply(this, [w.location.hash, e.type, true]);
        });
    }

    if (!$.router) {
        $.router = {
            events: eventNames,
            init: function () {
                var settings = {
                    eventType: (isHistorySupported ? eventNames.popstate : eventNames.hashchange),
                    hash: !isHistorySupported,
                    route: (isHistorySupported ? w.location.pathname : w.location.hash)
                };
                $.router.events.trigger(eventNames.routeChanged, {
                    data: settings
                });
                if (w.location.hash) {
                    $(w).trigger(eventNames.hashchange);
                }
            },
            historySupported: isHistorySupported
        };
        $.router.events.trigger = function (eventName, params) {
            _routeTrigger.apply(this, [eventName, params]);
        };
        if (!$.fn.route) {
            var route = $.fn.route = function () {
                _route.apply(this, arguments);
            };
            if (!$.route) {
                $.route = route.bind(null);
            }
        }
        $.router.set = function () {
            _setRoute.apply(this, arguments);
        };
    }
    router.init = _bindRouterEvents;
    router.init();
}(
    window,
    window.jQuery,
    window.history
));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoianF1ZXJ5LnJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogalF1ZXJ5IGRlcGFyYW0gcGx1Z2luXG4gKiBDb252ZXJ0cyBhIHF1ZXJ5c3RyaW5nIHRvIGEgSmF2YVNjcmlwdCBvYmplY3RcbiAqXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBkZXBhcmFtIHBsdWdpblxuICogQGRhdGUgICAgICAgICAyMDE3LTA5LTEyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxuICogQHZlcnNpb24gICAgICAwLjEuMFxuICovXG5cbihmdW5jdGlvbiAodywgJCkge1xuICAgIGlmICghJCkgcmV0dXJuO1xuICAgIGlmICghJC5kZXBhcmFtKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb252ZXJ0cyBhIHF1ZXJ5IHN0cmluZyBpbnRvIEphdmFTY3JpcHQgb2JqZWN0XG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxc1xuICAgICAgICAgKi9cbiAgICAgICAgJC5kZXBhcmFtID0gZnVuY3Rpb24gKHFzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHFzICE9PSBcInN0cmluZ1wiKSByZXR1cm47XG4gICAgICAgICAgICBxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxcykudHJpbSgpO1xuICAgICAgICAgICAgaWYgKHFzLmNoYXJBdCgwKSA9PT0gJz8nKSB7XG4gICAgICAgICAgICAgICAgcXMgPSBxcy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChxcyA9PT0gXCJcIikgcmV0dXJuIHt9O1xuICAgICAgICAgICAgdmFyIHF1ZXJ5UGFyYW1MaXN0ID0gcXMuc3BsaXQoXCImXCIpLFxuICAgICAgICAgICAgICAgIHF1ZXJ5T2JqZWN0ID0ge307XG4gICAgICAgICAgICBxdWVyeVBhcmFtTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChxcSkge1xuICAgICAgICAgICAgICAgIHZhciBxQXJyID0gcXEuc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KHFBcnJbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVDb21wbGV4UXVlcnkocUFyclswXSwgcUFyclsxXSwgcXVlcnlPYmplY3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlPYmplY3Q7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBpbnB1dCBpcyBhIG51bWJlclxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKCtrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHF1ZXJ5IHBhcmFtZXRlciBrZXkgaXMgYSBjb21wbGV4IG5vdGF0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHEgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzQ29tcGxleChxKSB7XG4gICAgICAgIHJldHVybiAoL1xcWy8udGVzdChxKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgY29tcGxleCBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIG9iaikge1xuICAgICAgICB2YXIgbWF0Y2ggPSBrZXkubWF0Y2goLyhbXlxcW10rKVxcWyhbXlxcW10qKVxcXS8pLFxuICAgICAgICAgICAgcHJvcCA9IG1hdGNoWzFdLFxuICAgICAgICAgICAgbmV4dFByb3AgPSBtYXRjaFsyXTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcWyhbXlxcW10qKVxcXS8sIFwiXCIpO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2JqID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3AgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFByb3AgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teXFxbXSsvLCBuZXh0UHJvcCk7XG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIG51bGwgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSBvYmpbcHJvcF0gPSBbbnVsbF07XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBfY29udmVydFRvT2JqZWN0KG9ialtwcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0ge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIGNoaWxkT2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBudWxsXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIG9ialtwcm9wXSA9IFtudWxsXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gX2NvbnZlcnRUb09iamVjdChvYmpbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcIm9iamVjdFwiKSB7IC8vIENoZWNrIGlmIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayBpZiBhbnkgb3RoZXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9ialtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0ucHVzaChjaGlsZE9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkoW21hdGNoWzFdLCB2YWx1ZV0sIG9iaiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHFBcnIgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5T2JqZWN0IFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udmVydFRvQXJyYXkgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2hhbmRsZVNpbXBsZVF1ZXJ5KHFBcnIsIHF1ZXJ5T2JqZWN0LCBjb252ZXJ0VG9BcnJheSkge1xuICAgICAgICB2YXIga2V5ID0gcUFyclswXSxcbiAgICAgICAgICAgIHZhbHVlID0gX3ZhbChxQXJyWzFdKTtcbiAgICAgICAgaWYgKGtleSBpbiBxdWVyeU9iamVjdCkge1xuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IEFycmF5LmlzQXJyYXkocXVlcnlPYmplY3Rba2V5XSkgPyBxdWVyeU9iamVjdFtrZXldIDogW3F1ZXJ5T2JqZWN0W2tleV1dO1xuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBjb252ZXJ0VG9BcnJheSA/IFt2YWx1ZV0gOiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmVzIHZhbHVlcyB0byB0aGVpciBvcmlnaW5hbCB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF92YWwodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIFwiXCI7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gXCJcIjtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJudWxsXCIpIHJldHVybiBudWxsO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwiTmFOXCIpIHJldHVybiBOYU47XG4gICAgICAgIGlmICghaXNOYU4oK3ZhbHVlKSkgcmV0dXJuICt2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYW4gYXJyYXkgdG8gYW4gb2JqZWN0XG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9jb252ZXJ0VG9PYmplY3QoYXJyKSB7XG4gICAgICAgIHZhciBjb252ZXJ0ZWRPYmogPSB7fTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRlZE9ialtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRlZE9iajtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxufSkod2luZG93LCB3aW5kb3cualF1ZXJ5KTsiLCIvKipcbiAqIGpRdWVyeSByb3V0ZXIgcGx1Z2luXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgU1BBIHJvdXRlciBtZXRob2RzIHRvIGhhbmRsZSByb3V0aW5nIG1lY2hhbmlzbSBpbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbnMgKFNQQSkuIFN1cHBvcnRlZCB2ZXJzaW9ucyBJRTkrLCBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveFxuICpcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IFJvdXRpbmcgUGx1Z2luXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDgtMDhcbiAqIEBhdXRob3IgICAgICAgU2FjaGluIFNpbmdoIDxzc2luZ2guMzAwODg5QGdtYWlsLmNvbT5cbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XG4gKiBAdmVyc2lvbiAgICAgIDEuMC4xXG4gKi9cblxuKGZ1bmN0aW9uICh3LCAkLCBoaXN0b3J5KSB7XG4gICAgaWYgKCEkIHx8ICEkLmZuKSByZXR1cm47XG4gICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgYSBtYXAgb2YgYXR0YWNoZWQgaGFuZGxlcnNcbiAgICB2YXIgcm91dGVyID0ge1xuICAgICAgICBoYW5kbGVyczogW11cbiAgICB9LFxuICAgICAgICAvLyBWYXJpYWJsZSB0byBjaGVjayBpZiBicm93c2VyIHN1cHBvcnRzIGhpc3RvcnkgQVBJIHByb3Blcmx5ICAgIFxuICAgICAgICBpc0hpc3RvcnlTdXBwb3J0ZWQgPSBoaXN0b3J5ICYmIGhpc3RvcnkucHVzaFN0YXRlLFxuICAgICAgICAvLyBEYXRhIGNhY2hlXG4gICAgICAgIGNhY2hlID0ge1xuICAgICAgICAgICAgbm9UcmlnZ2VyOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb25zXG4gICAgICAgIHJlZ2V4ID0ge1xuICAgICAgICAgICAgcGF0aG5hbWU6IC9eXFwvKD89W14/XSopLyxcbiAgICAgICAgICAgIHJvdXRlcGFyYW1zOiAvOlteXFwvXSsvZ1xuICAgICAgICB9LFxuICAgICAgICAvLyBTdXBwb3J0ZWQgZXZlbnRzXG4gICAgICAgIGV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICByb3V0ZUNoYW5nZWQ6IFwicm91dGVDaGFuZ2VkXCIsXG4gICAgICAgICAgICBoYXNoY2hhbmdlOiBcImhhc2hjaGFuZ2VcIixcbiAgICAgICAgICAgIHBvcHN0YXRlOiBcInBvcHN0YXRlXCJcbiAgICAgICAgfSxcbiAgICAgICAgLy8gRXJyb3IgbWVzc2FnZXNcbiAgICAgICAgZXJyb3JNZXNzYWdlID0ge1xuICAgICAgICAgICAgaW52YWxpZFBhdGg6IFwiUGF0aCBpcyBpbnZhbGlkXCJcbiAgICAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFueSBsaXN0IHRvIEphdmFTY3JpcHQgYXJyYXlcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcnIgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2FycihhcnIpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlcnMgXCJyb3V0ZUNoYW5nZWRcIiBldmVudCB1bmxlc3MgXCJub1RyaWdnZXJcIiBmbGFnIGlzIHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfdHJpZ2dlclJvdXRlKHJvdXRlLCBldmVudFR5cGUsIGlzSGFzaFJvdXRlKSB7XG4gICAgICAgIGlzSGFzaFJvdXRlID0gISFpc0hhc2hSb3V0ZTtcbiAgICAgICAgaWYgKGNhY2hlLm5vVHJpZ2dlciAmJiBldmVudFR5cGUgPT09IGV2ZW50TmFtZXMuaGFzaGNoYW5nZSkge1xuICAgICAgICAgICAgY2FjaGUubm9UcmlnZ2VyID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FjaGUuZGF0YSA9IGNhY2hlLmRhdGEgfHwge1xuICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgfTtcbiAgICAgICAgY2FjaGUuZGF0YS5kYXRhID0gJC5leHRlbmQoe30sIGNhY2hlLmRhdGEuZGF0YSwge1xuICAgICAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgICAgICBoYXNoOiBpc0hhc2hSb3V0ZSxcbiAgICAgICAgICAgIHJvdXRlOiByb3V0ZVxuICAgICAgICB9KTtcbiAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsIGNhY2hlLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IEphdmFTY3JpcHQgZXJyb3JzIHdpdGggY3VzdG9tIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfdGhyb3dFcnJvcihtZXNzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgZ2l2ZW4gcm91dGUgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pc1ZhbGlkUm91dGUoc1JvdXRlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc1JvdXRlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiByZWdleC5wYXRobmFtZS50ZXN0KHNSb3V0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHF1ZXJ5IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmcgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhcHBlbmRRU3RyaW5nIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XG4gICAgICAgIGlmICghcVN0cmluZyAmJiAhYXBwZW5kUVN0cmluZykgcmV0dXJuIHNSb3V0ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBxU3RyaW5nID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoKHFTdHJpbmcgPSBxU3RyaW5nLnRyaW0oKSkgJiYgYXBwZW5kUVN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGUgKyB3LmxvY2F0aW9uLnNlYXJjaCArIFwiJlwiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocVN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGUgKyBcIj9cIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBjdXJyZW50IHF1ZXJ5IHN0cmluZyBpbnRvIGFuIG9iamVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVBhcmFtcygpIHtcbiAgICAgICAgdmFyIHFzT2JqZWN0ID0gJC5kZXBhcmFtKHcubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgICAgICAgIGhhc2hTdHJpbmdQYXJhbXMgPSB7fTtcbiAgICAgICAgaWYgKHcubG9jYXRpb24uaGFzaC5tYXRjaCgvXFw/LisvKSkge1xuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9ICQuZGVwYXJhbSh3LmxvY2F0aW9uLmhhc2gubWF0Y2goL1xcPy4rLylbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkLmV4dGVuZChxc09iamVjdCwgaGFzaFN0cmluZ1BhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHJvdXRlIGlzIHZhbGlkIGFuZCByZXR1cm5zIHRoZSB2YWxpZCByb3V0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZ1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykge1xuICAgICAgICBpZiAoX2lzVmFsaWRSb3V0ZShzUm91dGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Rocm93RXJyb3IoZXJyb3JNZXNzYWdlLmludmFsaWRQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCByb3V0ZSBmb3IgZ2l2ZW4gdmlld1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlIFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVwbGFjZU1vZGUgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaWdnZXIgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3NldFJvdXRlKG9Sb3V0ZSwgcmVwbGFjZU1vZGUsIG5vVHJpZ2dlcikge1xuICAgICAgICBpZiAoIW9Sb3V0ZSkgcmV0dXJuO1xuICAgICAgICB2YXIgdGl0bGUgPSBudWxsLFxuICAgICAgICAgICAgc1JvdXRlID0gXCJcIixcbiAgICAgICAgICAgIHFTdHJpbmcgPSBcIlwiLFxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IGZhbHNlLFxuICAgICAgICAgICAgaXNIYXNoU3RyaW5nID0gZmFsc2UsXG4gICAgICAgICAgICByb3V0ZU1ldGhvZCA9IHJlcGxhY2VNb2RlID8gXCJyZXBsYWNlU3RhdGVcIiA6IFwicHVzaFN0YXRlXCI7XG4gICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IG5vVHJpZ2dlcjtcbiAgICAgICAgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGNhY2hlLmRhdGEgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogb1JvdXRlLmRhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aXRsZSA9IG9Sb3V0ZS50aXRsZTtcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZS5yb3V0ZTtcbiAgICAgICAgICAgIHFTdHJpbmcgPSBvUm91dGUucXVlcnlTdHJpbmc7XG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gb1JvdXRlLmFwcGVuZFF1ZXJ5O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNhY2hlLmRhdGEgPSB7XG4gICAgICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzUm91dGUgPSBvUm91dGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3VwcG9ydCBmb3IgaGFzaCByb3V0ZXNcbiAgICAgICAgaWYgKHNSb3V0ZS5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICBpc0hhc2hTdHJpbmcgPSB0cnVlO1xuICAgICAgICAgICAgc1JvdXRlID0gc1JvdXRlLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgIWlzSGFzaFN0cmluZykge1xuICAgICAgICAgICAgaGlzdG9yeVtyb3V0ZU1ldGhvZF0oY2FjaGUuZGF0YSwgdGl0bGUsIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xuICAgICAgICAgICAgaWYgKCFub1RyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICBjYWNoZS5kYXRhLmRhdGEgPSAkLmV4dGVuZCh7fSwgY2FjaGUuZGF0YS5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogZXZlbnROYW1lcy5wb3BzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzaDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlOiBzUm91dGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgY2FjaGUuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVwbGFjZU1vZGUpIHtcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5oYXNoID0gX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIGEgcm91dGUgaGFuZGxlciBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JvdXRlKHNSb3V0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLnB1c2goe1xuICAgICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCxcbiAgICAgICAgICAgIGhhbmRsZXI6IGNhbGxiYWNrLmJpbmQodGhpcyksXG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLFxuICAgICAgICAgICAgcm91dGU6IHNSb3V0ZVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFRyaW1zIGxlYWRpbmcvdHJhaWxpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9zYW5pdGl6ZShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eKFteYS16QS1aMC05XSspfChbXmEtekEtWjAtOV0rKSQvZywgXCJcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcGFyZXMgcm91dGUgd2l0aCBjdXJyZW50IFVSTFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX21hdGNoZWQocm91dGUsIHVybCwgcGFyYW1zKSB7XG4gICAgICAgIGlmICh+dXJsLmluZGV4T2YoXCI/XCIpKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVnZXgucm91dGVwYXJhbXMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgaWYgKHJlZ2V4LnJvdXRlcGFyYW1zLnRlc3Qocm91dGUpKSB7XG4gICAgICAgICAgICBwYXJhbXMucGFyYW1zID0ge307XG4gICAgICAgICAgICB2YXIgcGF0aFJlZ2V4ID0gbmV3IFJlZ0V4cChyb3V0ZS5yZXBsYWNlKC9cXC8vZywgXCJcXFxcL1wiKS5yZXBsYWNlKC86W15cXC9cXFxcXSsvZywgXCIoW15cXFxcL10rKVwiKSk7XG4gICAgICAgICAgICBpZiAocGF0aFJlZ2V4LnRlc3QodXJsKSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4LnJvdXRlcGFyYW1zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBfYXJyKHJvdXRlLm1hdGNoKHJlZ2V4LnJvdXRlcGFyYW1zKSkubWFwKF9zYW5pdGl6ZSksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IF9hcnIodXJsLm1hdGNoKHBhdGhSZWdleCkpO1xuICAgICAgICAgICAgICAgIHZhbHVlcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucGFyYW1zW2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICgocm91dGUgPT09IHVybCkgfHwgKHJvdXRlID09PSBcIipcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBhIHJvdXRlciBldmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcm91dGVUcmlnZ2VyKGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCBwYXJhbXMgaXMgYWx3YXlzIGFuIG9iamVjdFxuICAgICAgICBwYXJhbXMgPSAkLmV4dGVuZChwYXJhbXMsIHt9KTtcbiAgICAgICAgcGFyYW1zLmRhdGEgPSAkLmV4dGVuZCh7fSwgcGFyYW1zLmRhdGEpO1xuICAgICAgICB2YXIgaXNIYXNoUm91dGUgPSBwYXJhbXMuZGF0YS5oYXNoO1xuICAgICAgICByb3V0ZXIuaGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChldmVudE9iamVjdC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgIWlzSGFzaFJvdXRlICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMsIF9nZXRRdWVyeVBhcmFtcygpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNIYXNoUm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdy5sb2NhdGlvbi5oYXNoICYmICFpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kYXRhID0gcGFyYW1zLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgdy5sb2NhdGlvbi5wYXRobmFtZSk7IC8vIDwtLSBUaGlzIHdpbGwgdHJpZ2dlciByb3V0ZXIgaGFuZGxlciBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpLCBwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRPYmplY3QuaGFuZGxlcihwYXJhbXMuZGF0YSwgcGFyYW1zLnBhcmFtcywgX2dldFF1ZXJ5UGFyYW1zKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyByb3V0ZXIgZXZlbnRzXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2JpbmRSb3V0ZXJFdmVudHMoKSB7XG4gICAgICAgICQodykub24oZXZlbnROYW1lcy5wb3BzdGF0ZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIF90cmlnZ2VyUm91dGUuYXBwbHkodGhpcywgW3cubG9jYXRpb24ucGF0aG5hbWUsIGUudHlwZV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh3KS5vbihldmVudE5hbWVzLmhhc2hjaGFuZ2UsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBfdHJpZ2dlclJvdXRlLmFwcGx5KHRoaXMsIFt3LmxvY2F0aW9uLmhhc2gsIGUudHlwZSwgdHJ1ZV0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoISQucm91dGVyKSB7XG4gICAgICAgICQucm91dGVyID0ge1xuICAgICAgICAgICAgZXZlbnRzOiBldmVudE5hbWVzLFxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlOiAoaXNIaXN0b3J5U3VwcG9ydGVkID8gZXZlbnROYW1lcy5wb3BzdGF0ZSA6IGV2ZW50TmFtZXMuaGFzaGNoYW5nZSksXG4gICAgICAgICAgICAgICAgICAgIGhhc2g6ICFpc0hpc3RvcnlTdXBwb3J0ZWQsXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlOiAoaXNIaXN0b3J5U3VwcG9ydGVkID8gdy5sb2NhdGlvbi5wYXRobmFtZSA6IHcubG9jYXRpb24uaGFzaClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNldHRpbmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHcubG9jYXRpb24uaGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAkKHcpLnRyaWdnZXIoZXZlbnROYW1lcy5oYXNoY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlzdG9yeVN1cHBvcnRlZDogaXNIaXN0b3J5U3VwcG9ydGVkXG4gICAgICAgIH07XG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBfcm91dGVUcmlnZ2VyLmFwcGx5KHRoaXMsIFtldmVudE5hbWUsIHBhcmFtc10pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoISQuZm4ucm91dGUpIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9ICQuZm4ucm91dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3JvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCEkLnJvdXRlKSB7XG4gICAgICAgICAgICAgICAgJC5yb3V0ZSA9IHJvdXRlLmJpbmQobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgJC5yb3V0ZXIuc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJvdXRlci5pbml0ID0gX2JpbmRSb3V0ZXJFdmVudHM7XG4gICAgcm91dGVyLmluaXQoKTtcbn0oXG4gICAgd2luZG93LFxuICAgIHdpbmRvdy5qUXVlcnksXG4gICAgd2luZG93Lmhpc3RvcnlcbikpOyJdfQ==
