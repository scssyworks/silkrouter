import { isObject } from './utils';

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref, target) {
  if (isObject(ref)) {
    Object.keys(ref).forEach(function (key) {
      target[key] = ref[key];
    });
  }
}

/**
 * Polyfill for Object.assign only smaller and with less features
 * @private
 * @returns {object}
 */
export function assign(...args) {
  const target = isObject(args[0]) ? args[0] : {};
  for (let i = 1; i < args.length; i++) {
    loopFunc(args[i], target);
  }
  return target;
}
