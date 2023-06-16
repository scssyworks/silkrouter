import { Observable } from 'rxjs';
export type RouterConfig = {
    init?: boolean;
    hashRouting?: boolean;
    preservePath?: boolean;
};
export type RouterCoreConfig = {
    history: History;
    context: HTMLElement;
    location: Location;
    hash?: boolean;
};
export type Operator = (...args: any[]) => (observable: Observable<any>) => Observable<any>;
