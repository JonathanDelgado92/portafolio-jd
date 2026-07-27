import { siteConfig } from '../data/siteConfig.js';
import { isotipoSVG } from './Logo.js';

export function createPreloader() {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.setAttribute('role', 'status');
  preloader.setAttribute('aria-label', 'Cargando');

  preloader.innerHTML = `
    <div class="preloader-bg"></div>
    <div class="preloader-content">
      <div class="preloader-logo">
        ${isotipoSVG({ size: 96, className: 'preloader-isotipo' })}
      </div>
      <div class="preloader-bar-wrapper">
        <div class="preloader-bar"></div>
      </div>
      <div class="preloader-percentage">
        <span class="preloader-num">0</span>%
      </div>
    </div>
  `;

  return preloader;
}
