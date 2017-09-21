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
 * @version      0.4.1
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
            routeChanged: "routeChanged"
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
    function _triggerRoute(isHashRoute) {
        if (cache.noTrigger) {
            cache.noTrigger = false;
            return;
        }
        $.router.events.trigger(eventNames.routeChanged, { data: cache.data }, isHashRoute);
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
        var data = null,
            title = null,
            sRoute = "",
            qString = "",
            appendQString = false,
            isHashString = false,
            routeMethod = replaceMode ? "replaceState" : "pushState";
        cache.noTrigger = noTrigger;
        if (typeof oRoute === "object") {
            cache.data = data = oRoute.data;
            title = oRoute.title;
            sRoute = oRoute.route;
            qString = oRoute.queryString;
            appendQString = oRoute.appendQuery;
        } else if (typeof oRoute === "string") {
            sRoute = oRoute;
        }
        // Support for hash routes
        if (sRoute.charAt(0) === "#") {
            isHashString = true;
            sRoute = sRoute.replace("#", "");
        }
        if (isHistorySupported && !isHashString) {
            history[routeMethod]({ data: data }, title, _validateRoute(sRoute, qString, appendQString));
            if (!noTrigger) {
                $.router.events.trigger(eventNames.routeChanged, { data: cache.data });
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
        if (regex.routeparams.test(route)) {
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
            return (route === url);
        }
        return false;
    }

    /**
     * Triggers a router event
     * @param {string} eventName 
     * @param {object} params 
     */
    function _routeTrigger(eventName, params, isHashRoute) {
        // Ensures that params is always an object
        params = $.extend(params, {});
        router.handlers.forEach(function (eventObject) {
            if (eventObject.eventName === eventName) {
                if (isHistorySupported && !isHashRoute && _matched(eventObject.route, w.location.pathname, params)) {
                    eventObject.handler(params.data, params.params, _getQueryParams());
                } else {
                    if (!w.location.hash && _matched(eventObject.route, w.location.pathname, params)) {
                        cache.data = params.data;
                        w.location.replace("#" + w.location.pathname); // <-- This will trigger router handler automatically
                    } else if (_matched(eventObject.route, w.location.hash.substring(1), params)) {
                        eventObject.handler(params.data, params.params, _getQueryParams());
                    }
                }
            }
        });
    }

    /**
     * Initializes router events
     */
    function _bindRouterEvents() {
        if (isHistorySupported) {
            $(w).on("popstate", _triggerRoute);
        } else {
            $(w).on("hashchange", function () {
                _triggerRoute.apply(this, [true]);
            });
        }
    }

    if (!$.router) {
        $.router = {
            events: eventNames,
            init: function () {
                $.router.events.trigger(eventNames.routeChanged);
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
        if (!$.setRoute) {
            $.setRoute = function () {
                _setRoute.apply(this, arguments);
            };
        }
        $.router.set = $.setRoute;
    }
    router.init = _bindRouterEvents;
    router.init();
}(
    window,
    window.jQuery,
    window.history
    ));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImpxdWVyeS5yb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogalF1ZXJ5IGRlcGFyYW0gcGx1Z2luXHJcbiAqIENvbnZlcnRzIGEgcXVlcnlzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBkZXBhcmFtIHBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDktMTJcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMS4wXHJcbiAqL1xyXG5cclxuOyAoZnVuY3Rpb24gKHcsICQpIHtcclxuICAgIGlmICghJCkgcmV0dXJuO1xyXG4gICAgaWYgKCEkLmRlcGFyYW0pIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIHF1ZXJ5IHN0cmluZyBpbnRvIEphdmFTY3JpcHQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHFzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5kZXBhcmFtID0gZnVuY3Rpb24gKHFzKSB7XHJcbiAgICAgICAgICAgIGlmICghKHR5cGVvZiBxcyA9PT0gXCJzdHJpbmdcIikpIHJldHVybjtcclxuICAgICAgICAgICAgcXMgPSBkZWNvZGVVUklDb21wb25lbnQocXMpLnJlcGxhY2UoXCI/XCIsIFwiXCIpLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKHFzID09PSBcIlwiKSByZXR1cm4ge307XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVBhcmFtTGlzdCA9IHFzLnNwbGl0KFwiJlwiKSxcclxuICAgICAgICAgICAgICAgIHF1ZXJ5T2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1MaXN0LmZvckVhY2goZnVuY3Rpb24gKHFxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcUFyciA9IHFxLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KHFBcnJbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShxQXJyWzBdLCBxQXJyWzFdLCBxdWVyeU9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgaW5wdXQgaXMgYSBudW1iZXJcclxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpc051bWJlcihrZXkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTigra2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgcXVlcnkgcGFyYW1ldGVyIGtleSBpcyBhIGNvbXBsZXggbm90YXRpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaXNDb21wbGV4KHEpIHtcclxuICAgICAgICByZXR1cm4gKC9cXFsvLnRlc3QocSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGNvbXBsZXggcXVlcnkgcGFyYW1ldGVyc1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9oYW5kbGVDb21wbGV4UXVlcnkoa2V5LCB2YWx1ZSwgb2JqKSB7XHJcbiAgICAgICAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKC8oW15cXFtdKylcXFsoW15cXFtdKilcXF0vKSxcclxuICAgICAgICAgICAgcHJvcCA9IG1hdGNoWzFdLFxyXG4gICAgICAgICAgICBuZXh0UHJvcCA9IG1hdGNoWzJdO1xyXG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcWyhbXlxcW10qKVxcXS8sIFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRPYmogPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoX2lzQ29tcGxleChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3AgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0UHJvcCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teXFxbXSsvLCBuZXh0UHJvcCk7XHJcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgbnVsbCB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcclxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gX2NvbnZlcnRUb09iamVjdChvYmpbcHJvcF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJvYmplY3RcIikgeyAvLyBDaGVjayBpZiBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW29ialtwcm9wXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIGNoaWxkT2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBfY29udmVydFRvT2JqZWN0KG9ialtwcm9wXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIGlmIGFueSBvdGhlciB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbb2JqW3Byb3BdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdLnB1c2goY2hpbGRPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkoW21hdGNoWzFdLCB2YWx1ZV0sIG9iaiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthcnJheX0gcUFyciBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeU9iamVjdCBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udmVydFRvQXJyYXkgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCwgY29udmVydFRvQXJyYXkpIHtcclxuICAgICAgICB2YXIga2V5ID0gcUFyclswXSxcclxuICAgICAgICAgICAgdmFsdWUgPSBfdmFsKHFBcnJbMV0pO1xyXG4gICAgICAgIGlmIChrZXkgaW4gcXVlcnlPYmplY3QpIHtcclxuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IEFycmF5LmlzQXJyYXkocXVlcnlPYmplY3Rba2V5XSkgPyBxdWVyeU9iamVjdFtrZXldIDogW3F1ZXJ5T2JqZWN0W2tleV1dO1xyXG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBjb252ZXJ0VG9BcnJheSA/IFt2YWx1ZV0gOiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0b3JlcyB2YWx1ZXMgdG8gdGhlaXIgb3JpZ2luYWwgdHlwZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCEodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIm51bGxcIikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIk5hTlwiKSByZXR1cm4gTmFOO1xyXG4gICAgICAgIGlmICghaXNOYU4oK3ZhbHVlKSkgcmV0dXJuICt2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbiBhcnJheSB0byBhbiBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFyciBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2NvbnZlcnRUb09iamVjdChhcnIpIHtcclxuICAgICAgICB2YXIgY29udmVydGVkT2JqID0ge307XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xyXG4gICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb252ZXJ0ZWRPYmpbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29udmVydGVkT2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbn0pKHdpbmRvdywgd2luZG93LmpRdWVyeSk7IiwiLyoqXHJcbiAqIGpRdWVyeSByb3V0ZXIgcGx1Z2luXHJcbiAqIFRoaXMgZmlsZSBjb250YWlucyBTUEEgcm91dGVyIG1ldGhvZHMgdG8gaGFuZGxlIHJvdXRpbmcgbWVjaGFuaXNtIGluIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9ucyAoU1BBKS4gU3VwcG9ydGVkIHZlcnNpb25zIElFOSssIENocm9tZSwgU2FmYXJpLCBGaXJlZm94XHJcbiAqXHJcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IFJvdXRpbmcgUGx1Z2luXHJcbiAqIEBkYXRlICAgICAgICAgMjAxNy0wOC0wOFxyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XHJcbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XHJcbiAqIEB2ZXJzaW9uICAgICAgMC40LjFcclxuICovXHJcblxyXG47XHJcbihmdW5jdGlvbiAodywgJCwgaGlzdG9yeSkge1xyXG4gICAgaWYgKCEkIHx8ICEkLmZuKSByZXR1cm47XHJcbiAgICAvLyBPYmplY3QgY29udGFpbmluZyBhIG1hcCBvZiBhdHRhY2hlZCBoYW5kbGVyc1xyXG4gICAgdmFyIHJvdXRlciA9IHtcclxuICAgICAgICBoYW5kbGVyczogW11cclxuICAgIH0sXHJcbiAgICAgICAgLy8gVmFyaWFibGUgdG8gY2hlY2sgaWYgYnJvd3NlciBzdXBwb3J0cyBoaXN0b3J5IEFQSSBwcm9wZXJseSAgICBcclxuICAgICAgICBpc0hpc3RvcnlTdXBwb3J0ZWQgPSBoaXN0b3J5ICYmIGhpc3RvcnkucHVzaFN0YXRlLFxyXG4gICAgICAgIC8vIERhdGEgY2FjaGVcclxuICAgICAgICBjYWNoZSA9IHtcclxuICAgICAgICAgICAgbm9UcmlnZ2VyOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gUmVndWxhciBleHByZXNzaW9uc1xyXG4gICAgICAgIHJlZ2V4ID0ge1xyXG4gICAgICAgICAgICBwYXRobmFtZTogL15cXC8oPz1bXj9dKikvLFxyXG4gICAgICAgICAgICByb3V0ZXBhcmFtczogLzpbXlxcL10rL2dcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFN1cHBvcnRlZCBldmVudHNcclxuICAgICAgICBldmVudE5hbWVzID0ge1xyXG4gICAgICAgICAgICByb3V0ZUNoYW5nZWQ6IFwicm91dGVDaGFuZ2VkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEVycm9yIG1lc3NhZ2VzXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICBpbnZhbGlkUGF0aDogXCJQYXRoIGlzIGludmFsaWRcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbnkgbGlzdCB0byBKYXZhU2NyaXB0IGFycmF5XHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcnIgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9hcnIoYXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyBcInJvdXRlQ2hhbmdlZFwiIGV2ZW50IHVubGVzcyBcIm5vVHJpZ2dlclwiIGZsYWcgaXMgdHJ1ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdHJpZ2dlclJvdXRlKGlzSGFzaFJvdXRlKSB7XHJcbiAgICAgICAgaWYgKGNhY2hlLm5vVHJpZ2dlcikge1xyXG4gICAgICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgeyBkYXRhOiBjYWNoZS5kYXRhIH0sIGlzSGFzaFJvdXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRocm93IEphdmFTY3JpcHQgZXJyb3JzIHdpdGggY3VzdG9tIG1lc3NhZ2VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdGhyb3dFcnJvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIGdpdmVuIHJvdXRlIGlzIHZhbGlkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaXNWYWxpZFJvdXRlKHNSb3V0ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc1JvdXRlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnBhdGhuYW1lLnRlc3Qoc1JvdXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBxdWVyeSBzdHJpbmdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZyBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXFTdHJpbmcgJiYgIWFwcGVuZFFTdHJpbmcpIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBxU3RyaW5nID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGlmICgocVN0cmluZyA9IHFTdHJpbmcudHJpbSgpKSAmJiBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlICsgdy5sb2NhdGlvbi5zZWFyY2ggKyBcIiZcIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIFwiP1wiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBjdXJyZW50IHF1ZXJ5IHN0cmluZyBpbnRvIGFuIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlQYXJhbXMoKSB7XHJcbiAgICAgICAgdmFyIHFzT2JqZWN0ID0gJC5kZXBhcmFtKHcubG9jYXRpb24uc2VhcmNoKSxcclxuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9IHt9O1xyXG4gICAgICAgIGlmICh3LmxvY2F0aW9uLmhhc2gubWF0Y2goL1xcPy4rLykpIHtcclxuICAgICAgICAgICAgaGFzaFN0cmluZ1BhcmFtcyA9ICQuZGVwYXJhbSh3LmxvY2F0aW9uLmhhc2gubWF0Y2goL1xcPy4rLylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJC5leHRlbmQocXNPYmplY3QsIGhhc2hTdHJpbmdQYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHJvdXRlIGlzIHZhbGlkIGFuZCByZXR1cm5zIHRoZSB2YWxpZCByb3V0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmdcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICBpZiAoX2lzVmFsaWRSb3V0ZShzUm91dGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3Rocm93RXJyb3IoZXJyb3JNZXNzYWdlLmludmFsaWRQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgcm91dGUgZm9yIGdpdmVuIHZpZXdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZSBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2V0Um91dGUob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgaWYgKCFvUm91dGUpIHJldHVybjtcclxuICAgICAgICB2YXIgZGF0YSA9IG51bGwsXHJcbiAgICAgICAgICAgIHRpdGxlID0gbnVsbCxcclxuICAgICAgICAgICAgc1JvdXRlID0gXCJcIixcclxuICAgICAgICAgICAgcVN0cmluZyA9IFwiXCIsXHJcbiAgICAgICAgICAgIGFwcGVuZFFTdHJpbmcgPSBmYWxzZSxcclxuICAgICAgICAgICAgaXNIYXNoU3RyaW5nID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHJvdXRlTWV0aG9kID0gcmVwbGFjZU1vZGUgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIjtcclxuICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBub1RyaWdnZXI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IGRhdGEgPSBvUm91dGUuZGF0YTtcclxuICAgICAgICAgICAgdGl0bGUgPSBvUm91dGUudGl0bGU7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZS5yb3V0ZTtcclxuICAgICAgICAgICAgcVN0cmluZyA9IG9Sb3V0ZS5xdWVyeVN0cmluZztcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IG9Sb3V0ZS5hcHBlbmRRdWVyeTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTdXBwb3J0IGZvciBoYXNoIHJvdXRlc1xyXG4gICAgICAgIGlmIChzUm91dGUuY2hhckF0KDApID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICBpc0hhc2hTdHJpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBzUm91dGUgPSBzUm91dGUucmVwbGFjZShcIiNcIiwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgIWlzSGFzaFN0cmluZykge1xyXG4gICAgICAgICAgICBoaXN0b3J5W3JvdXRlTWV0aG9kXSh7IGRhdGE6IGRhdGEgfSwgdGl0bGUsIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xyXG4gICAgICAgICAgICBpZiAoIW5vVHJpZ2dlcikge1xyXG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsIHsgZGF0YTogY2FjaGUuZGF0YSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyZXBsYWNlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLmhhc2ggPSBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgYSByb3V0ZSBoYW5kbGVyIGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yb3V0ZShzUm91dGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLnB1c2goe1xyXG4gICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiBjYWxsYmFjay5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLFxyXG4gICAgICAgICAgICByb3V0ZTogc1JvdXRlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpbXMgbGVhZGluZy90cmFpbGluZyBzcGVjaWFsIGNoYXJhY3RlcnNcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Nhbml0aXplKHN0cikge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXihbXmEtekEtWjAtOV0rKXwoW15hLXpBLVowLTldKykkL2csIFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcGFyZXMgcm91dGUgd2l0aCBjdXJyZW50IFVSTFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9tYXRjaGVkKHJvdXRlLCB1cmwsIHBhcmFtcykge1xyXG4gICAgICAgIGlmIChyZWdleC5yb3V0ZXBhcmFtcy50ZXN0KHJvdXRlKSkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aFJlZ2V4ID0gbmV3IFJlZ0V4cChyb3V0ZS5yZXBsYWNlKC9cXC8vZywgXCJcXFxcL1wiKS5yZXBsYWNlKC86W15cXC9cXFxcXSsvZywgXCIoW15cXFxcL10rKVwiKSk7XHJcbiAgICAgICAgICAgIGlmIChwYXRoUmVnZXgudGVzdCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IF9hcnIocm91dGUubWF0Y2gocmVnZXgucm91dGVwYXJhbXMpKS5tYXAoX3Nhbml0aXplKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSBfYXJyKHVybC5tYXRjaChwYXRoUmVnZXgpKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnBhcmFtc1trZXldID0gdmFsdWVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gKHJvdXRlID09PSB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyBhIHJvdXRlciBldmVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yb3V0ZVRyaWdnZXIoZXZlbnROYW1lLCBwYXJhbXMsIGlzSGFzaFJvdXRlKSB7XHJcbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHBhcmFtcyBpcyBhbHdheXMgYW4gb2JqZWN0XHJcbiAgICAgICAgcGFyYW1zID0gJC5leHRlbmQocGFyYW1zLCB7fSk7XHJcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudE9iamVjdC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiAhaXNIYXNoUm91dGUgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdy5sb2NhdGlvbi5oYXNoICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEgPSBwYXJhbXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgdy5sb2NhdGlvbi5wYXRobmFtZSk7IC8vIDwtLSBUaGlzIHdpbGwgdHJpZ2dlciByb3V0ZXIgaGFuZGxlciBhdXRvbWF0aWNhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyByb3V0ZXIgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9iaW5kUm91dGVyRXZlbnRzKCkge1xyXG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgJCh3KS5vbihcInBvcHN0YXRlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodykub24oXCJoYXNoY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90cmlnZ2VyUm91dGUuYXBwbHkodGhpcywgW3RydWVdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghJC5yb3V0ZXIpIHtcclxuICAgICAgICAkLnJvdXRlciA9IHtcclxuICAgICAgICAgICAgZXZlbnRzOiBldmVudE5hbWVzLFxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpc3RvcnlTdXBwb3J0ZWQ6IGlzSGlzdG9yeVN1cHBvcnRlZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgX3JvdXRlVHJpZ2dlci5hcHBseSh0aGlzLCBbZXZlbnROYW1lLCBwYXJhbXNdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghJC5mbi5yb3V0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcm91dGUgPSAkLmZuLnJvdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3JvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICghJC5yb3V0ZSkge1xyXG4gICAgICAgICAgICAgICAgJC5yb3V0ZSA9IHJvdXRlLmJpbmQobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEkLnNldFJvdXRlKSB7XHJcbiAgICAgICAgICAgICQuc2V0Um91dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfc2V0Um91dGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5yb3V0ZXIuc2V0ID0gJC5zZXRSb3V0ZTtcclxuICAgIH1cclxuICAgIHJvdXRlci5pbml0ID0gX2JpbmRSb3V0ZXJFdmVudHM7XHJcbiAgICByb3V0ZXIuaW5pdCgpO1xyXG59KFxyXG4gICAgd2luZG93LFxyXG4gICAgd2luZG93LmpRdWVyeSxcclxuICAgIHdpbmRvdy5oaXN0b3J5XHJcbiAgICApKTtcclxuIl19
