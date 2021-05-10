import {
  isArr,
  trim,
  isNumber,
  isObject,
  isValidRoute,
} from '../src/js/utils/utils';

describe('Utils module', () => {
  test('Function isArr should test if a passed argument is an array', () => {
    expect(isArr([])).toBeTruthy();
  });
  test('Function isArr should test if a passed argument is an array if an invalid argument is passed', () => {
    expect(isArr('')).toBeFalsy();
  });
  test('Function trim should trim empty spaces from start and end of string', () => {
    expect(trim('  hello   ')).toBe('hello');
  });
  test('Function trim should resolve to empty string if an invalid value is passed', () => {
    expect(trim({})).toBe('');
  });
  test('Function isObject should test if given argument is a valid object', () => {
    expect(isObject({})).toBeTruthy();
  });
  test('Function isObject should validate to false if given argument is not a valid object', () => {
    expect(isObject('Hello World')).toBeFalsy();
  });
  test('Function isValidRoute should return true if given route is valid', () => {
    expect(isValidRoute('/path/to/route')).toBeTruthy();
  });
  test('Function isValidRoute should return false if given route is invalid', () => {
    expect(isValidRoute('path/to/route')).toBeFalsy();
  });
});
