import { extractParams } from './utils/params';
import { CASE_INSENSITIVE_FLAG } from './utils/constants';
import { toQueryString } from './utils/query';
import { deparam } from './utils/deparam';
import execRoute from './api/execRoute';
import bindRoute from './api/bindRoute';
import unbindRoute from './api/unbindRoute';
import initRouterEvents from './api/initRouterEvents';
import { toArray } from './utils/utils';

/**
 * @namespace router
 * @public
 * @type {object}
 */
const router = {
    /**
     * Sets a route url
     * @public
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set() {
        return execRoute.apply(this, arguments);
    }
}

/**
 * Attaches a route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function route() {
    return bindRoute.apply(this, arguments);
}

/**
 * Attaches case insensitive route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function routeIgnoreCase(firstArg) {
    if (typeof firstArg === 'string') {
        route.apply(this, [`${CASE_INSENSITIVE_FLAG}${firstArg}`, toArray(arguments).slice(1)]);
    }
}

/**
 * Detaches a route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function unroute() {
    return unbindRoute.apply(this, arguments);
}

initRouterEvents();

export {
    router,
    route,
    routeIgnoreCase,
    unroute,
    deparam,
    toQueryString as param,
    extractParams as routeParams
};