import type { OrderStatus, PaymentStatus } from "@/types";

/** RF-010: máquina de estados del pedido. Opera sobre códigos, nunca sobre etiquetas. */
export const ORDER_FLOW: OrderStatus[] = [
  "pendiente",
  "aceptado",
  "en_produccion",
  "listo_para_entrega",
  "entregado",
];

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pendiente: ["aceptado", "rechazado"],
  aceptado: ["en_produccion", "cancelado"],
  en_produccion: ["listo_para_entrega", "cancelado"],
  listo_para_entrega: ["entregado"],
  entregado: [],
  rechazado: [],
  cancelado: [],
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
  return estado === "aceptado" || estado === "en_produccion";
}

/** RF-014: reglas del chat asociado al pedido. */
export type ChatMode = "disabled" | "none" | "active" | "readonly";

export function chatMode(estado: OrderStatus): ChatMode {
  switch (estado) {
    case "pendiente":
      return "disabled";
    case "rechazado":
      return "none";
    case "aceptado":
    case "en_produccion":
    case "listo_para_entrega":
      return "active";
    default:
      return "readonly";
  }
}

/** RF-011: máquina de estados del pago. */
export const PAYMENT_FLOW: PaymentStatus[] = ["pendiente", "registrado", "confirmado"];

export function nextPaymentState(estado: PaymentStatus): PaymentStatus | null {
  const i = PAYMENT_FLOW.indexOf(estado);
  return i >= 0 && i < PAYMENT_FLOW.length - 1 ? (PAYMENT_FLOW[i + 1] ?? null) : null;
}
