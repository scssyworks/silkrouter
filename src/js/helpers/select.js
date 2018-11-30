/**
 * Simple selector engine with event handling
 */

function isValidNode(el) {
    return (
        el instanceof Node
        || window
    );
}

function isCallable(handler) {
    return typeof handler === 'function';
}

class Init {
    constructor(selector) {
        this.length = 0;
        selector = isValidNode(selector) ?
            [selector]
            : (
                selector instanceof NodeList
                || selector instanceof HTMLCollection
            ) ?
                [...selector]
                : (typeof selector === 'string') ?
                    [...document.querySelectorAll(selector)]
                    : (Array.isArray(selector)) ?
                        selector.map(isValidNode) : null;
        if (selector) {
            selector.forEach(el => {
                this[this.length++] = el;
            });
        }
    }
    each(handler) {
        for (let i = 0; i < this.length; i++) {
            if (isCallable(handler)) {
                const result = handler(i, this[i], this);
                if (result === true) {
                    continue;
                }
                if (result === false) {
                    break;
                }
            }
        }
    }
    on(eventName, handler, useCapture) {
        this.each((i, el) => {
            el.addEventListener(eventName, function ({ detail }) {
                let customData = detail && detail.customData ? [...detail.customData] : [];
                if (isCallable(handler)) {
                    handler.apply(this, [event, ...customData]);
                }
            }, useCapture);
        });
    }
    trigger(eventName, params) {
        const customEvent = new CustomEvent(eventName, {
            cancelable: true,
            bubbles: true,
            detail: {
                customData: params
            }
        });
        this.each((i, el) => {
            el.dispatchEvent(customEvent);
        });
    }
}

export function select(selector) {
    return new Init(selector);
}