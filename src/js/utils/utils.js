import {
  EMPTY,
  REG_PATHNAME,
  TYPEOF_BOOL,
  TYPEOF_FUNC,
  TYPEOF_OBJ,
  TYPEOF_STR,
} from './constants';

/**
 * Shorthand for Array.isArray
 */
export const isArr = Array.isArray;

/**
 * Safely trims string
 * @param {string} str String
 */
export function trim(str) {
  return typeof str === TYPEOF_STR ? str.trim() : EMPTY;
}

/**
 * Checks if value is an object
 * @param {*} value Any type of value
 */
export function isObject(value) {
  return value && typeof value === TYPEOF_OBJ;
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
  return typeof route === TYPEOF_STR && REG_PATHNAME.test(route);
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
      if (typeof callback === TYPEOF_FUNC) {
        const continueTheLoop = callback.apply(arrayObj, [
          arrayObj[index],
          index,
        ]);
        if (typeof continueTheLoop === TYPEOF_BOOL) {
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
