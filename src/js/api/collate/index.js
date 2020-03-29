import { Observable } from 'rxjs';
import RouterEvent from '../routerEvent';

export default function collate() {
    const currentRouterInstance = this;
    return (observable) => new Observable(subscriber => {
        const subn = observable.subscribe({
            next(event) {
                const [, , routerInstance] = event.detail;
                if (routerInstance === currentRouterInstance) {
                    subscriber.next(
                        new RouterEvent(event.detail, event)
                    );
                }
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