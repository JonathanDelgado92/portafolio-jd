import { siteConfig } from '../data/siteConfig.js';

export function createAbout() {
  const section = document.createElement('section');
  section.className = 'about';
  section.id = 'about';
  section.setAttribute('aria-label', 'Sobre mí');

  section.innerHTML = `
    <div class="container">
      <div class="about-grid">
        <div class="about-text-col">
          <span class="section-label scroll-reveal">Sobre Mí</span>
          <div class="about-text-content">
            ${siteConfig.aboutText.split('\n\n').map(p => `<p class="body-large scroll-reveal">${p.trim()}</p>`).join('')}
          </div>
          <blockquote class="about-highlight">
            <span class="about-quote-mark">"</span>
            <p class="scroll-reveal">${siteConfig.aboutHighlight}</p>
          </blockquote>
          <a href="${siteConfig.cvUrl}" download class="btn fx-26 about-cv-btn"
             aria-label="Descargar la hoja de vida de Jonathan Delgado en PDF">
            <span class="btn-label">Descargar CV ↓</span>
          </a>
        </div>
        <div class="about-image-col">
          <figure class="about-image-wrapper tilted-card-figure">
            <div class="tilted-card-inner">
              <div class="about-image-mask">
                <img
                  src="/assets/img/placeholders/placeholder-3x4.svg"
                  data-src="/assets/img/about/about-profile.webp"
                  alt="Jonathan Delgado"
                  class="about-image"
                  loading="lazy"
                />
              </div>
              <div class="tilted-card-overlay">
                <span>${siteConfig.name}</span>
              </div>
            </div>
            <div class="about-image-frame"></div>
            <figcaption class="tilted-card-caption">${siteConfig.name}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  `;

  return section;
}
