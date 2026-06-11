import type { MetaOptions, UpsertFn } from './main.types';

const DOC_HEAD = document.head;
const META_NAME = 'name';
const META_PROPERTY = 'property';
const REL_CANONICAL = 'canonical';
const OG_TYPE_VALUE = 'website';
const SITE_NAME_VALUE = 'Silkrouter';
const TWITTER_CARD_VALUE = 'summary';
const AUTHOR_VALUE = 'Sachin Singh';
const BASE_URL = 'https://silkrouter.dev';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.png`;

const query = <T extends Element = Element>(selector: string) =>
  DOC_HEAD.querySelector(selector) as T | null;
const createEl = (tag: string) => document.createElement(tag);
const setAttr = (el: Element, name: string, value: string) =>
  el.setAttribute(name, value);
const append = (el: Node) => DOC_HEAD.appendChild(el);
const metaSelector = (type: string, key: string) => `meta[${type}="${key}"]`;

export const upsert: UpsertFn = (attrType, key, value) => {
  if (!value) return;
  const selector = metaSelector(attrType, key);
  let el = query<HTMLMetaElement>(selector);
  if (el) setAttr(el, 'content', value);
  else {
    el = createEl('meta') as HTMLMetaElement;
    setAttr(el, attrType === META_NAME ? META_NAME : META_PROPERTY, key);
    setAttr(el, 'content', value);
    append(el);
  }
};

export function setMeta(opts: MetaOptions) {
  const { title, description, url, pathname, image, twitterCreator } = opts;
  if (title) document.title = title;

  // basic tags
  upsert(META_NAME, 'description', description);
  upsert(META_NAME, 'author', AUTHOR_VALUE);
  if (twitterCreator) upsert(META_NAME, 'twitter:creator', twitterCreator);

  // Open Graph
  upsert(META_PROPERTY, 'og:title', title);
  upsert(META_PROPERTY, 'og:description', description);
  upsert(META_PROPERTY, 'og:type', OG_TYPE_VALUE);
  upsert(META_PROPERTY, 'og:url', url || `${BASE_URL}${pathname}`);
  upsert(META_PROPERTY, 'og:site_name', SITE_NAME_VALUE);
  upsert(META_PROPERTY, 'og:image', image || DEFAULT_IMAGE);

  // Twitter
  upsert(META_NAME, 'twitter:card', TWITTER_CARD_VALUE);
  upsert(META_NAME, 'twitter:title', title);
  upsert(META_NAME, 'twitter:description', description);
  upsert(META_NAME, 'twitter:image', image || DEFAULT_IMAGE);

  // canonical link
  let canon = query<HTMLLinkElement>(`link[rel="${REL_CANONICAL}"]`);
  const canonicalUrl = url || `${BASE_URL}${pathname}`;
  if (canon) canon.href = canonicalUrl;
  else {
    canon = createEl('link') as HTMLLinkElement;
    setAttr(canon, 'rel', REL_CANONICAL);
    canon.href = canonicalUrl;
    append(canon);
  }
}
