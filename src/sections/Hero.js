import { siteConfig } from '../data/siteConfig.js';

export function createHero() {
  const section = document.createElement('section');
  section.className = 'hero';
  section.id = 'hero';
  section.setAttribute('aria-label', 'Presentación');

  section.innerHTML = `
    <div class="hero-media">
      <div class="hero-image-wrapper">
        <div class="hero-image-mask">
          <picture>
            <source srcset="/assets/img/hero/hero.avif" type="image/avif" />
            <source srcset="/assets/img/hero/hero.webp" type="image/webp" />
            <img
              src="/assets/img/hero/hero.webp"
              alt="Jonathan Delgado — Diseñador Gráfico & Multimedia"
              class="hero-image"
              id="heroImage"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
        </div>
      </div>
    </div>

    <div class="hero-content">
      <div class="hero-text">
        <div class="hero-name-wrapper">
          <h1 class="hero-name" id="heroName">
            <span class="hero-firstname" id="heroFirstName">${siteConfig.firstName}</span>
            <span class="hero-lastname" id="heroLastName">${siteConfig.lastName}</span>
          </h1>
        </div>

        <div class="hero-subtitle-wrapper" id="heroSubtitle">
          <p class="hero-subtitle hover-cascade">${siteConfig.title}</p>
          <p class="hero-tags hover-cascade">${siteConfig.subtitle}</p>
        </div>

        <div class="hero-description-wrapper" id="heroDescription">
          <p class="hero-description scroll-reveal">${siteConfig.tagline}</p>
        </div>

        <div class="hero-cta-wrapper" id="heroCta">
          <div class="hero-ctas">
            <a href="#work" class="btn-primary">
              <span>VER PROYECTOS</span>
              <span class="btn-arrow">→</span>
            </a>
            <a href="#about" class="btn-secondary">
              <span>CONOCE MI PERFIL</span>
            </a>
          </div>
        </div>
      </div>

      <div class="hero-info" id="heroInfo">
        <div class="hero-location">
          <span class="location-dot"></span>
          <span>${siteConfig.location}</span>
        </div>
        <p class="hero-availability">${siteConfig.availability}</p>
        <div class="hero-social">
          <a href="${siteConfig.social.behance}" target="_blank" rel="noopener noreferrer" aria-label="Behance" class="hero-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>
            <span>Behance</span>
          </a>
          <a href="${siteConfig.social.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="hero-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>

    <div class="hero-scroll-indicator" id="scrollIndicator">
      <span class="scroll-label">Scroll to explore</span>
      <span class="scroll-line"></span>
    </div>
  `;

  return section;
}
