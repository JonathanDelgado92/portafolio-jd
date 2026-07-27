import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const ROOT = 'C:/Users/PC/Documents/PORTAFOLIO WEB';
const MOCKUPS = path.join(ROOT, 'mockups');
const ASSETS = path.join(ROOT, 'public', 'assets', 'images', 'projects');

const extra = [
  // Baukra: extra mockups
  { src: 'Baukra/BAUKRA_VISUAL SYSTEMS STUDIO-11.png', dest: 'baukra/gallery-07.webp', w: 1200 },
  { src: 'Baukra/BAUKRA_VISUAL SYSTEMS STUDIO-12.png', dest: 'baukra/gallery-08.webp', w: 1200 },
  { src: 'Baukra/BAUKRA_VISUAL SYSTEMS STUDIO-14.png', dest: 'baukra/gallery-09.webp', w: 1200 },
  { src: 'Baukra/BAUKRA_VISUAL SYSTEMS STUDIO-16.png', dest: 'baukra/gallery-10.webp', w: 1200 },
  // El Molinillo: portadas editoriales
  { src: 'El Molinillo/Cuento2.png', dest: 'el-molinillo/gallery-07.webp', w: 800 },
  { src: 'El Molinillo/El-ANTROPÓFAGO.png', dest: 'el-molinillo/gallery-08.webp', w: 800 },
  { src: 'El Molinillo/Una-Vendetta.png', dest: 'el-molinillo/gallery-09.webp', w: 800 },
  { src: 'El Molinillo/Portada-la-Gallina-Degollada.png', dest: 'el-molinillo/gallery-10.webp', w: 800 },
  { src: 'El Molinillo/banner-redes-sociales.jpg', dest: 'el-molinillo/gallery-11.webp', w: 1200 },
  { src: 'El Molinillo/FORMATO-REDES-SOCIALES.jpg', dest: 'el-molinillo/gallery-12.webp', w: 1200 },
  // Sencia: mockups magnific
  { src: 'Sencia/magnific__mockup-hiperrealista-y-editorial-en-formato-horizo__71995.png', dest: 'sencia/gallery-07.webp', w: 1200 },
  { src: 'Sencia/magnific__mockup-hiperrealista-y-editorial-en-formato-horizo__71996.png', dest: 'sencia/gallery-08.webp', w: 1200 },
  { src: 'Sencia/magnific__mockup-hiperrealista-y-profesional-de-dos-hojas-me__71986.png', dest: 'sencia/gallery-09.webp', w: 1200 },
  { src: 'Sencia/magnific__mockup-hiperrealista-y-profesional-de-dos-tarjetas__71984.png', dest: 'sencia/gallery-10.webp', w: 1200 },
  // UISEK: additional content
  { src: 'UISEK/68.png', dest: 'uisek/gallery-07.webp', w: 1200 },
  { src: 'UISEK/CUADERNO.png', dest: 'uisek/gallery-08.webp', w: 1200 },
  { src: 'UISEK/TRIPTICO.png', dest: 'uisek/gallery-09.webp', w: 1200 },
  { src: 'UISEK/ROLL-UP-DR-AURELIO-BARRIOS.jpg', dest: 'uisek/gallery-10.webp', w: 800 },
  // Campus Grupal: website mockups
  { src: 'Campus Grupal/1.png', dest: 'campus-grupal/gallery-07.webp', w: 1200 },
  { src: 'Campus Grupal/2.png', dest: 'campus-grupal/gallery-08.webp', w: 1200 },
  { src: 'Campus Grupal/3.png', dest: 'campus-grupal/gallery-09.webp', w: 1200 },
  { src: 'Campus Grupal/4.png', dest: 'campus-grupal/gallery-10.webp', w: 1200 },
  // Bravo Motors: additional
  { src: 'Bravo Motors/1.png', dest: 'bravo-motors/gallery-05.webp', w: 1200 },
  { src: 'Bravo Motors/2.png', dest: 'bravo-motors/gallery-06.webp', w: 1200 },
  { src: 'Bravo Motors/3.png', dest: 'bravo-motors/gallery-07.webp', w: 1200 },
  { src: 'Bravo Motors/4.png', dest: 'bravo-motors/gallery-08.webp', w: 1200 },
];

async function main() {
  for (const item of extra) {
    const srcPath = path.join(MOCKUPS, item.src);
    const destPath = path.join(ASSETS, item.dest);
    const destDir = path.dirname(destPath);
    fs.mkdirSync(destDir, { recursive: true });
    if (!fs.existsSync(srcPath)) {
      console.log(`MISSING: ${item.src}`);
      continue;
    }
    try {
      await sharp(srcPath)
        .resize(item.w, undefined, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`OK: ${item.dest}`);
    } catch(e) {
      console.log(`ERR: ${item.dest} — ${e.message}`);
    }
  }
}

main();
