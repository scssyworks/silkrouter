/**!
 * Silk router plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE10+, Chrome, Safari, Firefox
 *
 * @project      Silk Routing Plugin
 * @date         2019-05-05
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies deparam.js, lzstorage
 * @version      3.0.0-beta.4
 */

import deparam from 'deparam.js';
import { POP_STATE, HASH_CHANGE, ROUTE_CHANGED, REG_ROUTE_PARAMS, INVALID_ROUTE, REG_HASH_QUERY, REG_PATHNAME } from './utils/constants';
import { libs } from './utils/libs';

/**
 * Trims leading/trailing special characters
 * @param {string} param Parameters
 */
function sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
}

/**
 * Triggers "route.changed" event
 */
function triggerRoute(route, eventType, hash = false, originalData = {}) {
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
function resolveQuery(route = '', isHash = false, queryString = '', append = false) {
    queryString = queryString.charAt(0) === '?' ? queryString.substring(1).trim() : queryString.trim();
    if (!isHash) {
        if (append) {
            if (queryString) {
                return `${route}${location.search}&${queryString}`;
            }
            return `${route}${location.search}`;
        } else if (queryString) {
            return `${route}?${queryString}`;
        }
        return route;
    } else if (queryString) {
        return `${location.pathname}${location.search}#${route}?${queryString}`;
    }
    return `${location.pathname}${location.search}#${route}`;
}

/**
 * Converts current query string into an object
 */
function getQueryParams() {
    const qsObject = deparam(window.location.search);
    let hashStringParams = {};
    if (window.location.hash.match(REG_HASH_QUERY)) {
        hashStringParams = {
            ...hashStringParams,
            ...deparam(window.location.hash.match(REG_HASH_QUERY)[0])
        };
    }
    return {
        ...qsObject,
        ...hashStringParams
    };
}

/**
 * Set route for given view
 * @param {string|object} oRoute Route string or object
 * @param {boolean} replaceMode Replace mode
 * @param {boolean} noTrigger Do not trigger handler
 */
function execRoute(route = {}, replaceMode = false, noTrigger = false) {
    let routeObject = typeof route === 'string' ? { route } : {
        ...route
    };
    routeObject = {
        ...routeObject,
        replaceMode,
        noTrigger
    };
    const { route: sroute, replaceMode: rm, noTrigger: nt, queryString: qs = '', data, title = null, appendQuery } = routeObject;
    if (typeof sroute === 'string') {
        const isHash = sroute.charAt(0) === '#' ? 1 : 0;
        let [pureRoute, queryString = ''] = sroute.trim().split('?');
        const routeMethod = `${rm ? 'replace' : 'push'}State`;
        queryString = queryString || qs;
        pureRoute = pureRoute.substring(isHash);
        if (isValidRoute(pureRoute)) {
            libs.setDataToStore(pureRoute, isHash === 1, data);
            const completeRoute = resolveQuery(pureRoute, isHash === 1, queryString, appendQuery);
            history[routeMethod]({ data }, title, completeRoute);
            if (!nt) {
                triggerRoute(
                    `${isHash ? '#' : ''}${pureRoute}`,
                    (isHash ? HASH_CHANGE : POP_STATE),
                    (isHash === 1)
                );
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
    if (!!Object.keys(originalData).length) {
        libs.setDataToStore(path, isHash, originalData); // Sync store with event data.
    }
    const data = { ...libs.getDataFromStore(path, isHash) };
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
                (isHash ? hash : pathname),
                originalData
            );
            if (hasMatch) {
                ob.handler({
                    ...routeConfig,
                    data,
                    params,
                    query: getQueryParams()
                });
            }
        }
    });
}

/**
 * Initializes router events
 */
function initRouterEvents() {
    window.addEventListener(`${POP_STATE}`, function (e) {
        const completePath = `${location.pathname}${location.hash}`;
        const [pathname, hashstring] = completePath.split('#');
        let originalData = {};
        if (e.state) {
            const { data } = e.state;
            if (data) {
                originalData = data;
            }
        }
        triggerRoute(pathname, e.type, false, originalData);
        if (hashstring) {
            triggerRoute(`#${hashstring}`, HASH_CHANGE, true, originalData);
        }
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
    }
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

initRouterEvents();

export { router, route, unroute };