import { fromEvent } from 'rxjs';
import {
  HISTORY_UNSUPPORTED,
  POP_STATE,
  PUSH,
  TYPEOF_FUNC,
  VIRTUAL_PUSHSTATE,
} from '../../utils/constants';
import { getPath } from '../../utils/getPath';
import { trigger } from '../../utils/triggerEvent';
import collate from '../collate';
import callOnce from '../callOnce';

/**
 * Core router class to handle basic routing functionality
 */
export class RouterCore {
  constructor({ global, history, context, location, hash }) {
    if (!history[PUSH]) {
      throw new Error(HISTORY_UNSUPPORTED);
    }
    this.__paths__ = [];
    this.popStateSubscription = fromEvent(global, POP_STATE).subscribe((e) => {
      const path = getPath(hash, location);
      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{ path, hash }, e, this]);
      }
    });
    this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(
      collate.apply(this)
    );
  }
  pipe(...ops) {
    return this.listeners.pipe(callOnce.apply(this), ...ops);
  }
  subscribe(...fns) {
    return this.pipe().subscribe(...fns);
  }
  destroy(callback) {
    if (typeof callback === TYPEOF_FUNC) {
      callback();
    }
    this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
    this.__paths__.length = 0;
  }
}
