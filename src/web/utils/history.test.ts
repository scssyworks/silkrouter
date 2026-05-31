import { Window } from 'happy-dom';
import { getRouter } from './history';
import type { IRouter } from '../types';
import { flush, flushMacro } from '../../test-utils';

const mockWindowFn = (path = '') => {
  const win = new Window({
    url: `http://localhost:3000${path}`,
  });
  return win;
};
const mockWindow = vi.fn();
vi.mock('./win', () => ({
  getWindow: vi.fn(() => mockWindow()),
}));

describe('Router environment', () => {
  afterEach(() => {
    mockWindow.mockClear();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('should instantiate in browser environment', () => {
    const w = mockWindowFn();
    mockWindow.mockReturnValue(w);
    const router = getRouter();
    expect(router.history).toBe(w.history);
  });

  it('should throw error in non-browser environment', () => {
    mockWindow.mockReturnValue(null);
    expect(() => getRouter()).toThrow(
      Error('History is not available in non-browser environments.'),
    );
  });
});

describe('Router', () => {
  const defaultRoute = {
    search: '',
    state: undefined,
    query: {},
    params: {},
    fragment: '',
  };

  let router: IRouter;
  let unsubscribe: () => void;
  beforeEach(() => {
    mockWindow.mockReturnValue(mockWindowFn());
  });
  afterEach(() => {
    mockWindow.mockClear();
    unsubscribe();
    router.unsubscribe();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Browser Router', () => {
    it('should call handler on subscribe', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
    });

    it('should NOT call handler if path is different', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.route('/test').subscribe(handler);
      await flush();
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call the handler if path is navigated', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.route('/test').subscribe(handler);
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/test',
      });
    });

    it('should call the handler if path is navigated with replace true', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.route('/test').subscribe(handler);
      router.navigate('/test', {
        replace: true,
      });
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/test',
      });
    });

    it('should always call global handler if path is navigated', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before next navigation
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
    });

    it('should abandon original handler call if navigation is initiated before the handler settles', async () => {
      const evtHandler = vi.fn();
      const handler = vi.fn();
      router = getRouter();
      const path = router.every();
      path.target.on('sr:done', evtHandler); // This should call synchronously for custom event
      unsubscribe = path.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      // Previous handler is still in progress and new navigation has initiated
      // This will cause sr:done event to be triggered once
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
      await flush(); // Flush previous handler to trigger the event
      expect(evtHandler).toHaveBeenCalledTimes(1);
    });

    it('should parse params, query and fragment strings correctly', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.route('/test/:id').subscribe(handler);
      router.navigate('/test/123?foo=bar#frag');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test/123?foo=bar#frag',
        pathname: '/test/123',
        route: '/test/:id',
        search: '?foo=bar',
        query: { foo: 'bar' },
        params: { id: '123' },
        fragment: '#frag',
      });
    });

    it('should pass state correctly', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.route('/test/:id').subscribe(handler);
      router.navigate('/test/123?foo=bar#frag', {
        state: 'hello world',
      });
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test/123?foo=bar#frag',
        pathname: '/test/123',
        route: '/test/:id',
        search: '?foo=bar',
        state: 'hello world',
        query: { foo: 'bar' },
        params: { id: '123' },
        fragment: '#frag',
      });
    });

    it('should support base path', async () => {
      const handler = vi.fn();
      router = getRouter({
        basePath: '/base',
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).not.toHaveBeenCalled();
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/',
      });
    });

    it('should support path handler with base path', async () => {
      const handler = vi.fn();
      router = getRouter({
        basePath: '/base',
      });
      unsubscribe = router.route('/test').subscribe(handler);
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/test',
      });
    });

    it('should support relative path handler with base path', async () => {
      const handler = vi.fn();
      router = getRouter({
        basePath: '/base/path',
      });
      unsubscribe = router.route('../test').subscribe(handler);
      router.navigate('../test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/test',
      });
    });

    it('should support back and forward navigation', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before next navigation
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
      await flush(); // Flushing previous async handler before next navigation
      handler.mockClear();
      router.back();
      await flushMacro();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before next navigation
      handler.mockClear();
      router.forward();
      await flushMacro();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
    });

    it('should handle double navigation', async () => {
      const handler = vi.fn();
      router = getRouter();
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before next navigation
      handler.mockClear();
      router.navigate('/test');
      router.navigate('/test2');
      await flush();
      expect(handler).toHaveBeenNthCalledWith(1, {
        ...defaultRoute,
        path: '/test2',
        pathname: '/test2',
        route: '/',
      });
    });

    it('should handle errors', async () => {
      const handler = vi.fn(async () => {
        throw new Error('something went wrong');
      });
      router = getRouter();
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before next navigation
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
    });

    it('should abandon original error handler if next navigation occurred before previous handler settled', async () => {
      const evtHandler = vi.fn();
      const handler = vi.fn(async () => {
        throw new Error('something went wrong');
      });
      router = getRouter();
      const path = router.every();
      path.target.on('sr:error', evtHandler);
      unsubscribe = path.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
      await flush();
      expect(evtHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hash Router', () => {
    it('should call handler on subscribe', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
    });

    it('should not call handler if path is different', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.route('/test').subscribe(handler);
      await flush();
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call the handler if path is navigated', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.route('/test').subscribe(handler);
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/test',
      });
    });

    it('should call the handler if path is navigated with replace true', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.route('/test').subscribe(handler);
      router.navigate('/test', {
        replace: true,
      });
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/test',
      });
    });

    it('should always call global handler if path is navigated', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before navigation
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
    });

    it('should abandon original handler call if navigation is initiated before the handler settles', async () => {
      const evtHandler = vi.fn();
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      const path = router.every();
      path.target.on('sr:done', evtHandler); // This should call synchronously for custom event
      unsubscribe = path.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      // Previous handler is still in progress and new navigation has initiated
      // This will cause sr:done event to be triggered once
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
      await flush(); // Flush previous handler to trigger the event
      expect(evtHandler).toHaveBeenCalledTimes(1);
    });

    it('should parse params, query and fragment strings correctly', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.route('/test/:id').subscribe(handler);
      router.navigate('/test/123?foo=bar#frag');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test/123?foo=bar#frag',
        pathname: '/test/123',
        route: '/test/:id',
        search: '?foo=bar',
        query: { foo: 'bar' },
        params: { id: '123' },
        fragment: '#frag',
      });
    });

    it('should pass state correctly', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.route('/test/:id').subscribe(handler);
      router.navigate('/test/123?foo=bar#frag', {
        state: 'hello world',
      });
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test/123?foo=bar#frag',
        pathname: '/test/123',
        route: '/test/:id',
        search: '?foo=bar',
        state: 'hello world',
        query: { foo: 'bar' },
        params: { id: '123' },
        fragment: '#frag',
      });
    });

    it('should support base path', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
        basePath: '/base',
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).not.toHaveBeenCalled();
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/',
      });
    });

    it('should support path handler with base path', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
        basePath: '/base',
      });
      unsubscribe = router.route('/test').subscribe(handler);
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/test',
      });
    });

    it('should preserve current path if enabled', async () => {
      mockWindow.mockReturnValue(mockWindowFn('/initial/path'));
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
        preservePath: true,
        basePath: '/base',
      });
      unsubscribe = router.route('/test').subscribe(handler);
      await flush();
      expect(handler).not.toHaveBeenCalled();
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/test',
      });
      expect(router.location.href).toBe(
        'http://localhost:3000/initial/path#/base/test',
      );
    });

    it('should support relative path handler with base path', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
        basePath: '/base/path',
      });
      unsubscribe = router.route('../test').subscribe(handler);
      router.navigate('../test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/base/test',
        pathname: '/base/test',
        route: '/base/test',
      });
    });

    it('should support back and forward navigation', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flush previous handler before next navigation
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
      await flush(); // Flush previous handler before next navigation
      handler.mockClear();
      router.back();
      await flushMacro();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flush previous handler before next navigation
      handler.mockClear();
      router.forward();
      await flushMacro();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
    });

    it('should handle double navigation', async () => {
      const handler = vi.fn();
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before navigation
      handler.mockClear();
      router.navigate('/test');
      router.navigate('/test2');
      await flush();
      expect(handler).toHaveBeenNthCalledWith(1, {
        ...defaultRoute,
        path: '/test2',
        pathname: '/test2',
        route: '/',
      });
    });

    it('should handler errors', async () => {
      const handler = vi.fn(async () => {
        throw new Error('something went wrong');
      });
      router = getRouter({
        hashRouter: true,
      });
      unsubscribe = router.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      await flush(); // Flushing previous async handler before navigation
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
    });

    it('should abandon original error handler if next navigation occurred before previous handler settled', async () => {
      const evtHandler = vi.fn();
      const handler = vi.fn(async () => {
        throw new Error('something went wrong');
      });
      router = getRouter({
        hashRouter: true,
      });
      const path = router.every();
      path.target.on('sr:error', evtHandler);
      unsubscribe = path.subscribe(handler);
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/',
        pathname: '/',
        route: '/',
      });
      handler.mockClear();
      router.navigate('/test');
      await flush();
      expect(handler).toHaveBeenCalledWith({
        ...defaultRoute,
        path: '/test',
        pathname: '/test',
        route: '/',
      });
      await flush();
      expect(evtHandler).toHaveBeenCalledTimes(1);
    });
  });
});
