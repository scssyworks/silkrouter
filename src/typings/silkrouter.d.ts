declare namespace router {
    namespace api {
        function trigger(eventName: string, routeConfig: object, originalData: object): void;
    }
    function set(route: any, replaceMode: boolean, noTrigger: boolean): void;
}

declare function route(route: string, handler: Function): void;

declare function unroute(route: string, handler: Function): void;

export = { router, route, unroute };