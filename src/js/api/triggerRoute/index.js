import { ROUTE_CHANGED, HASH_CHANGE, POP_STATE } from '../../utils/constants';
import trigger from '../trigger';
import { assign } from '../../utils/assign';

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
    ob.originalEvent = assign(ob.originalEvent);
    ob.type = ob.hash ? HASH_CHANGE : POP_STATE;
    const originalData = assign(ob.originalData);
    delete ob.originalData;
    trigger(
        ROUTE_CHANGED,
        ob,
        originalData
    );
}