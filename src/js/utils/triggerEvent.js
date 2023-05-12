import { TYPEOF_STR } from './constants';
import { each } from './utils';

/**
 * Function to trigger custom event
 * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
 * @param {string} eventType Event type
 * @param {any[]} data Data to be passed to handler
 */
export function trigger(target, eventType, data) {
  target = Array.from(target instanceof Node ? [target] : target);
  if (target.length && typeof eventType === TYPEOF_STR) {
    each(target, (el) => {
      const customEvent = new CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: data || [],
      });
      el.dispatchEvent(customEvent);
    });
  }
}
