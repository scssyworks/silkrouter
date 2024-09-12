export type Handler = (url: URL, state: any, event?: PopStateEvent) => void;

export type RouterConfig = {
  history?: History;
};

export interface Route<T> {
  href: string;
  state: T;
}
