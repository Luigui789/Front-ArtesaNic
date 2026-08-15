export const CATEGORIES = [
  "Cuero y calzado",
  "Hamacas",
  "Madera",
  "Textiles",
  "Dulces",
  "Otros",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Role = "comprador" | "artesano";

export interface User {
  id: string;
  nombre: string;
  telefono: string;
  rol: Role;
  artesanoId?: string;
}

export interface Artisan {
  id: string;
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
  id: string;
  nombre: string;
  precio: number; // en córdobas
  categoria: Category;
  descripcion: string;
  imagenes: string[];
  artesanoId: string;
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
  id: string;
  tipo: "pedido" | "pago";
  estadoAnterior: string;
  estadoNuevo: string;
  usuario: string;
  fecha: string; // ISO
}

export interface Message {
  id: string;
  pedidoId: string;
  autor: Role;
  autorNombre: string;
  texto: string;
  fecha: string;
}

export interface Order {
  id: string;
  codigo: string;
  productoId: string;
  artesanoId: string;
  compradorId: string;
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
