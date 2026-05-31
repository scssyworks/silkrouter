import xss, { whiteList } from 'xss';
export function render(html: string) {
  document.querySelector('main')!.innerHTML = xss(html, {
    allowList: {
      ...whiteList,
      button: ['type', 'class', 'id'],
    },
  });
}
