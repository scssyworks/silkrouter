import { deparam } from '../../utils/deparam';
import { loc } from '../../utils/vars';
import { assign } from '../../utils/assign';
import { REG_HASH_QUERY } from '../../utils/constants';

/**
 * Converts current query string into an object
 * @private
 */
export default function getQueryParams() {
    const qsObject = deparam(loc.search, false);
    let hashStringParams = {};
    const hashQuery = loc.hash.match(REG_HASH_QUERY);
    if (hashQuery) {
        hashStringParams = assign({}, hashStringParams, deparam(hashQuery[0], false));
    }
    return assign({}, qsObject, hashStringParams);
}