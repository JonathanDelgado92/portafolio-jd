import { experienceData } from '../data/experience.js';
import { educationData } from '../data/education.js';

const ICON_CAP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/>
</svg>`;

export function createExperience() {
  const section = document.createElement('section');
  section.className = 'experience';
  section.id = 'experience';

  /* Cabeceras con el mismo patrón label + h2 que el resto del sitio. Antes
     esta sección era la única con un título suelto en mayúsculas de 65px, y
     Formación ni siquiera tenía rótulo. */
  section.innerHTML = `
    <div class="container section-header">
      <span class="section-label scroll-reveal">05 — Trayectoria</span>
      <h2 class="kinetic-reveal hover-cascade">Experiencia profesional</h2>
    </div>

    <div class="container experience-timeline">
      <ol class="experience-list">
        ${experienceData.map((exp) => `
          <li class="experience-item" data-experience>
            <span class="experience-item-dot" aria-hidden="true"></span>
            <article class="experience-card">
              <div class="experience-card-head">
                <span class="experience-item-number">${exp.number}</span>
                <span class="experience-item-period">${exp.period}</span>
              </div>
              <h3 class="experience-item-role">${exp.role}</h3>
              <p class="experience-item-org">${exp.organization}</p>
              <p class="experience-item-desc">${exp.description}</p>
              ${exp.areas ? `
                <div class="experience-tags">
                  <span class="experience-tags-label">Áreas de experiencia</span>
                  <div class="experience-tags-list">
                    ${exp.areas.map(a => `<span class="experience-tag">${a}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </article>
          </li>
        `).join('')}
      </ol>
    </div>

    <div class="container education-section">
      <div class="section-header">
        <span class="section-label scroll-reveal">06 — Formación</span>
        <h2 class="kinetic-reveal hover-cascade">Formación académica</h2>
      </div>
      <div class="education-list">
        ${educationData.map(edu => `
          <article class="education-item" data-education>
            <span class="education-item-icon" aria-hidden="true">${ICON_CAP}</span>
            <div class="education-item-body">
              <div class="education-item-top">
                <h3 class="education-item-degree">${edu.degree}</h3>
                <span class="education-item-badge${edu.isFinished ? ' is-done' : ''}">
                  ${edu.badge || (edu.isFinished ? 'Completado' : 'Cursada')}
                </span>
              </div>
              <p class="education-item-institution">${edu.institution}</p>
              ${edu.location ? `<p class="education-item-location">${edu.location}</p>` : ''}
              ${edu.note ? `<p class="education-item-note">${edu.note}</p>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  return section;
}
