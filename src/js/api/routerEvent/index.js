import { trim } from '../../utils/utils';
import { libs } from '../../utils/libs';

export default class RouterEvent {
    constructor(routeInfo, currentEvent) {
        // Set relevant parameters
        const [routeObject, originalEvent, routerInstance] = routeInfo;
        const { location, preservePath } = routerInstance.config;
        this.route = routeObject.path;
        this.hashRouting = routeObject.hash;
        this.routerInstance = routerInstance;
        this.virtualEvent = currentEvent || {};
        this.originalEvent = originalEvent || {};
        this.path = trim(location.pathname);
        this.hash = location.hash;
        this.search = trim(location.search.substring(1));
        this.hashSearch = trim(location.hash && location.hash.split('?')[1]);
        // Extract data
        let { path } = routeObject;
        if (this.hashRouting) {
            path = `/#${path}`;
            if (preservePath) {
                path = `${location.pathname}${path.substring(1)}`;
            }
        }
        // Set route data to store
        libs.setDataToStore(path, this.originalEvent.state && this.originalEvent.state.data);
        // Get current data from store
        this.data = libs.getDataFromStore(path);
    }
}