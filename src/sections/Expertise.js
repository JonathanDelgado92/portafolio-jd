/**
 * Imágenes del rastro que sigue al cursor en cada panel.
 *
 * Salen de las galerías reales de los proyectos y cada bloque corresponde al
 * tema de su panel. Antes el panel 02 (Diseño Web) mostraba sobre todo piezas
 * de redes sociales —solo una era una web de verdad— y el 03 (Multimedia e IA)
 * mostraba ilustraciones de libros y papelería, que no venían al caso.
 */
const trailImages = [
  // 01 — Identidad & Dirección Visual: logotipos, papelería y aplicaciones de marca.
  [
    '/assets/img/projects/baukra/baukra-visual-systems-studio-09-06.webp',
    '/assets/img/projects/baukra/baukra-visual-systems-studio-11.webp',
    '/assets/img/projects/baukra/baukra-visual-systems-studio-15.webp',
    '/assets/img/projects/baukra/baukra-visual-systems-studio-16.webp',
    '/assets/img/projects/sencia/magnific-1-asset-upload-logo-add-the-provided-sencia-logo-a-71993.webp',
    '/assets/img/projects/sencia/magnific-mockup-hiperrealista-y-profesional-de-dos-tarjetas-71984.webp',
    '/assets/img/projects/sencia/magnific-mockup-hiperrealista-y-profesional-de-un-cuadernoa-71987.webp',
    '/assets/img/projects/campus-grupal/06ceccae-9a84-451d-8705-5167f58c29ea.webp',
  ],
  // 02 — Diseño Web & Experiencias Digitales: pantallas, responsive e interfaz.
  [
    '/assets/img/projects/baukra/baukra-visual-systems-studio-13.webp',
    '/assets/img/projects/baukra/baukra-visual-systems-studio-14.webp',
    '/assets/img/projects/sencia/magnific-mockup-hiperrealista-y-editorial-en-formato-horizo-71995.webp',
    '/assets/img/projects/sencia/magnific-mockup-hiperrealista-y-profesional-de-una-interfaz-71994.webp',
    '/assets/img/projects/campus-grupal/chatgpt-image-3-jun-2026-11-15-07-p-m.webp',
    '/assets/img/projects/campus-grupal/magnific-a-modern-corporate-websit-rl8ayzsxtc.webp',
    '/assets/img/projects/sencia/1.webp',
    '/assets/img/projects/campus-grupal/3.webp',
  ],
  // 03 — Multimedia & IA Aplicada: modelado 3D y composiciones fotográficas.
  [
    '/assets/img/projects/animacion-3d/ilustracion-01.webp',
    '/assets/img/projects/animacion-3d/ilustracion-02.webp',
    '/assets/img/projects/animacion-3d/ilustracion-03.webp',
    '/assets/img/projects/animacion-3d/ilustracion-04.webp',
    '/assets/img/projects/sencia/2.webp',
    '/assets/img/projects/sencia/5.webp',
    '/assets/img/projects/campus-grupal/2.webp',
    '/assets/img/projects/campus-grupal/4.webp',
  ],
];

export function createExpertise() {
  const section = document.createElement('section');
  section.className = 'expertise';
  section.id = 'expertise';

  const panels = [
    {
      number: '01',
      title: 'Identidad &<br>Dirección Visual',
      description: 'Sistemas visuales para que marcas comuniquen con claridad, coherencia y personalidad.',
      skills: ['Branding', 'Rebranding', 'Diseño de logotipos', 'Identidad visual', 'Manuales de marca', 'Dirección de arte', 'Diseño editorial'],
      theme: 'light',
    },
    {
      number: '02',
      title: 'Diseño Web &<br>Experiencias Digitales',
      description: 'Experiencias digitales donde identidad, interacción y funcionalidad son un solo sistema.',
      skills: ['Diseño web', 'Landing pages', 'Diseño UI', 'Diseño responsive', 'Comercio electrónico', 'WordPress', 'Shopify', 'Experiencias digitales'],
      theme: 'dark',
    },
    {
      number: '03',
      title: 'Multimedia &<br>IA Aplicada',
      description: 'Fotografía, video, motion e IA para ampliar las posibilidades de creación visual.',
      skills: ['Fotografía', 'Edición de video', 'Motion graphics', 'Contenido visual', 'IA generativa', 'Diseño de prompts', 'Automatización creativa'],
      theme: 'light',
    },
  ];

  section.innerHTML = `
    <header class="expertise-heading">
      <span class="section-label scroll-reveal">03 — ESPECIALIDADES</span>
      <h2 class="kinetic-reveal hover-cascade" data-stagger="0.06">Áreas de<br>especialización</h2>
      <p class="expertise-heading__desc">Dirección visual, diseño web y experiencias digitales desarrolladas desde una visión estratégica, funcional y coherente.</p>
    </header>
    <div class="expertise-sticky">
      ${panels.map((p, i) => `
        <article class="expertise-panel ${p.theme}" data-index="${i}">
          <div class="expertise-panel-inner">
            <span class="expertise-number">${p.number}</span>
            <h3 class="expertise-title">${p.title}</h3>
            <p class="expertise-desc">${p.description}</p>
            <div class="expertise-skills">
              ${p.skills.map(s => `<span class="expertise-skill">${s}</span>`).join('')}
            </div>
            <span class="expertise-trail">
              ${trailImages[i].map(url => `
                <span class="expertise-trail__img">
                  <span class="expertise-trail__img-inner" style="background-image:url(${url})"></span>
                </span>
              `).join('')}
            </span>
          </div>
        </article>
      `).join('')}
      <div class="expertise-progress" aria-hidden="true">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  `;

  return section;
}
