import { getMemoryHistory } from './memory';

describe('Memory History', () => {
  it('should define the history API', () => {
    const { history } = getMemoryHistory();
    expect(history).toBeDefined();
    expect(history.length).toBe(1);
    expect(history.pushState).toBeDefined();
    expect(history.replaceState).toBeDefined();
    expect(history.go).toBeDefined();
    expect(history.back).toBeDefined();
    expect(history.forward).toBeDefined();
  });

  it('should push new memory history', () => {
    const { history } = getMemoryHistory();
    history.pushState({}, '', '/test');
    expect(history.length).toBe(2);
    expect(history.target.location.href).toBe('http://localhost:3000/test');
    expect(window.location.href).toBe('http://localhost:3000/');
  });

  it('should replace existing history', () => {
    const { history } = getMemoryHistory();
    history.pushState({}, '', '/test');
    history.replaceState({}, '', '/test2');
    expect(history.length).toBe(2);
    expect(history.target.location.href).toBe('http://localhost:3000/test2');
    expect(window.location.href).toBe('http://localhost:3000/');
  });

  it('should allow going back and forward', () => {
    const { history } = getMemoryHistory();
    history.pushState({}, '', '/test');
    history.pushState({}, '', '/test2');
    history.back();
    expect(history.length).toBe(3);
    expect(history.target.location.href).toBe('http://localhost:3000/test');
    expect(window.location.href).toBe('http://localhost:3000/');
    history.forward();
    expect(history.length).toBe(3);
    expect(history.target.location.href).toBe('http://localhost:3000/test2');
    expect(window.location.href).toBe('http://localhost:3000/');
  });

  it('should allow going back or forward with delta', () => {
    const { history } = getMemoryHistory();
    history.pushState({}, '', '/test');
    history.pushState({}, '', '/test2');
    history.go(-1);
    expect(history.length).toBe(3);
    expect(history.target.location.href).toBe('http://localhost:3000/test');
    expect(window.location.href).toBe('http://localhost:3000/');
    history.go(1);
    expect(history.length).toBe(3);
    expect(history.target.location.href).toBe('http://localhost:3000/test2');
    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
