import { fromEvent } from 'rxjs';
import {
  HISTORY_UNSUPPORTED,
  POP_STATE,
  PUSH,
  VIRTUAL_PUSHSTATE,
} from '../../constants';
import { getPath } from '../../utils/getPath';
import { trigger } from '../../utils/triggerEvent';
import callOnce from '../callOnce';
import collate from '../collate';

/**
 * Core router class to handle basic routing functionality
 */
export class RouterCore {
  static get global() {
    return typeof globalThis !== 'undefined' ? globalThis : global || self;
  }
  /**
   * Router core constructor
   * @typedef {import('./types').RouterCoreConfig} RouterCoreConfig
   * @param {RouterCoreConfig} routerCoreConfig Route core configuration
   */
  constructor({ history, context, location, hash }) {
    if (!history[PUSH]) {
      throw new Error(HISTORY_UNSUPPORTED);
    }
    this.popStateSubscription = fromEvent(
      RouterCore.global,
      POP_STATE,
    ).subscribe(e => {
      const path = getPath(hash, location);
      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{ path, hash }, e, this]);
      }
    });
    this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(
      collate.apply(this),
    );
  }
  /**
   * Allows you to add operators for any pre-processing before a handler is called
   * @typedef {import('./types').Operator} Operator
   * @typedef {import('rxjs').Observable} Observable
   * @param  {...Operator} ops Operators
   * @returns {Observable<any>}
   */
  pipe(...ops) {
    return this.listeners.pipe(callOnce.apply(this), ...ops);
  }
  /**
   * Attaches a route handler
   * @typedef {import('../routerEvent/index').RouterEvent} RouterEvent
   * @param {(event: RouterEvent) => void} fn Route handler
   */
  subscribe(fn) {
    return this.pipe().subscribe(fn);
  }
  /**
   * Destroys current router instance
   * @param {() => void} callback Callback for destroy function
   */
  destroy(callback) {
    if (typeof callback === 'function') {
      callback();
    }
    this.popStateSubscription.unsubscribe(); // Unsubscribe popstate event
  }
}
