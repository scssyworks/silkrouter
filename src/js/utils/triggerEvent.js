import { each } from './utils';

// Polyfill custom event
if (typeof window.CustomEvent === 'undefined') {
    const CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}

// Internal function
function isValidTarget(target) {
    return (
        target instanceof NodeList
        || target instanceof HTMLCollection
        || Array.isArray(target)
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
    if (isValidTarget(target) && typeof eventType === 'string') {
        each(target, el => {
            const customEvent = new window.CustomEvent(eventType, {
                bubbles: true,
                cancelable: true,
                detail: (data || [])
            });
            el.dispatchEvent(customEvent);
        });
    }
}