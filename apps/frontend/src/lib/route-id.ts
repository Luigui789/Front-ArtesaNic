/**
 * Conversión de identificadores que llegan por la URL.
 *
 * El contrato de API (§1.2) fija los identificadores como enteros opacos, pero
 * una URL solo transporta texto. Esta es la única frontera donde ese texto se
 * convierte en un identificador de dominio.
 */

/**
 * Convierte el texto de una URL en un identificador de dominio.
 *
 * Devuelve `undefined` cuando el valor falta o no es un entero positivo. Quien
 * llama decide qué significa eso: en un parámetro de ruta significa que la URL
 * no identifica ningún recurso (404); en un parámetro de búsqueda puede
 * significar simplemente "sin selección".
 *
 * Recibe el valor ya extraído, no el `URLSearchParams`: no todos los parámetros
 * de búsqueda son identificadores, y el helper no debe adivinarlo.
 */
export function parseRouteId(value: string | undefined | null): number | undefined {
  if (value == null || !/^[0-9]+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}
