import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const ROOT = 'C:/Users/PC/Documents/PORTAFOLIO WEB';
const MOCKUPS = path.join(ROOT, 'mockups');
const ASSETS = path.join(ROOT, 'public', 'assets', 'images');

function ensureDir(p) { fs.mkdirSync(path.dirname(p), { recursive: true }); }

const tasks = [];

function add(src, destRel, w) {
  if (!fs.existsSync(src)) { console.log(`MISSING: ${src}`); return; }
  const dest = path.join(ASSETS, destRel);
  ensureDir(dest);
  tasks.push({ src, dest, w, label: destRel });
}

// ===== ABOUT =====
const yoFile = path.join(MOCKUPS, 'FOTOS DISEÑADOR', 'yo.png');
add(yoFile, path.join('about', 'about-profile.webp'), 800);

// ===== Helper: find file in a folder by partial name =====
function findFile(folder, patterns) {
  if (!fs.existsSync(folder)) return null;
  const files = fs.readdirSync(folder);
  for (const f of files) {
    const lower = f.toLowerCase();
    if (patterns.some(p => lower.includes(p))) return f;
  }
  return null;
}

// ===== Helper: list all image files in a folder =====
function listImages(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// ===== JIREH =====
const jirehDir = path.join(MOCKUPS, 'Jireh');
const jirehCerveza = path.join(jirehDir, 'Cerveza Jireh');
listImages(jirehCerveza).forEach((f, i) => {
  add(path.join(jirehCerveza, f), path.join('projects', 'jireh', `gallery-${String(7+i).padStart(2,'0')}.webp`), 800);
});
const jirehSubs = fs.readdirSync(jirehDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);
const redisenoFolderName = jirehSubs.find(d => {
  const normalized = d.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, '');
  return normalized.includes('rediseno') && !normalized.includes('cerveza');
});
if (redisenoFolderName) {
  const redisenoDir = path.join(jirehDir, redisenoFolderName);
  listImages(redisenoDir).forEach((f, i) => {
    add(path.join(redisenoDir, f), path.join('projects', 'jireh', `gallery-${String(11+i).padStart(2,'0')}.webp`), 1200);
  });
}

// ===== EL MOLINILLO - Manual de marca =====
const manualDir = path.join(MOCKUPS, 'El Molinillo', 'Manual de marca');
listImages(manualDir).forEach((f, i) => {
  add(path.join(manualDir, f), path.join('projects', 'el-molinillo', `manual-${String(i+1).padStart(2,'0')}.webp`), 1200);
});

// ===== ANIMACION 3D =====
const animDir = path.join(MOCKUPS, 'ANIMACION 3D BLENDER');
const animIllustrations = listImages(animDir).filter(f => /ilustracion/i.test(f));
animIllustrations.forEach((f, i) => {
  add(path.join(animDir, f), path.join('projects', 'animacion-3d', `gallery-${String(i+1).padStart(2,'0')}.webp`), 1200);
});
const animCaptures = listImages(animDir).filter(f => /capturas/i.test(f));
animCaptures.forEach((f, i) => {
  add(path.join(animDir, f), path.join('projects', 'animacion-3d', `captura-${String(i+1).padStart(2,'0')}.webp`), 1200);
});

// ===== UISEK =====
const uisekDir = path.join(MOCKUPS, 'UISEK');
const uisekRoot = listImages(uisekDir);

const uisekMap = [
  { patterns: ['31-a', '31-anos', '31-años'], dest: 'gallery-11' },
  { patterns: ['bienestar'], dest: 'gallery-12' },
  { patterns: ['internacionalizaci'], dest: 'gallery-13' },
  { patterns: ['medicina-rcp', 'medicina rcp'], dest: 'gallery-14' },
  { patterns: ['biblioteca'], dest: 'gallery-15' },
  { patterns: ['protocolo'], dest: 'gallery-16' },
  { patterns: ['protocolo1'], dest: 'gallery-17' },
  { patterns: ['roll-up', 'roll up'], dest: 'gallery-18' },
  { patterns: ['food-truck', 'simulaci'], dest: 'gallery-19' },
  { patterns: ['whatsapp'], dest: 'gallery-20' },
  { patterns: ['workshop', '1080x1920'], dest: 'gallery-21' },
  { patterns: ['workshop', '2024_3'], dest: 'gallery-22' },
];

for (const { patterns, dest } of uisekMap) {
  const found = uisekRoot.find(f => patterns.some(p => f.toLowerCase().includes(p)));
  if (found) {
    add(path.join(uisekDir, found), path.join('projects', 'uisek', `${dest}.webp`), 1200);
    console.log(`  UISEK ${dest}: ${found}`);
  } else {
    console.log(`  UISEK ${dest}: NOT FOUND (patterns: ${patterns[0]})`);
  }
}

const logoUisek = uisekRoot.find(f => f.toLowerCase().includes('logo') && !f.toLowerCase().includes('recurso'));
if (logoUisek) {
  add(path.join(uisekDir, logoUisek), path.join('projects', 'uisek', 'logo-uisek.webp'), 400);
}

// Webinars
const webinarDir = path.join(uisekDir, 'webinar');
listImages(webinarDir).slice(0, 12).forEach((f, i) => {
  add(path.join(webinarDir, f), path.join('projects', 'uisek', `webinar-${String(i+1).padStart(2,'0')}.webp`), 800);
});

// ===== CAMPUS GRUPAL =====
const campusDir = path.join(MOCKUPS, 'Campus Grupal');
listImages(campusDir).forEach((f, i) => {
  add(path.join(campusDir, f), path.join('projects', 'campus-grupal', `gallery-${String(11+i).padStart(2,'0')}.webp`), 1200);
});

// ===== BRAVO MOTORS =====
const bravoDir = path.join(MOCKUPS, 'Bravo Motors');
const bravoExtra = listImages(bravoDir).filter(f => !/recurso/i.test(f) && !/captura/i.test(f) && /\.(png|jpg|jpeg)$/i.test(f));
bravoExtra.forEach((f, i) => {
  add(path.join(bravoDir, f), path.join('projects', 'bravo-motors', `gallery-${String(9+i).padStart(2,'0')}.webp`), 1200);
});
const bravoLogos = listImages(bravoDir).filter(f => /recurso.*logo/i.test(f));
bravoLogos.forEach((f, i) => {
  add(path.join(bravoDir, f), path.join('projects', 'bravo-motors', `logo-${String(i+1).padStart(2,'0')}.webp`), 400);
});

// ===== main loop =====
async function main() {
  for (const t of tasks) {
    try {
      const meta = await sharp(t.src).metadata();
      const isPortrait = meta.height > meta.width;
      const resizeOpts = isPortrait
        ? { height: t.w, fit: 'inside', withoutEnlargement: true }
        : { width: t.w, fit: 'inside', withoutEnlargement: true };
      await sharp(t.src)
        .resize(resizeOpts)
        .webp({ quality: 80 })
        .toFile(t.dest);
      console.log(`OK: ${t.label}`);
    } catch(e) {
      console.log(`ERR: ${t.label} — ${e.message}`);
    }
  }
  console.log(`\nDone. ${tasks.length} images processed.`);
}

main();
