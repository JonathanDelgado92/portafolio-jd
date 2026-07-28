/**
 * Genera variantes reducidas de cada imagen de proyecto.
 *
 * Las galerías servían siempre el original (hasta 1800 px) incluso para
 * miniaturas que en un móvil ocupan unos 160 px. El coste no está en la
 * descarga sino en la descodificación: un teléfono tiene que reconstruir
 * catorce veces más píxeles de los que va a mostrar, y eso es lo que hace
 * que las imágenes "entren" despacio.
 *
 * Deja junto a cada original un `-480.webp` y un `-960.webp`. El original
 * se conserva: es el que abre el visor a pantalla completa.
 *
 *   node scripts/build-thumbnails.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'public/assets/img/projects';
const ANCHOS = [480, 960];
/* Sufijo reconocible para no volver a procesar lo ya generado. */
const ESGENERADA = /-(480|960)\.webp$/;

function listar(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return listar(p);
    return e.name.endsWith('.webp') && !ESGENERADA.test(e.name) ? [p] : [];
  });
}

const originales = listar(RAIZ);
let creadas = 0;
let omitidas = 0;
let bytes = 0;

/* El navegador no puede adivinar qué variantes existen, y apuntar en el
   srcset a una que no está daría un 404. Se anota aquí qué anchos se han
   generado y con qué tamaño original, y el manifiesto se consulta al pintar. */
const manifiesto = {};

for (const origen of originales) {
  const meta = await sharp(origen).metadata();
  const url = '/' + origen.replace(/\\/g, '/').replace(/^public\//, '');
  const disponibles = [];

  for (const ancho of ANCHOS) {
    /* Ampliar no aporta nada: si el original ya es más pequeño, se salta y
       el srcset se queda sin ese candidato, que es lo correcto. */
    if (meta.width <= ancho) { omitidas++; continue; }
    const destino = origen.replace(/\.webp$/, `-${ancho}.webp`);
    await sharp(origen).resize({ width: ancho }).webp({ quality: 78 }).toFile(destino);
    bytes += statSync(destino).size;
    disponibles.push(ancho);
    creadas++;
  }

  /* Solo se guarda el ancho original. Qué variantes existen se deduce de él
     con la misma regla que las generó (todas las menores), así que repetir
     la lista en el manifiesto solo engordaría el JS que se descarga y
     analiza en cada carga. */
  if (disponibles.length) manifiesto[url] = meta.width;
}

writeFileSync('src/data/imageVariants.js',
  '/* Generado por scripts/build-thumbnails.mjs. No editar a mano.\n' +
  '   Clave: ruta del original. Valor: su ancho en píxeles.\n' +
  `   Anchos de variante disponibles: ${ANCHOS.join(', ')} (los menores que el original). */\n` +
  `export const ANCHOS_VARIANTE = ${JSON.stringify(ANCHOS)};\n` +
  'export const variantesImagen = ' + JSON.stringify(manifiesto) + ';\n');

console.log(`originales: ${originales.length}`);
console.log(`variantes creadas: ${creadas}  (omitidas por ser ya pequeñas: ${omitidas})`);
console.log(`peso añadido: ${(bytes / 1e6).toFixed(1)} MB`);
console.log(`manifiesto: ${Object.keys(manifiesto).length} imágenes con variantes`);
