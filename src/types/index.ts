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

export const ORDER_STATES = [
  "Pendiente",
  "Aceptado",
  "En producción",
  "Listo para entrega",
  "Entregado",
  "Rechazado",
  "Cancelado",
] as const;
export type OrderStatus = (typeof ORDER_STATES)[number];

export const PAYMENT_STATES = [
  "Pendiente de pago",
  "Pago registrado",
  "Pago confirmado",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATES)[number];

export type DeliveryMode =
  | "Retiro en taller"
  | "Punto de encuentro"
  | "Entrega directa por el artesano"
  | "Otra";

export type PaymentMethod = "Transferencia" | "Pago contra entrega" | "Otro método";

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
  entrega?: { modalidad: DeliveryMode; detalle?: string };
  pago?: {
    metodo: PaymentMethod;
    referencia?: string;
    comprobanteNombre?: string;
    nota?: string;
    registradoEn: string;
  };
  motivoCancelacion?: string;
  motivoRechazo?: string;
  creadoEn: string;
  historial: AuditEvent[];
}
