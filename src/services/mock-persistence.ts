/**
 * Persistencia de la DEMOSTRACIÓN, no del sistema.
 *
 * Guarda en IndexedDB del navegador una instantánea del estado del mock para que
 * una recarga conserve productos, imágenes, perfil del taller, pedidos, reservas,
 * pagos y mensajes. Se usa IndexedDB y no `localStorage` porque las imágenes
 * (fotografías y comprobantes en base64) superan con facilidad su cuota de ~5 MB.
 *
 * Es un artefacto temporal del prototipo: desaparece junto con `mock-api.ts`
 * cuando exista el backend (PostgreSQL). Los datos viven solo en este navegador
 * y no se comparten entre dispositivos.
 */

const DB_NOMBRE = "artesanic-demo";
const ALMACEN = "estado";
const CLAVE = "instantanea";

/**
 * Versión de la forma del estado. Si el modelo cambia, una instantánea antigua
 * se descarta en lugar de cargarse con campos que ya no existen.
 */
export const VERSION_INSTANTANEA = 2;

interface Instantanea<T> {
  version: number;
  datos: T;
}

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const peticion = indexedDB.open(DB_NOMBRE, 1);
    peticion.onupgradeneeded = () => peticion.result.createObjectStore(ALMACEN);
    peticion.onsuccess = () => resolve(peticion.result);
    peticion.onerror = () => reject(peticion.error);
  });
}

async function operar<R>(
  modo: IDBTransactionMode,
  fn: (almacen: IDBObjectStore) => IDBRequest,
): Promise<R> {
  const db = await abrir();
  try {
    return await new Promise<R>((resolve, reject) => {
      const tx = db.transaction(ALMACEN, modo);
      const peticion = fn(tx.objectStore(ALMACEN));
      tx.oncomplete = () => resolve(peticion.result as R);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/** Devuelve el estado guardado, o `null` si no hay, si es de otra versión o si falla la lectura. */
export async function leerInstantanea<T>(): Promise<T | null> {
  try {
    if (typeof indexedDB === "undefined") return null;
    const guardada = await operar<Instantanea<T> | undefined>("readonly", (a) => a.get(CLAVE));
    return guardada && guardada.version === VERSION_INSTANTANEA ? guardada.datos : null;
  } catch {
    return null;
  }
}

export async function guardarInstantanea<T>(datos: T): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const instantanea: Instantanea<T> = { version: VERSION_INSTANTANEA, datos };
  await operar("readwrite", (a) => a.put(instantanea, CLAVE));
}

export async function borrarInstantanea(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  await operar("readwrite", (a) => a.delete(CLAVE));
}
