import { ROUTE_CHANGED } from '../../utils/constants';
import trigger from '../trigger';

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
export default function triggerRoute({ originalEvent, route, type, hash, originalData }) {
    trigger(
        ROUTE_CHANGED,
        {
            originalEvent,
            route,
            type,
            hash
        },
        originalData
    );
}