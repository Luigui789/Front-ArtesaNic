/**
 * Capa de servicios MOCK.
 * Simula operaciones sobre un store con instantáneas locales en IndexedDB.
 * Las extensiones de esta demo requieren homologación y contrato antes de Django.
 */
import {
  buildArtisans,
  buildCategories,
  buildMessages,
  buildOrders,
  buildProducts,
  applyScenarioUnits,
  RESPONSABLE_TALLER_DEMO,
  TALLER_DEMO_ID,
} from "@/data/seed";
import { CATEGORY_IMAGE } from "@/lib/category-images";
import { DELIVERY_MODE_LABELS } from "@/lib/labels";
import { canCancel, canTransition, requiresConfirmedPayment } from "@/lib/order-state";
import { availableUnits, maxRequestable } from "@/lib/units";
import { orderTotal } from "@/lib/order-amounts";
import { imageFileError, readAsDataUrl } from "@/lib/image-files";
import { borrarInstantanea, guardarInstantanea, leerInstantanea } from "./mock-persistence";
import { DELIVERY_MODES, PAYMENT_METHODS, UNIT_TYPES } from "@/types";
import type {
  Artisan,
  Category,
  DeliveryMode,
  Message,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  Role,
  UnitType,
  UnitMovement,
  OrderOption,
  PaymentAttemptStatus,
  User,
} from "@/types";

const categories = buildCategories();
const artisans = buildArtisans(categories);
const products = buildProducts(artisans);
const { orders, receiptFiles } = buildOrders(products);
const messages = buildMessages();
const movements = applyScenarioUnits(products, orders);

let store = { categories, artisans, products, orders, messages, receiptFiles, movements };
const initial = structuredClone(store);
/**
 * Estado de la persistencia de la demo. Si había datos guardados que no se
 * pudieron usar (error de lectura u otra versión), el mock trabaja solo en
 * memoria y no guarda: hacerlo sobrescribiría esos datos sin avisar. La
 * interfaz lo comunica y «Restablecer» es la única forma de reemplazarlos.
 */
export type PersistenceStatus =
  { modo: "guardando" } | { modo: "solo_memoria"; motivo: "error_lectura" | "otra_version" };

let persistencia: PersistenceStatus = { modo: "guardando" };

const ready = leerInstantanea<typeof store>().then((lectura) => {
  if (lectura.estado === "cargada") store = lectura.datos;
  else if (lectura.estado === "error") {
    persistencia = { modo: "solo_memoria", motivo: "error_lectura" };
  } else if (lectura.estado === "otra_version") {
    persistencia = { modo: "solo_memoria", motivo: "otra_version" };
  }
});
let queue: Promise<unknown> = Promise.resolve();

export async function getPersistenceStatus(): Promise<PersistenceStatus> {
  await ready;
  return persistencia;
}

async function guardar() {
  if (persistencia.modo !== "guardando") return;
  try {
    await guardarInstantanea(store);
  } catch {
    throw new Error(
      "No se pudo guardar en el almacenamiento del navegador; el cambio no se aplicó. Intenta de nuevo o libera espacio.",
    );
  }
}

/** Taller cuyo panel se demuestra en el prototipo. */
export const DEMO_ARTISAN_ID = TALLER_DEMO_ID;

/** Persona responsable del taller demo: nombre de la sesión de artesano. */
export const DEMO_ARTISAN_RESPONSABLE = RESPONSABLE_TALLER_DEMO;

/**
 * Persona usuaria del prototipo. Identifica a la persona, no al taller: en la
 * sesión de artesano conviven `DEMO_USER_ID` (quien actúa) y `DEMO_ARTISAN_ID`
 * (el taller sobre el que actúa), y no deben confundirse.
 */
export const DEMO_USER_ID = 4;

/**
 * El mock ocupa el lugar del backend: aquí los identificadores se asignan como
 * lo haría el servidor (enteros crecientes). La interfaz nunca los construye.
 */
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((x) => x.id)) + 1;
const nuevoProductoId = () => nextId(store.products);
const nuevoPedidoId = () => nextId(store.orders);
const nuevoMensajeId = () => nextId(store.messages);
const nuevoEventoId = () => nextId(store.orders.flatMap((o) => o.historial));

/** Latencia simulada fija: la demostración debe comportarse igual en cada ensayo. */
const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

let failNext = false;
/** Permite demostrar el estado de error / "Reintentar" (RNF-006). */
export function simularFalloProximaPeticion() {
  failNext = true;
}

async function api<T>(fn: () => T, ms?: number, write = false): Promise<T> {
  await ready;
  await delay(ms);
  if (failNext) {
    failNext = false;
    throw new Error("No pudimos conectar con el servicio. Intenta de nuevo.");
  }
  const operation = queue.then(async () => {
    const before = write ? structuredClone(store) : undefined;
    try {
      const result = structuredClone(fn());
      if (write) await guardar();
      return result;
    } catch (error) {
      if (before) store = before;
      throw error;
    }
  });
  queue = operation.catch(() => undefined);
  return operation;
}

export async function resetDemo(): Promise<void> {
  await ready;
  const operation = queue.then(async () => {
    await borrarInstantanea();
    store = structuredClone(initial);
    // Tras borrar lo ilegible u obsoleto, la demo vuelve a guardar normalmente.
    persistencia = { modo: "guardando" };
  });
  queue = operation.catch(() => undefined);
  await operation;
}

const nowIso = () => new Date().toISOString();

// ---------- Categorías (RF-003) ----------

/** Equivale a `GET /categorias/`: colección completa, sin paginar. */
export function listCategories(): Promise<Category[]> {
  return api(() => store.categories, 200);
}

// ---------- Catálogo ----------

export interface CatalogFilters {
  q?: string | undefined;
  /** Código de categoría. `undefined` significa "sin filtro". */
  categoria?: string | undefined;
  precioMin?: number | undefined;
  precioMax?: number | undefined;
  artesanoId?: number | undefined;
  orden?: "recientes" | "precio-asc" | "precio-desc" | "nombre" | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function listProducts(filters: CatalogFilters = {}): Promise<Paginated<Product>> {
  return api(() => {
    const {
      q = "",
      categoria,
      precioMin,
      precioMax,
      artesanoId,
      orden = "recientes",
      page = 1,
      pageSize = 12,
    } = filters;

    let items = store.products.filter((p) => {
      if (q && !p.nombre.toLowerCase().includes(q.toLowerCase())) return false;
      if (categoria && p.categoria.codigo !== categoria) return false;
      if (precioMin != null && p.precio < precioMin) return false;
      if (precioMax != null && p.precio > precioMax) return false;
      if (artesanoId && p.artesanoId !== artesanoId) return false;
      return true;
    });

    items = [...items].sort((a, b) => {
      switch (orden) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        default:
          return b.creadoEn.localeCompare(a.creadoEn);
      }
    });

    const total = items.length;
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  });
}

export function getProduct(id: number): Promise<Product> {
  return api(() => {
    const p = store.products.find((x) => x.id === id);
    if (!p) throw new Error("No encontramos este producto.");
    return p;
  });
}

export function featuredProducts(): Promise<Product[]> {
  return api(() => store.products.slice(0, 8));
}

export function featuredArtisans(): Promise<Artisan[]> {
  return api(() => store.artisans.slice(0, 4));
}

export function listArtisans(): Promise<Artisan[]> {
  return api(() => store.artisans);
}

export function getArtisan(id: number): Promise<Artisan> {
  return api(() => {
    const a = store.artisans.find((x) => x.id === id);
    if (!a) throw new Error("No encontramos este artesano.");
    return a;
  });
}

export function countByCategory(): Promise<Record<string, number>> {
  return api(() => {
    const out: Record<string, number> = {};
    for (const p of store.products) {
      out[p.categoria.codigo] = (out[p.categoria.codigo] ?? 0) + 1;
    }
    return out;
  }, 200);
}

// ---------- Productos del artesano (RF-001 / RF-002) ----------

export interface ProductInput {
  nombre: string;
  precio: number;
  /** Código de categoría: en escritura el contrato recibe el código, no el objeto. */
  categoria: string;
  descripcion: string;
  imagen?: string | undefined;
  tipoUnidades: UnitType;
  existenciasFisicas: number;
  admitePersonalizacion: boolean;
  motivoAjuste?: string | undefined;
}

function validateProduct(input: ProductInput, previous?: Product) {
  if (!UNIT_TYPES.includes(input.tipoUnidades)) throw new Error("Selecciona el tipo de unidades.");
  if (
    !input.nombre.trim() ||
    !input.descripcion.trim() ||
    !Number.isFinite(input.precio) ||
    input.precio <= 0
  )
    throw new Error("Revisa el nombre, descripción y precio del producto.");
  const n = input.existenciasFisicas;
  if (!Number.isSafeInteger(n) || n < (previous ? 0 : 1))
    throw new Error("Las existencias deben ser un entero válido.");
  if (input.tipoUnidades === "pieza_unica" && n > 1)
    throw new Error("Una pieza única admite una sola unidad.");
  if (previous && n < previous.unidadesReservadas + previous.unidadesPorClasificar)
    throw new Error("No puedes reducir las existencias por debajo de las unidades comprometidas.");
  if (
    previous &&
    (n !== previous.existenciasFisicas || input.tipoUnidades !== previous.tipoUnidades) &&
    !input.motivoAjuste?.trim()
  )
    throw new Error("Indica el motivo del ajuste de unidades.");
}

function movement(
  p: Product,
  tipo: UnitMovement["tipo"],
  cantidad: number,
  antes: number,
  usuario: string,
  motivo?: string,
  pedidoCodigo?: string,
) {
  p.unidadesDisponibles = availableUnits(p);
  store.movements.push({
    id: nextId(store.movements),
    productoId: p.id,
    tipo,
    cantidad,
    existenciasAntes: antes,
    existenciasDespues: p.existenciasFisicas,
    usuario,
    fecha: nowIso(),
    motivo,
    pedidoCodigo,
  });
}

export function listUnitMovements(productoId: number): Promise<UnitMovement[]> {
  return api(() => store.movements.filter((m) => m.productoId === productoId));
}

/** El servidor resuelve el código recibido contra su catálogo de categorías. */
function resolverCategoria(codigo: string): Category {
  const categoria = store.categories.find((c) => c.codigo === codigo);
  if (!categoria) throw new Error("La categoría indicada no existe.");
  return categoria;
}

export function listMyProducts(artesanoId: number): Promise<Product[]> {
  return api(() => store.products.filter((p) => p.artesanoId === artesanoId));
}

export function createProduct(
  artesanoId: number,
  input: ProductInput,
  usuario = DEMO_ARTISAN_RESPONSABLE,
): Promise<Product> {
  return api(
    () => {
      validateProduct(input);
      const categoria = resolverCategoria(input.categoria);
      const nuevo: Product = {
        id: nuevoProductoId(),
        nombre: input.nombre,
        precio: input.precio,
        categoria,
        descripcion: input.descripcion,
        imagenes: [input.imagen || (CATEGORY_IMAGE[categoria.codigo] as string)],
        artesanoId,
        disponible: true,
        creadoEn: nowIso(),
        tipoUnidades: input.tipoUnidades,
        admitePersonalizacion: input.admitePersonalizacion,
        existenciasFisicas: input.existenciasFisicas,
        unidadesReservadas: 0,
        unidadesPorClasificar: 0,
        unidadesDisponibles: input.existenciasFisicas,
      };
      store.products.unshift(nuevo);
      movement(nuevo, "alta", nuevo.existenciasFisicas, 0, usuario, "Publicación del producto");
      return nuevo;
    },
    700,
    true,
  );
}

export function updateProduct(
  id: number,
  input: ProductInput,
  usuario = DEMO_ARTISAN_RESPONSABLE,
): Promise<Product> {
  return api(
    () => {
      const p = store.products.find((x) => x.id === id);
      if (!p) throw new Error("No encontramos este producto.");
      validateProduct(input, p);
      const antes = p.existenciasFisicas;
      const changed = antes !== input.existenciasFisicas || p.tipoUnidades !== input.tipoUnidades;
      p.nombre = input.nombre;
      p.precio = input.precio;
      p.categoria = resolverCategoria(input.categoria);
      p.descripcion = input.descripcion;
      p.tipoUnidades = input.tipoUnidades;
      p.admitePersonalizacion = input.admitePersonalizacion;
      p.existenciasFisicas = input.existenciasFisicas;
      p.unidadesDisponibles = availableUnits(p);
      if (changed)
        movement(p, "ajuste", input.existenciasFisicas - antes, antes, usuario, input.motivoAjuste);
      if (input.imagen) p.imagenes = [input.imagen, ...p.imagenes.slice(1)];
      return p;
    },
    700,
    true,
  );
}

export function updateArtisan(id: number, data: Partial<Artisan>): Promise<Artisan> {
  return api(
    () => {
      const a = store.artisans.find((x) => x.id === id);
      if (!a) throw new Error("No encontramos el taller.");
      Object.assign(a, data);
      return a;
    },
    600,
    true,
  );
}

/** RF-002: simulación del procesamiento/optimización de la imagen. */
export function processImage(file: File): Promise<string> {
  const error = imageFileError(file);
  return error ? Promise.reject(new Error(error)) : readAsDataUrl(file);
}

// ---------- Pedidos ----------

export function listOrders(params: {
  rol: Role;
  artesanoId?: number;
  estado?: OrderStatus | "todos" | undefined;
}): Promise<Order[]> {
  return api(() => {
    let items = store.orders;
    if (params.rol === "artesano" && params.artesanoId) {
      items = items.filter((o) => o.artesanoId === params.artesanoId);
    }
    if (params.estado && params.estado !== "todos") {
      items = items.filter((o) => o.estado === params.estado);
    }
    return [...items].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  });
}

export function getOrder(id: number): Promise<Order> {
  return api(() => {
    const o = store.orders.find((x) => x.id === id);
    if (!o) throw new Error("No encontramos este pedido.");
    return o;
  });
}

export interface OrderRequestInput {
  productoId: number;
  cantidad: number;
  personalizacion: string;
  observaciones: string;
  opcion: OrderOption;
  entregaPreferida: Order["entregaPreferida"];
}

export function createOrderRequest(input: OrderRequestInput, usuario: string): Promise<Order> {
  return api(
    () => {
      const prod = store.products.find((p) => p.id === input.productoId);
      if (!prod) throw new Error("No encontramos este producto.");
      validateQuantity(prod, input.cantidad);
      if (!["estandar", "personalizada"].includes(input.opcion))
        throw new Error("Selecciona una opción de solicitud.");
      if (
        input.opcion === "personalizada" &&
        (!prod.admitePersonalizacion || input.personalizacion.trim().length < 10)
      )
        throw new Error("Revisa los detalles de personalización.");
      if (!DELIVERY_MODES.includes(input.entregaPreferida?.modalidad))
        throw new Error("Selecciona la modalidad de entrega preferida.");
      const requiereUbicacion = ["punto_de_encuentro", "entrega_directa"].includes(
        input.entregaPreferida.modalidad,
      );
      const ubicacion = input.entregaPreferida.ubicacion?.trim();
      if (requiereUbicacion && (!ubicacion || ubicacion.length > 200))
        throw new Error(
          "Indica la ubicación donde quieres recibir el pedido (hasta 200 caracteres).",
        );
      const n = store.orders.length + 1;
      const order: Order = {
        id: nuevoPedidoId(),
        codigo: `PM-${1000 + n}`,
        productoId: prod.id,
        artesanoId: prod.artesanoId,
        compradorId: DEMO_USER_ID,
        compradorNombre: usuario,
        cantidad: input.cantidad,
        opcion: input.opcion,
        personalizacion: input.opcion === "personalizada" ? input.personalizacion.trim() : "",
        entregaPreferida: {
          ...input.entregaPreferida,
          ubicacion: requiereUbicacion ? ubicacion : undefined,
        },
        pagos: [],
        observaciones: input.observaciones,
        estado: "pendiente",
        estadoPago: "pendiente",
        precioUnitario: prod.precio,
        costosAdicionales: 0,
        costoEntrega: 0,
        creadoEn: nowIso(),
        historial: [
          {
            id: nuevoEventoId(),
            tipo: "pedido",
            estadoAnterior: "—",
            estadoNuevo: "pendiente",
            usuario,
            fecha: nowIso(),
          },
        ],
      };
      store.orders.unshift(order);
      return order;
    },
    800,
    true,
  );
}

function validateQuantity(p: Product, cantidad: number) {
  const max = maxRequestable({ ...p, unidadesDisponibles: availableUnits(p) });
  if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > max)
    throw new Error(
      `Cantidad no disponible. Puedes solicitar hasta ${max} unidades; las reservas ya están descontadas.`,
    );
}

function mutateOrder(id: number, usuario: string, fn: (o: Order) => void): Promise<Order> {
  return api(
    () => {
      const o = store.orders.find((x) => x.id === id);
      if (!o) throw new Error("No encontramos este pedido.");
      fn(o);
      void usuario;
      return o;
    },
    600,
    true,
  );
}

function pushEvent(
  o: Order,
  tipo: Order["historial"][number]["tipo"],
  anterior: string,
  nuevo: string,
  usuario: string,
  detalle?: string,
) {
  o.historial.push({
    id: nuevoEventoId(),
    tipo,
    estadoAnterior: anterior,
    estadoNuevo: nuevo,
    usuario,
    fecha: nowIso(),
    detalle,
  });
}

export function changeOrderStatus(
  id: number,
  nuevo: OrderStatus,
  usuario: string,
  motivo?: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (nuevo === "cancelado" && !canCancel(o.estado))
      throw new Error(
        "Solo puedes cancelar mientras el pedido esté Aceptado. Una vez iniciada la producción o marcado como listo, ya no puedes cancelarlo.",
      );
    if (!canTransition(o.estado, nuevo, o.opcion)) {
      throw new Error(`No se puede pasar de "${o.estado}" a "${nuevo}".`);
    }
    if (requiresConfirmedPayment(o.estado, nuevo) && o.estadoPago !== "confirmado") {
      throw new Error("Confirma el pago antes de avanzar el pedido.");
    }
    const p = store.products.find((p) => p.id === o.productoId)!;
    const antes = p.existenciasFisicas;
    if (nuevo === "rechazado" && !motivo?.trim()) throw new Error("Indica el motivo del rechazo.");
    if (nuevo === "aceptado") {
      if (!o.entrega) throw new Error("Registra la cotización de entrega antes de aceptar.");
      if (o.entrega.modalidad !== o.entregaPreferida.modalidad)
        throw new Error(
          "La cotización debe conservar la modalidad del comprador. Guarda nuevamente el costo y las notas antes de aceptar.",
        );
      validateQuantity(p, o.cantidad);
      o.cotizacionCongelada = {
        precioUnitario: o.precioUnitario,
        cantidad: o.cantidad,
        costosAdicionales: o.costosAdicionales,
        costoEntrega: o.costoEntrega,
        modalidad: o.entrega.modalidad,
        total: orderTotal(o),
        congeladaEn: nowIso(),
      };
      o.reserva = { cantidad: o.cantidad, estado: "activa" };
      p.unidadesReservadas += o.cantidad;
      movement(p, "reserva", o.cantidad, antes, usuario, "Aceptación del pedido", o.codigo);
      pushEvent(
        o,
        "unidades",
        "—",
        "—",
        usuario,
        `Reserva de ${o.cantidad} unidades; total congelado C$ ${o.cotizacionCongelada.total}`,
      );
    }
    if (nuevo === "entregado" || nuevo === "cancelado") {
      if (o.reserva?.estado !== "activa") throw new Error("El pedido no tiene una reserva activa.");
      p.unidadesReservadas -= o.cantidad;
      if (nuevo === "entregado") {
        p.existenciasFisicas -= o.cantidad;
        o.reserva.estado = "consumida";
        movement(p, "consumo", o.cantidad, antes, usuario, "Entrega del pedido", o.codigo);
      } else {
        p.unidadesPorClasificar += o.cantidad;
        o.reserva.estado = "pendiente_clasificacion";
        movement(p, "pendiente_clasificacion", o.cantidad, antes, usuario, motivo, o.codigo);
      }
      pushEvent(
        o,
        "unidades",
        "—",
        "—",
        usuario,
        nuevo === "entregado"
          ? `Entrega de ${o.cantidad} unidades`
          : `${o.cantidad} unidades pendientes de clasificación`,
      );
    }
    const anterior = o.estado;
    o.estado = nuevo;
    if (nuevo === "rechazado") o.motivoRechazo = motivo;
    if (nuevo === "cancelado") o.motivoCancelacion = motivo;
    pushEvent(o, "pedido", anterior, nuevo, usuario);
  });
}

export interface PaymentInput {
  metodo: PaymentMethod;
  referencia?: string | undefined;
  nota?: string | undefined;
  comprobante?: { nombreArchivo: string; tipo: string; tamano: number; src: string } | undefined;
}

export function registerPayment(id: number, input: PaymentInput, usuario: string): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (o.estado !== "aceptado" || !["pendiente", "no_recibido"].includes(o.estadoPago))
      throw new Error(
        "Solo puedes registrar un nuevo intento en Aceptado, sin pago vigente o tras Pago no recibido.",
      );
    if (!PAYMENT_METHODS.includes(input.metodo))
      throw new Error("Selecciona un método de pago válido.");
    validateReceipt(input.comprobante);
    const anterior = o.estadoPago;
    const intento: Order["pagos"][number] = {
      id: nextId(store.orders.flatMap((x) => x.pagos)),
      numero: o.pagos.length + 1,
      metodo: input.metodo,
      referencia: input.referencia,
      nota: input.nota,
      estado: "registrado",
      registradoEn: nowIso(),
      comprobantes: [],
      eventos: [],
    };
    o.pagos.push(intento);
    const comprobanteId = attachReceipt(o, input.comprobante, usuario);
    intento.eventos.push({
      estadoAnterior: null,
      estadoNuevo: "registrado",
      usuario,
      fecha: nowIso(),
      comprobanteId,
    });
    o.estadoPago = "registrado";
    pushEvent(o, "pago", anterior, o.estadoPago, usuario);
  });
}

function validateReceipt(file: PaymentInput["comprobante"]) {
  if (!file) return;
  const error = imageFileError({ type: file.tipo, size: file.tamano });
  if (error) throw new Error(error);
  if (!file.src.startsWith(`data:${file.tipo};base64,`) || !file.src.split(",")[1])
    throw new Error("El comprobante debe contener una imagen válida.");
}

function attachReceipt(o: Order, file: PaymentInput["comprobante"], usuario: string) {
  if (!file) return undefined;
  const id = nextId(store.receiptFiles);
  o.pagos.at(-1)!.comprobantes.push({
    id,
    nombreArchivo: file.nombreArchivo,
    tipo: file.tipo,
    tamano: file.tamano,
    subidoEn: nowIso(),
    subidoPor: usuario,
  });
  store.receiptFiles.push({ id, pedidoId: o.id, src: file.src });
  return id;
}

export function correctPayment(
  id: number,
  comprobante: NonNullable<PaymentInput["comprobante"]>,
  usuario: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    const intento = o.pagos.at(-1);
    if (o.estado !== "aceptado" || intento?.estado !== "observado")
      throw new Error("Solo se puede corregir un pago observado en un pedido Aceptado.");
    const plazo = intento.eventos.at(-1)?.plazoHasta;
    if (!plazo || Date.now() > Date.parse(plazo))
      throw new Error(
        "Venció el plazo de 48 horas. El taller debe revisar y resolver el intento; el vencimiento no cambia el estado automáticamente.",
      );
    validateReceipt(comprobante);
    const comprobanteId = attachReceipt(o, comprobante, usuario);
    intento.eventos.push({
      estadoAnterior: "observado",
      estadoNuevo: "registrado",
      usuario,
      fecha: nowIso(),
      comprobanteId,
      motivo: "Corrección del comprobante",
    });
    intento.estado = o.estadoPago = "registrado";
    pushEvent(
      o,
      "pago",
      "observado",
      "registrado",
      usuario,
      "Comprobante corregido; se conserva el anterior",
    );
  });
}

export function reviewPayment(
  id: number,
  estado: Exclude<PaymentAttemptStatus, "registrado">,
  usuario: string,
  motivo?: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    const intento = o.pagos.at(-1);
    if (
      o.estado !== "aceptado" ||
      !intento ||
      !["registrado", "observado"].includes(intento.estado)
    )
      throw new Error("Solo puedes revisar un pago registrado u observado de un pedido Aceptado.");
    if (!["confirmado", "observado", "no_recibido"].includes(estado))
      throw new Error("Resolución de pago inválida.");
    if (estado !== "confirmado" && !motivo?.trim())
      throw new Error("Indica el motivo de la resolución.");
    if (intento.estado === "observado" && estado === "observado")
      throw new Error("Espera la corrección o resuelve el pago observado; no se renueva el plazo.");
    const anterior = o.estadoPago;
    intento.eventos.push({
      estadoAnterior: intento.estado,
      estadoNuevo: estado,
      usuario,
      fecha: nowIso(),
      motivo,
      plazoHasta:
        estado === "observado" ? new Date(Date.now() + 48 * 3600000).toISOString() : undefined,
    });
    intento.estado = o.estadoPago = estado;
    pushEvent(o, "pago", anterior, estado, usuario, motivo);
  });
}

export function confirmPayment(id: number, usuario: string): Promise<Order> {
  return reviewPayment(id, "confirmado", usuario);
}

/** Simulación de autorización: no reemplaza una sesión validada por el backend. */
export function getPaymentReceipt(
  pedidoId: number,
  intentoId: number,
  comprobanteId: number,
  sesion: Pick<User, "id" | "rol" | "artesanoId"> | null,
): Promise<string> {
  return api(() => {
    const o = store.orders.find((o) => o.id === pedidoId);
    if (
      !o ||
      !sesion ||
      !(
        (sesion.rol === "comprador" && sesion.id === o.compradorId) ||
        (sesion.rol === "artesano" && sesion.artesanoId === o.artesanoId)
      )
    )
      throw new Error("Solo las partes del pedido pueden ver el comprobante.");
    if (!o.pagos.find((p) => p.id === intentoId)?.comprobantes.some((c) => c.id === comprobanteId))
      throw new Error("No encontramos este comprobante.");
    const file = store.receiptFiles.find((f) => f.pedidoId === pedidoId && f.id === comprobanteId);
    if (!file) throw new Error("No encontramos la imagen del comprobante.");
    return file.src;
  }, 100);
}

export function setDeliveryQuote(
  id: number,
  costoEntrega: number,
  notasCotizacion: string | undefined,
  usuario: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (o.estado !== "pendiente" || o.cotizacionCongelada)
      throw new Error("Solo puedes guardar la cotización mientras el pedido está Pendiente.");
    const modalidad = o.entregaPreferida.modalidad;
    if (!DELIVERY_MODES.includes(modalidad) || !Number.isFinite(costoEntrega) || costoEntrega < 0)
      throw new Error("Revisa la modalidad y el costo de entrega.");
    if (modalidad === "retiro_en_taller" && costoEntrega !== 0)
      throw new Error("Recoger en el taller cuesta C$ 0.");
    if (notasCotizacion && notasCotizacion.trim().length > 200)
      throw new Error("Las notas de cotización admiten hasta 200 caracteres.");
    o.entrega = { modalidad, notasCotizacion: notasCotizacion?.trim() || undefined };
    o.costoEntrega = costoEntrega;
    pushEvent(
      o,
      "entrega",
      "—",
      "—",
      usuario,
      `Cotización de entrega: ${DELIVERY_MODE_LABELS[modalidad]}; C$ ${costoEntrega}`,
    );
  });
}

export const setDelivery = setDeliveryQuote;

export interface DeliveryCoordinationInput {
  fechaRecogida?: string | undefined;
  detalle?: string | undefined;
}

export function setDeliveryCoordination(
  id: number,
  input: DeliveryCoordinationInput,
  usuario: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (
      !["aceptado", "en_produccion", "listo_para_entrega"].includes(o.estado) ||
      !o.entrega ||
      !o.cotizacionCongelada
    )
      throw new Error("Solo se coordina la entrega de un pedido activo ya aceptado.");
    if (o.entrega.modalidad === "retiro_en_taller") {
      const fecha = input.fechaRecogida ?? "";
      const parsed = new Date(`${fecha}T00:00:00Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== fecha
      )
        throw new Error("Selecciona una fecha válida para recoger el pedido en el taller.");
      o.entrega.fechaRecogida = fecha;
      pushEvent(o, "entrega", "—", "—", usuario, `Fecha de recogida en el taller: ${fecha}`);
    } else {
      const detalle = input.detalle?.trim();
      if (!detalle || detalle.length > 200)
        throw new Error(
          "Indica la fecha y las indicaciones de coordinación (hasta 200 caracteres).",
        );
      o.entrega.detalle = detalle;
      pushEvent(o, "entrega", "—", "—", usuario, detalle);
    }
  });
}

export function classifyCancelledUnits(
  id: number,
  disponibles: number,
  bajas: number,
  motivo: string,
  usuario: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (o.estado !== "cancelado" || o.reserva?.estado !== "pendiente_clasificacion")
      throw new Error("Este pedido no tiene unidades pendientes de clasificación.");
    if (
      ![disponibles, bajas].every((n) => Number.isSafeInteger(n) && n >= 0) ||
      disponibles + bajas !== o.reserva.cantidad ||
      !motivo.trim()
    )
      throw new Error(
        "La suma debe coincidir con las unidades reservadas. Indica el motivo de clasificación.",
      );
    const p = store.products.find((p) => p.id === o.productoId)!;
    const antes = p.existenciasFisicas;
    p.unidadesPorClasificar -= o.reserva.cantidad;
    p.existenciasFisicas -= bajas;
    Object.assign(o.reserva, {
      estado: "clasificada",
      disponiblesDevueltas: disponibles,
      bajas,
      motivoClasificacion: motivo.trim(),
    });
    if (disponibles) movement(p, "liberacion", disponibles, antes, usuario, motivo, o.codigo);
    if (bajas) movement(p, "baja", bajas, antes, usuario, motivo, o.codigo);
    p.unidadesDisponibles = availableUnits(p);
    pushEvent(
      o,
      "unidades",
      "—",
      "—",
      usuario,
      `Clasificadas: ${disponibles} disponibles y ${bajas} de baja. ${motivo.trim()}`,
    );
  });
}

// ---------- Mensajería (RF-014) ----------

export function listMessages(pedidoId: number): Promise<Message[]> {
  return api(
    () =>
      store.messages
        .filter((m) => m.pedidoId === pedidoId)
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    250,
  );
}

export function sendMessage(
  pedidoId: number,
  autor: Role,
  autorNombre: string,
  texto: string,
): Promise<Message> {
  return api(
    () => {
      const msg: Message = {
        id: nuevoMensajeId(),
        pedidoId,
        autor,
        autorNombre,
        texto,
        fecha: nowIso(),
      };
      store.messages.push(msg);
      return msg;
    },
    400,
    true,
  );
}

/**
 * RNF-010: cada consulta del polling trae únicamente los mensajes posteriores al
 * último recibido. Solo devuelve mensajes reales de las partes: el mock no los
 * inventa, para que la demostración sea reproducible.
 */
export function pollNewMessages(pedidoId: number, desde: string): Promise<Message[]> {
  return api(() => store.messages.filter((m) => m.pedidoId === pedidoId && m.fecha > desde), 200);
}

// ---------- Panel del artesano ----------

export function artisanSummary(artesanoId: number) {
  return api(() => {
    const mine = store.orders.filter((o) => o.artesanoId === artesanoId);
    return {
      solicitudesPendientes: mine.filter((o) => o.estado === "pendiente").length,
      activos: mine.filter((o) =>
        ["aceptado", "en_produccion", "listo_para_entrega"].includes(o.estado),
      ).length,
      pagosPorConfirmar: mine.filter((o) => o.estadoPago === "registrado").length,
      porEstado: mine.reduce<Record<string, number>>((acc, o) => {
        acc[o.estado] = (acc[o.estado] ?? 0) + 1;
        return acc;
      }, {}),
      productos: store.products.filter((p) => p.artesanoId === artesanoId).length,
    };
  });
}
