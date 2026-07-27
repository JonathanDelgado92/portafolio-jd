import { siteConfig } from '../data/siteConfig.js';
import { isotipoSVG } from './Logo.js';

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.setAttribute('role', 'contentinfo');

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#hero" class="footer-logo" aria-label="Ir al inicio">${isotipoSVG({ size: 44 })}</a>
          <p class="footer-tagline">${siteConfig.title}</p>
        </div>
        <button class="footer-back-to-top" aria-label="Volver arriba">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17V5M10 5l-5 5M10 5l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Volver arriba</span>
        </button>
      </div>
      <div class="footer-bottom">
        <p>${siteConfig.copyright}</p>
        <!-- El propio sitio es una pieza del portafolio: conviene decirlo, o
             nadie asume que el diseño web y el desarrollo son suyos. -->
        <p class="footer-credit">${siteConfig.credit}</p>
      </div>
    </div>
  `;

  return footer;
}