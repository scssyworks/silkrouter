import type { HistoryStack, IMemoryHistory } from '../types';
import { createEmitter } from './event';
import { getWindow } from './win';

export class MemoryHistory implements IMemoryHistory {
  #historyStack: HistoryStack[] = [];

  #historyIdx = -1;

  #target: EventTarget & { location: Location };

  #win: Window;

  constructor() {
    const win = getWindow();
    if (!win) {
      throw new Error(
        'Memory history is not available in non-browser environments.',
      );
    }
    this.#win = win;
    this.#historyStack.push({ url: win.location.href });
    this.#historyIdx = 0;
    this.#target = new EventTarget() as EventTarget & { location: Location };
    // Using URL as subtitute of location to avoid changing browser url
    this.#target.location = new URL(win.location.href) as unknown as Location;
  }

  get state() {
    return this.#historyStack[this.#historyIdx].state;
  }

  get length() {
    return this.#historyStack.length;
  }

  get target() {
    return this.#target;
  }

  pushState<S = unknown>(state: S, _title: string | null, url: string) {
    this.#historyStack[this.#historyIdx + 1] = {
      url: new URL(url, this.#win.location.href).href,
      state,
    };
    this.#historyIdx = this.#historyStack.length - 1;
    this.target.location.href = this.#historyStack[this.#historyIdx].url;
  }

  replaceState<S = unknown>(
    state: S,
    _title: string | null,
    url: string,
  ): void {
    this.#historyStack[this.#historyIdx] = {
      url: new URL(url, this.#win.location.href).href,
      state,
    };
    this.target.location.href = this.#historyStack[this.#historyIdx].url;
  }

  back() {
    this.#historyIdx = Math.max(this.#historyIdx - 1, 0);
    this.target.location.href = this.#historyStack[this.#historyIdx].url;
    this.target.dispatchEvent(
      new PopStateEvent('popstate', {
        state: this.#historyStack[this.#historyIdx].state,
      }),
    );
  }

  forward() {
    this.#historyIdx = Math.min(
      this.#historyIdx + 1,
      this.#historyStack.length,
    );
    this.target.location.href = this.#historyStack[this.#historyIdx].url;
    this.target.dispatchEvent(
      new PopStateEvent('popstate', {
        state: this.#historyStack[this.#historyIdx].state,
      }),
    );
  }

  go(delta: number) {
    this.#historyIdx = Math.min(
      this.#historyIdx + delta,
      this.#historyStack.length,
    );
    this.target.location.href = this.#historyStack[this.#historyIdx].url;
    this.target.dispatchEvent(
      new PopStateEvent('popstate', {
        state: this.#historyStack[this.#historyIdx].state,
      }),
    );
  }
}

export function getMemoryHistory() {
  const history = new MemoryHistory();
  return {
    history,
    historyTarget: createEmitter(history.target),
  };
}
