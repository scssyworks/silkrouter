import type { SrHistory } from 'silkrouter';
import { createEmitter } from './event';
import { getWindow } from './win';

export function getHistory(): SrHistory {
  const win = getWindow();
  if (!win) {
    throw new Error('History is not available in non-browser environments.');
  }
  return {
    history: win.history,
    historyTarget: createEmitter(win),
  };
}
