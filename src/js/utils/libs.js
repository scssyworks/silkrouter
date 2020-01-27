import { assign } from './assign';
import { isPureObject, keys } from './utils';
import { store } from '../store';

class StorageLib {
    getDataFromStore(path) {
        const paths = assign(store.get('routeStore'));
        return paths[path];
    }
    setDataToStore(path, data) {
        let paths = assign(store.get('routeStore'));
        if (paths[path]) {
            if (!data
                || (isPureObject(data) && keys(data).length === 0)
            ) return false;
        }
        const newPath = {};
        newPath[path] = data;
        paths = assign({}, paths, newPath);
        return store.set('routeStore', paths);
    }
}

export const libs = new StorageLib();