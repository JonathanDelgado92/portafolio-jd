/**
 * Migra todos los assets referenciados desde src/ a WebP optimizado con
 * nombres ASCII sin espacios, y reescribe las rutas en el código.
 *
 *   node scripts/migrate-assets.mjs          -> dry run (no escribe nada)
 *   node scripts/migrate-assets.mjs --apply  -> ejecuta la migración
 *
 * Los originales NO se borran: quedan en public/assets/images hasta que se
 * muevan aparte con --move-originals.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, dirname, extname, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');
const APPLY = process.argv.includes('--apply');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const VID_EXT = new Set(['.mp4']);

/** Recorre un directorio y devuelve todos los ficheros que cumplen el filtro. */
async function walk(dir, filter, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      await walk(full, filter, out);
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

/** "REDISEÑO ETIQUETAS" -> "rediseno-etiquetas" */
function slug(s) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'x';
}

/** /assets/images/projects/jireh/REDISEÑO ETIQUETAS/A B.jpg
 *    -> /assets/img/projects/jireh/rediseno-etiquetas/a-b.webp */
function targetUrl(url) {
  const rest = url.replace(/^\/assets\/images\//, '').replace(/^\/images\//, 'tools/');
  const parts = rest.split('/');
  const file = parts.pop();
  const ext = extname(file).toLowerCase();
  const base = slug(file.slice(0, -ext.length));
  /* Los .mp4 se copian tal cual y los .avif se conservan (ya son eficientes y
     conviven con su .webp en el <picture> del hero). El resto pasa a WebP. */
  const outExt = VID_EXT.has(ext) || ext === '.avif' ? ext : '.webp';
  return '/assets/img/' + [...parts.map(slug), base + outExt].join('/');
}

const srcFiles = await walk(join(ROOT, 'src'), (f) => /\.(js|css)$/.test(f));

/* Las rutas llevan espacios y tildes, así que un regex "sin espacios" se las
   salta. Se combinan dos fuentes:
     1) importar los módulos de src/data y recorrer sus valores (exacto),
     2) literales entre comillas y url(...) en JS/CSS (para el resto). */
const ASSET_RE = /^\/(?:assets|images)\/.+\.(?:jpe?g|png|webp|avif|mp4)$/i;
const QUOTED = /['"`](\/(?:assets|images)\/[^'"`]+?\.(?:jpe?g|png|webp|avif|mp4))['"`]/gi;
const CSS_URL = /url\(\s*['"]?(\/(?:assets|images)\/[^'")]+?\.(?:jpe?g|png|webp|avif|mp4))['"]?\s*\)/gi;

const refs = new Map(); // url -> [ficheros que la usan]
const add = (url, file) => {
  if (!refs.has(url)) refs.set(url, []);
  if (!refs.get(url).includes(file)) refs.get(url).push(file);
};

function collect(value, file, seen = new Set()) {
  if (typeof value === 'string') {
    if (ASSET_RE.test(value)) add(value, file);
  } else if (value && typeof value === 'object') {
    if (seen.has(value)) return;
    seen.add(value);
    for (const v of Object.values(value)) collect(v, file, seen);
  }
}

for (const file of await walk(join(ROOT, 'src', 'data'), (f) => f.endsWith('.js'))) {
  const mod = await import('file://' + file.replace(/\\/g, '/'));
  collect({ ...mod }, file);
}

for (const file of srcFiles) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(QUOTED)) add(m[1], file);
  for (const m of text.matchAll(CSS_URL)) add(m[1], file);
}

const missing = [];
const plan = [];
for (const [url, users] of refs) {
  const abs = join(PUBLIC, decodeURIComponent(url));
  if (!existsSync(abs)) { missing.push({ url, users: users.map((u) => relative(ROOT, u)) }); continue; }
  plan.push({ url, abs, out: targetUrl(url), bytes: statSync(abs).size });
}

// Colisiones de nombre tras el slug
const byOut = new Map();
for (const p of plan) {
  if (!byOut.has(p.out)) byOut.set(p.out, []);
  byOut.get(p.out).push(p.url);
}
const collisions = [...byOut].filter(([, v]) => v.length > 1);

const totalIn = plan.reduce((a, p) => a + p.bytes, 0);
console.log(`Referencias únicas : ${refs.size}`);
console.log(`Encontradas        : ${plan.length}  (${(totalIn / 1048576).toFixed(1)} MB)`);
console.log(`NO encontradas     : ${missing.length}`);
console.log(`Colisiones de ruta : ${collisions.length}`);
if (missing.length) {
  console.log('\n--- Referencias rotas ---');
  for (const m of missing.slice(0, 40)) console.log('  ' + m.url + '   <- ' + m.users.join(', '));
  if (missing.length > 40) console.log(`  ... y ${missing.length - 40} más`);
}
if (collisions.length) {
  console.log('\n--- Colisiones ---');
  for (const [out, srcs] of collisions) console.log('  ' + out + '\n' + srcs.map((s) => '      ' + s).join('\n'));
}

if (!APPLY) {
  console.log('\n(dry run — nada escrito. Añade --apply para ejecutar)');
  process.exit(collisions.length ? 1 : 0);
}
if (collisions.length) {
  console.error('\nAbortado: resuelve las colisiones antes de aplicar.');
  process.exit(1);
}

// ── Conversión ────────────────────────────────────────────────────────────
let done = 0, totalOut = 0;
for (const p of plan) {
  const dest = join(PUBLIC, p.out);
  mkdirSync(dirname(dest), { recursive: true });
  const srcExt = extname(p.abs).toLowerCase();
  if (VID_EXT.has(srcExt) || srcExt === '.avif') {
    copyFileSync(p.abs, dest);
  } else {
    await sharp(p.abs, { failOn: 'none' })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(dest);
  }
  totalOut += statSync(dest).size;
  if (++done % 25 === 0) console.log(`  ${done}/${plan.length}`);
}
console.log(`\nConvertidos: ${done}`);
console.log(`Entrada : ${(totalIn / 1048576).toFixed(1)} MB`);
console.log(`Salida  : ${(totalOut / 1048576).toFixed(1)} MB`);

// ── Reescritura de rutas en el código ─────────────────────────────────────
const map = new Map(plan.map((p) => [p.url, p.out]));
// Ordena de más larga a más corta para que ninguna ruta sea prefijo de otra.
const ordered = [...map.keys()].sort((a, b) => b.length - a.length);
let filesChanged = 0;
for (const file of srcFiles) {
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const url of ordered) after = after.split(url).join(map.get(url));
  if (after !== before) { writeFileSync(file, after); filesChanged++; }
}
console.log(`Ficheros de código actualizados: ${filesChanged}`);
