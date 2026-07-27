/**
 * Ejecuta un bucle de animación solo mientras su elemento está en pantalla.
 *
 * Los tres bucles pesados del sitio (el shader del contacto, el canvas del
 * toolbox y el marquee de métricas) corrían de forma permanente aunque su
 * sección estuviera a miles de píxeles de distancia. En escritorio pasa
 * desapercibido; en un móvil los tres a la vez tiran los fotogramas al suelo.
 *
 * Además se para cuando la pestaña pasa a segundo plano, que es donde más se
 * nota en batería.
 *
 * @param {Element} el        Elemento cuya visibilidad decide si se anima.
 * @param {Function} frame    Se llama en cada fotograma mientras esté visible.
 * @param {object} [opts]
 * @param {number} [opts.margin]  Margen de anticipación, en px.
 * @returns {Function} Detiene el bucle y suelta los observadores.
 */
export function rafWhenVisible(el, frame, { margin = 200 } = {}) {
  let rafId = null;
  let visible = false;

  function tick() {
    frame();
    rafId = requestAnimationFrame(tick);
  }

  function arrancar() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  function parar() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function evaluar() {
    if (visible && !document.hidden) arrancar();
    else parar();
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    evaluar();
  }, { rootMargin: `${margin}px` });

  io.observe(el);
  document.addEventListener('visibilitychange', evaluar);

  return () => {
    parar();
    io.disconnect();
    document.removeEventListener('visibilitychange', evaluar);
  };
}
