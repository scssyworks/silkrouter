import { trigger } from '../../utils/triggerEvent';
import { VIRTUAL_PUSHSTATE, INVALID_ROUTE } from '../../utils/constants';
import { isValidRoute, trim, isObject } from '../../utils/utils';
import { libs } from '../../utils/libs';
import { toQueryString } from '../../utils/query';
import resolveQuery from '../resolveQuery';
import { assign } from '../../utils/assign';

export default function set(route, replace = false, exec = true) {
    const { preservePath, hashRouting, location, history } = this.config;
    const routeObject = assign(
        { replace, exec },
        (typeof route === 'string') ? { route } : route
    )
    replace = routeObject.replace;
    exec = routeObject.exec;
    let {
        route: routeStr,
        queryString
    } = routeObject;
    const {
        preserveQuery,
        data,
        pageTitle = document.querySelector('head title').textContent
    } = routeObject;
    const routeParts = routeStr.split('?');
    // Check if query string is an object
    if (isObject(queryString)) {
        queryString = toQueryString(queryString);
    }
    // Resolve to URL query string if it's not explicitly passed
    queryString = trim(queryString ? queryString : routeParts[1]);
    routeStr = trim(routeParts[0]);
    // Check if query preservation is required. Resolve query accordingly
    if (preserveQuery) {
        queryString = resolveQuery.apply(this, [queryString, hashRouting]);
    }
    if (isValidRoute(routeStr)) {
        const unmodifiedRoute = routeStr;
        if (hashRouting) {
            routeStr = `#${routeStr}`;
            // Path preservation should only work for hash routing
            if (preservePath) {
                routeStr = `${location.pathname}${routeStr}`;
            }
        }
        // Sync data to store before appending query string. Query string should have no effect on stored data
        libs.setDataToStore(routeStr, data);
        // Append query string
        routeStr = `${routeStr}${queryString ? `?${queryString}` : ''}`;
        history[replace ? 'replaceState' : 'pushState']({ data }, pageTitle, routeStr);
        if (exec && unmodifiedRoute) {
            trigger(this.config.context, VIRTUAL_PUSHSTATE, [{
                path: unmodifiedRoute,
                hash: hashRouting
            }]);
        }
    } else {
        throw new TypeError(INVALID_ROUTE);
    }
    return this;
}