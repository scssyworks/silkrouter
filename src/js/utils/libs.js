import { assign } from './assign';
import { isPureObject, keys } from './utils';
import { store } from '../store';

function Libs() {
    this.handlers = [];
}
assign(Libs.prototype, {
    getDataFromStore(path, isHash) {
        const paths = assign(store.get('routeStore'));
        return paths[`${isHash ? '#' : ''}${path}`];
    },
    setDataToStore(path, isHash, data) {
        let paths = assign(store.get('routeStore'));
        if (paths[path]) {
            if (
                !data
                || (
                    isPureObject(data)
                    && keys(data).length === 0
                )
            ) { return false; }
        }
        const newPath = {};
        newPath[`${isHash ? '#' : ''}${path}`] = data;
        paths = assign({}, paths, newPath);
        return store.set('routeStore', paths);
    },
    contains(fn) {
        return !!this.handlers.filter(fn).length;
    },
    remove(item) {
        this.handlers.splice(this.handlers.indexOf(item), 1).length;
    }
});

export const libs = new Libs();