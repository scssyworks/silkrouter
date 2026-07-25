import type { EventHandler, IEmitter, ISrEvent, SrHandler } from '../types';
import { getWindow } from './win';

class SrEvent<E extends Event = Event, D = unknown> implements ISrEvent<E, D> {
  data?: D;
  originalEvent: E;
  constructor(originalEvent: E) {
    this.originalEvent = originalEvent;
    if (originalEvent instanceof CustomEvent) {
      this.data = originalEvent.detail as D;
    }
    if (originalEvent instanceof PopStateEvent) {
      this.data = originalEvent.state as D;
    }
  }
}

export class Emitter implements IEmitter {
  #target: EventTarget;
  #listeners = new Map<SrHandler, EventHandler>();
  constructor(target?: EventTarget) {
    const win = getWindow();
    if (!win) {
      throw new Error('Emitter is not available in non-browser environments.');
    }
    this.#target = target || new EventTarget();
  }

  get target() {
    return this.#target;
  }

  emit<S>(name: string, detail?: S) {
    this.#target.dispatchEvent(
      new CustomEvent(name, {
        detail,
      }),
    );
  }

  on<E extends Event = Event, S = unknown>(
    name: string,
    handler: SrHandler<E, S>,
  ) {
    const listener: EventHandler<E> = async (event) => {
      await handler(new SrEvent(event));
    };
    this.#listeners.set(handler as SrHandler, listener as EventHandler);
    this.#target.addEventListener(name, listener as EventHandler);
    return () => {
      this.off(name, handler);
    };
  }

  off<E extends Event = Event, S = unknown>(
    name: string,
    handler: SrHandler<E, S>,
  ) {
    const listener = this.#listeners.get(handler as SrHandler);
    if (listener) {
      this.#target.removeEventListener(name, listener);
      this.#listeners.delete(handler as SrHandler);
    }
  }

  close() {
    this.#listeners.clear();
    this.#target = new EventTarget();
  }
}

export const createEmitter = (target?: EventTarget) => new Emitter(target);
