/**
 * Core router class to handle basic routing functionality
 */
export class RouterCore {
    static get global(): typeof globalThis;
    /**
     * Router core constructor
     * @typedef {import('./types').RouterCoreConfig} RouterCoreConfig
     * @param {RouterCoreConfig} routerCoreConfig Route core configuration
     */
    constructor({ history, context, location, hash }: import("./types").RouterCoreConfig);
    popStateSubscription: import("rxjs").Subscription;
    listeners: import("rxjs").Observable<any>;
    /**
     * Allows you to add operators for any pre-processing before a handler is called
     * @typedef {import('./types').Operator} Operator
     * @typedef {import('rxjs').Observable} Observable
     * @param  {...Operator} ops Operators
     * @returns {Observable<any>}
     */
    pipe(...ops: import("./types").Operator[]): any;
    /**
     * Attaches a route handler
     * @typedef {import('../routerEvent/index').RouterEvent} RouterEvent
     * @param {(event: RouterEvent) => void} fn Route handler
     */
    subscribe(fn: (event: import("../routerEvent/index").RouterEvent) => void): any;
    /**
     * Destroys current router instance
     * @param {() => void} callback Callback for destroy function
     */
    destroy(callback: () => void): void;
}
