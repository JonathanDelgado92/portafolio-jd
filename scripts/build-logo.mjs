/**
 * Genera src/components/Logo.js a partir del SVG del isotipo.
 * Se genera en vez de transcribirse a mano para no corromper los path data.
 *
 *   node scripts/build-logo.mjs <ruta-al-svg>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const svgPath = process.argv[2];
if (!svgPath) {
  console.error('Uso: node scripts/build-logo.mjs <ruta-al-svg>');
  process.exit(1);
}

const src = readFileSync(svgPath, 'utf8');
const viewBox = src.match(/viewBox="([^"]+)"/)?.[1];
const paths = [...src.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);

if (!viewBox || !paths.length) {
  console.error('No se pudo extraer viewBox o paths del SVG.');
  process.exit(1);
}

const pathTags = paths.map((d) => `      <path d="${d}" />`).join('\n');

const out = `/**
 * Isotipo de Jonathan Delgado.
 *
 * Generado por scripts/build-logo.mjs — no editar a mano.
 * Pinta con currentColor, así que hereda el color del contexto (header, menú,
 * preloader, footer) y no hace falta mantener dos ficheros blanco/negro.
 *
 * @param {number} size    Lado en px.
 * @param {string} className
 * @param {string} title   Si se pasa, el SVG se expone como imagen con ese
 *                         nombre accesible; si no, queda aria-hidden.
 */
export function isotipoSVG({ size = 40, className = 'isotipo', title = '' } = {}) {
  const a11y = title
    ? \`role="img" aria-label="\${title}"\`
    : 'aria-hidden="true" focusable="false"';

  return \`
    <svg class="\${className}" width="\${size}" height="\${size}"
         viewBox="${viewBox}" fill="currentColor"
         xmlns="http://www.w3.org/2000/svg" \${a11y}>
${pathTags}
    </svg>\`;
}

export const ISOTIPO_VIEWBOX = '${viewBox}';
export const ISOTIPO_PATHS = ${JSON.stringify(paths, null, 2)};
`;

writeFileSync('src/components/Logo.js', out);
console.log(`src/components/Logo.js generado — viewBox ${viewBox}, ${paths.length} paths`);
