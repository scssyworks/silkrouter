import { isArr, trim } from '../../utils/utils';
import { CASE_INSENSITIVE_FLAG, ROUTE_CHANGED, POP_STATE, HASH_CHANGE } from '../../utils/constants';
import { libs } from '../../utils/libs';
import { loc } from '../../utils/vars';
import testRoute from '../testRoute';
import getQueryParams from '../getQueryParams';

/**
 * Binds generic route if route is passed as a list of URLs
 * @private
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
export default function bindRoute(route, handler, prevHandler) {
    // Resolve generic route
    let isCaseInsensitive = false;
    if (typeof route === 'function') {
        prevHandler = handler;
        handler = route;
        route = '*';
    }
    if (isArr(route)) {
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
    const { pathname, hash } = loc;
    const paths = startIndex === 1 ? [hash] : [pathname, hash];
    paths.filter(path => trim(path)).forEach(currentPath => {
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
