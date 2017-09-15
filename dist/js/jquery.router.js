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
        return $.deparam(w.location.search);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoianF1ZXJ5LnJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBqUXVlcnkgZGVwYXJhbSBwbHVnaW5cclxuICogQ29udmVydHMgYSBxdWVyeXN0cmluZyB0byBhIEphdmFTY3JpcHQgb2JqZWN0XHJcbiAqXHJcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IGRlcGFyYW0gcGx1Z2luXHJcbiAqIEBkYXRlICAgICAgICAgMjAxNy0wOS0xMlxyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XHJcbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XHJcbiAqIEB2ZXJzaW9uICAgICAgMC4xLjBcclxuICovXHJcblxyXG47IChmdW5jdGlvbiAodywgJCkge1xyXG4gICAgaWYgKCEkKSByZXR1cm47XHJcbiAgICBpZiAoISQuZGVwYXJhbSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGEgcXVlcnkgc3RyaW5nIGludG8gSmF2YVNjcmlwdCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcXNcclxuICAgICAgICAgKi9cclxuICAgICAgICAkLmRlcGFyYW0gPSBmdW5jdGlvbiAocXMpIHtcclxuICAgICAgICAgICAgaWYgKCEodHlwZW9mIHFzID09PSBcInN0cmluZ1wiKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxcykucmVwbGFjZShcIj9cIiwgXCJcIikudHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAocXMgPT09IFwiXCIpIHJldHVybiB7fTtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5UGFyYW1MaXN0ID0gcXMuc3BsaXQoXCImXCIpLFxyXG4gICAgICAgICAgICAgICAgcXVlcnlPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgcXVlcnlQYXJhbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAocXEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxQXJyID0gcXEuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9pc0NvbXBsZXgocUFyclswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KHFBcnJbMF0sIHFBcnJbMV0sIHF1ZXJ5T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZVNpbXBsZVF1ZXJ5KHFBcnIsIHF1ZXJ5T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeU9iamVjdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBpbnB1dCBpcyBhIG51bWJlclxyXG4gICAgICogQHBhcmFtIHsqfSBrZXkgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGtleSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcIm51bWJlclwiKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKCtrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBxdWVyeSBwYXJhbWV0ZXIga2V5IGlzIGEgY29tcGxleCBub3RhdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHEgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9pc0NvbXBsZXgocSkge1xyXG4gICAgICAgIHJldHVybiAoL1xcWy8udGVzdChxKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgY29tcGxleCBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2hhbmRsZUNvbXBsZXhRdWVyeShrZXksIHZhbHVlLCBvYmopIHtcclxuICAgICAgICB2YXIgbWF0Y2ggPSBrZXkubWF0Y2goLyhbXlxcW10rKVxcWyhbXlxcW10qKVxcXS8pLFxyXG4gICAgICAgICAgICBwcm9wID0gbWF0Y2hbMV0sXHJcbiAgICAgICAgICAgIG5leHRQcm9wID0gbWF0Y2hbMl07XHJcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA9PT0gMykge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFxbKFteXFxbXSopXFxdLywgXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZE9iaiA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRQcm9wID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW15cXFtdKy8sIG5leHRQcm9wKTtcclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBudWxsIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSBvYmpbcHJvcF0gPSBbbnVsbF07XHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhcnJheVxyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdLnB1c2goY2hpbGRPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJvYmplY3RcIikgeyAvLyBDaGVjayBpZiBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0gW29ialtwcm9wXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIGNoaWxkT2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gbnVsbCkgb2JqW3Byb3BdID0gW251bGxdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmpbbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0ucHVzaChjaGlsZE9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIGlmIGFueSBvdGhlciB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbb2JqW3Byb3BdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdLnB1c2goY2hpbGRPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkoW21hdGNoWzFdLCB2YWx1ZV0sIG9iaiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthcnJheX0gcUFyciBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeU9iamVjdCBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udmVydFRvQXJyYXkgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9oYW5kbGVTaW1wbGVRdWVyeShxQXJyLCBxdWVyeU9iamVjdCwgY29udmVydFRvQXJyYXkpIHtcclxuICAgICAgICB2YXIga2V5ID0gcUFyclswXSxcclxuICAgICAgICAgICAgdmFsdWUgPSBfdmFsKHFBcnJbMV0pO1xyXG4gICAgICAgIGlmIChrZXkgaW4gcXVlcnlPYmplY3QpIHtcclxuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IEFycmF5LmlzQXJyYXkocXVlcnlPYmplY3Rba2V5XSkgPyBxdWVyeU9iamVjdFtrZXldIDogW3F1ZXJ5T2JqZWN0W2tleV1dO1xyXG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBjb252ZXJ0VG9BcnJheSA/IFt2YWx1ZV0gOiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0b3JlcyB2YWx1ZXMgdG8gdGhlaXIgb3JpZ2luYWwgdHlwZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCEodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIm51bGxcIikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIk5hTlwiKSByZXR1cm4gTmFOO1xyXG4gICAgICAgIGlmICghaXNOYU4oK3ZhbHVlKSkgcmV0dXJuICt2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcImZhbHNlXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcbn0pKHdpbmRvdywgd2luZG93LmpRdWVyeSk7IiwiLyoqXHJcbiAqIGpRdWVyeSByb3V0ZXIgcGx1Z2luXHJcbiAqIFRoaXMgZmlsZSBjb250YWlucyBTUEEgcm91dGVyIG1ldGhvZHMgdG8gaGFuZGxlIHJvdXRpbmcgbWVjaGFuaXNtIGluIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9ucyAoU1BBKS4gU3VwcG9ydGVkIHZlcnNpb25zIElFOSssIENocm9tZSwgU2FmYXJpLCBGaXJlZm94XHJcbiAqXHJcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IFJvdXRpbmcgUGx1Z2luXHJcbiAqIEBkYXRlICAgICAgICAgMjAxNy0wOC0wOFxyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XHJcbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XHJcbiAqIEB2ZXJzaW9uICAgICAgMC4zLjBcclxuICovXHJcblxyXG47XHJcbihmdW5jdGlvbiAodywgJCwgaGlzdG9yeSkge1xyXG4gICAgaWYgKCEkIHx8ICEkLmZuKSByZXR1cm47XHJcbiAgICAvLyBPYmplY3QgY29udGFpbmluZyBhIG1hcCBvZiBhdHRhY2hlZCBoYW5kbGVyc1xyXG4gICAgdmFyIHJvdXRlciA9IHtcclxuICAgICAgICBoYW5kbGVyczogW11cclxuICAgIH0sXHJcbiAgICAgICAgLy8gVmFyaWFibGUgdG8gY2hlY2sgaWYgYnJvd3NlciBzdXBwb3J0cyBoaXN0b3J5IEFQSSBwcm9wZXJseSAgICBcclxuICAgICAgICBpc0hpc3RvcnlTdXBwb3J0ZWQgPSBoaXN0b3J5ICYmIGhpc3RvcnkucHVzaFN0YXRlLFxyXG4gICAgICAgIC8vIERhdGEgY2FjaGVcclxuICAgICAgICBjYWNoZSA9IHtcclxuICAgICAgICAgICAgbm9UcmlnZ2VyOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gUmVndWxhciBleHByZXNzaW9uc1xyXG4gICAgICAgIHJlZ2V4ID0ge1xyXG4gICAgICAgICAgICBwYXRobmFtZTogL15cXC8oPz1bXj9dKykvLFxyXG4gICAgICAgICAgICByb3V0ZXBhcmFtczogLzpbXlxcL10rL2dcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFN1cHBvcnRlZCBldmVudHNcclxuICAgICAgICBldmVudE5hbWVzID0ge1xyXG4gICAgICAgICAgICByb3V0ZUNoYW5nZWQ6IFwicm91dGVDaGFuZ2VkXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEVycm9yIG1lc3NhZ2VzXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICBpbnZhbGlkUGF0aDogXCJQYXRoIGlzIGludmFsaWRcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbnkgbGlzdCB0byBKYXZhU2NyaXB0IGFycmF5XHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcnIgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9hcnIoYXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyBcInJvdXRlQ2hhbmdlZFwiIGV2ZW50IHVubGVzcyBcIm5vVHJpZ2dlclwiIGZsYWcgaXMgdHJ1ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdHJpZ2dlclJvdXRlKCkge1xyXG4gICAgICAgIGlmIChjYWNoZS5ub1RyaWdnZXIpIHtcclxuICAgICAgICAgICAgY2FjaGUubm9UcmlnZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsIHsgZGF0YTogY2FjaGUuZGF0YSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRocm93IEphdmFTY3JpcHQgZXJyb3JzIHdpdGggY3VzdG9tIG1lc3NhZ2VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdGhyb3dFcnJvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIGdpdmVuIHJvdXRlIGlzIHZhbGlkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaXNWYWxpZFJvdXRlKHNSb3V0ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc1JvdXRlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnBhdGhuYW1lLnRlc3Qoc1JvdXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBxdWVyeSBzdHJpbmdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZyBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXFTdHJpbmcgJiYgIWFwcGVuZFFTdHJpbmcpIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBxU3RyaW5nID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGlmICgocVN0cmluZyA9IHFTdHJpbmcudHJpbSgpKSAmJiBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlICsgdy5sb2NhdGlvbi5zZWFyY2ggKyBcIiZcIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIFwiP1wiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBjdXJyZW50IHF1ZXJ5IHN0cmluZyBpbnRvIGFuIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlQYXJhbXMoKSB7XHJcbiAgICAgICAgcmV0dXJuICQuZGVwYXJhbSh3LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgcm91dGUgaXMgdmFsaWQgYW5kIHJldHVybnMgdGhlIHZhbGlkIHJvdXRlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZ1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhcHBlbmRRU3RyaW5nXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykge1xyXG4gICAgICAgIGlmIChfaXNWYWxpZFJvdXRlKHNSb3V0ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UuaW52YWxpZFBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCByb3V0ZSBmb3IgZ2l2ZW4gdmlld1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBvUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlcGxhY2VNb2RlIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaWdnZXIgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9zZXRSb3V0ZShvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXIpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IG51bGwsXHJcbiAgICAgICAgICAgIHRpdGxlID0gbnVsbCxcclxuICAgICAgICAgICAgc1JvdXRlID0gXCJcIixcclxuICAgICAgICAgICAgcVN0cmluZyA9IFwiXCIsXHJcbiAgICAgICAgICAgIGFwcGVuZFFTdHJpbmcgPSBmYWxzZSxcclxuICAgICAgICAgICAgcm91dGVNZXRob2QgPSByZXBsYWNlTW9kZSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiO1xyXG4gICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IG5vVHJpZ2dlcjtcclxuICAgICAgICBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICBjYWNoZS5kYXRhID0gZGF0YSA9IG9Sb3V0ZS5kYXRhO1xyXG4gICAgICAgICAgICB0aXRsZSA9IG9Sb3V0ZS50aXRsZTtcclxuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlLnJvdXRlO1xyXG4gICAgICAgICAgICBxU3RyaW5nID0gb1JvdXRlLnF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gb1JvdXRlLmFwcGVuZFF1ZXJ5O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBzUm91dGUgPSBvUm91dGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgaGlzdG9yeVtyb3V0ZU1ldGhvZF0oeyBkYXRhOiBkYXRhIH0sIHRpdGxlLCBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpKTtcclxuICAgICAgICAgICAgaWYgKCFub1RyaWdnZXIpIHtcclxuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7IGRhdGE6IGNhY2hlLmRhdGEgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmVwbGFjZU1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5oYXNoID0gX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIGEgcm91dGUgaGFuZGxlciBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfcm91dGUoc1JvdXRlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5wdXNoKHtcclxuICAgICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCxcclxuICAgICAgICAgICAgaGFuZGxlcjogY2FsbGJhY2suYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgZWxlbWVudDogdGhpcyxcclxuICAgICAgICAgICAgcm91dGU6IHNSb3V0ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaW1zIGxlYWRpbmcvdHJhaWxpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW0gXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9zYW5pdGl6ZShzdHIpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL14oW15hLXpBLVowLTldKyl8KFteYS16QS1aMC05XSspJC9nLCBcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXBhcmVzIHJvdXRlIHdpdGggY3VycmVudCBVUkxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfbWF0Y2hlZChyb3V0ZSwgdXJsLCBwYXJhbXMpIHtcclxuICAgICAgICBpZiAocmVnZXgucm91dGVwYXJhbXMudGVzdChyb3V0ZSkpIHtcclxuICAgICAgICAgICAgdmFyIHBhdGhSZWdleCA9IG5ldyBSZWdFeHAocm91dGUucmVwbGFjZSgvXFwvL2csIFwiXFxcXC9cIikucmVwbGFjZSgvOlteXFwvXFxcXF0rL2csIFwiKFteXFxcXC9dKylcIikpO1xyXG4gICAgICAgICAgICBpZiAocGF0aFJlZ2V4LnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBfYXJyKHJvdXRlLm1hdGNoKHJlZ2V4LnJvdXRlcGFyYW1zKSkubWFwKF9zYW5pdGl6ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gX2Fycih1cmwubWF0Y2gocGF0aFJlZ2V4KSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wYXJhbXNba2V5XSA9IHZhbHVlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIChyb3V0ZSA9PT0gdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZ2dlcnMgYSByb3V0ZXIgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfcm91dGVUcmlnZ2VyKGV2ZW50TmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHBhcmFtcyBpcyBhbHdheXMgYW4gb2JqZWN0XHJcbiAgICAgICAgcGFyYW1zID0gJC5leHRlbmQocGFyYW1zLCB7fSk7XHJcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudE9iamVjdC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMsIF9nZXRRdWVyeVBhcmFtcygpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3LmxvY2F0aW9uLmhhc2ggJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHBhcmFtcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyB3LmxvY2F0aW9uLnBhdGhuYW1lKTsgLy8gPC0tIFRoaXMgd2lsbCB0cmlnZ2VyIHJvdXRlciBoYW5kbGVyIGF1dG9tYXRpY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMsIF9nZXRRdWVyeVBhcmFtcygpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVzIHJvdXRlciBldmVudHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2JpbmRSb3V0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCkge1xyXG4gICAgICAgICAgICAkKHcpLm9uKFwicG9wc3RhdGVcIiwgX3RyaWdnZXJSb3V0ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCh3KS5vbihcImhhc2hjaGFuZ2VcIiwgX3RyaWdnZXJSb3V0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghJC5yb3V0ZXIpIHtcclxuICAgICAgICAvLyBqUXVlcnkgcm91dGVyIG9iamVjdFxyXG4gICAgICAgICQucm91dGVyID0ge1xyXG4gICAgICAgICAgICBldmVudHM6IGV2ZW50TmFtZXMsXHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlzdG9yeVN1cHBvcnRlZDogaXNIaXN0b3J5U3VwcG9ydGVkXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUcmlnZ2VycyBldmVudCBmb3IgalF1ZXJ5IHJvdXRlclxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgX3JvdXRlVHJpZ2dlci5hcHBseSh0aGlzLCBbZXZlbnROYW1lLCBwYXJhbXNdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgaWYgKCEkLmZuLnJvdXRlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWRkcyBhIGhhbmRsZXIgZnVuY3Rpb24gZm9yIGdpdmVuIHJvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHJvdXRlID0gJC5mbi5yb3V0ZSA9IGZ1bmN0aW9uIChzUm91dGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIF9yb3V0ZS5hcHBseSh0aGlzLCBbc1JvdXRlLCBjYWxsYmFja10pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCEkLnJvdXRlKSB7XHJcbiAgICAgICAgICAgICQucm91dGUgPSByb3V0ZS5iaW5kKG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghJC5zZXRSb3V0ZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoYW5nZXMgY3VycmVudCBwYWdlIHJvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBvUm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlcGxhY2VNb2RlXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaWdnZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICAkLnNldFJvdXRlID0gZnVuY3Rpb24gKG9Sb3V0ZSwgcmVwbGFjZU1vZGUsIG5vVHJpZ2dlcikge1xyXG4gICAgICAgICAgICBfc2V0Um91dGUuYXBwbHkodGhpcywgW29Sb3V0ZSwgcmVwbGFjZU1vZGUsIG5vVHJpZ2dlcl0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJvdXRlciBpbnRlcm5hbCBpbml0IG1ldGhvZFxyXG4gICAgICovXHJcbiAgICByb3V0ZXIuaW5pdCA9IF9iaW5kUm91dGVyRXZlbnRzO1xyXG4gICAgcm91dGVyLmluaXQoKTtcclxufShcclxuICAgIHdpbmRvdyxcclxuICAgIHdpbmRvdy5qUXVlcnksXHJcbiAgICB3aW5kb3cuaGlzdG9yeVxyXG4gICAgKSk7XHJcbiJdfQ==
