import type { IRouter } from '../router/Router.types';

export interface IRouterEvent<T> {
  url: URL;
  state?: T;
  originalEvent?: PopStateEvent;
  routerInstance?: IRouter;
}
