declare namespace router {
    namespace api {
        function trigger(eventName: string, routeConfig: object, originalData: object): void;
        function extractParams(path: string): object;
        function toQueryString(query: object): string;
    }
    function set(route: any, replaceMode: boolean, noTrigger: boolean): void;
}

declare function route(route: string, handler: Function): void;

declare function routeIgnoreCase(route: string, handler: Function): void;

declare function unroute(route: string, handler: Function): void;

declare function deparam(query: string): object;

declare function param(query: object): string;

declare function routeParams(path: string): object;

export = { router, route, unroute, deparam, param, routeParams };