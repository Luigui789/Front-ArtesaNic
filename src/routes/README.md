# Routes

Cada archivo `.tsx` de este directorio es un **componente de página**. El
enrutamiento **no** es por convención de nombre de archivo: el árbol de rutas se
declara explícitamente en [`src/app/App.tsx`](../app/App.tsx) con `<Routes>` y
`<Route>` de React Router.

Los nombres de archivo con puntos (`panel.pedidos.$id.tsx`) son un vestigio de
la plantilla original basada en TanStack Start. Se conservaron para minimizar el
diff de la migración (ver [ADR-001](../../docs/adr/0001-sistema-de-routing.md)),
pero **no tienen ningún efecto sobre la URL** — solo importa lo que diga
`App.tsx`.

## Cómo agregar una ruta

1. Crear el componente de página en este directorio y exportarlo por defecto:

   ```tsx
   export default function MiPagina() { ... }
   ```

2. Registrarlo en `src/app/App.tsx`:

   ```tsx
   import MiPagina from "@/routes/mi-pagina";
   // ...
   <Route path="/mi-ruta" element={<MiPagina />} />
   ```

## Convenciones

| Necesidad | Cómo se hace |
| --- | --- |
| Parámetro dinámico | `<Route path="/producto/:id" …>` + `useParams<{ id: string }>()` |
| Parámetros de búsqueda (query) | `useSearchParams()` — ver `catalogo.tsx` y `mensajes.tsx` |
| Navegación programática | `useNavigate()` de `react-router` |
| Enlaces | `<Link to="/ruta">`; usar `<NavLink>` si se necesita estado activo |
| Metadatos (`<title>`, `<meta>`) | hook `useDocumentHead` de `@/hooks/use-document-head` |
| Página 404 | `src/app/not-found.tsx`, registrada como `<Route path="*">` |
| Errores de render | `src/app/error-boundary.tsx` |

## Lo que ya no existe

`__root.tsx`, `routeTree.gen.ts`, `createFileRoute`, los loaders y las server
functions se eliminaron al migrar a React Router. El shell HTML vive ahora en
[`index.html`](../../index.html) y los proveedores globales (`QueryClient`,
sesión, moneda, notificaciones) en `src/app/App.tsx`.
