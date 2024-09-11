import isObject from 'is-object';
import {
  EMPTY,
  INVALID_ROUTE,
  PUSH,
  QRY,
  REPLACE,
  VIRTUAL_PUSHSTATE,
} from '../../constants';
import { trigger } from '../../utils/triggerEvent';
import { isValidRoute, trim } from '../../utils/utils';

/**
 * Sets the current route
 * @private
 * @typedef {import('./types').RouteConfig} RouteConfig
 * @param {string} routeStr Route string
 * @param {RouteConfig} [rConfig] Route config
 */
export default function set(routeStr, rConfig) {
  const routeConfig = isObject(rConfig) ? rConfig : {};
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
  let routeString = trim(route);
  if (isValidRoute(routeString)) {
    const path = routeString;
    if (hash) {
      routeString = `${preservePath ? '' : '/'}#${routeString}`;
    }
    // Append query string
    routeString = `${routeString}${trim(
      queryString ? `${QRY + queryString}` : EMPTY,
    )}`;
    const savedState = history.state || { idx: 0 };
    history[replace ? REPLACE : PUSH](
      {
        data,
        idx: savedState.idx + 1,
      },
      pageTitle,
      routeString,
    );
    if (!preventDefault && path) {
      trigger(context, VIRTUAL_PUSHSTATE, [
        {
          path,
          hash,
        },
        undefined,
        this,
      ]);
    }
  } else {
    throw new TypeError(INVALID_ROUTE);
  }
}
