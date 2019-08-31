import { execRoute, bindRoute, unbindRoute, initRouterEvents, trigger } from './utils/api';
import { extractParams } from './utils/params';
import { CASE_INSENSITIVE_FLAG } from './utils/constants';
import { toQueryString } from './utils/query';
import { deparam } from './utils/deparam';


/**
 * @namespace router
 * @public
 * @type {object}
 */
const router = {
    /**
     * @namespace api
     * @memberof router
     * @type {object}
     * @deprecated
     */
    api: {
        /**
         * Triggers a custom route event
         * @method trigger
         * @public
         * @memberof router.api
         * @param {...*} arguments
         * @deprecated
         */
        trigger(...args) {
            return trigger.apply(this, args);
        },
        /**
         * Extract parameters as an object if route has parameters
         * @method extractParams
         * @public
         * @memberof router.api
         * @params {...*} arguments
         * @deprecated
         */
        extractParams(...args) {
            return extractParams.apply(this, args);
        },
        /**
         * Converts object to query string
         * @method toQueryString
         * @public
         * @memberof router.api
         * @params {...*} arguments
         * @deprecated
         */
        toQueryString(...args) {
            return toQueryString.apply(this, args);
        }
    },
    /**
     * Sets a route url
     * @public
     * @param {string|object} route Route object or URL
     * @param {boolean} replaceMode Flag to enable replace mode
     * @param {boolean} noTrigger Flag to disable handler while changing route
     */
    set(...args) {
        return execRoute.apply(this, args);
    }
}

/**
 * Attaches a route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function route(...args) {
    return bindRoute.apply(this, args);
}

/**
 * Attaches case insensitive route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function routeIgnoreCase(firstArg, ...args) {
    if (typeof firstArg === 'string') {
        route.apply(this, [`${CASE_INSENSITIVE_FLAG}${firstArg}`, ...args]);
    }
}

/**
 * Detaches a route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function unroute(...args) {
    return unbindRoute.apply(this, args);
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