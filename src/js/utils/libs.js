import { assign } from './assign';
import { isObject } from './utils';
import { store } from '../store';

/**
 * Store library
 * @namespace libs
 * @type {object}
 * @private
 */
export const libs = {
    /**
     * Get's decompressed data from store
     * @private
     * @method getDataFromStore
     * @memberof libs
     * @param {string} path URL path
     * @param {boolean} isHash Flag to determine if it's a pathname or hash
     * @returns {*}
     */
    getDataFromStore(path, isHash) {
        const paths = assign(store.get('routeStore'));
        return paths[`${isHash ? '#' : ''}${path}`];
    },
    /**
     * @private
     * @method setDataToStore
     * @memberof libs
     * @param {string} path URL path
     * @param {boolean} isHash Flag to determine if it's a pathname or hash
     * @param {any} data Data
     * @returns {boolean}
     */
    setDataToStore(path, isHash, data) {
        let paths = assign(store.get('routeStore'));
        if (paths[path]) {
            if (
                !data
                || (
                    isObject(data)
                    && Object.keys(data).length === 0
                )
            ) {
                // Don't change existing data
                return false;
            }
        }
        const newPath = {};
        newPath[`${isHash ? '#' : ''}${path}`] = data;
        paths = assign({}, paths, newPath);
        return store.set('routeStore', paths, true);
    },
    /**
     * @namespace handlers
     * @type {object[]}
     * @private
     */
    handlers: [],
    contains(fn) {
        return !!this.handlers.filter(fn).length;
    }
};