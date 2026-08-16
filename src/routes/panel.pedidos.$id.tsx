import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { ErrorState } from "@/components/common/states";
import { StatusPair } from "@/components/pedidos/status-badges";
import { AuditTimeline, OrderTimeline } from "@/components/pedidos/timelines";
import { OrderChat } from "@/components/pedidos/order-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  changeOrderStatus,
  confirmPayment,
  getOrder,
  getProduct,
  setDelivery,
} from "@/services/mock-api";
import { nextOrderStates } from "@/lib/order-state";
import { formatDateTime } from "@/lib/format";
import { useCurrency } from "@/hooks/use-currency";
import { useSession } from "@/hooks/use-session";
import { useDocumentHead } from "@/hooks/use-document-head";
import {
  DELIVERY_MODE_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/labels";
import { DELIVERY_MODES, type DeliveryMode, type OrderStatus } from "@/types";
import { parseRouteId } from "@/lib/route-id";
import { NotFound } from "@/app/not-found";

const MODALIDADES: DeliveryMode[] = [...DELIVERY_MODES];

export default function GestionPedido() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseRouteId(idParam);
  const queryClient = useQueryClient();
  const { format } = useCurrency();
  const { usuario } = useSession();
  const autor = usuario?.nombre ?? "Artesano";

  useDocumentHead({
    title: "Gestión del pedido | Panel del artesano",
    meta: [
      {
        name: "description",
        content:
          "Acepta o rechaza la solicitud, actualiza producción, define la entrega y confirma el pago del pedido.",
      },
      { property: "og:title", content: "Gestión del pedido | Panel del artesano" },
      { property: "og:description", content: "Control del flujo del pedido bajo demanda." },
      { property: "og:url", content: `/panel/pedidos/${id}` },
      { name: "robots", content: "noindex" },
    ],
    canonical: `/panel/pedidos/${id}`,
  });

  const [motivo, setMotivo] = useState("");
  const [rechazoAbierto, setRechazoAbierto] = useState(false);
  const [modalidad, setModalidad] = useState<DeliveryMode>("retiro_en_taller");
  const [detalle, setDetalle] = useState("");
  const [costo, setCosto] = useState("0");

  const pedido = useQuery({
    queryKey: ["pedido", id],
    queryFn: () => getOrder(id!),
    enabled: id !== undefined,
  });
  const producto = useQuery({
    queryKey: ["producto", pedido.data?.productoId],
    queryFn: () => getProduct(pedido.data!.productoId),
    enabled: !!pedido.data,
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["pedido", id] });
    void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    void queryClient.invalidateQueries({ queryKey: ["resumen-artesano"] });
  };

  const cambiar = useMutation({
    mutationFn: (v: { estado: OrderStatus; motivo?: string }) =>
      changeOrderStatus(id!, v.estado, autor, v.motivo),
    onSuccess: (o) => {
      refrescar();
      setRechazoAbierto(false);
      toast.success(`Pedido actualizado a "${ORDER_STATUS_LABELS[o.estado]}"`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const confirmar = useMutation({
    mutationFn: () => confirmPayment(id!, autor),
    onSuccess: () => {
      refrescar();
      toast.success("Pago confirmado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const entrega = useMutation({
    mutationFn: () =>
      setDelivery(id!, modalidad, detalle.trim() || undefined, Number(costo) || 0, autor),
    onSuccess: () => {
      refrescar();
      toast.success("Datos de entrega guardados");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (id === undefined) return <NotFound />;

  if (pedido.isError) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <ErrorState mensaje="No pudimos cargar este pedido." onRetry={() => void pedido.refetch()} />
        </div>
      </SiteLayout>
    );
  }

  if (pedido.isPending) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </SiteLayout>
    );
  }

  const o = pedido.data;
  const siguientes = nextOrderStates(o.estado).filter((s) => s !== "cancelado");
  const total = o.precioUnitario * o.cantidad + o.costosAdicionales + o.costoEntrega;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/panel/pedidos"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a pedidos
        </Link>

        <header className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold">Pedido {o.codigo}</h1>
            <p className="text-sm text-muted-foreground">
              {o.compradorNombre} · {formatDateTime(o.creadoEn)}
            </p>
          </div>
          <StatusPair estado={o.estado} estadoPago={o.estadoPago} />
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section className="rounded-xl border bg-card p-5" aria-labelledby="solicitud">
              <h2 id="solicitud" className="text-base font-semibold">
                Solicitud del comprador
              </h2>
              <div className="mt-3 flex gap-3">
                {producto.data ? (
                  <img
                    src={producto.data.imagenes[0]}
                    alt=""
                    className="size-16 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="font-medium">{producto.data?.nombre ?? "Producto artesanal"}</p>
                  <p className="text-sm text-muted-foreground">
                    Cantidad: {o.cantidad} · {format(o.precioUnitario * o.cantidad)}
                  </p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="font-medium">Personalización</dt>
                  <dd className="text-muted-foreground">{o.personalizacion}</dd>
                </div>
                {o.observaciones ? (
                  <div>
                    <dt className="font-medium">Observaciones</dt>
                    <dd className="text-muted-foreground">{o.observaciones}</dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section className="rounded-xl border bg-card p-5" aria-labelledby="avance">
              <h2 id="avance" className="text-base font-semibold">
                Avance del pedido
              </h2>
              <div className="mt-4">
                <OrderTimeline estado={o.estado} />
              </div>
            </section>

            <section aria-labelledby="mensajes">
              <h2 id="mensajes" className="sr-only">
                Mensajería con el comprador
              </h2>
              <OrderChat pedidoId={o.id} estado={o.estado} />
            </section>

            <section className="rounded-xl border bg-card p-5" aria-labelledby="historial">
              <h2 id="historial" className="text-base font-semibold">
                Historial y trazabilidad
              </h2>
              <div className="mt-4">
                <AuditTimeline eventos={o.historial} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border bg-card p-5" aria-labelledby="acciones">
              <h2 id="acciones" className="text-base font-semibold">
                Acciones
              </h2>
              {siguientes.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Este pedido ya llegó a un estado final.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {siguientes
                    .filter((s) => s !== "rechazado")
                    .map((s) => (
                      <Button
                        key={s}
                        className="w-full touch-target"
                        disabled={cambiar.isPending}
                        onClick={() => cambiar.mutate({ estado: s })}
                      >
                        {s === "aceptado"
                          ? "Aceptar solicitud"
                          : `Marcar como "${ORDER_STATUS_LABELS[s]}"`}
                      </Button>
                    ))}

                  {siguientes.includes("rechazado") ? (
                    <Dialog open={rechazoAbierto} onOpenChange={setRechazoAbierto}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full touch-target">
                          Rechazar solicitud
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rechazar solicitud</DialogTitle>
                          <DialogDescription>
                            Explica el motivo para que el comprador entienda la decisión.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="motivo-rechazo">Motivo *</Label>
                          <Textarea
                            id="motivo-rechazo"
                            rows={4}
                            maxLength={200}
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                          />
                        </div>
                        <Button
                          className="touch-target"
                          disabled={motivo.trim().length < 5 || cambiar.isPending}
                          onClick={() => cambiar.mutate({ estado: "rechazado", motivo: motivo.trim() })}
                        >
                          Confirmar rechazo
                        </Button>
                      </DialogContent>
                    </Dialog>
                  ) : null}
                </div>
              )}
            </section>

            <section className="rounded-xl border bg-card p-5" aria-labelledby="entrega">
              <h2 id="entrega" className="text-base font-semibold">
                Entrega
              </h2>
              <form
                className="mt-3 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  entrega.mutate();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="modalidad">Modalidad</Label>
                  <Select value={modalidad} onValueChange={(v) => setModalidad(v as DeliveryMode)}>
                    <SelectTrigger id="modalidad" className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODALIDADES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {DELIVERY_MODE_LABELS[m]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detalle-entrega">Detalle acordado</Label>
                  <Textarea
                    id="detalle-entrega"
                    rows={3}
                    maxLength={200}
                    placeholder="Ej. Parque central de Masaya, sábado 10:00 a. m."
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo-entrega">Costo de entrega (C$)</Label>
                  <Input
                    id="costo-entrega"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="min-h-11"
                    value={costo}
                    onChange={(e) => setCosto(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full touch-target" disabled={entrega.isPending}>
                  Guardar entrega
                </Button>
              </form>
              {o.entrega ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Acordado: {DELIVERY_MODE_LABELS[o.entrega.modalidad]}
                  {o.entrega.detalle ? ` — ${o.entrega.detalle}` : ""}
                </p>
              ) : null}
            </section>

            <section className="rounded-xl border bg-card p-5" aria-labelledby="pago">
              <h2 id="pago" className="text-base font-semibold">
                Pago
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total del pedido</dt>
                  <dd className="font-semibold text-primary">{format(total)}</dd>
                </div>
              </dl>
              {o.pago ? (
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p>Método: {PAYMENT_METHOD_LABELS[o.pago.metodo]}</p>
                  {o.pago.referencia ? <p>Referencia: {o.pago.referencia}</p> : null}
                  <p>Registrado: {formatDateTime(o.pago.registradoEn)}</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  El comprador aún no ha registrado el pago.
                </p>
              )}
              {o.estadoPago === "registrado" ? (
                <Button
                  className="mt-4 w-full touch-target"
                  disabled={confirmar.isPending}
                  onClick={() => confirmar.mutate()}
                >
                  Confirmar pago recibido
                </Button>
              ) : null}
            </section>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
