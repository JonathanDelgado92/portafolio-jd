export function initCoverflow({ onCardClick } = {}) {
  const wrap = document.querySelector('.coverflow-wrap');
  const stage = wrap?.querySelector('.coverflow-stage');
  const slides = stage?.querySelectorAll('.coverflow-slide');
  if (!wrap || !stage || !slides?.length) return;

  const section = wrap.closest('.selected-work');
  const dots = [...(section?.querySelectorAll('.coverflow-dot') || [])];
  const prevBtn = wrap.querySelector('.coverflow-nav--prev');
  const nextBtn = wrap.querySelector('.coverflow-nav--next');

  const n = slides.length;
  let active = 0;
  let lock = false;

  const SCALE_STEP = 0.16;
  const MAX_VISIBLE = 2;
  const TILT = 12;
  const SIDE_TILT = 8;
  const OPACITY = 60;

  /* La tarjeta ahora tiene tamaño fluido (--coverflow-card), así que la
     separación y la profundidad se derivan de su ancho real en vez de ser
     píxeles fijos: si no, al encoger la tarjeta las vecinas se solapaban. */
  const GAP_RATIO = 0.52;
  const DEPTH_RATIO = 0.52;

  function cardSize() {
    return stage.getBoundingClientRect().width || 460;
  }
  const DURATION = 0.6;
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const DRAG_THRESHOLD = 80;

  const dim = 1 - OPACITY / 100;
  const transitionCss = `transform ${DURATION}s ${EASE}, opacity ${DURATION}s ${EASE}`;

  function update() {
    const size = cardSize();
    slides.forEach((slide, i) => {
      let rel = i - active;
      if (rel > n / 2) rel -= n;
      if (rel < -n / 2) rel += n;

      const ax = Math.abs(rel);
      const isActive = rel === 0;
      const visible = ax <= MAX_VISIBLE;
      const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
      const tx = rel * size * GAP_RATIO;
      const tz = -ax * size * DEPTH_RATIO;
      const ry = -rel * TILT;
      const rz = rel * SIDE_TILT;

      slide.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
      slide.style.transition = transitionCss;
      slide.style.opacity = visible ? 1 : 0;
      slide.style.pointerEvents = visible ? 'auto' : 'none';

      /* Las tarjetas invisibles salen del orden de tabulación y del árbol
         de accesibilidad; si no, se tabula por tarjetas que no se ven. */
      slide.tabIndex = visible ? 0 : -1;
      slide.setAttribute('aria-hidden', visible ? 'false' : 'true');

      const overlay = slide.querySelector('.coverflow-dim');
      if (overlay) {
        overlay.style.opacity = isActive ? 0 : dim;
        overlay.style.transition = `opacity ${DURATION}s ${EASE}`;
      }
    });

    dots.forEach((dot, i) => {
      const on = i === active;
      dot.classList.toggle('active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function goTo(index) {
    if (lock) return;
    if (index === active) {
      if (onCardClick) onCardClick(active);
      return;
    }
    lock = true;
    setTimeout(() => { lock = false; }, DURATION * 1000 + 50);
    active = ((index % n) + n) % n;
    update();
  }

  /* Avanza/retrocede una posición respetando el bloqueo de la transición. */
  function step(dir) {
    if (lock) return;
    lock = true;
    setTimeout(() => { lock = false; }, DURATION * 1000 + 50);
    active = ((active + dir) % n + n) % n;
    update();
  }

  update();

  /* Las posiciones dependen del ancho real de la tarjeta, que es fluido:
     hay que recalcularlas cuando cambia el viewport. */
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 150);
  });

  /* ─── controles: flechas, dots y teclado ─── */

  prevBtn?.addEventListener('click', () => step(-1));
  nextBtn?.addEventListener('click', () => step(1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (lock || i === active) return;
      lock = true;
      setTimeout(() => { lock = false; }, DURATION * 1000 + 50);
      active = i;
      update();
    });
  });

  /* Las flechas solo actúan cuando el foco está dentro del carrusel,
     para no secuestrar la navegación por teclado del resto de la página. */
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  });

  /* ─── drag / swipe navigation ─── */

  let isDown = false;
  let startX = 0;
  let moved = false;

  function onPointerDown(e) {
    /* Un clic en las flechas no debe iniciar un arrastre. */
    if (e.button !== 0 || e.target.closest('.coverflow-nav')) return;
    isDown = true;
    moved = false;
    startX = e.clientX;
  }

  function onPointerMove(e) {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) moved = true;
    if (Math.abs(dx) >= DRAG_THRESHOLD) {
      const dir = dx > 0 ? -1 : 1;
      const next = ((active + dir) % n + n) % n;
      lock = true;
      active = next;
      update();
      setTimeout(() => { lock = false; }, DURATION * 1000 + 50);
      startX = e.clientX;
    }
  }

  function onPointerUp() {
    isDown = false;
  }

  wrap.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  /* bound click handler: skip if user was dragging */
  function onClickSlide(i) {
    return function (e) {
      if (moved) {
        moved = false;
        return;
      }
      goTo(i);
    };
  }

  slides.forEach((slide, i) => {
    slide.addEventListener('click', onClickSlide(i));
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(i);
      }
    });
  });

  return {
    destroy() {
      wrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      slides.forEach((slide) => {
        slide.replaceWith(slide.cloneNode(true));
      });
    },
    goTo,
    getActive: () => active,
  };
}