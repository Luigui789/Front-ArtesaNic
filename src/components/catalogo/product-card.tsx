import { Link } from "react-router";
import type { Product } from "@/types";
import { useCurrency } from "@/hooks/use-currency";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, artisanName }: { product: Product; artisanName?: string }) {
  const { format } = useCurrency();
  return (
    <article className="group h-full overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link to={`/producto/${product.id}`} className="block h-full focus-visible:outline-none">
        <div className="aspect-[4/3] overflow-hidden bg-surface">
          <img
            src={product.imagenes[0]}
            alt={product.nombre}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-2 p-4">
          <Badge variant="outline" className="border-secondary/40 text-secondary">
            {product.categoria}
          </Badge>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{product.nombre}</h3>
          {artisanName ? (
            <p className="line-clamp-1 text-sm text-muted-foreground">{artisanName}</p>
          ) : null}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-lg font-bold text-primary">{format(product.precio)}</span>
            <span className="text-xs text-muted-foreground">
              {product.disponible ? "Bajo pedido" : "No disponible"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-surface" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
        <div className="h-4 w-full animate-pulse rounded bg-surface" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
      </div>
    </div>
  );
}
