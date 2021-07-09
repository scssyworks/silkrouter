import { Observable } from 'rxjs';
import { QRY, UNDEF } from '../../utils/constants';
import { trim } from '../../utils/utils';
import RouterEvent from '../routerEvent';

export default function callOnce(isDone) {
  const { hashRouting: hash, location, init } = this.config;
  const path = trim(
    hash ? location.hash.substring(1).split(QRY)[0] : location.pathname
  );
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
