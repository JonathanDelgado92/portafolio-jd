import { variantesImagen, ANCHOS_VARIANTE } from '../data/imageVariants.js';

/**
 * Atributos srcset/sizes para una imagen de galería.
 *
 * Sin esto se servía el original —hasta 1800 px— también para miniaturas que
 * en un móvil ocupan unos 160 px. El coste no está en la descarga sino en la
 * descodificación: reconstruir catorce veces más píxeles de los que se van a
 * mostrar es lo que hace que las imágenes entren despacio en el teléfono.
 *
 * Devuelve cadena vacía si la imagen no tiene variantes, para no apuntar a
 * ficheros inexistentes.
 *
 * @param {string} src   Ruta del original.
 * @param {string} sizes Valor del atributo `sizes`.
 * @returns {string} Atributos listos para interpolar en el marcado.
 */
export function atributosResponsive(src, sizes) {
  const anchoOriginal = variantesImagen[src];
  if (!anchoOriginal) return '';

  /* Misma regla con la que se generaron: existe cada variante menor que el
     original. Deducirlo evita repetir la lista para cada una de las 200
     imágenes del manifiesto. */
  const candidatos = ANCHOS_VARIANTE
    .filter((a) => a < anchoOriginal)
    .map((a) => `${src.replace(/\.webp$/, `-${a}.webp`)} ${a}w`)
    .concat(`${src} ${anchoOriginal}w`)
    .join(', ');

  return ` srcset="${candidatos}" sizes="${sizes}"`;
}
