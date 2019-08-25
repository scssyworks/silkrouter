import { assign } from '../src/js/utils/assign';

describe('Assign module', () => {
    test('should assign properties to empty object', () => {
        const emptyObject = {};
        assign(emptyObject, { prop1: 'Hello World' });
        expect(emptyObject).toEqual({ prop1: 'Hello World' });
    });
    test('should combine properties to first object and second object', () => {
        const firstObject = { prop1: 'Prop 1' };
        assign(firstObject, { prop2: 'Prop 2' });
        expect(firstObject).toEqual({ prop1: 'Prop 1', prop2: 'Prop 2' });
    });
    test('should return the resultant object after assign', () => {
        const firstObject = { prop1: 'Prop 1' };
        const result = assign(firstObject, { prop2: 'Prop 2' });
        expect(result).toEqual({ prop1: 'Prop 1', prop2: 'Prop 2' });
    });
    test('should replace the property value with value of second object if there is a collision between properties', () => {
        const firstObject = { prop1: 'Prop 1' };
        const result = assign(firstObject, { prop1: 'New Prop 1', prop2: 'Prop 2' });
        expect(result).toEqual({ prop1: 'New Prop 1', prop2: 'Prop 2' });
    });
    test('should allow multiple assignments', () => {
        const firstObject = { prop1: 'Prop 1' };
        const result = assign(firstObject, { prop1: 'New Prop 1' }, { prop2: 'Prop 2' });
        expect(result).toEqual({ prop1: 'New Prop 1', prop2: 'Prop 2' });
    });
    test('should resolve to valid object if first argument is undefined', () => {
        const firstObject = undefined;
        const result = assign(firstObject, { prop1: 'New Prop 1' }, { prop2: 'Prop 2' });
        expect(result).toEqual({ prop1: 'New Prop 1', prop2: 'Prop 2' });
    });
    test('should resolve to valid object if any of the other values are undefined', () => {
        const firstObject = undefined;
        const result = assign(firstObject, { prop1: 'New Prop 1' }, undefined);
        expect(result).toEqual({ prop1: 'New Prop 1' });
    });
    test('should return an empty object is no arguments are passed', () => {
        expect(assign()).toEqual({});
    });
});