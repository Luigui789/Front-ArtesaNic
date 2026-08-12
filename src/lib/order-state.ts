import type { OrderStatus, PaymentStatus } from "@/types";

/** RF-010: máquina de estados del pedido. */
export const ORDER_FLOW: OrderStatus[] = [
  "Pendiente",
  "Aceptado",
  "En producción",
  "Listo para entrega",
  "Entregado",
];

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pendiente: ["Aceptado", "Rechazado"],
  Aceptado: ["En producción", "Cancelado"],
  "En producción": ["Listo para entrega", "Cancelado"],
  "Listo para entrega": ["Entregado"],
  Entregado: [],
  Rechazado: [],
  Cancelado: [],
};

export function nextOrderStates(estado: OrderStatus): OrderStatus[] {
  return TRANSITIONS[estado];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function isTerminal(estado: OrderStatus): boolean {
  return TRANSITIONS[estado].length === 0;
}

/** RF-015: solo se puede cancelar en Aceptado y En producción. */
export function canCancel(estado: OrderStatus): boolean {
  return estado === "Aceptado" || estado === "En producción";
}

/** RF-014: reglas del chat asociado al pedido. */
export type ChatMode = "disabled" | "none" | "active" | "readonly";

export function chatMode(estado: OrderStatus): ChatMode {
  switch (estado) {
    case "Pendiente":
      return "disabled";
    case "Rechazado":
      return "none";
    case "Aceptado":
    case "En producción":
    case "Listo para entrega":
      return "active";
    default:
      return "readonly";
  }
}

/** RF-011: máquina de estados del pago (independiente del pedido). */
export const PAYMENT_FLOW: PaymentStatus[] = [
  "Pendiente de pago",
  "Pago registrado",
  "Pago confirmado",
];

export function nextPaymentState(estado: PaymentStatus): PaymentStatus | null {
  const i = PAYMENT_FLOW.indexOf(estado);
  return i >= 0 && i < PAYMENT_FLOW.length - 1 ? PAYMENT_FLOW[i + 1] : null;
}
