import gsap from 'gsap';

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e, rect) {
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function getMouseDistance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
  constructor(el) {
    this.DOM = { el, inner: el.querySelector('.expertise-trail__img-inner') };
    this.rect = el.getBoundingClientRect();
    this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };

    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.rect = this.DOM.el.getBoundingClientRect();
    };
    window.addEventListener('resize', this.resize);
  }
}

export function initExpertiseTrail() {
  const wrappers = document.querySelectorAll('.expertise-trail');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  wrappers.forEach((wrapper) => {
    const container = wrapper.parentElement;
    if (!container) return;

    const images = [...wrapper.querySelectorAll('.expertise-trail__img')];
    if (!images.length) return;

    const items = images.map((img) => new ImageItem(img));
    const total = items.length;
    let imgPosition = 0;
    let zIndexVal = 1;
    let activeCount = 0;
    let isIdle = true;
    let threshold = 80;

    let mousePos = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };
    let cacheMousePos = { x: 0, y: 0 };
    let rafId = null;

    function onPointerMove(e) {
      const rect = wrapper.parentElement.getBoundingClientRect();
      mousePos = getLocalPointerPos(e, rect);
    }

    function onPointerLeave() {
      items.forEach((item) => {
        gsap.killTweensOf(item.DOM.el);
        gsap.to(item.DOM.el, {
          duration: 0.3,
          ease: 'power2',
          opacity: 0,
          scale: 0.2,
        });
      });
      activeCount = 0;
      isIdle = true;
      zIndexVal = 1;
    }

    /* Interpolación velocidad -> efecto (variante 6 de ImageTrail): cuanto más
       despacio se mueve el cursor, más pequeña, oscura, desaturada y borrosa
       aparece la imagen; al moverse rápido se revela nítida y a tamaño. */
    const mapSpeed = (speed, min, max, maxSpeed) =>
      min + (max - min) * Math.min(speed / maxSpeed, 1);

    function showNextImage() {
      const dx = mousePos.x - cacheMousePos.x;
      const dy = mousePos.y - cacheMousePos.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      zIndexVal++;
      imgPosition = imgPosition < total - 1 ? imgPosition + 1 : 0;
      const img = items[imgPosition];

      const scaleFactor = mapSpeed(speed, 0.3, 2, 200);
      /* El original arranca en brillo 0 (negro puro). Se sube el mínimo a 0.3
         para que la imagen siempre se intuya sobre el fondo claro del panel. */
      const brightness = mapSpeed(speed, 0.3, 1.15, 70);
      const blurValue = mapSpeed(speed, 20, 0, 90);
      const grayscale = mapSpeed(speed, 600, 0, 90);

      gsap.killTweensOf(img.DOM.el);

      const tl = gsap.timeline({
        onStart: () => {
          activeCount++;
          isIdle = false;
        },
        onComplete: () => {
          activeCount--;
          if (activeCount === 0) isIdle = true;
        },
      });

      tl.fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: zIndexVal,
          x: cacheMousePos.x - img.rect.width / 2,
          y: cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.8,
          ease: 'power3',
          scale: scaleFactor,
          filter: `grayscale(${grayscale}%) brightness(${brightness * 100}%) blur(${blurValue}px)`,
          x: mousePos.x - img.rect.width / 2,
          y: mousePos.y - img.rect.height / 2,
        },
        0
      )
        .fromTo(
          img.DOM.inner,
          { scale: 2 },
          { duration: 0.8, ease: 'power3', scale: 1 },
          0
        )
        .to(img.DOM.el, {
          duration: 0.4,
          ease: 'power3.in',
          opacity: 0,
          scale: 0.2,
        }, 0.45);
    }

    function render() {
      const distance = getMouseDistance(mousePos, lastMousePos);

      /* La variante 6 sigue al cursor más pegada (0.3) que la 4 (0.1): de esa
         diferencia sale la lectura de velocidad que alimenta los filtros. */
      cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.3);
      cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.3);

      if (distance > threshold) {
        showNextImage();
        lastMousePos = { ...mousePos };
      }

      if (isIdle && zIndexVal !== 1) zIndexVal = 1;

      rafId = requestAnimationFrame(render);
    }

    function initRender(e) {
      const rect = wrapper.parentElement.getBoundingClientRect();
      mousePos = getLocalPointerPos(e, rect);
      cacheMousePos = { ...mousePos };

      rafId = requestAnimationFrame(render);

      container.removeEventListener('pointerenter', initRender);
    }

    container.addEventListener('pointerenter', initRender);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
  });
}
