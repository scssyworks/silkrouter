export type RouteConfig = {
  replace?: boolean;
  preventDefault?: boolean;
  pageTitle?: string;
  // rome-ignore lint/suspicious/noExplicitAny: Data can be of any time
  data?: any;
  queryString?: string;
};
