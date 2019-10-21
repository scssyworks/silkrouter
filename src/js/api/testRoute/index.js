import { libs } from '../../utils/libs';
import { extractParams } from '../../utils/params';
import { isValidRoute, isHashURL, keys } from '../../utils/utils';
import { assign } from '../../utils/assign';

/**
 * Compares route with current URL
 * @private
 * @param {string} route Route string
 * @param {string} url Current url
 * @param {object} params Parameters
 */
export default function testRoute(route, url, originalData) {
    const isHash = isHashURL(url);
    url = url.substring(+isHash);
    const path = url.split('?')[0];
    originalData = assign(originalData);
    if (keys(originalData).length) {
        libs.setDataToStore(path, isHash, originalData);
    }
    return {
        hasMatch: keys(params).length > 0 || (
            isValidRoute(url) && ((route === url) || (route === '*'))
        ),
        data: libs.getDataFromStore(path, isHash),
        params: extractParams(route, url)
    };
}