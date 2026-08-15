import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardCheck, Hammer, HandCoins, MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero-masaya.jpg";
import { CATEGORY_IMAGE } from "@/data/seed";
import { CATEGORIES } from "@/types";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/site-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/catalogo/product-card";
import { ArtisanCard } from "@/components/catalogo/artisan-card";
import { ErrorState } from "@/components/common/states";
import { featuredArtisans, featuredProducts } from "@/services/mock-api";
import { useDocumentHead } from "@/hooks/use-document-head";

const PASOS = [
  {
    icon: ClipboardCheck,
    titulo: "1. Solicitas la pieza",
    texto: "Eliges el producto, indicas cantidad y detalles de personalización.",
  },
  {
    icon: Hammer,
    titulo: "2. El artesano evalúa y produce",
    texto: "El taller acepta o rechaza la solicitud. Si la acepta, comienza la producción.",
  },
  {
    icon: HandCoins,
    titulo: "3. Registran el pago",
    texto: "Registras el pago y el artesano lo confirma. El pago es independiente del pedido.",
  },
  {
    icon: MessageCircle,
    titulo: "4. Coordinan la entrega",
    texto: "Acuerdan la modalidad de entrega usando la mensajería del pedido.",
  },
];

export default function Index() {
  useDocumentHead({
    title: "Artesanías de Masaya | Inicio",
    meta: [
      {
        name: "description",
        content:
          "Descubre el arte y la tradición de Masaya. Solicita productos artesanales bajo pedido directamente a los talleres del municipio.",
      },
      { property: "og:title", content: "Artesanías de Masaya | Inicio" },
      {
        property: "og:description",
        content: "Productos artesanales de las PYMEs de Masaya, elaborados bajo pedido.",
      },
      { property: "og:url", content: "/" },
    ],
    canonical: "/",
  });

  const productos = useQuery({ queryKey: ["destacados"], queryFn: featuredProducts });
  const artesanos = useQuery({ queryKey: ["artesanos-destacados"], queryFn: featuredArtisans });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b bg-surface">
        <img
          src={heroImg}
          alt="Artesano tejiendo una hamaca en un taller de Masaya"
          width={1600}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Masaya, Nicaragua
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Descubre el arte y la tradición de Masaya
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Piezas elaboradas a mano por talleres del municipio. Aquí no hay carrito: cada pieza se
              solicita al artesano y se produce bajo pedido.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="touch-target text-base">
                <Link to="/catalogo">
                  Explorar productos
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="touch-target text-base">
                <Link to="/pedidos">Ver mis pedidos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-4 py-12" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" className="font-display text-2xl font-bold sm:text-3xl">
          Rubros artesanales
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explora por el rubro local que más te interesa.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                to={`/catalogo?categoria=${encodeURIComponent(c)}`}
                className="group block overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-square overflow-hidden bg-surface">
                  <img
                    src={CATEGORY_IMAGE[c]}
                    alt={c}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="flex min-h-11 items-center justify-center px-2 text-center text-sm font-medium">
                  {c}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Productos destacados */}
      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="titulo-destacados">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="titulo-destacados" className="font-display text-2xl font-bold sm:text-3xl">
            Productos destacados
          </h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline">
            Ver todo el catálogo
          </Link>
        </div>

        {productos.isError ? (
          <div className="mt-6">
            <ErrorState onRetry={() => void productos.refetch()} />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.isPending
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : productos.data?.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Cómo funciona */}
      <section className="bg-surface" aria-labelledby="titulo-modelo">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 id="titulo-modelo" className="font-display text-2xl font-bold sm:text-3xl">
            Cómo funciona el pedido bajo demanda
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p) => (
              <li key={p.titulo} className="rounded-xl border bg-card p-5">
                <p.icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{p.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button asChild size="lg" className="touch-target">
              <Link to="/catalogo">Solicitar una pieza artesanal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Artesanos destacados */}
      <section className="mx-auto max-w-7xl px-4 py-12" aria-labelledby="titulo-artesanos">
        <h2 id="titulo-artesanos" className="font-display text-2xl font-bold sm:text-3xl">
          Talleres destacados
        </h2>
        {artesanos.isError ? (
          <div className="mt-6">
            <ErrorState onRetry={() => void artesanos.refetch()} />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {artesanos.isPending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-xl bg-surface" />
                ))
              : artesanos.data?.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
