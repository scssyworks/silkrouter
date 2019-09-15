import { libs } from '../../utils/libs';
import { isArr } from '../../utils/utils';

/**
 * Unbinds route handlers
 * @private
 * @param {string} route Route string
 * @param {function} handler Callback function
 */
export default function unbindRoute(...args) {
    let [route, handler] = args;
    const prevLength = libs.handlers.length;
    let isRouteList = false;
    if (args.length === 0) {
        libs.handlers.length = 0;
    }
    if (isArr(route)) {
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