import $ from 'jquery';
import LZStorage from 'lzstorage';

// Object containing a map of attached handlers
const store = new LZStorage({
    compression: true
});
export const libs = {
    getDataFromStore(path, isHash) {
        const paths = $.extend({}, store.get('routeStore'));
        return paths[`${isHash ? '#' : ''}${path}`];
    },
    setDataToStore(path, isHash, data) {
        const paths = $.extend({}, store.get('routeStore'));
        $.extend(paths, {
            [`${isHash ? '#' : ''}${path}`]: data
        });
        return store.set('routeStore', paths, true);
    },
    handlers: []
};