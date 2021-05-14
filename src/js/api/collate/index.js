import { Observable } from 'rxjs';
import RouterEvent from '../routerEvent';

export default function collate() {
  return (observable) =>
    new Observable((subscriber) => {
      const subn = observable.subscribe({
        next: (event) => {
          const routerInstance = event.detail[2];
          if (routerInstance === this) {
            subscriber.next(new RouterEvent(event.detail, event));
          }
        },
        error: subscriber.error,
        complete: subscriber.complete,
      });
      return () => {
        subn.unsubscribe();
      };
    });
}
