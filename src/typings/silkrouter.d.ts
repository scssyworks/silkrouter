import { Subscription, Observable } from "rxjs";

declare class Router {
    constructor(config: RouterConstructorOption);
    config: RouterConstructorOption;
    subscribe(callback: Function): Subscription;
    pipe(...args: Function[]): Observable;
    set(routeConfig: string | RouteConfigOption, replace?: boolean, exec?: boolean): Router;
}

declare interface RouterConstructorOption {
    hashRouting?: boolean,
    preservePath?: boolean,
    context?: Node
}

declare interface RouteConfigOption {
    route: string,
    queryString?: string | object,
    pageTitle?: string,
    data?: any,
    preserveQuery?: boolean,
    replace?: boolean,
    exec?: boolean
}

declare namespace operators {
    function route(route: string, routerInstance?: Router, ignoreCase?: boolean): Function;
    function deparam(coerce?: boolean): Function;
    function noMatch(routerInstance?: Router): Function;
}

export { Router, operators };