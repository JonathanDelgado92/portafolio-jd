import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const ROOT = path.resolve('C:/Users/PC/Documents/PORTAFOLIO WEB');
const MOCKUPS = path.join(ROOT, 'mockups');
const ASSETS = path.join(ROOT, 'public', 'assets', 'images');

const projects = {
  baukra: { logo: 'mockups/Baukra/BAUKRA_VISUAL SYSTEMS STUDIO-09-04.png' },
  'el-molinillo': { logo: 'mockups/El Molinillo/logo separado.png' },
  sencia: { logo: 'mockups/Sencia/Recurso 2.png' },
  'animacion-3d': { logo: 'mockups/ANIMACION 3D BLENDER/ILUSTRACIÓN-04.jpg' },
  uisek: { logo: 'mockups/UISEK/Recurso 2logo.png' },
  'bravo-motors': { logo: 'mockups/Bravo Motors/Recurso 1logo.png' },
  'campus-grupal': { logo: 'mockups/Campus Grupal/Recurso 2logo.svg' },
};

async function main() {
  // 1. Optimize logos for each project
  for (const [proj, src] of Object.entries(projects)) {
    const srcPath = path.join(ROOT, src.logo);
    const destDir = path.join(ASSETS, 'projects', proj);
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, 'logo.webp');
    console.log(`Logo: ${proj} -> ${dest}`);
    try {
      await sharp(srcPath)
        .resize(400, 300, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(dest);
    } catch(e) {
      console.log(`  ERROR: ${e.message}`);
    }
  }

  // 2. Optimize designer photos
  const designerDir = path.join(MOCKUPS, 'FOTOS DISEÑADOR');
  const aboutDir = path.join(ASSETS, 'about');
  fs.mkdirSync(aboutDir, { recursive: true });

  // Portrait for About section (different from hero)
  const portraitSrc = path.join(designerDir, 'RETOQUE-MI-FOTO.jpg');
  if (fs.existsSync(portraitSrc)) {
    await sharp(portraitSrc)
      .resize(600, 800, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(path.join(aboutDir, 'about-profile.webp'));
    console.log('About portrait created');
  }

  // Additional designer photos for other sections
  const designerPhotos = [
    { src: 'ChatGPT Image 17 jul 2026, 07_17_39 p.m..png', name: 'designer-01.webp', w: 800, h: 800 },
    { src: '5250e716-52e2-4981-a634-7e9dffc108ab-2026-07-24.png', name: 'designer-02.webp', w: 800, h: 800 },
    { src: '20af0b23-edfa-46a6-ba96-b0559a62d881-2026-07-24.png', name: 'designer-03.webp', w: 800, h: 800 },
    { src: 'fc4ff659-5c2d-4326-9664-44a23a574c2d-2026-07-24.png', name: 'designer-04.webp', w: 800, h: 800 },
  ];

  for (const photo of designerPhotos) {
    const srcPath = path.join(designerDir, photo.src);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(photo.w, photo.h, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toFile(path.join(aboutDir, photo.name));
      console.log(`Created: ${photo.name}`);
    }
  }

  // 3. Create video poster frames (first frame of each video)
  const videos = [
    { src: 'ANIMACION 3D BLENDER/ANIMACIÓN FINAL MODELADO 3D_MUSICA.mp4', proj: 'animacion-3d', name: 'video-poster.webp' },
    { src: 'El Molinillo/el molinillo.mp4', proj: 'el-molinillo', name: 'video-poster.webp' },
    { src: 'Jireh/Liquid Logo.mp4', proj: 'jireh', name: 'video-poster.webp' },
  ];

  for (const vid of videos) {
    const srcPath = path.join(MOCKUPS, vid.src);
    const destDir = path.join(ASSETS, 'projects', vid.proj);
    const dest = path.join(destDir, vid.name);
    if (fs.existsSync(srcPath)) {
      console.log(`Video poster: ${vid.proj} -> ${dest}`);
      try {
        execSync(`ffmpeg -i "${srcPath}" -vframes 1 -vf "scale=800:-1" "${dest}" -y 2>nul`, { stdio: 'pipe' });
        console.log('  OK');
      } catch(e) {
        console.log(`  ffmpeg not available, using sharp placeholder`);
        // Create a colored placeholder
        await sharp({ create: { width: 800, height: 450, channels: 3, background: '#1a1a1a' } })
          .webp({ quality: 50 })
          .toFile(dest);
      }
    }
  }

  // 4. Optimize additional gallery images from mockups
  // Copy and optimize UISEK webinars as additional gallery content
  const uisekWebinarDir = path.join(MOCKUPS, 'UISEK', 'webinar');
  if (fs.existsSync(uisekWebinarDir)) {
    const webinarFiles = fs.readdirSync(uisekWebinarDir).filter(f => /\.(jpg|png)$/i.test(f)).slice(0, 6);
    for (const f of webinarFiles) {
      // Just copy as-is for now (they're already optimized JPGs)
      const src = path.join(uisekWebinarDir, f);
      // Could optimize if needed
    }
  }
}

main().catch(console.error);
