/**!
 * Router plugin for single page applications with routes
 * Release under the MIT license
 * @name Silk router
 * @author Sachin Singh <ssingh.300889@gmail.com>
 * @version 3.0.0.beta.6
 * @license MIT
 */

import deparam from 'deparam.js';
import { POP_STATE, HASH_CHANGE, ROUTE_CHANGED, REG_ROUTE_PARAMS, INVALID_ROUTE, REG_HASH_QUERY, REG_PATHNAME } from './utils/constants';
import { libs } from './utils/libs';

/**
 * Trims leading/trailing special characters
 * @private
 * @param {string} param Parameters
 */
function sanitize(str) {
    return str.replace(/^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$/g, "");
}

/**
 * Triggers "route.changed" event
 * @private
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
 * @private
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
 * @private
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
 * @private
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
 * @private
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
 * @private
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
function bindRoute(route, handler) {
    // Resolve generic route
    if (typeof route === 'function') {
        handler = route;
        route = '*';
    }
    const startIndex = route.charAt(0) === '#' ? 1 : 0;
    route = route.substring(startIndex);
    // Check existence
    const exists = libs.handlers.filter(ob => {
        return (ob.handler === handler && ob.route === route);
    }).length;
    // Attach handler
    if (!exists && typeof handler === 'function') {
        libs.handlers.push({
            eventName: ROUTE_CHANGED,
            handler,
            route,
            hash: startIndex === 1
        });
    }
    // Execute handler if matches current route (Replaces init method in version 2.0)
    const { pathname, hash } = window.location;
    const paths = startIndex === 1 ? [hash] : [pathname, hash];
    paths.filter(path => path.trim()).forEach(currentPath => {
        const pathIndex = currentPath.charAt(0) === '#' ? 1 : 0;
        const { hasMatch, data, params } = testRoute(route, currentPath);
        if (hasMatch && typeof handler === 'function') {
            handler({
                route: currentPath,
                hash: pathIndex === 1,
                eventName: pathIndex === 1 ? HASH_CHANGE : POP_STATE,
                data,
                params,
                query: getQueryParams()
            });
        }
    });
}

/**
 * Unbinds route handlers
 * @private
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
 * @private
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
    const data = libs.getDataFromStore(path, isHash);
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
 * @private
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
            if (hasMatch && (!ob.hash || (ob.hash && isHash))) {
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
 * @private
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

/**
 * @namespace router
 * @type {object}
 */
const router = {
    /**
     * @namespace api
     * @memberof router
     * @type {object}
     */
    api: {
        /**
         * Triggers a custom route event
         * @method trigger
         * @memberof router.api
         */
        trigger() {
            return execListeners.apply(this, arguments);
        }
    },
    /**
     * Sets a route url
     * @public
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
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function route() {
    return bindRoute.apply(this, arguments);
}

/**
 * Detaches a route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function unroute() {
    return unbindRoute.apply(this, arguments);
}

initRouterEvents();

export { router, route, unroute };