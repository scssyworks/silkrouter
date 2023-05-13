/**
 * Creates an instance of router event
 */
export default class RouterEvent {
    constructor(routeInfo: any, currentEvent: any);
    route: any;
    isHashRoute: any;
    router: any;
    currentEvent: any;
    query: {
        path: string;
        hash: string;
    };
    data: any;
    index: any;
}
