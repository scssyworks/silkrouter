import { assign } from '../../utils/assign';
import { trim, isValidRoute } from '../../utils/utils';
import { toQueryString } from '../../utils/query';
import { libs } from '../../utils/libs';
import resolveQuery from '../resolveQuery';
import triggerRoute from '../triggerRoute';
import { INVALID_ROUTE, HASH_CHANGE, POP_STATE } from '../../utils/constants';

/**
 * Set route for given view
 * @private
 * @param {string|object} oRoute Route string or object
 * @param {boolean} replaceMode Replace mode
 * @param {boolean} noTrigger Do not trigger handler
 */
export default function execRoute(route, replaceMode, noTrigger) {
    let routeObject = typeof route === 'string' ? { route } : assign({}, route);
    routeObject = assign({}, routeObject, {
        replaceMode,
        noTrigger
    });
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
        const routeParts = trim(sroute).split('?');
        let pureRoute = routeParts[0];
        let queryString = trim(routeParts[1]);
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
                        originalEvent: {},
                        route: `${isHash ? '#' : ''}${pureRoute}`,
                        type: (isHash ? HASH_CHANGE : POP_STATE),
                        hash: (isHash === 1),
                        originalData: {}
                    }
                );
            }
        } else {
            throw new Error(INVALID_ROUTE);
        }
    }
}
