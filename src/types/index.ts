/**
 * Recurso propio del backend (`GET /categorias/`), no una lista fija del
 * frontend: un administrador puede añadir rubros sin desplegar la interfaz.
 *
 * Se anida completo en lectura y viaja solo por `codigo` en escritura, en los
 * filtros y en la URL. `nombre` es la etiqueta presentable; `codigo` es el
 * valor estable del dominio.
 */
export interface Category {
  id: number;
  codigo: string;
  nombre: string;
}

export type Role = "comprador" | "artesano";

export interface User {
  id: number;
  nombre: string;
  telefono: string;
  rol: Role;
  artesanoId?: number;
}

export interface Artisan {
  id: number;
  nombreTaller: string;
  responsable: string;
  historia: string;
  descripcion: string;
  rubro: Category;
  ubicacion: string;
  horario: string;
  telefono: string;
  whatsapp: string;
  redes: { facebook?: string; instagram?: string };
  fotoUrl: string;
  portadaUrl: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number; // en córdobas
  categoria: Category;
  descripcion: string;
  imagenes: string[];
  artesanoId: number;
  disponible: boolean;
  creadoEn: string;
}

/**
 * Códigos de dominio. Son estables y viajan por la API; el texto que ve la
 * persona usuaria vive en `src/lib/labels.ts`. No usar estos valores como
 * etiqueta visible ni redactar UI a partir de ellos.
 */
export const ORDER_STATES = [
  "pendiente",
  "aceptado",
  "en_produccion",
  "listo_para_entrega",
  "entregado",
  "rechazado",
  "cancelado",
] as const;
export type OrderStatus = (typeof ORDER_STATES)[number];

export const PAYMENT_STATES = ["pendiente", "registrado", "confirmado"] as const;
export type PaymentStatus = (typeof PAYMENT_STATES)[number];

export const DELIVERY_MODES = [
  "retiro_en_taller",
  "punto_de_encuentro",
  "entrega_directa",
  "otra",
] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];

/** RF-011 v3.0: no existe el pago contra entrega. */
export const PAYMENT_METHODS = ["transferencia", "otro"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface AuditEvent {
  id: number;
  tipo: "pedido" | "pago";
  estadoAnterior: string;
  estadoNuevo: string;
  usuario: string;
  fecha: string; // ISO
}

export interface Message {
  id: number;
  pedidoId: number;
  autor: Role;
  autorNombre: string;
  texto: string;
  fecha: string;
}

export interface Order {
  id: number;
  /** Código de negocio visible ("PM-1009"), no un identificador. */
  codigo: string;
  productoId: number;
  artesanoId: number;
  compradorId: number;
  compradorNombre: string;
  cantidad: number;
  personalizacion: string;
  observaciones: string;
  estado: OrderStatus;
  estadoPago: PaymentStatus;
  precioUnitario: number;
  costosAdicionales: number;
  costoEntrega: number;
  entrega?: { modalidad: DeliveryMode; detalle?: string | undefined };
  pago?: {
    metodo: PaymentMethod;
    referencia?: string | undefined;
    comprobanteNombre?: string | undefined;
    nota?: string | undefined;
    registradoEn: string;
  };
  motivoCancelacion?: string | undefined;
  motivoRechazo?: string | undefined;
  creadoEn: string;
  historial: AuditEvent[];
}
