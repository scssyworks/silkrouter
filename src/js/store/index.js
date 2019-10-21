import { get, set } from './storage';

export const store = {
    set() {
        return set.apply(this, arguments);
    },
    get() {
        return get.apply(this, arguments);
    }
};