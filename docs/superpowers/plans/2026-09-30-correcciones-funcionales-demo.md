# Correcciones funcionales de la demostración — Plan

> **Revisión de entrega del 1-oct-2026:** por indicación de Luis, la modalidad la elige el comprador; el artesano cotiza solo costo y notas opcionales. Sustituye las menciones previas a modalidad confirmada por el artesano. Recoger cuesta C$ 0; después de aceptar, un selector de calendario guarda `entrega.fechaRecogida` por separado y la dirección se consulta del perfil del artesano para ambas vistas. El servicio conserva modalidad e importes. El script se adaptó, sin ejecutarlo por preferencia de Luis. Luis autorizó posteriormente commit y push de esta rama; no pidió merge.

> **Revisión de cancelación del 1-oct-2026:** por indicación de Luis, el comprador solo puede cancelar desde Aceptado; En producción ya no permite cancelar. Sustituye las menciones previas a cancelar en producción de este plan y su guion. Se aplica en transiciones, botón del comprador y validación del servicio. Comprobar cancelación en Aceptado y bloqueo tras iniciar producción, manteniendo reserva y estado; probar también un diálogo abierto antes de que el artesano inicie producción. El script de servicio se adaptó, sin ejecutarlo por preferencia de Luis.

> **Ajuste del 1-oct-2026:** Luis pidió que el comprador indique dónde desea punto de encuentro o entrega por el artesano. La solicitud ahora exige ubicación para esas dos modalidades; el servicio la valida y la guarda separada de las notas del taller. Ambas vistas la muestran y el artesano no puede sobrescribir el campo del comprador. Probar ambos casos, rechazo de ubicación vacía, recogida sin dirección obligatoria y conservación tras cotizar/coordinar/recargar. No se ejecutaron pruebas por preferencia de Luis.

> **Estado:** aprobado por Luis y ejecutado en el prototipo. Pruebas manuales finales a cargo de Luis, a petición suya. Actualización normativa completa pendiente de disponer de v2.1.
>
> **Alcance autorizado (pedido de Luis, 30-sep-2026):** corregir en el prototipo y en sus servicios simulados siete problemas detectados al revisar la demo, además del pulido visual: acceso, pieza única o existencias, cantidades y reservas, imágenes del taller, modalidad y precio de entrega, logos y comprobante de pago. Las vistas de comprador y artesano deben quedar sincronizadas. **Nada de esto es implementación del backend real**: todo vive en `mock-api.ts` y la interfaz (estado 3 de la escala: «simulado con datos mock»).

**Rama:** `feat/presentation-polish`, sobre los cambios locales sin confirmar de la fase de pulido.

---

## 1. Relación con la fase de pulido

El plan [`2026-09-30-pulido-presentacion.md`](2026-09-30-pulido-presentacion.md) dejó como **brechas** B2 (unidades y reservas), B4 (cotización visible en Pendiente y total congelado) y B5 (pago observado e intentos), con la regla «no se ejecutan cambios de negocio pendientes de homologación». Este pedido amplía expresamente la fase para simular un **subconjunto** de esas brechas en el prototipo. Eso no cambia su estado de homologación: siguen siendo definiciones de Luis pendientes del equipo, y el contrato de API y los ADR **no se tocan** en esta fase.

El plan de pulido no se reescribe: se le añade una nota que remite a este documento (la decisión anterior se registra, no se borra).

---

## 2. Reglas que se simulan y su estado

| Regla                                                                                                                                                                                                        | Fuente                                  | Estado                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------- |
| Disponibles = físicas − reservadas; reservar al aceptar con nueva verificación; descontar al entregar; no negativos                                                                                          | RF-022 v1.0, RF-005 v3.0 (D03-B, D04-B) | Definida por Luis, pendiente de homologación                      |
| Al cancelar el comprador, las unidades reservadas quedan **pendientes de clasificación** y no vuelven al catálogo hasta que el artesano indique con motivo cuáles quedan disponibles y cuáles se dan de baja | RF-022, D22                             | Definida por Luis, pendiente de homologación                      |
| Preferencia de modalidad del comprador; el artesano registra modalidad y costo antes de aceptar; visible en Pendiente; congelado al aceptar; coordinación posterior sin alterar el total                     | RF-016 v2.0, RF-006 v2.0 (D01-A, D25)   | Definida por Luis, pendiente de homologación                      |
| Comprobante con acceso solo para las partes; administración sin acceso                                                                                                                                       | RNF-004 v4.0, RNF-013, D11-A            | Propuesto / Luis: A                                               |
| Estados e intentos de pago (ver decisión DA-1)                                                                                                                                                               | RF-011 v4.0 (D08-A, D21)                | Definida por Luis, pendiente de homologación                      |
| **Pieza única / Con existencias** como clasificación de las unidades de la publicación                                                                                                                       | Pedido del 30-sep                       | **Definición nueva de Luis**, no figura en la especificación v2.0 |
| **Recoger en el taller cuesta C$ 0**                                                                                                                                                                         | Pedido del 30-sep                       | **Definición nueva de Luis**, no figura en la especificación v2.0 |

Las dos últimas deben registrarse en la documentación como definiciones de Luis pendientes de homologación, no como decisiones del equipo.

---

## 3. Decisiones

### 3.1 Tomadas por Luis el 30-sep-2026

| #    | Decisión                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DA-1 | **RF-011 según la especificación v2.1:** intentos y correcciones con imagen, fecha, actor, estado y motivo. Se conservan los anteriores; el historial nunca se sobrescribe. Incluye _Pago observado_, las 48 horas para corregir y _Pago no recibido_. Adjuntar un comprobante nunca confirma el pago                                                                                                                         |
| DA-2 | **Persistencia al recargar:** se conservan productos, imágenes, perfil del taller, pedidos, reservas, pagos y mensajes, con un almacenamiento local adecuado para imágenes (IndexedDB)                                                                                                                                                                                                                                        |
| DA-3 | **Personalización opcional:** no es obligatoria para comprar una pieza única o una unidad con existencias sin modificaciones. El campo se muestra y se exige solo cuando el producto admite personalización y el comprador elige esa opción. La pieza única mantiene cantidad 1                                                                                                                                               |
| DA-4 | **Documentación:** la fuente pasa a ser la especificación consolidada **v2.1** (sustituye la referencia a v2.0). Las fichas se actualizan en `docs/requisitos/requisitos.md` y los módulos en un documento nuevo, `docs/requisitos/modulos-funcionalidades.md`, enlazado desde el primero. Se conservan los identificadores, se registra esta revisión y las definiciones nuevas quedan pendientes de homologación del equipo |

### 3.2 Fuente pendiente y resoluciones

- **P-1. Ubicar la especificación v2.1.** En el equipo solo existe `Especificacion_RF_RNF_y_Modulos_ArtesaNic_2026-09-29 (1).md`, que se declara «Versión de trabajo: 2.0 propuesta», actualizada el 30-sep. Sin el texto de v2.1 no se puede redactar la documentación ni confirmar el detalle de RF-011 y RF-017.
- **P-2. Personalización y unidades.** Falta decidir si una solicitud con personalización **consume y respeta las unidades disponibles** (la personalización modifica una unidad existente) o si, para un producto con existencias, se fabrica bajo demanda sin consumir unidades, como dice RF-017 v2.0 («si la opción estándar no tiene unidades disponibles no podrá solicitar esa opción, pero sí la personalizada»). En la pieza única la cantidad es 1 en ambos casos.
- **P-3 confirmado por Luis:** restablecer borra toda la instantánea y vuelve al escenario inicial, incluyendo imágenes, productos, perfil, pedidos, pagos, mensajes y reservas. La recarga normal conserva cambios.

### 3.3 Decisiones que tomo yo por ser seguras y reversibles (se reportan, no se preguntan):

- **Un renglón por pedido.** RF-018 (varios renglones) sigue siendo brecha B3. El límite «sin repetir el producto en varios renglones» se cumple porque el modelo no admite renglones; el servicio valida la cantidad al crear la solicitud y **vuelve a verificar al aceptar**. Dos solicitudes Pendientes pueden pedir la misma última unidad: la primera que el artesano acepte la reserva y la segunda ya no puede aceptarse (RF-017: «la verificación definitiva y la reserva ocurren al aceptar»).
- **Revisión autorizada por Luis:** estándar Aceptado → Listo; personalizado Aceptado → En producción → Listo. Ambas salidas de Aceptado exigen Pago confirmado. Se incorporan Pago observado, Pago no recibido e historial de correcciones.
- **Las cancelaciones no cambian.** Solo el comprador cancela, desde Aceptado o En producción (RF-015 v1.0 del repositorio; D-4 sigue abierta). Por eso la clasificación de unidades se aplica a la única cancelación existente, la del comprador.
- **`Product.disponible` no se toca.** Su retiro pertenece a la fase del contrato (§12.2). La disponibilidad nueva se calcula con unidades y no lee ese campo.
- **El código `retiro_en_taller` no cambia** (es del contrato); su etiqueta pasa a «Recoger en el taller» (D27).

---

## 4. Diseño por punto

### 4.1 Pantalla de acceso

**Hoy:** `/auth` funciona y valida, pero solo se llega desde el pie de página (`site-layout.tsx:269`). El selector Comprador/Artesano se rotula «Vista de demostración» (`site-layout.tsx:66`) sin decir que no es autenticación.

**Cambio:** enlace «Acceso» en la cabecera (escritorio y menú móvil), con estado activo en `/auth`. El selector se conserva y se rotula «Vista de demostración · herramienta del prototipo, no es inicio de sesión»; `/auth` explica la diferencia. Se verifica navegación directa a `/auth`, recarga, envío vacío, teléfono inválido y contraseña corta en ambas pestañas.

### 4.2 Pieza única o con existencias

**Modelo (`Product`):** `tipoUnidades: "pieza_unica" | "existencias"`, `existenciasFisicas`, `unidadesReservadas`, `unidadesPorClasificar`, y `unidadesDisponibles` como **dato derivado que calcula el servicio** (como lo haría el servidor), no la interfaz. Movimientos de unidades por producto (alta, ajuste, reserva, consumo, liberación, baja) con actor, fecha, cantidad y motivo (RNF-008).

**Formulario (`panel.productos.tsx`):** selector obligatorio sin valor preseleccionado. _Pieza única_ fija una unidad y no pide cantidad. _Con existencias_ pide un entero mayor que cero al publicar. Al editar, cambiar las existencias exige motivo (RF-022) y no puede dejar menos unidades que las comprometidas (reservadas + por clasificar). Cambiar a pieza única solo se permite si caben las unidades comprometidas.

**Servicio:** `createProduct`/`updateProduct` validan lo mismo que el formulario; el formulario no es la autoridad.

**Personalización (DA-3):** el formulario gana «Admite personalización» (`admitePersonalizacion`). En la solicitud, si el producto la admite, el comprador elige «Sin modificaciones» o «Con personalización» (sin preselección); el texto se muestra y se exige solo en la segunda opción. El pedido guarda la opción elegida. Cómo se relaciona con las unidades depende de P-2; en ningún caso permite más de una unidad de una pieza única.

### 4.3 Catálogo, detalle y cantidad

- `ProductCard` y la ficha muestran «Pieza única» o «Con existencias», y la disponibilidad («3 disponibles», «Reservada», «Sin unidades disponibles»).
- Ficha: si no hay disponibilidad, el botón «Solicitar pedido» queda deshabilitado con el motivo visible y asociado (`aria-describedby`).
- Solicitud: pieza única → cantidad fija 1, sin controles. Existencias → entero entre 1 y los disponibles; el botón «+» se deshabilita en el máximo, la escritura manual fuera de rango muestra error y no se envía. Se elimina el tope artificial de 50 (`solicitar.$productId.tsx:25`).
- Servicio: `createOrderRequest` rechaza cantidades no enteras, menores que 1, mayores que los disponibles o distintas de 1 en pieza única.
- **Aceptar** (`changeOrderStatus → aceptado`): vuelve a verificar disponibles ≥ cantidad y reserva en la misma operación síncrona del mock (equivalente a la atomicidad que exigirá el backend, RNF-011). Si no alcanza, error explicado y la solicitud sigue Pendiente.
- **Entregado:** descuenta existencias físicas y reservas a la vez.
- **Cancelación del comprador:** la reserva pasa a _pendiente de clasificación_; las unidades siguen fuera del catálogo.
- **Clasificación (artesano):** en el pedido Cancelado, formulario «Vuelven a estar disponibles / Se dan de baja / Motivo», con suma igual a la cantidad reservada. Libera las disponibles y descuenta las bajas de existencias y reservas en una sola operación.
- Las vistas se sincronizan invalidando producto, catálogo, «Mis productos» y pedidos tras cada operación.

### 4.4 Imágenes del taller

**Hoy:** `panel.perfil.tsx` no permite cambiar `fotoUrl` ni `portadaUrl`. En `artesano.$id.tsx:71` el banner es `relative` y la tarjeta del encabezado sube con `-mt-12` sin posicionamiento: por el orden de pintado de CSS, el banner se dibuja **encima** de los primeros 48 px de la tarjeta (causa probable, se confirmará en el navegador). Además el nombre usa `truncate` (`:89`).

**Cambio:**

- Perfil: dos cargadores con previsualización en la **misma proporción** en que se mostrarán (foto 1:1, portada panorámica), validación de tipo (JPG, PNG, WebP) y tamaño (≤ 5 MB), reemplazo, y guardado junto con el resto del perfil.
- Perfil público: portada en un contenedor con `aspect-ratio` (más alto en móvil, panorámico en escritorio) y `object-cover` centrado; encabezado con contexto de apilamiento propio para que la foto se superponga al banner y el nombre, el responsable y el rubro queden completos (sin truncar). No se resuelve solo cambiando la altura.
- `ImageUploader` gana una propiedad de proporción y textos configurables; `processImage` valida la misma lista de formatos que anuncia («JPG o PNG»; hoy acepta cualquier `image/*`). Afecta también a la foto de producto: es la misma validación anunciada, no una regla nueva.

### 4.5 Modalidad y precio de entrega

| Momento              | Comprador                                                                                                       | Artesano                                                                                                                                 | Servicio                                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Solicitud            | Elige modalidad preferida (obligatoria, sin preselección) y detalle opcional                                    | —                                                                                                                                        | Guarda `entregaPreferida`                                                                                                                       |
| Pendiente            | Ve su preferencia y, cuando el artesano la registra, la modalidad confirmada, el costo y el total **propuesto** | Ve la preferencia; confirma o cambia la modalidad y fija el costo. Recoger en el taller fuerza C$ 0                                      | `setDeliveryQuote`: solo en Pendiente; rechaza costo ≠ 0 para recoger en taller y costos negativos                                              |
| Aceptar              | —                                                                                                               | «Aceptar» se deshabilita, con motivo, hasta registrar modalidad y costo; el diálogo muestra qué se reservará y el total que se congelará | Exige modalidad registrada; guarda `cotizacionCongelada` (precio, cantidad, adicionales, entrega, modalidad, total, fecha)                      |
| Aceptado en adelante | Ve el total congelado y la coordinación                                                                         | Modalidad e importes en solo lectura; puede registrar fecha y lugar                                                                      | `setDeliveryCoordination`: solo el detalle; cada cambio queda en el historial. Cualquier intento de cambiar modalidad o importes devuelve error |

`orderTotal` sigue siendo el único cálculo del total; las pantallas muestran el desglose congelado cuando existe y lo rotulan («Cotización» frente a «Total congelado el …»). Los costos adicionales siguen viniendo de los datos (no hay pantalla para fijarlos; fuera de alcance).

### 4.6 Logos

- Quitar `<link rel="icon" href="/favicon.ico">` (`index.html:20`), eliminar `public/favicon.ico` y declarar un icono vacío (`href="data:,"`) para que Chrome no pida `/favicon.ico` por su cuenta.
- Quitar el cuadro con el ícono `Store` junto a «ArtesaNic» (`site-layout.tsx:118`); se conservan el nombre y el subtítulo.
- Verificar en una pestaña nueva, sin caché, que no hay icono ni petición a `/favicon.ico`.

### 4.7 Comprobante de pago (DA-1; detalle sujeto a la v2.1)

- **Modelo:** `Order.pagos: PaymentAttempt[]` en lugar de un único `pago`. Cada intento: método, referencia, nota, estado (`registrado`, `observado`, `confirmado`, `no_recibido`) y una lista **solo de inserción** de comprobantes (imagen, fecha, actor) y de resoluciones (estado, actor, fecha, motivo). Una corrección añade un comprobante; nunca reemplaza ni borra el anterior. `estadoPago` del pedido se deriva del último intento (`pendiente` si no hay).
- **Plazo de 48 horas:** al observar se registra el vencimiento (observación + 48 h) y ambas vistas lo muestran. Conforme a 4.4.3 v2.0, el plazo por sí solo no cambia estados; qué ocurre al vencer se ajustará a lo que diga la v2.1.
- **Comprador (Mis pedidos → Detalle → Pago):** seleccionar imagen, previsualizar, reemplazar antes de enviar, validar JPG/PNG/WebP ≤ 5 MB, enviar. Si el intento queda _observado_, ve el motivo y el plazo, y sube la corrección. Si queda _no recibido_ y el pedido sigue Aceptado, registra otro intento.
- **Artesano:** ve el comprobante y su historial; «Confirmar pago recibido» (con la advertencia de que el comprobante no prueba los fondos), «Observar comprobante» (motivo obligatorio) y «Pago no recibido» (motivo obligatorio).
- **Acceso:** `getOrder` devuelve solo los metadatos del comprobante. La imagen se obtiene con `getPaymentReceipt(pedidoId, intentoId, sesion)`, que el mock entrega solo a la compradora del pedido o al taller del pedido. No aparece en catálogo, perfiles ni listados; el frontend no tiene rol administrativo. Es una **simulación** de RNF-004: la autorización real la impone el backend.
- La producción sigue bloqueada hasta _Pago confirmado_ (D-2 ya corregida).

---

## 5. Datos de demostración

Productos del taller demo clasificados con ambos tipos y existencias plausibles; al menos una pieza única ya reservada por un pedido Aceptado y un producto con existencias parcialmente reservado. Escenarios de pedido:

| Pedido  | Estado                                                        | Para mostrar                                                   |
| ------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| PM-1001 | Pendiente, preferencia «Recoger en el taller», sin cotización | Registrar modalidad (C$ 0) y aceptar con reserva               |
| PM-1002 | Pendiente, preferencia «Entrega por el artesano»              | Fijar costo y ver la cotización desde el comprador; o rechazar |
| PM-1003 | Aceptado, reserva activa, pago pendiente                      | Adjuntar comprobante                                           |
| PM-1004 | Aceptado, pago registrado con comprobante                     | Revisar el comprobante: confirmar u observar                   |
| PM-1005 | En producción                                                 | Coordinar fecha y lugar sin alterar importes                   |
| PM-1006 | Listo para entrega                                            | Marcar entregado y ver el descuento de existencias             |
| PM-1007 | Entregado                                                     | Unidades consumidas                                            |
| PM-1008 | Rechazado                                                     | Sin reserva                                                    |
| PM-1009 | Cancelado por el comprador                                    | Unidades pendientes de clasificación                           |
| PM-1010 | Aceptado, pago observado                                      | Corregir el comprobante y conservar el historial               |

El comprobante de muestra es una imagen SVG local rotulada «Comprobante simulado».

---

## 6. Fuera de alcance (siguen como brechas)

Varios renglones (B3), opción personalizada bajo demanda por renglón (B1), ruta directa para pedidos estándar, cancelación de solicitud Pendiente (B6), cancelación por el artesano (B7, D-4), reembolsos y conciliación tras Cancelado (B8), entregas parciales y cierre parcial (B9), avisos de plazo (B10, B11), ajuste de costos adicionales, contrato de API y ADR-006.

---

## 7. Archivos

| Archivo                                                                                             | Cambio                                                                                                                            |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`, `public/favicon.ico`                                                                  | Icono vacío; se elimina el favicon                                                                                                |
| `src/types/index.ts`                                                                                | Unidades del producto; preferencia, cotización congelada, reserva e intentos de pago del pedido; estados de pago; tipos de evento |
| `src/lib/labels.ts`                                                                                 | Etiquetas de unidades, estados de pago, modalidad «Recoger en el taller», eventos                                                 |
| `src/lib/order-amounts.ts`                                                                          | Desglose vigente (cotización o congelado)                                                                                         |
| `src/lib/units.ts` (nuevo)                                                                          | Cálculo de disponibles y cantidad máxima solicitable                                                                              |
| `src/services/mock-api.ts`                                                                          | Reglas de unidades, entrega, pagos y acceso al comprobante; persistencia                                                          |
| `src/services/mock-persistence.ts` (nuevo, DA-2)                                                    | Lectura, guardado y borrado de la instantánea en IndexedDB                                                                        |
| `src/data/seed.ts`, `src/assets/comprobante-demo.svg` (nuevo)                                       | Escenarios de la sección 5                                                                                                        |
| `src/components/layout/site-layout.tsx`                                                             | Enlace de acceso, logo textual, rótulo del selector, restablecer borra la instantánea                                             |
| `src/components/productos/image-uploader.tsx`                                                       | Proporción y textos configurables                                                                                                 |
| `src/components/catalogo/product-card.tsx`, `src/components/catalogo/unit-availability.tsx` (nuevo) | Clasificación y disponibilidad                                                                                                    |
| `src/components/pedidos/status-badges.tsx`, `timelines.tsx`                                         | Estados de pago y eventos nuevos                                                                                                  |
| `src/components/pedidos/payment-receipt.tsx` (nuevo)                                                | Carga con previsualización y visor con historial                                                                                  |
| `src/routes/auth.tsx`                                                                               | Aclaración sobre el selector                                                                                                      |
| `src/routes/panel.productos.tsx`                                                                    | Tipo de unidades, existencias, motivo de ajuste, resumen de unidades                                                              |
| `src/routes/producto.$id.tsx`, `solicitar.$productId.tsx`                                           | Disponibilidad, límites, preferencia de entrega                                                                                   |
| `src/routes/pedidos.$id.tsx`, `panel.pedidos.$id.tsx`                                               | Cotización, congelación, coordinación, clasificación, pagos                                                                       |
| `src/routes/panel.perfil.tsx`, `artesano.$id.tsx`                                                   | Imágenes del taller y encabezado                                                                                                  |
| `src/routes/panel.index.tsx`                                                                        | Solo si cambia el cálculo de «Pagos por confirmar»                                                                                |

No se tocan `docs/api/contrato-api.md`, los ADR ni `CLAUDE.md`.

---

## 8. Riesgos

| Riesgo                                                                             | Mitigación                                                                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Una instantánea persistida con la forma vieja rompe la demo tras cambiar el modelo | Clave versionada; si no coincide, se descarta y se vuelve al seed                                                   |
| Imágenes grandes en la instantánea                                                 | Límite de 5 MB por archivo; IndexedDB admite ese volumen, a diferencia de `localStorage`                            |
| La interfaz y el servicio aplican límites distintos                                | El servicio es la autoridad; la interfaz solo refleja. Se prueba el servicio directamente, saltándose el formulario |
| Mensajes y avisos persistidos que el hook de notificaciones interprete como nuevos | Verificar `use-notifications` tras recargar                                                                         |
| Escribir «retiro» en textos nuevos                                                 | Términos de D27                                                                                                     |

---

## 9. Ejecución por fases

Cada fase termina con `npx tsc --noEmit` y `pnpm run build`.

1. Acceso y logos (4.1, 4.6).
2. Persistencia del mock (DA-2).
3. Unidades, catálogo, solicitud, reserva, consumo y clasificación (4.2, 4.3).
4. Entrega y congelación (4.5).
5. Pagos y comprobante (4.7).
6. Imágenes del taller y perfil público (4.4).
7. Documentación y verificación integral.

Si aparece una diferencia entre el código y este plan, o algo que afecte una regla de negocio no descrita aquí, se detiene esa parte y se consulta.

---

## 10. Verificación

- **Recorrido entre vistas:** publicar pieza única → publicar con existencias → solicitar cantidades (límite por botones, escritura y servicio) → segunda solicitud de la misma pieza única → aceptar una (reserva) y comprobar que la otra ya no se puede aceptar → cotización visible en Pendiente → total congelado tras aceptar → coordinar fecha y lugar → adjuntar comprobante, reemplazarlo antes de enviar → observar → corregir (historial) → confirmar → producción → listo → entregado (descuento) → cancelación de otro pedido y clasificación de unidades.
- **Reglas del servicio** probadas directamente desde la consola del navegador importando `mock-api.ts` (cantidades fuera de rango, aceptación sin unidades, cambio de importes tras aceptar, acceso al comprobante con la sesión equivocada).
- **Persistencia:** recargar tras cada operación clave y tras subir imágenes; «Restablecer» vuelve al seed.
- **Acceso:** navegación directa a `/auth`, validaciones y enlace visible en 360 px y 1366 px.
- **Imágenes:** formato y tamaño inválidos; perfil público a 360, 390, 768, 1366 y 1920 px sin superposición ni recortes del encabezado.
- **Favicon:** pestaña nueva sin icono y sin petición a `/favicon.ico`.
- **Checks:** `npx tsc --noEmit`, `pnpm run build`, y `pnpm run lint` comparado contra la línea base tomada antes de esta fase (10 590 errores, casi todos `prettier/prettier` por CRLF, deuda previa): se reportarán por separado los errores previos y los nuevos. El repositorio no tiene pruebas automatizadas; no se añade un framework de pruebas en esta fase.

---

## 11. Documentación a actualizar

- Este plan: matriz de trazabilidad final (punto → RF → estado de homologación → qué simula el prototipo → qué falta) y guion de demostración nuevo.
- `2026-09-30-pulido-presentacion.md`: nota en las brechas B2, B4 y B5 y en el guion, remitiendo a este plan; no se reescriben.
- `docs/requisitos/requisitos.md` (DA-4): fichas según la v2.1 con los mismos identificadores; registro de revisión (fecha, fuente, qué cambia) que conserve la aprobación de las versiones previas; «pieza única / con existencias», «personalización opcional» y «recoger en el taller cuesta C$ 0» como definiciones de Luis pendientes de homologación; desviaciones conocidas actualizadas (D-10 y las que esta fase cierre o abra), sin presentar lo simulado como implementado en el backend.
- `docs/requisitos/modulos-funcionalidades.md` (nuevo, DA-4): módulos 4.4 de la v2.1, enlazado desde `requisitos.md`.
- `docs/api/frontera-mock-backend.md`: registrar las funciones nuevas del mock como «sin contrato todavía; dependen de homologación y ADR-006».

## 12. Entrega de esta continuación

**Resolución posterior de P-2:** Luis eligió A: personalizar modifica unidades disponibles y consume la misma reserva. Pieza única máximo 1; existencias según disponibilidad. Fabricación bajo demanda sigue como brecha independiente de RF-017. Esta resolución sustituye la duda histórica de §3.2. La ruta directa estándar está implementada y ya no es parte de lo excluido en §6.

Se conectó persistencia; IDs continúan desde los datos guardados; guardado serializado y reversión ante error de IndexedDB. Se implementaron productos con unidades/ajuste con motivo, cantidades limitadas, reserva y congelación al aceptar, consumo al entregar y clasificación tras cancelación. Entrega tiene cotización pendiente y coordinación posterior sin alterar importes. Pagos guardan intentos, imágenes, correcciones y resoluciones; la imagen se consulta aparte solo por las partes simuladas. Restablecer borra la instantánea completa.

Se adaptaron catálogo/ficha, solicitud, Mis productos, ambos detalles del pedido, pagos, insignias, líneas de tiempo, clasificación de cancelados, foto/portada y encabezado público. El favicon usa un SVG transparente válido. Aceptar abre un diálogo de la aplicación con unidades y desglose. Documentación: revisión complementaria de requisitos, módulos nuevos, frontera mock/backend y nota en plan de pulido. No se modifican contrato, ADR ni aprobación histórica; no se inventa v2.1.

### Evidencia anterior a la petición de Luis de asumir las pruebas

- TypeScript y build pasaron antes del último ajuste del diálogo, etiquetas y documentación. Build avisó del tamaño del bundle y de `vite-tsconfig-paths`.
- `node scripts/check-demo.mjs` pasó: cantidades inválidas, concurrencia por última unidad, cotización obligatoria y recogida C$ 0, congelación, pago obligatorio y rutas, imágenes inválidas, acceso por partes y rechazo a terceros/administrador, historial y plazo, consumo/clasificación, reversión ante fallo de guardado y reset.
- Navegador: pieza única publicada y conservada tras recarga; solicitud estándar cantidad 1; preferencia; aceptación bloqueada hasta cotizar; reserva y total congelado recuperados tras recarga; coordinación conservando total. Recorrido detenido antes de cargar voucher por instrucción de Luis.
- Lint: 6 612 errores `prettier/prettier` frente a 10 590 de la línea base, y 9 advertencias `react-refresh/only-export-components` en archivos previos. Los archivos funcionales de esta continuación estaban sin errores tras formatearlos; quedan errores de formato en otros archivos. Script y últimos ajustes no forman parte de esa medición. Lint global no está limpio.
- No se completó la prueba visual de pagos/perfil/responsive/reset. No se ejecutaron más checks después de la petición de Luis. La entrega se prepara para commit y push, autorizados posteriormente por Luis; no se solicita merge.

### Qué probar manualmente

1. Pestaña nueva: icono eliminado, nombre textual, Acceso visible; ruta `/auth` y validaciones.
2. Publicar pieza única y existencias; editar cantidades con motivo; impedir bajar de comprometidas. Comprador: fijo 1 o límite por disponibles, botones/escritura inválida y personalización opcional respetando unidades.
3. Dos solicitudes por la última unidad; el comprador elige modalidad y ubicación obligatoria para encuentro/entrega por artesano. El artesano solo cotiza costo/notas, recogida C$ 0; aceptar una y comprobar que la otra ya no puede aceptarse. Revisar ambas vistas.
4. Tras aceptar: total/modalidad/importes congelados. Recogida: calendario, guardar fecha, recargar y comprobar la misma fecha y dirección del perfil en la vista del comprador; editar dirección del perfil y comprobarla de nuevo. Otras modalidades: coordinar fecha/indicaciones conservando la ubicación del comprador. Con pago confirmado: estándar directo a Listo y personalizado por producción. Entregar descuenta físicas y reserva.
5. Pago: cargar PNG/JPG/WebP ≤ 5 MB, previsualizar/reemplazar; artesano observa con motivo; comprador corrige dentro de 48 h sin borrar imágenes previas. Confirmar o marcar No recibido y registrar otro intento. Cargar voucher solo no confirma fondos.
6. Cancelar desde Aceptado: unidades siguen fuera del catálogo. Clasificar disponibles/bajas con suma exacta y motivo. En producción no hay acción de cancelar y el servicio rechaza el intento, conservando estado y reserva; comprobar también un diálogo abierto antes de iniciar producción.
7. Perfil: foto/portada, reemplazo y archivos inválidos. Encabezado/nombre completo a 360, 390, 768, 1366 y 1920 px.
8. Recargar productos, imágenes, pedidos, pagos y mensajes. Restablecer debe borrar cambios y restaurar PM-1001 a PM-1010 con reservas/imágenes iniciales.
9. Checks opcionales: `node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/vite/bin/vite.js build`, `node scripts/check-demo.mjs` y lint comparando la deuda indicada.

El bloqueo de corrección tras 48 horas, sin cambio automático y con resolución por el taller, requiere cotejo con v2.1. Varias líneas, fabricación bajo demanda, cancelaciones ampliadas, reembolsos y entregas parciales siguen pendientes. Persistencia y concurrencia corresponden a una instancia local; no prueban seguridad o transacciones de backend.
