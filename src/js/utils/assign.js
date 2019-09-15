/* eslint-disable */

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref, target) {
    if (ref != null && typeof ref === 'object') {
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
export function assign() {
    let i = 0;
    const target = typeof arguments[0] !== 'object' || arguments[0] == null ? {} : arguments[0];
    for (i = 1; i < arguments.length; i++) {
        loopFunc(arguments[i], target);
    }
    return target;
}
/* eslint-enable */