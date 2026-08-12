import { Ban, CheckCircle2, Clock, Hammer, PackageCheck, ThumbsUp, XCircle } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";

const ORDER_STYLE: Record<OrderStatus, { icon: typeof Clock; className: string }> = {
  Pendiente: { icon: Clock, className: "bg-surface text-surface-foreground border-border" },
  Aceptado: { icon: ThumbsUp, className: "bg-secondary/10 text-secondary border-secondary/30" },
  "En producción": { icon: Hammer, className: "bg-accent/25 text-accent-foreground border-accent/50" },
  "Listo para entrega": {
    icon: PackageCheck,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  Entregado: { icon: CheckCircle2, className: "bg-success/10 text-success border-success/30" },
  Rechazado: { icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/30" },
  Cancelado: { icon: Ban, className: "bg-muted text-muted-foreground border-border" },
};

const PAYMENT_STYLE: Record<PaymentStatus, { icon: typeof Clock; className: string }> = {
  "Pendiente de pago": { icon: Clock, className: "bg-surface text-surface-foreground border-border" },
  "Pago registrado": { icon: PackageCheck, className: "bg-accent/25 text-accent-foreground border-accent/50" },
  "Pago confirmado": { icon: CheckCircle2, className: "bg-success/10 text-success border-success/30" },
};

function BaseBadge({
  label,
  prefijo,
  icon: Icon,
  className,
}: {
  label: string;
  prefijo: string;
  icon: typeof Clock;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span>
        <span className="sr-only">{prefijo}: </span>
        {label}
      </span>
    </span>
  );
}

/** RF-010: estado del pedido, siempre con icono + texto (nunca solo color). */
export function OrderStatusBadge({ estado }: { estado: OrderStatus }) {
  const s = ORDER_STYLE[estado];
  return <BaseBadge label={estado} prefijo="Estado del pedido" icon={s.icon} className={s.className} />;
}

/** RF-011: estado del pago, independiente del estado del pedido. */
export function PaymentStatusBadge({ estado }: { estado: PaymentStatus }) {
  const s = PAYMENT_STYLE[estado];
  return <BaseBadge label={estado} prefijo="Estado del pago" icon={s.icon} className={s.className} />;
}

export function StatusPair({
  estado,
  estadoPago,
}: {
  estado: OrderStatus;
  estadoPago: PaymentStatus;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">Pedido</span>
      <OrderStatusBadge estado={estado} />
      <span className="text-xs uppercase tracking-wide text-muted-foreground">Pago</span>
      <PaymentStatusBadge estado={estadoPago} />
    </div>
  );
}
