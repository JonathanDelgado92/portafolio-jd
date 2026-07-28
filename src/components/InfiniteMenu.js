import { toolsData } from '../data/tools.js';
import { rafWhenVisible } from '../utils/rafWhenVisible.js';
import { shouldAnimate } from '../utils/reducedMotion.js';

export function initToolboxMenu(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const canvas = document.getElementById('infinite-menu-canvas');
  if (!canvas) return;

  /* Muestra la cuadrícula estática de herramientas y oculta el canvas. */
  function usarRespaldo() {
    const fb = document.querySelector('.toolbox-fallback');
    if (fb) fb.style.display = 'block';
    container.style.display = 'none';
  }

  if (!shouldAnimate()) {
    usarRespaldo();
    return;
  }

  const ctx = canvas.getContext('2d');
  /* Antes era un `return` a secas: si el canvas no estaba disponible, la
     sección quedaba vacía y no se veía ni una sola herramienta. */
  if (!ctx) {
    usarRespaldo();
    return;
  }

  const hintEl = document.getElementById('toolbox-hint');
  const dotsContainer = document.getElementById('toolbox-dots');
  const infoEls = {
    number: document.getElementById('toolbox-info-number'),
    category: document.getElementById('toolbox-info-category'),
    title: document.getElementById('toolbox-info-title'),
    desc: document.getElementById('toolbox-info-desc'),
  };

  let activeIndex = Math.floor(toolsData.length / 2);
  let images = [];
  let imagesLoaded = 0;
  let ready = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const w = rect.width || container.clientWidth || 600;
    const h = rect.height || container.clientHeight || 500;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas._w = w;
    canvas._h = h;
    /* Se guarda para que el bucle escale el contexto: el lienzo tiene w*dpr
       píxeles pero se dibuja en coordenadas CSS. */
    canvas._dpr = dpr;
    ready = true;
  }

  resize();
  window.addEventListener('resize', resize);

  // Load images
  for (let i = 0; i < toolsData.length; i++) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imagesLoaded++; };
    img.onerror = () => { imagesLoaded++; };
    img.src = toolsData[i].image;
    images.push(img);
  }

  function drawIcon(c, img, x, y, size) {
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const s = Math.min(size / img.naturalWidth, size / img.naturalHeight) * 0.65;
      const iw = img.naturalWidth * s;
      const ih = img.naturalHeight * s;
      c.drawImage(img, x - iw / 2, y - ih / 2, iw, ih);
    } else {
      c.fillStyle = '#888';
      c.font = `bold ${size * 0.4}px sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('?', x, y);
    }
  }

  function updateInfo(idx) {
    const tool = toolsData[idx];
    if (!tool) return;
    if (infoEls.number) infoEls.number.textContent = tool.number;
    if (infoEls.category) infoEls.category.textContent = tool.category;
    if (infoEls.title) infoEls.title.textContent = tool.title;
    if (infoEls.desc) infoEls.desc.textContent = tool.description;
  }

  // --- Navigation dots ---
  let dots = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < toolsData.length; i++) {
      const dot = document.createElement('button');
      dot.className = 'toolbox-dot';
      dot.setAttribute('aria-label', toolsData[i].title);
      dot.dataset.index = i;
      dot.addEventListener('click', () => irA(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function updateDots(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  // --- Interaction ---
  const TAU = Math.PI * 2;
  const PASO = TAU / toolsData.length;

  let angleOffset = 0;
  let targetAngleOffset = -activeIndex * PASO;
  let velocity = 0;
  let isDragging = false;
  let anguloPrevio = 0;
  let recorrido = 0;
  let movido = false;
  let inactivoDesde = performance.now();

  /* Geometría del último fotograma, para poder saber qué icono se ha pulsado. */
  let geo = { cx: 0, cy: 0, orbitR: 0, dotR: 0 };

  /**
   * Lleva el círculo hasta el elemento `i` por el camino más corto.
   *
   * El offset se acumula sin límite al arrastrar, así que fijar el ángulo
   * absoluto del elemento hacía desandar todas las vueltas dadas. Aquí se
   * busca la vuelta equivalente más cercana a la posición actual: el giro
   * nunca retrocede más de media vuelta y puede recorrer los 360° completos.
   */
  function irA(i) {
    const base = -i * PASO;
    const diff = base - targetAngleOffset;
    targetAngleOffset += diff - TAU * Math.round(diff / TAU);
    inactivoDesde = performance.now();
    if (hintEl) hintEl.classList.add('hidden');
  }

  /**
   * Ángulo del puntero respecto al centro del orbe.
   *
   * El giro se calcula con este ángulo y no con el desplazamiento horizontal.
   * Midiendo solo la X, arrastrar hacia abajo no hacía nada y, según por qué
   * lado del círculo se agarrase, el giro salía al revés de lo que empujaba
   * el dedo. Con el ángulo, el icono que se agarra se queda pegado al dedo:
   * sube cuando se sube y baja cuando se baja, en cualquier punto del borde.
   */
  function anguloPuntero(e) {
    const rect = canvas.getBoundingClientRect();
    return Math.atan2(e.clientY - rect.top - geo.cy, e.clientX - rect.left - geo.cx);
  }

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    movido = false;
    recorrido = 0;
    anguloPrevio = anguloPuntero(e);
    velocity = 0;
    /* Sin captura, el navegador deja de enviar eventos en cuanto el dedo sale
       del canvas y el giro se corta a medias. */
    try { canvas.setPointerCapture(e.pointerId); } catch { /* no crítico */ }
    if (hintEl) hintEl.classList.add('hidden');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const actual = anguloPuntero(e);
    /* Normalizado a (-π, π]: si no, cruzar el punto de corte de atan2 daría
       un salto de una vuelta entera en un solo fotograma. */
    let delta = actual - anguloPrevio;
    delta -= TAU * Math.round(delta / TAU);
    /* Cerca del centro el ángulo se dispara: unos pocos píxeles barren media
       vuelta. Se limita el giro por fotograma para que arrastrar sobre el
       icono central siga respondiendo sin salir despedido. */
    const TOPE = 0.35;
    delta = Math.max(-TOPE, Math.min(TOPE, delta));

    recorrido += Math.abs(delta);
    /* Umbral en radianes: el clic solo se descarta si el dedo ha girado de
       verdad, no por el temblor de un toque. */
    if (recorrido > 0.04) movido = true;

    targetAngleOffset += delta;
    velocity = delta;
    anguloPrevio = actual;
    inactivoDesde = performance.now();
  });

  function soltar() {
    isDragging = false;
  }

  window.addEventListener('pointerup', soltar);
  /* Un gesto cancelado por el navegador dejaba isDragging en true para
     siempre y el círculo quedaba bloqueado. */
  window.addEventListener('pointercancel', soltar);

  /* Pulsar directamente sobre un icono del orbe lo trae al frente. */
  canvas.addEventListener('click', (e) => {
    if (movido) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    let mejor = -1;
    let mejorDist = Infinity;
    for (let i = 0; i < toolsData.length; i++) {
      const a = i * PASO + angleOffset;
      const x = geo.cx + Math.cos(a) * geo.orbitR;
      const y = geo.cy + Math.sin(a) * geo.orbitR;
      const d = Math.hypot(px - x, py - y);
      /* Radio de acierto generoso: los iconos del fondo se dibujan pequeños
         y con el dedo cuesta acertarlos. */
      if (d < geo.dotR * 1.6 && d < mejorDist) {
        mejorDist = d;
        mejor = i;
      }
    }
    if (mejor >= 0) irA(mejor);
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetAngleOffset += e.deltaY * 0.003;
    inactivoDesde = performance.now();
  }, { passive: false });

  // --- Render loop ---
  function loop() {

    if (!ready) return;
    const w = canvas._w;
    const h = canvas._h;
    if (w === 0 || h === 0) return;

    /* Escala por densidad de pantalla. Con la identidad, el dibujo ocupaba
       solo el cuadrante superior izquierdo del lienzo (que tiene w*dpr px)
       y el orbe se veía pequeño y descentrado dentro de su máscara. */
    const dpr = canvas._dpr || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Deceleration
    if (!isDragging) {
      velocity *= 0.94;
      /* La deriva automática solo entra tras unos segundos sin tocar nada.
         Antes era constante y empujaba siempre en el mismo sentido, así que
         al arrastrar hacia atrás el círculo se resistía y volvía: parecía que
         solo se pudiera girar en una dirección. */
      if (performance.now() - inactivoDesde > 2500) {
        targetAngleOffset += 0.0015;
      }
    }
    angleOffset += (targetAngleOffset - angleOffset) * 0.08;

    const cx = w / 2;
    const cy = h / 2;
    const count = toolsData.length;
    const orbitR = Math.min(w, h) * 0.38;
    const dotR = Math.max(20, Math.min(w, h) * 0.042);

    /* El manejador de clic necesita esta geometría para saber sobre qué icono
       se ha pulsado; se guarda en cada fotograma porque depende del tamaño. */
    geo = { cx, cy, orbitR, dotR };

    // Find active (closest to front)
    let bestIdx = 0;
    let bestCos = -Infinity;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angleOffset;
      const cosA = Math.cos(a);
      if (cosA > bestCos) {
        bestCos = cosA;
        bestIdx = i;
      }
    }

    // Center glow
    /* El reloj sale de performance.now() y no del parámetro del rAF: el bucle
       ya no se auto-encadena, lo gobierna rafWhenVisible. */
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.003);
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbitR * 0.5);
    glowGrad.addColorStop(0, `rgba(234, 90, 39, ${0.08 + 0.04 * pulse})`);
    glowGrad.addColorStop(1, 'rgba(234, 90, 39, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // Orbital ring
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw orbit items
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angleOffset;
      const x = cx + Math.cos(a) * orbitR;
      const y = cy + Math.sin(a) * orbitR;

      const cosA = Math.cos(a);
      const isActive = i === bestIdx;
      const scale = 0.6 + 0.6 * Math.max(0, cosA);
      const alpha = 0.25 + 0.75 * Math.max(0, cosA);
      const r = dotR * scale;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Glow ring for active
      if (isActive) {
        const grd = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2);
        grd.addColorStop(0, 'rgba(234, 90, 39, 0.2)');
        grd.addColorStop(1, 'rgba(234, 90, 39, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Background disc
      const bgGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      if (isActive) {
        ctx.shadowColor = 'rgba(234, 90, 39, 0.6)';
        ctx.shadowBlur = 16;
        bgGrd.addColorStop(0, 'rgba(50, 50, 58, 0.95)');
        bgGrd.addColorStop(0.8, 'rgba(35, 35, 42, 0.95)');
        bgGrd.addColorStop(1, 'rgba(25, 25, 30, 0.9)');
      } else {
        bgGrd.addColorStop(0, 'rgba(45, 45, 52, 0.8)');
        bgGrd.addColorStop(1, 'rgba(30, 30, 36, 0.6)');
      }
      ctx.fillStyle = bgGrd;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Border ring
      ctx.strokeStyle = isActive
        ? `rgba(234, 90, 39, ${0.7 + 0.3 * pulse})`
        : `rgba(255,255,255,${0.08 + 0.05 * Math.max(0, cosA)})`;
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      drawIcon(ctx, images[i], 0, 0, r * 1.3);

      ctx.restore();
    }

    // --- Center large icon ---
    const centerR = Math.min(w, h) * 0.11;
    const activeImg = images[bestIdx];

    // Glow
    const cGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR * 2.5);
    cGlow.addColorStop(0, `rgba(234, 90, 39, ${0.15 + 0.08 * pulse})`);
    cGlow.addColorStop(1, 'rgba(234, 90, 39, 0)');
    ctx.fillStyle = cGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, centerR * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Center disc
    ctx.shadowColor = 'rgba(234, 90, 39, 0.4)';
    ctx.shadowBlur = 35;
    const cBg = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR);
    cBg.addColorStop(0, 'rgba(50, 50, 58, 0.98)');
    cBg.addColorStop(1, 'rgba(30, 30, 36, 0.95)');
    ctx.fillStyle = cBg;
    ctx.beginPath();
    ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Active ring
    ctx.strokeStyle = `rgba(234, 90, 39, ${0.6 + 0.3 * pulse})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
    ctx.stroke();

    // Outer ring
    ctx.strokeStyle = `rgba(234, 90, 39, ${0.15 + 0.1 * pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, centerR * 1.35, 0, Math.PI * 2);
    ctx.stroke();

    drawIcon(ctx, activeImg, cx, cy, centerR * 1.6);

    // Update active
    if (bestIdx !== activeIndex) {
      activeIndex = bestIdx;
      updateInfo(bestIdx);
      updateDots(bestIdx);
    }
  }

  updateInfo(activeIndex);
  updateDots(activeIndex);
  /* El canvas solo dibuja con la sección del toolbox en pantalla. */
  rafWhenVisible(canvas, loop);
}
