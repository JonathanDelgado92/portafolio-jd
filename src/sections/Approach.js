export function createApproach() {
  const section = document.createElement('section');
  section.className = 'approach';
  section.id = 'approach';

  const steps = [
    {
      number: '01',
      title: 'ENTENDER',
      subtitle: 'Estrategia y contexto',
      description: 'Antes de diseñar, identifico el problema, la audiencia, los objetivos y el entorno donde la comunicación debe funcionar.',
    },
    {
      number: '02',
      title: 'CONSTRUIR',
      subtitle: 'Dirección visual y sistema',
      description: 'Transformo conceptos en identidades, sistemas gráficos y experiencias visuales coherentes.',
    },
    {
      number: '03',
      title: 'ACTIVAR',
      subtitle: 'Digital, contenido y evolución',
      description: 'Adapto el sistema a web, redes, contenido, multimedia y nuevas herramientas para que pueda crecer y mantenerse consistente.',
    },
  ];

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-label">Enfoque</span>
        <h2>Mi Proceso</h2>
      </div>
      <div class="approach-grid">
        ${steps.map((step, i) => `
          <div class="t-tilt approach-tilt" data-index="${i}">
            <div class="approach-panel t-tilt-card">
              <div class="approach-panel-content">
                <span class="approach-step-number scroll-reveal">${step.number}</span>
                <div class="approach-step-text">
                  <h3 class="approach-step-title hover-cascade">${step.title}</h3>
                  <p class="approach-step-subtitle scroll-reveal">${step.subtitle}</p>
                  <p class="approach-step-description scroll-reveal">${step.description}</p>
                </div>
              </div>
              <div class="t-tilt-glare"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return section;
}
