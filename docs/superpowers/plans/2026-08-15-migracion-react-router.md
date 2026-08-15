# Migración TanStack Start/Router → React Router — Plan de migración

> **Para ejecutores agénticos:** SUB-SKILL REQUERIDA: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar este plan tarea por tarea. **No ejecutar ninguna tarea de este plan hasta recibir autorización explícita** — a la fecha de escritura, la migración NO ha sido autorizada.

**Objetivo:** Sustituir TanStack Start/TanStack Router por React Router como sistema de enrutamiento del frontend, sin alterar ninguna otra pieza de la arquitectura (React, Vite, TanStack Query, Tailwind, shadcn/ui, Zod, React Hook Form permanecen igual).

**Arquitectura:** Los 14 archivos de `src/routes/` dejan de exportar un objeto `Route = createFileRoute(...)` y pasan a exportar un componente de página normal. Un único árbol de rutas declarado a mano en `src/app/App.tsx` los registra con `<Routes>`/`<Route>` de `react-router`. Se añade un `index.html` + `src/main.tsx` como nuevo punto de entrada (hoy no existen porque TanStack Start generaba el HTML). `src/start.ts`, `src/server.ts`, `src/routeTree.gen.ts` y el target de build Nitro/Cloudflare Worker se eliminan.

**Tech Stack:** React 19, TypeScript, Vite, `react-router` (nuevo), TanStack Query (sin cambios).

**Spec:** [`docs/adr/0001-sistema-de-routing.md`](../../adr/0001-sistema-de-routing.md)

## Global Constraints

- TanStack Query (`@tanstack/react-query`) NO se toca — ni el paquete, ni `useQuery`/`useMutation`, ni las claves de caché existentes.
- No se modifica ninguna lógica de negocio (`mock-api.ts`, `order-state.ts`, `seed.ts`, `types/index.ts`).
- No se instala ningún paquete de testing ni de SSR/meta-framework nuevo — el proyecto no tiene suite de pruebas automatizada hoy, y este plan no la introduce (fuera de alcance del ADR-001).
- Todo el copy visible (textos, mensajes de error, títulos) se preserva literalmente tal como está en el código actual.
- Durante las Tareas 2-5 se permite temporalmente que el proyecto no compile, porque se está migrando el entrypoint y las 14 rutas a la vez (no es viable hacer convivir ambos routers en el mismo árbol de renderizado). **No se avanzará a la Tarea 6 (retirar TanStack) hasta que las 14 rutas estén migradas y `bun run build` sea exitoso** — ese es el punto de corte real, no cada tarea individual.

---

## Respuestas a los 18 puntos solicitados

1. **Dependencias que se agregarían:** `react-router` (última versión estable 7.x — confirmar con `bun info react-router` al ejecutar, no fijar aquí un número de versión que pueda quedar desactualizado).
2. **Dependencias que se eliminarían:** `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin` (dependencies); `nitro`, `@lovable.dev/vite-tanstack-config` (devDependencies). Ver riesgo de Lovable en la sección 17 antes de quitar el wrapper de Lovable.
3. **Archivos que se modificarían:** los 14 archivos de `src/routes/*.tsx`, `src/components/layout/site-layout.tsx`, `src/components/catalogo/product-card.tsx`, `src/components/catalogo/artisan-card.tsx`, `vite.config.ts`, `package.json`. Ver tabla completa más abajo.
4. **Archivos que se eliminarían:** `src/router.tsx`, `src/routes/__root.tsx`, `src/routeTree.gen.ts`, `src/start.ts`, `src/server.ts`.
5. **Reemplazo de `routeTree.gen.ts`:** desaparece por completo — no hay generación automática. Su función (registrar todas las rutas con tipos) la cumple el árbol declarado a mano en `src/app/App.tsx` (Tarea 2).
6. **Migración por tipo de ruta:** ruta estática (`index.tsx`, `catalogo.tsx`, `panel.index.tsx`, etc.) → se quita el wrapper `createFileRoute(...)({component: X})` y se exporta `X` directamente; se registra como `<Route path="/x" element={<X />} />` en `App.tsx`. Ver Tarea 3-5.
7. **Migración de parámetros dinámicos:** `$id` (TanStack) → `:id` (React Router) en la definición de la ruta; dentro del componente, `Route.useParams()` → `useParams<{ id: string }>()` de `react-router`. 5 rutas afectadas: `producto.$id.tsx`, `artesano.$id.tsx`, `solicitar.$productId.tsx`, `pedidos.$id.tsx`, `panel.pedidos.$id.tsx`.
8. **Migración de search params tipados:** `validateSearch` + `Route.useSearch()` → `useSearchParams()` de `react-router` (devuelve `URLSearchParams`, se parsea/valida a mano con una función auxiliar, igual que hoy pero explícita). 2 rutas afectadas: `catalogo.tsx` (6 parámetros), `mensajes.tsx` (1 parámetro). Código completo en Tarea 3 y 4.
9. **Reemplazo de `head()`/metadata:** hook nuevo `useDocumentHead()` (sin dependencias externas) que hace `document.title = ...` y crea/actualiza etiquetas `<meta>`/`<link rel="canonical">` en `document.head` desde un `useEffect`. El `<head>` base (charset, viewport, fuentes, favicon, OG por defecto) se mueve a `index.html`. Se pierde el SSR de estos metadatos (aceptado en el ADR-001).
10. **Reemplazo de `notFoundComponent`/`errorComponent`:** `notFoundComponent` → componente `NotFound` registrado en `<Route path="*" element={<NotFound />} />`. `errorComponent` → un React Error Boundary de clase (`AppErrorBoundary`, sin dependencias) envolviendo `<Routes>`. Ambos reutilizan el copy exacto que ya existe en `__root.tsx`.
11. **Scroll restoration:** React Router (modo declarativo, sin data router) no restaura scroll automáticamente. Se agrega un componente `ScrollToTop` (`useLocation` + `useEffect(() => window.scrollTo(0,0), [pathname])`) montado una vez dentro de `<BrowserRouter>`.
12. **`src/start.ts`:** se elimina. Definía middleware CSRF para *server functions* que el proyecto no usa en ningún punto — no hay ninguna funcionalidad que deje de operar.
13. **`src/server.ts`:** se elimina. Es el adaptador del entry SSR de TanStack Start a un handler `fetch` estilo Cloudflare Worker; sin SSR propio no hay handler de servidor que envolver. El build final es una SPA estática (`dist/`) sin runtime de servidor propio.
14. **Nitro:** se elimina como devDependency y su configuración (`tanstackStart.server.entry` en `vite.config.ts`) desaparece junto con el wrapper de Lovable. `vite build` vuelve a producir un `dist/` estático plano, sin paso de bundling de servidor.
15. **TanStack Query:** **se conserva sin cambios.** Sigue siendo `@tanstack/react-query` en `package.json`, con el mismo `QueryClient`, las mismas claves de caché (`["catalogo", search]`, `["producto", id]`, etc.) y los mismos `useQuery`/`useMutation` en cada componente. Lo único que cambia es *dónde* se crea el `QueryClientProvider`: hoy nace en `router.tsx`/`__root.tsx` vía `Route.useRouteContext()`; después nace directamente en `src/app/App.tsx`.
16. **Estructura final de `src/`:** ver sección dedicada más abajo.
17. **Riesgos:** ver sección dedicada más abajo.
18. **Estrategia de verificación:** ver sección dedicada más abajo (Tarea 7).

---

## Tabla completa: archivo por archivo

| Archivo actual | Acción | Equivalente nuevo | Riesgo |
|---|---|---|---|
| `package.json` | Modificar | `+react-router` / `-@tanstack/react-router, @tanstack/react-start, @tanstack/router-plugin, nitro, @lovable.dev/vite-tanstack-config` | Medio — ver riesgo Lovable |
| `vite.config.ts` | Reescribir | Config plana: `react()`, `tailwindcss()`, `tsconfigPaths()` | Bajo |
| `index.html` | Crear | Entry HTML con meta base + `<div id="root">` | Bajo |
| `src/main.tsx` | Crear | `createRoot(...).render(<App />)` | Bajo |
| `src/app/App.tsx` | Crear | `QueryClientProvider` + `BrowserRouter` + `<Routes>` con las 14 rutas | Medio — concentra todo el árbol de rutas, revisar con cuidado |
| `src/app/error-boundary.tsx` | Crear | Reemplaza `errorComponent` de `__root.tsx` | Bajo |
| `src/app/not-found.tsx` | Crear | Reemplaza `notFoundComponent` | Bajo |
| `src/app/scroll-to-top.tsx` | Crear | Reemplaza `scrollRestoration: true` | Bajo |
| `src/hooks/use-document-head.tsx` | Crear | Reemplaza `head()` por ruta | Bajo |
| `src/router.tsx` | Eliminar | Lógica movida a `src/app/App.tsx` | Bajo |
| `src/routes/__root.tsx` | Eliminar | Providers movidos a `App.tsx`; shell HTML movido a `index.html` | Medio |
| `src/routeTree.gen.ts` | Eliminar | Ya no se autogenera (era generado, no versionable a mano) | Ninguno |
| `src/start.ts` | Eliminar | Sin reemplazo (protegía server functions inexistentes) | Bajo |
| `src/server.ts` | Eliminar | Sin reemplazo (adaptador SSR/Worker) | Bajo |
| `src/routes/index.tsx` | Modificar | Quitar `createFileRoute`, exportar componente, `useDocumentHead` | Bajo |
| `src/routes/auth.tsx` | Modificar | `useNavigate` de `react-router` | Bajo |
| `src/routes/catalogo.tsx` | Modificar | `useSearchParams` reemplaza `validateSearch`/`Route.useSearch()` | Medio — 6 parámetros a parsear a mano |
| `src/routes/producto.$id.tsx` | Modificar | `useParams` reemplaza `Route.useParams()` | Bajo |
| `src/routes/artesano.$id.tsx` | Modificar | `useParams` | Bajo |
| `src/routes/solicitar.$productId.tsx` | Modificar | `useParams` + `useNavigate` | Bajo |
| `src/routes/pedidos.index.tsx` | Modificar | Quitar `createFileRoute` | Bajo |
| `src/routes/pedidos.$id.tsx` | Modificar | `useParams` | Bajo |
| `src/routes/mensajes.tsx` | Modificar | `useSearchParams` reemplaza `validateSearch`/`Route.useSearch()` | Medio — 1 parámetro, más simple que catálogo |
| `src/routes/panel.index.tsx` | Modificar | Quitar `createFileRoute` | Bajo |
| `src/routes/panel.perfil.tsx` | Modificar | Quitar `createFileRoute` | Bajo |
| `src/routes/panel.productos.tsx` | Modificar | Quitar `createFileRoute` | Bajo |
| `src/routes/panel.pedidos.index.tsx` | Modificar | Quitar `createFileRoute` | Bajo |
| `src/routes/panel.pedidos.$id.tsx` | Modificar | `useParams` | Bajo |
| `src/components/layout/site-layout.tsx` | Modificar | `Link` de `react-router`, mismos `to="/catalogo"` etc. | Bajo |
| `src/components/catalogo/product-card.tsx` | Modificar | `Link` con `to={`/producto/${id}`}` en vez de `to="/producto/$id" params={{id}}` | Bajo |
| `src/components/catalogo/artisan-card.tsx` | Modificar | Igual que product-card | Bajo |
| `.lovable/`, `AGENTS.md`, `lib/lovable-error-reporting.ts`, `lib/error-capture.ts` | No tocar | — | Alto si se sigue usando Lovable — ver riesgos |

---

## Estructura final propuesta de `src/`

```text
src/
├── app/
│   ├── App.tsx              # QueryClientProvider + BrowserRouter + árbol de rutas
│   ├── error-boundary.tsx   # Reemplaza errorComponent
│   ├── not-found.tsx        # Reemplaza notFoundComponent
│   └── scroll-to-top.tsx    # Reemplaza scrollRestoration
├── assets/                  # Sin cambios
├── components/              # Sin cambios (solo Link actualizado en 3 archivos)
├── data/                    # Sin cambios (seed.ts)
├── hooks/
│   ├── use-document-head.tsx  # NUEVO — reemplaza head()
│   └── ...                    # resto sin cambios
├── lib/                     # Sin cambios (order-state.ts, format.ts, utils.ts)
├── routes/                  # Mismos 14 archivos, sin createFileRoute
├── services/                # Sin cambios (mock-api.ts)
├── types/                   # Sin cambios
├── main.tsx                 # NUEVO — entry point
└── styles.css                # Sin cambios
```

Se conservan `src/routes/` y `src/components/` con el mismo nombre y contenido interno para minimizar el diff — solo cambia el mecanismo de registro de rutas, no la organización de carpetas ya validada por la auditoría.

---

## Riesgos

1. **🔴 Alto — Desincronización con Lovable.** `.lovable/project.json` declara `"template": "tanstack_start_ts_current"` y `AGENTS.md` advierte explícitamente que el repo está conectado a Lovable. Quitar `@lovable.dev/vite-tanstack-config` y TanStack Start probablemente rompe la capacidad de seguir editando este proyecto desde el editor visual de Lovable (su generador de código asume esa plantilla). **Decisión requerida antes de ejecutar:** ¿se va a seguir usando Lovable para iterar este repo después de la migración, o Lovable ya cumplió su función (generar el prototipo inicial) y de aquí en adelante se edita directamente con Claude Code / a mano? Si la respuesta es "seguir usando Lovable", este plan no debería ejecutarse tal como está.
2. **🟡 Medio — Pérdida de metadatos renderizados en servidor.** Ya aceptado en el ADR-001, pero recordar que esto es irreversible sin reintroducir un servidor de renderizado.
3. **🟡 Medio — Los 2 flujos de search params tipados son el código con más lógica a portar** (`catalogo.tsx` con 6 parámetros, `mensajes.tsx` con 1). Es mecánico pero no trivial; requiere probar cada combinación de filtro manualmente (Tarea 7).
4. **🟢 Bajo — El resto de la migración es mecánica** (quitar un wrapper, cambiar 2-3 imports por archivo) porque el proyecto nunca usó loaders, `beforeLoad` ni server functions — la parte difícil de portar de TanStack Start simplemente no existe en este código.
5. **🟢 Bajo — Regresión de comportamiento en 404/errores.** Mitigado reutilizando el copy y clases CSS exactas de `__root.tsx` en los nuevos `NotFound`/`AppErrorBoundary`.

---

## Tarea 1: Preparación

**Archivos:** ninguno (solo control de versiones).

- [ ] **Paso 1:** Confirmar que no hay cambios sin commitear: `git status`.
- [ ] **Paso 2:** Crear rama de trabajo: `git checkout -b feature/migrar-react-router`.
- [ ] **Paso 3:** Confirmar con el usuario la respuesta al Riesgo #1 (¿se sigue usando Lovable?) antes de continuar a la Tarea 2. Si la respuesta es "sí, seguimos usando Lovable", detener el plan aquí y volver a decidir el alcance con el usuario.

## Tarea 2: Nueva base de arranque (sin borrar nada todavía)

**Archivos:**
- Crear: `index.html`
- Crear: `src/main.tsx`
- Crear: `src/app/App.tsx`
- Crear: `src/app/error-boundary.tsx`
- Crear: `src/app/not-found.tsx`
- Crear: `src/app/scroll-to-top.tsx`
- Crear: `src/hooks/use-document-head.tsx`
- Modificar: `vite.config.ts`
- Modificar: `package.json` (agregar `react-router`; las dependencias de TanStack se quitan recién en la Tarea 6)

**Interfaces:**
- Produce: `useDocumentHead({ title, meta?, canonical? })` — usado por las Tareas 3-5 en cada ruta migrada.
- Produce: `<App />` — el árbol de rutas se completa incrementalmente en las Tareas 3-5; hasta entonces sus imports apuntan a componentes que aún no existen con esos nombres, así que este proyecto **no compilará entre la Tarea 2 y el final de la Tarea 5**. Eso es intencional: es una migración de "corte único" del entrypoint, no incremental.

- [ ] **Paso 1: Instalar `react-router`**

```bash
bun add react-router
```

- [ ] **Paso 2: Crear `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Artesanías de Masaya</title>
    <meta
      name="description"
      content="Plataforma de comercio bajo demanda para productos artesanales de las PYMEs de Masaya, Nicaragua."
    />
    <meta property="og:site_name" content="Artesanías de Masaya" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
    />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Paso 3: Crear `src/hooks/use-document-head.tsx`**

```tsx
import { useEffect } from "react";

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface DocumentHeadOptions {
  title: string;
  meta?: MetaTag[];
  canonical?: string;
}

export function useDocumentHead({ title, meta = [], canonical }: DocumentHeadOptions) {
  useEffect(() => {
    document.title = title;
    const created: HTMLElement[] = [];

    for (const tag of meta) {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        if (tag.name) el.setAttribute("name", tag.name);
        if (tag.property) el.setAttribute("property", tag.property);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("content", tag.content);
    }

    let canonicalEl: HTMLLinkElement | null = null;
    if (canonical) {
      canonicalEl = document.head.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
        created.push(canonicalEl);
      }
      canonicalEl.setAttribute("href", canonical);
    }

    return () => {
      for (const el of created) el.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, JSON.stringify(meta), canonical]);
}
```

- [ ] **Paso 4: Crear `src/app/scroll-to-top.tsx`**

```tsx
import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
```

- [ ] **Paso 5: Crear `src/app/not-found.tsx`** (copy idéntico al `NotFoundComponent` actual de `__root.tsx`)

```tsx
import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Paso 6: Crear `src/app/error-boundary.tsx`** (copy idéntico al `ErrorComponent` actual de `__root.tsx`)

```tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Esta página no se pudo cargar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ocurrió un problema. Puedes reintentar o volver al inicio.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => this.setState({ error: null })}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Reintentar
              </button>
              <a
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Ir al inicio
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Paso 7: Crear `src/app/App.tsx`** (el árbol de rutas — los imports de página se completan en las Tareas 3-5, por ahora dejarlos apuntando a los mismos archivos que ya existen en `src/routes/`, que se irán actualizando)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { SessionProvider } from "@/hooks/use-session";
import { CurrencyProvider } from "@/hooks/use-currency";
import { NotificationsProvider } from "@/hooks/use-notifications";
import { Toaster } from "@/components/ui/sonner";
import { AppErrorBoundary } from "./error-boundary";
import { ScrollToTop } from "./scroll-to-top";
import { NotFound } from "./not-found";

import Index from "@/routes/index";
import Auth from "@/routes/auth";
import Catalogo from "@/routes/catalogo";
import Producto from "@/routes/producto.$id";
import Artesano from "@/routes/artesano.$id";
import Solicitar from "@/routes/solicitar.$productId";
import PedidosIndex from "@/routes/pedidos.index";
import PedidosDetalle from "@/routes/pedidos.$id";
import Mensajes from "@/routes/mensajes";
import PanelIndex from "@/routes/panel.index";
import PanelPerfil from "@/routes/panel.perfil";
import PanelProductos from "@/routes/panel.productos";
import PanelPedidosIndex from "@/routes/panel.pedidos.index";
import PanelPedidosDetalle from "@/routes/panel.pedidos.$id";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <CurrencyProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <AppErrorBoundary>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/producto/:id" element={<Producto />} />
                  <Route path="/artesano/:id" element={<Artesano />} />
                  <Route path="/solicitar/:productId" element={<Solicitar />} />
                  <Route path="/pedidos" element={<PedidosIndex />} />
                  <Route path="/pedidos/:id" element={<PedidosDetalle />} />
                  <Route path="/mensajes" element={<Mensajes />} />
                  <Route path="/panel" element={<PanelIndex />} />
                  <Route path="/panel/perfil" element={<PanelPerfil />} />
                  <Route path="/panel/productos" element={<PanelProductos />} />
                  <Route path="/panel/pedidos" element={<PanelPedidosIndex />} />
                  <Route path="/panel/pedidos/:id" element={<PanelPedidosDetalle />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppErrorBoundary>
            </BrowserRouter>
            <Toaster richColors position="top-center" />
          </NotificationsProvider>
        </CurrencyProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Paso 8: Crear `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se encontró #root en index.html");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Paso 9: Reescribir `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
```

- [ ] **Paso 10: Commit intermedio (el proyecto no compila todavía, es esperado)**

```bash
git add index.html src/main.tsx src/app src/hooks/use-document-head.tsx vite.config.ts package.json bun.lock
git commit -m "wip: base de arranque react-router (rutas aún no migradas)"
```

## Tarea 3: Migrar rutas públicas (index, auth, catalogo, producto, artesano)

**Archivos:**
- Modificar: `src/routes/index.tsx`, `src/routes/auth.tsx`, `src/routes/catalogo.tsx`, `src/routes/producto.$id.tsx`, `src/routes/artesano.$id.tsx`
- Modificar: `src/components/layout/site-layout.tsx`, `src/components/catalogo/product-card.tsx`, `src/components/catalogo/artisan-card.tsx`

**Interfaces:**
- Consume: `useDocumentHead` de la Tarea 2.
- Produce: componentes `Index`, `Auth`, `Catalogo`, `Producto`, `Artesano` como export default — nombres que `App.tsx` (Tarea 2) ya espera.

- [ ] **Paso 1: `src/routes/index.tsx` y `src/routes/auth.tsx`** — patrón mecánico: quitar `import { createFileRoute } from "@tanstack/react-router"`, quitar el bloque `export const Route = createFileRoute(...)({ head: ..., component: X })`, exportar `X` como `export default function X() { ... }`, mover el contenido de `head().meta` a una llamada `useDocumentHead({...})` al inicio del cuerpo del componente. En `auth.tsx`, cambiar `import { createFileRoute, useNavigate } from "@tanstack/react-router"` por `import { useNavigate } from "react-router"`.

- [ ] **Paso 2: `src/routes/catalogo.tsx`** — reemplazar bloque completo:

```tsx
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
  q?: string;
  categoria?: Category | "todas";
  precioMin?: number;
  precioMax?: number;
  artesanoId?: string;
  orden?: "recientes" | "precio-asc" | "precio-desc" | "nombre";
  page?: number;
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

  // El resto del cuerpo (JSX de filtros, grid de resultados, paginación) permanece
  // idéntico — solo usaba `search`, `set` y `navigate`, que ya están cubiertos arriba.
  // Los usos de `navigate({ to: "/catalogo", search: {...} })` se cambian por `set({...})`
  // (o `setSearchParams(buildSearchParams({...}))` en los 2 sitios que resetean todos los filtros).
}
```

- [ ] **Paso 3: `src/routes/producto.$id.tsx` y `src/routes/artesano.$id.tsx`** — patrón:

```tsx
import { useParams } from "react-router";
// ...resto de imports iguales, + useDocumentHead

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null; // la ruta solo monta con :id presente

  useDocumentHead({
    title: "Producto artesanal | Artesanías de Masaya",
    meta: [
      {
        name: "description",
        content:
          "Detalle del producto artesanal: precio, taller que lo elabora y solicitud de pedido personalizado.",
      },
      { property: "og:title", content: "Producto artesanal | Artesanías de Masaya" },
      { property: "og:description", content: "Pieza artesanal de Masaya elaborada bajo pedido." },
      { property: "og:url", content: `/producto/${id}` },
    ],
    canonical: `/producto/${id}`,
  });

  // resto del componente igual, ya usaba `id` como variable local
}
```

Mismo patrón para `artesano.$id.tsx` (cambiar `/producto/` por `/artesano/` en las URLs de `head`).

- [ ] **Paso 4: `site-layout.tsx`, `product-card.tsx`, `artisan-card.tsx`** — cambiar `import { Link } from "@tanstack/react-router"` por `import { Link } from "react-router"`. En `product-card.tsx` y `artisan-card.tsx`, cambiar `<Link to="/producto/$id" params={{ id: producto.id }}>` por `<Link to={`/producto/${producto.id}`}>` (mismo cambio para artesano).

- [ ] **Paso 5: Verificar que compila (parcialmente — panel/pedidos siguen sin migrar, es esperado si `App.tsx` ya los importa; si bloquea, comentar temporalmente esas líneas de `<Route>` en `App.tsx` hasta la Tarea 4-5).**

```bash
bun run build
```

- [ ] **Paso 6: Commit**

```bash
git add src/routes/index.tsx src/routes/auth.tsx src/routes/catalogo.tsx src/routes/producto.\$id.tsx src/routes/artesano.\$id.tsx src/components/layout/site-layout.tsx src/components/catalogo/product-card.tsx src/components/catalogo/artisan-card.tsx
git commit -m "refactor: migrar rutas públicas a react-router"
```

## Tarea 4: Migrar rutas del comprador (solicitar, pedidos, mensajes)

**Archivos:** `src/routes/solicitar.$productId.tsx`, `src/routes/pedidos.index.tsx`, `src/routes/pedidos.$id.tsx`, `src/routes/mensajes.tsx`.

- [ ] **Paso 1: `solicitar.$productId.tsx` y `pedidos.$id.tsx`** — mismo patrón de `useParams` que la Tarea 3 (cambiar `productId`/`id` según corresponda), `useNavigate` de `react-router` en vez de `@tanstack/react-router`.

- [ ] **Paso 2: `pedidos.index.tsx`** — patrón mecánico simple (quitar `createFileRoute`, exportar componente, `useDocumentHead`).

- [ ] **Paso 3: `mensajes.tsx`** — reemplazar el bloque de `validateSearch`/`Route.useSearch()`:

```tsx
import { useNavigate, useSearchParams } from "react-router";
// ...resto de imports iguales + useDocumentHead

export default function MensajesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const seleccionado = searchParams.get("pedido") ?? undefined;
  const { usuario } = useSession();
  const rol = usuario?.rol ?? "comprador";
  const { noLeidos, marcarLeido } = useNotifications();

  useDocumentHead({
    title: "Mensajes por pedido | Artesanías de Masaya",
    meta: [
      {
        name: "description",
        content:
          "Conversa con el taller artesanal sobre cada pedido bajo demanda: detalles, materiales y coordinación de entrega.",
      },
      { property: "og:title", content: "Mensajes por pedido | Artesanías de Masaya" },
      {
        property: "og:description",
        content: "Mensajería simulada asociada a cada pedido artesanal de Masaya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    canonical: "/mensajes",
  });

  // Donde antes había `navigate({ to: "/mensajes", search: { pedido: id } })`,
  // usar: setSearchParams({ pedido: id })
  // resto del componente igual
}
```

- [ ] **Paso 4: Verificar build y commit** (mismo patrón que Tarea 3, Pasos 5-6).

## Tarea 5: Migrar rutas del panel del artesano

**Archivos:** `src/routes/panel.index.tsx`, `src/routes/panel.perfil.tsx`, `src/routes/panel.productos.tsx`, `src/routes/panel.pedidos.index.tsx`, `src/routes/panel.pedidos.$id.tsx`.

- [ ] **Paso 1:** Aplicar el mismo patrón mecánico de las Tareas 3-4 a los 5 archivos (los 4 primeros son quitar `createFileRoute` + `useDocumentHead`; `panel.pedidos.$id.tsx` además necesita `useParams`).
- [ ] **Paso 2: Verificar build completo — a partir de aquí `App.tsx` ya puede importar las 14 rutas sin comentar ninguna.**

```bash
bun run build
bun run dev
```

- [ ] **Paso 3: Commit**

```bash
git add src/routes/panel.index.tsx src/routes/panel.perfil.tsx src/routes/panel.productos.tsx src/routes/panel.pedidos.index.tsx src/routes/panel.pedidos.\$id.tsx
git commit -m "refactor: migrar rutas del panel del artesano a react-router"
```

## Tarea 6: Retirar TanStack Router/Start

**Archivos:**
- Eliminar: `src/router.tsx`, `src/routes/__root.tsx`, `src/routeTree.gen.ts`, `src/start.ts`, `src/server.ts`
- Modificar: `package.json`

- [ ] **Paso 1:** Confirmar (otra vez) la respuesta al Riesgo #1 de Lovable antes de quitar `@lovable.dev/vite-tanstack-config`.
- [ ] **Paso 2:** Borrar los 5 archivos listados arriba.
- [ ] **Paso 3:** Quitar dependencias:

```bash
bun remove @tanstack/react-router @tanstack/react-start @tanstack/router-plugin nitro @lovable.dev/vite-tanstack-config
```

- [ ] **Paso 4:** Confirmar que `@tanstack/react-query` sigue presente en `package.json` (no debe tocarse).
- [ ] **Paso 5:** Build limpio:

```bash
bun run build
```

- [ ] **Paso 6: Commit**

```bash
git add -A
git commit -m "chore: retirar TanStack Start/Router (ADR-001)"
```

## Tarea 7: Verificación final

**Archivos:** ninguno (solo verificación manual y de build).

- [ ] **Paso 1: Typecheck y build**

```bash
bun run build
```

Esperado: build exitoso, sin errores de TypeScript ni de imports rotos.

- [ ] **Paso 2: Servidor de desarrollo**

```bash
bun run dev
```

- [ ] **Paso 3: Checklist manual de navegación** (recorrer cada una en el navegador):
  - [ ] `/` — landing carga, links a catálogo/artesanos funcionan.
  - [ ] `/auth` — formulario de ingreso/registro funciona, redirige tras "ingresar".
  - [ ] `/catalogo` — filtros por categoría, precio, artesano, orden y paginación actualizan la URL (`?categoria=...&page=...`) y los resultados.
  - [ ] `/catalogo` con URL pegada directamente (ej. `/catalogo?categoria=Hamacas&orden=precio-asc&page=2`) — carga los filtros correctos al entrar directo (no solo navegando desde la UI).
  - [ ] `/producto/:id` — carga detalle, botón "Solicitar pedido" navega a `/solicitar/:productId`.
  - [ ] `/artesano/:id` — carga perfil público y sus productos.
  - [ ] `/solicitar/:productId` — formulario crea el pedido y redirige a `/pedidos/:id`.
  - [ ] `/pedidos` — lista pedidos del comprador.
  - [ ] `/pedidos/:id` — timeline, chat, registro de pago, cancelación.
  - [ ] `/mensajes` y `/mensajes?pedido=<id>` — selecciona conversación por URL.
  - [ ] `/panel`, `/panel/perfil`, `/panel/productos`, `/panel/pedidos`, `/panel/pedidos/:id` — dashboard y gestión de pedidos del artesano.
  - [ ] Ruta inexistente (ej. `/no-existe`) — muestra la página 404 nueva.
  - [ ] Forzar un error de render (ej. lanzar una excepción temporal en un componente) — confirma que `AppErrorBoundary` la captura con el botón "Reintentar", luego revertir el cambio de prueba.
  - [ ] Navegar entre 2 páginas largas (ej. `/catalogo` con scroll y luego a `/producto/:id`) — confirma que la nueva página abre con scroll arriba (`ScrollToTop`).
  - [ ] Inspeccionar `<head>` en DevTools al navegar entre `/`, `/catalogo` y `/producto/:id` — confirma que `<title>` y `<meta name="description">` cambian por ruta (`useDocumentHead`).
- [ ] **Paso 4: Confirmar en DevTools → Network que no quedan referencias a `routeTree.gen.ts` ni a rutas de Nitro/Cloudflare en el bundle generado.**
- [ ] **Paso 5:** Si todo el checklist pasa, informar al usuario para decidir si se hace merge de `feature/migrar-react-router` a la rama principal.
