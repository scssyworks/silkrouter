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
        paths = {
            ...paths,
            [`${isHash ? '#' : ''}${path}`]: data
        };
        return store.set('routeStore', paths, true);
    },
    handlers: []
};