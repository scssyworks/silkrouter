/**!
 * jQuery router plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
 *
 * @project      Jquery Routing Plugin
 * @date         2019-05-05
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery, jquerydeparam, lzstorage
 * @version      3.0.0-beta.0
 */

import $ from 'jquery';
import deparam from 'jquerydeparam';
import { POP_STATE, HASH_CHANGE, ROUTE_CHANGED, REG_ROUTE_PARAMS, INVALID_ROUTE, REG_HASH_QUERY, REG_PATHNAME } from './utils/constants';
import { libs } from './utils/libs';

// Variable to check if browser supports history API properly    
const isHistorySupported = !!(history && history.pushState);

// Variable to ignore hashchange event
let ignoreHashChange = false;

/**
 * Trims leading/trailing special characters
 * @param {string} param Parameters
 */
function sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
}

/**
 * Triggers "routeChanged" event unless "noTrigger" flag is true
 */
function triggerRoute(route, eventType, hash = false, noTrigger = false, originalData = {}) {
    if (noTrigger) {
        ignoreHashChange = false;
    } else {
        router.api.trigger(
            ROUTE_CHANGED,
            {
                route,
                eventType,
                hash
            },
            originalData
        );
    }
}

/**
 * Checks if given route is valid
 * @param {string} route Route string
 */
function isValidRoute(route) {
    if (typeof route !== "string") {
        return false;
    };
    return REG_PATHNAME.test(route);
}

/**
 * Adds a query string
 * @param {string} route Route string
 * @param {string} qString Query string
 * @param {boolean} appendQString Append query string flag
 */
function resolveQuery(route, queryString, append) {
    if (typeof queryString === 'string') {
        queryString = queryString.trim();
        if (queryString.charAt(0) === '?') {
            queryString = queryString.substring(1);
        }
        if (append && queryString) {
            return `${route}${window.location.search}&${queryString}`;
        }
        if (!append && queryString) {
            return `${route}?${queryString}`;
        }
    }
    return route;
}

/**
 * Converts current query string into an object
 */
function getQueryParams() {
    const qsObject = deparam(window.location.search);
    const hashStringParams = {};
    if (window.location.hash.match(REG_HASH_QUERY)) {
        $.extend(hashStringParams, deparam(window.location.hash.match(REG_HASH_QUERY)[0]));
    }
    return $.extend(qsObject, hashStringParams);
}

/**
 * Set route for given view
 * @param {string|object} oRoute Route string or object
 * @param {boolean} replaceMode Replace mode
 * @param {boolean} noTrigger Do not trigger handler
 */
function execRoute(route, replaceMode, noTrigger) {
    const routeObject = typeof route === 'string' ? { route } : $.extend({}, route);
    $.extend(routeObject, {
        replaceMode,
        noTrigger
    });
    const { route: sroute, replaceMode: rm, noTrigger: nt, queryString: qs, data, title = null, appendQuery } = routeObject;
    if (typeof sroute === 'string') {
        const isHash = sroute.charAt(0) === '#' ? 1 : 0;
        let [pureRoute, queryString] = sroute.trim().split('?');
        const routeMethod = `${rm ? 'replace' : 'push'}State`;
        queryString = queryString || qs;
        ignoreHashChange = nt;
        pureRoute = pureRoute.substring(isHash);
        if (isValidRoute(pureRoute)) {
            libs.setDataToStore(pureRoute, isHash === 1, data);
            if (isHistorySupported && !isHash) {
                history[routeMethod]({ data }, title, resolveQuery(pureRoute, queryString, appendQuery));
                if (!nt) {
                    router.api.trigger(ROUTE_CHANGED, {
                        route: pureRoute,
                        eventType: POP_STATE,
                        hash: false
                    });
                }
            } else if (rm) {
                window.location.replace(`#${resolveQuery(pureRoute, queryString, appendQuery)}`);
            } else {
                window.location.hash = resolveQuery(pureRoute, queryString, appendQuery);
            }
        } else {
            throw new Error(INVALID_ROUTE);
        }
    }
}

/**
 * Attaches a route handler function
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
function bindRoute(route, handler) {
    let originalHandler = handler;
    const element = this;
    if (typeof handler === 'function') {
        handler = handler.bind(this);
    }
    // Resolve generic route
    if (typeof route === 'function') {
        originalHandler = route;
        handler = route.bind(this);
        route = '*';
    }
    // Check existence
    const exists = libs.handlers.filter(ob => {
        let test = (ob.originalHandler === originalHandler && ob.route === route);
        if (this) {
            test = test && ob.element === this;
        }
        return test;
    }).length;
    // Attach handler
    if (!exists && typeof handler === 'function') {
        libs.handlers.push({
            eventName: ROUTE_CHANGED,
            originalHandler,
            handler,
            element,
            route
        });
    }
    // Execute handler if matches current route (Replaces init method in version 2.0)
    const { pathname, hash } = window.location;
    [pathname, hash].forEach(currentPath => {
        const isHash = currentPath.charAt(0) === '#' ? 1 : 0;
        const { hasMatch, data, params } = testRoute(route, currentPath);
        if (hasMatch && typeof handler === 'function') {
            handler({
                route: currentPath,
                hash: isHash === 1,
                eventName: isHash ? HASH_CHANGE : POP_STATE,
                data,
                params,
                query: getQueryParams()
            });
        }
    });
}

/**
 * Unbinds route handlers
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
function unbindRoute(route, handler) {
    const args = arguments;
    if (args.length === 0) {
        libs.handlers.length = 0;
    }
    libs.handlers = libs.handlers.filter(ob => {
        if (args.length === 1 && typeof args[0] === 'string') {
            return ob.route !== route;
        }
        // Check for generic route
        if (args.length === 1 && typeof args[0] === 'function') {
            handler = args[0];
            route = '*'; // Generic route
        }
        return !(ob.route === route && ob.handler === handler);
    });
}


/**
 * Compares route with current URL
 * @param {string} route Route string
 * @param {string} url Current url
 * @param {object} params Parameters
 */
function testRoute(route, url, originalData = {}) {
    const isHash = url.charAt(0) === '#';
    if (isHash) {
        url = url.substring(1);
    }
    const [path] = url.split('?');
    if (!$.isEmptyObject(originalData)) {
        libs.setDataToStore(path, isHash, originalData); // Sync store with event data.
    }
    const data = $.extend({}, libs.getDataFromStore(path, isHash));
    const params = {};
    let hasMatch = false;
    REG_ROUTE_PARAMS.lastIndex = 0;
    if (REG_ROUTE_PARAMS.test(route)) {
        const pathRegex = new RegExp(route.replace(/\//g, "\\/").replace(/:[^\/\\]+/g, "([^\\/]+)"));
        if (pathRegex.test(url)) {
            hasMatch = true;
            REG_ROUTE_PARAMS.lastIndex = 0;
            const keys = [...route.match(REG_ROUTE_PARAMS)].map(sanitize);
            const values = [...url.match(pathRegex)];
            values.shift();
            keys.forEach((key, index) => {
                params[key] = values[index];
            });
        }
    } else {
        hasMatch = isValidRoute(url) && ((route === url) || (route === '*'));
    }
    return {
        hasMatch,
        data,
        params
    };
}

/**
 * Triggers a router event
 * @param {string} eventName Name of route event
 * @param {object} params Parameters
 */
function execListeners(eventName, routeConfig, originalData = {}) {
    const { hash: isHash } = routeConfig;
    const { hash, pathname } = window.location;
    libs.handlers.forEach(ob => {
        if (ob.eventName === eventName) {
            const { hasMatch, data, params } = testRoute(
                ob.route,
                (
                    (isHistorySupported && !isHash)
                        ? pathname
                        : (
                            hash || pathname
                        )
                ),
                originalData
            );
            if (
                !isHistorySupported
                && !hash
            ) {
                // Fallback to hash routes for older browsers
                window.location.replace(`#${pathname}`);
            } else if (hasMatch) {
                ob.handler($.extend(routeConfig, {
                    data,
                    params,
                    query: getQueryParams()
                }));
            }
        }
    });
}

/**
 * Initializes router events
 */
function initRouterEvents() {
    $(window).on(`${POP_STATE} ${HASH_CHANGE}`, function (e) {
        const isHash = e.type === 'hashchange';
        const noTrigger = ignoreHashChange;
        const { originalEvent } = e;
        let originalData = {};
        if (originalEvent && originalEvent.state) {
            const { data } = originalEvent.state;
            $.extend(originalData, data);
        }
        console.log(e.originalEvent.state);
        return triggerRoute.apply(this, [
            window.location[isHash ? 'hash' : 'pathname'],
            e.type,
            isHash,
            noTrigger,
            originalData
        ]);
    });
}

const router = {
    // Events object
    api: {
        /**
         * Triggers a custom route event
         */
        trigger() {
            return execListeners.apply(this, arguments);
        }
    },
    /**
     * Sets a route url
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set() {
        return execRoute.apply(this, arguments);
    },
    // Flag to check if history API is supported in current browser
    isHistorySupported
}

/**
 * Attaches a route handler
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function route() {
    return bindRoute.apply(this, arguments);
}

/**
 * Detaches a route handler
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function unroute() {
    return unbindRoute.apply(this, arguments);
}

// Hooking route and router to jQuery
if (typeof $ === 'function') {
    $.route = $.prototype.route = route;
    $.unroute = $.prototype.unroute = unroute;
    $.router = router;
}

initRouterEvents();

export { router, route };