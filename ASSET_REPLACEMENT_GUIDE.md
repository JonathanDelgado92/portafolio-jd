# ASSET REPLACEMENT GUIDE

Guía para reemplazar imágenes y assets del portafolio sin modificar código.

---

## CÓMO USAR ESTA GUÍA

1. Prepara tu imagen en el tamaño y formato recomendado
2. Colócala en la ruta indicada
3. Si el nombre del archivo es el mismo, el código la cargará automáticamente
4. Si cambias el nombre, actualiza el valor en `src/data/projects.js`

---

## HERO

| Campo | Valor |
|---|---|
| **Archivo** | `hero-profile.webp` |
| **Ruta** | `public/assets/images/profile/hero-profile.webp` |
| **Tamaño recomendado** | 1600 × 2000 px |
| **Aspect ratio** | 4:5 |
| **Formato** | WebP |
| **Uso** | Hero principal, foto de perfil profesional |
| **Código** | `src/sections/Hero.js` — línea de imagen hero |

---

## ABOUT

| Campo | Valor |
|---|---|
| **Archivo** | `about-profile.webp` |
| **Ruta** | `public/assets/images/about/about-profile.webp` |
| **Tamaño recomendado** | 1200 × 1600 px |
| **Aspect ratio** | 3:4 |
| **Formato** | WebP |
| **Uso** | Sección Sobre Mí, composición asimétrica |

---

## PROYECTOS — PORTADAS

### Campus Grupal

| Campo | Valor |
|---|---|
| **Archivo** | `cover.webp` |
| **Ruta** | `public/assets/images/projects/campus-grupal/cover.webp` |
| **Tamaño recomendado** | 1600 × 1200 px |
| **Aspect ratio** | 4:3 |
| **Formato** | WebP |
| **Galería** | `gallery-01.webp`, `gallery-02.webp` (1920×1280, 3:2) |

### Sencia

| Campo | Valor |
|---|---|
| **Archivo** | `cover.webp` |
| **Ruta** | `public/assets/images/projects/sencia/cover.webp` |
| **Tamaño recomendado** | 1600 × 1200 px |
| **Aspect ratio** | 4:3 |
| **Formato** | WebP |

### UISEK

| Campo | Valor |
|---|---|
| **Archivo** | `cover.webp` |
| **Ruta** | `public/assets/images/projects/uisek/cover.webp` |
| **Tamaño recomendado** | 1600 × 1200 px |
| **Aspect ratio** | 4:3 |
| **Formato** | WebP |

### Baukra

| Campo | Valor |
|---|---|
| **Archivo** | `cover.webp` |
| **Ruta** | `public/assets/images/projects/baukra/cover.webp` |
| **Tamaño recomendado** | 1600 × 1200 px |
| **Aspect ratio** | 4:3 |
| **Formato** | WebP |

### Infamous Project

| Campo | Valor |
|---|---|
| **Archivo** | `cover.webp` |
| **Ruta** | `public/assets/images/projects/infamous/cover.webp` |
| **Tamaño recomendado** | 1600 × 1200 px |
| **Aspect ratio** | 4:3 |
| **Formato** | WebP |

### Visual Stories

| Campo | Valor |
|---|---|
| **Archivo** | `cover.webp` |
| **Ruta** | `public/assets/images/projects/visual-stories/cover.webp` |
| **Tamaño recomendado** | 1600 × 1200 px |
| **Aspect ratio** | 4:3 |
| **Formato** | WebP |

---

## APPROACH (MI ENFOQUE)

### Entender

| Campo | Valor |
|---|---|
| **Archivo** | `entender.webp` |
| **Ruta** | `public/assets/images/approach/entender.webp` |
| **Tamaño recomendado** | 1200 × 1600 px |
| **Aspect ratio** | 3:4 |
| **Formato** | WebP |

### Construir

| Campo | Valor |
|---|---|
| **Archivo** | `construir.webp` |
| **Ruta** | `public/assets/images/approach/construir.webp` |
| **Tamaño recomendado** | 1200 × 1600 px |
| **Aspect ratio** | 3:4 |
| **Formato** | WebP |

### Activar

| Campo | Valor |
|---|---|
| **Archivo** | `activar.webp` |
| **Ruta** | `public/assets/images/approach/activar.webp` |
| **Tamaño recomendado** | 1200 × 1600 px |
| **Aspect ratio** | 3:4 |
| **Formato** | WebP |

---

## EXPERTISE

### Identity

| Campo | Valor |
|---|---|
| **Archivo** | `identity.webp` |
| **Ruta** | `public/assets/images/expertise/identity.webp` |
| **Tamaño recomendado** | 1920 × 1080 px |
| **Aspect ratio** | 16:9 |
| **Formato** | WebP |

### Web

| Campo | Valor |
|---|---|
| **Archivo** | `web.webp` |
| **Ruta** | `public/assets/images/expertise/web.webp` |
| **Tamaño recomendado** | 1920 × 1080 px |
| **Aspect ratio** | 16:9 |
| **Formato** | WebP |

### Multimedia

| Campo | Valor |
|---|---|
| **Archivo** | `multimedia.webp` |
| **Ruta** | `public/assets/images/expertise/multimedia.webp` |
| **Tamaño recomendado** | 1920 × 1080 px |
| **Aspect ratio** | 16:9 |
| **Formato** | WebP |

---

## OPEN GRAPH

| Campo | Valor |
|---|---|
| **Archivo** | `og-image.webp` |
| **Ruta** | `public/assets/images/og-image.webp` |
| **Tamaño recomendado** | 1200 × 630 px |
| **Aspect ratio** | 1.91:1 |
| **Formato** | WebP |
| **Uso** | Redes sociales al compartir enlace |

---

## FAVICON

| Archivo | Ruta | Tamaño |
|---|---|---|
| `favicon.ico` | `public/favicon.ico` | 32×32 |
| `favicon.svg` | `public/favicon.svg` | Escalable |

---

## NOTAS IMPORTANTES

1. **WebP es el formato preferido**. Si necesitas usar JPG/PNG, actualiza la extensión en el código.
2. **Las imágenes de galería** se cargan desde el array `gallery` en `src/data/projects.js`.
3. **Para añadir un proyecto nuevo**: agrega el objeto a `projects.js` y crea su directorio en `public/assets/images/projects/`.
4. **Para cambiar el CV**: reemplaza `CV/HOJA DE VIDA_2026_ED.pdf` o actualiza la ruta en `src/data/siteConfig.js`.
5. **Los placeholders actuales** son imágenes generadas proceduralmente. Se reemplazan archivo por archivo.
