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
            if (route.indexOf(`${e.hash ? '#' : ''}${e.route.substring(e.hash ? 1 : 0)}`) > -1) {
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
    let isCaseInsensitive = route.indexOf(CASE_INSENSITIVE_FLAG) === 0;
    if (isFunc(route)) {
        prevHandler = handler;
        handler = route;
        route = '*';
    }
    if (isArr(route)) {
        bindGenericRoute(route, handler);
        return;
    }
    route = route.substring(isCaseInsensitive ? CASE_INSENSITIVE_FLAG.length : 0);
    const containsHash = isHashURL(route);
    route = route.substring((containsHash ? 1 : 0));
    // Attach handler
    if (
        !libs.contains(ob => (ob.handler === handler && ob.route === route))
        && isFunc(handler)
    ) {
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
    const paths = containsHash ? [loc.hash] : [loc.pathname, loc.hash];
    paths.filter(path => trim(path)).forEach(currentPath => {
        let cRoute = isCaseInsensitive ? route.toLowerCase() : route;
        let cCurrentPath = isCaseInsensitive ? currentPath.toLowerCase() : currentPath;
        const containsHash = isHashURL(currentPath);
        const tr = testRoute(cRoute, cCurrentPath);
        if (tr.hasMatch && isFunc(handler)) {
            handler({
                route: currentPath,
                hash: containsHash,
                eventName: containsHash ? HASH_CHANGE : POP_STATE,
                data: tr.data,
                params: tr.params,
                query: getQueryParams(),
                isCaseInsensitive
            });
        }
    });
}
