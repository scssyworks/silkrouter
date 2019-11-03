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
    if (isRouteList && !handler) return 0; // Fix for accidently removing all generic routes if there is no handler for list route
    const args = toArray(arguments);
    if (args.length === 0) {
        libs.handlers.length = 0;
        return prevLength;
    }
    route = isRouteList ? '*' : route;
    libs.handlers.forEach(ob => {
        let test = ob.route === route;
        const singleArg = args.length === 1;
        if (!(singleArg && typeof route === 'string' && !isRouteList)) {
            if (singleArg && isFunc(route)) {
                handler = route;
                route = '*';
            }
            test = test && (
                ob.handler === handler
                || ob.prevHandler === handler
            );
        }
        if (test) {
            libs.remove(ob);
        }
    });
    return (prevLength - libs.handlers.length);
}