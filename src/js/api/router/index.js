import { assign } from '../../utils/assign';
import bindRouterEvents from '../bindRouterEvents';
import set from '../set';
import { HISTORY_UNSUPPORTED, PUSH, TYPEOF_FUNC } from '../../utils/constants';
import callOnce from '../callOnce';
import { getGlobal } from '../../utils/getGlobal';

export default class Router {
  constructor(config) {
    const { history, location, document } = getGlobal();
    if (!history[PUSH]) {
      throw new Error(HISTORY_UNSUPPORTED);
    }
    this.config = Object.freeze(
      assign(
        {
          init: true, // Initialize as soon as route handler is attached
          hashRouting: false, // Switch to hash routing
          preservePath: false, // Works for hash routing
          context: document.body, // To change the context of "vpushstate" event
          location, // Should remain unchanged
          history, // History object
        },
        config || {}
      )
    );
    this.__paths__ = [];
    bindRouterEvents(this);
  }
  pipe(...ops) {
    return this.listeners.pipe(callOnce.apply(this), ...ops);
  }
  subscribe(...fns) {
    return this.pipe().subscribe(...fns);
  }
  set(...props) {
    return set.apply(this, props);
  }
  destroy(callback) {
    if (typeof callback === TYPEOF_FUNC) {
      callback();
    }
    this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
    this.__paths__.length = 0;
  }
}
