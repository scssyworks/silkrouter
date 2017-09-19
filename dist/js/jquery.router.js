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
 * @version      0.3.1
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kZXBhcmFtLmpzIiwianF1ZXJ5LnJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJqcXVlcnkucm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGpRdWVyeSBkZXBhcmFtIHBsdWdpblxyXG4gKiBDb252ZXJ0cyBhIHF1ZXJ5c3RyaW5nIHRvIGEgSmF2YVNjcmlwdCBvYmplY3RcclxuICpcclxuICogQHByb2plY3QgICAgICBKcXVlcnkgZGVwYXJhbSBwbHVnaW5cclxuICogQGRhdGUgICAgICAgICAyMDE3LTA5LTEyXHJcbiAqIEBhdXRob3IgICAgICAgU2FjaGluIFNpbmdoIDxzc2luZ2guMzAwODg5QGdtYWlsLmNvbT5cclxuICogQGRlcGVuZGVuY2llcyBqUXVlcnlcclxuICogQHZlcnNpb24gICAgICAwLjEuMFxyXG4gKi9cclxuXHJcbjsgKGZ1bmN0aW9uICh3LCAkKSB7XHJcbiAgICBpZiAoISQpIHJldHVybjtcclxuICAgIGlmICghJC5kZXBhcmFtKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydHMgYSBxdWVyeSBzdHJpbmcgaW50byBKYXZhU2NyaXB0IG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQuZGVwYXJhbSA9IGZ1bmN0aW9uIChxcykge1xyXG4gICAgICAgICAgICBpZiAoISh0eXBlb2YgcXMgPT09IFwic3RyaW5nXCIpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHFzKS5yZXBsYWNlKFwiP1wiLCBcIlwiKS50cmltKCk7XHJcbiAgICAgICAgICAgIGlmIChxcyA9PT0gXCJcIikgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlQYXJhbUxpc3QgPSBxcy5zcGxpdChcIiZcIiksXHJcbiAgICAgICAgICAgICAgICBxdWVyeU9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICBxdWVyeVBhcmFtTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChxcSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHFBcnIgPSBxcS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2lzQ29tcGxleChxQXJyWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVDb21wbGV4UXVlcnkocUFyclswXSwgcUFyclsxXSwgcXVlcnlPYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlU2ltcGxlUXVlcnkocUFyciwgcXVlcnlPYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5T2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIGlucHV0IGlzIGEgbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0geyp9IGtleSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoa2V5KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhaXNOYU4oK2tleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHF1ZXJ5IHBhcmFtZXRlciBrZXkgaXMgYSBjb21wbGV4IG5vdGF0aW9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2lzQ29tcGxleChxKSB7XHJcbiAgICAgICAgcmV0dXJuICgvXFxbLy50ZXN0KHEpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlcyBjb21wbGV4IHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaGFuZGxlQ29tcGxleFF1ZXJ5KGtleSwgdmFsdWUsIG9iaikge1xyXG4gICAgICAgIHZhciBtYXRjaCA9IGtleS5tYXRjaCgvKFteXFxbXSspXFxbKFteXFxbXSopXFxdLyksXHJcbiAgICAgICAgICAgIHByb3AgPSBtYXRjaFsxXSxcclxuICAgICAgICAgICAgbmV4dFByb3AgPSBtYXRjaFsyXTtcclxuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXFsoW15cXFtdKilcXF0vLCBcIlwiKTtcclxuICAgICAgICAgICAgdmFyIGNoaWxkT2JqID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKF9pc0NvbXBsZXgoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRQcm9wID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFByb3AgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXlxcW10rLywgbmV4dFByb3ApO1xyXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIG51bGwgdmFsdWVcclxuICAgICAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIG9ialtwcm9wXSA9IFtudWxsXTtcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFycmF5XHJcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpbcHJvcF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IF9jb252ZXJ0VG9PYmplY3Qob2JqW3Byb3BdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwib2JqZWN0XCIpIHsgLy8gQ2hlY2sgaWYgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRPYmogPSBvYmpbcHJvcF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQ2hlY2sgaWYgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0gb2JqW3Byb3BdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE9iaiA9IG9ialtwcm9wXSA9IFtvYmpbcHJvcF1dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX2hhbmRsZUNvbXBsZXhRdWVyeShrZXksIHZhbHVlLCBjaGlsZE9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIG9ialtwcm9wXSA9IFtudWxsXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtwcm9wXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTnVtYmVyKG5leHRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gX2NvbnZlcnRUb09iamVjdChvYmpbcHJvcF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdW25leHRQcm9wXSA9IF92YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcIm9iamVjdFwiKSB7IC8vIENoZWNrIGlmIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF1bbmV4dFByb3BdID0gX3ZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW3Byb3BdID09PSBcInVuZGVmaW5lZFwiKSB7IC8vIENoZWNrIGlmIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmV4dFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayBpZiBhbnkgb3RoZXIgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gW29ialtwcm9wXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc051bWJlcihuZXh0UHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXVtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkT2JqID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE9ialtuZXh0UHJvcF0gPSBfdmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXS5wdXNoKGNoaWxkT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZVNpbXBsZVF1ZXJ5KFttYXRjaFsxXSwgdmFsdWVdLCBvYmosIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHFBcnIgXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlPYmplY3QgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbnZlcnRUb0FycmF5IFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaGFuZGxlU2ltcGxlUXVlcnkocUFyciwgcXVlcnlPYmplY3QsIGNvbnZlcnRUb0FycmF5KSB7XHJcbiAgICAgICAgdmFyIGtleSA9IHFBcnJbMF0sXHJcbiAgICAgICAgICAgIHZhbHVlID0gX3ZhbChxQXJyWzFdKTtcclxuICAgICAgICBpZiAoa2V5IGluIHF1ZXJ5T2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0W2tleV0gPSBBcnJheS5pc0FycmF5KHF1ZXJ5T2JqZWN0W2tleV0pID8gcXVlcnlPYmplY3Rba2V5XSA6IFtxdWVyeU9iamVjdFtrZXldXTtcclxuICAgICAgICAgICAgcXVlcnlPYmplY3Rba2V5XS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeU9iamVjdFtrZXldID0gY29udmVydFRvQXJyYXkgPyBbdmFsdWVdIDogdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdG9yZXMgdmFsdWVzIHRvIHRoZWlyIG9yaWdpbmFsIHR5cGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3ZhbCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJudWxsXCIpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJOYU5cIikgcmV0dXJuIE5hTjtcclxuICAgICAgICBpZiAoIWlzTmFOKCt2YWx1ZSkpIHJldHVybiArdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmYWxzZVwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYW4gYXJyYXkgdG8gYW4gb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcnIgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9jb252ZXJ0VG9PYmplY3QoYXJyKSB7XHJcbiAgICAgICAgdmFyIGNvbnZlcnRlZE9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcclxuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgY29udmVydGVkT2JqW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRlZE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG59KSh3aW5kb3csIHdpbmRvdy5qUXVlcnkpOyIsIi8qKlxyXG4gKiBqUXVlcnkgcm91dGVyIHBsdWdpblxyXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgU1BBIHJvdXRlciBtZXRob2RzIHRvIGhhbmRsZSByb3V0aW5nIG1lY2hhbmlzbSBpbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbnMgKFNQQSkuIFN1cHBvcnRlZCB2ZXJzaW9ucyBJRTkrLCBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBSb3V0aW5nIFBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDgtMDhcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMy4xXHJcbiAqL1xyXG5cclxuO1xyXG4oZnVuY3Rpb24gKHcsICQsIGhpc3RvcnkpIHtcclxuICAgIGlmICghJCB8fCAhJC5mbikgcmV0dXJuO1xyXG4gICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgYSBtYXAgb2YgYXR0YWNoZWQgaGFuZGxlcnNcclxuICAgIHZhciByb3V0ZXIgPSB7XHJcbiAgICAgICAgaGFuZGxlcnM6IFtdXHJcbiAgICB9LFxyXG4gICAgICAgIC8vIFZhcmlhYmxlIHRvIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkgcHJvcGVybHkgICAgXHJcbiAgICAgICAgaXNIaXN0b3J5U3VwcG9ydGVkID0gaGlzdG9yeSAmJiBoaXN0b3J5LnB1c2hTdGF0ZSxcclxuICAgICAgICAvLyBEYXRhIGNhY2hlXHJcbiAgICAgICAgY2FjaGUgPSB7XHJcbiAgICAgICAgICAgIG5vVHJpZ2dlcjogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcclxuICAgICAgICByZWdleCA9IHtcclxuICAgICAgICAgICAgcGF0aG5hbWU6IC9eXFwvKD89W14/XSspLyxcclxuICAgICAgICAgICAgcm91dGVwYXJhbXM6IC86W15cXC9dKy9nXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTdXBwb3J0ZWQgZXZlbnRzXHJcbiAgICAgICAgZXZlbnROYW1lcyA9IHtcclxuICAgICAgICAgICAgcm91dGVDaGFuZ2VkOiBcInJvdXRlQ2hhbmdlZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlc1xyXG4gICAgICAgIGVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgaW52YWxpZFBhdGg6IFwiUGF0aCBpcyBpbnZhbGlkXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYW55IGxpc3QgdG8gSmF2YVNjcmlwdCBhcnJheVxyXG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYXJyKGFycikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZ2dlcnMgXCJyb3V0ZUNoYW5nZWRcIiBldmVudCB1bmxlc3MgXCJub1RyaWdnZXJcIiBmbGFnIGlzIHRydWVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3RyaWdnZXJSb3V0ZSgpIHtcclxuICAgICAgICBpZiAoY2FjaGUubm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7IGRhdGE6IGNhY2hlLmRhdGEgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaHJvdyBKYXZhU2NyaXB0IGVycm9ycyB3aXRoIGN1c3RvbSBtZXNzYWdlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Rocm93RXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBnaXZlbiByb3V0ZSBpcyB2YWxpZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRSb3V0ZShzUm91dGUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNSb3V0ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiByZWdleC5wYXRobmFtZS50ZXN0KHNSb3V0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgcXVlcnkgc3RyaW5nXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmcgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmcgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFxU3RyaW5nICYmICFhcHBlbmRRU3RyaW5nKSByZXR1cm4gc1JvdXRlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcVN0cmluZyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBpZiAoKHFTdHJpbmcgPSBxU3RyaW5nLnRyaW0oKSkgJiYgYXBwZW5kUVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIHcubG9jYXRpb24uc2VhcmNoICsgXCImXCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHFTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGUgKyBcIj9cIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgY3VycmVudCBxdWVyeSBzdHJpbmcgaW50byBhbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5UGFyYW1zKCkge1xyXG4gICAgICAgIHZhciBxc09iamVjdCA9ICQuZGVwYXJhbSh3LmxvY2F0aW9uLnNlYXJjaCksXHJcbiAgICAgICAgICAgIGhhc2hTdHJpbmdQYXJhbXMgPSB7fTtcclxuICAgICAgICBpZiAody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pKSB7XHJcbiAgICAgICAgICAgIGhhc2hTdHJpbmdQYXJhbXMgPSAkLmRlcGFyYW0ody5sb2NhdGlvbi5oYXNoLm1hdGNoKC9cXD8uKy8pWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHFzT2JqZWN0LCBoYXNoU3RyaW5nUGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiByb3V0ZSBpcyB2YWxpZCBhbmQgcmV0dXJucyB0aGUgdmFsaWQgcm91dGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxU3RyaW5nXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmdcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKF9pc1ZhbGlkUm91dGUoc1JvdXRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3Jlc29sdmVRdWVyeVN0cmluZyhzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF90aHJvd0Vycm9yKGVycm9yTWVzc2FnZS5pbnZhbGlkUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHJvdXRlIGZvciBnaXZlbiB2aWV3XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG9Sb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVwbGFjZU1vZGUgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpZ2dlciBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3NldFJvdXRlKG9Sb3V0ZSwgcmVwbGFjZU1vZGUsIG5vVHJpZ2dlcikge1xyXG4gICAgICAgIGlmICghb1JvdXRlKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGRhdGEgPSBudWxsLFxyXG4gICAgICAgICAgICB0aXRsZSA9IG51bGwsXHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IFwiXCIsXHJcbiAgICAgICAgICAgIHFTdHJpbmcgPSBcIlwiLFxyXG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHJvdXRlTWV0aG9kID0gcmVwbGFjZU1vZGUgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIjtcclxuICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBub1RyaWdnZXI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IGRhdGEgPSBvUm91dGUuZGF0YTtcclxuICAgICAgICAgICAgdGl0bGUgPSBvUm91dGUudGl0bGU7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZS5yb3V0ZTtcclxuICAgICAgICAgICAgcVN0cmluZyA9IG9Sb3V0ZS5xdWVyeVN0cmluZztcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IG9Sb3V0ZS5hcHBlbmRRdWVyeTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIGhpc3Rvcnlbcm91dGVNZXRob2RdKHsgZGF0YTogZGF0YSB9LCB0aXRsZSwgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGlmICghbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgeyBkYXRhOiBjYWNoZS5kYXRhIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2VNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcubG9jYXRpb24uaGFzaCA9IF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBhIHJvdXRlIGhhbmRsZXIgZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3JvdXRlKHNSb3V0ZSwgY2FsbGJhY2spIHtcclxuICAgICAgICByb3V0ZXIuaGFuZGxlcnMucHVzaCh7XHJcbiAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IGNhbGxiYWNrLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMsXHJcbiAgICAgICAgICAgIHJvdXRlOiBzUm91dGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmltcyBsZWFkaW5nL3RyYWlsaW5nIHNwZWNpYWwgY2hhcmFjdGVyc1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2FuaXRpemUoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eKFteYS16QS1aMC05XSspfChbXmEtekEtWjAtOV0rKSQvZywgXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wYXJlcyByb3V0ZSB3aXRoIGN1cnJlbnQgVVJMXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX21hdGNoZWQocm91dGUsIHVybCwgcGFyYW1zKSB7XHJcbiAgICAgICAgaWYgKHJlZ2V4LnJvdXRlcGFyYW1zLnRlc3Qocm91dGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoUmVnZXggPSBuZXcgUmVnRXhwKHJvdXRlLnJlcGxhY2UoL1xcLy9nLCBcIlxcXFwvXCIpLnJlcGxhY2UoLzpbXlxcL1xcXFxdKy9nLCBcIihbXlxcXFwvXSspXCIpKTtcclxuICAgICAgICAgICAgaWYgKHBhdGhSZWdleC50ZXN0KHVybCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gX2Fycihyb3V0ZS5tYXRjaChyZWdleC5yb3V0ZXBhcmFtcykpLm1hcChfc2FuaXRpemUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IF9hcnIodXJsLm1hdGNoKHBhdGhSZWdleCkpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucGFyYW1zW2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocm91dGUgPT09IHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWdnZXJzIGEgcm91dGVyIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3JvdXRlVHJpZ2dlcihldmVudE5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCBwYXJhbXMgaXMgYWx3YXlzIGFuIG9iamVjdFxyXG4gICAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKHBhcmFtcywge30pO1xyXG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudE9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRPYmplY3QuZXZlbnROYW1lID09PSBldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdy5sb2NhdGlvbi5oYXNoICYmIF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLnBhdGhuYW1lLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRhdGEgPSBwYXJhbXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5yZXBsYWNlKFwiI1wiICsgdy5sb2NhdGlvbi5wYXRobmFtZSk7IC8vIDwtLSBUaGlzIHdpbGwgdHJpZ2dlciByb3V0ZXIgaGFuZGxlciBhdXRvbWF0aWNhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zLCBfZ2V0UXVlcnlQYXJhbXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyByb3V0ZXIgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9iaW5kUm91dGVyRXZlbnRzKCkge1xyXG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgJCh3KS5vbihcInBvcHN0YXRlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodykub24oXCJoYXNoY2hhbmdlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoISQucm91dGVyKSB7XHJcbiAgICAgICAgLy8galF1ZXJ5IHJvdXRlciBvYmplY3RcclxuICAgICAgICAkLnJvdXRlciA9IHtcclxuICAgICAgICAgICAgZXZlbnRzOiBldmVudE5hbWVzLFxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpc3RvcnlTdXBwb3J0ZWQ6IGlzSGlzdG9yeVN1cHBvcnRlZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVHJpZ2dlcnMgZXZlbnQgZm9yIGpRdWVyeSByb3V0ZXJcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIF9yb3V0ZVRyaWdnZXIuYXBwbHkodGhpcywgW2V2ZW50TmFtZSwgcGFyYW1zXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGlmICghJC5mbi5yb3V0ZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZHMgYSBoYW5kbGVyIGZ1bmN0aW9uIGZvciBnaXZlbiByb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciByb3V0ZSA9ICQuZm4ucm91dGUgPSBmdW5jdGlvbiAoc1JvdXRlLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBfcm91dGUuYXBwbHkodGhpcywgW3NSb3V0ZSwgY2FsbGJhY2tdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghJC5yb3V0ZSkge1xyXG4gICAgICAgICAgICAkLnJvdXRlID0gcm91dGUuYmluZChudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoISQuc2V0Um91dGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDaGFuZ2VzIGN1cnJlbnQgcGFnZSByb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5zZXRSb3V0ZSA9IGZ1bmN0aW9uIChvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXIpIHtcclxuICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIFtvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXJdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3V0ZXIgaW50ZXJuYWwgaW5pdCBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcm91dGVyLmluaXQgPSBfYmluZFJvdXRlckV2ZW50cztcclxuICAgIHJvdXRlci5pbml0KCk7XHJcbn0oXHJcbiAgICB3aW5kb3csXHJcbiAgICB3aW5kb3cualF1ZXJ5LFxyXG4gICAgd2luZG93Lmhpc3RvcnlcclxuICAgICkpO1xyXG4iXX0=
