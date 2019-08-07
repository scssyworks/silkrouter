import deparam from 'deparam.js';
import { POP_STATE, HASH_CHANGE, ROUTE_CHANGED, INVALID_ROUTE, REG_HASH_QUERY, REG_PATHNAME, CASE_INSENSITIVE_FLAG } from './constants';
import { libs } from './libs';
import { extractParams } from './params';
import { toQueryString } from './query';

/**
 * Triggers "route.changed" event
 * @private
 * @param {object} config Route event configuration
 * @param {object} config.originalEvent Original "popstate" event object
 * @param {string} config.route route string
 * @param {string} config.type Type of event
 * @param {boolean} config.hash Flag that determines type of event expected
 * @param {object} config.originalData Original data persisted by history API
 */
function triggerRoute({ originalEvent = {}, route, type, hash = false, originalData = {} }) {
    trigger(
        ROUTE_CHANGED,
        {
            originalEvent,
            route,
            type,
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
    if (typeof route === "string") {
        return REG_PATHNAME.test(route);
    };
    return false;
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
function getQueryParams(coerce = false) {
    const qsObject = deparam(window.location.search, coerce);
    let hashStringParams = {};
    if (window.location.hash.match(REG_HASH_QUERY)) {
        hashStringParams = {
            ...hashStringParams,
            ...deparam(window.location.hash.match(REG_HASH_QUERY)[0], coerce)
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
export function execRoute(route = {}, replaceMode = false, noTrigger = false) {
    let routeObject = typeof route === 'string' ? { route } : {
        ...route
    };
    routeObject = {
        ...routeObject,
        replaceMode,
        noTrigger
    };
    const {
        route: sroute,
        replaceMode: rm,
        noTrigger: nt,
        queryString: qs = '',
        data,
        title = null,
        appendQuery
    } = routeObject;
    if (typeof sroute === 'string') {
        const isHash = sroute.charAt(0) === '#' ? 1 : 0;
        let [pureRoute, queryString = ''] = sroute.trim().split('?');
        const routeMethod = `${rm ? 'replace' : 'push'}State`;
        queryString = toQueryString(queryString || qs);
        pureRoute = pureRoute.substring(isHash);
        if (isValidRoute(pureRoute)) {
            libs.setDataToStore(pureRoute, isHash === 1, data);
            const completeRoute = resolveQuery(pureRoute, isHash === 1, queryString, appendQuery);
            history[routeMethod]({ data }, title, completeRoute);
            if (!nt) {
                triggerRoute(
                    {
                        route: `${isHash ? '#' : ''}${pureRoute}`,
                        type: (isHash ? HASH_CHANGE : POP_STATE),
                        hash: (isHash === 1)
                    }
                );
            }
        } else {
            throw new Error(INVALID_ROUTE);
        }
    }
}

/**
 * Binds generic route if route is passed as a list of URLs
 * @param {string[]} route Array of routes
 * @param {*} handler Handler function
 */
function bindGenericRoute(route, handler) {
    if (libs.handlers.filter(ob => (ob.prevHandler === handler)).length) {
        return;
    }
    bindRoute((...args) => {
        if (typeof handler === 'function') {
            const [e] = args;
            let compareRoute = e.route;
            if (compareRoute.charAt(0) === '#') {
                compareRoute = compareRoute.substring(1);
            }
            if (route.indexOf(compareRoute) > -1) {
                handler.apply(this, args);
            } else if (
                route.indexOf(`#${compareRoute}`) > -1
                && e.hash
            ) {
                handler.apply(this, args);
            }
        }
    }, handler);
}

/**
 * Attaches a route handler function
 * @private
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
export function bindRoute(route, handler, prevHandler) {
    // Resolve generic route
    let isCaseInsensitive = false;
    if (typeof route === 'function') {
        prevHandler = handler;
        handler = route;
        route = '*';
    }
    if (Array.isArray(route)) {
        bindGenericRoute(route, handler);
        return;
    }
    if (route.indexOf(CASE_INSENSITIVE_FLAG) === 0) {
        isCaseInsensitive = true;
        route = route.substring(CASE_INSENSITIVE_FLAG.length);
    }
    const startIndex = route.charAt(0) === '#' ? 1 : 0;
    route = route.substring(startIndex);
    // Check existence
    const exists = libs.handlers.filter(ob => (ob.handler === handler && ob.route === route)).length;
    // Attach handler
    if (!exists && typeof handler === 'function') {
        libs.handlers.push({
            eventName: ROUTE_CHANGED,
            handler,
            prevHandler,
            route,
            hash: startIndex === 1,
            isCaseInsensitive
        });
    }
    // Execute handler if matches current route (Replaces init method in version 2.0)
    const { pathname, hash } = window.location;
    const paths = startIndex === 1 ? [hash] : [pathname, hash];
    paths.filter(path => path.trim()).forEach(currentPath => {
        let cRoute = route;
        let cCurrentPath = currentPath;
        if (isCaseInsensitive) {
            cRoute = cRoute.toLowerCase();
            cCurrentPath = cCurrentPath.toLowerCase();
        }
        const pathIndex = currentPath.charAt(0) === '#' ? 1 : 0;
        const { hasMatch, data, params } = testRoute(cRoute, cCurrentPath);
        if (hasMatch && typeof handler === 'function') {
            handler({
                route: currentPath,
                hash: pathIndex === 1,
                eventName: pathIndex === 1 ? HASH_CHANGE : POP_STATE,
                data,
                params,
                query: getQueryParams(),
                isCaseInsensitive
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
export function unbindRoute(...args) {
    let [route, handler] = args;
    const prevLength = libs.handlers.length;
    let isRouteList = false;
    if (args.length === 0) {
        libs.handlers.length = 0;
    }
    if (Array.isArray(route)) {
        route = '*';
        isRouteList = true;
    }
    libs.handlers = libs.handlers.filter(ob => {
        if (args.length === 1 && typeof args[0] === 'string' && !isRouteList) {
            return ob.route !== route;
        }
        // Check for generic route
        if (args.length === 1 && typeof args[0] === 'function') {
            handler = args[0];
            route = '*'; // Generic route
        }
        return !(ob.route === route && (
            ob.handler === handler
            || ob.prevHandler === handler
        ));
    });
    return (prevLength > libs.handlers.length);
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
    const params = extractParams(route, url);
    let hasMatch = Object.keys(params).length > 0 || (
        isValidRoute(url) && ((route === url) || (route === '*'))
    );
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
            let cRoute = ob.route;
            let cCurrentPath = (isHash ? hash : pathname);
            if (ob.isCaseInsensitive) {
                cRoute = cRoute.toLowerCase();
                cCurrentPath = cCurrentPath.toLowerCase();
            }
            const { hasMatch, data, params } = testRoute(
                cRoute,
                cCurrentPath,
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
 * Internal method to trigger a routing event
 * @private
 */
export function trigger(...args) {
    return execListeners.apply(this, args);
}

/**
 * Initializes router events
 * @private
 */
export function initRouterEvents() {
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
        triggerRoute({
            originalEvent: e,
            route: pathname,
            type: e.type,
            hash: false,
            originalData
        });
        if (hashstring) {
            triggerRoute({
                originalEvent: e,
                route: `#${hashstring}`,
                type: HASH_CHANGE,
                hash: true,
                originalData
            });
        }
    });
}