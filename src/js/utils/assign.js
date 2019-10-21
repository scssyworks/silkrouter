import { keys, isObject } from './utils';

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref, target) {
    if (isObject(ref)) {
        keys(ref).forEach(function (key) {
            target[key] = ref[key];
        });
    }
}

/**
 * Polyfill for Object.assign only smaller and with less features
 * @private
 * @returns {object}
 */
export function assign() {
    const target = isObject(arguments[0]) ? arguments[0] : {};
    for (let i = 1; i < arguments.length; i++) {
        loopFunc(arguments[i], target);
    }
    return target;
}