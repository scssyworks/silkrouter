import { loc } from './vars';
import { isArr, trim, isNumber, isPureObject } from './utils';
import { REG_COMPLEX, REG_VARIABLE, REG_REPLACE_BRACKETS, REG_REPLACE_NEXTPROP } from './constants';

/**
 * Checks if query parameter key is a complex notation
 * @param {string} q 
 */
function ifComplex(q) {
    return (REG_COMPLEX.test(q));
}

/**
 * Converts query string to JavaScript object
 * @param {string} qs query string argument (defaults to url query string)
 */
function deparam(qs = loc.search, coerce = false) {
    qs = trim(qs);
    if (qs.charAt(0) === '?') {
        qs = qs.replace('?', '');
    }
    const queryObject = {};
    if (qs) {
        qs.split('&').forEach((qq) => {
            const qArr = qq.split('=').map(part => decodeURIComponent(part));
            (ifComplex(qArr[0]) ? complex : simple).apply(this, [...qArr, queryObject, coerce, false]);
        });
    }
    return queryObject;
}

/**
 * Converts an array to an object
 * @param {array} arr 
 */
function toObject(arr) {
    var convertedObj = {};
    if (isArr(arr)) {
        arr.forEach((value, index) => {
            convertedObj[index] = value;
        });
    }
    return convertedObj;
}

/**
 * Resolves an array to object if required
 * @param {array} ob An array object
 * @param {boolean} isNumber flag to test if next key is number
 */
function resolve(ob, isNextNumber) {
    return isNextNumber ? (typeof ob === 'undefined' ? [] : ob) : toObject(ob);
}

/**
 * Resolves the target object for next iteration
 * @param {Object} ob current reference object
 * @param {string} nextProp reference property in current object
 */
function resolveObj(ob, nextProp) {
    if (isPureObject(ob)) return { ob };
    if (isArr(ob) || typeof ob === 'undefined') return { ob: resolve(ob, isNumber(nextProp)) };
    return { ob: [ob], push: ob !== null };
}

/**
 * Handles complex query parameters
 * @param {string} key 
 * @param {string} value 
 * @param {Object} obj 
 */
function complex(key, value, obj, coercion = true) {
    const match = key.match(REG_VARIABLE) || [];
    if (match.length === 3) {
        const prop = match[1];
        let nextProp = match[2];
        key = key.replace(REG_REPLACE_BRACKETS, '');
        if (ifComplex(key)) {
            if (nextProp === '') nextProp = '0';
            key = key.replace(REG_REPLACE_NEXTPROP, nextProp);
            complex(key, value, (obj[prop] = resolveObj(obj[prop], nextProp).ob), coercion);
        } else if (nextProp) {
            const resolved = resolveObj(obj[prop], nextProp);
            obj[prop] = resolved.ob;
            const coercedValue = coercion ? coerce(value) : value;
            if (resolved.push) {
                obj[prop].push({
                    [nextProp]: coercedValue
                });
            } else {
                obj[prop][nextProp] = coercedValue;
            }
        } else {
            simple(prop, value, obj, coercion, true);
        }
    }
}

/**
 * Handles simple query
 * @param {array} qArr 
 * @param {Object} queryObject 
 * @param {boolean} toArray 
 */
function simple(key, value, queryObject, coercion = true, toArray) {
    if (coercion) {
        value = coerce(value);
    }
    if (key in queryObject) {
        queryObject[key] = isArr(queryObject[key]) ? queryObject[key] : [queryObject[key]];
        queryObject[key].push(value);
    } else {
        queryObject[key] = toArray ? [value] : value;
    }
}

/**
 * Restores values to their original type
 * @param {string} value undefined or string value
 */
function coerce(value) {
    if (value == null) return '';
    if (typeof value !== 'string') return value;
    if (isNumber(value = trim(value))) return +value;
    switch (value) {
        case 'null': return null;
        case 'undefined': return undefined;
        case 'true': return true;
        case 'false': return false;
        case 'NaN': return NaN;
        default: return value;
    }
}

// Library encapsulation
function lib() {
    return deparam.apply(this, arguments);
}

export { lib as deparam };