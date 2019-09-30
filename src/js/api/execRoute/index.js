import { assign } from '../../utils/assign';
import { trim, isValidRoute, isHashURL } from '../../utils/utils';
import { toQueryString } from '../../utils/query';
import { libs } from '../../utils/libs';
import resolveQuery from '../resolveQuery';
import triggerRoute from '../triggerRoute';
import { INVALID_ROUTE } from '../../utils/constants';

/**
 * Set route for given view
 * @private
 * @param {string|object} oRoute Route string or object
 * @param {boolean} replaceMode Replace mode
 * @param {boolean} noTrigger Do not trigger handler
 */
export default function execRoute(route, replaceMode, noTrigger) {
    let ro = assign(
        { replaceMode, noTrigger },
        (
            typeof route === 'string'
                ? { route }
                : route
        )
    );
    if (typeof ro.route === 'string') {
        const hash = isHashURL(ro.route);
        const routeParts = trim(ro.route).split('?');
        let pureRoute = routeParts[0].substring(hash ? 1 : 0);
        let queryString = trim(routeParts[1]);
        queryString = toQueryString(queryString || trim(ro.queryString));
        if (isValidRoute(pureRoute)) {
            libs.setDataToStore(pureRoute, hash, ro.data);
            const completeRoute = resolveQuery(pureRoute, hash, queryString, ro.appendQuery);
            history[ro.replaceMode ? 'replaceState' : 'pushState']({ data: ro.data }, ro.title, completeRoute);
            if (!ro.noTrigger) {
                triggerRoute({
                    route: `${hash ? '#' : ''}${pureRoute}`,
                    hash
                });
            }
        } else {
            throw new Error(INVALID_ROUTE);
        }
    }
}
