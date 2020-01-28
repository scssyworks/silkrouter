import { assign } from './assign';
import { isPureObject } from './utils';
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
                || (isPureObject(data) && Object.keys(data).length === 0)
            ) return false;
        }
        return store.set('routeStore', assign({}, paths, {
            [path]: data
        }));
    }
}

export const libs = new StorageLib();