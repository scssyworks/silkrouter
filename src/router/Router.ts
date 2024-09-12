import { RouterEvent } from '../router-event/RouterEvent';
import type { Handler, IRouter, Route, RouterConfig } from './Router.types';

export class Router implements IRouter {
  #handlers = new Set<Handler<any>>();
  #history: History;
  constructor(props?: RouterConfig) {
    this.#history = props?.history || this.global.history;
    if (!this.#history.pushState) {
      throw new Error('Invalid history object or history is not defined!');
    }
    // initialize all handlers when subscribed
    this.global.addEventListener('popstate', (event: PopStateEvent) =>
      this.#call(event),
    );
  }
  get global() {
    return typeof globalThis !== 'undefined' ? globalThis : global || self;
  }
  subscribe<S>(fn: Handler<S>) {
    this.#callOnce<S>(fn);
    this.#handlers.add(fn);
    return () => this.#handlers.delete(fn);
  }
  #call<S>(event?: PopStateEvent) {
    for (const handler of this.#handlers) {
      this.#callOnly<S>(handler, event);
    }
  }
  #callOnly<S>(handler: Handler<S>, event?: PopStateEvent) {
    const evt = new RouterEvent<S>(
      new URL(this.global.location.href),
      this.#history.state,
      event,
      this,
    );
    if (this === evt.routerInstance) {
      handler(evt);
    }
  }
  #callOnce<S>(handler: Handler<S>, event?: PopStateEvent) {
    if (!this.#handlers.has(handler)) {
      this.#callOnly<S>(handler, event);
    }
  }
  push<S>(route: string | Route<S>, replace?: boolean) {
    try {
      const url = new URL(
        typeof route === 'string' ? route : route.href,
        this.global.location.origin,
      );
      const state = typeof route === 'string' ? undefined : route.state;
      this.#history[replace ? 'replaceState' : 'pushState'](
        state,
        '',
        url.href,
      );
      this.#call<S>();
    } catch (e) {
      throw new Error('Invalid route URL');
    }
  }

  replace<S>(route: string | Route<S>) {
    this.push<S>(route, true);
  }

  dispose() {
    this.#handlers.clear();
  }

  static #instance: Router;
  static getInstance(history?: History) {
    if (!Router.#instance) {
      Router.#instance = new Router({ history });
    }
    return Router.#instance;
  }
}

export const getRouter = () => Router.getInstance();
