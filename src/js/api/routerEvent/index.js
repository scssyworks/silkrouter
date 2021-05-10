import { trim } from '../../utils/utils';
export default class RouterEvent {
  constructor(routeInfo, currentEvent) {
    // Set relevant parameters
    const [routeObject, originalEvent, routerInstance] = routeInfo;
    const { location, history } = routerInstance.config;
    this.route = routeObject.path;
    this.hashRouting = routeObject.hash;
    this.routerInstance = routerInstance;
    this.virtualEvent = currentEvent || {};
    this.originalEvent = originalEvent || {};
    this.path = trim(location.pathname);
    this.hash = location.hash;
    this.search = trim(location.search.substring(1));
    this.hashSearch = trim(location.hash && location.hash.split('?')[1]);
    const { state } = this.originalEvent;
    this.data = (state && state.data) || (history.state && history.state.data);
  }
}
