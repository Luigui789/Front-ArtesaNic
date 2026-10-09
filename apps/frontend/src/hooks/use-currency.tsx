import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { formatPrice, type Currency } from "@/lib/format";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (cordobas: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NIO");
  const value = useMemo(
    () => ({ currency, setCurrency, format: (c: number) => formatPrice(c, currency) }),
    [currency],
  );
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return ctx;
}
