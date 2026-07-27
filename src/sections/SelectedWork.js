import { projectsData } from '../data/projects.js';
import { createProjectModal } from './ProjectModal.js';

export function createSelectedWork() {
  const section = document.createElement('section');
  section.className = 'selected-work';
  section.id = 'work';

  const header = document.createElement('div');
  header.className = 'container section-header';
  header.innerHTML = `<span class="section-label scroll-reveal">Proyectos</span>
    <h2 class="kinetic-reveal hover-cascade" data-stagger="0.06">Trabajos<br>Seleccionados</h2>`;
  section.appendChild(header);

  const wrap = document.createElement('div');
  wrap.className = 'coverflow-wrap';

  const stage = document.createElement('div');
  stage.className = 'coverflow-stage';

  projectsData.forEach((project, i) => {
    const slide = document.createElement('div');
    slide.className = 'coverflow-slide';
    slide.dataset.index = i;
    slide.tabIndex = 0;
    slide.setAttribute('role', 'button');
    slide.setAttribute('aria-label', `Ver proyecto ${project.title}`);

    /* Barra inferior con el color de la marca del proyecto (extraído de su
       portada con scripts/extract-brand-colors.mjs). El color del texto se
       elige por contraste: sobre el verde de Baukra el blanco no llega a 4.5:1
       y hay que usar tinta. */
    if (project.brand) {
      slide.style.setProperty('--card-brand', project.brand);
      slide.style.setProperty(
        '--card-ink',
        project.brandInk === 'ink' ? 'var(--color-black)' : 'var(--color-white)'
      );
    }

    const num = document.createElement('span');
    num.className = 'project-card__number';
    num.textContent = project.number;
    slide.appendChild(num);

    const img = document.createElement('img');
    img.className = 'coverflow-slide-img';
    img.src = project.cover;
    img.alt = project.title;
    img.draggable = false;
    slide.appendChild(img);

    const dimOverlay = document.createElement('div');
    dimOverlay.className = 'coverflow-dim';
    slide.appendChild(dimOverlay);

    const footer = document.createElement('div');
    footer.className = 'project-card__footer';
    footer.innerHTML = `<span class="project-card__title">${project.title}</span>
      <span class="project-card__action">
        Ver proyecto
        <span aria-hidden="true">↗</span>
      </span>`;
    slide.appendChild(footer);

    stage.appendChild(slide);
  });

  wrap.appendChild(stage);

  const prev = document.createElement('button');
  prev.className = 'coverflow-nav coverflow-nav--prev';
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Proyecto anterior');
  prev.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';

  const next = document.createElement('button');
  next.className = 'coverflow-nav coverflow-nav--next';
  next.type = 'button';
  next.setAttribute('aria-label', 'Proyecto siguiente');
  next.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

  wrap.appendChild(prev);
  wrap.appendChild(next);
  section.appendChild(wrap);

  const dots = document.createElement('div');
  dots.className = 'coverflow-dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', 'Seleccionar proyecto');
  projectsData.forEach((project, i) => {
    const dot = document.createElement('button');
    dot.className = 'coverflow-dot';
    dot.type = 'button';
    dot.dataset.index = i;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', project.title);
    dots.appendChild(dot);
  });
  section.appendChild(dots);

  const hint = document.createElement('p');
  hint.className = 'coverflow-hint';
  hint.textContent = 'Arrastra, usa las flechas ← → o haz clic en un proyecto';
  section.appendChild(hint);

  return section;
}

export function openProjectModal(project) {
  /* Compensa el ancho de la barra de scroll para que el fondo no salte al bloquearlo. */
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  window.lenis?.stop?.();

  const modal = createProjectModal(project);
  document.body.appendChild(modal);
  requestAnimationFrame(() => {
    modal.classList.add('active');
    modal.focus();
  });
}