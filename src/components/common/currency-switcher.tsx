import { useCurrency } from "@/hooks/use-currency";
import { TASA_CAMBIO } from "@/lib/format";
import { cn } from "@/lib/utils";

/** RF-007: selector de moneda C$ / US$ con tasa simulada. */
export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-lg border bg-card p-1", className)}
      role="group"
      aria-label={`Moneda de visualización. Tasa simulada: 1 US$ = C$ ${TASA_CAMBIO}`}
    >
      {(["NIO", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={cn(
            "min-h-11 rounded-md px-3 text-sm font-medium transition-colors",
            currency === c
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-surface",
          )}
        >
          {c === "NIO" ? "C$ Córdobas" : "US$ Dólares"}
        </button>
      ))}
    </div>
  );
}
