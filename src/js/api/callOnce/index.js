import { Observable } from 'rxjs';
import { trim } from '../../utils/utils';
import RouterEvent from '../routerEvent';

export default function callOnce(isDone) {
    const { hashRouting, location } = this.config;
    const path = trim(hashRouting ? location.hash.substring(1).split('?')[0] : location.pathname);
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next() {
                subscriber.next(...arguments);
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        if (!isDone) {
            isDone = true;
            if (path) {
                subscriber.next(
                    new RouterEvent([{ path, hash: hashRouting }, undefined, this])
                );
            }
        }
        return () => {
            subn.unsubscribe();
        }
    });
}