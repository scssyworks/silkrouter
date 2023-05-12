import { resolveParams } from '../src/js/utils/params';

describe('Params module', function () {
  test('Function extractParams should extracts parameters from URL', () => {
    expect(resolveParams('/test/:part1/:part2', '/test/value1/value2')).toEqual(
      {
        part1: 'value1',
        part2: 'value2',
      }
    );
  });
  test('Function extractParams should return empty object if there are no matching parameters', () => {
    expect(resolveParams('/test/:part1/:part2', '/test/value1')).toEqual({});
  });
  test('Function extractParams should return empty object if there are no parameters at all', () => {
    expect(resolveParams('/test/part1', '/test/value1')).toEqual({});
  });
  test('Function extractParams should pick default pathname if second argument is undefined', () => {
    expect(resolveParams('/test/part1')).toEqual({});
  });
});
