import { trim, isValidRoute, each, oKeys } from '../utils/utils';
import isObject from 'is-object';
import queryDeparam from 'deparam.js';
import { Observable } from 'rxjs';
import {
  INVALID_ROUTE,
  CACHED_FIELDS,
  UNDEF,
  TYPEOF_BOOL,
} from '../utils/constants';
import { extractParams } from '../utils/params';
import Router from '../api/router';
import { assign } from '../utils/assign';

/**
 * Operator to compare a specific route
 * @param {string} routeStr Route string
 * @param {Router} routerInstance Current router object [optional]
 * @param {boolean} ignoreCase Ignore case in route string
 */
export function route(routeStr, routerInstance, ignoreCase) {
  if (typeof routerInstance === TYPEOF_BOOL) {
    ignoreCase = routerInstance;
    routerInstance = UNDEF;
  }
  routeStr = trim(routeStr);
  if (routerInstance instanceof Router) {
    const paths = routerInstance.__paths__;
    if (paths.indexOf(routeStr) === -1) {
      paths.push(routeStr);
    }
  }
  return (observable) =>
    new Observable((subscriber) => {
      const subn = observable.subscribe({
        next(event) {
          let incomingRoute = event.route;
          if (isValidRoute(routeStr)) {
            if (ignoreCase) {
              routeStr = routeStr.toLowerCase();
              incomingRoute = incomingRoute.toLowerCase();
            }
            const params = extractParams(routeStr, incomingRoute);
            const paramsLength = oKeys(params).length;
            if (incomingRoute === routeStr || paramsLength > 0) {
              if (paramsLength > 0) {
                event.params = params;
              }
              subscriber.next(event);
            }
          } else {
            subscriber.error(new Error(INVALID_ROUTE));
          }
        },
        error: subscriber.error,
        complete: subscriber.complete,
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
      };
    });
}

/**
 * Converts search and hashSearch strings to object
 * @param {boolean} coerce Flag to enable value typecast
 */
export function deparam(coerce) {
  return (observable) =>
    new Observable((subscriber) => {
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
        error: subscriber.error,
        complete: subscriber.complete,
      });
      return () => {
        subn.unsubscribe();
      };
    });
}

/**
 * Modifies current subscriber to detect errors
 * @param {Router} routerInstance Current router object
 */
export function noMatch(routerInstance) {
  return (observable) =>
    new Observable((subscriber) => {
      const subn = observable.subscribe({
        next(event) {
          if (routerInstance instanceof Router) {
            const paths = routerInstance.__paths__;
            if (paths.length > 0) {
              const currentRoute = event.route;
              let match = false;
              each(paths, (path) => {
                if (
                  path === currentRoute ||
                  oKeys(extractParams(path, currentRoute)).length
                ) {
                  return !(match = true);
                }
              });
              if (!match) {
                event.noMatch = true;
                subscriber.next(event);
              }
            }
          }
        },
        error: subscriber.error,
        complete: subscriber.complete,
      });
      return () => {
        subn.unsubscribe();
      };
    });
}

function deepComparison(first, second, result) {
  each(oKeys(first), (key) => {
    if (isObject(first[key]) && isObject(second[key])) {
      deepComparison(first[key], second[key], result);
    } else {
      result.break = first[key] !== second[key];
    }
  });
}

/**
 * Caches incoming routes to avoid calling handler if there is no change
 * @param {string[]} keys
 * @param {boolean} deep
 */
export function cache(keys = CACHED_FIELDS, deep) {
  let cache = {};
  if (typeof keys === TYPEOF_BOOL) {
    deep = keys;
    keys = CACHED_FIELDS;
  }
  return (observable) =>
    new Observable((subscriber) => {
      const subn = observable.subscribe({
        next(event) {
          each(keys, (key) => {
            if (deep && isObject(event[key]) && isObject(cache[key])) {
              const result = {};
              deepComparison(event[key], cache[key], result);
              if (result.break) {
                assign(cache, event);
                subscriber.next(event);
                return false;
              }
            } else if (event[key] !== cache[key]) {
              assign(cache, event);
              subscriber.next(event);
              return false; // break loop
            }
          });
        },
        error: subscriber.error,
        complete: subscriber.complete,
      });
      return () => {
        subn.unsubscribe();
        cache = {};
      };
    });
}
