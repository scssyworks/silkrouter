import { trigger } from '../../utils/triggerEvent';
import {
  VIRTUAL_PUSHSTATE,
  INVALID_ROUTE,
  UNDEF,
  EMPTY,
  QRY,
  REPLACE,
  PUSH,
} from '../../constants';
import { isValidRoute, trim } from '../../utils/utils';
import isObject from 'is-object';

/**
 * Sets the current route
 * @private
 * @typedef {import('./types').RouteConfig} RouteConfig
 * @param {string} routeStr Route string
 * @param {RouteConfig} [routeConfig] Route config
 * @returns {void}
 */
export default function set(routeStr, routeConfig) {
  routeConfig = isObject(routeConfig) ? routeConfig : {};
  const [route, qs] = routeStr.split(QRY);
  const {
    replace = false,
    preventDefault = false,
    queryString = qs,
    data,
    pageTitle = null,
  } = routeConfig;
  const { preservePath, hashRouting: hash, history, context } = this.config;
  // Resolve to URL query string if it's not explicitly passed
  routeStr = trim(route);
  if (isValidRoute(routeStr)) {
    const path = routeStr;
    if (hash) {
      routeStr = `${preservePath ? '' : '/'}#${routeStr}`;
    }
    // Append query string
    routeStr = `${routeStr}${trim(
      queryString ? `${QRY + queryString}` : EMPTY
    )}`;
    const savedState = history.state || { idx: 0 };
    history[replace ? REPLACE : PUSH](
      {
        data,
        idx: savedState.idx + 1,
      },
      pageTitle,
      routeStr
    );
    if (!preventDefault && path) {
      trigger(context, VIRTUAL_PUSHSTATE, [
        {
          path,
          hash,
        },
        UNDEF,
        this,
      ]);
    }
  } else {
    throw new TypeError(INVALID_ROUTE);
  }
}
