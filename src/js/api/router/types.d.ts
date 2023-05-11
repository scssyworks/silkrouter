export type RouterConfig = {
  init?: boolean;
  hashRouting?: boolean;
  preservePath?: boolean;
};

export type RouterCoreConfig = {
  global: globalThis;
  history: History;
  // rome-ignore lint/suspicious/noExplicitAny: context can be any DOM node
  context: any;
  location: Location;
  hash?: boolean;
};
