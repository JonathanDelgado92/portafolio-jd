export function initRoundCarousel(opts = {}) {
  const ring = document.getElementById('roundCarouselRing');
  const wrap = document.querySelector('.round-carousel-wrap');
  if (!ring || !wrap) return;

  const cards = [...ring.querySelectorAll('.round-card')];
  const count = cards.length;
  if (!count) return;

  const {
    imageWidth = 420,
    spacing = 3,
    speed = 7,
    direction = 'right',
    dragEnabled = true,
    sensitivity = 5,
  } = opts;

  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = speed * 6 * (direction === 'left' ? -1 : 1);

  let rotY = 0;
  let velocity = 0;
  let lastTime = 0;
  let rafId = null;
  const drag = { active: false, x: 0 };

  function applyTransform() {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${rotY}deg)`;
  }

  applyTransform();

  function tick(now) {
    const dt = lastTime ? (now - lastTime) / 1000 : 0;
    lastTime = now;
    const f = Math.min(dt, 0.1);

    if (!drag.active) {
      if (Math.abs(velocity) > 0.01) {
        rotY += velocity * f;
        velocity *= 0.94;
      } else {
        rotY += degPerSec * f;
      }
    }
    applyTransform();
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  function onPointerDown(e) {
    if (!dragEnabled) return;
    if (e.button !== undefined && e.button !== 0) return;
    drag.active = true;
    drag.x = e.clientX;
    velocity = 0;
  }

  function onPointerMove(e) {
    if (!drag.active) return;
    const dx = e.clientX - drag.x;
    drag.x = e.clientX;
    const k = 0.3 * sensitivity;
    rotY += dx * k;
    velocity = dx * k * 60;
  }

  function onPointerUp() {
    drag.active = false;
  }

  wrap.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  return () => {
    cancelAnimationFrame(rafId);
    wrap.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  };
}