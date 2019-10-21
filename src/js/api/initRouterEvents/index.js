import triggerRoute from '../triggerRoute';
import { POP_STATE } from '../../utils/constants';
import { loc } from '../../utils/vars';
import { assign } from '../../utils/assign';

/**
 * Initializes router events
 * @private
 */
export default function initRouterEvents() {
    window.addEventListener(`${POP_STATE}`, function (e) {
        const paths = (`${loc.pathname}${loc.hash}`).split('#');
        const defaultConfig = {
            originalEvent: e,
            originalData: assign(e.state && e.state.data)
        };
        triggerRoute(assign({}, defaultConfig, {
            route: paths[0],
            hash: false
        }));
        if (paths[1]) {
            triggerRoute(assign({}, defaultConfig, {
                route: `#${paths[1]}`,
                hash: true
            }));
        }
    });
}