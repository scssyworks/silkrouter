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
        var existing = router.handlers.filter(function (routeOb) {
            return (routeOb.route === sRoute && routeOb.handler === callback);
        });
        if (existing.length === 0) {
            router.handlers.push({
                eventName: eventNames.routeChanged,
                handler: callback.bind(this),
                element: this,
                route: sRoute
            });
        }
    }

    /**
     * Removes a route handler function
     * @param {string} sRoute route string
     * @param {function} callback callback function
     */
    function _unroute(sRoute, callback) {
        var args = arguments;
        if (args.length === 0) {
            // Removed all routes
            router.handlers.length = 0;
        }
        router.handlers = router.handlers.filter(function (routeOb) {
            if (args.length === 1) {
                return routeOb.route !== sRoute;
            }
            return !(routeOb.route === sRoute && routeOb.handler === callback);
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
                return _route.apply(this, arguments);
            };
            if (!$.route) {
                $.route = route.bind(null);
            }
        }
        if (!$.fn.unroute) {
            var unroute = $.fn.unroute = function () {
                return _unroute.apply(this, arguments);
            };
            if (!$.unroute) {
                $.unroute = unroute.bind(null);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJqcXVlcnkucm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBqUXVlcnkgZGVwYXJhbSBwbHVnaW5cbiAqIENvbnZlcnRzIGEgcXVlcnlzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdFxuICpcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IGRlcGFyYW0gcGx1Z2luXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDktMTJcbiAqIEBhdXRob3IgICAgICAgU2FjaGluIFNpbmdoIDxzc2luZ2guMzAwODg5QGdtYWlsLmNvbT5cbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XG4gKiBAdmVyc2lvbiAgICAgIDAuMS4wXG4gKi9cblxuKGZ1bmN0aW9uICh3LCAkKSB7XG4gICAgaWYgKCEkKSByZXR1cm47XG4gICAgaWYgKCEkLmRlcGFyYW0pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnZlcnRzIGEgcXVlcnkgc3RyaW5nIGludG8gSmF2YVNjcmlwdCBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHFzXG4gICAgICAgICAqL1xuICAgICAgICAkLmRlcGFyYW0gPSBmdW5jdGlvbiAocXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcXMgIT09IFwic3RyaW5nXCIpIHJldHVybjtcbiAgICAgICAgICAgIHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHFzKS50cmltKCk7XG4gICAgICAgICAgICBpZiAocXMuY2hhckF0KDApID09PSAnPycpIHtcbiAgICAgICAgICAgICAgICBxcyA9IHFzLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHFzID09PSBcIlwiKSByZXR1cm4ge307XG4gICAgICAgICAgICB2YXIgcXVlcnlQYXJhbUxpc3QgPSBxcy5zcGxpdChcIiZcIiksXG4gICAgICAgICAgICAgICAgcXVlcnlPYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1MaXN0LmZvckVhY2goZnVuY3Rpb24gKHFxKSB7XG4gICAgICAgICAgICAgICAgdmFyIHFBcnIgPSBxcS5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKF9pc0NvbXBsZXgocUFyclswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShxQXJyWzBdLCBxQXJyWzFdLCBxdWVyeU9iamVjdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZVNpbXBsZVF1ZXJ5KHFBcnIsIHF1ZXJ5T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeU9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGlucHV0IGlzIGEgbnVtYmVyXG4gICAgICogQHBhcmFtIHsqfSBrZXkgXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoa2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcIm51bWJlclwiKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiAhaXNOYU4oK2tleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgcXVlcnkgcGFyYW1ldGVyIGtleSBpcyBhIGNvbXBsZXggbm90YXRpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNDb21wbGV4KHEpIHtcbiAgICAgICAgcmV0dXJuICgvXFxbLy50ZXN0KHEpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBjb21wbGV4IHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVDb21wbGV4UXVlcnkoa2V5LCB2YWx1ZSwgb2JqKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IGtleS5tYXRjaCgvKFteXFxbXSspXFxbKFteXFxbXSopXFxdLyksXG4gICAgICAgICAgICBwcm9wID0gbWF0Y2hbMV0sXG4gICAgICAgICAgICBuZXh0UHJvcCA9IG1hdGNoWzJdO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFxbKFteXFxbXSopXFxdLywgXCJcIik7XG4gICAgICAgICAgICB2YXIgY2hpbGRPYmogPSBudWxsO1xuICAgICAgICAgICAgaWYgKF9pc0NvbXBsZXgoa2V5KSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBuZXh0UHJvcCA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW15cXFtdKy8sIG5leHRQcm9wKTtcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgbnVsbCB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIG9ialtwcm9wXSA9IFtudWxsXTtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhcnJheVxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IF9jb252ZXJ0VG9PYmplY3Qob2JqW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJvYmplY3RcIikgeyAvLyBDaGVjayBpZiBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIENoZWNrIGlmIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW29ialtwcm9wXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9oYW5kbGVDb21wbGV4UXVlcnkoa2V5LCB2YWx1ZSwgY2hpbGRPYmopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG51bGxcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhcnJheVxuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBfY29udmVydFRvT2JqZWN0KG9ialtwcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIGlmIGFueSBvdGhlciB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gW29ialtwcm9wXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXS5wdXNoKGNoaWxkT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVTaW1wbGVRdWVyeShbbWF0Y2hbMV0sIHZhbHVlXSwgb2JqLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHthcnJheX0gcUFyciBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlPYmplY3QgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb252ZXJ0VG9BcnJheSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlU2ltcGxlUXVlcnkocUFyciwgcXVlcnlPYmplY3QsIGNvbnZlcnRUb0FycmF5KSB7XG4gICAgICAgIHZhciBrZXkgPSBxQXJyWzBdLFxuICAgICAgICAgICAgdmFsdWUgPSBfdmFsKHFBcnJbMV0pO1xuICAgICAgICBpZiAoa2V5IGluIHF1ZXJ5T2JqZWN0KSB7XG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldID0gQXJyYXkuaXNBcnJheShxdWVyeU9iamVjdFtrZXldKSA/IHF1ZXJ5T2JqZWN0W2tleV0gOiBbcXVlcnlPYmplY3Rba2V5XV07XG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldLnB1c2godmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IGNvbnZlcnRUb0FycmF5ID8gW3ZhbHVlXSA6IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZXMgdmFsdWVzIHRvIHRoZWlyIG9yaWdpbmFsIHR5cGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3ZhbCh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gXCJcIjtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBcIlwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIm51bGxcIikgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJOYU5cIikgcmV0dXJuIE5hTjtcbiAgICAgICAgaWYgKCFpc05hTigrdmFsdWUpKSByZXR1cm4gK3ZhbHVlO1xuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmYWxzZVwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhbiBhcnJheSB0byBhbiBvYmplY3RcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcnIgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2NvbnZlcnRUb09iamVjdChhcnIpIHtcbiAgICAgICAgdmFyIGNvbnZlcnRlZE9iaiA9IHt9O1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgY29udmVydGVkT2JqW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydGVkT2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG59KSh3aW5kb3csIHdpbmRvdy5qUXVlcnkpOyIsIi8qKlxuICogalF1ZXJ5IHJvdXRlciBwbHVnaW5cbiAqIFRoaXMgZmlsZSBjb250YWlucyBTUEEgcm91dGVyIG1ldGhvZHMgdG8gaGFuZGxlIHJvdXRpbmcgbWVjaGFuaXNtIGluIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9ucyAoU1BBKS4gU3VwcG9ydGVkIHZlcnNpb25zIElFOSssIENocm9tZSwgU2FmYXJpLCBGaXJlZm94XG4gKlxuICogQHByb2plY3QgICAgICBKcXVlcnkgUm91dGluZyBQbHVnaW5cbiAqIEBkYXRlICAgICAgICAgMjAxNy0wOC0wOFxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxuICogQGRlcGVuZGVuY2llcyBqUXVlcnlcbiAqIEB2ZXJzaW9uICAgICAgMS4wLjFcbiAqL1xuXG4oZnVuY3Rpb24gKHcsICQsIGhpc3RvcnkpIHtcbiAgICBpZiAoISQgfHwgISQuZm4pIHJldHVybjtcbiAgICAvLyBPYmplY3QgY29udGFpbmluZyBhIG1hcCBvZiBhdHRhY2hlZCBoYW5kbGVyc1xuICAgIHZhciByb3V0ZXIgPSB7XG4gICAgICAgIGhhbmRsZXJzOiBbXVxuICAgIH0sXG4gICAgICAgIC8vIFZhcmlhYmxlIHRvIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkgcHJvcGVybHkgICAgXG4gICAgICAgIGlzSGlzdG9yeVN1cHBvcnRlZCA9IGhpc3RvcnkgJiYgaGlzdG9yeS5wdXNoU3RhdGUsXG4gICAgICAgIC8vIERhdGEgY2FjaGVcbiAgICAgICAgY2FjaGUgPSB7XG4gICAgICAgICAgICBub1RyaWdnZXI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgICAgICAgcmVnZXggPSB7XG4gICAgICAgICAgICBwYXRobmFtZTogL15cXC8oPz1bXj9dKikvLFxuICAgICAgICAgICAgcm91dGVwYXJhbXM6IC86W15cXC9dKy9nXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFN1cHBvcnRlZCBldmVudHNcbiAgICAgICAgZXZlbnROYW1lcyA9IHtcbiAgICAgICAgICAgIHJvdXRlQ2hhbmdlZDogXCJyb3V0ZUNoYW5nZWRcIixcbiAgICAgICAgICAgIGhhc2hjaGFuZ2U6IFwiaGFzaGNoYW5nZVwiLFxuICAgICAgICAgICAgcG9wc3RhdGU6IFwicG9wc3RhdGVcIlxuICAgICAgICB9LFxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlc1xuICAgICAgICBlcnJvck1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBpbnZhbGlkUGF0aDogXCJQYXRoIGlzIGludmFsaWRcIlxuICAgICAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYW55IGxpc3QgdG8gSmF2YVNjcmlwdCBhcnJheVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFyciBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYXJyKGFycikge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBcInJvdXRlQ2hhbmdlZFwiIGV2ZW50IHVubGVzcyBcIm5vVHJpZ2dlclwiIGZsYWcgaXMgdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF90cmlnZ2VyUm91dGUocm91dGUsIGV2ZW50VHlwZSwgaXNIYXNoUm91dGUpIHtcbiAgICAgICAgaXNIYXNoUm91dGUgPSAhIWlzSGFzaFJvdXRlO1xuICAgICAgICBpZiAoY2FjaGUubm9UcmlnZ2VyICYmIGV2ZW50VHlwZSA9PT0gZXZlbnROYW1lcy5oYXNoY2hhbmdlKSB7XG4gICAgICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWNoZS5kYXRhID0gY2FjaGUuZGF0YSB8fCB7XG4gICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICB9O1xuICAgICAgICBjYWNoZS5kYXRhLmRhdGEgPSAkLmV4dGVuZCh7fSwgY2FjaGUuZGF0YS5kYXRhLCB7XG4gICAgICAgICAgICBldmVudFR5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgICAgIGhhc2g6IGlzSGFzaFJvdXRlLFxuICAgICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH0pO1xuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgY2FjaGUuZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhyb3cgSmF2YVNjcmlwdCBlcnJvcnMgd2l0aCBjdXN0b20gbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF90aHJvd0Vycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBnaXZlbiByb3V0ZSBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRSb3V0ZShzUm91dGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzUm91dGUgIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnBhdGhuYW1lLnRlc3Qoc1JvdXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgcXVlcnkgc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZyBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmcgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcbiAgICAgICAgaWYgKCFxU3RyaW5nICYmICFhcHBlbmRRU3RyaW5nKSByZXR1cm4gc1JvdXRlO1xuICAgICAgICBpZiAodHlwZW9mIHFTdHJpbmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGlmICgocVN0cmluZyA9IHFTdHJpbmcudHJpbSgpKSAmJiBhcHBlbmRRU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIHcubG9jYXRpb24uc2VhcmNoICsgXCImXCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChxU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIFwiP1wiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGN1cnJlbnQgcXVlcnkgc3RyaW5nIGludG8gYW4gb2JqZWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5UGFyYW1zKCkge1xuICAgICAgICB2YXIgcXNPYmplY3QgPSAkLmRlcGFyYW0ody5sb2NhdGlvbi5zZWFyY2gpLFxuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9IHt9O1xuICAgICAgICBpZiAody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pKSB7XG4gICAgICAgICAgICBoYXNoU3RyaW5nUGFyYW1zID0gJC5kZXBhcmFtKHcubG9jYXRpb24uaGFzaC5tYXRjaCgvXFw/LisvKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHFzT2JqZWN0LCBoYXNoU3RyaW5nUGFyYW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgcm91dGUgaXMgdmFsaWQgYW5kIHJldHVybnMgdGhlIHZhbGlkIHJvdXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxU3RyaW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhcHBlbmRRU3RyaW5nXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XG4gICAgICAgIGlmIChfaXNWYWxpZFJvdXRlKHNSb3V0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UuaW52YWxpZFBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHJvdXRlIGZvciBnaXZlbiB2aWV3XG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBvUm91dGUgXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZSBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpZ2dlciBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfc2V0Um91dGUob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XG4gICAgICAgIGlmICghb1JvdXRlKSByZXR1cm47XG4gICAgICAgIHZhciB0aXRsZSA9IG51bGwsXG4gICAgICAgICAgICBzUm91dGUgPSBcIlwiLFxuICAgICAgICAgICAgcVN0cmluZyA9IFwiXCIsXG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gZmFsc2UsXG4gICAgICAgICAgICBpc0hhc2hTdHJpbmcgPSBmYWxzZSxcbiAgICAgICAgICAgIHJvdXRlTWV0aG9kID0gcmVwbGFjZU1vZGUgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIjtcbiAgICAgICAgY2FjaGUubm9UcmlnZ2VyID0gbm9UcmlnZ2VyO1xuICAgICAgICBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBvUm91dGUuZGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRpdGxlID0gb1JvdXRlLnRpdGxlO1xuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlLnJvdXRlO1xuICAgICAgICAgICAgcVN0cmluZyA9IG9Sb3V0ZS5xdWVyeVN0cmluZztcbiAgICAgICAgICAgIGFwcGVuZFFTdHJpbmcgPSBvUm91dGUuYXBwZW5kUXVlcnk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdXBwb3J0IGZvciBoYXNoIHJvdXRlc1xuICAgICAgICBpZiAoc1JvdXRlLmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgIGlzSGFzaFN0cmluZyA9IHRydWU7XG4gICAgICAgICAgICBzUm91dGUgPSBzUm91dGUucmVwbGFjZShcIiNcIiwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiAhaXNIYXNoU3RyaW5nKSB7XG4gICAgICAgICAgICBoaXN0b3J5W3JvdXRlTWV0aG9kXShjYWNoZS5kYXRhLCB0aXRsZSwgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XG4gICAgICAgICAgICBpZiAoIW5vVHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEuZGF0YSA9ICQuZXh0ZW5kKHt9LCBjYWNoZS5kYXRhLmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlOiBldmVudE5hbWVzLnBvcHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBoYXNoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcm91dGU6IHNSb3V0ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCBjYWNoZS5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXBsYWNlTW9kZSkge1xuICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLmhhc2ggPSBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgYSByb3V0ZSBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcm91dGUoc1JvdXRlLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZXhpc3RpbmcgPSByb3V0ZXIuaGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZU9iKSB7XG4gICAgICAgICAgICByZXR1cm4gKHJvdXRlT2Iucm91dGUgPT09IHNSb3V0ZSAmJiByb3V0ZU9iLmhhbmRsZXIgPT09IGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChleGlzdGluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJvdXRlci5oYW5kbGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLFxuICAgICAgICAgICAgICAgIGhhbmRsZXI6IGNhbGxiYWNrLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZWxlbWVudDogdGhpcyxcbiAgICAgICAgICAgICAgICByb3V0ZTogc1JvdXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSByb3V0ZSBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSByb3V0ZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF91bnJvdXRlKHNSb3V0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlZCBhbGwgcm91dGVzXG4gICAgICAgICAgICByb3V0ZXIuaGFuZGxlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICByb3V0ZXIuaGFuZGxlcnMgPSByb3V0ZXIuaGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZU9iKSB7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVPYi5yb3V0ZSAhPT0gc1JvdXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICEocm91dGVPYi5yb3V0ZSA9PT0gc1JvdXRlICYmIHJvdXRlT2IuaGFuZGxlciA9PT0gY2FsbGJhY2spO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmltcyBsZWFkaW5nL3RyYWlsaW5nIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfc2FuaXRpemUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXihbXmEtekEtWjAtOV0rKXwoW15hLXpBLVowLTldKykkL2csIFwiXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXBhcmVzIHJvdXRlIHdpdGggY3VycmVudCBVUkxcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9tYXRjaGVkKHJvdXRlLCB1cmwsIHBhcmFtcykge1xuICAgICAgICBpZiAofnVybC5pbmRleE9mKFwiP1wiKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xuICAgICAgICB9XG4gICAgICAgIHJlZ2V4LnJvdXRlcGFyYW1zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGlmIChyZWdleC5yb3V0ZXBhcmFtcy50ZXN0KHJvdXRlKSkge1xuICAgICAgICAgICAgcGFyYW1zLnBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgdmFyIHBhdGhSZWdleCA9IG5ldyBSZWdFeHAocm91dGUucmVwbGFjZSgvXFwvL2csIFwiXFxcXC9cIikucmVwbGFjZSgvOlteXFwvXFxcXF0rL2csIFwiKFteXFxcXC9dKylcIikpO1xuICAgICAgICAgICAgaWYgKHBhdGhSZWdleC50ZXN0KHVybCkpIHtcbiAgICAgICAgICAgICAgICByZWdleC5yb3V0ZXBhcmFtcy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gX2Fycihyb3V0ZS5tYXRjaChyZWdleC5yb3V0ZXBhcmFtcykpLm1hcChfc2FuaXRpemUpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSBfYXJyKHVybC5tYXRjaChwYXRoUmVnZXgpKTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnBhcmFtc1trZXldID0gdmFsdWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoKHJvdXRlID09PSB1cmwpIHx8IChyb3V0ZSA9PT0gXCIqXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlcnMgYSByb3V0ZXIgZXZlbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JvdXRlVHJpZ2dlcihldmVudE5hbWUsIHBhcmFtcykge1xuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgcGFyYW1zIGlzIGFsd2F5cyBhbiBvYmplY3RcbiAgICAgICAgcGFyYW1zID0gJC5leHRlbmQocGFyYW1zLCB7fSk7XG4gICAgICAgIHBhcmFtcy5kYXRhID0gJC5leHRlbmQoe30sIHBhcmFtcy5kYXRhKTtcbiAgICAgICAgdmFyIGlzSGFzaFJvdXRlID0gcGFyYW1zLmRhdGEuaGFzaDtcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnRPYmplY3QuZXZlbnROYW1lID09PSBldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkICYmICFpc0hhc2hSb3V0ZSAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSGFzaFJvdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXcubG9jYXRpb24uaGFzaCAmJiAhaXNIaXN0b3J5U3VwcG9ydGVkICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIHcubG9jYXRpb24ucGF0aG5hbWUpOyAvLyA8LS0gVGhpcyB3aWxsIHRyaWdnZXIgcm91dGVyIGhhbmRsZXIgYXV0b21hdGljYWxseVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSwgcGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMsIF9nZXRRdWVyeVBhcmFtcygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgcm91dGVyIGV2ZW50c1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9iaW5kUm91dGVyRXZlbnRzKCkge1xuICAgICAgICAkKHcpLm9uKGV2ZW50TmFtZXMucG9wc3RhdGUsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBfdHJpZ2dlclJvdXRlLmFwcGx5KHRoaXMsIFt3LmxvY2F0aW9uLnBhdGhuYW1lLCBlLnR5cGVdKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQodykub24oZXZlbnROYW1lcy5oYXNoY2hhbmdlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgX3RyaWdnZXJSb3V0ZS5hcHBseSh0aGlzLCBbdy5sb2NhdGlvbi5oYXNoLCBlLnR5cGUsIHRydWVdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCEkLnJvdXRlcikge1xuICAgICAgICAkLnJvdXRlciA9IHtcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnROYW1lcyxcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogKGlzSGlzdG9yeVN1cHBvcnRlZCA/IGV2ZW50TmFtZXMucG9wc3RhdGUgOiBldmVudE5hbWVzLmhhc2hjaGFuZ2UpLFxuICAgICAgICAgICAgICAgICAgICBoYXNoOiAhaXNIaXN0b3J5U3VwcG9ydGVkLFxuICAgICAgICAgICAgICAgICAgICByb3V0ZTogKGlzSGlzdG9yeVN1cHBvcnRlZCA/IHcubG9jYXRpb24ucGF0aG5hbWUgOiB3LmxvY2F0aW9uLmhhc2gpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBzZXR0aW5nc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICh3LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh3KS50cmlnZ2VyKGV2ZW50TmFtZXMuaGFzaGNoYW5nZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpc3RvcnlTdXBwb3J0ZWQ6IGlzSGlzdG9yeVN1cHBvcnRlZFxuICAgICAgICB9O1xuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHBhcmFtcykge1xuICAgICAgICAgICAgX3JvdXRlVHJpZ2dlci5hcHBseSh0aGlzLCBbZXZlbnROYW1lLCBwYXJhbXNdKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEkLmZuLnJvdXRlKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSAkLmZuLnJvdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfcm91dGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoISQucm91dGUpIHtcbiAgICAgICAgICAgICAgICAkLnJvdXRlID0gcm91dGUuYmluZChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoISQuZm4udW5yb3V0ZSkge1xuICAgICAgICAgICAgdmFyIHVucm91dGUgPSAkLmZuLnVucm91dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF91bnJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCEkLnVucm91dGUpIHtcbiAgICAgICAgICAgICAgICAkLnVucm91dGUgPSB1bnJvdXRlLmJpbmQobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgJC5yb3V0ZXIuc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJvdXRlci5pbml0ID0gX2JpbmRSb3V0ZXJFdmVudHM7XG4gICAgcm91dGVyLmluaXQoKTtcbn0oXG4gICAgd2luZG93LFxuICAgIHdpbmRvdy5qUXVlcnksXG4gICAgd2luZG93Lmhpc3RvcnlcbikpOyJdfQ==
