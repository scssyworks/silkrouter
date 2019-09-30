import { libs } from '../../utils/libs';
import { isArr, isFunc, toArray } from '../../utils/utils';

/**
 * Unbinds route handlers
 * @private
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
export default function unbindRoute(route, handler) {
    const prevLength = libs.handlers.length;
    let isRouteList = isArr(route);
    const args = toArray(arguments);
    if (args.length === 0) {
        libs.handlers.length = 0;
        return prevLength;
    }
    if (isRouteList) {
        route = '*';
    }
    libs.handlers = libs.handlers.filter(ob => {
        if (args.length === 1 && typeof route === 'string' && !isRouteList) {
            return ob.route !== route;
        }
        // Check for generic route
        if (args.length === 1 && isFunc(route)) {
            handler = route;
            route = '*'; // Generic route
        }
        return !(ob.route === route && (
            ob.handler === handler
            || ob.prevHandler === handler
        ));
    });
    return (prevLength - libs.handlers.length);
}