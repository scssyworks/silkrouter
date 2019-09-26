import { deparam } from '../src/js/utils/deparam';
import { toQueryString } from '../src/js/utils/query';

describe('Deparam module', () => {
    test('Deparam should convert simple query string to object', () => {
        expect(deparam('param1=hello&param2=world')).toEqual({
            param1: 'hello',
            param2: 'world'
        });
    });

    test('Deparam should convert simple query string to object if query string starts with "?"', () => {
        expect(deparam('?param1=hello&param2=world')).toEqual({
            param1: 'hello',
            param2: 'world'
        });
    });

    test('Deparam should return empty object if query string is empty', () => {
        expect(deparam('')).toEqual({});
    });

    test('Deparam should coerce values if coercion is enabled', () => {
        expect(deparam('param1=10&param2=false', true)).toEqual({
            param1: 10,
            param2: false
        });
    });

    test('Deparam should disable coercion of values if second parameter is passed as false', () => {
        expect(deparam('param1=10&param2=false')).toEqual({
            param1: '10',
            param2: 'false'
        });
    });

    test('Deparam should convert complex query string to object', () => {
        expect(deparam('param1=10&param1=20&param2=helloworld', true)).toEqual({
            param1: [10, 20],
            param2: 'helloworld'
        });
    });

    test('Deparam should convert really complex query string to object', () => {
        expect(deparam('a=10&b=20&c[]=30&d[0]=40&e[f]=60&e[g][]=70&k[i]=hello&k[i][][j]=world', true)).toEqual({
            a: 10,
            b: 20,
            c: [30],
            d: [40],
            e: {
                f: 60,
                g: [70]
            },
            k: {
                i: [
                    [
                        'hello',
                        {
                            j: 'world'
                        }
                    ]
                ]
            }
        });
    });

    test('Deparam should support old array parsing formats', () => {
        expect(deparam('a=10&a=20', true)).toEqual({
            a: [10, 20]
        });
    });

    test('Deparam should convert the stringified query string back to same object', () => {
        expect(deparam(toQueryString({ p1: 'test', p2: ['Array test'], p3: { cp1: 'object test' } }))).toEqual({ p1: 'test', p2: ['Array test'], p3: { cp1: 'object test' } });
    });

    test('Deparam should coerce boolean, undefined, null and NaN values properly', () => {
        expect(deparam('a=null&b=undefined&c=false&d=NaN&e=true', true)).toEqual({
            a: null,
            b: undefined,
            c: false,
            d: NaN,
            e: true
        });
    });
});