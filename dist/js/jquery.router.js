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

; (function (w, $) {
    if (!$) return;
    if (!$.deparam) {
        /**
         * Converts a query string into JavaScript object
         * @param {string} qs
         */
        $.deparam = function (qs) {
            if (!(typeof qs === "string")) return;
            qs = decodeURIComponent(qs).replace("?", "").trim();
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
        }
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
        if (!(typeof value === "string")) return "";
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
 * @version      0.6.1
 */

;
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
        if (!$.setRoute) {
            $.setRoute = $.router.set;
        }
    }
    router.init = _bindRouterEvents;
    router.init();
}(
    window,
    window.jQuery,
    window.history
));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoianF1ZXJ5LnJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogalF1ZXJ5IGRlcGFyYW0gcGx1Z2luXG4gKiBDb252ZXJ0cyBhIHF1ZXJ5c3RyaW5nIHRvIGEgSmF2YVNjcmlwdCBvYmplY3RcbiAqXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBkZXBhcmFtIHBsdWdpblxuICogQGRhdGUgICAgICAgICAyMDE3LTA5LTEyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxuICogQHZlcnNpb24gICAgICAwLjEuMFxuICovXG5cbjsgKGZ1bmN0aW9uICh3LCAkKSB7XG4gICAgaWYgKCEkKSByZXR1cm47XG4gICAgaWYgKCEkLmRlcGFyYW0pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnZlcnRzIGEgcXVlcnkgc3RyaW5nIGludG8gSmF2YVNjcmlwdCBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHFzXG4gICAgICAgICAqL1xuICAgICAgICAkLmRlcGFyYW0gPSBmdW5jdGlvbiAocXMpIHtcbiAgICAgICAgICAgIGlmICghKHR5cGVvZiBxcyA9PT0gXCJzdHJpbmdcIikpIHJldHVybjtcbiAgICAgICAgICAgIHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHFzKS5yZXBsYWNlKFwiP1wiLCBcIlwiKS50cmltKCk7XG4gICAgICAgICAgICBpZiAocXMgPT09IFwiXCIpIHJldHVybiB7fTtcbiAgICAgICAgICAgIHZhciBxdWVyeVBhcmFtTGlzdCA9IHFzLnNwbGl0KFwiJlwiKSxcbiAgICAgICAgICAgICAgICBxdWVyeU9iamVjdCA9IHt9O1xuICAgICAgICAgICAgcXVlcnlQYXJhbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAocXEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcUFyciA9IHFxLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoX2lzQ29tcGxleChxQXJyWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KHFBcnJbMF0sIHFBcnJbMV0sIHF1ZXJ5T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkocUFyciwgcXVlcnlPYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5T2JqZWN0O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBpbnB1dCBpcyBhIG51bWJlclxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKCtrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHF1ZXJ5IHBhcmFtZXRlciBrZXkgaXMgYSBjb21wbGV4IG5vdGF0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHEgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzQ29tcGxleChxKSB7XG4gICAgICAgIHJldHVybiAoL1xcWy8udGVzdChxKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgY29tcGxleCBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIG9iaikge1xuICAgICAgICB2YXIgbWF0Y2ggPSBrZXkubWF0Y2goLyhbXlxcW10rKVxcWyhbXlxcW10qKVxcXS8pLFxuICAgICAgICAgICAgcHJvcCA9IG1hdGNoWzFdLFxuICAgICAgICAgICAgbmV4dFByb3AgPSBtYXRjaFsyXTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcWyhbXlxcW10qKVxcXS8sIFwiXCIpO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2JqID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3AgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFByb3AgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teXFxbXSsvLCBuZXh0UHJvcCk7XG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIG51bGwgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSBvYmpbcHJvcF0gPSBbbnVsbF07XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBfY29udmVydFRvT2JqZWN0KG9ialtwcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0ge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIGNoaWxkT2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBudWxsXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIG9ialtwcm9wXSA9IFtudWxsXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gX2NvbnZlcnRUb09iamVjdChvYmpbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcIm9iamVjdFwiKSB7IC8vIENoZWNrIGlmIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayBpZiBhbnkgb3RoZXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9ialtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0ucHVzaChjaGlsZE9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkoW21hdGNoWzFdLCB2YWx1ZV0sIG9iaiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHFBcnIgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5T2JqZWN0IFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udmVydFRvQXJyYXkgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2hhbmRsZVNpbXBsZVF1ZXJ5KHFBcnIsIHF1ZXJ5T2JqZWN0LCBjb252ZXJ0VG9BcnJheSkge1xuICAgICAgICB2YXIga2V5ID0gcUFyclswXSxcbiAgICAgICAgICAgIHZhbHVlID0gX3ZhbChxQXJyWzFdKTtcbiAgICAgICAgaWYgKGtleSBpbiBxdWVyeU9iamVjdCkge1xuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IEFycmF5LmlzQXJyYXkocXVlcnlPYmplY3Rba2V5XSkgPyBxdWVyeU9iamVjdFtrZXldIDogW3F1ZXJ5T2JqZWN0W2tleV1dO1xuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBjb252ZXJ0VG9BcnJheSA/IFt2YWx1ZV0gOiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmVzIHZhbHVlcyB0byB0aGVpciBvcmlnaW5hbCB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF92YWwodmFsdWUpIHtcbiAgICAgICAgaWYgKCEodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gXCJcIjtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJudWxsXCIpIHJldHVybiBudWxsO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwiTmFOXCIpIHJldHVybiBOYU47XG4gICAgICAgIGlmICghaXNOYU4oK3ZhbHVlKSkgcmV0dXJuICt2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYW4gYXJyYXkgdG8gYW4gb2JqZWN0XG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9jb252ZXJ0VG9PYmplY3QoYXJyKSB7XG4gICAgICAgIHZhciBjb252ZXJ0ZWRPYmogPSB7fTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRlZE9ialtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRlZE9iajtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxufSkod2luZG93LCB3aW5kb3cualF1ZXJ5KTsiLCIvKipcbiAqIGpRdWVyeSByb3V0ZXIgcGx1Z2luXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgU1BBIHJvdXRlciBtZXRob2RzIHRvIGhhbmRsZSByb3V0aW5nIG1lY2hhbmlzbSBpbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbnMgKFNQQSkuIFN1cHBvcnRlZCB2ZXJzaW9ucyBJRTkrLCBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveFxuICpcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IFJvdXRpbmcgUGx1Z2luXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDgtMDhcbiAqIEBhdXRob3IgICAgICAgU2FjaGluIFNpbmdoIDxzc2luZ2guMzAwODg5QGdtYWlsLmNvbT5cbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XG4gKiBAdmVyc2lvbiAgICAgIDAuNi4xXG4gKi9cblxuO1xuKGZ1bmN0aW9uICh3LCAkLCBoaXN0b3J5KSB7XG4gICAgaWYgKCEkIHx8ICEkLmZuKSByZXR1cm47XG4gICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgYSBtYXAgb2YgYXR0YWNoZWQgaGFuZGxlcnNcbiAgICB2YXIgcm91dGVyID0ge1xuICAgICAgICAgICAgaGFuZGxlcnM6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFZhcmlhYmxlIHRvIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkgcHJvcGVybHkgICAgXG4gICAgICAgIGlzSGlzdG9yeVN1cHBvcnRlZCA9IGhpc3RvcnkgJiYgaGlzdG9yeS5wdXNoU3RhdGUsXG4gICAgICAgIC8vIERhdGEgY2FjaGVcbiAgICAgICAgY2FjaGUgPSB7XG4gICAgICAgICAgICBub1RyaWdnZXI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgICAgICAgcmVnZXggPSB7XG4gICAgICAgICAgICBwYXRobmFtZTogL15cXC8oPz1bXj9dKikvLFxuICAgICAgICAgICAgcm91dGVwYXJhbXM6IC86W15cXC9dKy9nXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFN1cHBvcnRlZCBldmVudHNcbiAgICAgICAgZXZlbnROYW1lcyA9IHtcbiAgICAgICAgICAgIHJvdXRlQ2hhbmdlZDogXCJyb3V0ZUNoYW5nZWRcIixcbiAgICAgICAgICAgIGhhc2hjaGFuZ2U6IFwiaGFzaGNoYW5nZVwiLFxuICAgICAgICAgICAgcG9wc3RhdGU6IFwicG9wc3RhdGVcIlxuICAgICAgICB9LFxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlc1xuICAgICAgICBlcnJvck1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBpbnZhbGlkUGF0aDogXCJQYXRoIGlzIGludmFsaWRcIlxuICAgICAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYW55IGxpc3QgdG8gSmF2YVNjcmlwdCBhcnJheVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFyciBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYXJyKGFycikge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBcInJvdXRlQ2hhbmdlZFwiIGV2ZW50IHVubGVzcyBcIm5vVHJpZ2dlclwiIGZsYWcgaXMgdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF90cmlnZ2VyUm91dGUocm91dGUsIGV2ZW50VHlwZSwgaXNIYXNoUm91dGUpIHtcbiAgICAgICAgaXNIYXNoUm91dGUgPSAhIWlzSGFzaFJvdXRlO1xuICAgICAgICBpZiAoY2FjaGUubm9UcmlnZ2VyICYmIGV2ZW50VHlwZSA9PT0gZXZlbnROYW1lcy5oYXNoY2hhbmdlKSB7XG4gICAgICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWNoZS5kYXRhID0gY2FjaGUuZGF0YSB8fCB7XG4gICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICB9O1xuICAgICAgICBjYWNoZS5kYXRhLmRhdGEgPSAkLmV4dGVuZCh7fSwgY2FjaGUuZGF0YS5kYXRhLCB7XG4gICAgICAgICAgICBldmVudFR5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgICAgIGhhc2g6IGlzSGFzaFJvdXRlLFxuICAgICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH0pO1xuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgY2FjaGUuZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhyb3cgSmF2YVNjcmlwdCBlcnJvcnMgd2l0aCBjdXN0b20gbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF90aHJvd0Vycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBnaXZlbiByb3V0ZSBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRSb3V0ZShzUm91dGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzUm91dGUgIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnBhdGhuYW1lLnRlc3Qoc1JvdXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgcXVlcnkgc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZyBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmcgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcbiAgICAgICAgaWYgKCFxU3RyaW5nICYmICFhcHBlbmRRU3RyaW5nKSByZXR1cm4gc1JvdXRlO1xuICAgICAgICBpZiAodHlwZW9mIHFTdHJpbmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGlmICgocVN0cmluZyA9IHFTdHJpbmcudHJpbSgpKSAmJiBhcHBlbmRRU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIHcubG9jYXRpb24uc2VhcmNoICsgXCImXCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChxU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIFwiP1wiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGN1cnJlbnQgcXVlcnkgc3RyaW5nIGludG8gYW4gb2JqZWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5UGFyYW1zKCkge1xuICAgICAgICB2YXIgcXNPYmplY3QgPSAkLmRlcGFyYW0ody5sb2NhdGlvbi5zZWFyY2gpLFxuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9IHt9O1xuICAgICAgICBpZiAody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pKSB7XG4gICAgICAgICAgICBoYXNoU3RyaW5nUGFyYW1zID0gJC5kZXBhcmFtKHcubG9jYXRpb24uaGFzaC5tYXRjaCgvXFw/LisvKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHFzT2JqZWN0LCBoYXNoU3RyaW5nUGFyYW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgcm91dGUgaXMgdmFsaWQgYW5kIHJldHVybnMgdGhlIHZhbGlkIHJvdXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxU3RyaW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhcHBlbmRRU3RyaW5nXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XG4gICAgICAgIGlmIChfaXNWYWxpZFJvdXRlKHNSb3V0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UuaW52YWxpZFBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHJvdXRlIGZvciBnaXZlbiB2aWV3XG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBvUm91dGUgXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZSBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpZ2dlciBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfc2V0Um91dGUob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XG4gICAgICAgIGlmICghb1JvdXRlKSByZXR1cm47XG4gICAgICAgIHZhciB0aXRsZSA9IG51bGwsXG4gICAgICAgICAgICBzUm91dGUgPSBcIlwiLFxuICAgICAgICAgICAgcVN0cmluZyA9IFwiXCIsXG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gZmFsc2UsXG4gICAgICAgICAgICBpc0hhc2hTdHJpbmcgPSBmYWxzZSxcbiAgICAgICAgICAgIHJvdXRlTWV0aG9kID0gcmVwbGFjZU1vZGUgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIjtcbiAgICAgICAgY2FjaGUubm9UcmlnZ2VyID0gbm9UcmlnZ2VyO1xuICAgICAgICBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBvUm91dGUuZGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRpdGxlID0gb1JvdXRlLnRpdGxlO1xuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlLnJvdXRlO1xuICAgICAgICAgICAgcVN0cmluZyA9IG9Sb3V0ZS5xdWVyeVN0cmluZztcbiAgICAgICAgICAgIGFwcGVuZFFTdHJpbmcgPSBvUm91dGUuYXBwZW5kUXVlcnk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdXBwb3J0IGZvciBoYXNoIHJvdXRlc1xuICAgICAgICBpZiAoc1JvdXRlLmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgIGlzSGFzaFN0cmluZyA9IHRydWU7XG4gICAgICAgICAgICBzUm91dGUgPSBzUm91dGUucmVwbGFjZShcIiNcIiwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiAhaXNIYXNoU3RyaW5nKSB7XG4gICAgICAgICAgICBoaXN0b3J5W3JvdXRlTWV0aG9kXShjYWNoZS5kYXRhLCB0aXRsZSwgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XG4gICAgICAgICAgICBpZiAoIW5vVHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEuZGF0YSA9ICQuZXh0ZW5kKHt9LCBjYWNoZS5kYXRhLmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlOiBldmVudE5hbWVzLnBvcHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBoYXNoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcm91dGU6IHNSb3V0ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCBjYWNoZS5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXBsYWNlTW9kZSkge1xuICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLmhhc2ggPSBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgYSByb3V0ZSBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcm91dGUoc1JvdXRlLCBjYWxsYmFjaykge1xuICAgICAgICByb3V0ZXIuaGFuZGxlcnMucHVzaCh7XG4gICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLFxuICAgICAgICAgICAgaGFuZGxlcjogY2FsbGJhY2suYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMsXG4gICAgICAgICAgICByb3V0ZTogc1JvdXRlXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVHJpbXMgbGVhZGluZy90cmFpbGluZyBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW0gXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Nhbml0aXplKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL14oW15hLXpBLVowLTldKyl8KFteYS16QS1aMC05XSspJC9nLCBcIlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlcyByb3V0ZSB3aXRoIGN1cnJlbnQgVVJMXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfbWF0Y2hlZChyb3V0ZSwgdXJsLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKH51cmwuaW5kZXhPZihcIj9cIikpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZWdleC5yb3V0ZXBhcmFtcy5sYXN0SW5kZXggPSAwO1xuICAgICAgICBpZiAocmVnZXgucm91dGVwYXJhbXMudGVzdChyb3V0ZSkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wYXJhbXMgPSB7fTtcbiAgICAgICAgICAgIHZhciBwYXRoUmVnZXggPSBuZXcgUmVnRXhwKHJvdXRlLnJlcGxhY2UoL1xcLy9nLCBcIlxcXFwvXCIpLnJlcGxhY2UoLzpbXlxcL1xcXFxdKy9nLCBcIihbXlxcXFwvXSspXCIpKTtcbiAgICAgICAgICAgIGlmIChwYXRoUmVnZXgudGVzdCh1cmwpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBfYXJyKHJvdXRlLm1hdGNoKHJlZ2V4LnJvdXRlcGFyYW1zKSkubWFwKF9zYW5pdGl6ZSksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IF9hcnIodXJsLm1hdGNoKHBhdGhSZWdleCkpO1xuICAgICAgICAgICAgICAgIHZhbHVlcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucGFyYW1zW2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICgocm91dGUgPT09IHVybCkgfHwgKHJvdXRlID09PSBcIipcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBhIHJvdXRlciBldmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcm91dGVUcmlnZ2VyKGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCBwYXJhbXMgaXMgYWx3YXlzIGFuIG9iamVjdFxuICAgICAgICBwYXJhbXMgPSAkLmV4dGVuZChwYXJhbXMsIHt9KTtcbiAgICAgICAgcGFyYW1zLmRhdGEgPSAkLmV4dGVuZCh7fSwgcGFyYW1zLmRhdGEpO1xuICAgICAgICB2YXIgaXNIYXNoUm91dGUgPSBwYXJhbXMuZGF0YS5oYXNoO1xuICAgICAgICByb3V0ZXIuaGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChldmVudE9iamVjdC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgIWlzSGFzaFJvdXRlICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMsIF9nZXRRdWVyeVBhcmFtcygpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNIYXNoUm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdy5sb2NhdGlvbi5oYXNoICYmICFpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kYXRhID0gcGFyYW1zLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgdy5sb2NhdGlvbi5wYXRobmFtZSk7IC8vIDwtLSBUaGlzIHdpbGwgdHJpZ2dlciByb3V0ZXIgaGFuZGxlciBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpLCBwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRPYmplY3QuaGFuZGxlcihwYXJhbXMuZGF0YSwgcGFyYW1zLnBhcmFtcywgX2dldFF1ZXJ5UGFyYW1zKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyByb3V0ZXIgZXZlbnRzXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2JpbmRSb3V0ZXJFdmVudHMoKSB7XG4gICAgICAgICQodykub24oZXZlbnROYW1lcy5wb3BzdGF0ZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIF90cmlnZ2VyUm91dGUuYXBwbHkodGhpcywgW3cubG9jYXRpb24ucGF0aG5hbWUsIGUudHlwZV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh3KS5vbihldmVudE5hbWVzLmhhc2hjaGFuZ2UsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBfdHJpZ2dlclJvdXRlLmFwcGx5KHRoaXMsIFt3LmxvY2F0aW9uLmhhc2gsIGUudHlwZSwgdHJ1ZV0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoISQucm91dGVyKSB7XG4gICAgICAgICQucm91dGVyID0ge1xuICAgICAgICAgICAgZXZlbnRzOiBldmVudE5hbWVzLFxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlOiAoaXNIaXN0b3J5U3VwcG9ydGVkID8gZXZlbnROYW1lcy5wb3BzdGF0ZSA6IGV2ZW50TmFtZXMuaGFzaGNoYW5nZSksXG4gICAgICAgICAgICAgICAgICAgIGhhc2g6ICFpc0hpc3RvcnlTdXBwb3J0ZWQsXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlOiAoaXNIaXN0b3J5U3VwcG9ydGVkID8gdy5sb2NhdGlvbi5wYXRobmFtZSA6IHcubG9jYXRpb24uaGFzaClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNldHRpbmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHcubG9jYXRpb24uaGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAkKHcpLnRyaWdnZXIoZXZlbnROYW1lcy5oYXNoY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlzdG9yeVN1cHBvcnRlZDogaXNIaXN0b3J5U3VwcG9ydGVkXG4gICAgICAgIH07XG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBfcm91dGVUcmlnZ2VyLmFwcGx5KHRoaXMsIFtldmVudE5hbWUsIHBhcmFtc10pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoISQuZm4ucm91dGUpIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9ICQuZm4ucm91dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3JvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCEkLnJvdXRlKSB7XG4gICAgICAgICAgICAgICAgJC5yb3V0ZSA9IHJvdXRlLmJpbmQobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgJC5yb3V0ZXIuc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghJC5zZXRSb3V0ZSkge1xuICAgICAgICAgICAgJC5zZXRSb3V0ZSA9ICQucm91dGVyLnNldDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByb3V0ZXIuaW5pdCA9IF9iaW5kUm91dGVyRXZlbnRzO1xuICAgIHJvdXRlci5pbml0KCk7XG59KFxuICAgIHdpbmRvdyxcbiAgICB3aW5kb3cualF1ZXJ5LFxuICAgIHdpbmRvdy5oaXN0b3J5XG4pKTsiXX0=
