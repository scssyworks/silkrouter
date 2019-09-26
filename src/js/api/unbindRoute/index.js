import { libs } from '../../utils/libs';
import { isArr, isFunc } from '../../utils/utils';

/**
 * Unbinds route handlers
 * @private
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
export default function unbindRoute(route, handler) {
    const prevLength = libs.handlers.length;
    let isRouteList = false;
    if (arguments.length === 0) {
        libs.handlers.length = 0;
    }
    if (isArr(route)) {
        route = '*';
        isRouteList = true;
    }
    libs.handlers = libs.handlers.filter(ob => {
        if (arguments.length === 1 && typeof route === 'string' && !isRouteList) {
            return ob.route !== route;
        }
        // Check for generic route
        if (arguments.length === 1 && isFunc(route)) {
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