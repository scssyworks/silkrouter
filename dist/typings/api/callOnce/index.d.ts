/**
 * Calls the handler once on initialization
 * @param {boolean} [isDone] Optional flag used as a switch
 * @returns {(observable: Observable<any>) => Observable<any>}
 */
export default function callOnce(isDone?: boolean): (observable: Observable<any>) => Observable<any>;
import { Observable } from 'rxjs';
