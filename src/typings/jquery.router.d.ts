declare namespace router {
    namespace events {
        let routeChanged: string;
        let hashchange: string;
        let popstate: string
    }
    function init(): void;
    function set(route: any, replaceMode: boolean, noTrigger: boolean): void;
    let historySupported: boolean;
}

declare function route(route: string, handler: Function): void;

export = { router, route };