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
export default function execListeners(eventName, rc, originalData) {
    originalData = assign(originalData);
    libs.handlers.forEach(ob => {
        if (ob.eventName === eventName) {
            const currentPath = loc[rc.hash ? 'hash' : 'pathname'];
            const tr = testRoute(
                (ob.isCaseInsensitive ? ob.route.toLowerCase() : ob.route),
                (ob.isCaseInsensitive ? currentPath.toLowerCase() : currentPath),
                originalData
            );
            if (tr.hasMatch && (!ob.hash || (ob.hash && rc.hash))) {
                ob.handler(assign({}, rc, {
                    data: tr.data,
                    params: tr.params,
                    query: getQueryParams()
                }));
            }
        }
    });
}