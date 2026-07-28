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
  let idPuntero = null;

  function inicio(e) {
    /* Solo gestos táctiles o de lápiz: con ratón el arrastre horizontal
       suele ser selección de texto, no navegación. */
    if (e.pointerType === 'mouse') return;
    idPuntero = e.pointerId;
    x0 = e.clientX;
    y0 = e.clientY;
  }

  function fin(e) {
    if (idPuntero === null || e.pointerId !== idPuntero) return;
    idPuntero = null;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    /* Si el desplazamiento vertical manda, era un scroll: no se toca. */
    if (Math.abs(dx) < umbral || Math.abs(dx) <= Math.abs(dy)) return;
    onSwipe(dx < 0 ? 1 : -1);
  }

  function cancelar(e) {
    if (e.pointerId === idPuntero) idPuntero = null;
  }

  /* El gesto empieza en el elemento pero termina en window a propósito:
     escuchando el pointerup solo en el elemento, levantar el dedo fuera de
     él —lo normal al deslizar hacia el borde de la pantalla— perdía el
     gesto. No se usa setPointerCapture porque redirige el pointerup y sitúa
     el click en el ancestro común, así que los botones de cerrar, anterior
     y siguiente dejarían de responder. */
  el.addEventListener('pointerdown', inicio);
  window.addEventListener('pointerup', fin);
  window.addEventListener('pointercancel', cancelar);

  return () => {
    el.removeEventListener('pointerdown', inicio);
    window.removeEventListener('pointerup', fin);
    window.removeEventListener('pointercancel', cancelar);
  };
}
