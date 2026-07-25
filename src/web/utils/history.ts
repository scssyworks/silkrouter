import type {
  Handler,
  HistoryOptions,
  IEmitter,
  IRouter,
  ISrEvent,
  ISrPath,
  NavigateOptions,
  RouterState,
  SrHistory,
} from '../types';
import { getHistory } from './browser';
import { createEmitter } from './event';
import { getMemoryHistory } from './memory';
import { PathUtils, SrPath } from './path';

/**
 * Router class that manages navigation and routing in a web application. It provides methods for navigating to different paths, subscribing to route changes, and handling browser history events.
 *
 * @class Router
 * @implements {IRouter}
 * @property {boolean} useHash - Indicates whether to use hash-based routing.
 * @property {boolean} preservePath - Indicates whether to preserve the path when using hash-based routing.
 * @property {SrHistory} history - The history object used for navigation.
 * @property {IEmitter} target - The event emitter for route changes.
 * @property {IEmitter} win - The event emitter for window events.
 * @property {string} basePath - The base path for routing.
 * @property {number} navId - The current navigation ID.
 * @method navigate - Navigates to a specified pathname with optional state and replace options.
 * @method forward - Navigates forward in the browser history.
 * @method back - Navigates backward in the browser history.
 * @method subscribe - Subscribes to route changes with a handler function.
 * @method route - Creates a new route with a specified path.
 * @method unsubscribe - Unsubscribes from route changes and cleans up event listeners.
 */
export class Router implements IRouter {
  #useHash: boolean;
  #preservePath: boolean;
  #history: SrHistory;
  #srTarget: IEmitter;
  #winTarget: IEmitter;
  #basePath: string;
  constructor(options: HistoryOptions) {
    this.#history = options.history;
    this.#basePath = PathUtils.trailSlash(options.basePath ?? '/');
    this.#useHash = !!options.hashRouter;
    this.#preservePath = !!options.preservePath;
    this.#winTarget = this.#history.historyTarget;
    this.#srTarget = createEmitter();

    this.#winTarget.on('popstate', this.#onPopState);
  }

  get win() {
    return this.#winTarget.target as Window;
  }

  get location() {
    return this.win.location;
  }

  get target() {
    return this.#srTarget;
  }

  get history() {
    return this.#history.history;
  }

  get useHash() {
    return this.#useHash;
  }

  get preservePath() {
    return this.useHash && this.#preservePath;
  }

  get navId() {
    // Check if current history state has navId
    const state = this.history.state as RouterState | undefined;
    if (state && typeof state.id === 'number') {
      return state.id;
    }
    return 0;
  }

  get every() {
    return this.route('');
  }

  #onPopState = (evt: ISrEvent<PopStateEvent>) => {
    this.target.emit('sr:init', {
      url: new URL(this.location.href),
      id: this.navId,
      ...(evt.data as RouterState | undefined),
    });
  };

  navigate<S = unknown>(pathname: string, navOptions?: NavigateOptions<S>) {
    const replace = navOptions?.replace ?? false;
    const state: RouterState<S> = {
      id: this.navId + 1,
      data: navOptions?.state,
    };

    let url = PathUtils.join(this.#basePath, pathname);

    if (this.useHash) {
      url = PathUtils.hashify(url, this.preservePath, this.location);
    }

    this.history[replace ? 'replaceState' : 'pushState'](state, '', url.href); // This will throw error if a different domain is encountered
    this.target.emit('sr:init', { url, ...state });
  }

  forward() {
    this.history.forward();
  }

  back() {
    this.history.back();
  }

  subscribe<S = unknown>(fn: Handler<S>) {
    return this.every.subscribe(fn);
  }

  route(path: string): ISrPath {
    return new SrPath({ basePath: this.#basePath, path }, this);
  }

  unsubscribe() {
    this.#winTarget.close();
    this.target.close();
  }
}

export function getRouter(
  options?: Omit<HistoryOptions, 'history'> & {
    memoryRouter?: boolean; // Use this option to enable memory router for nested routers and/or unit testing.
  },
) {
  const history = options?.memoryRouter ? getMemoryHistory() : getHistory();
  return new Router({ ...options, history });
}
