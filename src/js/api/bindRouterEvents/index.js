import { fromEvent } from 'rxjs';
import { POP_STATE, VIRTUAL_PUSHSTATE } from '../../utils/constants';
import { trigger } from '../../utils/triggerEvent';
import collate from '../collate';
import { trim } from '../../utils/utils';

export default function bindRouterEvents() {
    const { context, location, hashRouting } = this.config;
    this.popStateSubscription = fromEvent(window, POP_STATE).subscribe(e => {
        const path = trim(
            hashRouting
                ? location.hash.substring(1).split('?')[0]
                : location.pathname
        );
        if (path) {
            trigger(context, VIRTUAL_PUSHSTATE, [{ path, hash: hashRouting }, e, this]);
        }
    });
    this.listeners = fromEvent(context, VIRTUAL_PUSHSTATE)
        .pipe(collate.apply(this));
    if (hashRouting && !location.hash) {
        this.set('/', true, false); // Replace current hash path without executing anythings
    }
}