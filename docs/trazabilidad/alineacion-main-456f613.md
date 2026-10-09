# Alineación del prototipo con los requisitos

> **Análisis histórico preservado del PR #1.** Describe el código `456f613`, no la rama avanzada consolidada. Los enlaces de evidencia apuntan al commit inspeccionado. Ver [discrepancias](discrepancias-documentales.md).

**Revisión:** 8 de octubre de 2026. **Repositorio:** Luigui789/Front-ArtesaNic. **Código inspeccionado:** [main, commit 456f613](https://github.com/Luigui789/Front-ArtesaNic/commit/456f613b381d30136f1d9949eef57a5f54a1508b).

**Fuentes:** [RF/RNF.docx](https://docs.google.com/document/d/14I9njtLSWzJdw465-lOoiDgSJeIpJRnb/edit), reproducido en [requisitos.md](../requisitos/requisitos.md), y texto adjunto del usuario que comienza «Revisé main del repo y hay algo importante: no basta con agregar la pantalla…».

Las fichas definen el alcance. El adjunto propone cómo adaptar modelos, mocks y pantallas. Esta revisión actualiza documentación; **no ejecuta esa adaptación ni acredita los requisitos como implementados**. No se utilizan como evidencia los cambios de otro repositorio local llamado masaya-artisan-connect.

## Hallazgos comprobados

| Hallazgo del código de referencia | Evidencia | Implicación |
|---|---|---|
| Product usa disponible: boolean, sin cantidades ni modalidades | [tipos](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/types/index.ts) | No expresa RF-017/RF-022 ni movimientos/costos |
| Order tiene productoId, cantidad y precioUnitario en el pedido | [tipos](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/types/index.ts), createOrderRequest en [mock-api](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/services/mock-api.ts) | Pedido de un producto; falta RF-018 |
| Siete estados del pedido; sin Cerrado parcialmente | [tipos](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/types/index.ts), [order-state](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/lib/order-state.ts) | Falta cierre parcial y ruta estándar directa a Listo |
| changeOrderStatus solo comprueba transición de estado | [mock-api](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/services/mock-api.ts) | No comprueba fondos, renglones ni reserva integral |
| canCancel admite Aceptado y En producción sin distinguir rol | [order-state](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/lib/order-state.ts) | No representa las condiciones de cancelación de RF-015 |
| Tres estados de pago y una propiedad pago opcional | [tipos](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/types/index.ts), registerPayment/confirmPayment en [mock-api](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/services/mock-api.ts) | Sin observaciones, plazos, correcciones, intentos ni conciliación |
| PaymentMethod incluye Pago contra entrega | [tipos](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/types/index.ts), [detalle comprador](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/routes/pedidos.%24id.tsx) | Eliminar esa oferta en la adaptación: se exige pago antes de producción/Listo |
| setDelivery cambia costo sin restricción por aceptación | [mock-api](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/services/mock-api.ts) | Falta congelación de importes y plan previo de entregas |
| AuditEvent solo representa pedido/pago | [tipos](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/types/index.ts) | Faltan acciones, cantidades, entregas, reembolsos e inventario |
| pollNewMessages inserta mensajes entrantes aleatorios | [mock-api](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/services/mock-api.ts) | La demo aún no cumple el objetivo de mensajes reproducibles |
| Notificaciones de mensajes en estado React, con sondeo de 20 s | [use-notifications](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/hooks/use-notifications.tsx) | No equivale a RF-020, que exige eventos persistentes del pedido |
| Store de negocio en memoria; sesión en localStorage | [mock-api](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/services/mock-api.ts), [use-session](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/hooks/use-session.tsx) | No hay persistencia durable de negocio ni garantías entre dispositivos |
| Router/Start, SSR y Nitro de plantilla | [package.json](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/package.json), [vite.config.ts](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/vite.config.ts), [router](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/router.tsx), [start](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/start.ts) | Conservar arquitectura verificada; no atribuir otra migración a este main |
| No hay rutas de inventario | [rutas](https://github.com/Luigui789/Front-ArtesaNic/blob/456f613b381d30136f1d9949eef57a5f54a1508b/src/routes/README.md) y árbol de src/routes | Se proponen dos rutas; esta actualización no las crea |

## Matriz requisito → archivos afectados → cambio necesario

Los archivos citados existen en el commit inspeccionado. «Propuesto» identifica archivos/pantallas que todavía no existen. Las garantías de servidor son trabajo futuro fuera de esta fase frontend/mock.

### Requisitos funcionales

| ID | Estado en main / archivos afectados | Cambio necesario |
|---|---|---|
| RF-001 | Formulario en src/routes/panel.productos.tsx; ProductInput en src/services/mock-api.ts | Conservar cuatro grupos y hasta cinco pasos; opciones estándar/personalizada condicionales, sin gestión contable en el formulario |
| RF-002 | src/components/productos/image-uploader.tsx; processImage en src/services/mock-api.ts | Mantener feedback de procesamiento; distinguir simulación de validación/optimización y almacenamiento externo de servidor |
| RF-003 | src/routes/catalogo.tsx; listProducts en src/services/mock-api.ts; src/data/seed.ts | Conservar filtros/paginación; agregar publicación y aprobación como condiciones de visibilidad |
| RF-004 | src/routes/auth.tsx; src/hooks/use-session.tsx; src/types/index.ts | Distinguir selector de demo de autenticación; representar pertenencia, estados de cuenta/taller y autoridad futura del servidor |
| RF-005 | src/routes/panel.pedidos.$id.tsx; src/services/mock-api.ts; src/types/index.ts | Aceptar todos los renglones en una operación; revalidar/reservar estándar sin efectos parciales, auditar movimientos y congelar importes |
| RF-006 | src/routes/pedidos.$id.tsx; src/routes/panel.pedidos.$id.tsx; src/services/mock-api.ts; src/types/index.ts | Cotizar en Pendiente por renglón/servicio, distribuir cargos, congelar desglose y mostrar total contractual en C$ |
| RF-007 | src/hooks/use-currency.tsx; src/lib/format.ts; src/data/seed.ts | Mantener tasa simulada informativa; separar visualización US$ de importes contractuales C$; configuración real por Admin |
| RF-008 | src/routes/artesano.$id.tsx; src/routes/panel.perfil.tsx; src/types/index.ts | Conservar perfil público; separar contactos voluntarios públicos del teléfono privado de acceso |
| RF-009 | src/routes/solicitar.$productId.tsx; createOrderRequest en src/services/mock-api.ts | Composición local de renglones, modalidad y observaciones; enviar una vez crea Pendiente, sin sincronización entre dispositivos |
| RF-010 | src/lib/order-state.ts; src/components/pedidos/timelines.tsx; detalles comprador/artesano; src/services/mock-api.ts | Ruta estándar directa a Listo y personalizada/mixta por producción, con fondos confirmados; entregas por cantidades y evidencia separada |
| RF-011 | src/types/index.ts; src/lib/order-state.ts; detalles de pedido; src/services/mock-api.ts | Cinco estados, historial de intentos/correcciones, plazo y motivo, revisión de fondos tras Cancelado y eliminación de pago contra entrega |
| RF-012 | README.md y docs/requisitos.md | Conservar identificador postergado; no implementar pasarela ni convertirlo en aceptación del frontend |
| RF-013 | README.md y docs/modulos-y-reglas.md; backend futuro | Documentar Django Admin y acceso limitado; no crear interfaz administrativa React ni acceso a chats/comprobantes |
| RF-014 | src/components/pedidos/order-chat.tsx; src/routes/mensajes.tsx; src/lib/order-state.ts; src/services/mock-api.ts | Chat de las partes desde Aceptado; distinguir Cancelado sin chat previo; cerrar escritura en Cerrado parcialmente |
| RF-015 | src/lib/order-state.ts; detalles de pedido; src/services/mock-api.ts; src/types/index.ts | Cancelación por rol/causa/estado, cancelación de Pendiente, plazos de pago, solicitudes/respuestas de cierre parcial y destino de unidades |
| RF-016 | src/routes/solicitar.$productId.tsx; detalles de pedido; setDelivery en src/services/mock-api.ts | Preferencia y plan de varias entregas antes de aceptar; coordinar fecha/lugar después conservando importes |
| RF-017 | src/types/index.ts; src/routes/producto.$id.tsx; src/routes/panel.productos.tsx; src/components/catalogo/product-card.tsx | Modalidades independientes; disponibilidad estándar derivada; personalización bajo demanda sin stock previo |
| RF-018 | src/types/index.ts; src/data/seed.ts; src/services/mock-api.ts; solicitud/listados/detalles | Reemplazar pedido monoproducto por renglones de un taller; aceptación integral, un pago económico total y varias entregas |
| RF-019 | src/routes/panel.productos.tsx; listProducts en src/services/mock-api.ts; src/types/index.ts | Publicación/moderación con actor y motivo, sin borrar referencias/precios de pedidos históricos; restitución pendiente de contrato |
| RF-020 | src/hooks/use-notifications.tsx; src/components/layout/site-layout.tsx; src/services/mock-api.ts; src/types/index.ts | Notificaciones persistentes de eventos, lectura, plazos e idempotencia; distinguirlas de toasts y mensajes nuevos |
| RF-021 | src/types/index.ts; src/services/mock-api.ts; detalles de pedido | Obligaciones Pendiente/Realizado, cálculo congelado, devolución externa, conciliación tras Cancelado y prevención de duplicados |
| RF-022 | src/types/index.ts; src/services/mock-api.ts; src/data/seed.ts; pantallas de inventario propuestas | Saldo físico/reservado/por clasificar, disponibilidad derivada, movimientos válidos e invariantes; no editar reservas manualmente |
| RF-023 | src/types/index.ts; src/services/mock-api.ts; src/components/pedidos/timelines.tsx; inventario propuesto | Diez tipos mínimos de movimiento, actor/fecha/motivo/referencias, saldos antes/después y correcciones con nuevo evento |
| RF-024 | src/types/index.ts; src/services/mock-api.ts; src/data/seed.ts; inventario propuesto | Costos de entrada, promedio ponderado por ratificar, costo aplicado histórico, valorización y margen cuando haya datos |

### Requisitos no funcionales

| ID | Estado / archivos afectados | Cambio o verificación necesario |
|---|---|---|
| RNF-001 | Rutas, src/components/ui y formularios existentes/propuestos | Medir blancos 44 × 44 px, publicación ≤5 pasos, lenguaje y estados textuales |
| RNF-002 | src/styles.css; src/components/layout/site-layout.tsx; catálogo/pedidos/inventario | Verificar cinco tamaños de referencia y todas las acciones; inventario responsive sin desbordamiento |
| RNF-003 | src/routes/catalogo.tsx; src/components/catalogo/product-card.tsx; listProducts | Medir ≤3 s con perfil controlado y 500 productos; paginación e imágenes diferidas; no declarar aprobado sin medición |
| RNF-004 | src/hooks/use-session.tsx; src/services/mock-api.ts; interfaces de pago/chat; backend futuro | Representar permisos de las partes; TLS, hash, CSRF aplicable y acceso privado garantizados por servidor; sin tarjetas/credenciales bancarias |
| RNF-005 | src/router.tsx; src/services/mock-api.ts; src/types/index.ts; contrato futuro | Preservar router actual y frontera servicios/UI; definir REST/JSON y mapeo snake_case/camelCase para integración posterior |
| RNF-006 | src/components/common/states.tsx; simularFalloProximaPeticion; infraestructura futura | Mantener error/reintento; definir periodo y exclusiones para medir ≥95 %; no atribuir disponibilidad al mock |
| RNF-007 | src/data/seed.ts; listProducts; inventario/movimientos propuestos | Escenarios de 50 talleres/500 productos e historial paginado; concurrencia de última unidad en servidor futuro |
| RNF-008 | src/types/index.ts; src/services/mock-api.ts; src/components/pedidos/timelines.tsx | Auditoría completa de estados, importes, unidades y costos históricos; persistencia transaccional e inmutabilidad en servidor |
| RNF-009 | Rutas y componentes del frontend | Verificar flujos esenciales en Chrome, Firefox, Edge y Chrome móvil; registrar versiones y resultados |
| RNF-010 | src/components/pedidos/order-chat.tsx; pollNewMessages; src/hooks/use-notifications.tsx | Mensajes reproducibles y polling incremental ~15 s activo; cursor y garantía de confirmación concurrente por ratificar |
| RNF-011 | src/services/mock-api.ts; src/types/index.ts; servicios de dominio propuestos | Simular operación integral e invariantes sin efectos parciales; comprobar ACID/idempotencia/concurrencia real en Django/PostgreSQL |
| RNF-012 | Backend/almacenamiento futuros; documentación de operación por definir | Fijar frecuencia/retención y demostrar restauración antes de datos reales; no presentar localStorage como respaldo |
| RNF-013 | src/types/index.ts; perfil público; src/hooks/use-session.tsx; pagos/chat | Minimizar datos; separar teléfono privado/contactos públicos; evidencia de pago/chat según pertenencia; sin acceso administrativo |
| RNF-014 | Mutaciones en src/services/mock-api.ts y formularios; persistencia futura | Identificar operación técnica, consultar resultado incierto y reintentar sin duplicar; distinguir otro intento económico |
| RNF-015 | Servicios/reglas; src/lib/order-state.ts; pruebas futuras | Centralizar reglas; pruebas de estados, roles, plazos, economía, idempotencia, inventario y concurrencia, con IDs RF/RNF |

La presencia de una pantalla no prueba el cumplimiento integral. Rendimiento, disponibilidad, accesibilidad, autorización real, restauración y concurrencia requieren evidencia propia.

## Modelo objetivo propuesto

Estos nombres ilustran datos necesarios. **No son tipos ya implementados ni un contrato REST aprobado.** Conservar la interfaz de servicios al adaptarlos y resolver decisiones pendientes antes de fijar el contrato.

| Entidad | Datos y relaciones necesarias |
|---|---|
| Product | Datos comerciales actuales, modalidadEstandar/modalidadPersonalizada y publicación; saldo de inventario separado o asociado sin duplicar fuentes de verdad |
| InventoryBalance | productoId, existenciasFisicas, reservadas, porClasificar y costoPromedio; disponibles derivado, nunca editable independiente |
| OrderLine | ID, producto, modalidad, cantidad, personalización condicional, precio unitario y subtotal congelados |
| Order | Un taller/comprador, renglones, estado operativo y estado de pago separados, cotización/desglose, planes, intentos, entregas, cierres, reembolsos e historial |
| Quotation / ChargeAllocation | Renglón o servicio, concepto, importe y distribución de cargos compartidos; versión congelada al aceptar |
| PaymentAttempt / PaymentCorrection | Método/referencia/comprobante autorizado, estado, fecha, motivo, notificación, límite de corrección e historial de modificaciones |
| DeliveryPlan | Una o varias fechas/modalidades/lugares y cargos propuestos antes de aceptar; coordinación posterior sin cambiar total |
| Delivery / ReceiptEvidence | Entrega efectiva por cantidades/renglón, fecha/artesano y costo aplicado; confirmación o discrepancia del comprador separada |
| PartialClosureRequest | Solicitante, cantidades pendientes, fecha/motivo y respuesta con actor/fecha/motivo; no cierra por sí sola |
| Refund | Pedido/causa, Pendiente o Realizado, importe y cálculo congelado; fecha/importe/referencia de devolución externa |
| InventoryMovement | Tipo, producto, cantidad, responsable, tiempo, motivo, referencias, saldos relevantes antes/después y costo aplicado cuando corresponda |
| InventoryReservation / PendingClassification | Producto, renglón/pedido, cantidad y origen; resultado de operaciones autorizadas, sin edición directa del saldo reservado |
| Notification | Destinatario, evento/referencia, fecha, lectura y clave que impida duplicar el mismo evento |
| AuditEvent | Tipo/acción, usuario, fecha, motivo, estados opcionales, cantidades/importes y referencia; pedido/pago/reembolso/entrega/inventario |

Ejemplo conceptual de renglones:

```ts
interface OrderLine {
  id: string;
  productoId: string;
  modalidad: "estandar" | "personalizada";
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  personalizacion?: string;
}

interface OrderComposition {
  artesanoId: string;
  renglones: OrderLine[];
}
```

La cotización y las entregas conservan sus propios datos históricos. El costo aplicado a una entrega o baja se captura al registrar esa operación; una entrada posterior no lo recalcula retroactivamente. La disponibilidad booleana, si se conserva para UI estándar, se deriva de disponibles >0 y no sustituye la oferta personalizada.

## Servicios mock propuestos

Mantener consultas/mutaciones en servicios consumidos por TanStack Query, con latencia, error y resultados clonados coherentes con el mock. El servicio valida la operación antes de aplicar cambios; una mutación fallida no altera parte del store ni deja movimientos sin causa.

| Área | Operaciones conceptuales |
|---|---|
| Inventario | listInventoryProducts, getInventoryProduct, listInventoryMovements, getInventoryValuation |
| Movimientos manuales | registerInitialStock, registerInventoryEntry, adjustInventory, registerWriteOff |
| Operaciones ligadas al pedido | reserveUnits, releaseUnits, consumeReservedUnits, markPendingClassification |
| Clasificación | classifyAsReusable, classifyAsWriteOff; resolver la totalidad de las cantidades que se clasifican en una operación coherente |
| Solicitudes/cotización | Crear solicitud con renglones; cotizar y distribuir cargos; aceptar/rechazar integralmente |
| Pago | Registrar intento, observar/notificar, corregir, confirmar o resolver no recibido; conciliar revisión anterior tras Cancelado |
| Entrega/cierre | Registrar entrega, evidencia del comprador, cancelar, solicitar/responder cierre parcial |
| Reembolso/notificaciones | Crear obligación sin duplicados, registrar devolución externa, consultar/marcar avisos propios |

Los helpers de reserva/liberación/consumo son operaciones internas del dominio: no exponen un formulario para editar reservas. La aceptación del pedido coordina todas las reservas y movimientos; la entrega coordina consumo y costo; la cancelación/cierre coordina unidades, obligaciones y avisos.

Usar un identificador de operación para simular reenvíos: repetir la misma entrada/entrega/clasificación devuelve el resultado anterior sin duplicación. Una nueva acción del comprador para registrar otro intento de pago tiene identidad distinta y conserva la anterior. La simulación no proporciona transacciones entre procesos, persistencia durable ni garantías de concurrencia real.

Los contratos HTTP, códigos de error, cursores, autorización, archivos privados y mecanismo durable de idempotencia se definirán al integrar el backend. Estos nombres no constituyen endpoints existentes ni autorizan desarrollar una API real en esta fase.

## Costos y valorización

RF-024 de la fuente dice «costo promedio ponderado para las existencias disponibles». El adjunto propone la fórmula con **existencia física anterior**:

```text
costoNuevo =
  (existenciaAnterior × costoAnterior + cantidadEntrada × costoEntrada)
  / (existenciaAnterior + cantidadEntrada)

Ejemplo sin reservas ni pendientes:
10 unidades a C$100 + 5 unidades a C$130 → 15 unidades a C$110
```

La fórmula es una **propuesta técnica del adjunto**, no una decisión adicional homologada. Con reservas o unidades por clasificar, la diferencia entre físicas y disponibles afecta la base: debe ratificarse antes de implementar. También falta fijar costo inicial, tratamiento económico de ajustes positivos/negativos y redondeo/precisión. No atribuir a RF-024 una fórmula más específica que la fuente sin registrar esa decisión.

Una reserva no cambia existencia física ni costo vigente. Entrega y baja conservan cantidad y costo aplicado histórico. La consulta puede estimar valor físico = físicas × costo vigente y valor disponible = disponibles × costo vigente, cuando el costo esté definido. No usar el precio de venta como costo de entrada ni inventar un costo ausente. Las métricas son administrativas; el alcance no incluye contabilidad ni ERP.

## Adaptación por fases propuesta

Esta secuencia prepara una futura tarea de código; no se ejecuta con la actualización documental.

1. Ratificar decisiones pendientes y matriz; ajustar tipos y modelo de dominio, incluyendo renglones, modalidades, pagos, entregas, cierres, reembolsos y movimientos.
2. Adaptar seed y servicios mock con escenarios deterministas, validación, operaciones integrales, cantidades coherentes y protección de reenvíos.
3. Integrar pedidos: cotización/congelación, aceptación con reserva, pago antes de producción/Listo, entregas por renglón, cancelación, clasificación, cierre parcial y devoluciones.
4. Crear Inventario y Costos y navegación del artesano; conservar sencillo el formulario de publicación.
5. Adaptar catálogo y solicitud por taller a estándar/personalizada, con disponibilidad derivada y nueva verificación al aceptar.
6. Ampliar trazabilidad, notificaciones y permisos simulados; retirar generación aleatoria de mensajes comerciales.
7. Verificar reglas con escenarios relevantes y pruebas de dominio; registrar límites de mocks frente a servidor.
8. Actualizar el estado de implementación en documentación con evidencia del commit probado.

**Condición de cierre de esa tarea futura:** modelo, servicios y pantallas cubren el alcance autorizado, las reglas se verifican con escenarios, no se agregan backend/ERP y la documentación distingue simulación de garantías de servidor. Mantener RF-012 postergado y RF-013 fuera de React.

## Escenarios de verificación

Son criterios para futuras pruebas de dominio/demostración. **No se ejecutaron como parte de esta revisión documental.**

| Escenario | Resultado esperado | Requisitos |
|---|---|---|
| Pedido de varios productos del mismo taller | Renglones conservados; mezclar otro taller falla antes de enviar | RF-009, RF-018 |
| Personalización sin stock estándar | Puede solicitarse si está habilitada; no genera automáticamente saldo estándar | RF-017, RF-022 |
| A necesita 2/hay 2, B necesita 3/hay 2 | Aceptación falla; A no queda reservado y ningún movimiento parcial permanece | RF-005, RNF-011 |
| Dos renglones del mismo producto o dos aceptaciones sobre última unidad | Suma de reservas no excede disponible; servidor debe demostrarlo bajo concurrencia real | RF-005, RF-022, RNF-011 |
| Pago sin confirmar | Impide producción y Listo; estándar confirmado va directo a Listo, mixto pasa por producción | RF-010, RF-011 |
| Comprobante observado | Motivo/notificación/plazo conservados; corrección vuelve a revisión sin borrar evidencia ni exigir nueva transferencia | RF-011, RNF-008 |
| Pago no recibido | No cancela pedido ni acorta plazo; permite otro intento autorizado y conserva anterior | RF-011 |
| Cancelar por falta de pago | Falla antes de 48 h, con plazo vigente o revisión sin resolver; después requiere acción manual | RF-015 |
| Comprador intenta cancelar producción/Listo | Operación rechazada sin cambiar unidades; Pendiente/Aceptado sí conforme a reglas | RF-015 |
| Cancelar con revisión previa y confirmar fondos luego | No admite nuevos intentos; confirma revisión anterior y crea una única obligación de devolución | RF-011, RF-021 |
| Entrega parcial estándar repetida por reenvío | Consume físicas/reservadas una vez, registra costo y sigue Listo hasta completar | RF-010, RF-022, RF-023, RNF-014 |
| Confirmación/discrepancia de recepción tras cierre | Conserva evidencia separada, avisa discrepancia y no descuenta inventario otra vez | RF-010, RF-020 |
| Solicitud de cierre parcial aceptada/rechazada | Solicitar no cierra; aceptar cierra y calcula devolución; rechazar conserva pedido y motivo | RF-015, RF-021 |
| Cancelación con clasificación pendiente | Termina cancelación; reservado pasa a porClasificar y sigue fuera de venta | RF-015, RF-022 |
| Clasificar reutilizable/baja | Cobertura exacta; reutilizable aumenta disponible, baja reduce físicas; motivo y movimiento conservados | RF-022, RF-023 |
| Ajuste/baja mayor que cantidad permitida | Rechazo sin saldos negativos, cambios parciales ni alteración de reservas | RF-022, RNF-011 |
| Entrada 10 a 100 + 5 a 130 sin reservas | Promedio propuesto 110; entrada repetida no duplica unidades ni recalcula otra vez | RF-024, RNF-014 |
| Nueva entrada tras entrega/baja | Costo vigente cambia según decisión ratificada; costo histórico de operación previa permanece | RF-023, RF-024, RNF-008 |
| Recogida atrasada en taller tras siete días | Aviso sin duplicados; sigue Listo, pagado y reservado; no revender ni extender regla a otras modalidades | RF-015, RF-020 |
| Despublicar producto con pedidos anteriores | Desaparece para nuevas solicitudes; referencias/importes históricos permanecen | RF-019 |
| Reembolso/cancelación/clasificación con doble envío | Una acción lógica produce un resultado y una evidencia; devolución no supera fondos confirmados | RF-021, RNF-011, RNF-014 |
| Sondeo de chat con mensajes concurrentes | Demo reproducible; contrato de servidor demuestra ausencia de omisiones por cursor | RF-014, RNF-010 |
| Notificación relevante repetida / lectura | Un aviso por evento/destinatario; marcado leído conservado en persistencia de negocio futura | RF-020 |
| 500 productos / 50 talleres / historial creciente | Paginación, rendimiento y concurrencia medidos; registrar perfil y resultado | RNF-003, RNF-007 |
| Móvil, tableta, escritorio y navegadores previstos | Acciones visibles, sin desbordamiento, teclado/foco/labels y estados textuales | RNF-001, RNF-002, RNF-009 |

Completar seed con producto normal, sin disponibilidad, con reserva, pendiente de clasificación y oferta dual; última unidad; pedido mixto; entregas parciales; cancelación/clasificación; entrada que cambia promedio; pagos observados y conciliación/reembolsos. Esos escenarios deben conservar cantidades, importes y referencias coherentes.

## Asuntos que siguen abiertos

Homologación/atribución formal de fichas; recuperación asistida; cursores de chat; restitución de publicaciones; recepción fallida fuera del taller; costos de inicialización/ajuste y base/precisión del promedio; revisión normativa y cargos por tardanza; respaldo/restauración y condiciones de medición.

La fuente menciona **ADR-006** para avisos por plazo: no existe en este repositorio y esta guía no lo ratifica. No se infiere una obligación de instalar Celery/Redis. Los avisos no cambian por sí solos pedidos, pagos ni reservas.

Las tareas futuras siguen limitadas al prototipo frontend/mock. No abarcan múltiples almacenes, compras, proveedores, materia prima, lotes/series, contabilidad, impuestos, cuentas por cobrar/pagar ni logística propia.
