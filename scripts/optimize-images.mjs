import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MOCKUPS_DIR = path.join(ROOT, 'mockups');
const OUTPUT_DIR = path.join(ROOT, 'public', 'assets', 'images', 'projects');

const PROJECTS = [
  { folder: 'Baukra', out: 'baukra' },
  { folder: 'Jireh', out: 'jireh' },
  { folder: 'El Molinillo', out: 'el-molinillo' },
  { folder: 'Sencia', out: 'sencia' },
  { folder: 'ANIMACION 3D BLENDER', out: 'animacion-3d' },
  { folder: 'UISEK', out: 'uisek' },
  { folder: 'Bravo Motors', out: 'bravo-motors' },
];

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const EXCLUDED_KEYWORDS = ['logo', 'recurso', 'separado', 'anterior'];

function isImage(file) {
  return IMAGE_EXT.has(path.extname(file).toLowerCase());
}

function shouldExclude(name) {
  return EXCLUDED_KEYWORDS.some(k => name.toLowerCase().includes(k));
}

function scanImages(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...scanImages(fullPath));
      } else if (isImage(entry.name) && !shouldExclude(entry.name)) {
        const stat = fs.statSync(fullPath);
        results.push({ name: entry.name, path: fullPath, size: stat.size });
      }
    }
  } catch (e) { /* ignore */ }
  return results;
}

function scoreFile(file) {
  let score = file.size;
  const name = file.name.toLowerCase();
  if (name.includes('mockup') || name.includes('montaje') || name.includes('empaque') || name.includes('final')) score *= 2;
  if (name.includes('portada') || name.includes('cover')) score *= 1.5;
  if (name.includes(' 1.') || name.startsWith('1.')) score *= 1.3;
  if (name.includes('miniatura') || name.includes('thumbnail')) score *= 0.5;
  if (name.includes('captura') || name.includes('screenshot')) score *= 0.6;
  return score;
}

async function processProject(project) {
  const srcDir = path.join(MOCKUPS_DIR, project.folder);
  const outDir = path.join(OUTPUT_DIR, project.out);

  if (!fs.existsSync(srcDir)) {
    console.log(`⚠  Carpeta no encontrada: ${project.folder}`);
    return;
  }

  const images = scanImages(srcDir);
  if (images.length === 0) {
    console.log(`⚠  Sin imágenes en: ${project.folder}`);
    return;
  }

  images.sort((a, b) => scoreFile(b) - scoreFile(a));

  fs.mkdirSync(outDir, { recursive: true });

  const results = { project: project.folder, cover: '', gallery: [] };

  for (let i = 0; i < Math.min(images.length, 7); i++) {
    const img = images[i];
    const ext = path.extname(img.name).toLowerCase();
    const isCover = i === 0;
    const outName = isCover ? 'cover.webp' : `gallery-${String(i).padStart(2, '0')}.webp`;
    const outPath = path.join(outDir, outName);

    try {
      const pipeline = sharp(img.path);
      const meta = await pipeline.metadata();

      if (isCover) {
        const { width, height } = meta;
        const targetRatio = 16 / 9;
        const imageRatio = width / height;

        let resizeOpts = { width: 1200 };
        if (imageRatio > targetRatio) {
          resizeOpts = { width: 1200, height: Math.round(1200 / targetRatio), fit: 'cover' };
        } else {
          resizeOpts = { height: 675, width: Math.round(675 * targetRatio), fit: 'cover' };
        }
        await pipeline.resize(resizeOpts).webp({ quality: 80 }).toFile(outPath);
        results.cover = `/assets/images/projects/${project.out}/cover.webp`;
      } else {
        const maxDim = 1600;
        let resizeOpts = {};
        if (meta.width > maxDim || (meta.height || 0) > maxDim) {
          if (meta.width >= (meta.height || 0)) {
            resizeOpts = { width: maxDim };
          } else {
            resizeOpts = { height: maxDim };
          }
        }
        const webpOpts = { quality: 80 };
        if (resizeOpts.width || resizeOpts.height) {
          await pipeline.resize(resizeOpts).webp(webpOpts).toFile(outPath);
        } else {
          await pipeline.webp(webpOpts).toFile(outPath);
        }
        results.gallery.push(`/assets/images/projects/${project.out}/${outName}`);
      }

      const originalKB = (img.size / 1024).toFixed(0);
      const newStat = fs.statSync(outPath);
      const newKB = (newStat.size / 1024).toFixed(0);
      const saved = ((1 - newStat.size / img.size) * 100).toFixed(0);
      console.log(`  ${isCover ? '📸' : '🖼'} ${outName}  (${originalKB}KB → ${newKB}KB, ${saved}% menor)`);
    } catch (e) {
      console.log(`  ❌ Error procesando ${img.name}: ${e.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('=== Optimización de imágenes para portafolio ===\n');

  for (const project of PROJECTS) {
    console.log(`\n📁 ${project.folder} → ${project.out}/`);
    const result = await processProject(project);
    if (result) {
      console.log(`   Cover: ${result.cover}`);
      console.log(`   Galería: ${result.gallery.length} imágenes`);
    }
  }

  console.log('\n=== ¡Optimización completa! ===');
}

main().catch(console.error);
