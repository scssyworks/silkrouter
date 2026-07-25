import { getWindow } from './win';

describe('Window Utils', () => {
  it('should return window when getWindow is called', () => {
    expect(getWindow()).toBe(window);
  });

  it('should return null when getWindow is called in a non-browser environment', () => {
    // Simulate Node environment by temporarily overriding global properties
    const originalWindow = globalThis.window;
    delete (globalThis as any).window;
    expect(getWindow()).toBeUndefined();
    // Restore original properties
    if (originalWindow) globalThis.window = originalWindow;
  });
});
