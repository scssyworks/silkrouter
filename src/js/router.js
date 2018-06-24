/**
 * Routing plugin
 * This file contains SPA router methods to handle routing mechanism in single page applications (SPA). Supported versions IE9+, Chrome, Safari, Firefox
 *
 * @project      Routing plugin
 * @date         2018-06-24
 * @author       Sachin Singh <ssingh.300889@gmail.com>
 * @dependencies jQuery
 * @version      2.0.0
 */

// Import dependencies
import deparam from 'jquerydeparam';

const router = { handlers: [] },
    isHistorySupported = history && history.pushState,
    cache = { trigger: true },
    regex = {
        pathname: /^\/(?=[^?]*)/,
        routeparams: /:[^\/]+/g
    },
    eventNames = {
        routeChanged: "routeChanged",
        hashchange: "hashchange",
        popstate: "popstate"
    },
    errorMessage = {
        invalidPath: "Path needs to be a valid string or object",
        invalidQueryString: "Query string is of invalid type"
    };

/**
 * Converts any list to JavaScript array
 * @param {array} arr 
 */
function _arr(arr) {
    return Array.prototype.slice.call(arr);
}

/**
 * Checks if handler function is callable
 * @param {Function} fn handler function
 */
function _isCallable(fn) {
    return (typeof fn === 'function') || Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * Attaches a route handler
 * @param {string} sRoute route
 * @param {Function} callback callback function
 */
function route(sRoute, callback) {
    if (_isCallable(sRoute)) {
        callback = sRoute;
        sRoute = '*';
    }
    if (typeof sRoute === 'string' && _isCallable(callback)) {
        const [path, query] = sRoute.split('?');
        router.handlers.push({
            eventName: eventNames.routeChanged,
            handler: callback.bind(this),
            el: this,
            path,
            query,
            isGeneric: (sRoute === '*')
        });
    }
}

/**
 * Sets a route handler
 * @param {string|Object} route route options
 * @param {Boolean} replace activates replace mode (defaults to false)
 * @param {Boolean} trigger disables route handler if false (defaults to true)
 */
function _set() {
    let [path, replace = false, trigger = true] = arguments;
    if (path == null) throw new TypeError(errorMessage.invalidPath);
    // Convert route string to object
    if (typeof path !== 'object') {
        path = { route: path.toString() };
    }
    // Destructure route object to get route parts
    let { route, data = {}, queryString = '', exact = false } = path;
    if (typeof queryString !== 'string') throw new TypeError(errorMessage.invalidQueryString);
    // Get query string from path if not specified
    [route, queryString = ''] = route.split('?');
}

const jqrouter = {
    set() {
        return _set.apply(this, arguments);
    },
    init() {
        return this.set(window.location.pathname + window.location.search);
    }
}

export { route, jqrouter as router };