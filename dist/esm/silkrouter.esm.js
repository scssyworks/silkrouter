import { Observable, fromEvent } from 'rxjs';

/**
 * Router constants
 */
const POP_STATE = 'popstate';
const REG_ROUTE_PARAMS = /:[^/]+/g;
const REG_PATHNAME = /^\/(?=[^?]*)/;
const REG_COMPLEX = /\[/;
const REG_VARIABLE = /([^[]+)\[([^[]*)\]/;
const REG_REPLACE_BRACKETS = /\[([^[]*)\]/;
const REG_REPLACE_NEXTPROP = /[^[]+/;
const HISTORY_UNSUPPORTED = 'Current browser does not support history object';
const INVALID_ROUTE = 'Route string is not a pure route';
const LOCAL_ENV = ['localhost', '0.0.0.0', '127.0.0.1', null];
const VIRTUAL_PUSHSTATE = 'vpushstate';

/**
 * Shorthand for Array.isArray
 */
const isArr = Array.isArray;

/**
 * Safely trims string
 * @param {string} str String
 */
function trim(str) {
    return ((typeof str === 'string') ? str.trim() : '');
}

/**
 * Checks if input is a number
 * @param {*} key 
 */
function isNumber(key) {
    key = trim(`${key}`);
    if (['null', 'undefined', ''].indexOf(key) > -1) return false;
    return !isNaN(+key);
}

/**
 * Checks if value is an object
 * @param {*} value Any type of value
 */
function isObject(value) {
    return value && typeof value === 'object';
}

/**
 * Checks if key is a true object
 * @param {*} value Any type of value
 */
function isPureObject(value) {
    return isObject(value) && !isArr(value);
}

/**
 * Checks if given route is valid
 * @private
 * @param {string} route Route string
 */
function isValidRoute(route) {
    return (typeof route === 'string' && REG_PATHNAME.test(route));
}

/**
 * Checks if key is present in provided object
 * @param {object} ob Object
 * @param {*} key Key
 */
function hasOwn(ob, key) {
    return Object.prototype.hasOwnProperty.call(ob, key);
}

/**
 * Loops over an array like object
 * @param {object} arrayObj Array or array like object
 * @param {function} callback Callback function
 */
function each(arrayObj, callback) {
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
function assign() {
    const target = isObject(arguments[0]) ? arguments[0] : {};
    for (let i = 1; i < arguments.length; i++) {
        loopFunc(arguments[i], target);
    }
    return target;
}

// Polyfill custom event
if (typeof window.CustomEvent === 'undefined') {
    const CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}

// Internal function
function isValidTarget(target) {
    return (
        target instanceof NodeList
        || target instanceof HTMLCollection
        || Array.isArray(target)
    );
}

/**
 * Function to trigger custom event
 * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
 * @param {string} eventType Event type
 * @param {any[]} data Data to be passed to handler
 */
function trigger(target, eventType, data) {
    if (target instanceof Node) {
        target = [target];
    }
    if (isValidTarget(target) && typeof eventType === 'string') {
        each(target, el => {
            const customEvent = new window.CustomEvent(eventType, {
                bubbles: true,
                cancelable: true,
                detail: (data || [])
            });
            el.dispatchEvent(customEvent);
        });
    }
}

const loc = window.location;
const f = String.fromCharCode;

function _update(context, bitsPerChar, getCharFromInt) {
    if (context.context_data_position == bitsPerChar - 1) {
        context.context_data_position = 0;
        context.context_data.push(getCharFromInt(context.context_data_val));
        context.context_data_val = 0;
    } else {
        context.context_data_position++;
    }
}

function _updateContextNumBits(context) {
    context.context_enlargeIn--;
    if (context.context_enlargeIn == 0) {
        context.context_enlargeIn = 2 ** context.context_numBits;
        context.context_numBits++;
    }
}

function _updateContext(context, bitsPerChar, getCharFromInt) {
    if (hasOwn(context.context_dictionaryToCreate, context.context_w)) {
        if (context.context_w.charCodeAt(0) < 256) {
            for (let i = 0; i < context.context_numBits; i++) {
                context.context_data_val = (context.context_data_val << 1);
                _update(context, bitsPerChar, getCharFromInt);
            }
            context.value = context.context_w.charCodeAt(0);
            for (let i = 0; i < 8; i++) {
                context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
                _update(context, bitsPerChar, getCharFromInt);
                context.value = context.value >> 1;
            }
        } else {
            context.value = 1;
            for (let i = 0; i < context.context_numBits; i++) {
                context.context_data_val = (context.context_data_val << 1) | context.value;
                _update(context, bitsPerChar, getCharFromInt);
                context.value = 0;
            }
            context.value = context.context_w.charCodeAt(0);
            for (let i = 0; i < 16; i++) {
                context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
                _update(context, bitsPerChar, getCharFromInt);
                context.value = context.value >> 1;
            }
        }
        _updateContextNumBits(context);
        delete context.context_dictionaryToCreate[context.context_w];
    } else {
        context.value = context.context_dictionary[context.context_w];
        for (let i = 0; i < context.context_numBits; i++) {
            context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
            _update(context, bitsPerChar, getCharFromInt);
            context.value = context.value >> 1;
        }
    }
    _updateContextNumBits(context);
}

function compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    const context = {
        context_dictionary: {},
        context_dictionaryToCreate: {},
        context_data: [],
        context_c: "",
        context_wc: "",
        context_w: "",
        context_enlargeIn: 2,
        context_dictSize: 3,
        context_numBits: 2,
        context_data_val: 0,
        context_data_position: 0
    };
    let i = 0;
    for (let ii = 0; ii < uncompressed.length; ii += 1) {
        context.context_c = uncompressed.charAt(ii);
        if (!hasOwn(context.context_dictionary, context.context_c)) {
            context.context_dictionary[context.context_c] = context.context_dictSize++;
            context.context_dictionaryToCreate[context.context_c] = true;
        }
        context.context_wc = context.context_w + context.context_c;
        if (hasOwn(context.context_dictionary, context.context_wc)) {
            context.context_w = context.context_wc;
        } else {
            _updateContext(context, bitsPerChar, getCharFromInt);
            context.context_dictionary[context.context_wc] = context.context_dictSize++;
            context.context_w = String(context.context_c);
        }
    }
    if (context.context_w !== "") {
        _updateContext(context, bitsPerChar, getCharFromInt);
    }
    context.value = 2;
    for (i = 0; i < context.context_numBits; i++) {
        context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
        _update(context, bitsPerChar, getCharFromInt);
        context.value = context.value >> 1;
    }
    // Flush the last char
    // eslint-disable-next-line
    while (true) {
        context.context_data_val = (context.context_data_val << 1);
        if (context.context_data_position == bitsPerChar - 1) {
            context.context_data.push(getCharFromInt(context.context_data_val));
            break;
        }
        else context.context_data_position++;
    }
    return context.context_data.join('');
}

function _commonRep3(data, maxpower, resetValue, getNextValue) {
    let bits = 0;
    let power = 1;
    while (power !== maxpower) {
        const resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
    }
    return bits;
}

function decompress(length, resetValue, getNextValue) {
    const dictionary = [];
    const data = {
        val: getNextValue(0),
        position: resetValue,
        index: 1
    };
    const result = [];
    let enlargeIn = 4;
    let dictSize = 4;
    let numBits = 3;
    let entry = '';
    let w;
    let c;
    for (let i = 0; i < 3; i++) {
        dictionary[i] = i;
    }
    switch (_commonRep3(data, Math.pow(2, 2), resetValue, getNextValue)) {
        case 0:
            c = f(_commonRep3(data, Math.pow(2, 8), resetValue, getNextValue));
            break;
        case 1:
            c = f(_commonRep3(data, Math.pow(2, 16), resetValue, getNextValue));
            break;
        case 2:
            return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    // eslint-disable-next-line
    while (true) {
        if (data.index > length) {
            return '';
        }
        switch (c = _commonRep3(data, Math.pow(2, numBits), resetValue, getNextValue)) {
            case 0:
                dictionary[dictSize++] = f(_commonRep3(data, Math.pow(2, 8), resetValue, getNextValue));
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 1:
                dictionary[dictSize++] = f(_commonRep3(data, Math.pow(2, 16), resetValue, getNextValue));
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 2:
                return result.join('');
        }
        if (enlargeIn === 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
        if (dictionary[c]) {
            entry = dictionary[c];
        } else {
            if (c === dictSize) {
                entry = w + w.charAt(0);
            } else {
                return null;
            }
        }
        result.push(entry);
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn === 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
    }
}

function toUTF16(input) {
    if (input == null) return '';
    return compress(input, 15, (a) => f(a + 32)) + ' ';
}

function fromUTF16(compressed) {
    if (compressed == null) return '';
    if (compressed === '') return null;
    return decompress(compressed.length, 16384, (index) => (compressed.charCodeAt(index) - 32));
}

/**
 * Sets user cookie
 * @param {string} key name of cookie
 * @param {string} value cookie value
 * @param {string} exp cookie expiry
 * @param {string} path url path
 * @param {string} domain supported domain
 * @param {boolean} isSecure Sets security flag
 */
function setCookie(key, value) {
    if (key && typeof value !== 'undefined') {
        const domain = loc.hostname;
        const isSecure = loc.protocol === 'https:';
        let transformedValue = value;
        if (isObject(value)) {
            transformedValue = JSON.stringify(value);
        }
        const cookiePath = `; path=/`;
        const cookieDomain = (LOCAL_ENV.indexOf(domain) === -1) ? `; domain=${trim(domain)}` : '';
        const secureFlag = isSecure ? '; secure' : '';
        document.cookie = `${key} = ${transformedValue}${cookieDomain}${cookiePath}${secureFlag}`;
    }
}

/**
 * Get's cookie value
 * @param {string} key Key
 * @param {boolean} trimResult Flag to trim the value
 */
function getCookie(key) {
    if (key) {
        const cookieStr = decodeURIComponent(document.cookie);
        let value = '';
        each(cookieStr.split(';'), cookiePair => {
            const keyPart = `${key}=`;
            const indexOfKey = cookiePair.indexOf(keyPart);
            if (indexOfKey > -1) {
                value = trim(cookiePair.substring((indexOfKey + keyPart.length), cookiePair.length));
                return false;
            }
        });
        return value;
    }
    return '';
}

/**
 * Returns true if local storage is accessible
 */
function isStorageAvailable() {
    try {
        sessionStorage.setItem('testKey', 'testValue');
        sessionStorage.removeItem('testKey');
        return true;
    } catch (e) {
        return false;
    }
}

function set(key, value) {
    if (isStorageAvailable()) {
        return sessionStorage.setItem(key, toUTF16(isObject(value) ? JSON.stringify(value) : value));
    }
    return setCookie(key, value);
}

function get(key) {
    if (isStorageAvailable()) {
        let value = fromUTF16(sessionStorage.getItem(key));
        try {
            value = JSON.parse(value);
            return value;
        } catch (e) {
            return value;
        }
    }
    return getCookie(key);
}

const store = {
    set() {
        return set.apply(this, arguments);
    },
    get() {
        return get.apply(this, arguments);
    }
};

class StorageLib {
    getDataFromStore(path) {
        const paths = assign(store.get('routeStore'));
        return paths[path];
    }
    setDataToStore(path, data) {
        let paths = assign(store.get('routeStore'));
        if (paths[path]) {
            if (!data
                || (isPureObject(data) && Object.keys(data).length === 0)
            ) return false;
        }
        return store.set('routeStore', assign({}, paths, {
            [path]: data
        }));
    }
}

const libs = new StorageLib();

class RouterEvent {
    constructor(routeInfo, routerInstance, currentEvent) {
        // Set relevant parameters
        const { location, preservePath } = routerInstance.config;
        const [routeObject, originalEvent] = routeInfo;
        this.route = routeObject.path;
        this.hashRouting = routeObject.hash;
        this.routerInstance = routerInstance;
        this.virtualEvent = currentEvent || {};
        this.originalEvent = originalEvent || {};
        this.path = trim(location.pathname);
        this.hash = location.hash;
        this.search = trim(location.search.substring(1));
        this.hashSearch = trim(location.hash && location.hash.split('?')[1]);
        // Extract data
        let { path } = routeObject;
        if (this.hashRouting) {
            path = `#${path}`;
            if (preservePath) {
                path = `${location.pathname}${path}`;
            }
        }
        // Set route data to store
        libs.setDataToStore(path, this.originalEvent.state && this.originalEvent.state.data);
        // Get current data from store
        this.data = libs.getDataFromStore(path);
    }
}

function collate(routerInstance) {
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                subscriber.next(
                    new RouterEvent(event.detail, routerInstance, event)
                );
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            subn.unsubscribe();
        }
    });
}

function bindRouterEvents() {
    const { context, location, hashRouting } = this.config;
    this.popStateSubscription = fromEvent(window, POP_STATE).subscribe(e => {
        const path = trim(hashRouting ? location.hash.substring(1).split('?')[0] : location.pathname);
        if (path) {
            trigger(context, VIRTUAL_PUSHSTATE, [{ path, hash: hashRouting }, e]);
        }
    });
    this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE)
        .pipe(collate(this));
    if (hashRouting && !location.hash) {
        this.set('/', true, false); // Replace current hash path without executing anythings
    }
}

/**
 * Builds query string recursively
 * @private
 * @param {string[]} qsList List of query string key value pairs
 * @param {*} key Key
 * @param {*} obj Value
 */
function buildQuery(qsList, key, obj) {
    if (isObject(obj)) {
        Object.keys(obj).forEach(obKey => {
            buildQuery(qsList, `${key}[${isArr(obj) ? '' : obKey}]`, obj[obKey]);
        });
    } else if (typeof obj !== 'function') {
        qsList.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj)}`);
    }
}

/**
 * Converts an object to a query string
 * @private
 * @param {object} obj Object which should be converted to a string
 * @returns {string}
 */
function toQueryString(obj) {
    let qsList = [];
    if (isObject(obj)) {
        Object.keys(obj).forEach(key => {
            buildQuery(qsList, key, obj[key]);
        });
        return qsList.join('&');
    }
    return typeof obj === 'string' ? obj : '';
}

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

/**
 * Resolves and analyzes existing query string
 * @private
 * @param {string} queryString Query string
 * @param {string} hashRouting Flag to test if hash routing is enabled
 */
function resolveQuery(queryString, hashRouting) {
    const { location } = this.config;
    const search = trim(location.search && location.search.substring(1));
    const existingQuery = hashRouting
        ? trim(location.hash.split('?')[1])
        : trim(search);
    if (!existingQuery) return queryString;
    return toQueryString(assign(lib(search), lib(existingQuery), lib(queryString)));
}

function set$1(route, replace = false, exec = true) {
    const { preservePath, hashRouting, location, history } = this.config;
    const routeObject = assign(
        { replace, exec },
        (typeof route === 'string') ? { route } : route
    );
    replace = routeObject.replace;
    exec = routeObject.exec;
    let {
        route: routeStr,
        queryString
    } = routeObject;
    const {
        preserveQuery,
        data,
        pageTitle = document.querySelector('head title').textContent
    } = routeObject;
    const routeParts = routeStr.split('?');
    // Check if query string is an object
    if (isObject(queryString)) {
        queryString = toQueryString(queryString);
    }
    // Resolve to URL query string if it's not explicitly passed
    queryString = trim(queryString ? queryString : routeParts[1]);
    routeStr = trim(routeParts[0]);
    // Check if query preservation is required. Resolve query accordingly
    if (preserveQuery) {
        queryString = resolveQuery.apply(this, [queryString, hashRouting]);
    }
    if (isValidRoute(routeStr)) {
        const unmodifiedRoute = routeStr;
        if (hashRouting) {
            routeStr = `#${routeStr}`;
            // Path preservation should only work for hash routing
            if (preservePath) {
                routeStr = `${location.pathname}${routeStr}`;
            }
        }
        // Sync data to store before appending query string. Query string should have no effect on stored data
        libs.setDataToStore(routeStr, data);
        // Append query string
        routeStr = `${routeStr}${queryString ? `?${queryString}` : ''}`;
        history[replace ? 'replaceState' : 'pushState']({ data }, pageTitle, routeStr);
        if (exec && unmodifiedRoute) {
            trigger(this.config.context, VIRTUAL_PUSHSTATE, [{
                path: unmodifiedRoute,
                hash: hashRouting
            }]);
        }
    } else {
        throw new TypeError(INVALID_ROUTE);
    }
    return this;
}

function callOnce(routerInstance, isDone) {
    const { hashRouting, location } = routerInstance.config;
    const path = trim(hashRouting ? location.hash.substring(1).split('?')[0] : location.pathname);
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next() {
                subscriber.next(...arguments);
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        if (!isDone) {
            isDone = true;
            if (path) {
                subscriber.next(
                    new RouterEvent([{ path, hash: hashRouting }], routerInstance)
                );
            }
        }
        return () => {
            subn.unsubscribe();
        }
    });
}

class Router {
    constructor(config = {}) {
        if (!window.history.pushState) {
            throw new Error(HISTORY_UNSUPPORTED);
        }
        config = assign({
            hashRouting: false, // Switch to hash routing
            preservePath: false, // Works for hash routing
            context: document.body, // To change the context of "vpushstate" event
            location: window.location, // Should remain unchanged
            history: window.history // History object
        }, config);
        this.config = Object.freeze(config);
        this.__paths__ = [];
        bindRouterEvents.apply(this);
    }
    pipe() {
        return this.listeners.pipe(
            callOnce(this),
            ...arguments
        );
    }
    subscribe() {
        return this.listeners
            .pipe(callOnce(this))
            .subscribe(...arguments);
    }
    set() {
        return set$1.apply(this, arguments);
    }
    destroy(callback) {
        if (typeof callback === 'function') {
            callback();
        }
        this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
        this.__paths__.length = 0;
    }
}

/**
 * Parses current path and returns params object
 * @private
 * @param {string} expr Route expression
 * @param {string} path URL path
 * @returns {object}
 */
function extractParams(expr, path = loc.pathname) {
    const params = {};
    if (REG_ROUTE_PARAMS.test(expr)) {
        const pathRegex = new RegExp(expr.replace(/\//g, "\\/").replace(/:[^/\\]+/g, "([^\\/]+)"));
        REG_ROUTE_PARAMS.lastIndex = 0;
        if (pathRegex.test(path)) {
            const keys = [...expr.match(REG_ROUTE_PARAMS)].map(key => key.replace(':', ''));
            const values = [...path.match(pathRegex)];
            values.shift();
            keys.forEach((key, index) => {
                params[key] = values[index];
            });
        }
    }
    return params;
}

/**
 * Operator to compare a specific route
 * @param {string} routeStr Route string
 * @param {Router} routerInstance Current router object [optional]
 * @param {boolean} ignoreCase Ignore case in route string
 */
function route(routeStr, routerInstance, ignoreCase) {
    if (typeof routerInstance === 'boolean') {
        ignoreCase = routerInstance;
        routerInstance = undefined;
    }
    routeStr = trim(routeStr);
    if (routerInstance instanceof Router) {
        const paths = routerInstance.__paths__;
        if (paths.indexOf(routeStr) === -1) {
            paths.push(routeStr);
        }
    }
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                let incomingRoute = event.route;
                if (isValidRoute(routeStr)) {
                    if (ignoreCase) {
                        routeStr = routeStr.toLowerCase();
                        incomingRoute = incomingRoute.toLowerCase();
                    }
                    const params = extractParams(routeStr, incomingRoute);
                    const paramsLength = Object.keys(params).length;
                    if (
                        incomingRoute === routeStr
                        || paramsLength > 0
                    ) {
                        if (paramsLength > 0) {
                            event.params = params;
                        }
                        subscriber.next(event);
                    }
                } else {
                    subscriber.error(
                        new Error(INVALID_ROUTE)
                    );
                }
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            if (routerInstance instanceof Router) {
                const paths = routerInstance.__paths__;
                const existingRouteIndex = paths.indexOf(routeStr);
                if (existingRouteIndex > -1) {
                    paths.splice(existingRouteIndex, 1);
                }
            }
            subn.unsubscribe();
        }
    });
}

/**
 * Converts search and hashSearch strings to object
 * @param {boolean} coerce Flag to enable value typecast
 */
function deparam$1(coerce = false) {
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                try {
                    event.search = lib(event.search, coerce);
                    event.hashSearch = lib(event.hashSearch, coerce);
                    subscriber.next(event);
                } catch (e) {
                    subscriber.error(e);
                }
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            subn.unsubscribe();
        }
    });
}

/**
 * Modifies current subscriber to detect errors
 * @param {Router} routerInstance Current router object
 */
function noMatch(routerInstance) {
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                if (routerInstance instanceof Router) {
                    const paths = routerInstance.__paths__;
                    if (paths.length > 0) {
                        const currentRoute = event.route;
                        let match = false;
                        for (let i = 0; i < paths.length; i++) {
                            if (paths[i] === currentRoute || Object.keys(extractParams(paths[i], currentRoute)).length) {
                                match = true;
                                break;
                            }
                        }
                        if (match) {
                            event.isErrorRoute = true;
                            subscriber.next(event);
                        }
                    }
                }
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            subn.unsubscribe();
        }
    });
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    route: route,
    deparam: deparam$1,
    noMatch: noMatch
});

export { Router, index as operators };
//# sourceMappingURL=silkrouter.esm.js.map
