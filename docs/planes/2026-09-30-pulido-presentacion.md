# Pulido para la presentación académica — Auditoría, correcciones y brechas

> **Ampliación autorizada por Luis el 30-sep-2026:** el [plan de correcciones funcionales](2026-09-30-correcciones-funcionales-demo.md) ejecuta en el mock un subconjunto de B2, B4 y B5: existencias/reservas/clasificación, cotización previa/total congelado y pagos con intentos/imágenes/observación. Incluye ruta estándar Aceptado → Listo con pago confirmado. La decisión inicial de este plan queda como historial; la ampliación no homologa requisitos ni cambia contrato o ADR. Varios renglones y fabricación bajo demanda siguen pendientes. El guion actualizado y las pruebas manuales constan en el plan funcional.

> **Alcance autorizado:** auditar y mejorar presentación, accesibilidad, responsive y estabilidad de la demostración en localhost, con cambios P0, P1 y P2 respaldados por un requisito. **No** incorpora funcionalidades nuevas de la especificación v2.0: esas aparecen en la sección 6 como brechas con su plan. No se ejecutan cambios de negocio pendientes de homologación.

**Rama:** `feat/presentation-polish`, creada desde `feature/migrar-react-router` (0d8f7c7). Es la rama que contiene el frontend vigente (React Router, ADR-001); `main` conserva la versión original de Lovable con TanStack Start. Los cambios locales previos (`CLAUDE.md`, `package.json`, `.claude/`) se conservaron sin tocar.

**Fecha:** 30 de septiembre de 2026.

---

## 1. Fuentes y su estado

| Fuente                                                                  | Qué aporta                                                                   | Estado que se le atribuye                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/requisitos/requisitos.md` (15-ago-2026)                           | RF-001 a RF-016 y RNF-001 a RNF-010 del repositorio; desviaciones D-1 a D-10 | Versión del repositorio. **Aprobados:** RF-001, RF-002, RF-003, RF-005, RNF-001, RNF-002, RNF-003, RNF-005. El resto, «Propuesto», pero el documento declara que gobierna al prototipo                                                             |
| Especificación consolidada v2.0 (29/30-sep-2026, fuera del repositorio) | RF-001 a RF-022, RNF-001 a RNF-015, módulos 4.4.1 a 4.4.8                    | Todo «Propuesto para homologación». Confirmado por el equipo solo: oferta estándar y personalizada en una ficha (RF-017), varios renglones de un taller (RF-018), pasarela postergada (RF-012) y control de unidades mínimo si se aprueba (RF-022) |
| Hoja de ratificación (29/30-sep-2026)                                   | D01 a D27, I1 a I6                                                           | D01–D10 y D20–D27: **definidas por Luis, pendientes de homologación del equipo**. D11–D19: pendientes                                                                                                                                              |
| `docs/api/contrato-api.md`                                              | Contrato v2, conceptos retirados (§12)                                       | Borrador para revisión                                                                                                                                                                                                                             |
| Código                                                                  | Implementación actual                                                        | Prototipo con datos simulados en memoria                                                                                                                                                                                                           |

**Regla aplicada:** la fecha más reciente no convierte una propuesta en requisito aprobado. Cuando la v2.0 contradice al repositorio, el prototipo conserva la regla del repositorio y la diferencia se registra como brecha (sección 6), salvo cuando ambas versiones coinciden.

---

## 2. Inventario

**Rutas (14):** `/`, `/auth`, `/catalogo`, `/producto/:id`, `/artesano/:id`, `/solicitar/:productId`, `/pedidos`, `/pedidos/:id`, `/mensajes`, `/panel`, `/panel/perfil`, `/panel/productos`, `/panel/pedidos`, `/panel/pedidos/:id`, más 404.

**Componentes propios:** `SiteLayout`, `ProductCard`, `ArtisanCard`, `EmptyState`, `ErrorState`, `CurrencySwitcher`, `OrderStatusBadge`, `PaymentStatusBadge`, `StatusPair`, `OrderTimeline`, `AuditTimeline`, `OrderChat`, `ImageUploader`.

**Design system «Barro y Sombra»:** tokens oklch en `src/styles.css`; contraste medido en el navegador: texto principal 15,95:1, texto secundario 5,86:1 sobre fondo y 4,57:1 sobre superficie, terracota 5,43:1, todas las insignias ≥ 4,85:1. **La identidad funciona y se conserva.** Única falla: el borde de los campos (`--input`) tiene 1,44:1, por debajo del 3:1 de WCAG 1.4.11.

**Estados del pedido (código):** Pendiente → Aceptado → En producción → Listo para entrega → Entregado; Rechazado desde Pendiente; Cancelado desde Aceptado o En producción. **Pago:** Pendiente de pago → Pago registrado → Pago confirmado. Coincide con RF-010 v2.0 y RF-011 v3.0 del repositorio.

**Chat (RF-014):** deshabilitado en Pendiente, inexistente en Rechazado, activo de Aceptado a Listo, solo lectura en Entregado y Cancelado. Coincide con el repositorio.

**Cancelación (RF-015 v1.0):** el comprador cancela desde Aceptado o En producción; el artesano no puede (desviación D-4); no existe reembolso (D-5).

---

## 3. Matriz de auditoría

Prioridades: **P0** rompe la demostración · **P1** problema visual/UX importante · **P2** pulido · **P3** opcional.

| #   | Pantalla / componente                      | RF/RNF                                      | Estado actual                                                                                                | Problema                                                                                                                | Cambio                                                                 | P   |
| --- | ------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --- |
| 1   | Datos simulados (`seed.ts`)                | RF-005, RF-010                              | Los 8 pedidos pertenecen a 8 talleres distintos                                                              | El comprador ve 8 pedidos y el panel del artesano demo solo 1: aceptar, pagar y entregar no se reflejan en ambas vistas | Escenarios deterministas, todos del taller demo                        | P0  |
| 2   | Datos simulados                            | RF-010, RF-011                              | PM-1004 «En producción» con «Pago registrado»; historial con producción antes del pago                       | Contradice la precondición de pago confirmado                                                                           | Un escenario por paso del flujo, con historial cronológico             | P0  |
| 3   | `changeOrderStatus` + gestión del artesano | RF-010 v2.0, RF-011 v3.0 (D-2)              | Se puede pasar a En producción con el pago pendiente                                                         | El jurado puede ver violada la regla central                                                                            | Precondición en el servicio y botón deshabilitado con explicación      | P0  |
| 4   | `/panel` a 360 px                          | RNF-002                                     | Encabezado desbordado (418 px de ancho), título invisible                                                    | Scroll horizontal y acciones fuera de pantalla                                                                          | Encabezado apilable                                                    | P0  |
| 5   | Cabecera / sesión                          | RF-004 (prototipo, D-6)                     | El enlace móvil al panel no cambia de rol; no hay forma de volver a comprador                                | Mensajes y pagos registrados con el rol equivocado                                                                      | Navegación por rol y selector explícito «Vista de demostración»        | P0  |
| 6   | `mock-api.ts`                              | RNF-010 v2.0 («sin mensajes aleatorios»)    | 45 % de los sondeos inyecta un mensaje aleatorio del artesano; latencia aleatoria                            | Demo no reproducible; el artesano ve mensajes «propios» que no escribió                                                 | Sondeo que solo trae mensajes reales; latencia fija                    | P0  |
| 7   | Listados y detalles de pedido              | RF-006                                      | Tres fórmulas de total distintas                                                                             | Montos diferentes según la pantalla                                                                                     | Una sola función `orderTotal`                                          | P1  |
| 8   | Inicio, catálogo, pie                      | RF-005, RF-009, RF-011, RF-017 (confirmado) | «Cada pieza se produce bajo pedido»; «Cómo funciona» pone la producción antes del pago                       | Contradice la oferta estándar confirmada y el orden pago → producción                                                   | Textos neutrales y pasos en el orden del requisito                     | P1  |
| 9   | `ProductCard`, ficha                       | Ninguno (`disponible`, contrato §12.2)      | «Bajo pedido» / «No disponible» en todas las fichas                                                          | Etiqueta sin respaldo; además no filtraba nada                                                                          | Se retiran los indicadores (el campo del modelo queda para su fase)    | P1  |
| 10  | Inicio                                     | Ninguno («destacados», contrato §12.1)      | «Productos destacados» y «Talleres destacados» = primeros elementos del arreglo                              | Concepto sin requisito                                                                                                  | «Productos recientes» (RF-003, orden por fecha) y «Talleres de Masaya» | P1  |
| 11  | Inicio (hero)                              | RNF-001                                     | Foto al 25 % de opacidad y texto sobre ella                                                                  | Apariencia lavada; no se dice qué es ArtesaNic                                                                          | Superposición para legibilidad y mensaje explícito                     | P1  |
| 12  | Detalle (comprador y artesano) en móvil    | RNF-002 v2.0 («sin ocultar acciones»)       | Pago y acciones al final, después del chat y el historial                                                    | Acción principal enterrada                                                                                              | Acciones primero en móvil                                              | P1  |
| 13  | Gestión del artesano: entrega              | RF-016                                      | El formulario arranca en valores por defecto y existe en estados finales                                     | «Guardar» sobrescribe lo acordado; editable en pedidos cerrados                                                         | Se inicializa con lo acordado; solo lectura en estados finales         | P1  |
| 14  | Gestión del artesano: pago                 | RF-011                                      | La nota del comprador no se muestra al artesano                                                              | Información destinada al artesano invisible                                                                             | Se muestra nota y comprobante                                          | P1  |
| 15  | `ProductCard`, `ArtisanCard`               | RNF-001 (teclado)                           | `outline-none` y `overflow-hidden` ocultan el foco                                                           | Navegación por teclado sin indicador                                                                                    | Anillo de foco en la tarjeta                                           | P1  |
| 16  | Menú móvil                                 | RNF-001, RNF-002                            | Icono de menú también cuando está abierto; «Ingresar» con sesión iniciada                                    | Estado no comunicado                                                                                                    | Icono X, estado activo, cierre con Escape                              | P1  |
| 17  | `/mensajes`                                | —                                           | `<a href="/catalogo">` recarga la página                                                                     | La recarga borra los datos de la demo                                                                                   | `Link`                                                                 | P1  |
| 18  | Mensajes, pago, cancelación                | RF-011, RF-015                              | Textos: «continuar con la entrega», «solo antes de la producción» (el código permite cancelar en producción) | Microcopy contradice la regla aplicada                                                                                  | Textos alineados con la regla vigente                                  | P1  |
| 19  | Listados de pedidos en móvil               | RNF-002                                     | Nombre truncado a ~10 caracteres, insignias partidas                                                         | Lectura difícil                                                                                                         | Botón debajo, insignias agrupadas                                      | P1  |
| 20  | Catálogo                                   | RF-003                                      | «Limpiar filtros» deja los precios y la búsqueda escritos                                                    | Estado visual incoherente                                                                                               | Reinicio de campos                                                     | P2  |
| 21  | Chat                                       | RNF-001                                     | `role="status"` en un texto que cambia cada segundo; envío sin mensaje de error                              | Lector de pantalla saturado; fallo silencioso                                                                           | Sin región viva; aviso de error                                        | P2  |
| 22  | Tokens / `Button`                          | RNF-001                                     | Borde de campos 1,44:1; anillo de foco de 1 px; hover mostaza en botones secundarios                         | Baja visibilidad; mostaza dominante                                                                                     | `--input` ≥ 3:1, anillo de 2 px, hover en superficie                   | P2  |
| 23  | Filtros de pedidos                         | RNF-001 v2.0 (44 px)                        | Pestañas de 36 px                                                                                            | Objetivo táctil pequeño                                                                                                 | 44 px                                                                  | P2  |
| 24  | Datos simulados                            | —                                           | Dulces a C$ 4 800, «Obrador», historias con concordancia rota                                                | Datos poco creíbles                                                                                                     | Rangos de precio por rubro y textos corregidos                         | P2  |
| 25  | Demostración                               | Petición de esta fase                       | Solo una recarga restaura los datos, y nadie lo sabe                                                         | Restauración accidental o imposible de explicar                                                                         | «Restablecer datos de demostración» con confirmación                   | P2  |

**Elementos sin RF identificable que permanecen:** avisos por mensaje nuevo (`use-notifications`). RF-020 v2.0 los deja fuera del mínimo, y el contrato prevé sustituirlos por `GET /notificaciones/`. No se amplían. Sin azar dejan de aparecer solos, porque solo se avisa de mensajes de la otra parte.

---

## 4. Regla de negocio corregida en esta fase

**D-2 (RF-010 v2.0 y RF-011 v3.0 del repositorio; RF-010 v3.0 de la propuesta):** el paso de Aceptado a En producción exige Pago confirmado. Las dos versiones coinciden, el repositorio ya la listaba como desviación por corregir y el contrato reserva el error `pago_no_confirmado`. **No es una regla nueva:** es la corrección de una desviación documentada. Se implementa en el servicio (autoridad del mock) y la interfaz solo la refleja.

---

## 5. Lo que no se hizo por falta de respaldo o por pertenecer a otra fase

- **Carrito, checkout, favoritos, reseñas, cupones, recomendaciones, mapas, tracking y pasarela:** no existen y no se agregan.
- **Retirar `Product.disponible` del modelo:** el contrato lo prevé en varios archivos; aquí solo se retiran sus indicadores visuales.
- **Retirar `featuredProducts()` y `featuredArtisans()` del mock:** la portada deja de usarlas, pero su eliminación pertenece a la misma fase del contrato.
- **Congelar los términos económicos al registrar el pago:** la regla está en el contrato (borrador) y en la v2.0 (al aceptar). Es regla de negocio no homologada.
- **Gráficas o KPI nuevos en el panel:** se conservan los cuatro contadores operativos existentes.

---

## 6. Brechas: especificación v2.0 no implementada

Ninguna se implementa en esta fase. El orden respeta la hoja de ratificación: **primero homologar, después ADR-006 y contrato, después código**.

| Brecha                                                                | Requisito (estado)                                           | Qué falta en el frontend                                                                                      | Dependencia previa                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| B1. Oferta estándar, personalizada o ambas                            | RF-017 (alcance confirmado; ficha propuesta)                 | Campos de oferta en `Product`; selector de opción por renglón; mostrar en la ficha la modalidad que ofrece    | Homologar RF-017; ADR-006; contrato                           |
| B2. Unidades estándar y reservas                                      | RF-022 (propuesto; D03, D04, D22)                            | Existencias físicas/reservadas/disponibles; ajuste con motivo; clasificación de unidades al cancelar o cerrar | B1; D03, D04, D22                                             |
| B3. Varios renglones de un taller                                     | RF-018 (alcance confirmado; mecánica propuesta), RF-009 v2.0 | Borrador local de la solicitud (D06); renglones; rechazo de mezcla de talleres                                | B1; D02, D06                                                  |
| B4. Aceptación integral con reserva y cotización visible en Pendiente | RF-005 v3.0, RF-006 v2.0 (D01, D02, D25)                     | Cotización y desglose por renglón y servicio antes de aceptar; total congelado                                | B3; D01, D25                                                  |
| B5. Pago observado, no recibido e intentos                            | RF-011 v4.0 (D08, D21)                                       | Estados de pago nuevos; plazo de 48 h; historial de intentos                                                  | D08, D21; contrato                                            |
| B6. Cancelación de solicitud Pendiente por el comprador               | RF-015 v2.0 (D05)                                            | Acción y estado; regla de chat                                                                                | D05                                                           |
| B7. Cancelación por el artesano                                       | RF-015 v1.0 (D-4) y v2.0 (D20)                               | Acción en la gestión del pedido                                                                               | Decidir si se implementa ya la versión v1.0 o se espera a D20 |
| B8. Reembolso                                                         | RF-015 v1.0 (D-5), RF-021                                    | Objeto reembolso y su seguimiento                                                                             | D10, D23                                                      |
| B9. Entregas parciales, discrepancias y cierre parcial                | RF-010 v3.0, RF-015 v2.0 (D07, D24, D26)                     | Registro por renglón, confirmación o discrepancia del comprador, solicitud de cierre                          | B3, B8                                                        |
| B10. Recogida atrasada                                                | RF-015 v2.0, RF-020                                          | Marca y avisos a los siete días, solo para recogida en taller                                                 | D18 (mecanismo de avisos)                                     |
| B11. Notificaciones de eventos                                        | RF-020                                                       | Avisos persistentes de solicitud, aceptación, pago y cancelación                                              | Contrato `/notificaciones/`                                   |
| B12. Despublicación y moderación                                      | RF-019 (D14)                                                 | Despublicar producto                                                                                          | D14                                                           |
| B13. Autenticación real                                               | RF-004 (D-6)                                                 | Rol desde el servidor, sin selector                                                                           | Backend                                                       |
| B14. Tasa configurable                                                | RF-007 (D-8)                                                 | Leer `GET /configuracion/`                                                                                    | Backend                                                       |

**Plan de implementación propuesto, por fases, cada una con su propio plan y aprobación:** (1) homologación de D01–D10 y D20–D27 y ADR-006; (2) actualización del contrato; (3) modelo de oferta y unidades (B1, B2); (4) solicitud con renglones y aceptación integral (B3, B4); (5) pagos con intentos y observación (B5); (6) cancelaciones, reembolsos y cierre parcial (B6–B9); (7) avisos (B10, B11); (8) despublicación (B12). Las fases 3 a 8 tocan tipos, mock y pantallas; deben ejecutarse con el compilador como red de seguridad y sin mezclarse con pulido visual.

---

## 7. Verificación

| Comprobación                                             | Resultado                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                                       | Pasa                                                                                                                                                                                                                                                                                                                                   |
| `pnpm run build`                                         | Pasa (persiste el aviso previo de un bloque JS mayor de 500 kB)                                                                                                                                                                                                                                                                        |
| `pnpm run lint`                                          | Falla, igual que antes de la fase: casi todo son errores CRLF de Prettier (deuda preexistente, sin corregir aquí). Las reglas que no son de Prettier no cambian: 9 avisos `react-refresh`, todos previos                                                                                                                               |
| Prettier sin contar finales de línea                     | Ningún archivo nuevo con fallos; en los archivos que ya fallaban, las líneas tocadas en esta fase no tienen diferencias                                                                                                                                                                                                                |
| Pruebas automatizadas                                    | El repositorio no tiene pruebas                                                                                                                                                                                                                                                                                                        |
| Desborde horizontal, imágenes rotas y objetivos táctiles | 16 rutas a 360, 390, 768, 1366 y 1920 px, más la cabecera a 1024 px, sin desborde ni imágenes rotas. Solo quedan bajo 44 px las migas de pan y los radios de `/auth`, cuyas etiquetas son clicables                                                                                                                                    |
| Consola del navegador                                    | Sin errores ni advertencias en un recorrido limpio de las 16 rutas y del flujo completo                                                                                                                                                                                                                                                |
| Flujo entre vistas                                       | Verificado: solicitud nueva → aparece en el panel → aceptación → pago registrado → pago confirmado (con diálogo) → producción → mensaje del taller visible para el comprador → listo → entregado (chat en solo lectura) → rechazo con motivo → cancelación con motivo, visible en ambas vistas → restablecimiento al escenario inicial |

---

## 8. Guion de demostración

**Antes de empezar:** abrir `http://localhost:5173`, pulsar «Restablecer datos de demostración» en el pie y no recargar la página durante la exposición (una recarga vuelve al escenario inicial). Cambiar de vista solo con el selector «Comprador / Artesano» de la cabecera.

**Escenarios disponibles (taller demo: Taller de Cuero Mendoza):**

| Pedido  | Estado                    | Sirve para mostrar                                         |
| ------- | ------------------------- | ---------------------------------------------------------- |
| PM-1001 | Pendiente                 | Aceptar una solicitud                                      |
| PM-1002 | Pendiente                 | Rechazar con motivo                                        |
| PM-1003 | Aceptado, pago pendiente  | Registrar el pago (comprador) o cancelar                   |
| PM-1004 | Aceptado, pago registrado | Producción bloqueada → confirmar pago → iniciar producción |
| PM-1005 | En producción             | Chat activo; marcar listo                                  |
| PM-1006 | Listo para entrega        | Marcar entregado                                           |
| PM-1007 | Entregado                 | Historial completo y chat en solo lectura                  |
| PM-1008 | Rechazado                 | Estado final sin chat                                      |
| PM-1009 | Cancelado                 | Estado final con motivo                                    |

**Comprador:** Inicio (qué es ArtesaNic y «Cómo funciona») → Catálogo (filtros) → «Talleres de Masaya» → Taller de Cuero Mendoza → un producto → «Solicitar pedido» → la solicitud aparece en «Mis pedidos» → PM-1003: registrar el pago → PM-1007: línea de tiempo e historial.

**Artesano:** selector «Artesano» → panel del taller (la solicitud nueva aparece) → aceptarla → PM-1004: mostrar que «Iniciar producción» está bloqueado, confirmar el pago e iniciar la producción → escribir un mensaje → volver a «Comprador» y abrir PM-1004 para mostrar el estado y el mensaje → «Mis productos» → «Perfil del taller».

**Advertencia para la defensa:** la solicitud debe hacerse sobre un producto del Taller de Cuero Mendoza para que aparezca en el panel demostrado. Los demás talleres no tienen sesión de artesano en el prototipo.
