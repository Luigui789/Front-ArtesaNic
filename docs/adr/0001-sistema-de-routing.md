# ADR-001 — Sistema de routing del frontend

**Estado:** Aceptada y **ejecutada** el 2026-08-15 en la rama `feature/migrar-react-router`.

**Fecha:** 2026-08-15

## Contexto

El prototipo `masaya-artisan-connect` fue generado en Lovable sobre la plantilla `tanstack_start_ts`, que incluye TanStack Start (routing + capa full-stack/SSR sobre Nitro). Una auditoría técnica del código real ([`auditoria/auditoria_tecnica_artesanica.md`](../../auditoria/auditoria_tecnica_artesanica.md)) y un análisis dedicado de la decisión arquitectónica #1 determinaron que:

- El proyecto usa TanStack Start, no solo TanStack Router: `src/start.ts`, `src/server.ts` y las APIs de `__root.tsx` (`createRootRouteWithContext`, `shellComponent`, `<Scripts />`) solo tienen sentido con Start.
- Ninguna de las capacidades full-stack de Start está en uso: no hay `createServerFn`, `loader`, `beforeLoad`, `dehydrate`/`hydrate` ni prefetch de datos en servidor. Todos los datos se piden desde el cliente con TanStack Query contra `mock-api.ts`.
- El SSR activo (`ssr: true` por ruta) solo aporta hoy el shell HTML y los `<meta>` de `head()` (SEO / previews de enlace).
- El sistema final consumirá una API REST de Django REST Framework, servida de forma completamente desacoplada del frontend. Ningún router de React "encaja mejor" con una API REST — es una decisión ortogonal al backend.
- El proyecto será mantenido por una sola persona (el autor de la tesis) después de la entrega. Menor superficie de infraestructura (sin Nitro, sin Worker, sin middleware de server functions no usado) reduce el costo de mantenimiento y facilita justificar cada pieza tecnológica ante un tribunal.

## Decisión

**Migrar de TanStack Start/TanStack Router a React Router.**

La razón principal **no es Django**. Es que, sobre el código real auditado, TanStack Start aporta infraestructura (Nitro, `server.ts`, `start.ts`, build target Cloudflare Worker) que hoy no se aprovecha más allá de servir el shell HTML y los metadatos por ruta — un costo arquitectónico desproporcionado al valor que entrega en este proyecto.

### Se mantiene sin cambios

- React 19 + TypeScript
- Vite
- **TanStack Query** (no se elimina — es una librería de datos, independiente del router; ver nota más abajo)
- Tailwind CSS + shadcn/ui
- Zod
- React Hook Form

### Se sustituye

| Se retira | Se reemplaza por |
|---|---|
| `@tanstack/react-router` | `react-router` (versión instalada: **8.3.0**) |
| `@tanstack/react-start` | *(sin reemplazo — no se usaba su capacidad real)* |
| `@tanstack/router-plugin` | *(sin reemplazo — no se genera árbol de rutas en build)* |
| `nitro` | *(sin reemplazo — build estático de Vite)* |
| `src/start.ts`, `src/server.ts` | *(sin reemplazo — no hay servidor propio)* |
| `src/routeTree.gen.ts` (autogenerado) | árbol de rutas declarado a mano en `src/app/routes.tsx` |

### Nota importante: TanStack Query ≠ TanStack Router

Son paquetes independientes de la familia TanStack. Esta decisión afecta únicamente al **routing** (`@tanstack/react-router` y `@tanstack/react-start`). `@tanstack/react-query` permanece exactamente como está — sigue siendo la capa de datos, y es la misma capa que luego hablará con Django REST Framework.

## Consecuencias

**Positivas**

- Menos infraestructura que mantener y explicar en la tesis (sin Nitro, sin Cloudflare Worker, sin middleware CSRF de server functions que protegía una capacidad no usada).
- `react-router` tiene mayor comunidad, documentación y ejemplos de integración con APIs REST tipo Django.
- El build final es una SPA estática que puede servirse desde cualquier hosting (o el propio Django) sin runtime de servidor Node/Worker propio.
- Sienta una base de frontend más simple antes de conectar Django, aislando el problema de "qué router usar" del problema de "cómo migrar de mocks a DRF".

**Negativas / riesgo a decidir antes de ejecutar**

- **Se pierde el SSR de metadatos (`head()`) y el shell renderizado en servidor.** Los `<title>`/`<meta>` de las páginas públicas (catálogo, producto, artesano) pasarán a establecerse en el cliente; los crawlers y previews de enlace (WhatsApp, Facebook) verán el HTML inicial sin esos metadatos hasta que el JS se ejecute. Se acepta este costo porque el propio análisis mostró que el SSR actual **tampoco** precarga los datos reales (el contenido siempre se pedía en cliente), y el alcance de la tesis (PYMEs de Masaya) no depende de posicionamiento SEO como requisito crítico.
- **Riesgo de desincronización con la plataforma Lovable.** `package.json` (`"name": "tanstack_start_ts"`), `.lovable/project.json` (`"template": "tanstack_start_ts_current"`) y `AGENTS.md` indican que este repositorio está conectado activamente a Lovable, cuya plantilla y generador de código asumen TanStack Start (`@lovable.dev/vite-tanstack-config`, `lovable-error-reporting.ts`, captura de errores SSR). Retirar TanStack Start probablemente rompe la capacidad de seguir iterando el proyecto desde el editor visual de Lovable. **Esto debe confirmarse explícitamente antes de autorizar la ejecución** (ver plan de migración, sección de riesgos).
- Hay que reimplementar a mano: scroll restoration, boundary de errores, página 404, y los 2 flujos con search params tipados (`catalogo.tsx`, `mensajes.tsx`).

## Resolución de los riesgos identificados

- **Riesgo Lovable (🔴 Alto):** resuelto por decisión del autor antes de ejecutar — *"Lovable ya cumplió su función como herramienta de generación/prototipado inicial. Después de la migración, el repositorio será mantenido directamente mediante Claude Code y/o edición manual. No se requiere conservar compatibilidad con la plantilla TanStack Start de Lovable."* En consecuencia se retiró `@lovable.dev/vite-tanstack-config`.
- **Riesgo pérdida de SSR de metadatos (🟡 Medio):** aceptado. Los `<meta>` por ruta se establecen ahora en el cliente mediante el hook `useDocumentHead`, verificado funcionando en las 14 rutas.

## Resultado de la ejecución

Se migraron las 14 rutas. Verificación: `pnpm run build` exitoso, `npx tsc --noEmit` sin errores, y recorrido manual de las 14 rutas en el navegador incluyendo el flujo completo de creación de un pedido y la transición de estado Pendiente → Aceptado.

Dos diferencias entre el plan y el código real, detectadas por el typecheck y resueltas durante la ejecución:

1. `site-layout.tsx` usaba `activeOptions`/`activeProps` de TanStack Router para marcar el enlace activo de la barra de navegación. No existe equivalente directo en `Link` de React Router; se sustituyó por `NavLink` con `end` (equivalente a `activeOptions: { exact: true }`) y `className` como función que recibe `isActive`.
2. `AppErrorBoundary` requería modificadores `override` en `state`, `componentDidCatch` y `render`, porque el `tsconfig.json` del proyecto tiene `noImplicitOverride: true`.

Se documenta además que `pnpm run build` (Vite) **no ejecuta verificación de tipos**: ambos errores anteriores compilaban sin problema y solo aparecieron al correr `npx tsc --noEmit`.

## Decisión relacionada

Como paso previo e independiente a esta migración, el proyecto cambió de gestor de paquetes de **Bun a pnpm** (Bun no estaba disponible en el entorno de desarrollo). El cambio se ejecutó por separado, con su propia línea base de build verificada, para poder aislar el origen de cualquier fallo posterior. `bun.lock` fue reemplazado por `pnpm-lock.yaml`.

## Plan de migración

[`docs/superpowers/plans/2026-08-15-migracion-react-router.md`](../superpowers/plans/2026-08-15-migracion-react-router.md)
