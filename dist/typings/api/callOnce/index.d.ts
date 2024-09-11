/**
 * Calls the handler once on initialization
 * @param {boolean} [isd] Optional flag used as a switch
 * @returns {(observable: Observable<any>) => Observable<any>}
 */
export default function callOnce(isd?: boolean): (observable: Observable<any>) => Observable<any>;
import { Observable } from 'rxjs';
