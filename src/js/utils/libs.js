import $ from 'jquery';
import LZStorage from 'lzstorage';

// Object containing a map of attached handlers
const store = new LZStorage({
    compression: true
});
export const libs = {
    getDataFromStore(path) {
        const paths = $.extend({}, store.get('routeStore'));
        return paths[path];
    },
    setDataToStore(path, data) {
        const paths = $.extend({}, store.get('routeStore'));
        $.extend(paths, {
            [path]: data
        });
        return store.set('routeStore', paths, true);
    },
    handlers: []
};