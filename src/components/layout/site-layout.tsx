import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LogIn, Menu, PackageSearch, Store, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencySwitcher } from "@/components/common/currency-switcher";
import { useSession } from "@/hooks/use-session";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/pedidos", label: "Mis pedidos" },
] as const;

function Header() {
  const [abierto, setAbierto] = useState(false);
  const { usuario, cambiarRol } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Store className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-lg font-semibold">Artesanías de Masaya</span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "bg-surface text-foreground" }}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/panel"
            className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface"
            onClick={() => cambiarRol("artesano")}
          >
            <PackageSearch className="size-4" aria-hidden="true" />
            Panel del artesano
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <CurrencySwitcher className="hidden md:inline-flex" />
          {usuario ? (
            <span className="hidden max-w-40 truncate text-sm text-muted-foreground xl:inline">
              {usuario.nombre}
            </span>
          ) : (
            <Button asChild variant="outline" size="sm" className="touch-target hidden sm:inline-flex">
              <Link to="/auth">
                <LogIn className="size-4" aria-hidden="true" />
                Ingresar
              </Link>
            </Button>
          )}
          <button
            type="button"
            className="touch-target grid place-items-center rounded-lg border lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <Menu className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {abierto ? (
        <div id="menu-movil" className="border-t bg-background lg:hidden">
          <nav aria-label="Principal móvil" className="mx-auto max-w-7xl px-4 py-2">
            {[...NAV, { to: "/panel", label: "Panel del artesano" }, { to: "/auth", label: "Ingresar" }].map(
              (n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setAbierto(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-surface"
                >
                  {n.label}
                </Link>
              ),
            )}
            <div className="px-3 py-3">
              <CurrencySwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-lg font-semibold">Artesanías de Masaya</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Plataforma de comercio bajo demanda para las PYMEs artesanales del municipio de Masaya,
            Nicaragua.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Navegación</h3>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link to="/catalogo" className="text-muted-foreground hover:text-foreground">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/pedidos" className="text-muted-foreground hover:text-foreground">
                Mis pedidos
              </Link>
            </li>
            <li>
              <Link to="/panel" className="text-muted-foreground hover:text-foreground">
                Panel del artesano
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Cómo funciona</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Solicitas la pieza, el artesano evalúa la solicitud y, si la acepta, la elabora bajo pedido.
            Luego coordinan el pago y la entrega desde la misma plataforma.
          </p>
        </div>
      </div>
      <p className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Prototipo académico con datos simulados. Masaya, Nicaragua.
      </p>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export { X };
