import { QRY } from '../../constants';
import { trim } from '../../utils/utils';

/**
 * Creates an instance of router event
 */
export class RouterEvent {
  /**
   * Creates a instance of router event
   * @typedef {import('./types').RouteInfo} RouteInfo
   * @param {RouteInfo} routeInfo Route information
   * @param {CustomEvent} currentEvent Current event object
   */
  constructor(routeInfo, currentEvent) {
    // Set relevant parameters
    const [routeObject, originalEvent, routerInstance] = routeInfo;
    const { location, history } = routerInstance.config;
    this.route = routeObject.path;
    this.isHashRoute = routeObject.hash;
    this.router = routerInstance;
    this.currentEvent = originalEvent || currentEvent;
    this.query = {
      path: trim(location.search.substring(1)),
      hash: trim(location.hash.split(QRY)[1]),
    };
    const { state } = originalEvent || {};
    const { data, idx = 0 } = state || history.state || {};
    this.data = data;
    this.index = +idx;
  }
}
