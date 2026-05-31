import { PathUtils } from './path';

describe('Path Utils', () => {
  it('should resolve base path correctly', () => {
    const base = PathUtils.getBasePath('/base/path');
    expect(base.pathname).toBe('/base/path');
  });

  it('should resolve base path relative to existing path', () => {
    // Change existing browser path
    const originalLocation = window.location as any;
    delete (window as any).location;
    (window as any).location = new URL('http://example.com/existing/base/path');

    const base = PathUtils.getBasePath('base/path');
    expect(base.pathname).toBe('/existing/base/base/path');

    const base2 = PathUtils.getBasePath('/base/path');
    expect(base2.pathname).toBe('/base/path');

    const base3 = PathUtils.getBasePath('../base/path');
    expect(base3.pathname).toBe('/existing/base/path');

    // Restore original location
    (window as any).location = originalLocation;
  });

  it('should resolve base path relative to existing path with trailing slash', () => {
    // Change existing browser path
    const originalLocation = window.location as any;
    delete (window as any).location;
    (window as any).location = new URL(
      'http://example.com/existing/base/path/',
    );

    const base = PathUtils.getBasePath('base/path');
    expect(base.pathname).toBe('/existing/base/path/base/path');

    const base2 = PathUtils.getBasePath('/base/path');
    expect(base2.pathname).toBe('/base/path');

    const base3 = PathUtils.getBasePath('../base/path');
    expect(base3.pathname).toBe('/existing/base/base/path');

    // Restore original location
    (window as any).location = originalLocation;
  });

  it('should resolve base path and relative path correctly', () => {
    const joined = PathUtils.relative('/base/path', 'relative/path');
    expect(joined.pathname).toBe('/base/relative/path');

    const joined2 = PathUtils.relative('/base/path/', 'relative/path');
    expect(joined2.pathname).toBe('/base/path/relative/path');

    const joined3 = PathUtils.relative('/base/path/', '/relative/path');
    expect(joined3.pathname).toBe('/relative/path');

    const joined4 = PathUtils.relative('/base/path', '../relative/path');
    expect(joined4.pathname).toBe('/relative/path');

    const joined5 = PathUtils.relative('/base/path/', '../relative/path');
    expect(joined5.pathname).toBe('/base/relative/path');
  });

  it('should join base path and provided path correctly', () => {
    const joined = PathUtils.join('/base/path', 'relative/path');
    expect(joined.pathname).toBe('/base/relative/path');

    const joined2 = PathUtils.join('/base/path/', 'relative/path');
    expect(joined2.pathname).toBe('/base/path/relative/path');

    const joined3 = PathUtils.join('/base/path/', '/relative/path');
    expect(joined3.pathname).toBe('/base/path/relative/path');

    const joined4 = PathUtils.join('/base/path', '../relative/path');
    expect(joined4.pathname).toBe('/relative/path');

    const joined5 = PathUtils.join('/base/path/', '../relative/path');
    expect(joined5.pathname).toBe('/base/relative/path');
  });

  it('should hashify URL correctly', () => {
    const url = new URL('http://localhost:3000/base/path?query=1#frag');
    const hashified = PathUtils.hashify(url, false, window.location);
    expect(hashified.href).toBe(
      'http://localhost:3000/#/base/path?query=1#frag',
    );
    window.location.href = '/existing/path';
    const hashifiedPreserve = PathUtils.hashify(url, true, window.location);
    expect(hashifiedPreserve.href).toBe(
      'http://localhost:3000/existing/path#/base/path?query=1#frag',
    );
  });

  it('should unhashify URL correctly', () => {
    const url = new URL('http://localhost:3000/base/path?query=1');
    const hashified = PathUtils.hashify(url, false, window.location);
    const unhashified = PathUtils.unhashify(hashified);
    expect(unhashified.href).toBe('http://localhost:3000/base/path?query=1');

    const hashifiedPreserve = new URL(
      'http://localhost:3000/existing/path?query=1#/base/test/path?q=123',
    );
    const unhashifiedPreserve = PathUtils.unhashify(hashifiedPreserve);
    expect(unhashifiedPreserve.href).toBe(
      'http://localhost:3000/base/test/path?q=123',
    );
  });

  it('should add trailing slash to path if missing', () => {
    const trailed = PathUtils.trailSlash('/path/with/slash/');
    expect(trailed).toBe('/path/with/slash/');

    const trailed2 = PathUtils.trailSlash('/path/without/slash');
    expect(trailed2).toBe('/path/without/slash/');
  });

  it('should strip leading slashes from path', () => {
    const stripped = PathUtils.stripLeadingSlashes('/path/with/leading/slash');
    expect(stripped).toBe('path/with/leading/slash');

    const stripped2 = PathUtils.stripLeadingSlashes(
      'path/without/leading/slash',
    );
    expect(stripped2).toBe('path/without/leading/slash');

    const stripped3 = PathUtils.stripLeadingSlashes(
      '////////path/with/leading/slash/',
    );
    expect(stripped3).toBe('path/with/leading/slash/');
  });

  it('should match routes correctly', () => {
    const match = PathUtils.match(
      new URL('/base/path', 'http://example.com'),
      new URL('/base/path', 'http://example.com'),
    );
    expect(match.match).toBe(true);
  });

  it('should match routes correctly with trailing slash', () => {
    const match = PathUtils.match(
      new URL('/base/path', 'http://example.com'),
      new URL('/base/path/', 'http://example.com'),
    );
    expect(match.match).toBe(true);
  });

  it('should match routes with route params correctly', () => {
    const match = PathUtils.match(
      new URL('/:base/:path', 'http://example.com'),
      new URL('/10/20', 'http://example.com'),
    );
    expect(match.match).toBe(true);
    expect(match.params).toEqual({ base: '10', path: '20' });
  });

  it('should match exact routes correctly', () => {
    const match = PathUtils.match(
      new URL('/base/path', 'http://example.com'),
      new URL('/base/path', 'http://example.com'),
      true,
    );
    expect(match.match).toBe(true);
  });

  it('should match exact routes correctly with trailing slash', () => {
    const match = PathUtils.match(
      new URL('/base/path', 'http://example.com'),
      new URL('/base/path/', 'http://example.com'),
      true,
    );
    expect(match.match).toBe(true);
  });

  it('should NOT match exact routes if they are not exact', () => {
    const match = PathUtils.match(
      new URL('/base/path', 'http://example.com'),
      new URL('/base/path/extended', 'http://example.com'),
      true,
    );
    expect(match.match).toBe(false);
  });

  it('should NOT match routes if origins are different', () => {
    const match = PathUtils.match(
      new URL('/base/path', 'http://example.com'),
      new URL('/base/path', 'http://example2.com'),
      true,
    );
    expect(match.match).toBe(false);
  });

  it('should NOT match routes if paths are different', () => {
    const match = PathUtils.match(
      new URL('/:base/:path/test', 'http://example.com'),
      new URL('/10/20/best', 'http://example.com'),
      true,
    );
    expect(match.match).toBe(false);
    expect(match.params).toEqual({});
  });
});
