import { each, isValidRoute, trim } from '../src/js/utils/utils';

describe('Utils', () => {
  describe('trim', () => {
    it('should trim text', () => {
      expect(trim(' test ')).toBe('test');
    });
    it('should return empty string if input value is invalid', () => {
      expect(trim(null)).toBe('');
    });
  });

  describe('isValidRoute', () => {
    it('should return true of route is valid', () => {
      expect(isValidRoute('/test/path')).toBeTruthy();
    });
    it('should return false of route is INVALID', () => {
      expect(isValidRoute('test/path')).toBeFalsy();
    });
    it('should return false of route is UNDEFINED or NULL', () => {
      expect(isValidRoute()).toBeFalsy();
      expect(isValidRoute(null)).toBeFalsy();
    });
  });
});
