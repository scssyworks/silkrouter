import { fromEvent } from 'rxjs';
import { POP_STATE, VIRTUAL_PUSHSTATE } from '../../utils/constants';
import { trigger } from '../../utils/triggerEvent';
import collate from '../collate';
import { getGlobal } from '../../utils/getGlobal';
import { getPath } from '../../utils/getPath';

export default function bindRouterEvents(inst) {
  const { context, location, hashRouting: hash } = inst.config;
  inst.popStateSubscription = fromEvent(getGlobal(), POP_STATE).subscribe(
    (e) => {
      const path = getPath(hash, location);
      if (path) {
        trigger(context, VIRTUAL_PUSHSTATE, [{ path, hash }, e, inst]);
      }
    }
  );
  inst.listeners = fromEvent(context, VIRTUAL_PUSHSTATE).pipe(
    collate.apply(inst)
  );
  if (hash && !location.hash) {
    inst.set('/', true, false); // Replace current hash path without executing anythings
  }
}
