export function isValidPath(path = '', hash) {
    let valid = true;
    if (hash && !(path.charAt(0) === '#')) {
        valid = false;
    } else {
        path.substring(1);
    }
    return valid && path.charAt(0) === '/';
}