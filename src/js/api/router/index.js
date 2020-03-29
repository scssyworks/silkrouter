import { assign } from '../../utils/assign';
import bindRouterEvents from '../bindRouterEvents';
import set from '../set';
import { HISTORY_UNSUPPORTED } from '../../utils/constants';
import callOnce from '../callOnce';

export default class Router {
    constructor(config = {}) {
        if (!window.history.pushState) {
            throw new Error(HISTORY_UNSUPPORTED);
        }
        config = assign({
            hashRouting: false, // Switch to hash routing
            preservePath: false, // Works for hash routing
            context: document.body, // To change the context of "vpushstate" event
            location: window.location, // Should remain unchanged
            history: window.history // History object
        }, config);
        this.config = Object.freeze(config);
        this.__paths__ = [];
        bindRouterEvents.apply(this);
    }
    pipe() {
        return this.listeners.pipe(
            callOnce.apply(this),
            ...arguments
        );
    }
    subscribe() {
        return this.listeners
            .pipe(callOnce.apply(this))
            .subscribe(...arguments);
    }
    set() {
        return set.apply(this, arguments);
    }
    destroy(callback) {
        if (typeof callback === 'function') {
            callback();
        }
        this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
        this.__paths__.length = 0;
    }
}