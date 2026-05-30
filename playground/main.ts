(function render(el: HTMLElement | null) {
  if (!el) return;
  el.textContent = 'Hello World';
})(document.getElementById('app'));
