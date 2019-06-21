/**
 * jQuery router plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
 *
 * @project      Jquery Routing Plugin
 * @date         2019-05-27
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery
 * @version      2.2.2
 */

import $ from 'jquery';
import deparam from 'deparam.js';

// Object containing a map of attached handlers
const libs = {
    handlers: []
};
// Variable to check if browser supports history API properly    
const isHistorySupported = history && history.pushState;

// Data cache
const cache = {
    noTrigger: false
};

// Regular expressions
const regex = {
    pathname: /^\/(?=[^?]*)/,
    routeparams: /:[^\/]+/g,
    hashQuery: /\?.+/
};

// Supported events
const eventNames = {
    routeChanged: "routeChanged",
    hashchange: "hashchange",
    popstate: "popstate"
};

// Error messages
const errorMessage = {
    invalidPath: "Path is invalid"
};

/**
 * Converts any list to JavaScript array
 * @param {any[]} arr Array like object
 */
function _arr(arr) {
    return Array.prototype.slice.call(arr);
}

/**
 * Tests if parameter is a valid JavaScript object
 * @param {any} testObject Test object
 */
function _resolveObject(testObject) {
    if (testObject !== null && typeof testObject === 'object') {
        return testObject;
    }
    return {};
}

/**
 * Triggers "routeChanged" event unless "noTrigger" flag is true
 */
function _triggerRoute(route, eventType, isHashRoute = false, isInit = false) {
    if (
        cache.noTrigger
        && eventType === eventNames.hashchange
    ) {
        cache.noTrigger = false;
        return;
    }
    cache.data = _resolveObject(cache.data);
    let ref = cache.data.data = _resolveObject(cache.data.data);
    let routeOb = {
        eventType: eventType,
        hash: !!isHashRoute,
        route: route,
        isInit
    };
    cache.data.data = {
        ...ref,
        ...routeOb
    };
    router.events.trigger(eventNames.routeChanged, cache.data);
}

/**
 * Throw JavaScript errors with custom message
 * @param {string} message Error message
 */
function _throwError(message) {
    throw new Error(message);
}

/**
 * Checks if given route is valid
 * @param {string} sRoute Route string
 */
function _isValidRoute(sRoute) {
    if (typeof sRoute !== "string") {
        return false;
    };
    return regex.pathname.test(sRoute);
}

/**
 * Adds a query string
 * @param {string} sRoute Route string
 * @param {string} qString Query string
 * @param {boolean} appendQString Append query string flag
 */
function _resolveQueryString(sRoute, qString, appendQString) {
    if (!qString && !appendQString) return sRoute;
    if (typeof qString === "string") {
        if ((qString = qString.trim()) && appendQString) {
            return sRoute + window.location.search + "&" + qString.replace("?", "");
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
function _getQueryParams(coerce = true) {
    let qsObject = deparam(window.location.search, coerce),
        hashStringParams = {};
    if (window.location.hash.match(regex.hashQuery)) {
        hashStringParams = deparam(window.location.hash.match(regex.hashQuery)[0], coerce);
    }
    return {
        ...qsObject,
        ...hashStringParams
    };
}

/**
 * Checks if route is valid and returns the valid route
 * @param {string} sRoute Route string
 * @param {string} qString Query string
 * @param {boolean} appendQString Append query string flag
 */
function _validateRoute(sRoute, qString, appendQString) {
    if (_isValidRoute(sRoute)) {
        return _resolveQueryString(sRoute, qString, appendQString);
    }
    _throwError(errorMessage.invalidPath);
}

/**
 * Set route for given view
 * @param {string|object} oRoute Route string or object
 * @param {boolean} replaceMode Replace mode
 * @param {boolean} noTrigger Do not trigger handler
 */
function _setRoute(oRoute, replaceMode, noTrigger) {
    if (!oRoute) return;
    let title = null,
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
            let routeOb = {
                eventType: eventNames.popstate,
                hash: false,
                route: sRoute
            };
            let ref = cache.data.data;
            cache.data.data = {
                ...ref,
                ...routeOb
            };
            router.events.trigger(eventNames.routeChanged, cache.data);
        }
    } else {
        if (replaceMode) {
            window.location.replace("#" + _validateRoute(sRoute, qString, appendQString));
        } else {
            window.location.hash = _validateRoute(sRoute, qString, appendQString);
        }
    }
}

/**
 * Attaches a route handler function
 * @param {string} sRoute Route string
 * @param {function} callback Callback function
 */
function _route(sRoute, callback) {
    if (typeof sRoute === 'function') {
        callback = sRoute;
        sRoute = '*'; // Generic route
    }
    if (!libs.handlers.filter(ob => {
        let filterCriteria = (ob.originalHandler === callback && ob.route === sRoute);
        if (this) {
            filterCriteria = filterCriteria && ob.element === this;
        }
        return filterCriteria;
    }).length) {
        libs.handlers.push({
            eventName: eventNames.routeChanged,
            originalHandler: callback,
            handler: callback.bind(this),
            element: this,
            route: sRoute
        });
    }
}

/**
 * 
 * @param {string} sRoute Route string
 * @param {function} callback Callback function
 */
function _unroute(sRoute, callback) {
    const args = arguments.length;
    if (args.length === 0) {
        libs.handlers.length = 0;
    }
    libs.handlers = libs.handlers.filter(routeOb => {
        if (args.length === 1 && typeof args[0] === 'string') {
            return routeOb.route !== sRoute;
        }
        // Check for generic route
        if (args.length === 1 && typeof args[0] === 'function') {
            callback = args[0];
            sRoute = '*'; // Generic route
        }
        return !(routeOb.route === sRoute && routeOb.handler === callback);
    });
}

/**
 * Trims leading/trailing special characters
 * @param {string} param Parameters
 */
function _sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
}

/**
 * Compares route with current URL
 * @param {string} route Route string
 * @param {string} url Current url
 * @param {object} params Parameters
 */
function _matched(route, url, params) {
    if (~url.indexOf("?")) {
        url = url.substring(0, url.indexOf("?"));
    }
    regex.routeparams.lastIndex = 0;
    if (regex.routeparams.test(route)) {
        params.params = {};
        const pathRegex = new RegExp(route.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
        if (pathRegex.test(url)) {
            regex.routeparams.lastIndex = 0;
            let keys = _arr(route.match(regex.routeparams)).map(_sanitize),
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
 * @param {string} eventName Name of route event
 * @param {object} params Parameters
 */
function _routeTrigger(eventName, params) {
    // Ensures that params is always an object
    params = _resolveObject(params);
    params.data = _resolveObject(params.data);
    const { hash: isHashRoute, isInit } = params.data;
    libs.handlers.forEach(function (eventObject) {
        if (eventObject.eventName === eventName) {
            if (
                isHistorySupported
                && !isHashRoute
                && _matched(eventObject.route, window.location.pathname, params)
                && !(
                    isInit
                    && eventObject.called
                )
            ) {
                eventObject.called = true;
                eventObject.handler(params.data, params.params, _getQueryParams(false));
            } else if (isHashRoute) {
                if (!window.location.hash && !isHistorySupported && _matched(eventObject.route, window.location.pathname, params)) {
                    cache.data = params.data;
                    window.location.replace("#" + window.location.pathname); // <-- This will trigger router handler automatically
                } else if (
                    _matched(eventObject.route, window.location.hash.substring(1), params)
                    && !(
                        isInit
                        && eventObject.hashCalled
                    )
                ) {
                    eventObject.hashCalled = true;
                    eventObject.handler(params.data, params.params, _getQueryParams(false));
                }
            }
        }
    });
}

/**
 * Initializes router events
 */
function _bindRouterEvents() {
    const $win = $(window);
    $win.on(eventNames.popstate, function (e) {
        _triggerRoute.apply(this, [window.location.pathname, e.type]);
    });
    $win.on(eventNames.hashchange, function (e, isInit) {
        _triggerRoute.apply(this, [window.location.hash, e.type, true, isInit]);
    });
}

const router = {
    // Events object
    events: {
        // Available event names
        ...eventNames,
        /**
         * Triggers a custom route event
         * @param {string} eventName Name of event
         * @param {object} params Parameters object
         */
        trigger(eventName, params) {
            return _routeTrigger.apply(this, [eventName, params]);
        }
    },
    /**
     * Initializes router
     */
    init: function () {
        // Routing settings
        let settings = {
            eventType: (isHistorySupported ? eventNames.popstate : eventNames.hashchange),
            hash: !isHistorySupported,
            route: (isHistorySupported ? window.location.pathname : window.location.hash),
            isInit: true
        };
        // Triggers route change event on initialize
        this.events.trigger(eventNames.routeChanged, {
            data: settings
        });
        // Triggers a hashchange event on initialize if url hash is available
        if (window.location.hash) {
            $(window).trigger(eventNames.hashchange, [true]);
        }
    },
    /**
     * Sets a route url
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set() {
        return _setRoute.apply(this, arguments);
    },
    // Flag to check if history API is supported in current browser
    historySupported: isHistorySupported
}

/**
 * Attaches a route handler
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function route() {
    return _route.apply(this, arguments);
}

/**
 * Detaches a route handler
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function unroute() {
    return _unroute.apply(this, arguments);
}

// Hooking route and router to jQuery
if (typeof $ === 'function') {
    $.route = $.prototype.route = route;
    $.unroute = $.prototype.unroute = unroute;
    $.router = router;
}

_bindRouterEvents();

export { router, route, unroute };