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
 * @version      0.5.0
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImpxdWVyeS5yb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogalF1ZXJ5IGRlcGFyYW0gcGx1Z2luXHJcbiAqIENvbnZlcnRzIGEgcXVlcnlzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBkZXBhcmFtIHBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDktMTJcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMS4wXHJcbiAqL1xyXG5cclxuOyAoZnVuY3Rpb24gKHcsICQpIHtcclxuICAgIGlmICghJCkgcmV0dXJuO1xyXG4gICAgaWYgKCEkLmRlcGFyYW0pIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIHF1ZXJ5IHN0cmluZyBpbnRvIEphdmFTY3JpcHQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHFzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5kZXBhcmFtID0gZnVuY3Rpb24gKHFzKSB7XHJcbiAgICAgICAgICAgIGlmICghKHR5cGVvZiBxcyA9PT0gXCJzdHJpbmdcIikpIHJldHVybjtcclxuICAgICAgICAgICAgcXMgPSBkZWNvZGVVUklDb21wb25lbnQocXMpLnJlcGxhY2UoXCI/XCIsIFwiXCIpLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKHFzID09PSBcIlwiKSByZXR1cm4ge307XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVBhcmFtTGlzdCA9IHFzLnNwbGl0KFwiJlwiKSxcclxuICAgICAgICAgICAgICAgIHF1ZXJ5T2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1MaXN0LmZvckVhY2goZnVuY3Rpb24gKHFxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcUFyciA9IHFxLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KHFBcnJbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShxQXJyWzBdLCBxQXJyWzFdLCBxdWVyeU9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgaW5wdXQgaXMgYSBudW1iZXJcclxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpc051bWJlcihrZXkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTigra2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgcXVlcnkgcGFyYW1ldGVyIGtleSBpcyBhIGNvbXBsZXggbm90YXRpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaXNDb21wbGV4KHEpIHtcclxuICAgICAgICByZXR1cm4gKC9cXFsvLnRlc3QocSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGNvbXBsZXggcXVlcnkgcGFyYW1ldGVyc1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9oYW5kbGVDb21wbGV4UXVlcnkoa2V5LCB2YWx1ZSwgb2JqKSB7XHJcbiAgICAgICAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKC8oW15cXFtdKylcXFsoW15cXFtdKilcXF0vKSxcclxuICAgICAgICAgICAgcHJvcCA9IG1hdGNoWzFdLFxyXG4gICAgICAgICAgICBuZXh0UHJvcCA9IG1hdGNoWzJdO1xyXG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcWyhbXlxcW10qKVxcXS8sIFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRPYmogPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoX2lzQ29tcGxleChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3AgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0UHJvcCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teXFxbXSsvLCBuZXh0UHJvcCk7XHJcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgbnVsbCB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcclxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gX2NvbnZlcnRUb09iamVjdChvYmpbcHJvcF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJvYmplY3RcIikgeyAvLyBDaGVjayBpZiBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW29ialtwcm9wXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIGNoaWxkT2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBfY29udmVydFRvT2JqZWN0KG9ialtwcm9wXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIGlmIGFueSBvdGhlciB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbb2JqW3Byb3BdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdLnB1c2goY2hpbGRPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkoW21hdGNoWzFdLCB2YWx1ZV0sIG9iaiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthcnJheX0gcUFyciBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeU9iamVjdCBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udmVydFRvQXJyYXkgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCwgY29udmVydFRvQXJyYXkpIHtcclxuICAgICAgICB2YXIga2V5ID0gcUFyclswXSxcclxuICAgICAgICAgICAgdmFsdWUgPSBfdmFsKHFBcnJbMV0pO1xyXG4gICAgICAgIGlmIChrZXkgaW4gcXVlcnlPYmplY3QpIHtcclxuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IEFycmF5LmlzQXJyYXkocXVlcnlPYmplY3Rba2V5XSkgPyBxdWVyeU9iamVjdFtrZXldIDogW3F1ZXJ5T2JqZWN0W2tleV1dO1xyXG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBjb252ZXJ0VG9BcnJheSA/IFt2YWx1ZV0gOiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0b3JlcyB2YWx1ZXMgdG8gdGhlaXIgb3JpZ2luYWwgdHlwZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCEodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIm51bGxcIikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIk5hTlwiKSByZXR1cm4gTmFOO1xyXG4gICAgICAgIGlmICghaXNOYU4oK3ZhbHVlKSkgcmV0dXJuICt2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbiBhcnJheSB0byBhbiBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFyciBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2NvbnZlcnRUb09iamVjdChhcnIpIHtcclxuICAgICAgICB2YXIgY29udmVydGVkT2JqID0ge307XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xyXG4gICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb252ZXJ0ZWRPYmpbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29udmVydGVkT2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbn0pKHdpbmRvdywgd2luZG93LmpRdWVyeSk7IiwiLyoqXHJcbiAqIGpRdWVyeSByb3V0ZXIgcGx1Z2luXHJcbiAqIFRoaXMgZmlsZSBjb250YWlucyBTUEEgcm91dGVyIG1ldGhvZHMgdG8gaGFuZGxlIHJvdXRpbmcgbWVjaGFuaXNtIGluIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9ucyAoU1BBKS4gU3VwcG9ydGVkIHZlcnNpb25zIElFOSssIENocm9tZSwgU2FmYXJpLCBGaXJlZm94XHJcbiAqXHJcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IFJvdXRpbmcgUGx1Z2luXHJcbiAqIEBkYXRlICAgICAgICAgMjAxNy0wOC0wOFxyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XHJcbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XHJcbiAqIEB2ZXJzaW9uICAgICAgMC41LjBcclxuICovXHJcblxyXG47XHJcbihmdW5jdGlvbiAodywgJCwgaGlzdG9yeSkge1xyXG4gICAgaWYgKCEkIHx8ICEkLmZuKSByZXR1cm47XHJcbiAgICAvLyBPYmplY3QgY29udGFpbmluZyBhIG1hcCBvZiBhdHRhY2hlZCBoYW5kbGVyc1xyXG4gICAgdmFyIHJvdXRlciA9IHtcclxuICAgICAgICAgICAgaGFuZGxlcnM6IFtdXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBWYXJpYWJsZSB0byBjaGVjayBpZiBicm93c2VyIHN1cHBvcnRzIGhpc3RvcnkgQVBJIHByb3Blcmx5ICAgIFxyXG4gICAgICAgIGlzSGlzdG9yeVN1cHBvcnRlZCA9IGhpc3RvcnkgJiYgaGlzdG9yeS5wdXNoU3RhdGUsXHJcbiAgICAgICAgLy8gRGF0YSBjYWNoZVxyXG4gICAgICAgIGNhY2hlID0ge1xyXG4gICAgICAgICAgICBub1RyaWdnZXI6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb25zXHJcbiAgICAgICAgcmVnZXggPSB7XHJcbiAgICAgICAgICAgIHBhdGhuYW1lOiAvXlxcLyg/PVteP10qKS8sXHJcbiAgICAgICAgICAgIHJvdXRlcGFyYW1zOiAvOlteXFwvXSsvZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gU3VwcG9ydGVkIGV2ZW50c1xyXG4gICAgICAgIGV2ZW50TmFtZXMgPSB7XHJcbiAgICAgICAgICAgIHJvdXRlQ2hhbmdlZDogXCJyb3V0ZUNoYW5nZWRcIixcclxuICAgICAgICAgICAgaGFzaGNoYW5nZTogXCJoYXNoY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIHBvcHN0YXRlOiBcInBvcHN0YXRlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEVycm9yIG1lc3NhZ2VzXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICBpbnZhbGlkUGF0aDogXCJQYXRoIGlzIGludmFsaWRcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbnkgbGlzdCB0byBKYXZhU2NyaXB0IGFycmF5XHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcnIgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9hcnIoYXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyBcInJvdXRlQ2hhbmdlZFwiIGV2ZW50IHVubGVzcyBcIm5vVHJpZ2dlclwiIGZsYWcgaXMgdHJ1ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdHJpZ2dlclJvdXRlKHJvdXRlLCBldmVudFR5cGUsIGlzSGFzaFJvdXRlKSB7XHJcbiAgICAgICAgaXNIYXNoUm91dGUgPSAhIWlzSGFzaFJvdXRlO1xyXG4gICAgICAgIGlmIChjYWNoZS5ub1RyaWdnZXIgJiYgZXZlbnRUeXBlID09PSBldmVudE5hbWVzLmhhc2hjaGFuZ2UpIHtcclxuICAgICAgICAgICAgY2FjaGUubm9UcmlnZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FjaGUuZGF0YSA9IGNhY2hlLmRhdGEgfHwge1xyXG4gICAgICAgICAgICBkYXRhOiB7fVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2FjaGUuZGF0YS5kYXRhID0gJC5leHRlbmQoe30sIGNhY2hlLmRhdGEuZGF0YSwge1xyXG4gICAgICAgICAgICBldmVudFR5cGU6IGV2ZW50VHlwZSxcclxuICAgICAgICAgICAgaGFzaDogaXNIYXNoUm91dGUsXHJcbiAgICAgICAgICAgIHJvdXRlOiByb3V0ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCBjYWNoZS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRocm93IEphdmFTY3JpcHQgZXJyb3JzIHdpdGggY3VzdG9tIG1lc3NhZ2VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdGhyb3dFcnJvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIGdpdmVuIHJvdXRlIGlzIHZhbGlkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaXNWYWxpZFJvdXRlKHNSb3V0ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc1JvdXRlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnBhdGhuYW1lLnRlc3Qoc1JvdXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBxdWVyeSBzdHJpbmdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZyBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXFTdHJpbmcgJiYgIWFwcGVuZFFTdHJpbmcpIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBxU3RyaW5nID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGlmICgocVN0cmluZyA9IHFTdHJpbmcudHJpbSgpKSAmJiBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlICsgdy5sb2NhdGlvbi5zZWFyY2ggKyBcIiZcIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIFwiP1wiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBjdXJyZW50IHF1ZXJ5IHN0cmluZyBpbnRvIGFuIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlQYXJhbXMoKSB7XHJcbiAgICAgICAgdmFyIHFzT2JqZWN0ID0gJC5kZXBhcmFtKHcubG9jYXRpb24uc2VhcmNoKSxcclxuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9IHt9O1xyXG4gICAgICAgIGlmICh3LmxvY2F0aW9uLmhhc2gubWF0Y2goL1xcPy4rLykpIHtcclxuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9ICQuZGVwYXJhbSh3LmxvY2F0aW9uLmhhc2gubWF0Y2goL1xcPy4rLylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJC5leHRlbmQocXNPYmplY3QsIGhhc2hTdHJpbmdQYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHJvdXRlIGlzIHZhbGlkIGFuZCByZXR1cm5zIHRoZSB2YWxpZCByb3V0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmdcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICBpZiAoX2lzVmFsaWRSb3V0ZShzUm91dGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3Rocm93RXJyb3IoZXJyb3JNZXNzYWdlLmludmFsaWRQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgcm91dGUgZm9yIGdpdmVuIHZpZXdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZSBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2V0Um91dGUob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgaWYgKCFvUm91dGUpIHJldHVybjtcclxuICAgICAgICB2YXIgdGl0bGUgPSBudWxsLFxyXG4gICAgICAgICAgICBzUm91dGUgPSBcIlwiLFxyXG4gICAgICAgICAgICBxU3RyaW5nID0gXCJcIixcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0hhc2hTdHJpbmcgPSBmYWxzZSxcclxuICAgICAgICAgICAgcm91dGVNZXRob2QgPSByZXBsYWNlTW9kZSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiO1xyXG4gICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IG5vVHJpZ2dlcjtcclxuICAgICAgICBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICBjYWNoZS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogb1JvdXRlLmRhdGFcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGl0bGUgPSBvUm91dGUudGl0bGU7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZS5yb3V0ZTtcclxuICAgICAgICAgICAgcVN0cmluZyA9IG9Sb3V0ZS5xdWVyeVN0cmluZztcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IG9Sb3V0ZS5hcHBlbmRRdWVyeTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU3VwcG9ydCBmb3IgaGFzaCByb3V0ZXNcclxuICAgICAgICBpZiAoc1JvdXRlLmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgaXNIYXNoU3RyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgc1JvdXRlID0gc1JvdXRlLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkICYmICFpc0hhc2hTdHJpbmcpIHtcclxuICAgICAgICAgICAgaGlzdG9yeVtyb3V0ZU1ldGhvZF0oY2FjaGUuZGF0YSwgdGl0bGUsIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xyXG4gICAgICAgICAgICBpZiAoIW5vVHJpZ2dlcikge1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZGF0YS5kYXRhID0gJC5leHRlbmQoe30sIGNhY2hlLmRhdGEuZGF0YSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogZXZlbnROYW1lcy5wb3BzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICByb3V0ZTogc1JvdXRlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCBjYWNoZS5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyZXBsYWNlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLmhhc2ggPSBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgYSByb3V0ZSBoYW5kbGVyIGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yb3V0ZShzUm91dGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLnB1c2goe1xyXG4gICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiBjYWxsYmFjay5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLFxyXG4gICAgICAgICAgICByb3V0ZTogc1JvdXRlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpbXMgbGVhZGluZy90cmFpbGluZyBzcGVjaWFsIGNoYXJhY3RlcnNcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Nhbml0aXplKHN0cikge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXihbXmEtekEtWjAtOV0rKXwoW15hLXpBLVowLTldKykkL2csIFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcGFyZXMgcm91dGUgd2l0aCBjdXJyZW50IFVSTFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9tYXRjaGVkKHJvdXRlLCB1cmwsIHBhcmFtcykge1xyXG4gICAgICAgIGlmICh+dXJsLmluZGV4T2YoXCI/XCIpKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlZ2V4LnJvdXRlcGFyYW1zLnRlc3Qocm91dGUpKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wYXJhbXMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHBhdGhSZWdleCA9IG5ldyBSZWdFeHAocm91dGUucmVwbGFjZSgvXFwvL2csIFwiXFxcXC9cIikucmVwbGFjZSgvOlteXFwvXFxcXF0rL2csIFwiKFteXFxcXC9dKylcIikpO1xyXG4gICAgICAgICAgICBpZiAocGF0aFJlZ2V4LnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBfYXJyKHJvdXRlLm1hdGNoKHJlZ2V4LnJvdXRlcGFyYW1zKSkubWFwKF9zYW5pdGl6ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gX2Fycih1cmwubWF0Y2gocGF0aFJlZ2V4KSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wYXJhbXNba2V5XSA9IHZhbHVlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICgocm91dGUgPT09IHVybCkgfHwgKHJvdXRlID09PSBcIipcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyBhIHJvdXRlciBldmVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yb3V0ZVRyaWdnZXIoZXZlbnROYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgcGFyYW1zIGlzIGFsd2F5cyBhbiBvYmplY3RcclxuICAgICAgICBwYXJhbXMgPSAkLmV4dGVuZChwYXJhbXMsIHt9KTtcclxuICAgICAgICBwYXJhbXMuZGF0YSA9ICQuZXh0ZW5kKHt9LCBwYXJhbXMuZGF0YSk7XHJcbiAgICAgICAgdmFyIGlzSGFzaFJvdXRlID0gcGFyYW1zLmRhdGEuaGFzaDtcclxuICAgICAgICByb3V0ZXIuaGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRPYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50T2JqZWN0LmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkICYmICFpc0hhc2hSb3V0ZSAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMsIF9nZXRRdWVyeVBhcmFtcygpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSGFzaFJvdXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdy5sb2NhdGlvbi5oYXNoICYmICFpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEgPSBwYXJhbXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIHcubG9jYXRpb24ucGF0aG5hbWUpOyAvLyA8LS0gVGhpcyB3aWxsIHRyaWdnZXIgcm91dGVyIGhhbmRsZXIgYXV0b21hdGljYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVzIHJvdXRlciBldmVudHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2JpbmRSb3V0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgJCh3KS5vbihldmVudE5hbWVzLnBvcHN0YXRlLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBfdHJpZ2dlclJvdXRlLmFwcGx5KHRoaXMsIFt3LmxvY2F0aW9uLnBhdGhuYW1lLCBlLnR5cGVdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHcpLm9uKGV2ZW50TmFtZXMuaGFzaGNoYW5nZSwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgX3RyaWdnZXJSb3V0ZS5hcHBseSh0aGlzLCBbdy5sb2NhdGlvbi5oYXNoLCBlLnR5cGUsIHRydWVdKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISQucm91dGVyKSB7XHJcbiAgICAgICAgJC5yb3V0ZXIgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnROYW1lcyxcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogKGlzSGlzdG9yeVN1cHBvcnRlZCA/IGV2ZW50TmFtZXMucG9wc3RhdGUgOiBldmVudE5hbWVzLmhhc2hjaGFuZ2UpLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc2g6ICFpc0hpc3RvcnlTdXBwb3J0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcm91dGU6IChpc0hpc3RvcnlTdXBwb3J0ZWQgPyB3LmxvY2F0aW9uLnBhdGhuYW1lIDogdy5sb2NhdGlvbi5oYXNoKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogc2V0dGluZ3NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHcubG9jYXRpb24uaGFzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodykudHJpZ2dlcihldmVudE5hbWVzLmhhc2hjaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaXN0b3J5U3VwcG9ydGVkOiBpc0hpc3RvcnlTdXBwb3J0ZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIF9yb3V0ZVRyaWdnZXIuYXBwbHkodGhpcywgW2V2ZW50TmFtZSwgcGFyYW1zXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoISQuZm4ucm91dGUpIHtcclxuICAgICAgICAgICAgdmFyIHJvdXRlID0gJC5mbi5yb3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF9yb3V0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoISQucm91dGUpIHtcclxuICAgICAgICAgICAgICAgICQucm91dGUgPSByb3V0ZS5iaW5kKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQucm91dGVyLnNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoISQuc2V0Um91dGUpIHtcclxuICAgICAgICAgICAgJC5zZXRSb3V0ZSA9ICQucm91dGVyLnNldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByb3V0ZXIuaW5pdCA9IF9iaW5kUm91dGVyRXZlbnRzO1xyXG4gICAgcm91dGVyLmluaXQoKTtcclxufShcclxuICAgIHdpbmRvdyxcclxuICAgIHdpbmRvdy5qUXVlcnksXHJcbiAgICB3aW5kb3cuaGlzdG9yeVxyXG4pKTsiXX0=
