import type { OrderOption, OrderStatus } from "@/types";

/**
 * RF-010 v3.0: la ruta depende de la composición del pedido. Un pedido con
 * personalización pasa por producción; uno solo con unidades estándar va de
 * Aceptado a Listo para entrega. Opera sobre códigos, nunca sobre etiquetas.
 */
export function orderFlow(opcion: OrderOption): OrderStatus[] {
  return opcion === "personalizada"
    ? ["pendiente", "aceptado", "en_produccion", "listo_para_entrega", "entregado"]
    : ["pendiente", "aceptado", "listo_para_entrega", "entregado"];
}

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pendiente: ["aceptado", "rechazado"],
  aceptado: ["en_produccion", "listo_para_entrega", "cancelado"],
  en_produccion: ["listo_para_entrega"],
  listo_para_entrega: ["entregado"],
  entregado: [],
  rechazado: [],
  cancelado: [],
};

export function nextOrderStates(estado: OrderStatus, opcion: OrderOption): OrderStatus[] {
  if (estado !== "aceptado") return TRANSITIONS[estado];
  // Desde Aceptado, la siguiente etapa la decide la opción del pedido.
  const omitida: OrderStatus = opcion === "personalizada" ? "listo_para_entrega" : "en_produccion";
  return TRANSITIONS.aceptado.filter((s) => s !== omitida);
}

export function canTransition(from: OrderStatus, to: OrderStatus, opcion: OrderOption): boolean {
  return nextOrderStates(from, opcion).includes(to);
}

/**
 * RF-010 v3.0 / RF-011: salir de Aceptado hacia la etapa siguiente —producción
 * o, en un pedido estándar, Listo para entrega— exige pago confirmado.
 */
export function requiresConfirmedPayment(from: OrderStatus, to: OrderStatus): boolean {
  return from === "aceptado" && (to === "en_produccion" || to === "listo_para_entrega");
}

export function isTerminal(estado: OrderStatus): boolean {
  return TRANSITIONS[estado].length === 0;
}

/** Revisión de Luis, 1-oct-2026: el comprador solo cancela desde Aceptado. */
export function canCancel(estado: OrderStatus): boolean {
  return estado === "aceptado";
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
