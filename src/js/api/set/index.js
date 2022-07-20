import { isObject } from "deparam.js";
import { trigger } from "../../utils/triggerEvent";
import {
  VIRTUAL_PUSHSTATE,
  INVALID_ROUTE,
  UNDEF,
  TYPEOF_STR,
  EMPTY,
  QRY,
  REPLACE,
  PUSH,
} from "../../utils/constants";
import { isValidRoute, trim } from "../../utils/utils";
import { toQueryString } from "../../utils/query";
import resolveQuery from "../resolveQuery";
import { assign } from "../../utils/assign";

export default function set(route, replace, exec) {
  exec = exec || true;
  const { preservePath, hashRouting, history } = this.config;
  const routeObject = assign(
    { replace, exec },
    typeof route === TYPEOF_STR ? { route } : route
  );
  replace = routeObject.replace;
  exec = routeObject.exec;
  let { route: routeStr, queryString } = routeObject;
  const { preserveQuery, data, pageTitle = null } = routeObject;
  const routeParts = routeStr.split(QRY);
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
      routeStr = `/#${routeStr}`;
      // Path preservation should only work for hash routing
      if (preservePath) {
        routeStr = `${routeStr.substring(1)}`;
      }
    }
    // Append query string
    routeStr = `${routeStr}${queryString ? `${QRY + queryString}` : EMPTY}`;
    history[replace ? REPLACE : PUSH]({ data }, pageTitle, routeStr);
    if (exec && unmodifiedRoute) {
      trigger(this.config.context, VIRTUAL_PUSHSTATE, [
        {
          path: unmodifiedRoute,
          hash: hashRouting,
        },
        UNDEF,
        this,
      ]);
    }
  } else {
    throw new TypeError(INVALID_ROUTE);
  }
  return this;
}
