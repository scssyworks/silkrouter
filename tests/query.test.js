import { toQueryString } from '../src/js/utils/query';

describe('Query module', () => {
    test('Should convert simple object into valid query string', () => {
        expect(decodeURIComponent(toQueryString({ p1: 'Prop 1', p2: 'Prop 2' }))).toBe('p1=Prop 1&p2=Prop 2');
    });
    test('Should convert complex object into valid query string', () => {
        expect(decodeURIComponent(toQueryString({ p1: 1, p2: [2, 3], p3: { cp1: 1, cp2: 2 } }))).toBe('p1=1&p2[]=2&p2[]=3&p3[cp1]=1&p3[cp2]=2');
    });
    test('Should return the string as it is if the argument is string', () => {
        expect(toQueryString('Hello World')).toBe('Hello World');
    });
    test('Should return empty string if the argument is undefined', () => {
        expect(toQueryString()).toBe('');
    });
});