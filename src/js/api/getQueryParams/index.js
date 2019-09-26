import { deparam } from '../../utils/deparam';
import { loc } from '../../utils/vars';
import { assign } from '../../utils/assign';
import { REG_HASH_QUERY } from '../../utils/constants';

/**
 * Converts current query string into an object
 * @private
 */
export default function getQueryParams() {
    const qsObject = deparam();
    let hashStringParams = {};
    const hashQuery = loc.hash.match(REG_HASH_QUERY);
    if (hashQuery) {
        hashStringParams = assign({}, deparam(hashQuery[0]));
    }
    return assign({}, qsObject, hashStringParams);
}