export function containsFn(arr, fn) {
    return !!arr.filter(m => m.fn === fn).length;
}