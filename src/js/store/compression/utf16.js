import compress from './compress';
import decompress from './decompress';
import { f } from './fromCharCode';

export function toUTF16(input) {
    if (input == null) {
        return '';
    }
    return compress(input, 15, (a) => f(a + 32)) + ' ';
}

export function fromUTF16(compressed) {
    if (compressed == null) {
        return '';
    }
    if (compressed === '') {
        return null;
    }
    return decompress(compressed.length, 16384, (index) => (compressed.charCodeAt(index) - 32));
}