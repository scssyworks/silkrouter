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
 * @version      0.4.0
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoianF1ZXJ5LnJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBqUXVlcnkgZGVwYXJhbSBwbHVnaW5cclxuICogQ29udmVydHMgYSBxdWVyeXN0cmluZyB0byBhIEphdmFTY3JpcHQgb2JqZWN0XHJcbiAqXHJcbiAqIEBwcm9qZWN0ICAgICAgSnF1ZXJ5IGRlcGFyYW0gcGx1Z2luXHJcbiAqIEBkYXRlICAgICAgICAgMjAxNy0wOS0xMlxyXG4gKiBAYXV0aG9yICAgICAgIFNhY2hpbiBTaW5naCA8c3NpbmdoLjMwMDg4OUBnbWFpbC5jb20+XHJcbiAqIEBkZXBlbmRlbmNpZXMgalF1ZXJ5XHJcbiAqIEB2ZXJzaW9uICAgICAgMC4xLjBcclxuICovXHJcblxyXG47IChmdW5jdGlvbiAodywgJCkge1xyXG4gICAgaWYgKCEkKSByZXR1cm47XHJcbiAgICBpZiAoISQuZGVwYXJhbSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGEgcXVlcnkgc3RyaW5nIGludG8gSmF2YVNjcmlwdCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcXNcclxuICAgICAgICAgKi9cclxuICAgICAgICAkLmRlcGFyYW0gPSBmdW5jdGlvbiAocXMpIHtcclxuICAgICAgICAgICAgaWYgKCEodHlwZW9mIHFzID09PSBcInN0cmluZ1wiKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxcykucmVwbGFjZShcIj9cIiwgXCJcIikudHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAocXMgPT09IFwiXCIpIHJldHVybiB7fTtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5UGFyYW1MaXN0ID0gcXMuc3BsaXQoXCImXCIpLFxyXG4gICAgICAgICAgICAgICAgcXVlcnlPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgcXVlcnlQYXJhbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAocXEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxQXJyID0gcXEuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9pc0NvbXBsZXgocUFyclswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlQ29tcGxleFF1ZXJ5KHFBcnJbMF0sIHFBcnJbMV0sIHF1ZXJ5T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZVNpbXBsZVF1ZXJ5KHFBcnIsIHF1ZXJ5T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVyeU9iamVjdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBpbnB1dCBpcyBhIG51bWJlclxyXG4gICAgICogQHBhcmFtIHsqfSBrZXkgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGtleSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcIm51bWJlclwiKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKCtrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBxdWVyeSBwYXJhbWV0ZXIga2V5IGlzIGEgY29tcGxleCBub3RhdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHEgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9pc0NvbXBsZXgocSkge1xyXG4gICAgICAgIHJldHVybiAoL1xcWy8udGVzdChxKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZXMgY29tcGxleCBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2hhbmRsZUNvbXBsZXhRdWVyeShrZXksIHZhbHVlLCBvYmopIHtcclxuICAgICAgICB2YXIgbWF0Y2ggPSBrZXkubWF0Y2goLyhbXlxcW10rKVxcWyhbXlxcW10qKVxcXS8pLFxyXG4gICAgICAgICAgICBwcm9wID0gbWF0Y2hbMV0sXHJcbiAgICAgICAgICAgIG5leHRQcm9wID0gbWF0Y2hbMl07XHJcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA9PT0gMykge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFxbKFteXFxbXSopXFxdLywgXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZE9iaiA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChfaXNDb21wbGV4KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UHJvcCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRQcm9wID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW15cXFtdKy8sIG5leHRQcm9wKTtcclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBudWxsIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSBvYmpbcHJvcF0gPSBbbnVsbF07XHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhcnJheVxyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW3Byb3BdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBfY29udmVydFRvT2JqZWN0KG9ialtwcm9wXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcIm9iamVjdFwiKSB7IC8vIENoZWNrIGlmIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIENoZWNrIGlmIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF0gPSBbb2JqW3Byb3BdXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF9oYW5kbGVDb21wbGV4UXVlcnkoa2V5LCB2YWx1ZSwgY2hpbGRPYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG51bGxcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSBvYmpbcHJvcF0gPSBbbnVsbF07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpbcHJvcF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IF9jb252ZXJ0VG9PYmplY3Qob2JqW3Byb3BdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJvYmplY3RcIikgeyAvLyBDaGVjayBpZiBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtwcm9wXSA9PT0gXCJ1bmRlZmluZWRcIikgeyAvLyBDaGVjayBpZiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgaWYgYW55IG90aGVyIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmpbbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0ucHVzaChjaGlsZE9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVTaW1wbGVRdWVyeShbbWF0Y2hbMV0sIHZhbHVlXSwgb2JqLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBxQXJyIFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5T2JqZWN0IFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb252ZXJ0VG9BcnJheSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2hhbmRsZVNpbXBsZVF1ZXJ5KHFBcnIsIHF1ZXJ5T2JqZWN0LCBjb252ZXJ0VG9BcnJheSkge1xyXG4gICAgICAgIHZhciBrZXkgPSBxQXJyWzBdLFxyXG4gICAgICAgICAgICB2YWx1ZSA9IF92YWwocUFyclsxXSk7XHJcbiAgICAgICAgaWYgKGtleSBpbiBxdWVyeU9iamVjdCkge1xyXG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldID0gQXJyYXkuaXNBcnJheShxdWVyeU9iamVjdFtrZXldKSA/IHF1ZXJ5T2JqZWN0W2tleV0gOiBbcXVlcnlPYmplY3Rba2V5XV07XHJcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XSA9IGNvbnZlcnRUb0FycmF5ID8gW3ZhbHVlXSA6IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RvcmVzIHZhbHVlcyB0byB0aGVpciBvcmlnaW5hbCB0eXBlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF92YWwodmFsdWUpIHtcclxuICAgICAgICBpZiAoISh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpKSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gXCJcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwibnVsbFwiKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiTmFOXCIpIHJldHVybiBOYU47XHJcbiAgICAgICAgaWYgKCFpc05hTigrdmFsdWUpKSByZXR1cm4gK3ZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwiZmFsc2VcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGFuIGFycmF5IHRvIGFuIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfY29udmVydFRvT2JqZWN0KGFycikge1xyXG4gICAgICAgIHZhciBjb252ZXJ0ZWRPYmogPSB7fTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XHJcbiAgICAgICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnZlcnRlZE9ialtpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb252ZXJ0ZWRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxufSkod2luZG93LCB3aW5kb3cualF1ZXJ5KTsiLCIvKipcclxuICogalF1ZXJ5IHJvdXRlciBwbHVnaW5cclxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFNQQSByb3V0ZXIgbWV0aG9kcyB0byBoYW5kbGUgcm91dGluZyBtZWNoYW5pc20gaW4gc2luZ2xlIHBhZ2UgYXBwbGljYXRpb25zIChTUEEpLiBTdXBwb3J0ZWQgdmVyc2lvbnMgSUU5KywgQ2hyb21lLCBTYWZhcmksIEZpcmVmb3hcclxuICpcclxuICogQHByb2plY3QgICAgICBKcXVlcnkgUm91dGluZyBQbHVnaW5cclxuICogQGRhdGUgICAgICAgICAyMDE3LTA4LTA4XHJcbiAqIEBhdXRob3IgICAgICAgU2FjaGluIFNpbmdoIDxzc2luZ2guMzAwODg5QGdtYWlsLmNvbT5cclxuICogQGRlcGVuZGVuY2llcyBqUXVlcnlcclxuICogQHZlcnNpb24gICAgICAwLjQuMFxyXG4gKi9cclxuXHJcbjtcclxuKGZ1bmN0aW9uICh3LCAkLCBoaXN0b3J5KSB7XHJcbiAgICBpZiAoISQgfHwgISQuZm4pIHJldHVybjtcclxuICAgIC8vIE9iamVjdCBjb250YWluaW5nIGEgbWFwIG9mIGF0dGFjaGVkIGhhbmRsZXJzXHJcbiAgICB2YXIgcm91dGVyID0ge1xyXG4gICAgICAgIGhhbmRsZXJzOiBbXVxyXG4gICAgfSxcclxuICAgICAgICAvLyBWYXJpYWJsZSB0byBjaGVjayBpZiBicm93c2VyIHN1cHBvcnRzIGhpc3RvcnkgQVBJIHByb3Blcmx5ICAgIFxyXG4gICAgICAgIGlzSGlzdG9yeVN1cHBvcnRlZCA9IGhpc3RvcnkgJiYgaGlzdG9yeS5wdXNoU3RhdGUsXHJcbiAgICAgICAgLy8gRGF0YSBjYWNoZVxyXG4gICAgICAgIGNhY2hlID0ge1xyXG4gICAgICAgICAgICBub1RyaWdnZXI6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb25zXHJcbiAgICAgICAgcmVnZXggPSB7XHJcbiAgICAgICAgICAgIHBhdGhuYW1lOiAvXlxcLyg/PVteP10rKS8sXHJcbiAgICAgICAgICAgIHJvdXRlcGFyYW1zOiAvOlteXFwvXSsvZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gU3VwcG9ydGVkIGV2ZW50c1xyXG4gICAgICAgIGV2ZW50TmFtZXMgPSB7XHJcbiAgICAgICAgICAgIHJvdXRlQ2hhbmdlZDogXCJyb3V0ZUNoYW5nZWRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gRXJyb3IgbWVzc2FnZXNcclxuICAgICAgICBlcnJvck1lc3NhZ2UgPSB7XHJcbiAgICAgICAgICAgIGludmFsaWRQYXRoOiBcIlBhdGggaXMgaW52YWxpZFwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGFueSBsaXN0IHRvIEphdmFTY3JpcHQgYXJyYXlcclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGFyciBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2FycihhcnIpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWdnZXJzIFwicm91dGVDaGFuZ2VkXCIgZXZlbnQgdW5sZXNzIFwibm9UcmlnZ2VyXCIgZmxhZyBpcyB0cnVlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF90cmlnZ2VyUm91dGUoKSB7XHJcbiAgICAgICAgaWYgKGNhY2hlLm5vVHJpZ2dlcikge1xyXG4gICAgICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgeyBkYXRhOiBjYWNoZS5kYXRhIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhyb3cgSmF2YVNjcmlwdCBlcnJvcnMgd2l0aCBjdXN0b20gbWVzc2FnZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF90aHJvd0Vycm9yKG1lc3NhZ2UpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgZ2l2ZW4gcm91dGUgaXMgdmFsaWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9pc1ZhbGlkUm91dGUoc1JvdXRlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzUm91dGUgIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gcmVnZXgucGF0aG5hbWUudGVzdChzUm91dGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHF1ZXJ5IHN0cmluZ1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxU3RyaW5nIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhcHBlbmRRU3RyaW5nIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykge1xyXG4gICAgICAgIGlmICghcVN0cmluZyAmJiAhYXBwZW5kUVN0cmluZykgcmV0dXJuIHNSb3V0ZTtcclxuICAgICAgICBpZiAodHlwZW9mIHFTdHJpbmcgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgaWYgKChxU3RyaW5nID0gcVN0cmluZy50cmltKCkpICYmIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGUgKyB3LmxvY2F0aW9uLnNlYXJjaCArIFwiJlwiICsgcVN0cmluZy5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChxU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlICsgXCI/XCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGN1cnJlbnQgcXVlcnkgc3RyaW5nIGludG8gYW4gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVBhcmFtcygpIHtcclxuICAgICAgICB2YXIgcXNPYmplY3QgPSAkLmRlcGFyYW0ody5sb2NhdGlvbi5zZWFyY2gpLFxyXG4gICAgICAgICAgICBoYXNoU3RyaW5nUGFyYW1zID0ge307XHJcbiAgICAgICAgaWYgKHcubG9jYXRpb24uaGFzaC5tYXRjaCgvXFw/LisvKSkge1xyXG4gICAgICAgICAgICBoYXNoU3RyaW5nUGFyYW1zID0gJC5kZXBhcmFtKHcubG9jYXRpb24uaGFzaC5tYXRjaCgvXFw/LisvKVswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkLmV4dGVuZChxc09iamVjdCwgaGFzaFN0cmluZ1BhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgcm91dGUgaXMgdmFsaWQgYW5kIHJldHVybnMgdGhlIHZhbGlkIHJvdXRlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcVN0cmluZ1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhcHBlbmRRU3RyaW5nXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZykge1xyXG4gICAgICAgIGlmIChfaXNWYWxpZFJvdXRlKHNSb3V0ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhyb3dFcnJvcihlcnJvck1lc3NhZ2UuaW52YWxpZFBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCByb3V0ZSBmb3IgZ2l2ZW4gdmlld1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBvUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlcGxhY2VNb2RlIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaWdnZXIgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9zZXRSb3V0ZShvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXIpIHtcclxuICAgICAgICBpZiAoIW9Sb3V0ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBkYXRhID0gbnVsbCxcclxuICAgICAgICAgICAgdGl0bGUgPSBudWxsLFxyXG4gICAgICAgICAgICBzUm91dGUgPSBcIlwiLFxyXG4gICAgICAgICAgICBxU3RyaW5nID0gXCJcIixcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0hhc2hTdHJpbmcgPSBmYWxzZSxcclxuICAgICAgICAgICAgcm91dGVNZXRob2QgPSByZXBsYWNlTW9kZSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiO1xyXG4gICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IG5vVHJpZ2dlcjtcclxuICAgICAgICBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICBjYWNoZS5kYXRhID0gZGF0YSA9IG9Sb3V0ZS5kYXRhO1xyXG4gICAgICAgICAgICB0aXRsZSA9IG9Sb3V0ZS50aXRsZTtcclxuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlLnJvdXRlO1xyXG4gICAgICAgICAgICBxU3RyaW5nID0gb1JvdXRlLnF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gb1JvdXRlLmFwcGVuZFF1ZXJ5O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Sb3V0ZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBzUm91dGUgPSBvUm91dGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFN1cHBvcnQgZm9yIGhhc2ggcm91dGVzXHJcbiAgICAgICAgaWYgKHNSb3V0ZS5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgIGlzSGFzaFN0cmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IHNSb3V0ZS5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiAhaXNIYXNoU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGhpc3Rvcnlbcm91dGVNZXRob2RdKHsgZGF0YTogZGF0YSB9LCB0aXRsZSwgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGlmICghbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgeyBkYXRhOiBjYWNoZS5kYXRhIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2VNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcubG9jYXRpb24uaGFzaCA9IF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBhIHJvdXRlIGhhbmRsZXIgZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3JvdXRlKHNSb3V0ZSwgY2FsbGJhY2spIHtcclxuICAgICAgICByb3V0ZXIuaGFuZGxlcnMucHVzaCh7XHJcbiAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IGNhbGxiYWNrLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMsXHJcbiAgICAgICAgICAgIHJvdXRlOiBzUm91dGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmltcyBsZWFkaW5nL3RyYWlsaW5nIHNwZWNpYWwgY2hhcmFjdGVyc1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2FuaXRpemUoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eKFteYS16QS1aMC05XSspfChbXmEtekEtWjAtOV0rKSQvZywgXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wYXJlcyByb3V0ZSB3aXRoIGN1cnJlbnQgVVJMXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX21hdGNoZWQocm91dGUsIHVybCwgcGFyYW1zKSB7XHJcbiAgICAgICAgaWYgKHJlZ2V4LnJvdXRlcGFyYW1zLnRlc3Qocm91dGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoUmVnZXggPSBuZXcgUmVnRXhwKHJvdXRlLnJlcGxhY2UoL1xcLy9nLCBcIlxcXFwvXCIpLnJlcGxhY2UoLzpbXlxcL1xcXFxdKy9nLCBcIihbXlxcXFwvXSspXCIpKTtcclxuICAgICAgICAgICAgaWYgKHBhdGhSZWdleC50ZXN0KHVybCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gX2Fycihyb3V0ZS5tYXRjaChyZWdleC5yb3V0ZXBhcmFtcykpLm1hcChfc2FuaXRpemUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IF9hcnIodXJsLm1hdGNoKHBhdGhSZWdleCkpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucGFyYW1zW2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocm91dGUgPT09IHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWdnZXJzIGEgcm91dGVyIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3JvdXRlVHJpZ2dlcihldmVudE5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCBwYXJhbXMgaXMgYWx3YXlzIGFuIG9iamVjdFxyXG4gICAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKHBhcmFtcywge30pO1xyXG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudE9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRPYmplY3QuZXZlbnROYW1lID09PSBldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdy5sb2NhdGlvbi5oYXNoICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEgPSBwYXJhbXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgdy5sb2NhdGlvbi5wYXRobmFtZSk7IC8vIDwtLSBUaGlzIHdpbGwgdHJpZ2dlciByb3V0ZXIgaGFuZGxlciBhdXRvbWF0aWNhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyByb3V0ZXIgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9iaW5kUm91dGVyRXZlbnRzKCkge1xyXG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgJCh3KS5vbihcInBvcHN0YXRlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodykub24oXCJoYXNoY2hhbmdlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoISQucm91dGVyKSB7XHJcbiAgICAgICAgJC5yb3V0ZXIgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnROYW1lcyxcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaXN0b3J5U3VwcG9ydGVkOiBpc0hpc3RvcnlTdXBwb3J0ZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIF9yb3V0ZVRyaWdnZXIuYXBwbHkodGhpcywgW2V2ZW50TmFtZSwgcGFyYW1zXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoISQuZm4ucm91dGUpIHtcclxuICAgICAgICAgICAgdmFyIHJvdXRlID0gJC5mbi5yb3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF9yb3V0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoISQucm91dGUpIHtcclxuICAgICAgICAgICAgICAgICQucm91dGUgPSByb3V0ZS5iaW5kKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghJC5zZXRSb3V0ZSkge1xyXG4gICAgICAgICAgICAkLnNldFJvdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQucm91dGVyLnNldCA9ICQuc2V0Um91dGU7XHJcbiAgICB9XHJcbiAgICByb3V0ZXIuaW5pdCA9IF9iaW5kUm91dGVyRXZlbnRzO1xyXG4gICAgcm91dGVyLmluaXQoKTtcclxufShcclxuICAgIHdpbmRvdyxcclxuICAgIHdpbmRvdy5qUXVlcnksXHJcbiAgICB3aW5kb3cuaGlzdG9yeVxyXG4gICAgKSk7XHJcbiJdfQ==
