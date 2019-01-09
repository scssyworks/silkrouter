/**
 * Simple selector engine with event handling
 */

function isValidNode(el) {
    return (
        el instanceof Node
        || el === window
    );
}

function isCallable(handler) {
    return typeof handler === 'function';
}

function getClassList(classSet) {
    return classSet.split(' ').map(st => !!st.trim());
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
                        selector.map(isValidNode)
                        : selector instanceof select ? selector.map()
                            : null;
        if (selector) {
            selector.forEach(el => {
                this[this.length++] = el;
            });
        }
    }
    each(handler) {
        for (let i = 0; i < this.length; i++) {
            if (isCallable(handler)) {
                const result = handler.apply(this[i], [i, this[i], this]);
                if (result === true) {
                    continue;
                }
                if (result === false) {
                    break;
                }
            }
        }
        return this;
    }
    addClass(classNames) {
        if (typeof classNames === 'string') {
            let classList = getClassList(classNames);
            this.each(function () {
                let currentClassSet = this.getAttribute('class');
                if (typeof currentClassSet === 'string') {
                    let currentClassList = getClassList(currentClassSet);
                    classList.forEach(className => {
                        if (currentClassList.indexOf(className) === -1) {
                            currentClassList.push(className);
                        }
                    });
                    this.setAttribute('class', currentClassList.join(' '));
                } else {
                    this.setAttribute('class', classList.join(' '));
                }
            });
        }
        return this;
    }
    removeClass(classNames) {
        if (typeof classNames === 'string') {
            let classList = getClassList(classNames);
            let removedCounter = 0;
            this.each(function () {
                let currentClassSet = this.getAttribute('class');
                if (typeof currentClassSet === 'string') {
                    let currentClassList = getClassList(currentClassSet);
                    classList.forEach(className => {
                        let classIndex = currentClassList.indexOf(className);
                        if (classIndex > -1) {
                            currentClassList.splice(classIndex, 1);
                            removedCounter += 1;
                        }
                    });
                    if (removedCounter > 0) {
                        this.setAttribute('class', currentClassList.join(' '));
                    }
                }
            });
        }
        return this;
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
        return this;
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
        return this;
    }
    map() {
        let map = [];
        this.each(function () {
            if (map.indexOf(this) === -1) {
                map.push(this);
            }
        });
        return map;
    }
    add(selector) {
        const currentSelection = this.map();
        const newSelection = select(selector);
        const self = this;
        newSelection.each(function () {
            if (currentSelection.indexOf(this) === -1) {
                self[self.length++] = this;
            }
        });
        return this;
    }
    filter(filterArg) {
        let newSelection = select();
        if (isCallable(filterArg)) {
            this.each(function () {
                if (filterArg(this)) {
                    newSelection.add(this);
                }
            });
        } else {
            const matched = select(filterArg).map();
            this.each(function () {
                if (matched.indexOf(this) > -1) {
                    newSelection.add(this);
                }
            });
        }
        return newSelection;
    }
    find(selector) {
        const children = [];
        let newSelection = select();
        this.each(function () {
            const childrenEach = [...this.childNodes];
            childrenEach.forEach(child => {
                if (children.indexOf(child) === -1 && child.nodeType === 1) {
                    children.push(child);
                }
            });
        });
        const matched = select(selector).map();
        matched.forEach(el => {
            if (children.indexOf(el) > -1) {
                newSelection.add(el);
            }
        });
        return newSelection;
    }
    eq(index) {
        return select(this[index]);
    }
    first() {
        return this.eq(0);
    }
    last() {
        return this.eq(this.length - 1);
    }
    html(htmlText) {
        if (typeof htmlText === 'undefined') {
            return this[0].innerHTML;
        } else if (typeof htmlText === 'string') {
            this.each(function () {
                this.innerHTML = htmlText;
            });
        }
    }
    text(textData) {
        if (typeof textData === 'undefined') {
            return this[0].textContent;
        } else if (typeof textData === 'string') {
            this.each(function () {
                this.textContent = textData;
            });
        }
    }
    attr(prop, value) {
        if (
            typeof prop === 'string'
            && typeof value === 'undefined'
        ) {
            return this[0].getAttribute(prop);
        } else if (typeof prop === 'string') {
            this.each(function () {
                this.setAttribute(prop, value);
            });
        } else if (
            prop !== null
            && typeof prop === 'object'
        ) {
            this.each(function () {
                Object.keys(props).forEach(key => {
                    this.setAttribute(key, prop[key]);
                });
            });
        } else if (typeof prop === 'undefined') {
            const attrs = {};
            [...this[0].attributes].forEach(attr => {
                attrs[attr.name] = attrs.value;
            });
            return attrs;
        }
    }
    data(prop, value) {

        if (
            typeof prop === 'string'
            && typeof value === 'undefined'
        ) {

        }
    }
}

function select(selector) {
    return new Init(selector);
}

select.fn = Init.prototype;

export { select };