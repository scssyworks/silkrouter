import { trim, isValidRoute } from '../utils/utils';
import { Observable } from 'rxjs';
import { INVALID_ROUTE } from '../utils/constants';
import { extractParams } from '../utils/params';
import { deparam as queryDeparam } from '../utils/deparam';
import Router from '../api/router';

/**
 * Operator to compare a specific route
 * @param {string} routeStr Route string
 * @param {Router} routerInstance Current router object [optional]
 * @param {boolean} ignoreCase Ignore case in route string
 */
export function route(routeStr, routerInstance, ignoreCase) {
    if (typeof routerInstance === 'boolean') {
        ignoreCase = routerInstance;
        routerInstance = undefined;
    }
    routeStr = trim(routeStr);
    if (routerInstance instanceof Router) {
        const paths = routerInstance.__paths__;
        if (paths.indexOf(routeStr) === -1) {
            paths.push(routeStr);
        }
    }
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                let incomingRoute = event.route;
                if (isValidRoute(routeStr)) {
                    if (ignoreCase) {
                        routeStr = routeStr.toLowerCase();
                        incomingRoute = incomingRoute.toLowerCase();
                    }
                    const params = extractParams(routeStr, incomingRoute);
                    const paramsLength = Object.keys(params).length;
                    if (
                        incomingRoute === routeStr
                        || paramsLength > 0
                    ) {
                        if (paramsLength > 0) {
                            event.params = params;
                        }
                        subscriber.next(event);
                    }
                } else {
                    subscriber.error(
                        new Error(INVALID_ROUTE)
                    );
                }
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            if (routerInstance instanceof Router) {
                const paths = routerInstance.__paths__;
                const existingRouteIndex = paths.indexOf(routeStr);
                if (existingRouteIndex > -1) {
                    paths.splice(existingRouteIndex, 1);
                }
            }
            subn.unsubscribe();
        }
    });
}

/**
 * Converts search and hashSearch strings to object
 * @param {boolean} coerce Flag to enable value typecast
 */
export function deparam(coerce = false) {
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                try {
                    event.search = queryDeparam(event.search, coerce);
                    event.hashSearch = queryDeparam(event.hashSearch, coerce);
                    subscriber.next(event);
                } catch (e) {
                    subscriber.error(e);
                }
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            subn.unsubscribe();
        }
    });
}

/**
 * Modifies current subscriber to detect errors
 * @param {Router} routerInstance Current router object
 */
export function noMatch(routerInstance) {
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                if (routerInstance instanceof Router) {
                    const paths = routerInstance.__paths__;
                    if (paths.length > 0) {
                        const currentRoute = event.route;
                        let match = false;
                        for (let i = 0; i < paths.length; i++) {
                            if (paths[i] === currentRoute || Object.keys(extractParams(paths[i], currentRoute)).length) {
                                match = true;
                                break;
                            }
                        }
                        if (match) {
                            event.isErrorRoute = true;
                            subscriber.next(event);
                        }
                    }
                }
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            subn.unsubscribe();
        }
    });
}