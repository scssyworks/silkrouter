import { createEmitter } from './event';

const mockWindow = vi.fn();
vi.mock('./win', () => ({
  getWindow: () => mockWindow(),
}));

describe('Event Emitter', () => {
  afterEach(() => {
    mockWindow.mockClear();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('should emit and listen to events', () => {
    mockWindow.mockReturnValue(window);
    const emitter = createEmitter();
    const handler = vi.fn();
    const off = emitter.on('test-event', handler);
    emitter.emit('test-event', { message: 'Hello, World!' });
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { message: 'Hello, World!' },
        originalEvent: expect.any(CustomEvent),
      }),
    );
    off();
  });

  it('should allow unsubscribing from events', () => {
    mockWindow.mockReturnValue(window);
    const emitter = createEmitter();
    const handler = vi.fn();
    const off = emitter.on('test-event', handler);
    off();
    emitter.emit('test-event', { message: 'Hello, World!' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('should allow unsubscribing directly from emitter object', () => {
    mockWindow.mockReturnValue(window);
    const emitter = createEmitter();
    const handler = vi.fn();
    emitter.on('test-event', handler);
    emitter.off('test-event', handler);
    emitter.emit('test-event', { message: 'Hello, World!' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('should NOT unsubscribe from events if handler is not provided', () => {
    mockWindow.mockReturnValue(window);
    const emitter = createEmitter();
    const handler = vi.fn();
    emitter.on('test-event', handler);
    emitter.off('test-event', undefined as any);
    emitter.emit('test-event', { message: 'Hello, World!' });
    expect(handler).toHaveBeenCalled();
  });

  it('should emit and listen to DOM events', () => {
    mockWindow.mockReturnValue(window);
    const div = document.createElement('div');
    const emitter = createEmitter(div);
    const handler = vi.fn();
    const off = emitter.on('click', handler);
    div.click();
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: undefined,
        originalEvent: expect.any(MouseEvent),
      }),
    );
    off();
  });

  it('should handle popstate events with state data', () => {
    mockWindow.mockReturnValue(window);
    const emitter = createEmitter(window);
    const handler = vi.fn();
    const off = emitter.on('popstate', handler);
    const stateData = { page: 'home' };
    window.dispatchEvent(new PopStateEvent('popstate', { state: stateData }));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: stateData,
        originalEvent: expect.any(PopStateEvent),
      }),
    );
    off();
  });

  it('should throw an error when Emitter is instantiated in a non-browser environment', () => {
    mockWindow.mockReturnValue(undefined);
    expect(() => createEmitter()).toThrow(
      Error('Emitter is not available in non-browser environments.'),
    );
  });

  it('should unsubscribe all events when emitter is closed', () => {
    mockWindow.mockReturnValue(window);
    const emitter = createEmitter();
    const handler = vi.fn();
    emitter.on('test-event', handler);
    emitter.close();
    emitter.emit('test-event', { message: 'Hello, World!' });
    expect(handler).not.toHaveBeenCalled();
  });
});
