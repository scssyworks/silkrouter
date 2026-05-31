import { getHistory } from './browser';
import { Emitter } from './event';

const mockWindow = vi.fn();
vi.mock('./win', () => ({
  getWindow: () => mockWindow(),
}));

describe('Browser History', () => {
  afterEach(() => {
    mockWindow.mockClear();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('should throw an error when getHistory is called in a non-browser environment', () => {
    mockWindow.mockReturnValue(undefined);
    expect(() => getHistory()).toThrow(
      Error('History is not available in non-browser environments.'),
    );
  });

  it('should return window.history when getHistory is called in a browser environment', () => {
    mockWindow.mockReturnValue(window);
    expect(getHistory().history).toBe(window.history);
    expect(getHistory().historyTarget).toBeInstanceOf(Emitter);
  });
});
