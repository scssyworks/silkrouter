import { f } from '../../utils/vars';

function _commonRep3(data, maxpower, resetValue, getNextValue) {
    let bits = 0;
    let power = 1;
    while (power !== maxpower) {
        const resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
    }
    return bits;
}

function decompress(length, resetValue, getNextValue) {
    const dictionary = [];
    const data = {
        val: getNextValue(0),
        position: resetValue,
        index: 1
    };
    const result = [];
    let enlargeIn = 4;
    let dictSize = 4;
    let numBits = 3;
    let entry = '';
    let w;
    let c;
    for (let i = 0; i < 3; i++) {
        dictionary[i] = i;
    }
    switch (_commonRep3(data, Math.pow(2, 2), resetValue, getNextValue)) {
        case 0:
            c = f(_commonRep3(data, Math.pow(2, 8), resetValue, getNextValue));
            break;
        case 1:
            c = f(_commonRep3(data, Math.pow(2, 16), resetValue, getNextValue));
            break;
        case 2:
            return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    // eslint-disable-next-line
    while (true) {
        if (data.index > length) {
            return '';
        }
        switch (c = _commonRep3(data, Math.pow(2, numBits), resetValue, getNextValue)) {
            case 0:
                dictionary[dictSize++] = f(_commonRep3(data, Math.pow(2, 8), resetValue, getNextValue));
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 1:
                dictionary[dictSize++] = f(_commonRep3(data, Math.pow(2, 16), resetValue, getNextValue));
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 2:
                return result.join('');
        }
        if (enlargeIn === 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
        if (dictionary[c]) {
            entry = dictionary[c];
        } else {
            if (c === dictSize) {
                entry = w + w.charAt(0);
            } else {
                return null;
            }
        }
        result.push(entry);
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn === 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
    }
}

export default decompress;