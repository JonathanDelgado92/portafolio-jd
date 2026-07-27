/**
 * Detecta deslizamientos horizontales sobre un elemento.
 *
 * Se usa con eventos de puntero, no de tacto, para que funcione igual con
 * dedo, ratón o lápiz. Ignora los gestos claramente verticales: en un modal
 * con scroll, quedarse el gesto entero impediría desplazar el contenido.
 *
 * @param {Element} el
 * @param {(dir: -1|1) => void} onSwipe  -1 = derecha (anterior), 1 = izquierda (siguiente)
 * @param {object} [opts]
 * @param {number} [opts.umbral]  Recorrido mínimo en px.
 * @returns {Function} Suelta los listeners.
 */
export function onSwipeX(el, onSwipe, { umbral = 50 } = {}) {
  let x0 = 0;
  let y0 = 0;
  let activo = false;

  function inicio(e) {
    /* Solo gestos táctiles o de lápiz: con ratón el arrastre horizontal
       suele ser selección de texto, no navegación. */
    if (e.pointerType === 'mouse') return;
    activo = true;
    x0 = e.clientX;
    y0 = e.clientY;
  }

  function fin(e) {
    if (!activo) return;
    activo = false;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    /* Si el desplazamiento vertical manda, era un scroll: no se toca. */
    if (Math.abs(dx) < umbral || Math.abs(dx) <= Math.abs(dy)) return;
    onSwipe(dx < 0 ? 1 : -1);
  }

  function cancelar() {
    activo = false;
  }

  el.addEventListener('pointerdown', inicio);
  el.addEventListener('pointerup', fin);
  el.addEventListener('pointercancel', cancelar);

  return () => {
    el.removeEventListener('pointerdown', inicio);
    el.removeEventListener('pointerup', fin);
    el.removeEventListener('pointercancel', cancelar);
  };
}
