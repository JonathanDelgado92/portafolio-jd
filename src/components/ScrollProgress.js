export function createScrollProgress() {
  const el = document.createElement('div');
  el.className = 'scroll-progress';
  el.setAttribute('aria-hidden', 'true');

  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';

  el.appendChild(bar);
  return el;
}
