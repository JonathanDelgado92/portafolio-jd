/**
 * Empaqueta dist/ en un zip que Netlify sepa extraer.
 *
 * No se usa Compress-Archive de PowerShell: escribe las rutas con "\" y
 * Netlify no las reconoce como carpetas, así que el sitio se despliega plano
 * y todos los recursos dan 404. Aquí se escribe el zip a mano con "/".
 *
 *   node scripts/make-deploy-zip.mjs [salida.zip]
 */
import { deflateRawSync, crc32 } from 'node:zlib';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const RAIZ = 'dist';
const salida = process.argv[2] || 'portafolio-dist.zip';

function listar(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? listar(p) : [p];
  });
}

/* Fecha MS-DOS: el formato zip no admite marcas de tiempo Unix. */
function fechaDos(d) {
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const dia = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { hora, dia };
}

const locales = [];
const central = [];
let offset = 0;

for (const ruta of listar(RAIZ)) {
  const nombre = relative(RAIZ, ruta).split(sep).join('/');
  const datos = readFileSync(ruta);
  const comprimido = deflateRawSync(datos, { level: 9 });
  const suma = crc32(datos) >>> 0;
  const { hora, dia } = fechaDos(statSync(ruta).mtime);
  const bytesNombre = Buffer.from(nombre, 'utf8');

  const cab = Buffer.alloc(30);
  cab.writeUInt32LE(0x04034b50, 0);
  cab.writeUInt16LE(20, 4);          // versión necesaria
  cab.writeUInt16LE(0x0800, 6);      // nombres en UTF-8
  cab.writeUInt16LE(8, 8);           // deflate
  cab.writeUInt16LE(hora, 10);
  cab.writeUInt16LE(dia, 12);
  cab.writeUInt32LE(suma, 14);
  cab.writeUInt32LE(comprimido.length, 18);
  cab.writeUInt32LE(datos.length, 22);
  cab.writeUInt16LE(bytesNombre.length, 26);

  locales.push(cab, bytesNombre, comprimido);

  const dir = Buffer.alloc(46);
  dir.writeUInt32LE(0x02014b50, 0);
  dir.writeUInt16LE(20, 4);
  dir.writeUInt16LE(20, 6);
  dir.writeUInt16LE(0x0800, 8);
  dir.writeUInt16LE(8, 10);
  dir.writeUInt16LE(hora, 12);
  dir.writeUInt16LE(dia, 14);
  dir.writeUInt32LE(suma, 16);
  dir.writeUInt32LE(comprimido.length, 20);
  dir.writeUInt32LE(datos.length, 24);
  dir.writeUInt16LE(bytesNombre.length, 28);
  dir.writeUInt32LE(offset, 42);
  central.push(dir, bytesNombre);

  offset += cab.length + bytesNombre.length + comprimido.length;
}

const cuerpoCentral = Buffer.concat(central);
const fin = Buffer.alloc(22);
fin.writeUInt32LE(0x06054b50, 0);
fin.writeUInt16LE(central.length / 2, 8);
fin.writeUInt16LE(central.length / 2, 10);
fin.writeUInt32LE(cuerpoCentral.length, 12);
fin.writeUInt32LE(offset, 16);

writeFileSync(salida, Buffer.concat([...locales, cuerpoCentral, fin]));
console.log(`${salida}: ${central.length / 2} ficheros, ${(statSync(salida).size / 1e6).toFixed(1)} MB`);
