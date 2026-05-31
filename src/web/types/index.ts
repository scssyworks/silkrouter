export type EventHandler<E extends Event = Event> = (
  event: E,
) => void | Promise<void>;

export interface ISrEvent<E extends Event = Event, D = unknown> {
  data?: D;
  originalEvent: E;
}

export type SrHandler<E extends Event = Event, S = unknown> = (
  evt: ISrEvent<E, S>,
) => void | Promise<void>;

export interface Push<S extends Record<string, unknown>> {
  url: string;
  replace?: boolean;
  state?: S;
  history?: History;
}

export type Runtime = {
  isBrowser: boolean;
  isNode: boolean;
};

export interface IHandlerProps<S = unknown> {
  path: string; // The full path of the URL, e.g. '/users/123?active=true#section1'
  pathname: string; // The URL pathname, e.g. '/users/123'
  route: string; // The route pattern that matched the path, e.g. '/users/:id'
  state: S; // The state passed to history.pushState or history.replaceState
  search: string; // The URL search (query) without the leading '?'
  query: Record<string, string>; // Object notation for search
  params: Record<string, string>; // Object notation for path params
  fragment: string; // The URL fragment (hash) without the leading '#'
}

export type Handler<S = unknown> = (
  props: IHandlerProps<S>,
) => void | Promise<void>;

export interface IMemoryHistory {
  pushState<S>(state: S, title: string, url?: string): void;
  replaceState<S>(state: S, title: string, url?: string): void;
  go(delta: number): void;
  back(): void;
  forward(): void;
  length: number;
  state: unknown;
}

export type HistoryOptions = {
  basePath?: string;
  hashRouter?: boolean;
  preservePath?: boolean;
  debug?: boolean;
  history: SrHistory;
};

export type SrPathProps = {
  basePath: string;
  path: string;
};

export interface NavigateOptions<S = unknown> {
  replace?: boolean;
  state?: S;
}

export type RouterState<S = unknown> = {
  id: number;
  data?: S;
};

export type RouterInitData<S = unknown> = {
  url: URL;
} & RouterState<S>;

export interface IEmitter {
  target: EventTarget;
  emit<S>(name: string, state?: S): void;
  on<E extends Event = Event, S = unknown>(
    name: string,
    handler: SrHandler<E, S>,
  ): () => void;
  off<E extends Event = Event, S = unknown>(
    name: string,
    handler: SrHandler<E, S>,
  ): void;
  close(): void;
}

export interface ISrPath {
  route: URL;
  exact: boolean;
  target: IEmitter;
  navId: number;
  useHash: boolean;
  history: History | IMemoryHistory;
  location: Location;
  subscribe<S = unknown>(fn: Handler<S>): () => void;
  unsubscribe(): void;
}

export interface IRouter {
  win: Window;
  target: IEmitter;
  history: History | IMemoryHistory;
  navId: number;
  useHash: boolean;
  preservePath: boolean;
  location: Location;
  navigate<S = unknown>(
    pathname: string,
    navOptions?: NavigateOptions<S>,
  ): void;
  forward(): void;
  back(): void;
  subscribe<S = unknown>(fn: Handler<S>): () => void;
  route(path: string): ISrPath;
  every(): ISrPath;
  unsubscribe(): void;
}

export type Match = {
  match: boolean;
  params: Record<string, string>;
};

export type SrHistory = {
  history: History | IMemoryHistory;
  historyTarget: IEmitter;
};
