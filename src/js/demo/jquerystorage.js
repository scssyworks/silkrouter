/**
 * JQuery storage extends default storage API to resolve cross-browser issues
 * @author       Sachin Singh
 * @dependencies jQuery 1.11+
 * @date         26/05/2018
 */

(function ($) {
    if (!$) {
        window.$ = $ = {};
    }

    /**
     * Sets user cookie
     * @param {string} key name of cookie
     * @param {string} value cookie value
     * @param {string} exp cookie expiry
     * @param {string} path url path
     * @param {string} domain supported domain
     */
    function setCookie(key, value, exp, path, domain) {
        if (!(typeof key === 'string' && key.length)) {
            return; // Key is mandatory
        }
        if (typeof value !== 'string') {
            value = '';
        } //If value is invalid by default empty string will be set
        var dt = new Date();
        if (typeof exp === 'number') {
            if (exp === Infinity) {
                dt = new Date('Thu, 31 Dec 2037 00:00:00 GMT');
            } else {
                dt.setTime(dt.getTime() + exp * 24 * 60 * 60 * 1000);
            }
        }
        var expires = exp ? '; expires=' + dt.toUTCString() : '',
            cookiePath = '; path=' + (typeof path === 'string' ? path.trim() : '/'),
            defaultDomain = window.location.hostname,
            cookieDomain = '';
        if (defaultDomain === 'localhost') {
            // IE does not allow localhost domain
            if (typeof domain === 'string') {
                cookieDomain = '; domain=' + domain.trim();
            }
        } else {
            cookieDomain = '; domain=' + (typeof domain === 'string' ? domain.trim() : defaultDomain);
        }

        var secureCookieFlag = '';
        if (location.protocol === 'https:') {
            secureCookieFlag = '; secure';
        }
        document.cookie = key + '=' + value + expires + cookieDomain + cookiePath + secureCookieFlag;
    }

    /**
     * Gets cookie value
     * @param {string} key name of cookie
     */
    function getCookie(key) {
        if (!(typeof key === 'string' && key.length)) {
            return '';
        }
        var cookieString = decodeURIComponent(document.cookie),
            index = 0,
            allCookies = [],
            c = '';
        key += '=';
        allCookies = cookieString.split(';');
        if (allCookies.length) {
            for (; index < allCookies.length; index++) {
                c = allCookies[index].trim();
                if (c.contains(key)) {
                    return c.substring(key.length, c.length).trim();
                }
            }
        }
        return '';
    }

    /**
     * Removes a cookie
     * @param {string} key name of cookie
     * @param {string} path url path
     * @param {string} domain supported domain
     */
    function removeCookie(key, path, domain) {
        if (!(typeof key === 'string' && key.length)) {
            return false;
        }
        var cookiePath = typeof path === 'string' ? path : '/',
            defaultDomain = window.location.hostname,
            cookieDomain = '',
            deletedCookieString = '';
        if (defaultDomain === 'localhost') {
            // IE does not allow localhost domain
            if (typeof domain === 'string') {
                cookieDomain = '; domain=' + domain.trim();
            }
        } else {
            cookieDomain = '; domain=' + (typeof domain === 'string' ? domain.trim() : defaultDomain);
        }
        deletedCookieString = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC' + cookieDomain + '; path=' + cookiePath;
        document.cookie = deletedCookieString;
        return !getCookie(key).length; // Ensure if cookie has been deleted
    }

    /**
     * Resets existing cookie with new expiry
     * @param {string} key name of cookie
     * @param {string} value cookie value
     * @param {string} exp cookie expiry
     * @param {string} path url path
     * @param {string} domain supported domain
     */
    function resetCookie(key, value, exp, path, domain) {
        removeCookie(key, path, domain);
        setCookie(key, value, exp, path, domain);
    }

    if (!$.storage) {
        $.storage = {
            // True only if webstorage is available
            available: function () {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            },

            // Method to store key values in any available storages
            set: function set(key, value, isSession) {
                if (!(typeof key === 'string' && key.length)) {
                    return;
                }
                isSession = typeof isSession === 'boolean' ? isSession : false; // By default localStorage will be used
                var vl = (typeof value === 'undefined' ? 'undefined' : typeof value) === 'object' && value !== null ? JSON.stringify(value) : value;
                // Check if storage is defined
                if (this.available()) {
                    try {
                        if (isSession) {
                            window.sessionStorage.setItem(key, vl);
                        } else {
                            window.localStorage.setItem(key, vl);
                        }
                        return;
                    } catch (e) { }
                }
                // If control has reached here, it means storage operation was unsuccessful and we need to set a cookie instead
                if (isSession) {
                    // Set a session cookie
                    setCookie(key, vl);
                } else {
                    setCookie(key, vl, Infinity);
                }
                return;
            },
            // Method to remove key from all available storages
            remove: function remove(key) {
                if (!(typeof key === 'string' && key.length)) {
                    return false;
                }
                if (this.available()) {
                    try {
                        window.localStorage.removeItem(key);
                        window.sessionStorage.removeItem(key);
                        return !window.localStorage.key(key) || !window.sessionStorage.key(key) || removeCookie(key);
                    } catch (e) { }
                }
                return removeCookie(key);
            },
            // Get stored values from all available storages
            getAll: function getAll(key, isSession) {
                var returnValue = [],
                    cookieValue = null;
                isSession = typeof isSession === 'boolean' ? isSession : false;
                if (this.available()) {
                    try {
                        if (Object.prototype.hasOwnProperty.call(window.sessionStorage, key) && !isSession) {
                            returnValue.push({ value: window.sessionStorage.getItem(key), storage: 'sessionStorage' });
                        }
                        if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
                            returnValue.push({ value: window.localStorage.getItem(key), storage: 'localStorage' });
                        }
                    } catch (e) { }
                }
                cookieValue = getCookie(key);
                if (cookieValue.length) {
                    returnValue.push({ value: cookieValue, storage: 'cookie' });
                }
                return returnValue.map(function (data) {
                    try {
                        data.value = JSON.parse(data.value);
                        return data;
                    } catch (e) {
                        return data;
                    }
                });
            },
            // Get stored value from first match
            get: function get(key, isSession) {
                var storedValue = null;
                isSession = typeof isSession === 'boolean' ? isSession : false;
                if (!isSession) {
                    // Check session storage first. Session storage should always have priority over local storage
                    storedValue = this.getFromSessionStorage(key);
                    if (!storedValue) {
                        storedValue = this.getFromLocalStorage(key);
                    }
                } else {
                    // If isSession is true, then session storage is forced. In means we cannot get value from local storage
                    storedValue = this.getFromSessionStorage(key);
                }
                // If neither of the storages have value. It means value could be in cookies
                if (!storedValue) {
                    storedValue = this.getFromCookies(key);
                    if (!storedValue) {
                        return; // Return undefined
                    }
                }
                // Return the value part if value object has been successfully received
                return storedValue.value;
            },
            // update the value in storage
            update: function update(key, callbackOrValue, isSession) {
                var value = this.get(key);
                if (typeof callbackOrValue === 'function') {
                    this.set(key, callbackOrValue(value, key), isSession);
                } else {
                    this.set(key, callbackOrValue, isSession);
                }
            },
            // Get stored value from local storage only
            getFromLocalStorage: function getFromLocalStorage(key) {
                return this.getAll(key, true).filter(function (valueOb) {
                    return valueOb.storage === 'localStorage';
                })[0];
            },
            // Get stored value from session storage only
            getFromSessionStorage: function getFromSessionStorage(key) {
                return this.getAll(key).filter(function (valueOb) {
                    return valueOb.storage === 'sessionStorage';
                })[0];
            },
            // Get stored value from cookies only
            getFromCookies: function getFromCookies(key) {
                return this.getAll(key).filter(function (valueOb) {
                    return valueOb.storage === 'cookie';
                })[0];
            }
        };
    }
    if (typeof window.common === 'object' && !Array.isArray(window.common)) {
        if (!window.common.storage) {
            window.common.storage = $.storage;
        }
    } else {
        window.common = {
            storage: $.storage
        };
    }
    if (!window.common.setCookie) {
        window.common.setCookie = setCookie;
    }
    if (!window.common.getCookie) {
        window.common.getCookie = getCookie;
    }
    if (!window.common.removeCookie) {
        window.common.removeCookie = removeCookie;
    }
    if (!window.common.resetCookie) {
        window.common.resetCookie = resetCookie;
    }
})(
    window.jQuery
);