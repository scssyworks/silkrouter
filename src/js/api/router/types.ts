import { Observable } from 'rxjs';

export type RouterConfig = {
  init?: boolean;
  hashRouting?: boolean;
  preservePath?: boolean;
};

export type RouterCoreConfig = {
  history: History;
  context: HTMLElement;
  location: Location;
  hash?: boolean;
};

export type Operator = (
  // rome-ignore lint/suspicious/noExplicitAny: Type cannot be determined
  ...args: any[]
  // rome-ignore lint/suspicious/noExplicitAny: Type cannot be determined
) => (observable: Observable<any>) => Observable<any>;
