# Módulos y funcionalidades — ArtesaNic

**Fuente:** sección 4.4 de la especificación consolidada **v2.1** (revisión local del 30-sep-2026), incorporada el 4-oct-2026. Fichas RF/RNF en [requisitos.md](requisitos.md).

> Los módulos siguientes expresan el alcance consolidado y las definiciones de funcionamiento incorporadas en los RF y RNF. **Su inclusión no significa que todas las funciones estén implementadas ni que el equipo ya haya homologado esta versión.** Lo que simula el prototipo está en la [sección 4.5](#45-estado-en-el-prototipo).

---

## 4.4.1 Módulo de Usuarios, Perfiles y Acceso

Este módulo gestiona las cuentas, la autenticación y los permisos de compradores y artesanos. El servidor controla roles y pertenencia; los talleres mantienen un perfil público sujeto a aprobación, diferenciado de los datos privados de acceso.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Gestión de cuentas | Registro | Registrar comprador, registrar artesano |
| Autenticación | Acceso | Iniciar sesión con teléfono y contraseña, cerrar sesión |
| Roles y permisos | Autorización | Asignar roles desde el servidor, verificar pertenencia al pedido, limitar acciones y datos |
| Gestión de cuentas | Activación | Activar y desactivar cuentas según permisos |
| Gestión de perfiles | Perfil del usuario | Consultar y editar datos personales propios |
| Perfil del taller | Información pública | Registrar y actualizar nombre, historia, rubro, ubicación general, horario y contactos públicos |
| Aprobación | Alta del taller | Solicitar aprobación, consultar resolución, aprobar o rechazar administrativamente |

**Requisitos vinculados:** RF-004, RF-008, RF-013; RNF-004, RNF-013. La recuperación de contraseña asistida y la representación técnica del taller rechazado requieren definición específica. El selector de actor de una demo no equivale a autorización real.

## 4.4.2 Módulo de Catálogo y Categorías

Este módulo administra productos, categorías y consulta pública. Una ficha puede ofrecer unidades estándar, personalización o ambas. El control mínimo de cantidades reserva al aceptar y consume al registrar entregas; la cancelación o el cierre parcial requieren clasificar las unidades pendientes para no ofrecer piezas dañadas.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Gestión de productos | Registro simplificado | Registrar fotografía principal, nombre y precio, categoría y descripción |
| Gestión de productos | Oferta | Habilitar estándar, personalizada o ambas; registrar los datos condicionales de cada opción |
| Gestión de productos | Edición y despublicación | Editar producto, despublicar sin borrar referencias históricas |
| Gestión de imágenes | Fotografías | Incorporar, validar, optimizar y almacenar archivos fuera de las filas de PostgreSQL |
| Unidades estándar | Disponibilidad | Registrar existencias físicas, consultar disponibles y reservadas, ajustar con motivo |
| Unidades estándar | Reserva y entrega | Verificar y reservar al aceptar, descontar existencias y reservas al registrar cada entrega |
| Unidades estándar | Clasificación posterior al cierre | Indicar cantidades reutilizables o de baja con motivo; resolverlas atómicamente |
| Unidades estándar | Clasificación pendiente | Mantener fuera del catálogo las cantidades reservadas hasta registrar su destino, incluso si el comprador ya canceló |
| Categorías | Clasificación | Asignar categoría por rubro local |
| Consulta del catálogo | Visualización | Mostrar publicaciones de talleres aprobados y ficha del producto |
| Búsqueda y filtros | Consulta | Buscar por nombre, filtrar por categoría, precio o taller, ordenar y paginar |
| Precios | Moneda | Mostrar córdobas y conversión informativa a dólares |

**Requisitos vinculados:** RF-001, RF-002, RF-003, RF-007, RF-017, RF-019, RF-022; RNF-003, RNF-007, RNF-011. Se excluyen almacenes, compras, Kardex y valorización. La disponibilidad mostrada al solicitar es orientativa; la comprobación definitiva es atómica al aceptar.

## 4.4.3 Módulo de Solicitudes y Pedidos

Este módulo controla el pedido desde la solicitud Pendiente hasta la entrega o cierre. El comprador prepara localmente renglones de un mismo taller; el artesano acepta o rechaza el conjunto. Las entregas pueden efectuarse en fechas distintas, después de que todos los productos estén listos y con el pago confirmado.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Solicitudes | Composición local | Crear desde ficha, elegir modalidad, indicar cantidad y personalización, agregar renglones del mismo taller |
| Solicitudes | Envío | Revisar y enviar; crear pedido Pendiente en el servidor |
| Solicitudes | Cancelación por comprador | Cancelar desde Pendiente con motivo y aviso, sin chat, reserva ni reembolso |
| Evaluación | Resolución del artesano | Aceptar todos los renglones con reserva y total congelado o rechazar con motivo |
| Consulta | Pedido e historial | Consultar detalle, cotización, estados de pedido y pago separados, entregas y eventos |
| Costos | Cotización | Desglosar renglones, servicios y distribución de cargos compartidos; mostrar en Pendiente y congelar al aceptar |
| Estados | Pedido estándar | Pendiente, Aceptado, Listo para entrega, Entregado |
| Estados | Pedido personalizado o mixto | Pendiente, Aceptado, En producción, Listo para entrega, Entregado |
| Cancelación | Comprador desde Aceptado | Cancelar antes de producción o Listo; mantener conciliación económica pendiente cuando corresponda |
| Cancelación | Imposibilidad del artesano | Cancelar desde Aceptado, En producción o Listo sin entregas, con motivo y reembolso total si recibió fondos |
| Cancelación | Falta de pago | Acción manual del artesano tras 48 horas desde aceptación; respetar el plazo de corrección del comprobante y resolver revisiones pendientes |
| Entrega | Modalidad y fechas | Acordar recogida en taller, punto de encuentro, entrega por artesano u otra modalidad descrita |
| Entrega | Registro por artesano | Registrar fecha y cantidad por renglón, consumir unidades estándar y cerrar como Entregado al completar todo |
| Entrega | Evidencia del comprador | Confirmar recepción o registrar discrepancia sin bloquear consumo ni cierre; notificar discrepancia al artesano |
| Recogida en taller | Atraso | Tras siete días desde Listo sin recoger cantidades pendientes, marcar atraso, avisar y acordar nueva fecha; conservar reservas |
| Cierre parcial | Imposibilidad | Cerrar por imposibilidad del artesano tras alguna entrega, registrar motivo y devolución de lo pendiente |
| Cierre parcial | Solicitud del comprador | Solicitar cierre de cantidades no entregadas; artesano acepta o rechaza con motivo; solo la aceptación genera cierre y devolución |
| Cierre | Unidades pendientes | Clasificar reutilizables y bajas según RF-022; una clasificación pendiente no bloquea la cancelación del comprador |

**Requisitos vinculados:** RF-005, RF-006, RF-009, RF-010, RF-011, RF-015, RF-016, RF-018, RF-021, RF-022; RNF-008, RNF-011, RNF-014. La solicitud de cierre parcial y sus respuestas se registran como operaciones del pedido, sin crear estados nuevos del ciclo operativo.

**Transiciones del pedido:**

| Desde | Hacia | Actor y condición |
|---|---|---|
| Pendiente | Aceptado | Artesano: aceptación integral, disponibilidad verificada, reserva y cotización congelada |
| Pendiente | Rechazado | Artesano: rechazo con motivo |
| Pendiente | Cancelado | Comprador: cancelación de solicitud con motivo |
| Aceptado | En producción | Artesano: algún renglón personalizado y Pago confirmado |
| Aceptado | Listo para entrega | Artesano: todos los renglones estándar, preparados y Pago confirmado |
| En producción | Listo para entrega | Artesano: todos los productos terminados y listos |
| Aceptado | Cancelado | Comprador antes de producción o Listo; artesano por imposibilidad o por falta de pago conforme a los plazos |
| En producción | Cancelado | Artesano: imposibilidad de cumplir y obligación de devolver los fondos recibidos |
| Listo para entrega | Listo para entrega | Artesano: registrar entrega de una parte; o mantener recogida atrasada y reagendar |
| Listo para entrega | Entregado | Artesano: registro que completa todas las cantidades del pedido |
| Listo para entrega | Cancelado | Artesano: imposibilidad antes de cualquier entrega, con reembolso total |
| Listo para entrega | Cerrado parcialmente | Existe alguna entrega y queda cantidad pendiente: imposibilidad del artesano o solicitud del comprador aceptada |

Rechazado, Cancelado, Entregado y Cerrado parcialmente son terminales para el ciclo operativo. La confirmación o discrepancia del comprador, conciliación de pagos anteriores, clasificación de unidades y seguimiento de reembolsos pueden registrarse después sin reabrirlo. El comprador no cancela unilateralmente desde En producción o Listo. La confirmación de fondos no autoriza avanzar un pedido Cancelado. El paso del tiempo no cambia estados ni libera cantidades.

## 4.4.4 Módulo de Pagos y Reembolsos

Este módulo registra un pago externo por el total del pedido, con historial de intentos y correcciones, sin procesar tarjetas. El artesano confirma la recepción de fondos y registra devoluciones externas cuando procede una cancelación o cierre parcial. El estado económico se conserva separado del estado operativo del pedido.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Registro | Importe e información | Revisar total congelado, registrar método, referencia y comprobante cuando corresponda |
| Registro | Intentos y correcciones | Conservar historial, corregir comprobante, registrar otro intento si sigue Aceptado y no existe Pago confirmado |
| Revisión | Confirmación del artesano | Verificar y confirmar fondos recibidos |
| Revisión | Observación | Indicar motivo, notificar y registrar 48 horas para corregir desde la notificación |
| Revisión | Fondos no recibidos | Cerrar revisión como Pago no recibido sin cancelar por sí solo el pedido |
| Estados del pago | Seguimiento | Pendiente de pago, Pago registrado, Pago observado, Pago confirmado, Pago no recibido |
| Conciliación | Pedido Cancelado | Resolver intentos anteriores; impedir nuevos intentos y correcciones; generar reembolso si se confirman fondos |
| Reembolsos | Obligación total | Crear al cancelar con fondos recibidos o al confirmar un pago después de cancelar, sin duplicados |
| Reembolsos | Obligación parcial | Calcular cantidades no entregadas y servicios no prestados según desglose congelado |
| Reembolsos | Ejecución externa | Registrar fecha, importe y referencia, marcar Realizado y notificar |

**Requisitos vinculados:** RF-006, RF-011, RF-015, RF-021; RNF-004, RNF-008, RNF-011, RNF-014. La pasarela RF-012 está postergada. No se ofrece pago contra entrega, cuotas, ingreso de tarjetas ni arbitraje administrativo de disputas de pago.

**Transiciones de revisión del pago:**

| Desde | Hacia | Condición |
|---|---|---|
| Pendiente de pago | Pago registrado | Comprador registra la información del pago con el pedido Aceptado |
| Pago registrado | Pago observado | Artesano notifica motivo y plazo de corrección de 48 horas |
| Pago observado | Pago registrado | Comprador corrige el mismo intento mientras el pedido sigue Aceptado |
| Pago registrado o Pago observado | Pago confirmado | Artesano verifica recepción de fondos; si el pedido ya fue Cancelado, genera obligación de reembolso |
| Pago registrado o Pago observado | Pago no recibido | Artesano verifica que no llegaron fondos y registra motivo |
| Pago no recibido | Pago registrado | Comprador crea otro intento mientras el pedido sigue Aceptado y no hay Pago confirmado; se conserva el anterior |

Los intentos anteriores permanecen en el historial. Pago confirmado no se transforma en un pago nuevo ni se revierte por editar un comprobante. Pago no recibido no acorta un plazo de corrección vigente. Antes de cancelar por falta de pago se deben cumplir las 48 horas desde aceptación, finalizar los plazos de corrección aplicables y resolver revisiones pendientes. La plataforma registra información; corregir evidencia no implica transferir nuevamente.

## 4.4.5 Módulo de Mensajería

Este módulo permite que el comprador y el artesano del pedido coordinen características y entregas mediante mensajes de texto. El acceso depende de la pertenencia y del estado operativo; la administración no accede al contenido.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Conversación | Intercambio | Enviar y consultar mensajes asociados a un pedido |
| Acceso | Participantes | Autorizar únicamente al comprador y artesano correspondientes |
| Consulta | Historial | Mostrar mensajes en orden y conservarlos sin edición ordinaria |
| Consulta | Actualización | Polling incremental de mensajes nuevos con garantía de no omisión por concurrencia |
| Estado | Sin conversación | No crear chat en Pendiente, Rechazado o Cancelado desde Pendiente |
| Estado | Escritura | Habilitar desde Aceptado mientras el pedido permanezca operativo |
| Estado | Solo lectura | Mantener historial en Entregado, Cerrado parcialmente y Cancelado cuando hubo chat |

**Requisitos vinculados:** RF-014; RNF-004, RNF-008, RNF-010, RNF-013. No hay chat global. Las operaciones de conciliación, evidencia de entrega y reembolso tienen su registro propio y no dependen de reabrir un chat cerrado.

## 4.4.6 Módulo de Notificaciones

Este módulo genera avisos persistentes de operaciones de solicitud, pedido, pago, entrega y reembolso. Notifica las acciones que requieren conocimiento de la contraparte y permite consultar o marcar avisos como leídos.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Solicitudes | Emisión | Notificar solicitud nueva, cancelación en Pendiente, aceptación y rechazo |
| Pagos | Registro y revisión | Notificar intento o corrección, observación con motivo y plazo, confirmación de fondos y Pago no recibido |
| Plazos | Pago | Avisar al artesano de pedidos aceptados sin pago después de 48 horas, mostrando revisiones y plazos de corrección vigentes |
| Pedidos | Operación | Notificar Listo, cancelación y cierre parcial |
| Entregas | Evidencia | Notificar entrega registrada, confirmación de recepción y discrepancia del comprador al artesano |
| Cierre parcial | Solicitud y respuesta | Avisar al artesano de la solicitud y al comprador de aceptación o rechazo con motivo |
| Recogida en taller | Atraso | Avisar a las partes tras siete días desde Listo sin recoger cantidades pendientes |
| Reembolsos | Seguimiento | Notificar obligación pendiente y devolución registrada |
| Gestión | Consulta y lectura | Consultar avisos propios y marcar como leídos |

**Requisitos vinculados:** RF-020; RNF-004, RNF-014. Los avisos no cambian por sí solos estados, pagos ni reservas. El mecanismo de avisos por plazo y prevención de duplicados se concretará en el ADR-006 y el contrato. No se agregan avisos obligatorios por cada mensaje de chat ni se extiende la regla de siete días a otras modalidades sin definición.

## 4.4.7 Módulo de Trazabilidad

Este módulo conserva evidencia de las operaciones y sus responsables, vinculando estados, cantidades e importes al pedido. El historial se persiste junto con la operación y mantiene diferencias entre registro de entrega, confirmación de recepción, cierre operativo y resolución económica.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Pedido | Cambios operativos | Registrar aceptación, rechazo, cancelación, estados anteriores y nuevos y motivo |
| Cierre parcial | Solicitud y resolución | Registrar solicitante, fecha, aceptación o rechazo, motivo y cantidades pendientes |
| Pago | Historial de intentos | Conservar registros, correcciones, comprobantes autorizados, observaciones, notificación y plazo de 48 horas |
| Pago | Conciliación | Registrar fondos recibidos o no recibidos, incluso tras Cancelado |
| Entrega | Registro y evidencia | Registrar cantidades, fecha y artesano; conservar confirmación o discrepancia del comprador por separado |
| Unidades | Operaciones | Registrar ajustes, reservas, clasificación pendiente o resuelta, liberaciones, bajas con motivo y consumo por entrega |
| Reembolso | Cálculo y devolución | Conservar distribución económica, obligación, importe y evidencia de devolución externa |
| Auditoría | Identificación | Asociar usuario autenticado, operación, fecha y hora |
| Consulta | Historial autorizado | Mostrar eventos a las partes; consulta administrativa solo según permisos y sin chats o comprobantes |
| Conservación | Integridad | Impedir edición ordinaria de eventos y mantener mensajes históricos |

**Requisitos vinculados:** RF-010, RF-011, RF-015, RF-021, RF-022; RNF-008, RNF-011, RNF-013. Un estado operativo terminal no borra obligaciones económicas ni evidencia pendiente.

## 4.4.8 Módulo de Administración

Este módulo usa Django Admin para gestionar talleres, cuentas, publicaciones y configuración. La supervisión de pedidos e historial autorizado es de solo lectura y no permite alterar acuerdos comerciales ni acceder al contenido de chats o comprobantes.

| SubMódulo | Sub-submódulo | Opciones |
|---|---|---|
| Talleres | Aprobación | Aprobar o rechazar registro y conservar resolución |
| Cuentas | Activación | Activar o desactivar según permisos |
| Moderación | Publicaciones | Moderar o despublicar con motivo y actor |
| Supervisión | Pedidos | Consultar listado, estados e importes en solo lectura |
| Supervisión | Auditoría autorizada | Consultar eventos permitidos sin editar pedidos ni acuerdos |
| Configuración | Divisas | Configurar tasa para conversión informativa |
| Control de acceso | Restricciones | Impedir acceso administrativo a chats y comprobantes y modificación de renglones |

**Requisitos vinculados:** RF-004, RF-007, RF-013, RF-019; RNF-004, RNF-008, RNF-013. No se crea un panel administrativo frontend ni arbitraje interno de disputas de pago. La representación del rechazo del taller y el mecanismo de restitución de publicaciones deben ratificarse al definir el contrato.

---

## Control de revisión y asuntos pendientes de la v2.1

Esta versión incorpora F2–F14: cancelación por imposibilidad desde Aceptado; clasificación de unidades no entregadas; Pago no recibido con continuidad del pedido e historial de intentos; reservas en recogida atrasada; registro de entrega y evidencia del comprador; desglose económico obligatorio; avisos de pago no recibido, cierre parcial y discrepancia; solicitud de cierre parcial; terminología unívoca; eliminación de referencias a la conversación; eliminación de la condición redundante de entrega en producción; plazo de corrección; reembolso por fondos confirmados después de cancelar. F1 se mantiene como decisión de diseño del ADR-006.

Permanecen pendientes la homologación del equipo; la atribución formal de requisitos nuevos; recuperación de contraseña; revisión normativa; cargo por tardanza; tratamiento de recepción fallida fuera del taller; representación técnica del taller rechazado; restitución de publicaciones moderadas; diseño del cursor del chat; frecuencia y retención de respaldos; condiciones exactas de medición de disponibilidad y rendimiento; y mecanismo de avisos por plazo. Las reglas consolidadas no acreditan que el contrato, el frontend o el backend ya las implementen.

---

## 4.5 Estado en el prototipo

Funciones que simula el prototipo con datos mock (estado 3 de la escala de avance). Las definiciones L-1 a L-6 y las desviaciones V-1 a V-12 están en [requisitos.md, secciones 3 y 5](requisitos.md#3-definiciones-de-luis-posteriores-a-la-v21).

| Módulo | Simulado en el prototipo | No simulado |
|---|---|---|
| 4.4.1 Usuarios, perfiles y acceso | Pantalla de acceso con validación; selector de vista rotulado como herramienta de demo; perfil del taller con foto y portada | Registro y sesión reales, roles del servidor, aprobación de talleres |
| 4.4.2 Catálogo y categorías | Publicación y edición; pieza única o con existencias (L-1); personalización opcional (L-2); existencias físicas, reservadas, por clasificar y disponibles; ajustes con motivo; búsqueda, filtros y paginación | Despublicación y moderación; optimización de imágenes en servidor; personalización bajo demanda sin unidades |
| 4.4.3 Solicitudes y pedidos | Solicitud de un producto con cantidad limitada; cotización visible en Pendiente; aceptación integral con nueva comprobación, reserva y congelación; rutas estándar y personalizada; cancelación del comprador desde Aceptado; clasificación de unidades | Varios renglones; cancelación de solicitud Pendiente; cancelaciones del artesano; entregas parciales, evidencia del comprador, recogida atrasada y cierre parcial |
| 4.4.4 Pagos y reembolsos | Intentos con imagen del comprobante; observación con motivo y plazo de 48 horas; corrección que conserva imágenes anteriores; confirmación y Pago no recibido; nuevo intento | Conciliación tras Cancelado y reembolsos (V-3); comportamiento al vencer el plazo pendiente de decisión (V-4) |
| 4.4.5 Mensajería | Chat por pedido según estado, con sondeo de mensajes reales | Cursor con garantía de orden de confirmación |
| 4.4.6 Notificaciones | Solo avisos de mensajes nuevos de la otra parte | Notificaciones persistentes de eventos del pedido |
| 4.4.7 Trazabilidad | Historial de eventos de pedido, pago, entrega y unidades; movimientos de unidades con actor, fecha y motivo | Persistencia transaccional e inmutable en servidor |
| 4.4.8 Administración | — | Django Admin |

**Persistencia de la demo:** IndexedDB conserva productos, imágenes, perfil del taller, pedidos, reservas, pagos, comprobantes, movimientos y mensajes al recargar. «Restablecer datos de demostración» borra la instantánea y vuelve al escenario inicial completo. Si existen datos guardados que no pueden leerse o son de otra versión, la demo no los sobrescribe: trabaja solo en memoria, lo avisa en pantalla y solo «Restablecer» los reemplaza. No comparte datos entre dispositivos ni sincroniza pestañas.

---

## Historial de este documento

Antes de disponer de la v2.1, este archivo describía solo las funciones del prototipo, sin reproducir la sección 4.4. Su texto del 30-sep y 1-oct-2026 se conserva a continuación.

### Texto anterior: «Módulos y funcionalidades del prototipo ArtesaNic»

**Revisión de entrega del 1-oct-2026 (Luis, RF-009/RF-016):** el comprador elige la modalidad; el artesano solo cotiza costo y notas opcionales. Para recoger en taller se guarda `entrega.fechaRecogida` como fecha `YYYY-MM-DD` mediante selector de calendario, después de aceptar. La dirección se consulta de `Artisan.ubicacion` y se muestra en ambas vistas. No se cambian modalidad ni total congelado. Pruebas manuales a cargo de Luis.

**Revisión de cancelación del 1-oct-2026 (Luis, RF-015):** solo desde Aceptado; iniciar producción impide cancelar desde comprador y servicio. Se conservan reservas ante intentos rechazados y clasificación para cancelaciones válidas. Pruebas manuales a cargo de Luis.

**Ajuste del 1-oct-2026, solicitado por Luis (RF-009/RF-016):** al solicitar punto de encuentro o entrega por el artesano, el comprador indica una ubicación obligatoria de hasta 200 caracteres. Se guarda en `entregaPreferida.ubicacion`, se muestra en ambos detalles y queda separada de las notas de cotización/coordinación del taller. El artesano no edita ese campo. Las solicitudes anteriores sin ubicación conservan su forma. Pruebas manuales a cargo de Luis.

**Revisión:** 30-sep-2026. **Estado:** implementación simulada, pendiente de homologación.

Fuente: instrucciones y respuestas de Luis del [plan funcional](../superpowers/plans/2026-09-30-correcciones-funcionales-demo.md), sobre la [línea base de requisitos](requisitos.md). La especificación v2.1 no está disponible. Este documento agrupa las funciones presentes; no reproduce ni atribuye numeración a los módulos 4.4 de v2.1. Queda pendiente cotejar nombres, estructura y condiciones con esa fuente, conservando las aprobaciones anteriores.

| Módulo de la demo        | Funciones presentes                                                                                                                                                                                                                                       | Trazabilidad                                   | Pendiente                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| Acceso y navegación      | Acceso visible en escritorio y móvil; formularios con validación; selector comprador/artesano rotulado como demo; nombre textual y favicon transparente                                                                                                   | RF-004                                         | Autenticación y permisos reales                                            |
| Catálogo y publicaciones | Crear/editar; pieza única o existencias; personalización opcional; cantidades físicas, reservadas, pendientes de clasificación y disponibles; ajustes con motivo; fotografía validada                                                                     | RF-001, RF-002, RF-003, RF-017, RF-022         | Homologación, compresión real y fabricación bajo demanda independiente     |
| Solicitudes y pedidos    | Cantidades enteras limitadas; pieza única siempre 1; opción sin modificaciones o personalizada; preferencia de entrega; nueva comprobación, reserva y congelación al aceptar; estándar directo a Listo y personalizado por producción con pago confirmado | RF-005, RF-006, RF-009, RF-010, RF-017, RF-018 | Varios renglones de un taller; contrato y transacciones del backend        |
| Entrega                  | Comprador elige modalidad; artesano cotiza costo y notas; recoger cuesta C$ 0, con fecha de calendario y dirección del perfil; coordinación conserva importes; entregar consume físicas y reserva                                                         | RF-006, RF-016, RF-022                         | Homologación de recogida gratuita, entregas parciales y discrepancias      |
| Cancelación y unidades   | Cancelación del comprador solo desde Aceptado; reserva pendiente de clasificación; suma exacta de disponibles y bajas, con motivo; movimientos auditados                                                                                                  | RF-015, RF-022, RNF-008                        | Cancelar Pendiente, cancelación por artesano, reembolsos y cierre parcial  |
| Pagos y comprobantes     | Método, referencia y nota; imagen con previsualización y reemplazo antes de enviar; intentos/correcciones/resoluciones conservados; Confirmado/Observado/No recibido y plazo visible; consulta de imagen solo para las partes                             | RF-011, RNF-004, RNF-008, RNF-013              | Cotejo de v2.1; pasarela postergada; archivos privados y autorización real |
| Perfil del taller        | Foto y portada reemplazables; JPG/PNG/WebP ≤ 5 MB; previsualización; encabezado público posicionado y nombres sin truncar                                                                                                                                 | RF-008, RF-002                                 | Almacenamiento y propiedad por servidor                                    |
| Mensajes e historial     | Chat según estado; mensajes persistidos; eventos de pedido, pago, entrega y unidades                                                                                                                                                                      | RF-014, RNF-008, RNF-010                       | Chat autenticado y avisos de plazo                                         |
| Persistencia de demo     | Instantánea versionada en IndexedDB; lectura antes de consultas; IDs continúan tras recarga; guardado serializado, reversión ante fallo y restablecimiento completo                                                                                       | DA-2 del plan                                  | No sustituye PostgreSQL ni sincroniza dispositivos/pestañas                |

Pieza única/existencias, personalización de unidades existentes y recogida gratuita son definiciones de Luis pendientes de homologación. RF-017 bajo demanda y RF-018 con varios renglones conservan su alcance aunque todavía no se simulen. El comportamiento provisional de las 48 horas consta en la revisión de `requisitos.md`. Las funciones nuevas no modifican contrato ni ADR.
