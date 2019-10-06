import { ROUTE_CHANGED, HASH_CHANGE, POP_STATE } from '../../utils/constants';
import trigger from '../trigger';
import { setDefault, getPopStateEvent } from '../../utils/utils';

/**
 * Triggers "route.changed" event
 * @private
 * @param {object} config Route event configuration
 * @param {object} config.originalEvent Original "popstate" event object
 * @param {string} config.route route string
 * @param {string} config.type Type of event
 * @param {boolean} config.hash Flag that determines type of event expected
 * @param {object} config.originalData Original data persisted by history API
 */
export default function triggerRoute(ob) {
    ob.type = ob.hash ? HASH_CHANGE : POP_STATE;
    const originalData = setDefault(ob.originalData, {});
    ob.originalEvent = setDefault(ob.originalEvent, getPopStateEvent(ob.type, originalData));
    delete ob.originalData;
    trigger(
        ROUTE_CHANGED,
        ob,
        originalData
    );
}