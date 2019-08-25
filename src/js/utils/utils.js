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
    return (key != null && !isArr(key) && key.toString() === "[object Object]");
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
