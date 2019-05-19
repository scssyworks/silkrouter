import LZStorage from 'lzstorage';

const store = new LZStorage({
    compression: true
});

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
        const paths = store.get('routeStore') || {};
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
        let paths = store.get('routeStore') || {};
        if (paths[path]) {
            if (
                !data
                || (
                    typeof data === 'object'
                    && Object.keys(data).length === 0
                )
            ) {
                // Don't change existing data
                return false;
            }
        }
        paths = {
            ...paths,
            [`${isHash ? '#' : ''}${path}`]: data
        };
        return store.set('routeStore', paths, true);
    },
    /**
     * @namespace handlers
     * @type {object[]}
     * @private
     */
    handlers: []
};