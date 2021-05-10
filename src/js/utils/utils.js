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
  return typeof str === 'string' ? str.trim() : '';
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
 * Checks if given route is valid
 * @private
 * @param {string} route Route string
 */
export function isValidRoute(route) {
  return typeof route === 'string' && REG_PATHNAME.test(route);
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
        const continueTheLoop = callback.apply(arrayObj, [
          arrayObj[index],
          index,
        ]);
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
