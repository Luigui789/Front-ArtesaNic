/**
 * Capa de servicios MOCK.
 * Simula una API REST (latencia, errores, mutaciones) sobre un store en memoria.
 * Puede reemplazarse por llamadas reales a Django REST Framework sin tocar la UI.
 */
import {
  buildArtisans,
  buildMessages,
  buildOrders,
  buildProducts,
  CATEGORY_IMAGE,
  MENSAJES_ENTRANTES,
} from "@/data/seed";
import { canTransition, nextPaymentState } from "@/lib/order-state";
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
} from "@/types";

const artisans = buildArtisans();
const products = buildProducts(artisans);
const orders = buildOrders(products);
const messages = buildMessages();

const store = { artisans, products, orders, messages };

/** Artesano cuyo panel se demuestra en el prototipo. */
export const DEMO_ARTISAN_ID = "art-1";

const delay = (ms = 350 + Math.random() * 350) => new Promise((r) => setTimeout(r, ms));

let failNext = false;
/** Permite demostrar el estado de error / "Reintentar" (RNF-006). */
export function simularFalloProximaPeticion() {
  failNext = true;
}

async function api<T>(fn: () => T, ms?: number): Promise<T> {
  await delay(ms);
  if (failNext) {
    failNext = false;
    throw new Error("No pudimos conectar con el servicio. Intenta de nuevo.");
  }
  return structuredClone(fn());
}

const nowIso = () => new Date().toISOString();

// ---------- Catálogo ----------

export interface CatalogFilters {
  q?: string;
  categoria?: Category | "todas";
  precioMin?: number;
  precioMax?: number;
  artesanoId?: string;
  orden?: "recientes" | "precio-asc" | "precio-desc" | "nombre";
  page?: number;
  pageSize?: number;
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
      categoria = "todas",
      precioMin,
      precioMax,
      artesanoId,
      orden = "recientes",
      page = 1,
      pageSize = 12,
    } = filters;

    let items = store.products.filter((p) => {
      if (q && !p.nombre.toLowerCase().includes(q.toLowerCase())) return false;
      if (categoria !== "todas" && p.categoria !== categoria) return false;
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

export function getProduct(id: string): Promise<Product> {
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

export function getArtisan(id: string): Promise<Artisan> {
  return api(() => {
    const a = store.artisans.find((x) => x.id === id);
    if (!a) throw new Error("No encontramos este artesano.");
    return a;
  });
}

export function countByCategory(): Promise<Record<string, number>> {
  return api(() => {
    const out: Record<string, number> = {};
    for (const p of store.products) out[p.categoria] = (out[p.categoria] ?? 0) + 1;
    return out;
  }, 200);
}

// ---------- Productos del artesano (RF-001 / RF-002) ----------

export interface ProductInput {
  nombre: string;
  precio: number;
  categoria: Category;
  descripcion: string;
  imagen?: string;
}

export function listMyProducts(artesanoId: string): Promise<Product[]> {
  return api(() => store.products.filter((p) => p.artesanoId === artesanoId));
}

export function createProduct(artesanoId: string, input: ProductInput): Promise<Product> {
  return api(() => {
    const nuevo: Product = {
      id: `prod-n-${Date.now()}`,
      nombre: input.nombre,
      precio: input.precio,
      categoria: input.categoria,
      descripcion: input.descripcion,
      imagenes: [input.imagen || CATEGORY_IMAGE[input.categoria]],
      artesanoId,
      disponible: true,
      creadoEn: nowIso(),
    };
    store.products.unshift(nuevo);
    return nuevo;
  }, 700);
}

export function updateProduct(id: string, input: ProductInput): Promise<Product> {
  return api(() => {
    const p = store.products.find((x) => x.id === id);
    if (!p) throw new Error("No encontramos este producto.");
    p.nombre = input.nombre;
    p.precio = input.precio;
    p.categoria = input.categoria;
    p.descripcion = input.descripcion;
    if (input.imagen) p.imagenes = [input.imagen, ...p.imagenes.slice(1)];
    return p;
  }, 700);
}

export function updateArtisan(id: string, data: Partial<Artisan>): Promise<Artisan> {
  return api(() => {
    const a = store.artisans.find((x) => x.id === id);
    if (!a) throw new Error("No encontramos el taller.");
    Object.assign(a, data);
    return a;
  }, 600);
}

/** RF-002: simulación del procesamiento/optimización de la imagen. */
export function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo debe ser una imagen (JPG o PNG)."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("La imagen es muy pesada. Usa una de menos de 5 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No pudimos leer la imagen. Intenta con otra."));
    reader.onload = () => setTimeout(() => resolve(String(reader.result)), 1200);
    reader.readAsDataURL(file);
  });
}

// ---------- Pedidos ----------

export function listOrders(params: {
  rol: Role;
  artesanoId?: string;
  estado?: OrderStatus | "todos";
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

export function getOrder(id: string): Promise<Order> {
  return api(() => {
    const o = store.orders.find((x) => x.id === id);
    if (!o) throw new Error("No encontramos este pedido.");
    return o;
  });
}

export interface OrderRequestInput {
  productoId: string;
  cantidad: number;
  personalizacion: string;
  observaciones: string;
}

export function createOrderRequest(input: OrderRequestInput, usuario: string): Promise<Order> {
  return api(() => {
    const prod = store.products.find((p) => p.id === input.productoId);
    if (!prod) throw new Error("No encontramos este producto.");
    const n = store.orders.length + 1;
    const order: Order = {
      id: `ped-n-${Date.now()}`,
      codigo: `PM-${1000 + n}`,
      productoId: prod.id,
      artesanoId: prod.artesanoId,
      compradorId: "user-comprador",
      compradorNombre: usuario,
      cantidad: input.cantidad,
      personalizacion: input.personalizacion,
      observaciones: input.observaciones,
      estado: "Pendiente",
      estadoPago: "Pendiente de pago",
      precioUnitario: prod.precio,
      costosAdicionales: 0,
      costoEntrega: 0,
      creadoEn: nowIso(),
      historial: [
        {
          id: `ev-${Date.now()}`,
          tipo: "pedido",
          estadoAnterior: "—",
          estadoNuevo: "Pendiente",
          usuario,
          fecha: nowIso(),
        },
      ],
    };
    store.orders.unshift(order);
    return order;
  }, 800);
}

function mutateOrder(id: string, usuario: string, fn: (o: Order) => void): Promise<Order> {
  return api(() => {
    const o = store.orders.find((x) => x.id === id);
    if (!o) throw new Error("No encontramos este pedido.");
    fn(o);
    void usuario;
    return o;
  }, 600);
}

function pushEvent(o: Order, tipo: "pedido" | "pago", anterior: string, nuevo: string, usuario: string) {
  o.historial.push({
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo,
    estadoAnterior: anterior,
    estadoNuevo: nuevo,
    usuario,
    fecha: nowIso(),
  });
}

export function changeOrderStatus(
  id: string,
  nuevo: OrderStatus,
  usuario: string,
  motivo?: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (!canTransition(o.estado, nuevo)) {
      throw new Error(`No se puede pasar de "${o.estado}" a "${nuevo}".`);
    }
    const anterior = o.estado;
    o.estado = nuevo;
    if (nuevo === "Rechazado") o.motivoRechazo = motivo;
    if (nuevo === "Cancelado") o.motivoCancelacion = motivo;
    pushEvent(o, "pedido", anterior, nuevo, usuario);
  });
}

export interface PaymentInput {
  metodo: PaymentMethod;
  referencia?: string;
  comprobanteNombre?: string;
  nota?: string;
}

export function registerPayment(id: string, input: PaymentInput, usuario: string): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    if (o.estadoPago !== "Pendiente de pago") {
      throw new Error("Este pedido ya tiene un pago registrado.");
    }
    const anterior = o.estadoPago;
    o.estadoPago = "Pago registrado";
    o.pago = { ...input, registradoEn: nowIso() };
    pushEvent(o, "pago", anterior, o.estadoPago, usuario);
  });
}

export function confirmPayment(id: string, usuario: string): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    const siguiente = nextPaymentState(o.estadoPago);
    if (o.estadoPago !== "Pago registrado" || !siguiente) {
      throw new Error("Solo se puede confirmar un pago que ya fue registrado.");
    }
    const anterior = o.estadoPago;
    o.estadoPago = siguiente;
    pushEvent(o, "pago", anterior, siguiente, usuario);
  });
}

export function setDelivery(
  id: string,
  modalidad: DeliveryMode,
  detalle: string | undefined,
  costoEntrega: number,
  usuario: string,
): Promise<Order> {
  return mutateOrder(id, usuario, (o) => {
    o.entrega = { modalidad, detalle };
    o.costoEntrega = costoEntrega;
  });
}

// ---------- Mensajería (RF-014) ----------

export function listMessages(pedidoId: string): Promise<Message[]> {
  return api(() =>
    store.messages
      .filter((m) => m.pedidoId === pedidoId)
      .sort((a, b) => a.fecha.localeCompare(b.fecha)),
  , 250);
}

export function sendMessage(
  pedidoId: string,
  autor: Role,
  autorNombre: string,
  texto: string,
): Promise<Message> {
  return api(() => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      pedidoId,
      autor,
      autorNombre,
      texto,
      fecha: nowIso(),
    };
    store.messages.push(msg);
    return msg;
  }, 400);
}

/** RNF-010: cada consulta del polling puede traer únicamente mensajes nuevos. */
export function pollNewMessages(pedidoId: string, desde: string): Promise<Message[]> {
  return api(() => {
    const order = store.orders.find((o) => o.id === pedidoId);
    const activo =
      order && ["Aceptado", "En producción", "Listo para entrega"].includes(order.estado);
    if (activo && Math.random() < 0.45) {
      const texto = MENSAJES_ENTRANTES[
        Math.floor(Math.random() * MENSAJES_ENTRANTES.length)
      ] as string;
      store.messages.push({
        id: `msg-${Date.now()}`,
        pedidoId,
        autor: "artesano",
        autorNombre: "Taller artesanal",
        texto,
        fecha: nowIso(),
      });
    }
    return store.messages.filter((m) => m.pedidoId === pedidoId && m.fecha > desde);
  }, 200);
}

// ---------- Panel del artesano ----------

export function artisanSummary(artesanoId: string) {
  return api(() => {
    const mine = store.orders.filter((o) => o.artesanoId === artesanoId);
    return {
      solicitudesPendientes: mine.filter((o) => o.estado === "Pendiente").length,
      activos: mine.filter((o) =>
        ["Aceptado", "En producción", "Listo para entrega"].includes(o.estado),
      ).length,
      pagosPorConfirmar: mine.filter((o) => o.estadoPago === "Pago registrado").length,
      porEstado: mine.reduce<Record<string, number>>((acc, o) => {
        acc[o.estado] = (acc[o.estado] ?? 0) + 1;
        return acc;
      }, {}),
      productos: store.products.filter((p) => p.artesanoId === artesanoId).length,
    };
  });
}
