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
                    eventObject.handler(params.data, params.params);
                } else {
                    if (!w.location.hash && _matched(eventObject.route, w.location.pathname, params)) {
                        cache.data = params.data;
                        w.location.replace("#" + w.location.pathname); // <-- This will trigger router handler automatically
                    } else if (_matched(eventObject.route, w.location.hash.substring(1), params)) {
                        eventObject.handler(params.data, params.params);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkucm91dGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBqUXVlcnkgcm91dGVyIHBsdWdpblxyXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgU1BBIHJvdXRlciBtZXRob2RzIHRvIGhhbmRsZSByb3V0aW5nIG1lY2hhbmlzbSBpbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbnMgKFNQQSkuIFN1cHBvcnRlZCB2ZXJzaW9ucyBJRTkrLCBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBSb3V0aW5nIFBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDgtMDhcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMy4wXHJcbiAqL1xyXG5cclxuO1xyXG4oZnVuY3Rpb24gKHcsICQsIGhpc3RvcnkpIHtcclxuICAgIGlmICghJCB8fCAhJC5mbikgcmV0dXJuO1xyXG4gICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgYSBtYXAgb2YgYXR0YWNoZWQgaGFuZGxlcnNcclxuICAgIHZhciByb3V0ZXIgPSB7XHJcbiAgICAgICAgaGFuZGxlcnM6IFtdXHJcbiAgICB9LFxyXG4gICAgICAgIC8vIFZhcmlhYmxlIHRvIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkgcHJvcGVybHkgICAgXHJcbiAgICAgICAgaXNIaXN0b3J5U3VwcG9ydGVkID0gaGlzdG9yeSAmJiBoaXN0b3J5LnB1c2hTdGF0ZSxcclxuICAgICAgICAvLyBEYXRhIGNhY2hlXHJcbiAgICAgICAgY2FjaGUgPSB7XHJcbiAgICAgICAgICAgIG5vVHJpZ2dlcjogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcclxuICAgICAgICByZWdleCA9IHtcclxuICAgICAgICAgICAgcGF0aG5hbWU6IC9eXFwvKD89W14/XSspLyxcclxuICAgICAgICAgICAgcm91dGVwYXJhbXM6IC86W15cXC9dKy9nXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTdXBwb3J0ZWQgZXZlbnRzXHJcbiAgICAgICAgZXZlbnROYW1lcyA9IHtcclxuICAgICAgICAgICAgcm91dGVDaGFuZ2VkOiBcInJvdXRlQ2hhbmdlZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlc1xyXG4gICAgICAgIGVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgaW52YWxpZFBhdGg6IFwiUGF0aCBpcyBpbnZhbGlkXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYW55IGxpc3QgdG8gSmF2YVNjcmlwdCBhcnJheVxyXG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYXJyKGFycikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZ2dlcnMgXCJyb3V0ZUNoYW5nZWRcIiBldmVudCB1bmxlc3MgXCJub1RyaWdnZXJcIiBmbGFnIGlzIHRydWVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3RyaWdnZXJSb3V0ZSgpIHtcclxuICAgICAgICBpZiAoY2FjaGUubm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7IGRhdGE6IGNhY2hlLmRhdGEgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaHJvdyBKYXZhU2NyaXB0IGVycm9ycyB3aXRoIGN1c3RvbSBtZXNzYWdlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Rocm93RXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBnaXZlbiByb3V0ZSBpcyB2YWxpZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRSb3V0ZShzUm91dGUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNSb3V0ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiByZWdleC5wYXRobmFtZS50ZXN0KHNSb3V0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgcXVlcnkgc3RyaW5nXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmcgXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFwcGVuZFFTdHJpbmcgXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9yZXNvbHZlUXVlcnlTdHJpbmcoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFxU3RyaW5nICYmICFhcHBlbmRRU3RyaW5nKSByZXR1cm4gc1JvdXRlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcVN0cmluZyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBpZiAoKHFTdHJpbmcgPSBxU3RyaW5nLnRyaW0oKSkgJiYgYXBwZW5kUVN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNSb3V0ZSArIHcubG9jYXRpb24uc2VhcmNoICsgXCImXCIgKyBxU3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHFTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzUm91dGUgKyBcIj9cIiArIHFTdHJpbmcucmVwbGFjZShcIj9cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc1JvdXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHJvdXRlIGlzIHZhbGlkIGFuZCByZXR1cm5zIHRoZSB2YWxpZCByb3V0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHFTdHJpbmdcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXBwZW5kUVN0cmluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpIHtcclxuICAgICAgICBpZiAoX2lzVmFsaWRSb3V0ZShzUm91dGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfcmVzb2x2ZVF1ZXJ5U3RyaW5nKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3Rocm93RXJyb3IoZXJyb3JNZXNzYWdlLmludmFsaWRQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgcm91dGUgZm9yIGdpdmVuIHZpZXdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZSBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2V0Um91dGUob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBudWxsLFxyXG4gICAgICAgICAgICB0aXRsZSA9IG51bGwsXHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IFwiXCIsXHJcbiAgICAgICAgICAgIHFTdHJpbmcgPSBcIlwiLFxyXG4gICAgICAgICAgICBhcHBlbmRRU3RyaW5nID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHJvdXRlTWV0aG9kID0gcmVwbGFjZU1vZGUgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIjtcclxuICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBub1RyaWdnZXI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IGRhdGEgPSBvUm91dGUuZGF0YTtcclxuICAgICAgICAgICAgdGl0bGUgPSBvUm91dGUudGl0bGU7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZS5yb3V0ZTtcclxuICAgICAgICAgICAgcVN0cmluZyA9IG9Sb3V0ZS5xdWVyeVN0cmluZztcclxuICAgICAgICAgICAgYXBwZW5kUVN0cmluZyA9IG9Sb3V0ZS5hcHBlbmRRdWVyeTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIGhpc3Rvcnlbcm91dGVNZXRob2RdKHsgZGF0YTogZGF0YSB9LCB0aXRsZSwgX3ZhbGlkYXRlUm91dGUoc1JvdXRlLCBxU3RyaW5nLCBhcHBlbmRRU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGlmICghbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgeyBkYXRhOiBjYWNoZS5kYXRhIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2VNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyBfdmFsaWRhdGVSb3V0ZShzUm91dGUsIHFTdHJpbmcsIGFwcGVuZFFTdHJpbmcpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcubG9jYXRpb24uaGFzaCA9IF92YWxpZGF0ZVJvdXRlKHNSb3V0ZSwgcVN0cmluZywgYXBwZW5kUVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBhIHJvdXRlIGhhbmRsZXIgZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3JvdXRlKHNSb3V0ZSwgY2FsbGJhY2spIHtcclxuICAgICAgICByb3V0ZXIuaGFuZGxlcnMucHVzaCh7XHJcbiAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IGNhbGxiYWNrLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMsXHJcbiAgICAgICAgICAgIHJvdXRlOiBzUm91dGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmltcyBsZWFkaW5nL3RyYWlsaW5nIHNwZWNpYWwgY2hhcmFjdGVyc1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2FuaXRpemUoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eKFteYS16QS1aMC05XSspfChbXmEtekEtWjAtOV0rKSQvZywgXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wYXJlcyByb3V0ZSB3aXRoIGN1cnJlbnQgVVJMXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX21hdGNoZWQocm91dGUsIHVybCwgcGFyYW1zKSB7XHJcbiAgICAgICAgaWYgKHJlZ2V4LnJvdXRlcGFyYW1zLnRlc3Qocm91dGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoUmVnZXggPSBuZXcgUmVnRXhwKHJvdXRlLnJlcGxhY2UoL1xcLy9nLCBcIlxcXFwvXCIpLnJlcGxhY2UoLzpbXlxcL1xcXFxdKy9nLCBcIihbXlxcXFwvXSspXCIpKTtcclxuICAgICAgICAgICAgaWYgKHBhdGhSZWdleC50ZXN0KHVybCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gX2Fycihyb3V0ZS5tYXRjaChyZWdleC5yb3V0ZXBhcmFtcykpLm1hcChfc2FuaXRpemUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IF9hcnIodXJsLm1hdGNoKHBhdGhSZWdleCkpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucGFyYW1zW2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocm91dGUgPT09IHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWdnZXJzIGEgcm91dGVyIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3JvdXRlVHJpZ2dlcihldmVudE5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCBwYXJhbXMgaXMgYWx3YXlzIGFuIG9iamVjdFxyXG4gICAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKHBhcmFtcywge30pO1xyXG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudE9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRPYmplY3QuZXZlbnROYW1lID09PSBldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQgJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE9iamVjdC5oYW5kbGVyKHBhcmFtcy5kYXRhLCBwYXJhbXMucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3LmxvY2F0aW9uLmhhc2ggJiYgX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24ucGF0aG5hbWUsIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZGF0YSA9IHBhcmFtcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyB3LmxvY2F0aW9uLnBhdGhuYW1lKTsgLy8gPC0tIFRoaXMgd2lsbCB0cmlnZ2VyIHJvdXRlciBoYW5kbGVyIGF1dG9tYXRpY2FsbHlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9tYXRjaGVkKGV2ZW50T2JqZWN0LnJvdXRlLCB3LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpLCBwYXJhbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgcm91dGVyIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYmluZFJvdXRlckV2ZW50cygpIHtcclxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgICQodykub24oXCJwb3BzdGF0ZVwiLCBfdHJpZ2dlclJvdXRlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKHcpLm9uKFwiaGFzaGNoYW5nZVwiLCBfdHJpZ2dlclJvdXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEkLnJvdXRlcikge1xyXG4gICAgICAgIC8vIGpRdWVyeSByb3V0ZXIgb2JqZWN0XHJcbiAgICAgICAgJC5yb3V0ZXIgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnROYW1lcyxcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJC5yb3V0ZXIuZXZlbnRzLnRyaWdnZXIoZXZlbnROYW1lcy5yb3V0ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaXN0b3J5U3VwcG9ydGVkOiBpc0hpc3RvcnlTdXBwb3J0ZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRyaWdnZXJzIGV2ZW50IGZvciBqUXVlcnkgcm91dGVyXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgKi9cclxuICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICBfcm91dGVUcmlnZ2VyLmFwcGx5KHRoaXMsIFtldmVudE5hbWUsIHBhcmFtc10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBpZiAoISQuZm4ucm91dGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGRzIGEgaGFuZGxlciBmdW5jdGlvbiBmb3IgZ2l2ZW4gcm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgcm91dGUgPSAkLmZuLnJvdXRlID0gZnVuY3Rpb24gKHNSb3V0ZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgX3JvdXRlLmFwcGx5KHRoaXMsIFtzUm91dGUsIGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoISQucm91dGUpIHtcclxuICAgICAgICAgICAgJC5yb3V0ZSA9IHJvdXRlLmJpbmQobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCEkLnNldFJvdXRlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2hhbmdlcyBjdXJyZW50IHBhZ2Ugcm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG9Sb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVwbGFjZU1vZGVcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpZ2dlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQuc2V0Um91dGUgPSBmdW5jdGlvbiAob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIF9zZXRSb3V0ZS5hcHBseSh0aGlzLCBbb1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUm91dGVyIGludGVybmFsIGluaXQgbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIHJvdXRlci5pbml0ID0gX2JpbmRSb3V0ZXJFdmVudHM7XHJcbiAgICByb3V0ZXIuaW5pdCgpO1xyXG59KFxyXG4gICAgd2luZG93LFxyXG4gICAgd2luZG93LmpRdWVyeSxcclxuICAgIHdpbmRvdy5oaXN0b3J5XHJcbiAgICApKTtcclxuIl0sImZpbGUiOiJqcXVlcnkucm91dGVyLmpzIn0=
