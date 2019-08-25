import { deparam } from '../src/js/utils/deparam';
import { toQueryString } from '../src/js/utils/query';

describe('Deparam module', () => {
    test('Deparam should convert simple query string to object', () => {
        expect(deparam('param1=hello&param2=world')).toEqual({
            param1: 'hello',
            param2: 'world'
        });
    });

    test('Deparam should coerce values if coercion is enabled', () => {
        expect(deparam('param1=10&param2=false')).toEqual({
            param1: 10,
            param2: false
        });
    });

    test('Deparam should disable coercion of values if second parameter is passed as false', () => {
        expect(deparam('param1=10&param2=false', false)).toEqual({
            param1: '10',
            param2: 'false'
        });
    });

    test('Deparam should convert complex query string to object', () => {
        expect(deparam('param1=10&param1=20&param2=helloworld')).toEqual({
            param1: [10, 20],
            param2: 'helloworld'
        });
    });

    test('Deparam should convert the stringified query string back to same object', () => {
        expect(deparam(toQueryString({ p1: 'test', p2: ['Array test'], p3: { cp1: 'object test' } }))).toEqual({ p1: 'test', p2: ['Array test'], p3: { cp1: 'object test' } });
    });
});