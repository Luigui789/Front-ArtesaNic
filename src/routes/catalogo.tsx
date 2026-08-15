import { useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/catalogo/product-card";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { listArtisans, listProducts } from "@/services/mock-api";
import { useDocumentHead } from "@/hooks/use-document-head";
import { CATEGORIES, type Category } from "@/types";

interface CatalogSearch {
  q?: string | undefined;
  categoria?: Category | "todas" | undefined;
  precioMin?: number | undefined;
  precioMax?: number | undefined;
  artesanoId?: string | undefined;
  orden?: "recientes" | "precio-asc" | "precio-desc" | "nombre" | undefined;
  page?: number | undefined;
}

function parseCatalogSearch(params: URLSearchParams): CatalogSearch {
  const cat = params.get("categoria") ?? "todas";
  const orden = params.get("orden") ?? "recientes";
  return {
    q: params.get("q") ?? undefined,
    categoria: (CATEGORIES as readonly string[]).includes(cat) ? (cat as Category) : "todas",
    precioMin: params.get("precioMin") ? Number(params.get("precioMin")) : undefined,
    precioMax: params.get("precioMax") ? Number(params.get("precioMax")) : undefined,
    artesanoId: params.get("artesanoId") ?? undefined,
    orden: ["recientes", "precio-asc", "precio-desc", "nombre"].includes(orden)
      ? (orden as CatalogSearch["orden"])
      : "recientes",
    page: params.get("page") ? Number(params.get("page")) : 1,
  };
}

function buildSearchParams(search: CatalogSearch): URLSearchParams {
  const params = new URLSearchParams();
  if (search.q) params.set("q", search.q);
  if (search.categoria && search.categoria !== "todas") params.set("categoria", search.categoria);
  if (search.precioMin != null) params.set("precioMin", String(search.precioMin));
  if (search.precioMax != null) params.set("precioMax", String(search.precioMax));
  if (search.artesanoId) params.set("artesanoId", search.artesanoId);
  if (search.orden && search.orden !== "recientes") params.set("orden", search.orden);
  if (search.page && search.page !== 1) params.set("page", String(search.page));
  return params;
}

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = parseCatalogSearch(searchParams);
  const [texto, setTexto] = useState(search.q ?? "");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useDocumentHead({
    title: "Catálogo de productos artesanales | Masaya",
    meta: [
      {
        name: "description",
        content:
          "Explora productos artesanales de Masaya por rubro, precio y taller. Cada pieza se elabora bajo pedido.",
      },
      { property: "og:title", content: "Catálogo de productos artesanales | Masaya" },
      { property: "og:description", content: "Cuero, hamacas, madera, textiles, dulces y más." },
      { property: "og:url", content: "/catalogo" },
    ],
    canonical: "/catalogo",
  });

  const artesanos = useQuery({ queryKey: ["artesanos"], queryFn: listArtisans });
  const productos = useQuery({
    queryKey: ["catalogo", search],
    queryFn: () =>
      listProducts({
        q: search.q,
        categoria: search.categoria,
        precioMin: search.precioMin,
        precioMax: search.precioMax,
        artesanoId: search.artesanoId,
        orden: search.orden,
        page: search.page ?? 1,
        pageSize: 12,
      }),
    placeholderData: keepPreviousData,
  });

  const set = (patch: Partial<CatalogSearch>) =>
    setSearchParams(buildSearchParams({ ...search, page: 1, ...patch }));

  const nombreArtesano = (id: string) =>
    artesanos.data?.find((a) => a.id === id)?.nombreTaller ?? "";

  const Filtros = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="filtro-categoria">Categoría</Label>
        <Select
          value={search.categoria ?? "todas"}
          onValueChange={(v) => set({ categoria: v as Category | "todas" })}
        >
          <SelectTrigger id="filtro-categoria" className="min-h-11">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Precio en córdobas</legend>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="precio-min" className="text-xs text-muted-foreground">
              Desde
            </Label>
            <Input
              id="precio-min"
              type="number"
              inputMode="numeric"
              min={0}
              className="min-h-11"
              defaultValue={search.precioMin ?? ""}
              onBlur={(e) => set({ precioMin: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="precio-max" className="text-xs text-muted-foreground">
              Hasta
            </Label>
            <Input
              id="precio-max"
              type="number"
              inputMode="numeric"
              min={0}
              className="min-h-11"
              defaultValue={search.precioMax ?? ""}
              onBlur={(e) => set({ precioMax: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="filtro-artesano">Taller artesanal</Label>
        <Select
          value={search.artesanoId ?? "todos"}
          onValueChange={(v) => set({ artesanoId: v === "todos" ? undefined : v })}
        >
          <SelectTrigger id="filtro-artesano" className="min-h-11">
            <SelectValue placeholder="Todos los talleres" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="todos">Todos los talleres</SelectItem>
            {artesanos.data?.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.nombreTaller}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full touch-target"
        onClick={() =>
          setSearchParams(buildSearchParams({ categoria: "todas", orden: "recientes", page: 1 }))
        }
      >
        Limpiar filtros
      </Button>
    </div>
  );

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold">Catálogo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas las piezas se elaboran bajo pedido en talleres de Masaya.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: texto.trim() || undefined });
          }}
          role="search"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Label htmlFor="buscador" className="sr-only">
              Buscar productos
            </Label>
            <Input
              id="buscador"
              className="min-h-11 pl-9"
              placeholder="Buscar productos artesanales…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <Button type="submit" className="touch-target">
            Buscar
          </Button>

          <Sheet open={filtrosAbiertos} onOpenChange={setFiltrosAbiertos}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" className="touch-target lg:hidden">
                <Filter className="size-4" aria-hidden="true" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">{Filtros}</div>
            </SheetContent>
          </Sheet>
        </form>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block" aria-label="Filtros del catálogo">
            <div className="sticky top-24 rounded-xl border bg-card p-5">{Filtros}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" role="status">
                {productos.data ? `${productos.data.total} productos encontrados` : "Cargando…"}
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="orden" className="text-sm">
                  Ordenar
                </Label>
                <Select
                  value={search.orden ?? "recientes"}
                  onValueChange={(v) => set({ orden: v as CatalogSearch["orden"] })}
                >
                  <SelectTrigger id="orden" className="min-h-11 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recientes">Más recientes</SelectItem>
                    <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                    <SelectItem value="nombre">Nombre (A–Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {productos.isError ? (
              <div className="mt-6">
                <ErrorState onRetry={() => void productos.refetch()} />
              </div>
            ) : productos.isPending ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : productos.data.items.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  titulo="No encontramos productos"
                  descripcion="Prueba con otra palabra, cambia de categoría o limpia los filtros."
                  accion={
                    <Button
                      variant="outline"
                      className="touch-target"
                      onClick={() =>
                        setSearchParams(
                          buildSearchParams({ categoria: "todas", orden: "recientes", page: 1 }),
                        )
                      }
                    >
                      Limpiar filtros
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {productos.data.items.map((p) => (
                    <ProductCard key={p.id} product={p} artisanName={nombreArtesano(p.artesanoId)} />
                  ))}
                </div>

                <nav
                  className="mt-8 flex items-center justify-between gap-3"
                  aria-label="Paginación del catálogo"
                >
                  <Button
                    variant="outline"
                    className="touch-target"
                    disabled={(search.page ?? 1) <= 1}
                    onClick={() =>
                      setSearchParams(buildSearchParams({ ...search, page: (search.page ?? 1) - 1 }))
                    }
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {productos.data.page} de {productos.data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="touch-target"
                    disabled={(search.page ?? 1) >= productos.data.totalPages}
                    onClick={() =>
                      setSearchParams(buildSearchParams({ ...search, page: (search.page ?? 1) + 1 }))
                    }
                  >
                    Siguiente
                  </Button>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
