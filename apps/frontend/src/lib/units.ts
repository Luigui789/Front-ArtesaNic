import type { Product } from "@/types";

/**
 * RF-022: disponibles = físicas − reservadas. Las unidades pendientes de
 * clasificación siguen comprometidas: no vuelven al catálogo hasta que el
 * artesano las clasifica (D22).
 */
export function availableUnits(
  p: Pick<Product, "existenciasFisicas" | "unidadesReservadas" | "unidadesPorClasificar">,
): number {
  return Math.max(0, p.existenciasFisicas - p.unidadesReservadas - p.unidadesPorClasificar);
}

/**
 * Cantidad máxima que puede pedirse en una solicitud. Una pieza única nunca
 * admite más de una unidad, aunque se pida personalizada.
 */
export function maxRequestable(p: Pick<Product, "tipoUnidades" | "unidadesDisponibles">): number {
  return p.tipoUnidades === "pieza_unica"
    ? Math.min(1, p.unidadesDisponibles)
    : p.unidadesDisponibles;
}
