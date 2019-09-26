import { isArr, trim, isHashURL, isFunc } from '../../utils/utils';
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
    if (libs.contains(ob => (ob.prevHandler === handler))) {
        return;
    }
    bindRoute((e) => {
        if (isFunc(handler)) {
            const compareRoute = e.route.substring(e.hash ? 1 : 0);
            if (route.indexOf(`${e.hash ? '#' : ''}${compareRoute}`) > -1) {
                handler.apply(this, [e]);
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
    if (isFunc(route)) {
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
    const containsHash = isHashURL(route);
    route = route.substring((containsHash ? 1 : 0));
    // Check existence
    const exists = libs.contains(ob => (ob.handler === handler && ob.route === route));
    // Attach handler
    if (!exists && isFunc(handler)) {
        libs.handlers.push({
            eventName: ROUTE_CHANGED,
            handler,
            prevHandler,
            route,
            hash: containsHash,
            isCaseInsensitive
        });
    }
    // Execute handler if matches current route (Replaces init method in version 2.0)
    const { pathname, hash } = loc;
    const paths = containsHash ? [hash] : [pathname, hash];
    paths.filter(path => trim(path)).forEach(currentPath => {
        let cRoute = route;
        let cCurrentPath = currentPath;
        if (isCaseInsensitive) {
            cRoute = cRoute.toLowerCase();
            cCurrentPath = cCurrentPath.toLowerCase();
        }
        const containsHash = isHashURL(currentPath);
        const { hasMatch, data, params } = testRoute(cRoute, cCurrentPath);
        if (hasMatch && isFunc(handler)) {
            handler({
                route: currentPath,
                hash: containsHash,
                eventName: containsHash ? HASH_CHANGE : POP_STATE,
                data,
                params,
                query: getQueryParams(),
                isCaseInsensitive
            });
        }
    });
}
