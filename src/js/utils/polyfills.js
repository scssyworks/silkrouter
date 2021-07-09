import { TYPEOF_UNDEF, UNDEF } from './constants';
import { getGlobal } from './getGlobal';
import { each, isArr } from './utils';

// Polyfill custom event
const g = getGlobal();
if (typeof g.CustomEvent === TYPEOF_UNDEF) {
  const CustomEvent = function (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: UNDEF };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  };

  CustomEvent.prototype = g.Event.prototype;
  g.CustomEvent = CustomEvent;
}

// Polyfill Array.from

if (!Array.from) {
  Array.from = function (arrayLike) {
    if (isArr(arrayLike)) {
      return arrayLike;
    }
    const arr = [];
    each(arrayLike, (value) => {
      arr.push(value);
    });
    return arr;
  };
}
