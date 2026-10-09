# Prototipo frontend — Artesanías de Masaya ("Barro y Sombra")

Prototipo web completo y navegable, sin backend: todo funciona con datos mock y una capa de servicios simulada, lista para sustituirse luego por Django REST Framework.

## Alcance

Solo frontend. Sin base de datos, sin API real, sin autenticación real, sin pagos reales. Sin carrito, wishlist, reseñas, cupones, mapas ni tracking.

## Identidad visual

Tokens semánticos en `src/styles.css` (oklch): fondo crema #FDFAF5, superficie #E8DFD0, terracota #B5502F (primario), verde oliva #4A5D3A (secundario), mostaza cálido (acento), texto gris muy oscuro y gris medio. Tipografía: sans moderna para UI + display artesanal solo en títulos/hero, cargadas con `<link>` en el root. Estética limpia, cálida, sin exceso de sombras ni gradientes.

## Datos y servicios mock

- Semilla: ~50 artesanos, ~500 productos (generados de forma determinista), solicitudes, pedidos, pagos, mensajes, modalidades de entrega, historial de auditoría, tasa de cambio C$/US$ simulada.
- Capa `services/` con latencia artificial, errores simulados y mutaciones sobre un store en memoria; consumida siempre vía TanStack Query (queries + mutations + invalidación), nunca directo desde los componentes.
- Sesión simulada (comprador / artesano) con cambio de rol para poder demostrar ambos lados.

## Máquinas de estado (estrictas)

- Pedido: Pendiente → Aceptado → En producción → Listo para entrega → Entregado. Terminales: Pendiente → Rechazado; Aceptado/En producción → Cancelado.
- Pago: Pendiente de pago → Pago registrado → Pago confirmado. Siempre mostrado por separado del pedido.
- Chat por pedido: deshabilitado en Pendiente, inexistente en Rechazado, activo en Aceptado / En producción / Listo para entrega, solo lectura en Entregado y Cancelado. Polling simulado cada 15 s con indicador "Actualizado hace N segundos".
- Cancelar solo visible en Aceptado y En producción, con modal de confirmación y motivo.
- Cada transición registra evento de trazabilidad (estado anterior, nuevo, usuario, fecha, hora).

## Rutas

Comprador: `/`, `/catalogo`, `/producto/$id`, `/artesano/$id`, `/solicitar/$productId`, `/pedidos`, `/pedidos/$id`, `/pedidos/$id/pago`, `/pedidos/$id/mensajes`, `/auth`.
Artesano: `/panel`, `/panel/solicitudes`, `/panel/pedidos`, `/panel/pedidos/$id`, `/panel/productos`, `/panel/perfil`.
Se usa el router de archivos ya existente (TanStack Router); no se añade otro router. Cada ruta con su propio `head()` (título, descripción, og).

## Pantallas

1. Inicio: hero "Descubre el arte y la tradición de Masaya", CTA Explorar productos, categorías, productos y artesanos destacados, explicación del pedido bajo demanda, footer.
2. Catálogo: buscador, filtros (categoría, precio, artesano), ordenamiento, grid, carga progresiva; sidebar en desktop, panel/modal en móvil.
3. Detalle de producto: galería, precio con selector C$/US$, descripción, categoría, artesano, disponibilidad, CTA principal "Solicitar pedido".
4. Perfil de artesano: portada, foto, historia, rubro, ubicación general, horario, teléfono/WhatsApp, redes, productos.
5. Solicitar pedido: producto, cantidad, personalización, observaciones; validación Zod, confirmación previa, estado de carga.
6. Mis pedidos: lista filtrable con fecha, producto, total, estado de pedido y de pago.
7. Detalle de pedido: OrderTimeline, resumen económico (producto, adicionales, entrega, total; sin comisión), estado de pago, modalidad de entrega, mensajería, trazabilidad, acciones válidas.
8. Registro de pago: transferencia con comprobante simulado de acceso controlado, contra entrega, otro método. Sin tarjetas.
9. Mensajería del pedido con polling simulado.
10. Cancelación mediante modal con motivo.
11. Autenticación: teléfono + contraseña (registro, inicio de sesión, recuperación); Google/SMS/WhatsApp visibles como "Próximamente" deshabilitados.
12–17 (artesano): panel principal, bandeja de solicitudes con aceptar/rechazar confirmado, pedidos y su detalle, mis productos (alta/edición con solo foto, nombre+precio, categoría, descripción), perfil del taller, trazabilidad.

## Design system

Sobre shadcn/ui ya instalado, se añaden: ProductCard, ArtisanCard, StatusBadge, OrderStatusBadge, PaymentStatusBadge, OrderTimeline, AuditTimeline, SearchBar, CurrencySwitcher, ImageUploader (simula selección → previsualización → procesamiento → éxito/error), Chat, EmptyState, ErrorState, skeletons y layouts (público y panel). Estados default/hover/focus/active/disabled/loading/error.

## Calidad transversal

- Mobile first desde 360px; tablet y desktop con layouts realmente distintos (sidebar, mayor densidad, tablas donde aplique).
- Loading (skeleton), empty y error con "Reintentar" en toda vista con datos; éxito vía toast (sonner).
- Accesibilidad WCAG AA: foco visible, teclado, labels, HTML semántico, alt, objetivos táctiles ≥44px, estados nunca solo por color (icono + texto).
- Rendimiento: lazy loading de imágenes, carga progresiva del catálogo, memoización donde importe.
- Imágenes: se generan imágenes representativas de artesanía de Masaya (cuero/calzado, hamacas, madera, textiles, dulces, talleres) para tarjetas y galerías.

## Notas técnicas

React 19 + TypeScript + Vite, Tailwind v4 con tokens en `src/styles.css`, shadcn/ui, Lucide, TanStack Query, React Hook Form + Zod. Estructura: `src/routes` (páginas), `src/components/ui` y `src/components/<dominio>`, `src/features`, `src/lib`, `src/types`, `src/hooks`, `src/services` (mock), `src/data` (semillas). Los mensajes de error de formulario se escriben en español y en lenguaje sencillo.

## Entrega por etapas

1. Tokens visuales, tipografía, tipos, datos mock y capa de servicios + hooks de Query.
2. Layouts, navegación y componentes del design system.
3. Pantallas del comprador (inicio, catálogo, producto, artesano, solicitud, pedidos, pago, chat, auth).
4. Pantallas del artesano (panel, solicitudes, pedidos, productos, perfil, trazabilidad).
5. Repaso final: responsive 360px, accesibilidad, estados de carga/vacío/error, SEO por ruta.
