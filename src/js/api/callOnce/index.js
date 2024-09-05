import { Observable } from 'rxjs';
import { getPath } from '../../utils/getPath';
import { RouterEvent } from '../routerEvent';

/**
 * Calls the handler once on initialization
 * @param {boolean} [isd] Optional flag used as a switch
 * @returns {(observable: Observable<any>) => Observable<any>}
 */
export default function callOnce(isd) {
  let isDone = isd;
  const { hashRouting: hash, location, init } = this.config;
  const path = getPath(hash, location);
  return observable =>
    new Observable(subscriber => {
      const subn = observable.subscribe(subscriber);
      if (!isDone) {
        isDone = true;
        if (init && path) {
          subscriber.next(new RouterEvent([{ path, hash }, undefined, this]));
        }
      }
      return () => {
        subn.unsubscribe();
      };
    });
}
