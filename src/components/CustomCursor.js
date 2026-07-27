export function createCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';

  const text = document.createElement('div');
  text.className = 'cursor-text';

  cursor.appendChild(dot);
  cursor.appendChild(ring);
  cursor.appendChild(text);

  return cursor;
}
