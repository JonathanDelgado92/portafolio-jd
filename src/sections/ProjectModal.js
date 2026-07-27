import { projectsData } from '../data/projects.js';

function createLightbox(images, startIndex) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Vista ampliada de galería');
  /* Necesario para que overlay.focus() funcione y lleguen los eventos de teclado. */
  overlay.tabIndex = -1;

  let currentIndex = startIndex;

  function render() {
    overlay.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close" aria-label="Cerrar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      ${images.length > 1 ? `
        <button class="lightbox-prev" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="lightbox-next" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      ` : ''}
      <div class="lightbox-image-wrapper">
        <img src="${images[currentIndex]}" alt="" class="lightbox-image" />
      </div>
      <div class="lightbox-counter">${currentIndex + 1} / ${images.length}</div>
    `;
  }

  /* Solo actualiza la imagen y el contador: no se reconstruye el DOM,
     así los listeners de abajo se registran una única vez. */
  function navigate(delta) {
    currentIndex = (currentIndex + delta + images.length) % images.length;
    const img = overlay.querySelector('.lightbox-image');
    const counter = overlay.querySelector('.lightbox-counter');
    if (img) img.src = images[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function attachEvents() {
    const backdrop = overlay.querySelector('.lightbox-backdrop');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function close() {
    overlay.remove();
    previouslyFocused?.focus?.();
  }

  const previouslyFocused = document.activeElement;

  render();
  attachEvents();
  overlay.focus();
  return overlay;
}

function getProjectIndex(id) {
  return projectsData.findIndex(p => p.id === id);
}

export function createProjectModal(project) {
  const currentIdx = getProjectIndex(project.id);
  /* Navegación circular: en el último proyecto "siguiente" vuelve al primero y
     en el primero "anterior" salta al último, así el recorrido nunca se corta. */
  const total = projectsData.length;
  const prevProject = total > 1 ? projectsData[(currentIdx - 1 + total) % total] : null;
  const nextProject = total > 1 ? projectsData[(currentIdx + 1) % total] : null;

  /* Los videos se sirven desde YouTube (sin listar) para no cargar 23 MB de
     MP4 en el despliegue. El póster sigue siendo local: así el modal muestra
     la miniatura propia y el reproductor solo se carga al pulsar play. */
  const hasVideo = !!project.youtubeId;
  const videoPoster = project.video
    ? project.video.replace(/\.mp4$/, '-poster.webp')
    : project.cover;
  const allGallery = [...(project.gallery || [])];
  const hasBeforeAfter = !!project.beforeAfter;

  const overlay = document.createElement('div');
  overlay.className = 'project-modal';
  overlay.tabIndex = -1;

  function galleryGrid(images, baseIndex = 0) {
    return images.map((img, i) => `
      <div class="gallery-item" data-index="${baseIndex + i}">
        <img src="${img}" alt="" loading="lazy" />
      </div>
    `).join('');
  }

  /**
   * Densidad de columnas según cuántas imágenes haya.
   *
   * Con un número fijo de columnas, cuatro imágenes salen enormes y catorce
   * diminutas. El volumen real va de 4 (Bravo Motors) a 42 (Fundación).
   */
  function density(count) {
    if (count <= 4) return 'few';
    if (count <= 12) return 'mid';
    return 'many';
  }

  /* Con manuales de 20 o 40 páginas, volcarlas todas de golpe da un muro de
     scroll. Se muestra una primera tanda y el resto bajo demanda. */
  const MANUAL_PREVIEW = 12;
  const manualPages = project.manual || [];
  const manualNeedsToggle = project.hasManual && manualPages.length > MANUAL_PREVIEW;

  function manualGrid(pages, from = 0) {
    return pages.map((img, i) => `
      <div class="manual-item" data-index="${from + i}">
        <img src="${img}" alt="Manual de marca — Página ${from + i + 1}" loading="lazy" />
      </div>
    `).join('');
  }

  const svg = (d, extra = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${extra}${d}</svg>`;

  const ICON = {
    calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>'),
    layers: svg('<path d="M12 3l9 5-9 5-9-5 9-5zM3 14l9 5 9-5"/>'),
    grid: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>'),
    bulb: svg('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>'),
    link: svg('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12.2 19"/>'),
  };

  /* Hero: la primera imagen de la galería a lo ancho. El logo sobre blanco que
     había antes dejaba un bloque enorme casi vacío; ahora se superpone pequeño
     sobre la foto para que la marca siga presente. */
  /* project.hero permite elegir a mano la imagen de portada. Al no salir de
     ninguna galería, no se descuenta de ellas: la página sigue apareciendo
     también en su cuadrícula. */
  const heroImage = project.hero
    || (hasVideo ? null : (allGallery[0] || project.capturas?.[0] || manualPages[0] || null));

  /* Solo se saca de la galería si de verdad se está usando como hero. Cuando
     hay video, el hero es el video y la galería debe quedar completa. */
  const heroFromGallery = !!heroImage && allGallery[0] === heroImage;
  const gallerySansHero = heroFromGallery ? allGallery.slice(1) : allGallery;
  /* El lightbox recorre allGallery completa, así que las miniaturas restantes
     arrancan una posición más adelante. */
  const heroOffset = heroFromGallery ? 1 : 0;

  const shareUrl = encodeURIComponent(`${location.origin}/#work`);

  const piezas = allGallery.length + (project.capturas?.length || 0) + (project.webinars?.length || 0);
  const contentSummary = [
    piezas ? `${piezas} piezas` : null,
    manualPages.length ? `manual de ${manualPages.length} págs.` : null,
    hasVideo ? 'video' : null,
  ].filter(Boolean).join(' · ') || '—';

  /* Pestañas por tipo de material. Antes galería, manual, capturas y webinars
     se apilaban en vertical y el modal se hacía interminable. */
  const tabs = [
    gallerySansHero.length && { id: 'galeria', label: 'Galería', count: gallerySansHero.length },
    manualPages.length && project.hasManual && { id: 'manual', label: 'Manual de marca', count: manualPages.length },
    project.capturas?.length && { id: 'capturas', label: 'Capturas', count: project.capturas.length },
    project.webinars?.length && { id: 'webinars', label: 'Webinars', count: project.webinars.length },
    hasBeforeAfter && { id: 'antesdespues', label: project.beforeAfter.label, count: 0 },
  ].filter(Boolean);

  overlay.innerHTML = `
    <div class="project-modal-backdrop"></div>
    <div class="project-modal-scroll" data-lenis-prevent>
      <div class="project-modal-content">
        <button class="project-modal-close" aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <header class="pm-head">
          <div class="pm-head-meta">
            <span class="pm-counter">${project.number}<span>/${String(projectsData.length).padStart(2, '0')}</span></span>
            <span class="pm-head-sep"></span>
            <span class="pm-head-kicker">${project.categories[0] || ''}</span>
          </div>
          <h2 class="pm-title">${project.title}</h2>
          <div class="pm-chips">
            ${project.categories.map(c => `<span class="pm-chip">${c}</span>`).join('')}
          </div>
          <div class="pm-actions">
            <button class="pm-share" type="button" data-share="copy" aria-label="Copiar enlace del proyecto">
              ${ICON.link}<span>Copiar enlace</span>
            </button>
          </div>
        </header>

        ${hasVideo ? `
          <div class="pm-hero pm-hero--video">
            <button class="pm-video-facade" type="button" data-youtube="${project.youtubeId}"
                    aria-label="Reproducir el video de ${project.title}">
              <img src="${videoPoster}" alt="" loading="lazy" />
              <span class="pm-video-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </button>
          </div>
        ` : heroImage ? `
          <figure class="pm-hero"${project.heroRatio ? ` style="--pm-hero-ratio:${project.heroRatio}"` : ''}>
            <img src="${heroImage}" alt="${project.title}" />
            <img class="pm-hero-logo" src="${project.cover}" alt="" aria-hidden="true" />
          </figure>
        ` : `
          <div class="project-modal-cover">
            <img src="${project.cover}" alt="${project.title}" />
          </div>
        `}

        <div class="pm-meta">
          <div class="pm-meta-card">
            ${ICON.calendar}
            <span class="pm-meta-label">Año</span>
            <span class="pm-meta-value">${project.year}</span>
          </div>
          <div class="pm-meta-card">
            ${ICON.layers}
            <span class="pm-meta-label">Categorías</span>
            <span class="pm-meta-value">${project.categories.join(', ')}</span>
          </div>
          <div class="pm-meta-card">
            ${ICON.grid}
            <span class="pm-meta-label">Contenido</span>
            <span class="pm-meta-value">${contentSummary}</span>
          </div>
        </div>

        <div class="pm-intro">
          <p class="pm-lead">${project.description}</p>
        </div>

        <div class="pm-split">
          ${project.challenge ? `
            <article class="pm-card">
              <span class="pm-card-icon">${ICON.target}</span>
              <h3 class="pm-card-title">El desafío</h3>
              <p>${project.challenge}</p>
            </article>
          ` : ''}
          ${project.solution ? `
            <article class="pm-card">
              <span class="pm-card-icon">${ICON.bulb}</span>
              <h3 class="pm-card-title">La solución</h3>
              <p>${project.solution}</p>
            </article>
          ` : ''}
        </div>

        ${tabs.length ? `
          <section class="pm-media">
            <div class="pm-media-head">
              <h3 class="pm-media-title">Galería del proyecto</h3>
              <div class="pm-tabs" role="tablist" aria-label="Tipos de material">
                ${tabs.map((t, i) => `
                  <button class="pm-tab${i === 0 ? ' is-active' : ''}" type="button"
                          role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}"
                          aria-selected="${i === 0}" data-tab="${t.id}">
                    ${t.label}${t.count ? `<span class="pm-tab-count">${t.count}</span>` : ''}
                  </button>
                `).join('')}
              </div>
            </div>

            ${tabs.map((t, i) => `
              <div class="pm-panel${i === 0 ? ' is-active' : ''}" id="panel-${t.id}"
                   role="tabpanel" aria-labelledby="tab-${t.id}" ${i === 0 ? '' : 'hidden'}>
                ${t.id === 'galeria' ? `
                  <div class="project-modal-gallery-grid" data-density="${density(gallerySansHero.length)}">
                    ${galleryGrid(gallerySansHero, heroOffset)}
                  </div>
                ` : ''}

                ${t.id === 'manual' ? `
                  <p class="pm-panel-desc">${manualPages.length} páginas de identidad visual, tipografía, color y aplicaciones.</p>
                  <div class="project-modal-manual-grid" data-density="${density(manualPages.length)}">
                    ${manualGrid(manualNeedsToggle ? manualPages.slice(0, MANUAL_PREVIEW) : manualPages)}
                  </div>
                  ${manualNeedsToggle ? `
                    <button class="project-modal-more" type="button" data-manual-more>
                      Ver las ${manualPages.length} páginas
                    </button>
                  ` : ''}
                ` : ''}

                ${t.id === 'capturas' ? `
                  <div class="project-modal-gallery-grid" data-density="${density(project.capturas.length)}">
                    ${galleryGrid(project.capturas, allGallery.length)}
                  </div>
                ` : ''}

                ${t.id === 'webinars' ? `
                  <div class="project-modal-gallery-grid" data-density="${density(project.webinars.length)}">
                    ${galleryGrid(project.webinars, allGallery.length + (project.capturas ? project.capturas.length : 0))}
                  </div>
                ` : ''}

                ${t.id === 'antesdespues' ? `
                  <div class="beforeafter-grid">
                    <div class="beforeafter-col">
                      <span class="beforeafter-tag beforeafter-tag--before">Antes</span>
                      <div class="beforeafter-images">
                        ${project.beforeAfter.before.map(img => `
                          <div class="gallery-item" data-ba="before">
                            <img src="${img}" alt="Antes" loading="lazy" />
                          </div>
                        `).join('')}
                      </div>
                    </div>
                    <div class="beforeafter-col">
                      <span class="beforeafter-tag beforeafter-tag--after">Después</span>
                      <div class="beforeafter-images">
                        ${project.beforeAfter.after.map(img => `
                          <div class="gallery-item" data-ba="after">
                            <img src="${img}" alt="Después" loading="lazy" />
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${prevProject || nextProject ? `
          <div class="project-modal-nav-projects">
            ${prevProject ? `
              <button class="project-nav-btn project-nav-prev" data-id="${prevProject.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                <div class="project-nav-text">
                  <span class="project-nav-label">Anterior</span>
                  <span class="project-nav-title">${prevProject.title}</span>
                </div>
              </button>
            ` : '<div></div>'}
            ${nextProject ? `
              <button class="project-nav-btn project-nav-next" data-id="${nextProject.id}">
                <div class="project-nav-text">
                  <span class="project-nav-label">Siguiente</span>
                  <span class="project-nav-title">${nextProject.title}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ` : '<div></div>'}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  /* ─── video: fachada -> iframe solo al pulsar ─── */
  const facade = overlay.querySelector('[data-youtube]');
  facade?.addEventListener('click', () => {
    const id = facade.dataset.youtube;
    const frame = document.createElement('iframe');
    /* nocookie: YouTube no deja cookies de seguimiento hasta que se reproduce. */
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    frame.title = `Video del proyecto ${project.title}`;
    frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen = true;
    frame.loading = 'lazy';
    facade.replaceWith(frame);
  });

  /* ─── pestañas de material ─── */
  const tabBtns = [...overlay.querySelectorAll('.pm-tab')];
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      tabBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      overlay.querySelectorAll('.pm-panel').forEach((panel) => {
        const on = panel.id === `panel-${id}`;
        panel.classList.toggle('is-active', on);
        panel.toggleAttribute('hidden', !on);
      });
    });
  });

  /* ─── compartir ─── */
  const copyBtn = overlay.querySelector('[data-share="copy"]');
  copyBtn?.addEventListener('click', async () => {
    const label = copyBtn.querySelector('span');
    const original = label.textContent;
    try {
      await navigator.clipboard.writeText(decodeURIComponent(shareUrl));
      label.textContent = 'Enlace copiado';
    } catch {
      /* clipboard falla sin HTTPS o sin permiso: se avisa en vez de callar. */
      label.textContent = 'No se pudo copiar';
    }
    copyBtn.classList.add('is-done');
    setTimeout(() => {
      label.textContent = original;
      copyBtn.classList.remove('is-done');
    }, 2000);
  });

  const previouslyFocused = document.activeElement;

  /* keepLocked: al saltar de un proyecto a otro el modal sigue abierto,
     así que no se debe devolver el scroll al body. */
  const close = (keepLocked = false) => {
    overlay.classList.remove('active');
    if (!keepLocked) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.lenis?.start?.();
      previouslyFocused?.focus?.();
    }
    setTimeout(() => overlay.remove(), 400);
  };

  overlay.querySelector('.project-modal-backdrop').addEventListener('click', () => close());
  overlay.querySelector('.project-modal-close').addEventListener('click', () => close());
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  const allLightboxImages = [];
  allGallery.forEach(i => allLightboxImages.push(i));
  if (project.capturas) project.capturas.forEach(i => allLightboxImages.push(i));
  if (project.webinars) project.webinars.forEach(i => allLightboxImages.push(i));

  if (allLightboxImages.length > 0) {
    overlay.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        if (!isNaN(idx)) {
          const lb = createLightbox(allLightboxImages, idx);
          document.body.appendChild(lb);
          requestAnimationFrame(() => lb.classList.add('active'));
        }
      });
    });
  }

  if (project.hasManual && manualPages.length) {
    const manualGridEl = overlay.querySelector('.project-modal-manual-grid');

    /* Delegación: los ítems restantes se añaden después de pulsar "ver más",
       así que enlazar uno a uno al inicio dejaría los nuevos sin escuchar. */
    manualGridEl?.addEventListener('click', (e) => {
      const item = e.target.closest('.manual-item');
      if (!item) return;
      const idx = parseInt(item.dataset.index, 10);
      if (Number.isNaN(idx)) return;
      const lb = createLightbox(manualPages, idx);
      document.body.appendChild(lb);
      requestAnimationFrame(() => lb.classList.add('active'));
    });

    const moreBtn = overlay.querySelector('[data-manual-more]');
    moreBtn?.addEventListener('click', () => {
      manualGridEl.insertAdjacentHTML(
        'beforeend',
        manualGrid(manualPages.slice(MANUAL_PREVIEW), MANUAL_PREVIEW)
      );
      moreBtn.remove();
    });
  }

  overlay.querySelectorAll('.project-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const next = projectsData.find(p => p.id === id);
      if (!next) return;
      close(true);
      setTimeout(() => {
        const modal = createProjectModal(next);
        document.body.appendChild(modal);
        modal.scrollTop = 0;
        requestAnimationFrame(() => {
          modal.classList.add('active');
          modal.focus();
        });
      }, 300);
    });
  });

  return overlay;
}
