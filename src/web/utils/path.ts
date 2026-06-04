import type {
  Handler,
  IEmitter,
  IRouter,
  ISrEvent,
  ISrPath,
  Match,
  RouterInitData,
  RouterState,
  SrPathProps,
} from '../types';
import { createEmitter } from './event';
import { getWindow } from './win';

export class SrPath implements ISrPath {
  #exact: boolean;
  #route: URL;
  #router: IRouter;
  #srTarget: IEmitter;
  #scheduled: boolean = false;
  #subscriber: Handler | null = null;
  #pathData!: RouterInitData;
  constructor(options: SrPathProps, router: IRouter) {
    this.#route = PathUtils.join(options.basePath, options.path);
    this.#exact = !!options.path; // If path is provided then router attempts to match full path
    this.#router = router;
    this.#srTarget = createEmitter();
    this.#router.target.on<CustomEvent, RouterInitData>(
      'sr:init',
      this.#srInit,
    );
    this.target.on('sr:mount', this.#srInit);
  }

  get route() {
    return this.#route;
  }

  get exact() {
    return this.#exact;
  }

  get target() {
    return this.#srTarget;
  }

  get navId() {
    return this.#router.navId;
  }

  get useHash() {
    return this.#router.useHash;
  }

  get history() {
    return this.#router.history;
  }

  get location() {
    return this.#router.location;
  }

  #srInit = (evt: ISrEvent<CustomEvent, RouterInitData>) => {
    this.#pathData = evt.data!; // sr:init custom event always passed data
    if (this.#scheduled) {
      return;
    }
    this.#scheduled = true;
    queueMicrotask(async () => {
      this.#scheduled = false;
      const pathData = this.#pathData;
      const url = this.useHash
        ? PathUtils.unhashify(pathData.url)
        : pathData.url;
      const result = PathUtils.match(this.#route, url, this.exact);
      if (!result.match || !this.#subscriber) return;
      const activeNavId = pathData.id;
      this.target.emit('sr:transit');
      try {
        await this.#subscriber({
          path: `${url.pathname}${url.search}${url.hash}`,
          pathname: url.pathname,
          route: this.route.pathname,
          state: pathData.data,
          search: url.search,
          query: Object.fromEntries(url.searchParams),
          params: result.params,
          fragment: url.hash,
        });
        if (activeNavId !== this.navId) return;
        this.target.emit('sr:done');
      } catch {
        if (activeNavId !== this.navId) return;
        this.target.emit('sr:error');
      }
    });
  };

  subscribe<S = unknown>(fn: Handler<S>) {
    this.#subscriber = fn as Handler;
    this.target.emit('sr:mount', {
      url: new URL(this.location.href),
      id: this.navId,
      ...(this.history.state as RouterState | undefined),
    });
    return () => this.unsubscribe();
  }

  unsubscribe() {
    this.#subscriber = null;
    this.#router.target.off('sr:init', this.#srInit);
    this.target.close();
  }
}

export class PathUtils {
  static #noMatch: Match = {
    match: false,
    params: {},
  };
  static getBasePath(basePath: string) {
    return new URL(basePath, getWindow()!.location.href);
  }

  static relative(basePath: string, path: string) {
    const base = this.getBasePath(basePath);
    return new URL(path, base);
  }

  static join(basePath: string, path: string) {
    return this.relative(basePath, this.stripLeadingSlashes(path));
  }

  static hashify(url: URL, preservePath: boolean, location: Location) {
    const hashPrefix = '/#';
    const hashed = new URL(
      `${hashPrefix}${url.pathname}${url.search}${url.hash}`,
      url,
    );
    if (!preservePath) return hashed;
    const currentURL = new URL(location.href);
    currentURL.hash = hashed.hash;
    return currentURL;
  }

  static unhashify(url: URL) {
    return new URL(url.hash.slice(1), url);
  }

  static trailSlash(path: string) {
    return path.endsWith('/') ? path : `${path}/`;
  }

  static stripLeadingSlashes(path: string) {
    return path.replace(/^\/+/, '');
  }

  static toArray(path: string) {
    return path.split('/').filter(Boolean);
  }

  static match(route: URL, url: URL, exact = true): Match {
    // Match host
    if (route.origin !== url.origin) return this.#noMatch;
    const routeSections = this.toArray(route.pathname);
    const urlSections = this.toArray(url.pathname);
    if (exact && routeSections.length !== urlSections.length)
      return this.#noMatch;
    const params: Record<string, string> = {};
    const match = routeSections.every((section, idx) => {
      if (section.startsWith(':')) {
        params[section.slice(1)] = urlSections[idx];
        return true;
      }
      return section === urlSections[idx];
    });
    if (match) {
      return {
        match,
        params,
      };
    }
    return this.#noMatch;
  }
}
