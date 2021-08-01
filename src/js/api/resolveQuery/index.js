import deparam from 'deparam.js';
import { trim } from '../../utils/utils';
import { toQueryString } from '../../utils/query';
import { assign } from '../../utils/assign';
import { QRY } from '../../utils/constants';

/**
 * Resolves and analyzes existing query string
 * @private
 * @param {string} queryString Query string
 * @param {string} hashRouting Flag to test if hash routing is enabled
 */
export default function resolveQuery(queryString, hashRouting) {
  const { location } = this.config;
  const search = trim(location.search && location.search.substring(1));
  const existingQuery = hashRouting
    ? trim(location.hash.split(QRY)[1])
    : trim(search);
  if (!existingQuery) return queryString;
  return toQueryString(
    assign(deparam(search), deparam(existingQuery), deparam(queryString))
  );
}
