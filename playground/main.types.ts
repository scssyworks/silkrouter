export type MetaOptions = {
  title?: string;
  description?: string;
  url?: string;
  pathname: string;
  image?: string;
  twitterCreator?: string;
};

export type UpsertAttrType = 'name' | 'property';

export type UpsertFn = (
  attrType: UpsertAttrType,
  key: string,
  value?: string,
) => void;
