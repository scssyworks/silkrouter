import { Observable } from 'rxjs';
import RouterEvent from '../routerEvent';

export default function collate(routerInstance) {
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                subscriber.next(
                    new RouterEvent(event.detail, routerInstance, event)
                );
            },
            error() {
                subscriber.error(...arguments);
            },
            complete() {
                subscriber.complete();
            }
        });
        return () => {
            subn.unsubscribe();
        }
    });
}