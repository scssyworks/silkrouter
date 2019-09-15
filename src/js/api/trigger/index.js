import { loc } from '../../utils/vars';
import { libs } from '../../utils/libs';
import getQueryParams from '../getQueryParams';
import testRoute from '../testRoute';
import { assign } from '../../utils/assign';

/**
 * Triggers a router event
 * @private
 * @param {string} eventName Name of route event
 * @param {object} params Parameters
 */
export default function execListeners(eventName, routeConfig, originalData) {
    originalData = assign(originalData);
    const { hash: isHash } = routeConfig;
    const { hash, pathname } = loc;
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
                ob.handler(assign({}, routeConfig, {
                    data,
                    params,
                    query: getQueryParams()
                }));
            }
        }
    });
}