import { extractParams } from './utils/params';
import { CASE_INSENSITIVE_FLAG } from './utils/constants';
import { toQueryString } from './utils/query';
import { deparam } from './utils/deparam';
import execRoute from './api/execRoute';
import bindRoute from './api/bindRoute';
import unbindRoute from './api/unbindRoute';
import initRouterEvents from './api/initRouterEvents';
import { toArray } from './utils/utils';
import { assign } from './utils/assign';
import { containsFn } from './utils/containsFn';
import { isValidPath } from './utils/isValidPath';
import { getCompletePath } from './utils/completePath';

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

class Router {
    constructor(options = {}) {
        this.options = Object.freeze(assign({
            ignoreCase: false,
            hashRouting: false,
            mergeQuery: true
        }, options));
        this.subscriptions = [];
        if (history && history.pushState) {
            this.history = history;
        } else {
            throw new TypeError('History object is unsupported in this browser.');
        }
    }
    set(route = {}, replace = false, exec = true) {
        const routeConfig = typeof route === 'string'
            ? { route, replace, exec }
            : assign({}, route, { replace, exec });
        routeConfig.route = `${this.hashRouting ? '#' : ''}${routeConfig.route}`;
        if (isValidPath(routeConfig.route, this.hashRouting)) {
            this.history[routeConfig.replace ? 'replaceState' : 'pushState'](routeConfig.data, null, getCompletePath(routeConfig.route, this.mergeQuery));
        }
    }
    subscribe(fn) {
        if (
            typeof fn === 'function'
            && !containsFn(this.subscriptions, fn)
        ) {
            const routeObject = {
                fn,
                ignoreCase: this.ignoreCase,
                hash: this.hashRouting
            };
            this.subscriptions.push(routeObject);
            return {
                unsubscribe: () => {
                    this.subscriptions.splice(this.subscriptions.indexOf(routeObject), 1);
                }
            };
        }
        throw new TypeError('Invalid subscription');
    }
}

export {
    router,
    route,
    routeIgnoreCase,
    unroute,
    deparam,
    toQueryString as param,
    extractParams as routeParams
};