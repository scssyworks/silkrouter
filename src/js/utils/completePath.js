import { deparam } from './deparam';
import { assign } from './assign';

export function getCompletePath(path = '', mergeQuery = true) {
    let finalPath = path;
    if (path.charAt(0) === '#') {
        finalPath = `${location.pathname}/${path}`;
    }
    const indexOfQueryStart = path.indexOf('?');
    if (mergeQuery && (indexOfQueryStart < path.indexOf('#'))) {
        const search = assign(deparam(location.search), deparam(path.substring(indexOfQueryStart)));
        return (finalPath.substring(0, indexOfQueryStart) + `?${search}`);
    }
    return finalPath;
}