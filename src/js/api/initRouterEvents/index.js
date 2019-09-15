import triggerRoute from '../triggerRoute';
import { POP_STATE } from '../../utils/constants';
import { loc } from '../../utils/vars';

/**
 * Initializes router events
 * @private
 */
export default function initRouterEvents() {
    window.addEventListener(`${POP_STATE}`, function (e) {
        const completePath = `${loc.pathname}${loc.hash}`;
        const pathParts = completePath.split('#');
        const pathname = pathParts[0];
        const hashstring = pathParts[1];
        let originalData = {};
        if (e.state) {
            const { data } = e.state;
            if (data) {
                originalData = data;
            }
        }
        triggerRoute({
            originalEvent: e,
            route: pathname,
            type: e.type,
            hash: false,
            originalData
        });
        if (hashstring) {
            triggerRoute({
                originalEvent: e,
                route: `#${hashstring}`,
                type: HASH_CHANGE,
                hash: true,
                originalData
            });
        }
    });
}