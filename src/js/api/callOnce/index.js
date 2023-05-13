import { Observable } from 'rxjs';
import { UNDEF } from '../../constants';
import { getPath } from '../../utils/getPath';
import RouterEvent from '../routerEvent';

/**
 * Calls the handler once on initialization
 * @param {boolean} [isDone] Optional flag used as a switch
 * @returns {(observable: Observable<any>) => Observable<any>}
 */
export default function callOnce(isDone) {
  const { hashRouting: hash, location, init } = this.config;
  const path = getPath(hash, location);
  return (observable) =>
    new Observable((subscriber) => {
      const subn = observable.subscribe(subscriber);
      if (!isDone) {
        isDone = true;
        if (init && path) {
          subscriber.next(new RouterEvent([{ path, hash }, UNDEF, this]));
        }
      }
      return () => {
        subn.unsubscribe();
      };
    });
}
