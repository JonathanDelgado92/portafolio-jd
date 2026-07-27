/**
 * Extrae el color de marca dominante de la portada de cada proyecto.
 *
 * No sirve el "color dominante" a secas: las portadas son logos sobre fondo
 * blanco, así que el dominante siempre sería el blanco. Se descartan los
 * píxeles casi blancos, casi negros y los grises, y se agrupa el resto por
 * tono para quedarse con el más presente.
 */
import sharp from 'sharp';
import { projectsData } from '../src/data/projects.js';

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
}

const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

/** Luminancia relativa WCAG. */
function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(rgbA, rgbB) {
  const l1 = luminance(rgbA), l2 = luminance(rgbB);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const WHITE = [250, 250, 250];
const INK = [10, 10, 10];

for (const p of projectsData) {
  const { data, info } = await sharp('public' + p.cover)
    .resize(140, 140, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  /* Histograma de tonos, ponderado por saturación: los píxeles más vivos
     pesan más, que son los que definen la marca. */
  const bins = new Array(36).fill(0);
  const acc = Array.from({ length: 36 }, () => [0, 0, 0, 0]);

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const [h, s, l] = rgbToHsl(r, g, b);
    if (l > 0.93 || l < 0.08 || s < 0.25) continue;
    const bin = Math.floor(h / 10) % 36;
    const w = s;
    bins[bin] += w;
    acc[bin][0] += r * w; acc[bin][1] += g * w; acc[bin][2] += b * w; acc[bin][3] += w;
  }

  const best = bins.indexOf(Math.max(...bins));
  let rgb;
  if (acc[best][3] > 0) {
    rgb = [0, 1, 2].map((k) => Math.round(acc[best][k] / acc[best][3]));
  } else {
    rgb = [43, 43, 46];
  }

  /* Se normaliza la luminosidad a una banda estrecha para que las nueve barras
     tengan un peso visual parecido y el conjunto no parezca un arcoíris. */
  let [h, s, l] = rgbToHsl(...rgb);
  const norm = hslToRgb(h, Math.min(Math.max(s, 0.45), 0.9), Math.min(Math.max(l, 0.3), 0.42));

  const cW = contrast(norm, WHITE);
  const cI = contrast(norm, INK);
  const texto = cW >= cI ? 'blanco' : 'tinta';

  console.log(
    `${p.id.padEnd(30)} ${hex(norm)}  h=${Math.round(h).toString().padStart(3)}  ` +
    `contraste blanco=${cW.toFixed(2)} tinta=${cI.toFixed(2)}  -> ${texto}` +
    `${Math.max(cW, cI) < 4.5 ? '  ⚠ bajo' : ''}`
  );
}
