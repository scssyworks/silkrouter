import { isObject } from "deparam.js";
import { each } from "./utils";

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref, target) {
  if (isObject(ref)) {
    each(ref, (prop, key) => {
      target[key] = prop;
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
  each(args, (arg) => {
    loopFunc(arg, target);
  });
  return target;
}
