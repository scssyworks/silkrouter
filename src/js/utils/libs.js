import LZStorage from 'lzstorage';

// Object containing a map of attached handlers
const store = new LZStorage({
    compression: true
});
export const libs = {
    getDataFromStore(path, isHash) {
        const paths = store.get('routeStore') || {};
        return paths[`${isHash ? '#' : ''}${path}`];
    },
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
    handlers: []
};