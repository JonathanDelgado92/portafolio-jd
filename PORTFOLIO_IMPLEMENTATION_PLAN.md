# PLAN DE IMPLEMENTACIÓN — PORTAFOLIO JONATHAN DELGADO

> Diseñador Gráfico & Multimedia · Dirección Visual · Diseño Web · IA Aplicada

---

## ÍNDICE

1. [Auditoría del proyecto local](#1-auditoría-del-proyecto-local)
2. [Auditoría de la referencia (Azurio)](#2-auditoría-de-la-referencia-azurio)
3. [Propuesta de arquitectura tecnológica](#3-propuesta-de-arquitectura-tecnológica)
4. [Estructura de archivos](#4-estructura-de-archivos)
5. [Mapa de secciones y contenido](#5-mapa-de-secciones-y-contenido)
6. [Sistema visual](#6-sistema-visual)
7. [Estrategia de animaciones](#7-estrategia-de-animaciones)
8. [Dependencias recomendadas](#8-dependencias-recomendadas)
9. [Lista de assets necesarios](#9-lista-de-assets-necesarios)
10. [Arquitectura de datos](#10-arquitectura-de-datos)
11. [Responsive](#11-responsive)
12. [SEO](#12-seo)
13. [Accesibilidad](#13-accesibilidad)
14. [Rendimiento](#14-rendimiento)
15. [Riesgos técnicos](#15-riesgos-técnicos)
16. [Plan de implementación por fases](#16-plan-de-implementación-por-fases)
17. [ASSET_REPLACEMENT_GUIDE](#17-asset-replacement-guide)

---

## 1. AUDITORÍA DEL PROYECTO LOCAL

### Estado actual

| Elemento | Estado |
|---|---|
| Directorio raíz | `PORTAFOLIO WEB/` |
| Contenido existente | Solo `CV/HOJA DE VIDA_2026_ED.pdf` |
| Framework/Librerías | Ninguno |
| Archivos de configuración | Ninguno |
| Control de versiones | No es repo git |
| Contenido previo | No existe |

### Conclusión

**Proyecto greenfield.** Se construye desde cero. No hay riesgo de romper funcionalidades existentes. Libertad total para elegir stack y estructura.

---

## 2. AUDITORÍA DE LA REFERENCIA (AZURIO)

### URL analizada

`https://mixdesign.dev/themeforest/azurio/index-personal-portfolio.html`

### Estructura de secciones (Azurio Personal Portfolio)

| # | Sección | Descripción |
|---|---|---|
| 0 | Preloader | Logo + barra de progreso numérica |
| 1 | Hero | Nombre, título, descripción, CTA, scroll indicator, redes |
| 2 | Featured Works | Sticky sections con imágenes parallax, hover cinematic |
| 3 | About | Texto editorial + métricas (40+ clients, 86%, 3+ years, 50+ projects) |
| 4 | Approach | 3 steps: Strategy / Design / Development con imágenes divididas |
| 5 | Expertise | Sticky cards fullscreen con imágenes de fondo |
| 6 | Resume | Timeline con íconos, experiencia y educación |
| 7 | Toolbox | Logos de herramientas en grid/marquee |
| 8 | Blog | Grid de artículos |
| 9 | Contact CTA | Cierre visual con palabras flotantes + CTA |
| 10 | Footer | Navegación, contacto, copyright |

### Patrones de interacción detectados

- **Preloader**: pantalla completa con logo animado + porcentaje
- **Menú**: fullscreen con overlay, items numerados (01 HOME, 02 WORKS...)
- **Hero**: text reveal escalonado, scroll indicator animado
- **Works**: sticky positioning con parallax de imágenes, hover con cambio de imagen
- **Approach**: scroll-triggered step reveal con imágenes de fondo que cambian
- **Expertise**: cards que se vuelven sticky al hacer scroll
- **Resume**: timeline vertical con íconos
- **Toolbox**: marquee horizontal de logos
- **Transiciones**: no se detectaron transiciones de página (template multi-archivo)
- **Cursor**: custom cursor en desktop

### Fortalezas de Azurio a tomar como referencia

- Ritmo visual entre secciones
- Uso de imágenes grandes como protagonistas
- Jerarquía tipográfica clara
- Sticky sections bien implementadas
- Hover cinematográfico en proyectos
- Transiciones suaves entre estados

### Debilidades / Lo que evitaremos

- Exceso de dependencias
- Código duplicado entre páginas
- Estructura plana de archivos
- Sin sistema de componentes
- Contenido hardcodeado en HTML

---

## 3. PROPUESTA DE ARQUITECTURA TECNOLÓGICA

### Stack elegido

| Capa | Tecnología | Justificación |
|---|---|---|
| Build tool | **Vite** | Rapidez, HMR, build optimizado, ideal para sitio estático |
| Lenguaje | **Vanilla JS (ES Modules)** | Sin overhead de framework, control total sobre animaciones |
| Animación | **GSAP + ScrollTrigger + Lenis** | Estándar de la industria para animación web premium |
| CSS | **CSS puro + Custom Properties** | Sin dependencias, máximo control |
| HTML | **HTML semántico** | SEO, accesibilidad, rendimiento |
| Fuentes | **Google Fonts** (preload crítico) | Typography protagonista |
| Íconos | **SVG inline** | Sin carga adicional |

### Por qué NO usar React/Next.js para este proyecto

- El portafolio es un sitio mayormente estático con animaciones complejas
- GSAP es más natural y potente en vanilla JS
- Menos bundle size
- Mayor control sobre el timeline de animación
- Despliegue más simple (GitHub Pages, Netlify, Vercel static)

### Estructura de build con Vite

- Entrada múltiple: `index.html` (home) + `campus-grupal.html` (proyecto individual)
- Bundling optimizado con code splitting automático
- CSS minificado + autoprefixer vía PostCSS

---

## 4. ESTRUCTURA DE ARCHIVOS

```
/
├── index.html                          # Página principal
├── campus-grupal.html                  # Página individual de proyecto (modelo)
├── package.json
├── vite.config.js
├── postcss.config.js
├── PORTFOLIO_IMPLEMENTATION_PLAN.md    # Este archivo
├── ASSET_REPLACEMENT_GUIDE.md          # Guía para reemplazar assets
│
├── src/
│   ├── main.js                         # Entry point principal
│   ├── router.js                       # Transiciones entre páginas
│   │
│   ├── components/                     # Componentes reutilizables
│   │   ├── Header.js
│   │   ├── Menu.js
│   │   ├── Footer.js
│   │   ├── Preloader.js
│   │   ├── CustomCursor.js
│   │   ├── ScrollProgress.js
│   │   └── MagneticButton.js
│   │
│   ├── sections/                       # Secciones del home
│   │   ├── Hero.js
│   │   ├── SelectedWork.js
│   │   ├── About.js
│   │   ├── Metrics.js
│   │   ├── Approach.js
│   │   ├── Expertise.js
│   │   ├── Experience.js
│   │   ├── Education.js
│   │   ├── Toolbox.js
│   │   └── Contact.js
│   │
│   ├── animations/                     # Módulos de animación
│   │   ├── textReveal.js
│   │   ├── parallax.js
│   │   ├── scrollReveal.js
│   │   ├── imageReveal.js
│   │   ├── counter.js
│   │   ├── marquee.js
│   │   ├── splitText.js
│   │   └── pageTransition.js
│   │
│   ├── data/                           # Datos centralizados
│   │   ├── projects.js
│   │   ├── experience.js
│   │   ├── education.js
│   │   ├── skills.js
│   │   ├── social.js
│   │   └── siteConfig.js
│   │
│   ├── utils/                          # Utilidades
│   │   ├── dom.js
│   │   ├── responsive.js
│   │   ├── reducedMotion.js
│   │   └── loader.js
│   │
│   └── styles/                         # Estilos
│       ├── reset.css
│       ├── variables.css
│       ├── typography.css
│       ├── grid.css
│       ├── animations.css
│       ├── components.css
│       ├── sections.css
│       └── responsive.css
│
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   │
│   └── assets/
│       ├── images/
│       │   ├── profile/
│       │   │   └── hero-profile.webp
│       │   │
│       │   ├── projects/
│       │   │   ├── campus-grupal/
│       │   │   │   ├── cover.webp
│       │   │   │   ├── gallery-01.webp
│       │   │   │   └── gallery-02.webp
│       │   │   ├── sencia/
│       │   │   │   └── cover.webp
│       │   │   ├── uisek/
│       │   │   │   └── cover.webp
│       │   │   ├── baukra/
│       │   │   │   └── cover.webp
│       │   │   ├── infamous/
│       │   │   │   └── cover.webp
│       │   │   └── visual-stories/
│       │   │       └── cover.webp
│       │   │
│       │   ├── about/
│       │   │   └── about-profile.webp
│       │   │
│       │   ├── expertise/
│       │   │   ├── identity.webp
│       │   │   ├── web.webp
│       │   │   └── multimedia.webp
│       │   │
│       │   ├── approach/
│       │   │   ├── entender.webp
│       │   │   ├── construir.webp
│       │   │   └── activar.webp
│       │   │
│       │   └── placeholders/
│       │       ├── placeholder-16x9.webp
│       │       └── placeholder-4x3.webp
│       │
│       ├── icons/
│       │   └── (SVGs de skills y sociales)
│       │
│       └── videos/
│           └── (opcional, para hero)
```

---

## 5. MAPA DE SECCIONES Y CONTENIDO

### Página Principal (`index.html`)

| Orden | Sección | ID | Tipo de contenido |
|---|---|---|---|
| 0 | Preloader | — | Logo + barra de progreso (0-100%) |
| 1 | Header | — | Logo "JD" + nav links + menú hamburguesa |
| 2 | Hero | `hero` | Nombre, título, descripción, CTA, scroll indicator, red social, locación |
| 3 | Selected Work | `work` | 6 proyectos con thumbnail + hover cinematic |
| 4 | About | `about` | Texto editorial + imagen asimétrica |
| 5 | Metrics | — | 3 métricas animadas al entrar |
| 6 | My Approach | `approach` | 3 pasos con scroll storytelling (sticky) |
| 7 | Expertise | `expertise` | 3 áreas fullscreen con sticky |
| 8 | Experience | `experience` | Timeline de experiencia profesional |
| 9 | Education | — | Formación académica |
| 10 | Toolbox | `toolbox` | Skills visuales con marquee |
| 11 | Contact | `contact` | CTA final + datos de contacto + CV |
| 12 | Footer | — | Nav + redes + copyright |

### Página Individual Modelo (`campus-grupal.html`)

| Orden | Sección |
|---|---|
| 0 | Page Transition (entrada) |
| 1 | Project Hero |
| 2 | Overview |
| 3 | Challenge & Solution |
| 4 | Gallery |
| 5 | Result |
| 6 | Next Project |
| 7 | Footer |

---

## 6. SISTEMA VISUAL

### Paleta de color

```css
--color-black: #0a0a0a;
--color-carbon: #1a1a1a;
--color-dark: #2a2a2a;
--color-gray-800: #3a3a3a;
--color-gray-600: #6b6b6b;
--color-gray-400: #9a9a9a;
--color-gray-200: #d0d0d0;
--color-gray-100: #e8e8e8;
--color-white: #fafafa;
--color-accent: #c9a84c;   /* Dorado sutil - único acento */
--color-accent-dim: rgba(201, 168, 76, 0.15);
```

### Tipografía

```css
--font-primary: 'Instrument Serif', Georgia, serif;
/* Uso: títulos grandes, hero, display */

--font-secondary: 'Inter', -apple-system, sans-serif;
/* Uso: cuerpo, navegación, metadata */
```

- **Hero name**: `Instrument Serif`, 7–10vw, italic opcional
- **Títulos de sección**: `Instrument Serif`, 4–6vw
- **Cuerpo**: `Inter`, 16–20px, peso 300–400
- **Nav/Meta**: `Inter`, 12–14px, uppercase, tracking amplio

### Grid system

- **Base**: CSS Grid de 12 columnas
- **Full-width sections**: contenido en container de 1440px max-width
- **Hero**: fullscreen sin restricciones de container
- **Proyectos**: layout asimétrico, imágenes que rompen el grid
- **Typography scale**: `clamp()` para fluidez

### Elementos de diseño clave

- Líneas divisorias finas (1px) como elemento editorial
- Números grandes (01, 02, 03) como elementos decorativos
- Espacio blanco generoso entre secciones (120–200px)
- Imágenes sin bordes redondeados excesivos (max 4px si acaso)
- Sin sombras exageradas
- Sin degradados tecnológicos

---

## 7. ESTRATEGIA DE ANIMACIONES

### Principios rectores

1. **Jerarquía**: Hero > Projects > Approach > Expertise > Resto
2. **Intención**: cada animación debe tener un propósito narrativo
3. **Ritmo**: alternar momentos de alto impacto con momentos de calma
4. **Rendimiento**: preferir `transform` y `opacity`, evitar `top/left/width/height`

### Mapa de animaciones por sección

| Sección | Tipo de animación | Complejidad |
|---|---|---|
| **Preloader** | Logo reveal + barra de progreso animada. Transición de salida con scale + blur | Media |
| **Hero** | **Cinematográfica**: 1) Preloader → fondo negro. 2) "JONATHAN" letter-by-letter. 3) "DELGADO" slide up. 4) Foto reveal con clip-path. 5) Subtítulo fade. 6) CTA con stagger. 7) Scroll indicator bounce | Alta |
| **Header** | Aparece después del hero. Cambia de transparente a sólido con scroll. Links con hover subrayado | Baja |
| **Menú** | Fullscreen overlay. Items con stagger + número. Social links. Transición suave open/close | Media |
| **Selected Work** | Imágenes con scale reveal al entrar. Hover: cambio de imagen + overlay + "VIEW PROJECT" cursor. Sticky parallax en scroll | Alta |
| **About** | Scroll reveal de texto. Imagen con clip-path reveal. Composición asimétrica | Media |
| **Metrics** | Contador numérico animado al entrar en viewport | Baja |
| **Approach** | **Scroll storytelling**: Sticky container. Paso 1 aparece → scroll → se desplaza a la izquierda → entra paso 2 → scroll → paso 3. Imágenes de fondo cambian. Texto reveal | Alta |
| **Expertise** | Sticky cards fullscreen. Imagen de fondo se escala. Números grandes. Hover cambia imagen. Transición suave entre cards | Alta |
| **Experience** | Timeline vertical. Items aparecen con stagger al hacer scroll | Media |
| **Education** | Clean reveal, más sobrio que Experience | Baja |
| **Toolbox** | Marquee horizontal continuo + hover pausa | Media |
| **Contact** | Título grande con text reveal. Botón magnético. Información con stagger | Media |
| **Footer** | Simple fade in | Baja |
| **Page Transition** | Overlay que cubre pantalla → nuevo contenido reveal | Alta |

### Tipos de animaciones generales

- **Text reveal**: caracteres/palabras/líneas con `clip-path` + `translateY`
- **Scroll reveal**: wrapper con `opacity: 0` + `translateY(40px)` → trigger
- **Parallax**: imágenes con `translateY` más lento que el scroll
- **Image reveal**: `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`
- **Counter**: animación numérica con `requestAnimationFrame` o GSAP
- **Marquee**: bucle continuo con CSS o GSAP

### Lenis (Smooth Scroll)

- Usar Lenis para smooth scrolling en desktop
- Integrar ScrollTrigger con `scroller` de Lenis
- En mobile: desactivar o limitar a scroll suave ligero

### Reduced Motion

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReduced.matches) {
  // Animar
} else {
  // Mostrar todo visible sin animación
}
```

---

## 8. DEPENDENCIAS RECOMENDADAS

### Producción

| Dependencia | Versión | Razón |
|---|---|---|
| `gsap` | ^3.12 | Motor de animación principal |
| `lenis` | ^1.1 | Smooth scrolling |

### Desarrollo

| Dependencia | Razón |
|---|---|
| `vite` | Build tool |
| `postcss` | Procesamiento CSS |
| `autoprefixer` | Compatibilidad navegadores |

### CDN vs NPM

- **GSAP + ScrollTrigger**: NPM (bundled con Vite) → mejor tree-shaking
- **Alternativa**: CDN para GSAP (carga más rápida al estar cacheado)
- **Decisión**: Usar NPM para control de versiones y bundle optimizado

### Bundle size estimado

| Librería | Tamaño (gzip) |
|---|---|
| GSAP + ScrollTrigger | ~25KB |
| Lenis | ~8KB |
| Total JS | ~35–40KB |
| Total CSS | ~10–15KB |

---

## 9. LISTA DE ASSETS NECESARIOS

### Imágenes placeholder (para prototipo)

| Asset | Tamaño | Formato | Proporción |
|---|---|---|---|
| Hero profile | 1600×2000 | WebP | 4:5 |
| About profile | 1200×1600 | WebP | 3:4 |
| Campus Grupal cover | 1600×1200 | WebP | 4:3 |
| Sencia cover | 1600×1200 | WebP | 4:3 |
| UISEK cover | 1600×1200 | WebP | 4:3 |
| Baukra cover | 1600×1200 | WebP | 4:3 |
| Infamous cover | 1600×1200 | WebP | 4:3 |
| Visual Stories cover | 1600×1200 | WebP | 4:3 |
| Entender (approach) | 1200×1600 | WebP | 3:4 |
| Construir (approach) | 1200×1600 | WebP | 3:4 |
| Activar (approach) | 1200×1600 | WebP | 3:4 |
| Identity expertise | 1920×1080 | WebP | 16:9 |
| Web expertise | 1920×1080 | WebP | 16:9 |
| Multimedia expertise | 1920×1080 | WebP | 16:9 |
| Campus gallery 01 | 1920×1280 | WebP | 3:2 |
| Campus gallery 02 | 1920×1280 | WebP | 3:2 |
| Favicon | 32×32 | PNG/ICO | 1:1 |
| OG Image | 1200×630 | PNG | 1.9:1 |

### Assets de proveedor (placeholder generados)

Para fase de prototipo, usaré **imágenes generadas con IA o placeholders abstractos** tipo:
- Gradientes sutiles con texturas
- Composiciones geométricas
- Mockups neutros

Todo reemplazable por el archivo `ASSET_REPLACEMENT_GUIDE.md`.

### Iconos SVG necesarios

- Behance
- LinkedIn
- Download (CV)
- Arrow right
- Arrow up
- Menu hamburger
- Close
- External link
- Location pin

---

## 10. ARQUITECTURA DE DATOS

### Centralización

Todos los datos editables vivirán en `src/data/`.

#### `siteConfig.js`

```js
export const siteConfig = {
  name: 'Jonathan Delgado',
  title: 'Diseñador Gráfico & Multimedia',
  subtitle: 'Dirección Visual · Diseño Web · IA Aplicada',
  tagline: 'Creo identidades, experiencias digitales y sistemas visuales...',
  location: 'Quito, Ecuador',
  availability: 'Disponible para proyectos freelance y oportunidades profesionales.',
  email: 'jonathan.delgadocoello@gmail.com',
  cvUrl: '/CV/HOJA DE VIDA_2026_ED.pdf',
  social: {
    behance: 'https://www.behance.net/javiercoello',
    linkedin: '#', // editable
  }
};
```

#### `projects.js`

```js
export const projectsData = [
  {
    id: 'campus-grupal',
    number: '01',
    title: 'Campus Grupal',
    categories: ['Rebranding', 'Identidad Visual', 'Diseño Web', 'Sistema Visual'],
    year: '2024',
    cover: '/assets/images/projects/campus-grupal/cover.webp',
    gallery: ['gallery-01.webp', 'gallery-02.webp'],
    url: '/campus-grupal.html',
    description: '...',
    challenge: '...',
    solution: '...',
  },
  // ... más proyectos
];
```

#### `experience.js`, `education.js`, `skills.js`

De manera similar, datos estructurados exportables.

---

## 11. RESPONSIVE

### Breakpoints

```css
--bp-desktop: 1440px;
--bp-laptop: 1280px;
--bp-tablet: 1024px;
--bp-mobile: 768px;
--bp-small: 480px;
```

### Estrategia

- **Desktop (1440+)**: Experiencia completa con todas las animaciones. Layout de 12 columnas.
- **Laptop (1280–1440)**: Ajustes menores de espaciado y tipografía.
- **Tablet (768–1024)**: 
  - Grid reduce a 8 columnas
  - Sticky sections → scroll normal
  - Parallax reducido
  - Menú fullscreen adaptado
  - Proyectos: grid más simple
- **Mobile (320–767)**:
  - Grid de 4 columnas
  - Hero no fullscreen (menos espacio vertical)
  - Tipografía responsive con clamp()
  - Animaciones de alto impacto reducidas
  - Sin custom cursor
  - Sin parallax pesado
  - Sin scroll horizontal
  - Lenis desactivado
  - Navegación simplificada

### Tipografía responsive

```css
--text-hero: clamp(2.5rem, 10vw, 8rem);
--text-section-title: clamp(2rem, 5vw, 4rem);
--text-body: clamp(0.875rem, 1.2vw, 1.125rem);
--text-meta: clamp(0.75rem, 1vw, 0.875rem);
```

---

## 12. SEO

### HTML semántico

```html
<html lang="es">
<head>
  <title>Jonathan Delgado | Diseñador Gráfico y Multimedia | Branding, Web e IA</title>
  <meta name="description" content="Portafolio de Jonathan Delgado, diseñador gráfico y multimedia especializado en identidad visual, dirección creativa, diseño web, contenido digital e inteligencia artificial aplicada.">
  <link rel="canonical" href="https://jdelgado.pro">
</head>
<body>
  <header role="banner">...</header>
  <main>
    <section id="hero"><h1>Jonathan Delgado</h1></section>
    <section id="work"><h2>Selected Work</h2></section>
    ...
  </main>
</body>
```

### Open Graph / Twitter

```html
<meta property="og:title" content="Jonathan Delgado | Diseñador Gráfico y Multimedia">
<meta property="og:description" content="Portafolio profesional de diseño gráfico, branding, web e IA.">
<meta property="og:image" content="https://jdelgado.pro/og-image.webp">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### Schema.org

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jonathan Delgado",
  "jobTitle": "Diseñador Gráfico & Multimedia",
  "url": "https://jdelgado.pro",
  "sameAs": ["https://www.behance.net/javiercoello"],
  "knowsAbout": ["Branding", "Web Design", "Motion Graphics", "AI"]
}
</script>
```

### Archivos

- `robots.txt`: permitir todo, apuntar a sitemap
- `sitemap.xml`: listar home + proyectos

---

## 13. ACCESIBILIDAD

### Implementaciones obligatorias

- `prefers-reduced-motion`: desactivar animaciones pesadas, mostrar contenido directamente
- Navegación por teclado: `Tab`, `Enter`, `Escape` en menú
- `focus-visible`: estilos de foco visibles solo en navegación por teclado
- Contraste WCAG AA mínimo (4.5:1 texto normal, 3:1 texto grande)
- `alt` descriptivos en todas las imágenes
- Atributos `aria-label` en botones sin texto
- `role` semántico donde sea necesario
- Skip to content link

### Reduced motion específico

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .parallax { transform: none !important; }
  .scroll-reveal { opacity: 1 !important; transform: none !important; }
  [data-lenis] { scroll-behavior: auto !important; }
}
```

---

## 14. RENDIMIENTO

### Objetivos

| Métrica | Objetivo |
|---|---|
| Lighthouse Performance | ≥ 90 |
| FCP | ≤ 1.5s |
| LCP | ≤ 2.5s |
| CLS | ≤ 0.1 |
| TBT | ≤ 200ms |
| Bundle JS | ≤ 50KB gzip |

### Estrategias

- **Imágenes**: WebP, lazy loading nativo + `loading="lazy"`, `srcset` para densidades
- **Fuentes**: `font-display: swap`, preload de la fuente crítica
- **JS**: módulos ES con `type="module"`, carga diferida de secciones no visibles
- **CSS**: evitar `@import`, usar una sola hoja de estilo
- **Animaciones**: basadas en `transform` y `opacity` (compositor-friendly)
- **GSAP**: `will-change` automático, limpiar `onComplete`
- **Preload crítico**: hero image, fuente primaria

### Estrategia de carga de imágenes

```html
<img
  src="/assets/images/projects/campus-grupal/cover.webp"
  srcset="
    /assets/images/projects/campus-grupal/cover-800.webp 800w,
    /assets/images/projects/campus-grupal/cover-1200.webp 1200w,
    /assets/images/projects/campus-grupal/cover-1600.webp 1600w
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Campus Grupal - Rebranding e Identidad Visual"
  loading="lazy"
>
```

---

## 15. RIESGOS TÉCNICOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| GSAP + Lenis conflicto | Baja | Medio | Configurar correctamente `scroller` en ScrollTrigger |
| Rendimiento en mobile | Media | Alto | Desactivar Lenis en móvil, reducir animaciones |
| Imágenes placeholder poco atractivas | Media | Medio | Usar placeholders abstractos elegantes |
| Scroll storytelling muy pesado | Media | Alto | Simplificar en mobile, testear en dispositivos reales |
| Transiciones de página complejas | Alta | Medio | Empezar con transición simple, iterar |
| Dependencias de CDN caídas | Baja | Alto | Bundear con Vite (no CDN) |
| CLS por imágenes sin dimensiones | Baja | Alto | Siempre especificar width/height o aspect-ratio |
| Overflow horizontal en mobile | Media | Medio | Testing exhaustivo, `overflow-x: hidden` en body |
| Consumo de memoria por animaciones | Media | Medio | GSAP `kill()` en secciones fuera de viewport |

---

## 16. PLAN DE IMPLEMENTACIÓN POR FASES

### FASE 1 — Análisis y documentación (COMPLETADA)

- [x] Auditar referencia Azurio
- [x] Auditar proyecto local
- [x] Definir arquitectura tecnológica
- [x] Crear este plan
- [x] Crear ASSET_REPLACEMENT_GUIDE.md

### FASE 2 — Sistema global + Hero

- [ ] Inicializar proyecto con `npm create vite@latest`
- [ ] Instalar dependencias: `gsap`, `lenis`
- [ ] Crear estructura de directorios
- [ ] Implementar CSS reset + variables + tipografía
- [ ] Implementar Header (logo + nav + hamburguesa)
- [ ] Implementar Menú fullscreen con animación
- [ ] Implementar Preloader con barra de progreso
- [ ] Implementar Hero con animación cinematográfica:
  - Text reveal de "JONATHAN DELGADO"
  - Imagen con clip-path reveal
  - Subtítulo + CTA + scroll indicator
- [ ] Implementar Footer
- [ ] Custom cursor (desktop)
- [ ] Scroll progress indicator
- [ ] **PROBAR**: testing manual en desktop

### FASE 3 — Selected Work

- [ ] Crear `src/data/projects.js` con datos de 6 proyectos
- [ ] Implementar sección Selected Work
- [ ] Sistema de placeholders visuales para proyectos
- [ ] Interacción hover cinematográfica
- [ ] Sticky parallax en scroll
- [ ] Cursor contextual "VIEW PROJECT"
- [ ] **PROBAR**: interacciones, hover, scroll

### FASE 4 — About + Metrics + Approach + Expertise

- [ ] Implementar About con composición editorial asimétrica
- [ ] Implementar Metrics con contadores animados
- [ ] Implementar Approach con scroll storytelling (sticky)
- [ ] Implementar Expertise con sticky cards fullscreen
- [ ] **PROBAR**: scroll triggers, sticky behavior, responsiveness básico

### FASE 5 — Experience + Education + Toolbox + Contact

- [ ] Implementar Experience (timeline)
- [ ] Implementar Education (más sobrio)
- [ ] Implementar Toolbox (marquee)
- [ ] Implementar Contact con botón magnético
- [ ] **PROBAR**: navegación completa entre secciones

### FASE 6 — Página individual + Transiciones

- [ ] Crear página modelo `campus-grupal.html`
- [ ] Implementar Project Hero con transición de entrada
- [ ] Implementar Overview, Challenge, Solution, Gallery, Result
- [ ] Implementar Next Project navigation
- [ ] Implementar page transition (home → proyecto → home)
- [ ] **PROBAR**: flujo completo de navegación

### FASE 7 — Responsive completo

- [ ] Tablet (768–1024): ajustes de layout, reducir animaciones
- [ ] Mobile (320–767): layout simplificado, sin Lenis, sin custom cursor
- [ ] Probar todos los breakpoints
- [ ] Ajustar tipografía con clamp()
- [ ] Probar overflow horizontal
- [ ] **PROBAR**: todos los dispositivos simulados

### FASE 8 — SEO + Accesibilidad + Performance

- [ ] Implementar meta tags, OG, Twitter cards
- [ ] Crear sitemap.xml + robots.txt
- [ ] Implementar schema.org Person + CreativeWork
- [ ] Añadir `prefers-reduced-motion`
- [ ] Verificar contraste
- [ ] Navegación por teclado + focus visible
- [ ] Lighthouse audit (Performance, Accessibility, SEO, Best Practices)
- [ ] Optimizar imágenes (WebP, srcset, lazy loading)
- [ ] Última revisión de consola, errores, links rotos
- [ ] **ENTREGA**: portafolio listo para deploy

---

## 17. ASSET REPLACEMENT GUIDE

(Se creará como archivo separado `ASSET_REPLACEMENT_GUIDE.md` con tablas detalladas de cada asset, su ubicación en el código, tamaño recomendado, formato, y dónde sustituirlo.)

---

## RESUMEN EJECUTIVO PARA EL CLIENTE

**Stack**: Vite + Vanilla JS + GSAP + Lenis  
**Tipo**: Sitio estático, multi-página (home + proyectos individuales)  
**Animación**: Hero cinematográfico, scroll storytelling, sticky sections, parallax  
**Datos**: 100% centralizados en `src/data/` — editar sin tocar HTML  
**Imágenes**: Placeholder → reemplazo por archivo guiado  
**Responsive**: Mobile-first, progressive enhancement  
**Rendimiento**: Objetivo Lighthouse ≥ 90  
**Entrega**: Archivos estáticos listos para deploy en cualquier host  

**Tiempo estimado**: 8 fases secuenciales  
**Complejidad**: Alta (animaciones avanzadas, scroll storytelling, transiciones)  
**Riesgo principal**: Rendimiento en mobile — mitigado con progressive enhancement
