import { execRoute, bindRoute, unbindRoute, initRouterEvents, trigger } from './utils/helpers';
import { extractParams, hasParams } from './utils/params';

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
     */
    api: {
        /**
         * Triggers a custom route event
         * @method trigger
         * @public
         * @memberof router.api
         * @param {...*} arguments
         */
        trigger() {
            return trigger.apply(this, arguments);
        },
        /**
         * Checks if a route has parameters
         * @method hasParams
         * @public
         * @memberof router.api
         * @params {...*} arguments
         */
        hasParams() {
            return hasParams.apply(this, arguments);
        },
        /**
         * Extract parameters as an object if route has parameters
         * @method extractParams
         * @public
         * @memberof router.api
         * @params {...*} arguments
         */
        extractParams() {
            return extractParams.apply(this, arguments);
        }
    },
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
 * Detaches a route handler
 * @public
 * @param {string|function} route Route string or handler function (in case of generic route)
 * @param {function} handler Handler function
 */
function unroute() {
    return unbindRoute.apply(this, arguments);
}

initRouterEvents();

export { router, route, unroute };