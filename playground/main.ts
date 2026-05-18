import { sayHello } from 'silkrouter';

(function render(el: HTMLElement | null) {
  if (!el) return;
  el.textContent = sayHello();
})(document.getElementById('app'));
