import { loc } from '../../utils/vars';
import { trim } from '../../utils/utils';

/**
 * Adds a query string
 * @private
 * @param {string} route Route string
 * @param {string} qString Query string
 * @param {boolean} appendQString Append query string flag
 */
export default function resolveQuery(route, isHash, queryString, append) {
    queryString = trim(queryString.substring(+(queryString.charAt(0) === '?')));
    const search = (append || '') && loc.search;
    if (!isHash) {
        return `${route}${search}${queryString ? `${search ? '&' : '?'}${queryString}` : ''}`;
    }
    return `${loc.pathname}${search}#${route}${queryString ? `?${queryString}` : ''}`;
}