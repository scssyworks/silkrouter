export function flush() {
  return Promise.resolve();
}

export function flushMacro() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
