import { REG_PATHNAME } from './constants';

/**
 * Shorthand for Array.isArray
 */
export const isArr = Array.isArray;

/**
 * Safely trims string
 * @param {string} str String
 */
export function trim(str) {
    return ((typeof str === 'string') ? str.trim() : '');
}

/**
 * Checks if input is a number
 * @param {*} key 
 */
export function isNumber(key) {
    key = trim(`${key}`);
    if (['null', 'undefined', ''].indexOf(key) > -1) return false;
    return !isNaN(+key);
}

/**
 * Checks if value is an object
 * @param {*} value Any type of value
 */
export function isObject(value) {
    return value && typeof value === 'object';
}

/**
 * Checks if key is a true object
 * @param {*} value Any type of value
 */
export function isPureObject(value) {
    return isObject(value) && !isArr(value);
}

/**
 * Sets default value
 * @param {*} value Any value
 * @param {*} defaultValue Default value if value is undefined
 */
export function def(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}

/**
 * Converts array like object to array
 * @param {any[]} arr Arraylike object
 */
export function toArray(arr) {
    return Array.prototype.slice.call(arr);
}

/**
 * Checks if given route is valid
 * @private
 * @param {string} route Route string
 */
export function isValidRoute(route) {
    return (typeof route === 'string' && REG_PATHNAME.test(route));
}

/**
 * Checks if the URL is a hash URL
 * @private
 * @param {string} URL URL string
 */
export function isHashURL(URL) {
    return typeof URL === 'string' && URL.charAt(0) === '#';
}

/**
 * Checks if input value is a function
 * @param {function} fn Input function
 */
export function isFunc(fn) {
    return typeof fn === 'function';
}

/**
 * Returns an empty PopStateEvent object
 * @param {string} type Type of event
 * @param {*} data Any type of data
 */
export function getPopStateEvent(type, data) {
    return {
        type,
        state: { data }
    };
}

/**
 * Safely returns object keys
 * @param {object} obj Object
 */
export function keys(obj) {
    return obj ? Object.keys(obj) : [];
}

/**
 * Checks if key is present in provided object
 * @param {object} ob Object
 * @param {*} key Key
 */
export function hasOwn(ob, key) {
    return Object.prototype.hasOwnProperty.call(ob, key);
}

/**
 * Loops over an array like object
 * @param {object} arrayObj Array or array like object
 * @param {function} callback Callback function
 */
export function each(arrayObj, callback) {
    if (arrayObj && arrayObj.length) {
        for (let index = 0; index < arrayObj.length; index += 1) {
            if (typeof callback === 'function') {
                const continueTheLoop = callback.apply(arrayObj, [arrayObj[index], index]);
                if (typeof continueTheLoop === 'boolean') {
                    if (continueTheLoop) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
        }
    }
}