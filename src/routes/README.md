# Rutas del frontend

El repositorio usa **TanStack Router y TanStack Start con rutas por archivos**. Ver [router.tsx](../router.tsx), [vite.config.ts](../../vite.config.ts) y [package.json](../../package.json). Esta documentación no migra el router.

`__root.tsx` contiene el layout raíz y debe conservar `<Outlet />`. `src/routeTree.gen.ts` se genera automáticamente; no se edita a mano. No introducir convenciones de Next.js/Remix como `src/pages/` o `app/layout.tsx`.

## Rutas existentes en el código de referencia

Referencia: main en commit 456f613b381d30136f1d9949eef57a5f54a1508b. Las rutas de índice pueden normalizar la barra final; se muestran aquí como URLs de navegación.

| Archivo | URL | Función |
|---|---|---|
| index.tsx | / | Inicio |
| catalogo.tsx | /catalogo | Catálogo |
| producto.$id.tsx | /producto/:id | Producto |
| artesano.$id.tsx | /artesano/:id | Perfil público del taller |
| solicitar.$productId.tsx | /solicitar/:productId | Solicitud actual de un producto |
| pedidos.index.tsx | /pedidos | Pedidos del comprador |
| pedidos.$id.tsx | /pedidos/:id | Detalle, pago y entrega del comprador |
| mensajes.tsx | /mensajes | Conversaciones por pedido |
| auth.tsx | /auth | Acceso simulado |
| panel.index.tsx | /panel | Panel del artesano |
| panel.pedidos.index.tsx | /panel/pedidos | Solicitudes/pedidos del artesano |
| panel.pedidos.$id.tsx | /panel/pedidos/:id | Gestión del pedido |
| panel.productos.tsx | /panel/productos | Productos |
| panel.perfil.tsx | /panel/perfil | Perfil del taller |

Pago y chat se integran en las vistas actuales; no hay archivos de ruta independientes para `/pedidos/:id/pago`, `/pedidos/:id/mensajes` ni `/panel/solicitudes`. No presentarlos como implementados.

## Rutas propuestas para Inventario y Costos

Estas rutas **todavía no existen**; pertenecen a la adaptación futura de RF-022 a RF-024.

| Archivo propuesto | URL objetivo | Función |
|---|---|---|
| panel.inventario.index.tsx | /panel/inventario | Listado de cantidades y valorización |
| panel.inventario.$productId.tsx | /panel/inventario/:productId | Movimientos, reservas, costos y clasificación |

Agregar acceso «Inventario» en la navegación del artesano y «Ver inventario» desde Mis productos cuando se implemente. Las rutas reflejan pertenencia al taller; la autorización definitiva corresponde al servidor.

Mantener el modelo de pedido por taller en la solicitud actual al adaptar RF-009/RF-018. No crear carrito universal ni rutas administrativas React. Consultar [módulos y reglas](../../docs/modulos-y-reglas.md) y [matriz de alineación](../../docs/alineacion.md) antes de ampliar navegación.
