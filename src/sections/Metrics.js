export function createMetrics() {
  const section = document.createElement('section');
  section.className = 'metrics';

  section.innerHTML = `
    <div class="container">
      <div class="metrics-grid">
        <div class="metric-item" data-metric>
          <span class="metric-number" data-target="6">0</span>
          <span class="metric-suffix">+</span>
          <p class="metric-label scroll-reveal">AÑOS DE EXPERIENCIA PROFESIONAL</p>
        </div>
        <div class="metric-item" data-metric>
          <span class="metric-number" data-target="7">0</span>
          <span class="metric-suffix"></span>
          <p class="metric-label scroll-reveal">AÑOS EN COMUNICACIÓN VISUAL INSTITUCIONAL</p>
        </div>
        <div class="metric-item" data-metric>
          <span class="metric-number" data-target="5">0</span>
          <span class="metric-suffix">+</span>
          <p class="metric-label scroll-reveal">DISCIPLINAS CREATIVAS INTEGRADAS</p>
        </div>
      </div>
    </div>
    <div class="metrics-marquee" aria-hidden="true">
      <div class="metrics-marquee__track">
        <div class="metrics-marquee__group">
          <span class="metrics-marquee__item">BRANDING</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">DISEÑO WEB</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">MULTIMEDIA</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">FOTOGRAFÍA</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">IA APLICADA</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">DIRECCIÓN VISUAL</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">DISEÑO UI</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">CONTENIDO DIGITAL</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">IDENTIDAD VISUAL</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">MOTION GRAPHICS</span>
          <span class="metrics-marquee__sep">✦</span>
        </div>
        <div class="metrics-marquee__group" aria-hidden="true">
          <span class="metrics-marquee__item">BRANDING</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">DISEÑO WEB</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">MULTIMEDIA</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">FOTOGRAFÍA</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">IA APLICADA</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">DIRECCIÓN VISUAL</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">DISEÑO UI</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">CONTENIDO DIGITAL</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">IDENTIDAD VISUAL</span>
          <span class="metrics-marquee__sep">✦</span>
          <span class="metrics-marquee__item">MOTION GRAPHICS</span>
          <span class="metrics-marquee__sep">✦</span>
        </div>
      </div>
    </div>
  `;

  return section;
}