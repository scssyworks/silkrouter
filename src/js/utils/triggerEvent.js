import { TYPEOF_STR } from './constants';
import { getGlobal } from './getGlobal';
import { each } from './utils';

const g = getGlobal();

// Internal function
function isValidTarget(target) {
  return (
    target instanceof NodeList ||
    target instanceof HTMLCollection ||
    Array.isArray(target)
  );
}

/**
 * Function to trigger custom event
 * @param {Node|NodeList|HTMLCollection|Node[]} target Target element or list
 * @param {string} eventType Event type
 * @param {any[]} data Data to be passed to handler
 */
export function trigger(target, eventType, data) {
  if (target instanceof Node) {
    target = [target];
  }
  if (isValidTarget(target) && typeof eventType === TYPEOF_STR) {
    each(target, (el) => {
      const customEvent = new g.CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: data || [],
      });
      el.dispatchEvent(customEvent);
    });
  }
}
