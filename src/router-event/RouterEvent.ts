import type { IRouter } from '../router/Router.types';
import type { IRouterEvent } from './RouterEvent.types';

export class RouterEvent<T> implements IRouterEvent<T> {
  #url: URL;
  #originalEvent?: PopStateEvent;
  #state?: T;
  #instance?: IRouter;
  constructor(url: URL, state?: T, event?: PopStateEvent, instance?: IRouter) {
    this.#url = url;
    this.#state = state;
    this.#originalEvent = event;
    this.#instance = instance;
  }

  get url() {
    return this.#url;
  }

  get originalEvent() {
    return this.#originalEvent;
  }

  get state() {
    return this.#state;
  }

  get routerInstance() {
    return this.#instance;
  }
}
