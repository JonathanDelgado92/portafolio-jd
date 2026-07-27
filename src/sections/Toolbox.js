import { toolsData } from '../data/tools.js';

export function createToolbox() {
  const section = document.createElement('section');
  section.className = 'toolbox';
  section.id = 'toolbox';

  /* Se calculan desde los datos para que el contador no se quede desfasado al
     añadir o quitar herramientas. */
  const totalTools = toolsData.length;
  const totalAreas = new Set(toolsData.map(t => t.category)).size;

  section.innerHTML = `
    <div class="toolbox-wrapper">
      <div class="toolbox-header">
        <span class="section-label scroll-reveal">07 — Stack creativo</span>
        <h2 class="kinetic-reveal hover-cascade">Herramientas</h2>
        <p class="toolbox-count">
          <span>${totalTools}</span> herramientas
          <span class="toolbox-count-sep" aria-hidden="true">·</span>
          <span>${totalAreas}</span> áreas
        </p>
        <div class="toolbox-header-line"></div>
        <p class="toolbox-intro">Manejo un ecosistema de herramientas que conecta diseño, contenido, tecnología e inteligencia artificial dentro de un mismo flujo creativo.</p>
      </div>
      <div class="toolbox-content">
        <div class="toolbox-info" id="toolbox-info">
          <div class="toolbox-info-inner">
            <span class="toolbox-info-number" id="toolbox-info-number">01</span>
            <span class="toolbox-info-category" id="toolbox-info-category">Diseño e identidad visual</span>
            <h3 class="toolbox-info-title" id="toolbox-info-title">Adobe Photoshop</h3>
            <p class="toolbox-info-desc" id="toolbox-info-desc">Edición, composición y retoque profesional de imágenes para campañas visuales y branding.</p>
            <div class="toolbox-dots" id="toolbox-dots"></div>
          </div>
        </div>
        <div class="toolbox-menu-container" id="toolbox-canvas-wrap">
          <canvas id="infinite-menu-canvas"></canvas>
          <p class="toolbox-hint" id="toolbox-hint">ARRASTRA PARA EXPLORAR</p>
        </div>
      </div>
    </div>
    <div class="toolbox-fallback" role="list" aria-label="Lista de herramientas del toolbox">
      <div class="toolbox-fallback-grid">
        ${toolsData.map(t => `
          <div class="toolbox-fallback-item" role="listitem">
            <img src="${t.image}" alt="${t.title}" width="24" height="24" loading="lazy" />
            <span>${t.title}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return section;
}
