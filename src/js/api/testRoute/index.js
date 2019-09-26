import { libs } from '../../utils/libs';
import { extractParams } from '../../utils/params';
import { isValidRoute, isHashURL } from '../../utils/utils';
import { assign } from '../../utils/assign';

/**
 * Compares route with current URL
 * @private
 * @param {string} route Route string
 * @param {string} url Current url
 * @param {object} params Parameters
 */
export default function testRoute(route, url, originalData) {
    originalData = assign(originalData);
    const isHash = isHashURL(url);
    url = url.substring(isHash ? 1 : 0);
    const path = url.split('?')[0];
    if (!!Object.keys(originalData).length) {
        libs.setDataToStore(path, isHash, originalData); // Sync store with event data.
    }
    const data = libs.getDataFromStore(path, isHash);
    const params = extractParams(route, url);
    let hasMatch = Object.keys(params).length > 0 || (
        isValidRoute(url) && ((route === url) || (route === '*'))
    );
    return {
        hasMatch,
        data,
        params
    };
}