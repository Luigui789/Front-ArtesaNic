/**
 * Capa de presentación de los códigos de dominio.
 *
 * Los códigos (`en_produccion`) son estables y viajan por la API; las etiquetas
 * ("En producción") son texto de interfaz y pueden reescribirse sin migrar datos
 * ni romper el contrato. Ningún componente debe mostrar un código directamente.
 */
import type {
  Category,
  DeliveryMode,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
} from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  aceptado: "Aceptado",
  en_produccion: "En producción",
  listo_para_entrega: "Listo para entrega",
  entregado: "Entregado",
  rechazado: "Rechazado",
  cancelado: "Cancelado",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendiente: "Pendiente de pago",
  registrado: "Pago registrado",
  confirmado: "Pago confirmado",
};

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  retiro_en_taller: "Retiro en taller",
  punto_de_encuentro: "Punto de encuentro",
  entrega_directa: "Entrega directa por el artesano",
  otra: "Otra",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  transferencia: "Transferencia",
  otro: "Otro método",
};

export const ROLE_LABELS: Record<Role, string> = {
  comprador: "Comprador",
  artesano: "Artesano",
};

/**
 * RNF-008: los eventos de auditoría guardan el código del estado en un campo de
 * texto libre, y el diccionario aplicable depende de si el evento es de pedido o
 * de pago. Un valor sin traducción conocida (como el "—" del evento inicial) se
 * devuelve tal cual.
 */
export function auditStateLabel(tipo: "pedido" | "pago", codigo: string): string {
  const dict: Record<string, string> =
    tipo === "pedido" ? ORDER_STATUS_LABELS : PAYMENT_STATUS_LABELS;
  return dict[codigo] ?? codigo;
}

/**
 * Las categorías conservan por ahora su texto como valor (fase C pendiente:
 * pasarán a ser una entidad servida por `GET /categorias/`). Esta función existe
 * para que los componentes ya consulten la etiqueta a través de esta capa y no
 * haya que tocarlos de nuevo cuando llegue ese cambio.
 */
export function categoryLabel(categoria: Category): string {
  return categoria;
}
