/**
 * Attaches a rount handler
 * @returns {(observable: Observable<any>) => Observable<any>}
 */
export default function collate(): (observable: Observable<any>) => Observable<any>;
import { Observable } from 'rxjs';
