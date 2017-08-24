/**
 * jQuery router plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
 *
 * @project      Jquery Routing Plugin
 * @date         2017-08-08
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery
 * @version      0.2.1
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
     * Checks if route is valid and returns the valid route
     * @param {string} sRoute 
     */
    function _validateRoute(sRoute) {
        if (_isValidRoute(sRoute)) {
            return sRoute;
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
            routeMethod = replaceMode ? "replaceState" : "pushState";
        cache.noTrigger = noTrigger;
        if (typeof oRoute === "object") {
            cache.data = data = oRoute.data;
            title = oRoute.title;
            sRoute = oRoute.route;
        } else if (typeof oRoute === "string") {
            sRoute = oRoute;
        }
        if (isHistorySupported) {
            history[routeMethod]({ data: data }, title, _validateRoute(sRoute));
            if (!noTrigger) {
                $.router.events.trigger(eventNames.routeChanged, { data: cache.data });
            }
        } else {
            if (replaceMode) {
                w.location.replace("#" + sRoute);
            } else {
                w.location.hash = _validateRoute(sRoute);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkucm91dGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBqUXVlcnkgcm91dGVyIHBsdWdpblxyXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgU1BBIHJvdXRlciBtZXRob2RzIHRvIGhhbmRsZSByb3V0aW5nIG1lY2hhbmlzbSBpbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbnMgKFNQQSkuIFN1cHBvcnRlZCB2ZXJzaW9ucyBJRTkrLCBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveFxyXG4gKlxyXG4gKiBAcHJvamVjdCAgICAgIEpxdWVyeSBSb3V0aW5nIFBsdWdpblxyXG4gKiBAZGF0ZSAgICAgICAgIDIwMTctMDgtMDhcclxuICogQGF1dGhvciAgICAgICBTYWNoaW4gU2luZ2ggPHNzaW5naC4zMDA4ODlAZ21haWwuY29tPlxyXG4gKiBAZGVwZW5kZW5jaWVzIGpRdWVyeVxyXG4gKiBAdmVyc2lvbiAgICAgIDAuMi4xXHJcbiAqL1xyXG5cclxuO1xyXG4oZnVuY3Rpb24gKHcsICQsIGhpc3RvcnkpIHtcclxuICAgIGlmICghJCB8fCAhJC5mbikgcmV0dXJuO1xyXG4gICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgYSBtYXAgb2YgYXR0YWNoZWQgaGFuZGxlcnNcclxuICAgIHZhciByb3V0ZXIgPSB7XHJcbiAgICAgICAgaGFuZGxlcnM6IFtdXHJcbiAgICB9LFxyXG4gICAgICAgIC8vIFZhcmlhYmxlIHRvIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgaGlzdG9yeSBBUEkgcHJvcGVybHkgICAgXHJcbiAgICAgICAgaXNIaXN0b3J5U3VwcG9ydGVkID0gaGlzdG9yeSAmJiBoaXN0b3J5LnB1c2hTdGF0ZSxcclxuICAgICAgICAvLyBEYXRhIGNhY2hlXHJcbiAgICAgICAgY2FjaGUgPSB7XHJcbiAgICAgICAgICAgIG5vVHJpZ2dlcjogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcclxuICAgICAgICByZWdleCA9IHtcclxuICAgICAgICAgICAgcGF0aG5hbWU6IC9eXFwvKD89W14/XSspLyxcclxuICAgICAgICAgICAgcm91dGVwYXJhbXM6IC86W15cXC9dKy9nXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTdXBwb3J0ZWQgZXZlbnRzXHJcbiAgICAgICAgZXZlbnROYW1lcyA9IHtcclxuICAgICAgICAgICAgcm91dGVDaGFuZ2VkOiBcInJvdXRlQ2hhbmdlZFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlc1xyXG4gICAgICAgIGVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgaW52YWxpZFBhdGg6IFwiUGF0aCBpcyBpbnZhbGlkXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYW55IGxpc3QgdG8gSmF2YVNjcmlwdCBhcnJheVxyXG4gICAgICogQHBhcmFtIHthcnJheX0gYXJyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYXJyKGFycikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZ2dlcnMgXCJyb3V0ZUNoYW5nZWRcIiBldmVudCB1bmxlc3MgXCJub1RyaWdnZXJcIiBmbGFnIGlzIHRydWVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3RyaWdnZXJSb3V0ZSgpIHtcclxuICAgICAgICBpZiAoY2FjaGUubm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIGNhY2hlLm5vVHJpZ2dlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyKGV2ZW50TmFtZXMucm91dGVDaGFuZ2VkLCB7IGRhdGE6IGNhY2hlLmRhdGEgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaHJvdyBKYXZhU2NyaXB0IGVycm9ycyB3aXRoIGN1c3RvbSBtZXNzYWdlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX3Rocm93RXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBnaXZlbiByb3V0ZSBpcyB2YWxpZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRSb3V0ZShzUm91dGUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNSb3V0ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiByZWdleC5wYXRobmFtZS50ZXN0KHNSb3V0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgcm91dGUgaXMgdmFsaWQgYW5kIHJldHVybnMgdGhlIHZhbGlkIHJvdXRlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc1JvdXRlIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfdmFsaWRhdGVSb3V0ZShzUm91dGUpIHtcclxuICAgICAgICBpZiAoX2lzVmFsaWRSb3V0ZShzUm91dGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzUm91dGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3Rocm93RXJyb3IoZXJyb3JNZXNzYWdlLmludmFsaWRQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgcm91dGUgZm9yIGdpdmVuIHZpZXdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZSBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfc2V0Um91dGUob1JvdXRlLCByZXBsYWNlTW9kZSwgbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBudWxsLFxyXG4gICAgICAgICAgICB0aXRsZSA9IG51bGwsXHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IFwiXCIsXHJcbiAgICAgICAgICAgIHJvdXRlTWV0aG9kID0gcmVwbGFjZU1vZGUgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIjtcclxuICAgICAgICBjYWNoZS5ub1RyaWdnZXIgPSBub1RyaWdnZXI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgY2FjaGUuZGF0YSA9IGRhdGEgPSBvUm91dGUuZGF0YTtcclxuICAgICAgICAgICAgdGl0bGUgPSBvUm91dGUudGl0bGU7XHJcbiAgICAgICAgICAgIHNSb3V0ZSA9IG9Sb3V0ZS5yb3V0ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvUm91dGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgc1JvdXRlID0gb1JvdXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNIaXN0b3J5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIGhpc3Rvcnlbcm91dGVNZXRob2RdKHsgZGF0YTogZGF0YSB9LCB0aXRsZSwgX3ZhbGlkYXRlUm91dGUoc1JvdXRlKSk7XHJcbiAgICAgICAgICAgIGlmICghbm9UcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCwgeyBkYXRhOiBjYWNoZS5kYXRhIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2VNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLnJlcGxhY2UoXCIjXCIgKyBzUm91dGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5oYXNoID0gX3ZhbGlkYXRlUm91dGUoc1JvdXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIGEgcm91dGUgaGFuZGxlciBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNSb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfcm91dGUoc1JvdXRlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJvdXRlci5oYW5kbGVycy5wdXNoKHtcclxuICAgICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCxcclxuICAgICAgICAgICAgaGFuZGxlcjogY2FsbGJhY2suYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgZWxlbWVudDogdGhpcyxcclxuICAgICAgICAgICAgcm91dGU6IHNSb3V0ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaW1zIGxlYWRpbmcvdHJhaWxpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW0gXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9zYW5pdGl6ZShzdHIpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL14oW15hLXpBLVowLTldKyl8KFteYS16QS1aMC05XSspJC9nLCBcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXBhcmVzIHJvdXRlIHdpdGggY3VycmVudCBVUkxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfbWF0Y2hlZChyb3V0ZSwgdXJsLCBwYXJhbXMpIHtcclxuICAgICAgICBpZiAocmVnZXgucm91dGVwYXJhbXMudGVzdChyb3V0ZSkpIHtcclxuICAgICAgICAgICAgdmFyIHBhdGhSZWdleCA9IG5ldyBSZWdFeHAocm91dGUucmVwbGFjZSgvXFwvL2csIFwiXFxcXC9cIikucmVwbGFjZSgvOlteXFwvXFxcXF0rL2csIFwiKFteXFxcXC9dKylcIikpO1xyXG4gICAgICAgICAgICBpZiAocGF0aFJlZ2V4LnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBfYXJyKHJvdXRlLm1hdGNoKHJlZ2V4LnJvdXRlcGFyYW1zKSkubWFwKF9zYW5pdGl6ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gX2Fycih1cmwubWF0Y2gocGF0aFJlZ2V4KSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wYXJhbXNba2V5XSA9IHZhbHVlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIChyb3V0ZSA9PT0gdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZ2dlcnMgYSByb3V0ZXIgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfcm91dGVUcmlnZ2VyKGV2ZW50TmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHBhcmFtcyBpcyBhbHdheXMgYW4gb2JqZWN0XHJcbiAgICAgICAgcGFyYW1zID0gJC5leHRlbmQocGFyYW1zLCB7fSk7XHJcbiAgICAgICAgcm91dGVyLmhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudE9iamVjdC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzSGlzdG9yeVN1cHBvcnRlZCAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50T2JqZWN0LmhhbmRsZXIocGFyYW1zLmRhdGEsIHBhcmFtcy5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXcubG9jYXRpb24uaGFzaCAmJiBfbWF0Y2hlZChldmVudE9iamVjdC5yb3V0ZSwgdy5sb2NhdGlvbi5wYXRobmFtZSwgcGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kYXRhID0gcGFyYW1zLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcubG9jYXRpb24ucmVwbGFjZShcIiNcIiArIHcubG9jYXRpb24ucGF0aG5hbWUpOyAvLyA8LS0gVGhpcyB3aWxsIHRyaWdnZXIgcm91dGVyIGhhbmRsZXIgYXV0b21hdGljYWxseVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX21hdGNoZWQoZXZlbnRPYmplY3Qucm91dGUsIHcubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSksIHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRPYmplY3QuaGFuZGxlcihwYXJhbXMuZGF0YSwgcGFyYW1zLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyByb3V0ZXIgZXZlbnRzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9iaW5kUm91dGVyRXZlbnRzKCkge1xyXG4gICAgICAgIGlmIChpc0hpc3RvcnlTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgJCh3KS5vbihcInBvcHN0YXRlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodykub24oXCJoYXNoY2hhbmdlXCIsIF90cmlnZ2VyUm91dGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoISQucm91dGVyKSB7XHJcbiAgICAgICAgLy8galF1ZXJ5IHJvdXRlciBvYmplY3RcclxuICAgICAgICAkLnJvdXRlciA9IHtcclxuICAgICAgICAgICAgZXZlbnRzOiBldmVudE5hbWVzLFxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJvdXRlci5ldmVudHMudHJpZ2dlcihldmVudE5hbWVzLnJvdXRlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpc3RvcnlTdXBwb3J0ZWQ6IGlzSGlzdG9yeVN1cHBvcnRlZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVHJpZ2dlcnMgZXZlbnQgZm9yIGpRdWVyeSByb3V0ZXJcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQucm91dGVyLmV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIF9yb3V0ZVRyaWdnZXIuYXBwbHkodGhpcywgW2V2ZW50TmFtZSwgcGFyYW1zXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGlmICghJC5mbi5yb3V0ZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZHMgYSBoYW5kbGVyIGZ1bmN0aW9uIGZvciBnaXZlbiByb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzUm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciByb3V0ZSA9ICQuZm4ucm91dGUgPSBmdW5jdGlvbiAoc1JvdXRlLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBfcm91dGUuYXBwbHkodGhpcywgW3NSb3V0ZSwgY2FsbGJhY2tdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghJC5yb3V0ZSkge1xyXG4gICAgICAgICAgICAkLnJvdXRlID0gcm91dGUuYmluZChudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoISQuc2V0Um91dGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDaGFuZ2VzIGN1cnJlbnQgcGFnZSByb3V0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb1JvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlTW9kZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmlnZ2VyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJC5zZXRSb3V0ZSA9IGZ1bmN0aW9uIChvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXIpIHtcclxuICAgICAgICAgICAgX3NldFJvdXRlLmFwcGx5KHRoaXMsIFtvUm91dGUsIHJlcGxhY2VNb2RlLCBub1RyaWdnZXJdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3V0ZXIgaW50ZXJuYWwgaW5pdCBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcm91dGVyLmluaXQgPSBfYmluZFJvdXRlckV2ZW50cztcclxuICAgIHJvdXRlci5pbml0KCk7XHJcbn0oXHJcbiAgICB3aW5kb3csXHJcbiAgICB3aW5kb3cualF1ZXJ5LFxyXG4gICAgd2luZG93Lmhpc3RvcnlcclxuICAgICkpOyJdLCJmaWxlIjoianF1ZXJ5LnJvdXRlci5qcyJ9
