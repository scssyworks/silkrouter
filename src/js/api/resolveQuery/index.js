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
    queryString = trim(queryString.substring((queryString.charAt(0) === '?' ? 1 : 0)));
    if (!isHash) {
        if (append) {
            return `${route}${loc.search}${(queryString ? `&${queryString}` : '')}`;
        }
        return `${route}${(queryString ? `?${queryString}` : '')}`;
    }
    return `${loc.pathname}${loc.search}#${route}${queryString ? `?${queryString}` : ''}`;
}