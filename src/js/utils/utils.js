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
    return !isNaN(Number(key));
}

/**
 * Checks if key is a true object
 * @param {*} key Any type of value
 */
export function isObject(key) {
    return (key && !isArr(key) && key.toString() === "[object Object]");
}

/**
 * Sets default value
 * @param {*} value Any value
 * @param {*} defaultValue Default value if value is undefined
 */
export function setDefault(value, defaultValue) {
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