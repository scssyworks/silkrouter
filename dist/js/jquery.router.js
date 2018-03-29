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
 * @version      1.0.0
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
    }
    router.init = _bindRouterEvents;
    router.init();
}(
    window,
    window.jQuery,
    window.history
));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJqcXVlcnkucm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBqUXVlcnkgZGVwYXJhbSBwbHVnaW5cbiAqIENvbnZlcnRzIGEgcXVlcnlzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdFxuICpcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IGRlcGFyYW0gcGx1Z2luXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDktMTJcbiAqIEBhdXRob3IgICAgICAgU2FjaGluIFNpbmdoIDxzc2luZ2guMzAwODg5QGdtYWlsLmNvbT5cbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XG4gKiBAdmVyc2lvbiAgICAgIDAuMS4wXG4gKi9cblxuKGZ1bmN0aW9uICh3LCAkKSB7XG4gICAgaWYgKCEkKSByZXR1cm47XG4gICAgaWYgKCEkLmRlcGFyYW0pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnZlcnRzIGEgcXVlcnkgc3RyaW5nIGludG8gSmF2YVNjcmlwdCBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHFzXG4gICAgICAgICAqL1xuICAgICAgICAkLmRlcGFyYW0gPSBmdW5jdGlvbiAocXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcXMgIT09IFwic3RyaW5nXCIpIHJldHVybjtcbiAgICAgICAgICAgIHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHFzKS5yZXBsYWNlKFwiP1wiLCBcIlwiKS50cmltKCk7XG4gICAgICAgICAgICBpZiAocXMgPT09IFwiXCIpIHJldHVybiB7fTtcbiAgICAgICAgICAgIHZhciBxdWVyeVBhcmFtTGlzdCA9IHFzLnNwbGl0KFwiJlwiKSxcbiAgICAgICAgICAgICAgICBxdWVyeU9iamVjdCA9IHt9O1xuICAgICAgICAgICAgcXVlcnlQYXJhbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAocXEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcUFyciA9IHFxLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoX2lzQ29tcGxleChxQXJyWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KHFBcnJbMF0sIHFBcnJbMV0sIHF1ZXJ5T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkocUFyciwgcXVlcnlPYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5T2JqZWN0O1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgaW5wdXQgaXMgYSBudW1iZXJcbiAgICAgKiBAcGFyYW0geyp9IGtleSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlcihrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuICFpc05hTigra2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBxdWVyeSBwYXJhbWV0ZXIga2V5IGlzIGEgY29tcGxleCBub3RhdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pc0NvbXBsZXgocSkge1xuICAgICAgICByZXR1cm4gKC9cXFsvLnRlc3QocSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGNvbXBsZXggcXVlcnkgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2hhbmRsZUNvbXBsZXhRdWVyeShrZXksIHZhbHVlLCBvYmopIHtcbiAgICAgICAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKC8oW15cXFtdKylcXFsoW15cXFtdKilcXF0vKSxcbiAgICAgICAgICAgIHByb3AgPSBtYXRjaFsxXSxcbiAgICAgICAgICAgIG5leHRQcm9wID0gbWF0Y2hbMl07XG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXFsoW15cXFtdKilcXF0vLCBcIlwiKTtcbiAgICAgICAgICAgIHZhciBjaGlsZE9iaiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoX2lzQ29tcGxleChrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRQcm9wID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRQcm9wID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXlxcW10rLywgbmV4dFByb3ApO1xuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBudWxsIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFycmF5XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gX2NvbnZlcnRUb09iamVjdChvYmpbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcIm9iamVjdFwiKSB7IC8vIENoZWNrIGlmIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW107XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBbb2JqW3Byb3BdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShrZXksIHZhbHVlLCBjaGlsZE9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbnVsbFxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSBvYmpbcHJvcF0gPSBbbnVsbF07XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IF9jb252ZXJ0VG9PYmplY3Qob2JqW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJvYmplY3RcIikgeyAvLyBDaGVjayBpZiBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIENoZWNrIGlmIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgaWYgYW55IG90aGVyIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbb2JqW3Byb3BdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmpbbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdLnB1c2goY2hpbGRPYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZVNpbXBsZVF1ZXJ5KFttYXRjaFsxXSwgdmFsdWVdLCBvYmosIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBxQXJyIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeU9iamVjdCBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbnZlcnRUb0FycmF5IFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCwgY29udmVydFRvQXJyYXkpIHtcbiAgICAgICAgdmFyIGtleSA9IHFBcnJbMF0sXG4gICAgICAgICAgICB2YWx1ZSA9IF92YWwocUFyclsxXSk7XG4gICAgICAgIGlmIChrZXkgaW4gcXVlcnlPYmplY3QpIHtcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBBcnJheS5pc0FycmF5KHF1ZXJ5T2JqZWN0W2tleV0pID8gcXVlcnlPYmplY3Rba2V5XSA6IFtxdWVyeU9iamVjdFtrZXldXTtcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldID0gY29udmVydFRvQXJyYXkgPyBbdmFsdWVdIDogdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlcyB2YWx1ZXMgdG8gdGhlaXIgb3JpZ2luYWwgdHlwZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfdmFsKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHJldHVybiBcIlwiO1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwibnVsbFwiKSByZXR1cm4gbnVsbDtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIk5hTlwiKSByZXR1cm4gTmFOO1xuICAgICAgICBpZiAoIWlzTmFOKCt2YWx1ZSkpIHJldHVybiArdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIikgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFuIGFycmF5IHRvIGFuIG9iamVjdFxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFyciBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfY29udmVydFRvT2JqZWN0KGFycikge1xuICAgICAgICB2YXIgY29udmVydGVkT2JqID0ge307XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjb252ZXJ0ZWRPYmpbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjb252ZXJ0ZWRPYmo7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbn0pKHdpbmRvdywgd2luZG93LmpRdWVyeSk7IiwiLyoqXG4gKiBqUXVlcnkgcm91dGVyIHBsdWdpblxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFNQQSByb3V0ZXIgbWV0aG9kcyB0byBoYW5kbGUgcm91dGluZyBtZWNoYW5pc20gaW4gc2luZ2xlIHBhZ2UgYXBwbGljYXRpb25zIChTUEEpLiBTdXBwb3J0ZWQgdmVyc2lvbnMgSUU5KywgQ2hyb21lLCBTYWZhcmksIEZpcmVmb3hcbiAqXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBSb3V0aW5nIFBsdWdpblxuICogQGRhdGUgICAgICAgICAyMDE3LTA4LTA4XG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxuICogQHZlcnNpb24gICAgICAxLjAuMFxuICovXG5cbihmdW5jdGlvbiAodywgJCwgaGlzdG9yeSkge1xuICAgIGlmICghJCB8fCAhJC5mbikgcmV0dXJuO1xuICAgIC8vIE9iamVjdCBjb250YWluaW5nIGEgbWFwIG9mIGF0dGFjaGVkIGhhbmRsZXJzXG4gICAgdmFyIHJvdXRlciA9IHtcbiAgICAgICAgaGFuZGxlcnM6IFtdXG4gICAgfSxcbiAgICAgICAgLy8gVmFyaWFibGUgdG8gY2hlY2sgaWYgYnJvd3NlciBzdXBwb3J0cyBoaXN0b3J5IEFQSSBwcm9wZXJseSAgICBcbiAgICAgICAgaXNIaXN0b3J5U3VwcG9ydGVkID0gaGlzdG9yeSAmJiBoaXN0b3J5LnB1c2hTdGF0ZSxcbiAgICAgICAgLy8gRGF0YSBjYWNoZVxuICAgICAgICBjYWNoZSA9IHtcbiAgICAgICAgICAgIG5vVHJpZ2dlcjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLy8gUmVndWxhciBleHByZXNzaW9uc1xuICAgICAgICByZWdleCA9IHtcbiAgICAgICAgICAgIHBhdGhuYW1lOiAvXlxcLyg/PVteP10qKS8sXG4gICAgICAgICAgICByb3V0ZXBhcmFtczogLzpbXlxcL10rL2dcbiAgICAgICAgfSxcbiAgICAgICAgLy8gU3VwcG9ydGVkIGV2ZW50c1xuICAgICAgICBldmVudE5hbWVzID0ge1xuICAgICAgICAgICAgcm91dGVDaGFuZ2VkOiBcInJvdXRlQ2hhbmdlZFwiLFxuICAgICAgICAgICAgaGFzaGNoYW5nZTogXCJoYXNoY2hhbmdlXCIsXG4gICAgICAgICAgICBwb3BzdGF0ZTogXCJwb3BzdGF0ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIC8vIEVycm9yIG1lc3NhZ2VzXG4gICAgICAgIGVycm9yTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIGludmFsaWRQYXRoOiBcIlBhdGggaXMgaW52YWxpZFwiXG4gICAgICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhbnkgbGlzdCB0byBKYXZhU2NyaXB0IGFycmF5XG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9hcnIoYXJyKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJzIFwicm91dGVDaGFuZ2VkXCIgZXZlbnQgdW5sZXNzIFwibm9UcmlnZ2VyXCIgZmxhZyBpcyB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3RyaWdnZXJSb3V0ZShyb3V0ZSwgZXZlbnRUeXBlLCBpc0hhc2hSb3V0ZSkge1xuICAgICAgICBpc0hhc2hSb3V0ZSA9ICEhaXNIYXNoUm91dGU7XG4gICAgICAgIGlmIChjYWNoZS5ub1RyaWdnZXIgJiYgZXZlbnRUeXBlID09PSBldmVudE5hbWVzLmhhc2hjaGFuZ2UpIHtcbiAgICAgICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNhY2hlLmRhdGEgPSBjYWNoZS5kYXRhIHx8IHtcbiAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgIH07XG4gICAgICAgIGNhY2hlLmRhdGEuZGF0YSA9ICQuZXh0ZW5kKHt9LCBjYWNoZS5kYXRhLmRhdGEsIHtcbiAgICAgICAgICAgIGV2ZW50VHlwZTogZXZlbnRUeXBlLFxuICAgICAgICAgICAgaGFzaDogaXNIYXNoUm91dGUsXG4gICAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfSk7XG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCBjYWNoZS5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyBKYXZhU2NyaXB0IGVycm9ycyB3aXRoIGN1c3RvbSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Rocm93RXJyb3IobWVzc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGdpdmVuIHJvdXRlIGlzIHZhbGlkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNWYWxpZFJvdXRlKHNSb3V0ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHNSb3V0ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gcmVnZXgucGF0aG5hbWUudGVzdChzUm91dGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBxdWVyeSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxU3RyaW5nIFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZyBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykge1xuICAgICAgICBpZiAoIXFTdHJpbmcgJiYgIWFwcGVuZFFTdHJpbmcpIHJldHVybiBzUm91dGU7XG4gICAgICAgIGlmICh0eXBlb2YgcVN0cmluZyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaWYgKChxU3RyaW5nID0gcVN0cmluZy50cmltKCkpICYmIGFwcGVuZFFTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlICsgdy5sb2NhdGlvbi5zZWFyY2ggKyBcIiZcIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHFTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlICsgXCI/XCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgY3VycmVudCBxdWVyeSBzdHJpbmcgaW50byBhbiBvYmplY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlQYXJhbXMoKSB7XG4gICAgICAgIHZhciBxc09iamVjdCA9ICQuZGVwYXJhbSh3LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICAgICAgICBoYXNoU3RyaW5nUGFyYW1zID0ge307XG4gICAgICAgIGlmICh3LmxvY2F0aW9uLmhhc2gubWF0Y2goL1xcPy4rLykpIHtcbiAgICAgICAgICAgIGhhc2hTdHJpbmdQYXJhbXMgPSAkLmRlcGFyYW0ody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJC5leHRlbmQocXNPYmplY3QsIGhhc2hTdHJpbmdQYXJhbXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiByb3V0ZSBpcyB2YWxpZCBhbmQgcmV0dXJucyB0aGUgdmFsaWQgcm91dGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmdcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcbiAgICAgICAgaWYgKF9pc1ZhbGlkUm91dGUoc1JvdXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aHJvd0Vycm9yKGVycm9yTWVzc2FnZS5pbnZhbGlkUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgcm91dGUgZm9yIGdpdmVuIHZpZXdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG9Sb3V0ZSBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlcGxhY2VNb2RlIFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9zZXRSb3V0ZShvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXIpIHtcbiAgICAgICAgaWYgKCFvUm91dGUpIHJldHVybjtcbiAgICAgICAgdmFyIHRpdGxlID0gbnVsbCxcbiAgICAgICAgICAgIHNSb3V0ZSA9IFwiXCIsXG4gICAgICAgICAgICBxU3RyaW5nID0gXCJcIixcbiAgICAgICAgICAgIGFwcGVuZFFTdHJpbmcgPSBmYWxzZSxcbiAgICAgICAgICAgIGlzSGFzaFN0cmluZyA9IGZhbHNlLFxuICAgICAgICAgICAgcm91dGVNZXRob2QgPSByZXBsYWNlTW9kZSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiO1xuICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBub1RyaWdnZXI7XG4gICAgICAgIGlmICh0eXBlb2Ygb1JvdXRlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBjYWNoZS5kYXRhID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IG9Sb3V0ZS5kYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGl0bGUgPSBvUm91dGUudGl0bGU7XG4gICAgICAgICAgICBzUm91dGUgPSBvUm91dGUucm91dGU7XG4gICAgICAgICAgICBxU3RyaW5nID0gb1JvdXRlLnF1ZXJ5U3RyaW5nO1xuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IG9Sb3V0ZS5hcHBlbmRRdWVyeTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb1JvdXRlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjYWNoZS5kYXRhID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN1cHBvcnQgZm9yIGhhc2ggcm91dGVzXG4gICAgICAgIGlmIChzUm91dGUuY2hhckF0KDApID09PSBcIiNcIikge1xuICAgICAgICAgICAgaXNIYXNoU3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHNSb3V0ZSA9IHNSb3V0ZS5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkICYmICFpc0hhc2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGhpc3Rvcnlbcm91dGVNZXRob2RdKGNhY2hlLmRhdGEsIHRpdGxlLCBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpKTtcbiAgICAgICAgICAgIGlmICghbm9UcmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgY2FjaGUuZGF0YS5kYXRhID0gJC5leHRlbmQoe30sIGNhY2hlLmRhdGEuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICBldmVudFR5cGU6IGV2ZW50TmFtZXMucG9wc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIGhhc2g6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByb3V0ZTogc1JvdXRlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsIGNhY2hlLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcGxhY2VNb2RlKSB7XG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHcubG9jYXRpb24uaGFzaCA9IF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyBhIHJvdXRlIGhhbmRsZXIgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yb3V0ZShzUm91dGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsXG4gICAgICAgICAgICBoYW5kbGVyOiBjYWxsYmFjay5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZWxlbWVudDogdGhpcyxcbiAgICAgICAgICAgIHJvdXRlOiBzUm91dGVcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBUcmltcyBsZWFkaW5nL3RyYWlsaW5nIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfc2FuaXRpemUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXihbXmEtekEtWjAtOV0rKXwoW15hLXpBLVowLTldKykkL2csIFwiXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXBhcmVzIHJvdXRlIHdpdGggY3VycmVudCBVUkxcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9tYXRjaGVkKHJvdXRlLCB1cmwsIHBhcmFtcykge1xuICAgICAgICBpZiAofnVybC5pbmRleE9mKFwiP1wiKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWdleC5yb3V0ZXBhcmFtcy50ZXN0KHJvdXRlKSkge1xuICAgICAgICAgICAgcGFyYW1zLnBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgdmFyIHBhdGhSZWdleCA9IG5ldyBSZWdFeHAocm91dGUucmVwbGFjZSgvXFwvL2csIFwiXFxcXC9cIikucmVwbGFjZSgvOlteXFwvXFxcXF0rL2csIFwiKFteXFxcXC9dKylcIikpO1xuICAgICAgICAgICAgaWYgKHBhdGhSZWdleC50ZXN0KHVybCkpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IF9hcnIocm91dGUubWF0Y2gocmVnZXgucm91dGVwYXJhbXMpKS5tYXAoX3Nhbml0aXplKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gX2Fycih1cmwubWF0Y2gocGF0aFJlZ2V4KSk7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wYXJhbXNba2V5XSA9IHZhbHVlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKChyb3V0ZSA9PT0gdXJsKSB8fCAocm91dGUgPT09IFwiKlwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJzIGEgcm91dGVyIGV2ZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yb3V0ZVRyaWdnZXIoZXZlbnROYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHBhcmFtcyBpcyBhbHdheXMgYW4gb2JqZWN0XG4gICAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKHBhcmFtcywge30pO1xuICAgICAgICBwYXJhbXMuZGF0YSA9ICQuZXh0ZW5kKHt9LCBwYXJhbXMuZGF0YSk7XG4gICAgICAgIHZhciBpc0hhc2hSb3V0ZSA9IHBhcmFtcy5kYXRhLmhhc2g7XG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50T2JqZWN0LmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiAhaXNIYXNoUm91dGUgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRPYmplY3QuaGFuZGxlcihwYXJhbXMuZGF0YSwgcGFyYW1zLnBhcmFtcywgX2dldFF1ZXJ5UGFyYW1zKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0hhc2hSb3V0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF3LmxvY2F0aW9uLmhhc2ggJiYgIWlzSGlzdG9yeVN1cHBvcnRlZCAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEgPSBwYXJhbXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyB3LmxvY2F0aW9uLnBhdGhuYW1lKTsgLy8gPC0tIFRoaXMgd2lsbCB0cmlnZ2VyIHJvdXRlciBoYW5kbGVyIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSksIHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHJvdXRlciBldmVudHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYmluZFJvdXRlckV2ZW50cygpIHtcbiAgICAgICAgJCh3KS5vbihldmVudE5hbWVzLnBvcHN0YXRlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgX3RyaWdnZXJSb3V0ZS5hcHBseSh0aGlzLCBbdy5sb2NhdGlvbi5wYXRobmFtZSwgZS50eXBlXSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKHcpLm9uKGV2ZW50TmFtZXMuaGFzaGNoYW5nZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIF90cmlnZ2VyUm91dGUuYXBwbHkodGhpcywgW3cubG9jYXRpb24uaGFzaCwgZS50eXBlLCB0cnVlXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghJC5yb3V0ZXIpIHtcbiAgICAgICAgJC5yb3V0ZXIgPSB7XG4gICAgICAgICAgICBldmVudHM6IGV2ZW50TmFtZXMsXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBldmVudFR5cGU6IChpc0hpc3RvcnlTdXBwb3J0ZWQgPyBldmVudE5hbWVzLnBvcHN0YXRlIDogZXZlbnROYW1lcy5oYXNoY2hhbmdlKSxcbiAgICAgICAgICAgICAgICAgICAgaGFzaDogIWlzSGlzdG9yeVN1cHBvcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgcm91dGU6IChpc0hpc3RvcnlTdXBwb3J0ZWQgPyB3LmxvY2F0aW9uLnBhdGhuYW1lIDogdy5sb2NhdGlvbi5oYXNoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogc2V0dGluZ3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAody5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodykudHJpZ2dlcihldmVudE5hbWVzLmhhc2hjaGFuZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXN0b3J5U3VwcG9ydGVkOiBpc0hpc3RvcnlTdXBwb3J0ZWRcbiAgICAgICAgfTtcbiAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIF9yb3V0ZVRyaWdnZXIuYXBwbHkodGhpcywgW2V2ZW50TmFtZSwgcGFyYW1zXSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghJC5mbi5yb3V0ZSkge1xuICAgICAgICAgICAgdmFyIHJvdXRlID0gJC5mbi5yb3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfcm91dGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoISQucm91dGUpIHtcbiAgICAgICAgICAgICAgICAkLnJvdXRlID0gcm91dGUuYmluZChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAkLnJvdXRlci5zZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfc2V0Um91dGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcm91dGVyLmluaXQgPSBfYmluZFJvdXRlckV2ZW50cztcbiAgICByb3V0ZXIuaW5pdCgpO1xufShcbiAgICB3aW5kb3csXG4gICAgd2luZG93LmpRdWVyeSxcbiAgICB3aW5kb3cuaGlzdG9yeVxuKSk7Il19
