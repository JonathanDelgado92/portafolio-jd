import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { createHeader } from './components/Header.js';
import { createMenu } from './components/Menu.js';
import { createFooter } from './components/Footer.js';
import { createPreloader } from './components/Preloader.js';
import { createCustomCursor } from './components/CustomCursor.js';
import { createScrollProgress } from './components/ScrollProgress.js';
import { createHero } from './sections/Hero.js';
import { createSelectedWork } from './sections/SelectedWork.js';
import { openProjectModal } from './sections/SelectedWork.js';
import { createAbout } from './sections/About.js';
import { createMetrics } from './sections/Metrics.js';
import { createApproach } from './sections/Approach.js';
import { createExpertise } from './sections/Expertise.js';
import { createExperience } from './sections/Experience.js';
import { createToolbox } from './sections/Toolbox.js';
import { initToolboxMenu } from './components/InfiniteMenu.js';
import { createContact } from './sections/Contact.js';
import { sections } from './data/sections.js';
import { projectsData } from './data/projects.js';
import { shouldAnimate } from './utils/reducedMotion.js';
import { isMobile, isTouch } from './utils/responsive.js';
import { rafWhenVisible } from './utils/rafWhenVisible.js';
import { initScrollReveal } from './animations/scrollReveal.js';
import { initKineticTextReveal } from './animations/kineticTextReveal.js';
import { initTextHover } from './animations/textHover.js';
import { initCoverflow } from './animations/coverflow.js';
import { initLiquidChrome } from './animations/liquidChrome.js';
import { initExpertiseTrail } from './components/expertiseTrail.js';

gsap.registerPlugin(ScrollTrigger);

function init() {
  const loading = document.querySelector('.app-loading');
  if (loading) loading.remove();

  const canAnimate = shouldAnimate();

  const app = document.getElementById('app');

  const preloader = createPreloader();
  app.appendChild(preloader);

  const header = createHeader();
  app.appendChild(header);

  const menu = createMenu();
  app.appendChild(menu);

  if (sections.hero !== false) {
    const hero = createHero();
    app.appendChild(hero);
  }

  if (sections.work !== false) {
    const work = createSelectedWork();
    app.appendChild(work);
  }

  if (sections.about !== false) {
    const about = createAbout();
    app.appendChild(about);
  }

  if (sections.metrics !== false) {
    const metrics = createMetrics();
    app.appendChild(metrics);
  }

  if (sections.approach !== false) {
    const approach = createApproach();
    app.appendChild(approach);
  }

  if (sections.expertise !== false) {
    const expertise = createExpertise();
    app.appendChild(expertise);
  }

  if (sections.experience !== false) {
    const experience = createExperience();
    app.appendChild(experience);
  }

  if (sections.toolbox !== false) {
    const toolbox = createToolbox();
    app.appendChild(toolbox);
  }

  if (sections.contact !== false) {
    const contact = createContact();
    app.appendChild(contact);
  }

  const footer = createFooter();
  app.appendChild(footer);

  const scrollProgress = createScrollProgress();
  app.appendChild(scrollProgress);

  const cursor = createCustomCursor();
  app.appendChild(cursor);

  /* Interacciones que NO son decorativas: el menú, el carrusel de proyectos,
     el toolbox y las imágenes diferidas tienen que funcionar también con
     prefers-reduced-motion activado, o el sitio queda inservible. */
  initMenu();
  initCoverflow({
    onCardClick: (index) => {
      const project = projectsData.find((_, i) => i === index);
      if (project) openProjectModal(project);
    },
  });
  initMarqueeDrag();
  initToolboxMenu('#toolbox-canvas-wrap');
  initBackToTop();
  initLazyImages();
  initPageTransition();
  initScrollProgress();
  initHeaderScroll();
  initResizeHandling();

  if (canAnimate) {
    initLenis();
    initPreloader();
    initHero();
    initCustomCursor();
    gsap.from('.approach-tilt', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.approach-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
    initStackedExpertise();
    initExpertiseTrail();
    initAboutReveal();
    initMetricsCounter();
    initExperienceReveal();
    initEducationReveal();
    initContactAnimations();
    initContactHeadline();
    initDecorativeLines();
    initLiquidChrome(document.querySelector('.contact-liquid'), {
      baseColor: [0.08, 0.08, 0.08],
      speed: 0.6,
      amplitude: 0.5,
    });
    initScrollReveal();
    initKineticTextReveal();
    initTextHover();
    initTiltCards();
    initTiltedCard();
  } else {
    document.body.classList.add('reduce-motion');
    revealAllContent();
  }
}

function initLenis() {
  if (isMobile()) return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;
}

function initPreloader() {
  const bar = document.querySelector('.preloader-bar');
  const num = document.querySelector('.preloader-num');
  const preloader = document.querySelector('.preloader');

  if (!bar) return;

  const tl = gsap.timeline();

  tl.to(bar, {
    width: '100%',
    duration: 1.8,
    ease: 'cubic-bezier(0.77, 0, 0.175, 1)',
    onUpdate: function () {
      const p = Math.round(this.progress() * 100);
      if (num) num.textContent = p;
    },
  });

  tl.to(preloader, {
    y: '-100%',
    duration: 0.8,
    ease: 'cubic-bezier(0.77, 0, 0.175, 1)',
    delay: 0.3,
  });

  tl.set(preloader, { display: 'none' });
}

function initHero() {

  const tl = gsap.timeline({ delay: 2.5 });

  tl.to('.hero-firstname', {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    duration: 1.2,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  });

  tl.to('.hero-lastname', {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    duration: 1.2,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=0.6');

  tl.to('.hero-image-mask', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.4,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=1.0');

  tl.to('.hero-subtitle-wrapper', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=0.6');

  tl.to('.hero-description-wrapper', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=0.4');

  tl.to('.hero-cta-wrapper', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=0.4');

  tl.to('.hero-info', {
    opacity: 1,
    duration: 0.8,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=0.6');

  tl.to('.hero-scroll-indicator', {
    opacity: 1,
    duration: 0.6,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }, '-=0.4');

  document.querySelector('.preloader')?.addEventListener('transitionend', () => {
    document.body.classList.add('hero-revealed');
  });

  const heroName = document.getElementById('heroName');
  if (heroName) {
    heroName.addEventListener('mouseenter', () => {
      gsap.to(heroName, { scale: 1.02, duration: 0.4, ease: 'power2.out' });
    });
    heroName.addEventListener('mouseleave', () => {
      gsap.to(heroName, { scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  }
}

/**
 * Menú lateral escalonado (port de StaggeredMenu de React Bits a GSAP vanilla).
 *
 * Secuencia al abrir: las capas de color entran desfasadas 0.07s, el panel
 * detrás de ellas, y ya sobre la marcha suben los enlaces (yPercent 140 -> 0
 * con una ligera rotación), luego la numeración y por último las redes.
 */
function initMenu() {
  const btn = document.querySelector('.header-menu-btn');
  const wrapper = document.querySelector('.staggered-menu-wrapper');
  const panel = wrapper?.querySelector('.staggered-menu-panel');
  if (!btn || !wrapper || !panel) return;

  const layers = [...wrapper.querySelectorAll('.sm-prelayer')];
  const itemLabels = [...panel.querySelectorAll('.sm-panel-itemLabel')];
  const numberItems = [...panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')];
  const socialTitle = panel.querySelector('.sm-socials-title');
  const socialLinks = [...panel.querySelectorAll('.sm-socials-link')];
  const cvBtn = panel.querySelector('.sm-cv');
  const icon = btn.querySelector('.sm-icon');
  const plusH = btn.querySelector('.sm-icon-line:not(.sm-icon-line-v)');
  const plusV = btn.querySelector('.sm-icon-line-v');
  const textInner = btn.querySelector('.sm-toggle-textInner');

  const offscreen = wrapper.dataset.position === 'left' ? -100 : 100;
  let open = false;
  let busy = false;
  let openTl = null;

  gsap.set([panel, ...layers], { xPercent: offscreen });
  gsap.set(plusH, { rotate: 0, transformOrigin: '50% 50%' });
  gsap.set(plusV, { rotate: 90, transformOrigin: '50% 50%' });
  gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

  function resetPanelContent() {
    gsap.set(itemLabels, { yPercent: 140, rotate: 10 });
    gsap.set(numberItems, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    gsap.set(socialLinks, { y: 25, opacity: 0 });
    if (cvBtn) gsap.set(cvBtn, { y: 25, opacity: 0 });
  }

  resetPanelContent();

  function playOpen() {
    if (busy) return;
    busy = true;
    openTl?.kill();
    resetPanelContent();

    const tl = gsap.timeline({ onComplete: () => { busy = false; } });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const panelStart = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0;
    const panelDuration = 0.65;
    tl.fromTo(panel, { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelStart);

    const itemsStart = panelStart + panelDuration * 0.15;
    tl.to(itemLabels, {
      yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out',
      stagger: { each: 0.1, from: 'start' },
    }, itemsStart);

    tl.to(numberItems, {
      '--sm-num-opacity': 1, duration: 0.6, ease: 'power2.out',
      stagger: { each: 0.08, from: 'start' },
    }, itemsStart + 0.1);

    const socialsStart = panelStart + panelDuration * 0.4;
    if (cvBtn) {
      tl.to(cvBtn, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, socialsStart - 0.06);
    }
    if (socialTitle) {
      tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
    }
    tl.to(socialLinks, {
      y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
      stagger: { each: 0.08, from: 'start' },
    }, socialsStart + 0.04);

    openTl = tl;
  }

  function playClose() {
    openTl?.kill();
    openTl = null;
    gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        resetPanelContent();
        busy = false;
      },
    });
  }

  function setOpen(next) {
    if (next === open) return;
    open = next;

    wrapper.toggleAttribute('data-open', open);
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    panel.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    /* Lenis controla el scroll en escritorio: sin pararlo el fondo sigue
       desplazándose con el panel abierto. */
    if (open) window.lenis?.stop?.(); else window.lenis?.start?.();

    if (textInner) {
      textInner.textContent = open ? 'Cerrar' : 'Menú';
      gsap.fromTo(textInner, { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power4.out' });
    }

    gsap.to(icon, {
      rotate: open ? 225 : 0,
      duration: open ? 0.8 : 0.35,
      ease: open ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    });

    if (open) playOpen(); else playClose();
  }

  btn.addEventListener('click', () => setOpen(!open));

  panel.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  /* Cierre al hacer clic fuera, sin capturar el propio botón. */
  document.addEventListener('mousedown', (e) => {
    if (!open) return;
    if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
}

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  ScrollTrigger.create({
    onUpdate: (self) => {
      bar.style.width = `${self.progress * 100}%`;
    },
  });
}

function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor || isTouch()) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursor.style.display = 'block';
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
  });

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .expertise-panel');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  const projectLinks = document.querySelectorAll('.project-card');
  projectLinks.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('view-project'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('view-project'));
  });
}

function initAboutReveal() {
  const mask = document.querySelector('.about-image-mask');
  if (!mask) return;

  ScrollTrigger.create({
    trigger: mask,
    start: 'top 80%',
    onEnter: () => mask.classList.add('revealed'),
    once: true,
  });

  const textParas = document.querySelectorAll('.about-text-content p');
  textParas.forEach((p, i) => {
    gsap.from(p, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
      scrollTrigger: {
        trigger: p,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initMetricsCounter() {
  const items = document.querySelectorAll('[data-metric]');

  items.forEach(item => {
    const numEl = item.querySelector('.metric-number');
    if (!numEl) return;
    const target = parseInt(numEl.dataset.target);

    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(numEl, {
          innerText: target,
          duration: 2,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          snap: { innerText: 1 },
          modifiers: {
            innerText: (val) => Math.round(Number(val)).toString(),
          },
        });
      },
      once: true,
    });
  });
}

function initMarqueeDrag() {
  const track = document.querySelector('.metrics-marquee__track');
  if (!track) return;

  const groups = track.querySelectorAll('.metrics-marquee__group');
  if (groups.length < 2) return;

  /* El track lleva gap entre grupos, así que el punto de repetición es el ancho
     del grupo MÁS ese hueco; si no, el bucle salta al reiniciarse. */
  const trackGap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const groupWidth = groups[0].offsetWidth + trackGap;
  let pos = 0;
  /* Con reduced-motion el marquee no se desplaza solo, pero sigue siendo arrastrable. */
  let speed = shouldAnimate() ? -1.2 : 0;
  let isDragging = false;
  let lastX = 0;
  let dragVelocity = 0;

  function tick() {
    if (!isDragging) {
      pos += speed;
      if (pos <= -groupWidth) pos += groupWidth;
    } else {
      dragVelocity *= 0.92;
      pos += dragVelocity;
      if (pos <= -groupWidth) pos += groupWidth;
      if (pos > 0) pos -= groupWidth;
    }
    track.style.transform = `translateX(${pos}px)`;
  }

  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    dragVelocity = 0;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    pos += dx;
    dragVelocity = dx * 0.6;
    lastX = e.clientX;
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });

  window.addEventListener('pointercancel', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });

  track.style.cursor = 'grab';
  /* Solo se desplaza con la franja en pantalla; antes corría durante todo el
     recorrido de la página. */
  rafWhenVisible(track, tick);
}

function initExperienceReveal() {
  const items = document.querySelectorAll('[data-experience]');
  gsap.set(items, { opacity: 0, y: 30 });
  items.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          overwrite: 'auto',
        });
      },
    });
  });
}

function initStackedExpertise() {
  const section = document.querySelector('.expertise');
  const sticky = section?.querySelector('.expertise-sticky');
  const panels = gsap.utils.toArray('.expertise-panel');
  const dots = gsap.utils.toArray('.expertise-progress .dot');
  if (!section || !sticky || !panels.length) return;

  /* El ancho lo decide gsap.matchMedia en cada cambio de viewport. Antes había
     aquí un `const isMobile` capturado al cargar que, si la página abría en
     estrecho y luego se ensanchaba, abortaba el pin al reevaluarse. */
  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sticky,
        start: 'top top',
        end: `+=${panels.length * 100}%`,
        pin: true,
        scrub: 0.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      defaults: {
        duration: 0.2,
        ease: 'power2.out',
      },
    });

    const n = panels.length;
    const seg = 1 / n;

    panels.forEach((panel, i) => {
      const inner = panel.querySelector('.expertise-panel-inner');

      /* El primer panel arranca ya visible. Antes todos empezaban en
         autoAlpha 0 y el primero solo se revelaba cuando el pin ya había
         comenzado, así que al acercarse a la sección se veía un bloque en
         blanco del alto de la pantalla. Como el tween va de 1 a 1, la
         línea de tiempo no lo altera. */
      const first = i === 0;

      gsap.set(panel, { autoAlpha: first ? 1 : 0, zIndex: n - i });
      gsap.set(inner, {
        y: first ? 0 : 20,
        scale: first ? 1 : 0.99,
        filter: first ? 'blur(0px)' : 'blur(3px)',
      });

      const enterStart = i * seg;
      const holdUntil = (i + 1) * seg - 0.12;
      const exitStart = holdUntil;

      tl.to(panel, { autoAlpha: 1 }, enterStart)
        .to(inner, {
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
        }, enterStart);

      if (i < n - 1) {
        tl.to(inner, {
          y: -15,
          scale: 0.995,
          filter: 'blur(2px)',
          opacity: 0,
        }, exitStart)
        .to(panel, { autoAlpha: 0 }, exitStart);
      }

      if (dots[i]) {
        tl.call(() => {
          dots.forEach(d => d.classList.remove('active'));
        }, [], enterStart)
        .call(() => {
          dots[i]?.classList.add('active');
        }, [], enterStart + 0.01);
      }
    });

    return () => tl.scrollTrigger?.kill();
  });

  mm.add('(max-width: 768px)', () => {
    panels.forEach((panel) => {
      gsap.set(panel, { autoAlpha: 1 });
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const inner = panel.querySelector('.expertise-panel-inner');
          if (inner) {
            gsap.from(inner, {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
            });
          }
        },
      });
    });
  });
}

function initEducationReveal() {
  const items = document.querySelectorAll('[data-education]');
  gsap.set(items, { opacity: 0, y: 20 });
  items.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          overwrite: 'auto',
        });
      },
    });
  });
}

function initContactAnimations() {
  const gradient = document.querySelector('.contact-gradient');
  if (!gradient) return;
  gsap.to(gradient, {
    backgroundPosition: '200% 50%',
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

function initContactHeadline() {
  const headline = document.querySelector('.contact-headline');
  if (!headline) return;

  const spans = headline.querySelectorAll(':scope > span');
  if (!spans.length) return;

  gsap.from(spans, {
    y: 30,
    opacity: 0,
    filter: 'blur(6px)',
    duration: 0.8,
    stagger: 0.18,
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    scrollTrigger: {
      trigger: headline,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

function initDecorativeLines() {
  const headers = document.querySelectorAll('.section-header');
  headers.forEach((header) => {
    const line = document.createElement('div');
    line.className = 'section-header-line';
    line.style.cssText = 'height:2px;background:var(--color-accent);width:60px;margin-top:16px;transform-origin:left;transform:scaleX(0);';
    const heading = header.querySelector('h2');
    if (heading) heading.after(line);

    gsap.to(line, {
      scaleX: 1,
      duration: 1.2,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    const section = header.closest('section');
    if (section) {
      const content = section.querySelector('[class*="grid"], [class*="cards"], [class*="steps"], [class*="categories"]');
      if (content) {
        gsap.from(content, {
          y: 40,
          opacity: 0,
          filter: 'blur(4px)',
          duration: 0.25,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }
  });
}

function initTiltCards() {
  const wraps = document.querySelectorAll('.t-tilt');
  if (!wraps.length || isTouch()) return;

  wraps.forEach(wrap => {
    const card = wrap.querySelector('.t-tilt-card');
    if (!card) return;

    let timer = null;

    function onPointerMove(e) {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rxDeg = ((y - cy) / cy) * -6;
      const ryDeg = ((x - cx) / cx) * 6;

      card.style.setProperty('--tilt-rx', rxDeg + 'deg');
      card.style.setProperty('--tilt-ry', ryDeg + 'deg');
      card.style.setProperty('--tilt-gx', (x / rect.width) * 100 + '%');
      card.style.setProperty('--tilt-gy', (y / rect.height) * 100 + '%');

      card.classList.add('is-tilting');
      wrap.classList.add('is-hover');

      clearTimeout(timer);
      timer = setTimeout(() => {
        card.classList.remove('is-tilting');
      }, 120);
    }

    function onPointerLeave() {
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
      card.classList.remove('is-tilting');
      wrap.classList.remove('is-hover');
    }

    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerleave', onPointerLeave);
  });
}

function initTiltedCard() {
  const figures = document.querySelectorAll('.tilted-card-figure');
  if (!figures.length || isTouch()) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  figures.forEach((figure) => {
    const inner = figure.querySelector('.tilted-card-inner');
    const caption = figure.querySelector('.tilted-card-caption');
    if (!inner) return;

    const state = {
      rx: 0, ry: 0, tRX: 0, tRY: 0,
      scale: 1, tScale: 1,
      cx: 0, cy: 0, tCX: 0, tCY: 0,
      opacity: 0, tOpacity: 0,
      amplitude: 12,
      scaleOnHover: 1.05,
    };

    const SPRING = 0.12;

    function update() {
      state.rx += (state.tRX - state.rx) * SPRING;
      state.ry += (state.tRY - state.ry) * SPRING;
      state.scale += (state.tScale - state.scale) * SPRING;
      state.cx += (state.tCX - state.cx) * SPRING;
      state.cy += (state.tCY - state.cy) * SPRING;
      state.opacity += (state.tOpacity - state.opacity) * SPRING;

      inner.style.transform = `rotateX(${state.ry}deg) rotateY(${state.rx}deg) scale(${state.scale})`;

      if (caption) {
        caption.style.transform = `translate(${state.cx}px, ${state.cy}px)`;
        caption.style.opacity = state.opacity;
      }
    }

    gsap.ticker.add(update);

    figure.addEventListener('pointermove', (e) => {
      const rect = figure.getBoundingClientRect();
      const ox = e.clientX - rect.left - rect.width / 2;
      const oy = e.clientY - rect.top - rect.height / 2;
      state.tRX = (ox / (rect.width / 2)) * state.amplitude;
      state.tRY = (oy / (rect.height / 2)) * -state.amplitude;
      state.tCX = e.clientX - rect.left;
      state.tCY = e.clientY - rect.top;
    });

    figure.addEventListener('pointerenter', () => {
      state.tScale = state.scaleOnHover;
      state.tOpacity = 1;
    });

    figure.addEventListener('pointerleave', () => {
      state.tRX = 0;
      state.tRY = 0;
      state.tScale = 1;
      state.tOpacity = 0;
    });
  });
}

function initBackToTop() {
  const btn = document.querySelector('.footer-back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!shouldAnimate()) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/**
 * Recalcula el layout dependiente del viewport tras redimensionar.
 *
 * Las alturas de las secciones ancladas (expertise) y las posiciones del
 * carrusel se miden al cargar; sin esto, girar el móvil o redimensionar la
 * ventana deja los ScrollTrigger apuntando a coordenadas obsoletas.
 */
function initResizeHandling() {
  let timer = null;
  let lastWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    /* En móvil, mostrar/ocultar la barra del navegador cambia solo la altura:
       refrescar ahí provoca saltos de scroll sin aportar nada. */
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;

    clearTimeout(timer);
    timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  ScrollTrigger.create({
    start: 100,
    onEnter: () => header.classList.add('scrolled'),
    onLeaveBack: () => header.classList.remove('scrolled'),
  });
}

function initLazyImages() {
  const images = document.querySelectorAll('[data-src]');
  images.forEach(img => {
    const src = img.dataset.src;
    if (!src) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(img);
  });
}

function initPageTransition() {
  document.querySelectorAll('[data-project-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const transition = document.getElementById('page-transition');
      if (!shouldAnimate()) {
        window.location.href = href;
        return;
      }
      if (transition) {
        const bg = transition.querySelector('.page-transition-bg');
        gsap.set(transition, { display: 'block', pointerEvents: 'all' });
        gsap.fromTo(bg, { scaleY: 0, transformOrigin: 'top center' }, {
          scaleY: 1, duration: 0.6, ease: 'cubic-bezier(0.77, 0, 0.175, 1)',
          onComplete: () => { window.location.href = href; },
        });
      }
    });
  });
}

function revealAllContent() {
  document.querySelectorAll('.hero-firstname, .hero-lastname').forEach(el => {
    el.style.clipPath = 'none';
  });
  document.querySelectorAll('.hero-image-mask').forEach(el => {
    el.style.clipPath = 'none';
  });
  document.querySelectorAll('.hero-subtitle-wrapper, .hero-description-wrapper, .hero-cta-wrapper, .hero-info, .hero-scroll-indicator').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.about-image-mask').forEach(el => {
    el.style.clipPath = 'none';
  });
  document.querySelectorAll('[data-experience], [data-education]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.preloader').forEach(el => {
    el.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    init();
  } catch (e) {
    console.error('Portfolio init error:', e);
    const app = document.getElementById('app');
    app.innerHTML = `
      <div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fafafa;font-family:sans-serif;text-align:center;padding:2rem;flex-direction:column;">
        <h1 style="font-family:Georgia,serif;font-size:2rem;margin-bottom:1rem;font-weight:normal;">Jonathan Delgado</h1>
        <p style="color:#9a9a9a;margin-bottom:0.5rem;">Error al cargar el portafolio.</p>
        <p style="color:#6b6b6b;font-size:0.8rem;">Revisa la consola (F12) para más detalles.</p>
      </div>
    `;
  }
});