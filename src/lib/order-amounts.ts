import type { DeliveryMode, Order } from "@/types";

/**
 * RF-006: total del pedido = precio del producto × cantidad + costos adicionales
 * + costo de entrega. Es el único cálculo del total en la interfaz, para que
 * todas las pantallas muestren el mismo monto.
 */
export function orderTotal(
  o: Pick<Order, "precioUnitario" | "cantidad" | "costosAdicionales" | "costoEntrega">,
): number {
  return o.precioUnitario * o.cantidad + o.costosAdicionales + o.costoEntrega;
}

export interface OrderBreakdown {
  precioUnitario: number;
  cantidad: number;
  costosAdicionales: number;
  costoEntrega: number;
  total: number;
  /** Modalidad registrada por el artesano; `undefined` mientras no la registre. */
  modalidad: DeliveryMode | undefined;
  /** `true` desde la aceptación: los importes ya no cambian (RF-006). */
  congelado: boolean;
  congeladaEn: string | undefined;
}

/**
 * Desglose vigente: el congelado al aceptar o, en Pendiente, la cotización en
 * curso. Antes de que el artesano registre la entrega, su costo no se conoce.
 */
export function orderBreakdown(o: Order): OrderBreakdown {
  const c = o.cotizacionCongelada;
  if (c) {
    return { ...c, congelado: true };
  }
  return {
    precioUnitario: o.precioUnitario,
    cantidad: o.cantidad,
    costosAdicionales: o.costosAdicionales,
    costoEntrega: o.costoEntrega,
    total: orderTotal(o),
    modalidad: o.entrega?.modalidad,
    congelado: false,
    congeladaEn: undefined,
  };
}
