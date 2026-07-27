import { siteConfig } from '../data/siteConfig.js';

export function createContact() {
  const section = document.createElement('section');
  section.className = 'contact';
  section.id = 'contact';

  const bgCanvas = document.createElement('canvas');
  bgCanvas.className = 'contact-liquid';
  bgCanvas.setAttribute('aria-hidden', 'true');
  section.appendChild(bgCanvas);

  const gradient = document.createElement('div');
  gradient.className = 'contact-gradient';
  section.appendChild(gradient);

  const overlay = document.createElement('div');
  overlay.className = 'contact-overlay';
  section.appendChild(overlay);

  const inner = document.createElement('div');
  inner.className = 'contact-inner';
  inner.innerHTML = `
    <div class="contact-header">
      <span class="section-label scroll-reveal">Contacto</span>
    </div>

    <div class="contact-main">
      <h2 class="contact-headline">
        <span>¿TIENES UN</span>
        <span>PROYECTO</span>
        <span>EN MENTE?</span>
      </h2>
      <p class="contact-subheadline scroll-reveal">HABLEMOS.</p>
    </div>

    <div class="contact-body container">
      <p class="contact-description scroll-reveal">Branding, dirección visual, diseño web, contenido multimedia o nuevas ideas donde diseño y tecnología puedan encontrarse.</p>

      <a
        href="https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Hola, vi tu portafolio y me gustaría conversar contigo sobre un proyecto.')}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Iniciar una conversación por WhatsApp"
        class="contact-cta contact-whatsapp-btn"
      >
        <svg class="contact-whatsapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 2.046.611 3.95 1.663 5.548L2.27 21.73l4.182-1.393A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.16 8.16 0 01-4.168-1.152l-.298-.178-2.482.828.828-2.482-.178-.298A8.165 8.165 0 013.818 12c0-4.509 3.673-8.182 8.182-8.182S20.182 7.491 20.182 12 16.509 20.182 12 20.182zm3.13-5.276c-.17-.086-1.002-.494-1.158-.55-.156-.056-.27-.086-.384.086-.114.17-.442.55-.543.664-.101.113-.202.126-.37.042-.17-.086-.714-.262-1.36-.838-.5-.45-.839-.997-.937-1.165-.1-.168-.011-.26.075-.345.077-.076.17-.2.256-.3.086-.1.114-.17.17-.284.056-.114.029-.212-.015-.298-.043-.086-.384-.926-.527-1.27-.138-.333-.278-.288-.384-.294-.1-.006-.213-.007-.327-.007-.113 0-.3.043-.457.212-.157.17-.6.586-.6 1.43 0 .843.615 1.66.702 1.774.087.114 1.203 1.857 2.936 2.53.41.16.73.255.98.326.41.118.782.101 1.076.062.327-.044 1.002-.41 1.143-.806.14-.396.14-.735.098-.806-.043-.07-.156-.114-.326-.2z" fill="currentColor"/>
        </svg>
        <span class="btn-label">INICIAR CONVERSACIÓN →</span>
      </a>

      <div class="t-tilt">
        <div class="t-tilt-card contact-card-floating">
          <div class="contact-details">
            <div class="contact-detail">
              <span class="contact-detail-label scroll-reveal">Nombre</span>
              <span class="contact-detail-value">${siteConfig.name}</span>
            </div>
            <div class="contact-detail">
              <span class="contact-detail-label scroll-reveal">Ubicación</span>
              <span class="contact-detail-value">${siteConfig.location}</span>
            </div>
            <div class="contact-detail">
              <span class="contact-detail-label scroll-reveal">Email</span>
              <a href="mailto:${siteConfig.email}" class="contact-detail-value">${siteConfig.email}</a>
            </div>
            <div class="contact-detail">
              <span class="contact-detail-label scroll-reveal">Behance</span>
              <a href="${siteConfig.social.behance}" target="_blank" rel="noopener noreferrer" class="contact-detail-value">@javiercoello</a>
            </div>
            <div class="contact-detail">
              <span class="contact-detail-label scroll-reveal">LinkedIn</span>
              <a href="${siteConfig.social.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-detail-value">@jonathandelgado</a>
            </div>
          </div>
          <a href="${siteConfig.cvUrl}" download class="btn fx-26 contact-cv-btn">
            <span class="btn-label">Descargar CV ↓</span>
          </a>
          <div class="t-tilt-glare"></div>
        </div>
      </div>
    </div>
  `;

  section.appendChild(inner);
  return section;
}