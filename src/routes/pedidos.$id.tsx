import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { changeOrderStatus, getOrder, getProduct, registerPayment } from "@/services/mock-api";
import { canCancel } from "@/lib/order-state";
import { formatDateTime } from "@/lib/format";
import { useCurrency } from "@/hooks/use-currency";
import { useSession } from "@/hooks/use-session";
import { useNotifications } from "@/hooks/use-notifications";
import type { PaymentMethod } from "@/types";

export const Route = createFileRoute("/pedidos/$id")({
  head: ({ params }) => ({
    meta: [
      { title: "Detalle del pedido | Artesanías de Masaya" },
      {
        name: "description",
        content:
          "Seguimiento del pedido: estado de producción, pago, entrega, mensajería con el taller e historial.",
      },
      { property: "og:title", content: "Detalle del pedido | Artesanías de Masaya" },
      { property: "og:description", content: "Estado, pago y entrega de tu pedido artesanal." },
      { property: "og:url", content: `/pedidos/${params.id}` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `/pedidos/${params.id}` }],
  }),
  component: DetallePedido,
});

const METODOS: PaymentMethod[] = ["Transferencia", "Pago contra entrega", "Otro método"];

function DetallePedido() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { format } = useCurrency();
  const { usuario } = useSession();

  const [metodo, setMetodo] = useState<PaymentMethod>("Transferencia");
  const [referencia, setReferencia] = useState("");
  const [nota, setNota] = useState("");
  const [motivo, setMotivo] = useState("");

  const pedido = useQuery({ queryKey: ["pedido", id], queryFn: () => getOrder(id) });
  const { marcarLeido } = useNotifications();
  useEffect(() => marcarLeido(id), [id, marcarLeido]);
  const producto = useQuery({
    queryKey: ["producto", pedido.data?.productoId],
    queryFn: () => getProduct(pedido.data!.productoId),
    enabled: !!pedido.data,
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["pedido", id] });
    void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
  };

  const pagar = useMutation({
    mutationFn: () =>
      registerPayment(
        id,
        {
          metodo,
          referencia: referencia.trim() || undefined,
          nota: nota.trim() || undefined,
        },
        usuario?.nombre ?? "Comprador",
      ),
    onSuccess: () => {
      refrescar();
      toast.success("Pago registrado", {
        description: "El artesano debe confirmarlo para continuar con la entrega.",
      });
      setReferencia("");
      setNota("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelar = useMutation({
    mutationFn: () => changeOrderStatus(id, "Cancelado", usuario?.nombre ?? "Comprador", motivo.trim()),
    onSuccess: () => {
      refrescar();
      toast.success("Pedido cancelado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </SiteLayout>
    );
  }

  const o = pedido.data;
  const total = o.precioUnitario * o.cantidad + o.costosAdicionales + o.costoEntrega;
  const puedePagar = o.estado === "Listo para entrega" && o.estadoPago === "Pendiente de pago";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/pedidos"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a mis pedidos
        </Link>

        <header className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold">Pedido {o.codigo}</h1>
            <p className="text-sm text-muted-foreground">Creado el {formatDateTime(o.creadoEn)}</p>
          </div>
          <StatusPair estado={o.estado} estadoPago={o.estadoPago} />
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section className="rounded-xl border bg-card p-5" aria-labelledby="avance">
              <h2 id="avance" className="text-base font-semibold">
                Avance del pedido
              </h2>
              <div className="mt-4">
                <OrderTimeline estado={o.estado} />
              </div>
              {o.motivoRechazo ? (
                <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Motivo del rechazo: {o.motivoRechazo}
                </p>
              ) : null}
              {o.motivoCancelacion ? (
                <p className="mt-4 rounded-lg border bg-muted p-3 text-sm text-muted-foreground">
                  Motivo de cancelación: {o.motivoCancelacion}
                </p>
              ) : null}
            </section>

            <section className="rounded-xl border bg-card p-5" aria-labelledby="solicitud">
              <h2 id="solicitud" className="text-base font-semibold">
                Detalle de la solicitud
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
                  <p className="text-sm text-muted-foreground">Cantidad: {o.cantidad}</p>
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
                {o.entrega ? (
                  <div>
                    <dt className="font-medium">Entrega</dt>
                    <dd className="text-muted-foreground">
                      {o.entrega.modalidad}
                      {o.entrega.detalle ? ` — ${o.entrega.detalle}` : ""}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section aria-labelledby="mensajes">
              <h2 id="mensajes" className="sr-only">
                Mensajería con el taller
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
            <section className="rounded-xl border bg-card p-5" aria-labelledby="montos">
              <h2 id="montos" className="text-base font-semibold">
                Montos
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Producto x{o.cantidad}
                  </dt>
                  <dd>{format(o.precioUnitario * o.cantidad)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Costos adicionales</dt>
                  <dd>{format(o.costosAdicionales)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Entrega</dt>
                  <dd>{format(o.costoEntrega)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="text-primary">{format(total)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border bg-card p-5" aria-labelledby="pago">
              <h2 id="pago" className="text-base font-semibold">
                Pago
              </h2>
              {o.pago ? (
                <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div>Método: {o.pago.metodo}</div>
                  {o.pago.referencia ? <div>Referencia: {o.pago.referencia}</div> : null}
                  {o.pago.nota ? <div>Nota: {o.pago.nota}</div> : null}
                  <div>Registrado: {formatDateTime(o.pago.registradoEn)}</div>
                </dl>
              ) : puedePagar ? (
                <form
                  className="mt-3 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    pagar.mutate();
                  }}
                >
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">Método de pago</legend>
                    <RadioGroup
                      value={metodo}
                      onValueChange={(v) => setMetodo(v as PaymentMethod)}
                      className="gap-2"
                    >
                      {METODOS.map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <RadioGroupItem id={`metodo-${m}`} value={m} />
                          <Label htmlFor={`metodo-${m}`} className="font-normal">
                            {m}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </fieldset>
                  <div className="space-y-2">
                    <Label htmlFor="referencia">Número de referencia</Label>
                    <Input
                      id="referencia"
                      className="min-h-11"
                      maxLength={40}
                      placeholder="Ej. 0098231"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nota-pago">Nota para el artesano</Label>
                    <Textarea
                      id="nota-pago"
                      rows={3}
                      maxLength={200}
                      value={nota}
                      onChange={(e) => setNota(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full touch-target" disabled={pagar.isPending}>
                    {pagar.isPending ? "Registrando…" : "Registrar pago"}
                  </Button>
                </form>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Podrás registrar el pago cuando el pedido esté listo para entrega.
                </p>
              )}
            </section>

            {canCancel(o.estado) ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full touch-target">
                    Cancelar pedido
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Cancelar este pedido?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Solo puedes cancelar antes de que el taller inicie la producción. Esta acción no
                      se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="motivo-cancelacion">Motivo (opcional)</Label>
                    <Textarea
                      id="motivo-cancelacion"
                      rows={3}
                      maxLength={200}
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Volver</AlertDialogCancel>
                    <AlertDialogAction onClick={() => cancelar.mutate()}>
                      Sí, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
