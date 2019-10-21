import { trim, each, isObject } from '../../utils/utils';
import { loc } from '../../utils/vars';
import { LOCAL_ENV } from '../../utils/constants';
import { toUTF16, fromUTF16 } from '../compression/utf16';

/**
 * Sets user cookie
 * @param {string} key name of cookie
 * @param {string} value cookie value
 * @param {string} exp cookie expiry
 * @param {string} path url path
 * @param {string} domain supported domain
 * @param {boolean} isSecure Sets security flag
 */
function setCookie(key, value) {
    if (key && typeof value !== 'undefined') {
        const domain = loc.hostname;
        const isSecure = loc.protocol === 'https:';
        let transformedValue = value;
        if (isObject(value)) {
            transformedValue = JSON.stringify(value);
        }
        const cookiePath = `; path=/`;
        const cookieDomain = (LOCAL_ENV.indexOf(domain) === -1) ? `; domain=${trim(domain)}` : '';
        const secureFlag = isSecure ? '; secure' : '';
        document.cookie = `${key} = ${transformedValue}${cookieDomain}${cookiePath}${secureFlag}`;
    }
}

/**
 * Get's cookie value
 * @param {string} key Key
 * @param {boolean} trimResult Flag to trim the value
 */
function getCookie(key) {
    if (key) {
        const cookieStr = decodeURIComponent(document.cookie);
        let value = '';
        each(cookieStr.split(';'), cookiePair => {
            const keyPart = `${key}=`;
            const indexOfKey = cookiePair.indexOf(keyPart);
            if (indexOfKey > -1) {
                value = trim(cookiePair.substring((indexOfKey + keyPart.length), cookiePair.length));
                return false;
            }
        });
        return value;
    }
    return '';
}

/**
 * Returns true if local storage is accessible
 */
function isStorageAvailable() {
    try {
        sessionStorage.setItem('testKey', 'testValue');
        sessionStorage.removeItem('testKey');
        return true;
    } catch (e) {
        return false;
    }
}

export function set(key, value) {
    if (isStorageAvailable()) {
        return sessionStorage.setItem(key, toUTF16(isObject(value) ? JSON.stringify(value) : value));
    }
    return setCookie(key, value);
}

export function get(key) {
    if (isStorageAvailable()) {
        let value = fromUTF16(sessionStorage.getItem(key));
        try {
            value = JSON.parse(value);
            return value;
        } catch (e) {
            return value;
        }
    }
    return getCookie(key);
}