import type { IRouterEvent } from '../router-event/RouterEvent.types';

export type Handler<T> = (event: IRouterEvent<T>) => void;
export type Unsubscribe = () => void;

export type RouterConfig = {
  history?: History;
};

export interface Route<T> {
  href: string;
  state: T;
}

export interface IRouter {
  global: typeof globalThis;
  subscribe: <S>(fn: Handler<S>) => Unsubscribe;
  push: <S>(route: string | Route<S>, replace?: boolean) => void;
  replace: <S>(route: string | Route<S>) => void;
  dispose: () => void;
}
