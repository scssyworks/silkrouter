/**
 * Creates an instance of router event
 */
export default class RouterEvent {
    /**
     * Creates a instance of router event
     * @typedef {import('./types').RouteInfo} RouteInfo
     * @param {RouteInfo} routeInfo Route information
     * @param {CustomEvent} currentEvent Current event object
     */
    constructor(routeInfo: import("./types").RouteInfo, currentEvent: CustomEvent);
    route: string;
    isHashRoute: boolean;
    router: import("../router").Router;
    currentEvent: CustomEvent<any> | PopStateEvent;
    query: {
        path: string;
        hash: string;
    };
    data: any;
    index: number;
}
