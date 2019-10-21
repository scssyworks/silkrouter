import { hasOwn } from '../../utils/utils';

function _update(context, bitsPerChar, getCharFromInt) {
    if (context.context_data_position == bitsPerChar - 1) {
        context.context_data_position = 0;
        context.context_data.push(getCharFromInt(context.context_data_val));
        context.context_data_val = 0;
    } else {
        context.context_data_position++;
    }
}

function _updateContextNumBits(context) {
    context.context_enlargeIn--;
    if (context.context_enlargeIn == 0) {
        context.context_enlargeIn = 2 ** context.context_numBits;
        context.context_numBits++;
    }
}

function _updateContext(context, bitsPerChar, getCharFromInt) {
    if (hasOwn(context.context_dictionaryToCreate, context.context_w)) {
        if (context.context_w.charCodeAt(0) < 256) {
            for (let i = 0; i < context.context_numBits; i++) {
                context.context_data_val = (context.context_data_val << 1);
                _update(context, bitsPerChar, getCharFromInt);
            }
            context.value = context.context_w.charCodeAt(0);
            for (let i = 0; i < 8; i++) {
                context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
                _update(context, bitsPerChar, getCharFromInt);
                context.value = context.value >> 1;
            }
        } else {
            context.value = 1;
            for (let i = 0; i < context.context_numBits; i++) {
                context.context_data_val = (context.context_data_val << 1) | context.value;
                _update(context, bitsPerChar, getCharFromInt);
                context.value = 0;
            }
            context.value = context.context_w.charCodeAt(0);
            for (let i = 0; i < 16; i++) {
                context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
                _update(context, bitsPerChar, getCharFromInt);
                context.value = context.value >> 1;
            }
        }
        _updateContextNumBits(context);
        delete context.context_dictionaryToCreate[context.context_w];
    } else {
        context.value = context.context_dictionary[context.context_w];
        for (let i = 0; i < context.context_numBits; i++) {
            context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
            _update(context, bitsPerChar, getCharFromInt);
            context.value = context.value >> 1;
        }
    }
    _updateContextNumBits(context);
}

function compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) {
        return '';
    }
    const context = {
        context_dictionary: {},
        context_dictionaryToCreate: {},
        context_data: [],
        context_c: "",
        context_wc: "",
        context_w: "",
        context_enlargeIn: 2,
        context_dictSize: 3,
        context_numBits: 2,
        context_data_val: 0,
        context_data_position: 0
    };
    let i = 0;
    for (let ii = 0; ii < uncompressed.length; ii += 1) {
        context.context_c = uncompressed.charAt(ii);
        if (!hasOwn(context.context_dictionary, context.context_c)) {
            context.context_dictionary[context.context_c] = context.context_dictSize++;
            context.context_dictionaryToCreate[context.context_c] = true;
        }
        context.context_wc = context.context_w + context.context_c;
        if (hasOwn(context.context_dictionary, context.context_wc)) {
            context.context_w = context.context_wc;
        } else {
            _updateContext(context, bitsPerChar, getCharFromInt);
            context.context_dictionary[context.context_wc] = context.context_dictSize++;
            context.context_w = String(context.context_c);
        }
    }
    if (context.context_w !== "") {
        _updateContext(context, bitsPerChar, getCharFromInt);
    }
    context.value = 2;
    for (i = 0; i < context.context_numBits; i++) {
        context.context_data_val = (context.context_data_val << 1) | (context.value & 1);
        _update(context, bitsPerChar, getCharFromInt);
        context.value = context.value >> 1;
    }
    // Flush the last char
    while (true) {
        context.context_data_val = (context.context_data_val << 1);
        if (context.context_data_position == bitsPerChar - 1) {
            context.context_data.push(getCharFromInt(context.context_data_val));
            break;
        }
        else context.context_data_position++;
    }
    return context.context_data.join('');
}

export default compress;