import { navLinks, siteConfig } from '../data/siteConfig.js';

/**
 * Menú lateral escalonado.
 *
 * Port del componente StaggeredMenu de React Bits a JS vanilla: el proyecto no
 * usa React, así que se reproduce la estructura y el comportamiento, no la API.
 * Las capas previas (.sm-prelayer) entran desfasadas antes que el panel para
 * dar la sensación de barrido; la animación vive en initMenu() de main.js.
 *
 * Paleta adaptada a la del portafolio: el panel original es blanco, aquí es
 * carbón para no romper con el resto del sitio, y las capas usan los naranjas
 * de la marca en vez de los morados por defecto.
 */
export function createMenu() {
  const wrapper = document.createElement('div');
  wrapper.className = 'staggered-menu-wrapper';
  wrapper.dataset.position = 'right';

  const socials = [
    { label: 'Behance', link: siteConfig.social.behance },
    { label: 'LinkedIn', link: siteConfig.social.linkedin },
    { label: 'Email', link: `mailto:${siteConfig.email}` },
  ];

  wrapper.innerHTML = `
    <div class="sm-prelayers" aria-hidden="true">
      <div class="sm-prelayer sm-prelayer--1"></div>
      <div class="sm-prelayer sm-prelayer--2"></div>
    </div>

    <aside id="staggered-menu-panel" class="staggered-menu-panel"
           aria-hidden="true" aria-label="Menú de navegación">
      <div class="sm-panel-inner">
        <ul class="sm-panel-list" role="list" data-numbering>
          ${navLinks.map((link) => `
            <li class="sm-panel-itemWrap">
              <a class="sm-panel-item" href="${link.href}" data-menu-link>
                <span class="sm-panel-itemLabel">${link.label}</span>
              </a>
            </li>
          `).join('')}
        </ul>

        <a class="sm-cv" href="${siteConfig.cvUrl}" download
           aria-label="Descargar CV en PDF"
           target="_blank" rel="noopener noreferrer">
          <span>Descargar CV</span>
          <span class="sm-cv-arrow" aria-hidden="true">↓</span>
        </a>

        <div class="sm-socials">
          <h3 class="sm-socials-title">Sígueme</h3>
          <ul class="sm-socials-list" role="list">
            ${socials.map((s) => `
              <li class="sm-socials-item">
                <a class="sm-socials-link" href="${s.link}"
                   ${s.link.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener noreferrer"'}>
                  ${s.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </aside>
  `;

  return wrapper;
}
