import { isotipoSVG } from './Logo.js';

/**
 * Cabecera mínima: isotipo y botón de menú.
 *
 * La navegación y la descarga del CV viven ahora dentro del panel del
 * staggered menu (ver Menu.js), así que aquí solo queda la marca y el toggle.
 */
export function createHeader() {
  const header = document.createElement('header');
  header.className = 'header';
  header.setAttribute('role', 'banner');

  header.innerHTML = `
    <div class="header-inner">
      <a href="#hero" class="header-logo" aria-label="Ir al inicio">${isotipoSVG({ size: 36 })}</a>
      <button class="header-menu-btn sm-toggle" type="button"
              aria-label="Abrir menú" aria-expanded="false"
              aria-controls="staggered-menu-panel">
        <span class="sm-toggle-textWrap" aria-hidden="true">
          <span class="sm-toggle-textInner">
            <span class="sm-toggle-line">Menú</span>
          </span>
        </span>
        <span class="sm-icon" aria-hidden="true">
          <span class="sm-icon-line"></span>
          <span class="sm-icon-line sm-icon-line-v"></span>
        </span>
      </button>
    </div>
  `;

  return header;
}
