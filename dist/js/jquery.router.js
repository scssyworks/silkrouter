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
                        childObj = {};
                        obj[prop].push(childObj);
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
                            childObj = {};
                            childObj[nextProp] = _val(value);
                            obj[prop].push(childObj);
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
})(window, window.jQuery);
/**
 * jQuery router plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
 *
 * @project      Jquery Routing Plugin
 * @date         2017-08-08
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery
 * @version      0.3.0
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
            pathname: /^\/(?=[^?]+)/,
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
    function _triggerRoute() {
        if (cache.noTrigger) {
            cache.noTrigger = false;
            return;
        }
        $.router.events.trigger(eventNames.routeChanged, { data: cache.data });
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
        var data = null,
            title = null,
            sRoute = "",
            qString = "",
            appendQString = false,
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
        if (isHistorySupported) {
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
    function _routeTrigger(eventName, params) {
        // Ensures that params is always an object
        params = $.extend(params, {});
        router.handlers.forEach(function (eventObject) {
            if (eventObject.eventName === eventName) {
                if (isHistorySupported && _matched(eventObject.route, w.location.pathname, params)) {
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
            $(w).on("hashchange", _triggerRoute);
        }
    }

    if (!$.router) {
        // jQuery router object
        $.router = {
            events: eventNames,
            init: function () {
                $.router.events.trigger(eventNames.routeChanged);
            },
            historySupported: isHistorySupported
        };
        /**
         * Triggers event for jQuery router
         * @param {string} eventName
         * @param {object} params
         */
        $.router.events.trigger = function (eventName, params) {
            _routeTrigger.apply(this, [eventName, params]);
        };
    }
    if (!$.fn.route) {
        /**
         * Adds a handler function for given route
         * @param {string} sRoute
         * @param {function} callback
         */
        var route = $.fn.route = function (sRoute, callback) {
            _route.apply(this, [sRoute, callback]);
        };
        if (!$.route) {
            $.route = route.bind(null);
        }
    }
    if (!$.setRoute) {
        /**
         * Changes current page route
         * @param {string|object} oRoute
         * @param {boolean} replaceMode
         * @param {boolean} noTrigger
         */
        $.setRoute = function (oRoute, replaceMode, noTrigger) {
            _setRoute.apply(this, [oRoute, replaceMode, noTrigger]);
        };
    }
    /**
     * Router internal init method
     */
    router.init = _bindRouterEvents;
    router.init();
}(
    window,
    window.jQuery,
    window.history
    ));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImpxdWVyeS5yb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogalF1ZXJ5IGRlcGFyYW0gcGx1Z2luXHJcbiAqIENvbnZlcnRzIGEgcXVlcnlzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBkZXBhcmFtIHBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDktMTJcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMS4wXHJcbiAqL1xyXG5cclxuOyAoZnVuY3Rpb24gKHcsICQpIHtcclxuICAgIGlmICghJCkgcmV0dXJuO1xyXG4gICAgaWYgKCEkLmRlcGFyYW0pIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIHF1ZXJ5IHN0cmluZyBpbnRvIEphdmFTY3JpcHQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHFzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5kZXBhcmFtID0gZnVuY3Rpb24gKHFzKSB7XHJcbiAgICAgICAgICAgIGlmICghKHR5cGVvZiBxcyA9PT0gXCJzdHJpbmdcIikpIHJldHVybjtcclxuICAgICAgICAgICAgcXMgPSBkZWNvZGVVUklDb21wb25lbnQocXMpLnJlcGxhY2UoXCI/XCIsIFwiXCIpLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKHFzID09PSBcIlwiKSByZXR1cm4ge307XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVBhcmFtTGlzdCA9IHFzLnNwbGl0KFwiJlwiKSxcclxuICAgICAgICAgICAgICAgIHF1ZXJ5T2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1MaXN0LmZvckVhY2goZnVuY3Rpb24gKHFxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcUFyciA9IHFxLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KHFBcnJbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShxQXJyWzBdLCBxQXJyWzFdLCBxdWVyeU9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgaW5wdXQgaXMgYSBudW1iZXJcclxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpc051bWJlcihrZXkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTigra2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgcXVlcnkgcGFyYW1ldGVyIGtleSBpcyBhIGNvbXBsZXggbm90YXRpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaXNDb21wbGV4KHEpIHtcclxuICAgICAgICByZXR1cm4gKC9cXFsvLnRlc3QocSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGVzIGNvbXBsZXggcXVlcnkgcGFyYW1ldGVyc1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9oYW5kbGVDb21wbGV4UXVlcnkoa2V5LCB2YWx1ZSwgb2JqKSB7XHJcbiAgICAgICAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKC8oW15cXFtdKylcXFsoW15cXFtdKilcXF0vKSxcclxuICAgICAgICAgICAgcHJvcCA9IG1hdGNoWzFdLFxyXG4gICAgICAgICAgICBuZXh0UHJvcCA9IG1hdGNoWzJdO1xyXG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcWyhbXlxcW10qKVxcXS8sIFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRPYmogPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoX2lzQ29tcGxleChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3AgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0UHJvcCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teXFxbXSsvLCBuZXh0UHJvcCk7XHJcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgbnVsbCB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcclxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXS5wdXNoKGNoaWxkT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShrZXksIHZhbHVlLCBjaGlsZE9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIG9ialtwcm9wXSA9IFtudWxsXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdLnB1c2goY2hpbGRPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcIm9iamVjdFwiKSB7IC8vIENoZWNrIGlmIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIENoZWNrIGlmIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayBpZiBhbnkgb3RoZXIgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gW29ialtwcm9wXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9ialtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXS5wdXNoKGNoaWxkT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZVNpbXBsZVF1ZXJ5KFttYXRjaFsxXSwgdmFsdWVdLCBvYmosIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHFBcnIgXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlPYmplY3QgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbnZlcnRUb0FycmF5IFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaGFuZGxlU2ltcGxlUXVlcnkocUFyciwgcXVlcnlPYmplY3QsIGNvbnZlcnRUb0FycmF5KSB7XHJcbiAgICAgICAgdmFyIGtleSA9IHFBcnJbMF0sXHJcbiAgICAgICAgICAgIHZhbHVlID0gX3ZhbChxQXJyWzFdKTtcclxuICAgICAgICBpZiAoa2V5IGluIHF1ZXJ5T2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBBcnJheS5pc0FycmF5KHF1ZXJ5T2JqZWN0W2tleV0pID8gcXVlcnlPYmplY3Rba2V5XSA6IFtxdWVyeU9iamVjdFtrZXldXTtcclxuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldID0gY29udmVydFRvQXJyYXkgPyBbdmFsdWVdIDogdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdG9yZXMgdmFsdWVzIHRvIHRoZWlyIG9yaWdpbmFsIHR5cGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3ZhbCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJudWxsXCIpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJOYU5cIikgcmV0dXJuIE5hTjtcclxuICAgICAgICBpZiAoIWlzTmFOKCt2YWx1ZSkpIHJldHVybiArdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmYWxzZVwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG59KSh3aW5kb3csIHdpbmRvdy5qUXVlcnkpOyIsIi8qKlxyXG4gKiBqUXVlcnkgcm91dGVyIHBsdWdpblxyXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgU1BBIHJvdXRlciBtZXRob2RzIHRvIGhhbmRsZSByb3V0aW5nIG1lY2hhbmlzbSBpbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbnMgKFNQQSkuIFN1cHBvcnRlZCB2ZXJzaW9ucyBJRTkrLCBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBSb3V0aW5nIFBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDgtMDhcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMy4wXHJcbiAqL1xyXG5cclxuO1xyXG4oZnVuY3Rpb24gKHcsICQsIGhpc3RvcnkpIHtcclxuICAgIGlmICghJCB8fCAhJC5mbikgcmV0dXJuO1xyXG4gICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgYSBtYXAgb2YgYXR0YWNoZWQgaGFuZGxlcnNcclxuICAgIHZhciByb3V0ZXIgPSB7XHJcbiAgICAgICAgaGFuZGxlcnM6IFtdXHJcbiAgICB9LFxyXG4gICAgICAgIC8vIFZhcmlhYmxlIHRvIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkgcHJvcGVybHkgICAgXHJcbiAgICAgICAgaXNIaXN0b3J5U3VwcG9ydGVkID0gaGlzdG9yeSAmJiBoaXN0b3J5LnB1c2hTdGF0ZSxcclxuICAgICAgICAvLyBEYXRhIGNhY2hlXHJcbiAgICAgICAgY2FjaGUgPSB7XHJcbiAgICAgICAgICAgIG5vVHJpZ2dlcjogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcclxuICAgICAgICByZWdleCA9IHtcclxuICAgICAgICAgICAgcGF0aG5hbWU6IC9eXFwvKD89W14/XSspLyxcclxuICAgICAgICAgICAgcm91dGVwYXJhbXM6IC86W15cXC9dKy9nXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTdXBwb3J0ZWQgZXZlbnRzXHJcbiAgICAgICAgZXZlbnROYW1lcyA9IHtcclxuICAgICAgICAgICAgcm91dGVDaGFuZ2VkOiBcInJvdXRlQ2hhbmdlZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlc1xyXG4gICAgICAgIGVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgaW52YWxpZFBhdGg6IFwiUGF0aCBpcyBpbnZhbGlkXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYW55IGxpc3QgdG8gSmF2YVNjcmlwdCBhcnJheVxyXG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYXJyKGFycikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZ2dlcnMgXCJyb3V0ZUNoYW5nZWRcIiBldmVudCB1bmxlc3MgXCJub1RyaWdnZXJcIiBmbGFnIGlzIHRydWVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3RyaWdnZXJSb3V0ZSgpIHtcclxuICAgICAgICBpZiAoY2FjaGUubm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7IGRhdGE6IGNhY2hlLmRhdGEgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaHJvdyBKYXZhU2NyaXB0IGVycm9ycyB3aXRoIGN1c3RvbSBtZXNzYWdlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Rocm93RXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBnaXZlbiByb3V0ZSBpcyB2YWxpZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRSb3V0ZShzUm91dGUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNSb3V0ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiByZWdleC5wYXRobmFtZS50ZXN0KHNSb3V0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgcXVlcnkgc3RyaW5nXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmcgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmcgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFxU3RyaW5nICYmICFhcHBlbmRRU3RyaW5nKSByZXR1cm4gc1JvdXRlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcVN0cmluZyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBpZiAoKHFTdHJpbmcgPSBxU3RyaW5nLnRyaW0oKSkgJiYgYXBwZW5kUVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIHcubG9jYXRpb24uc2VhcmNoICsgXCImXCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHFTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGUgKyBcIj9cIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgY3VycmVudCBxdWVyeSBzdHJpbmcgaW50byBhbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5UGFyYW1zKCkge1xyXG4gICAgICAgIHZhciBxc09iamVjdCA9ICQuZGVwYXJhbSh3LmxvY2F0aW9uLnNlYXJjaCksXHJcbiAgICAgICAgICAgIGhhc2hTdHJpbmdQYXJhbXMgPSB7fTtcclxuICAgICAgICBpZiAody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pKSB7XHJcbiAgICAgICAgICAgIGhhc2hTdHJpbmdQYXJhbXMgPSAkLmRlcGFyYW0ody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHFzT2JqZWN0LCBoYXNoU3RyaW5nUGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiByb3V0ZSBpcyB2YWxpZCBhbmQgcmV0dXJucyB0aGUgdmFsaWQgcm91dGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxU3RyaW5nXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmdcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKF9pc1ZhbGlkUm91dGUoc1JvdXRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF90aHJvd0Vycm9yKGVycm9yTWVzc2FnZS5pbnZhbGlkUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHJvdXRlIGZvciBnaXZlbiB2aWV3XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG9Sb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVwbGFjZU1vZGUgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpZ2dlciBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3NldFJvdXRlKG9Sb3V0ZSwgcmVwbGFjZU1vZGUsIG5vVHJpZ2dlcikge1xyXG4gICAgICAgIHZhciBkYXRhID0gbnVsbCxcclxuICAgICAgICAgICAgdGl0bGUgPSBudWxsLFxyXG4gICAgICAgICAgICBzUm91dGUgPSBcIlwiLFxyXG4gICAgICAgICAgICBxU3RyaW5nID0gXCJcIixcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IGZhbHNlLFxyXG4gICAgICAgICAgICByb3V0ZU1ldGhvZCA9IHJlcGxhY2VNb2RlID8gXCJyZXBsYWNlU3RhdGVcIiA6IFwicHVzaFN0YXRlXCI7XHJcbiAgICAgICAgY2FjaGUubm9UcmlnZ2VyID0gbm9UcmlnZ2VyO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb1JvdXRlID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIGNhY2hlLmRhdGEgPSBkYXRhID0gb1JvdXRlLmRhdGE7XHJcbiAgICAgICAgICAgIHRpdGxlID0gb1JvdXRlLnRpdGxlO1xyXG4gICAgICAgICAgICBzUm91dGUgPSBvUm91dGUucm91dGU7XHJcbiAgICAgICAgICAgIHFTdHJpbmcgPSBvUm91dGUucXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgIGFwcGVuZFFTdHJpbmcgPSBvUm91dGUuYXBwZW5kUXVlcnk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb1JvdXRlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCkge1xyXG4gICAgICAgICAgICBoaXN0b3J5W3JvdXRlTWV0aG9kXSh7IGRhdGE6IGRhdGEgfSwgdGl0bGUsIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xyXG4gICAgICAgICAgICBpZiAoIW5vVHJpZ2dlcikge1xyXG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsIHsgZGF0YTogY2FjaGUuZGF0YSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyZXBsYWNlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLmhhc2ggPSBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgYSByb3V0ZSBoYW5kbGVyIGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yb3V0ZShzUm91dGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLnB1c2goe1xyXG4gICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiBjYWxsYmFjay5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLFxyXG4gICAgICAgICAgICByb3V0ZTogc1JvdXRlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpbXMgbGVhZGluZy90cmFpbGluZyBzcGVjaWFsIGNoYXJhY3RlcnNcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Nhbml0aXplKHN0cikge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXihbXmEtekEtWjAtOV0rKXwoW15hLXpBLVowLTldKykkL2csIFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcGFyZXMgcm91dGUgd2l0aCBjdXJyZW50IFVSTFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9tYXRjaGVkKHJvdXRlLCB1cmwsIHBhcmFtcykge1xyXG4gICAgICAgIGlmIChyZWdleC5yb3V0ZXBhcmFtcy50ZXN0KHJvdXRlKSkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aFJlZ2V4ID0gbmV3IFJlZ0V4cChyb3V0ZS5yZXBsYWNlKC9cXC8vZywgXCJcXFxcL1wiKS5yZXBsYWNlKC86W15cXC9cXFxcXSsvZywgXCIoW15cXFxcL10rKVwiKSk7XHJcbiAgICAgICAgICAgIGlmIChwYXRoUmVnZXgudGVzdCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IF9hcnIocm91dGUubWF0Y2gocmVnZXgucm91dGVwYXJhbXMpKS5tYXAoX3Nhbml0aXplKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSBfYXJyKHVybC5tYXRjaChwYXRoUmVnZXgpKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnBhcmFtc1trZXldID0gdmFsdWVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gKHJvdXRlID09PSB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyBhIHJvdXRlciBldmVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yb3V0ZVRyaWdnZXIoZXZlbnROYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgcGFyYW1zIGlzIGFsd2F5cyBhbiBvYmplY3RcclxuICAgICAgICBwYXJhbXMgPSAkLmV4dGVuZChwYXJhbXMsIHt9KTtcclxuICAgICAgICByb3V0ZXIuaGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRPYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50T2JqZWN0LmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRPYmplY3QuaGFuZGxlcihwYXJhbXMuZGF0YSwgcGFyYW1zLnBhcmFtcywgX2dldFF1ZXJ5UGFyYW1zKCkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXcubG9jYXRpb24uaGFzaCAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kYXRhID0gcGFyYW1zLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIHcubG9jYXRpb24ucGF0aG5hbWUpOyAvLyA8LS0gVGhpcyB3aWxsIHRyaWdnZXIgcm91dGVyIGhhbmRsZXIgYXV0b21hdGljYWxseVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSksIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRPYmplY3QuaGFuZGxlcihwYXJhbXMuZGF0YSwgcGFyYW1zLnBhcmFtcywgX2dldFF1ZXJ5UGFyYW1zKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgcm91dGVyIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYmluZFJvdXRlckV2ZW50cygpIHtcclxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgICQodykub24oXCJwb3BzdGF0ZVwiLCBfdHJpZ2dlclJvdXRlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKHcpLm9uKFwiaGFzaGNoYW5nZVwiLCBfdHJpZ2dlclJvdXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEkLnJvdXRlcikge1xyXG4gICAgICAgIC8vIGpRdWVyeSByb3V0ZXIgb2JqZWN0XHJcbiAgICAgICAgJC5yb3V0ZXIgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnROYW1lcyxcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaXN0b3J5U3VwcG9ydGVkOiBpc0hpc3RvcnlTdXBwb3J0ZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRyaWdnZXJzIGV2ZW50IGZvciBqUXVlcnkgcm91dGVyXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgKi9cclxuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICBfcm91dGVUcmlnZ2VyLmFwcGx5KHRoaXMsIFtldmVudE5hbWUsIHBhcmFtc10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBpZiAoISQuZm4ucm91dGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGRzIGEgaGFuZGxlciBmdW5jdGlvbiBmb3IgZ2l2ZW4gcm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgcm91dGUgPSAkLmZuLnJvdXRlID0gZnVuY3Rpb24gKHNSb3V0ZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgX3JvdXRlLmFwcGx5KHRoaXMsIFtzUm91dGUsIGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoISQucm91dGUpIHtcclxuICAgICAgICAgICAgJC5yb3V0ZSA9IHJvdXRlLmJpbmQobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCEkLnNldFJvdXRlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2hhbmdlcyBjdXJyZW50IHBhZ2Ugcm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG9Sb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVwbGFjZU1vZGVcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpZ2dlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQuc2V0Um91dGUgPSBmdW5jdGlvbiAob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIF9zZXRSb3V0ZS5hcHBseSh0aGlzLCBbb1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUm91dGVyIGludGVybmFsIGluaXQgbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIHJvdXRlci5pbml0ID0gX2JpbmRSb3V0ZXJFdmVudHM7XHJcbiAgICByb3V0ZXIuaW5pdCgpO1xyXG59KFxyXG4gICAgd2luZG93LFxyXG4gICAgd2luZG93LmpRdWVyeSxcclxuICAgIHdpbmRvdy5oaXN0b3J5XHJcbiAgICApKTtcclxuIl19
