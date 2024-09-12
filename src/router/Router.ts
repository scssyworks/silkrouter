import type { Handler, Route, RouterConfig } from './Router.types';

export class Router {
  #handlers = new Set<Handler>();
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
  subscribe(fn: Handler) {
    this.#callOnce(fn);
    this.#handlers.add(fn);
    return () => this.#handlers.delete(fn);
  }
  #call(event?: PopStateEvent) {
    for (const handler of this.#handlers) {
      this.#callOnly(handler, event);
    }
  }
  #callOnly(handler: Handler, event?: PopStateEvent) {
    handler(new URL(this.global.location.href), this.#history.state, event);
  }
  #callOnce(handler: Handler, event?: PopStateEvent) {
    if (!this.#handlers.has(handler)) {
      this.#callOnly(handler, event);
    }
  }
  push<T>(route: string | Route<T>, replace?: boolean) {
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
      this.#call();
    } catch (e) {
      throw new Error('Invalid route URL');
    }
  }

  replace<T>(route: string | Route<T>) {
    this.push(route, true);
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
