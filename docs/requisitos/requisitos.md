# Requisitos funcionales y no funcionales

**Proyecto:** Sistema e-commerce para la comercialización de productos artesanales de las PYMEs del municipio de Masaya
**Asignatura:** Diseño de sistemas en internet — UNI, Recinto Universitario Simón Bolívar
**Grupo:** 5T1-SIS-S
**Autores:** Br. Luis Fernando José Gutiérrez Dávila · Br. Heidi Leana Piña Martínez · Br. Keyling de los Ángeles Rocha Pérez

**Redacción vigente:** especificación consolidada **v2.1** (revisión local del 30 de septiembre de 2026), incorporada al repositorio el 4 de octubre de 2026.
**Módulos y funcionalidades (sección 4.4 de la v2.1):** [modulos-funcionalidades.md](modulos-funcionalidades.md).

> **Este documento gobierna al prototipo.** Cuando el código contradiga un requisito, se corrige el código o se registra la diferencia como desviación; no se reescribe el requisito para acomodar la implementación. Las diferencias vigentes están en la sección [5. Estado del prototipo frente a la v2.1](#5-estado-del-prototipo-frente-a-la-v21).

> **Estado de homologación.** «Propuesto para homologación» identifica la redacción consolidada v2.1 y **no acredita implementación ni aprobación formal del equipo**. Las versiones aprobadas anteriormente no se revocan: se conservan en el [Anexo A](#anexo-a-línea-base-del-15-de-agosto-de-2026-histórica).

---

## Registro de revisiones

| Fecha | Versión | Fuente | Qué cambia | Estado |
|---|---|---|---|---|
| 15-ago-2026 | Línea base del repositorio | Documento de requisitos del equipo | RF-001 a RF-016 y RNF-001 a RNF-010 | Aprobados: RF-001 v1.0, RF-002 v1.0, RF-003 v1.0, RF-005 v2.0, RNF-001 v1.0, RNF-002 v1.0, RNF-003 v1.1 y RNF-005 v1.0 (Mantenibilidad). Los demás, Propuesto. Texto íntegro en el [Anexo A](#anexo-a-línea-base-del-15-de-agosto-de-2026-histórica) |
| 29/30-sep-2026 | Especificación v2.0 | Especificación consolidada (fuera del repositorio) | RF-017 a RF-022, RNF-011 a RNF-015 y módulos 4.4 | Propuesto para homologación. Sustituida por la v2.1 |
| 30-sep-2026 | Especificación **v2.1** | Texto «Especificación consolidada de RF y RNF — ArtesaNic», encabezado verificado: «Versión de trabajo: 2.1 consolidada · Fecha de revisión local: 30 de septiembre de 2026». Entregado por Luis el 4-oct-2026; el archivo `Especificacion_RF_RNF_y_Modulos_ArtesaNic_2026-09-29.md` no estaba en la carpeta de descargas, donde solo existían el PDF y una copia v2.0 | Fichas de esta versión (secciones 1 y 2) y módulos 4.4 | Propuesto para homologación |
| 30-sep y 1-oct-2026 | Definiciones de Luis posteriores a la v2.1 | Instrucciones de Luis registradas en el [plan funcional](../superpowers/plans/2026-09-30-correcciones-funcionales-demo.md) | Sección 3 | Definidas por Luis, **pendientes de homologación del equipo** |

**Cambios de tema con el mismo identificador.** RNF-005 era «Mantenibilidad» (aprobado en la línea base) y en la v2.1 pasa a «Arquitectura e interoperabilidad»; la mantenibilidad queda en RNF-015. RF-009 deja de titularse «Solicitud de pedido personalizado». RF-015 pasa de «Cancelación de pedido tras aceptación» a «Cancelación y cierre parcial de pedidos». La aprobación de las versiones históricas sigue registrada en el Anexo A y no se traslada a las fichas nuevas.

**Correspondencia de identificadores con el DSI** (la cita «DSI RF-017» en RF-012 no significa que RF-017 conserve ese tema):

| DSI | Esta especificación | Tema |
|---|---|---|
| RF-012 | RF-013 | Administración |
| RF-013 | RF-014 | Mensajería |
| RF-014 | RF-015 | Cancelación |
| RF-015 | RF-016 | Entrega |
| RF-016 | RF-017 | Oferta estándar y bajo demanda |
| RF-017 | RF-012 | Pasarela postergada |

**Alcance confirmado por el equipo:** una ficha puede ofrecer unidades estándar, personalización bajo demanda o ambas; cada pedido puede agrupar varios renglones de un único taller. RF-012 conserva el identificador de la pasarela futura, postergada y fuera de los criterios de aceptación de la primera versión.

**Definiciones de Luis incorporadas en la v2.1, pendientes de homologación del equipo:** aceptación integral; cotización visible en Pendiente; un pago externo del 100 % con historial de intentos; pago confirmado antes de producción o Listo; reserva al aceptar sin vencimiento automático; cancelación manual por falta de pago tras 48 horas, respetando la revisión del comprobante; 48 horas para corregir desde la notificación de la observación; cancelación por imposibilidad del artesano; entregas registradas por el artesano y evidencia separada del comprador; cierre parcial por imposibilidad o solicitud aceptada; devolución de lo no entregado y los servicios no prestados; clasificación de unidades reutilizables o de baja; avisos de cierre parcial y discrepancias. Una cancelación del comprador no libera al catálogo cantidades todavía pendientes de clasificación.

**Terminología:** despublicar producto; cancelar solicitud Pendiente; recoger el pedido en el taller. La recogida atrasada después de siete días desde Listo no cancela, no libera reservas ni permite revender lo pagado. La política ante recepción fallida en otras modalidades sigue pendiente. La generación de avisos por plazo se definirá en el ADR-006; la referencia a la Ley N°. 787 y cualquier cargo por tardanza requieren la validación indicada en sus fichas.

---

## 1. Requisitos funcionales

| RF-001 | CARGA SIMPLIFICADA DE PRODUCTOS |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Keyling Rocha |
| Fuentes | Encuestas a artesanos (problemas de adopción tecnológica) |
| Dependencias | Ninguna |
| Descripción | El artesano aprobado podrá crear y editar productos con fotografía principal, nombre y precio, categoría y descripción. La activación de opciones estándar/personalizada solicitará solo los datos adicionales pertinentes; la publicación no deberá exceder cinco pasos de usuario. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Mantiene cuatro grupos obligatorios; la cantidad estándar es un dato condicional. La redacción revisada debe aprobarse como nueva versión. |

| RF-002 | OPTIMIZACIÓN Y ALMACENAMIENTO EFICIENTE DE IMÁGENES |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | Buenas prácticas de arquitectura de software |
| Dependencias | RF-001 |
| Descripción | El sistema recibirá, validará, optimizará y almacenará imágenes de productos fuera de las filas de PostgreSQL; la base guardará sus rutas y metadatos. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Sustituye la mención desactualizada a SQL Server por PostgreSQL para referencias y archivos fuera de la base. |

| RF-003 | CATEGORIZACIÓN POR RUBRO LOCAL |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | Marco Teórico 6.1.1 |
| Dependencias | RF-001, RF-008 |
| Descripción | El comprador consultará un catálogo público paginado y buscará/filtrará por nombre, categoría, precio y taller; podrá ordenar por fecha, precio y nombre. Solo aparecerán talleres aprobados y productos publicados. |
| Importancia | Media |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Integra categorías, búsqueda y visibilidad de productos de talleres aprobados. |

| RF-004 | AUTENTICACIÓN SIMPLIFICADA (ASISTIDA) |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Heidi Piña, Keyling Rocha |
| Fuentes | Encuestas a artesanos |
| Dependencias | Ninguna |
| Descripción | Comprador y artesano podrán registrarse e iniciar sesión con teléfono y contraseña. El servidor asignará roles, estado de cuenta y permisos; el usuario podrá consultar/editar sus propios datos y cerrar sesión. La cuenta de taller requerirá aprobación antes de publicar. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | El servidor asigna roles y verifica pertenencia. Un selector de actor en una demostración con datos simulados no sustituye autenticación ni autorización. La recuperación de contraseña asistida requiere definición específica. |

| RF-005 | EVALUACIÓN DE SOLICITUD (ACEPTAR/RECHAZAR) |
| ----- | ----- |
| Versión | 3.1 |
| Autores | Luis Gutiérrez |
| Fuentes | DSI RF-005 y decisión del equipo sobre oferta estándar y personalización; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-004, RF-009, RF-017, RF-018, RF-022 |
| Descripción | El artesano recibirá la solicitud y aceptará o rechazará **todos los renglones del mismo pedido**. Al aceptar verificará y reservará atómicamente las unidades estándar y congelará el total cotizado, ya visible para el comprador durante Pendiente. El rechazo será terminal y registrará motivo. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Aceptación integral definida por Luis, pendiente de homologación del equipo. El comprador decide pagar el total congelado o cancelar. Las reservas no vencen automáticamente; las unidades no entregadas se resuelven según RF-022. |

| RF-006 | RESUMEN ECONÓMICO DEL PEDIDO |
| ----- | ----- |
| Versión | 2.1 |
| Autores | Luis Gutiérrez |
| Fuentes | Modelo de pedido bajo demanda: necesidad de informar el costo total antes de la aceptación; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-009, RF-018 |
| Descripción | El pedido mostrará por renglón nombre, modalidad, cantidad, precio unitario y subtotal; desglosará los cargos de personalización, entrega y otros servicios justificados, con su importe y objeto. Todo cargo compartido tendrá una distribución por renglón o servicio definida antes de la aceptación, suficiente para calcular devoluciones parciales. El artesano registrará la cotización mientras el pedido esté Pendiente y el comprador podrá verla antes de que el artesano acepte o de cancelar la solicitud. Al aceptar se congelarán los importes y su distribución; el comprador revisará el total en córdobas antes de pagar. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Un total y un pago externo del 100 % por pedido. Registrar un pago expresa conformidad del comprador con el total informado; el valor en dólares es informativo. La suma de renglones y servicios debe coincidir con el total. Las devoluciones conservan este desglose y no reescriben la cotización original. |

| RF-007 | CONVERSIÓN DE DIVISAS |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Keyling Rocha |
| Fuentes | Dinámica económica bimonetaria de Nicaragua |
| Dependencias | RF-013 |
| Descripción | El catálogo podrá mostrar precios en córdobas y dólares usando una tasa configurada por el administrador. El cobro y el total contractual de la primera versión se registrarán en córdobas. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Tasa manual administrada; no exige consulta en tiempo real a un servicio externo. |

| RF-008 | PERFIL DE ARTESANO/TALLER |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Keyling Rocha, Heidi Piña |
| Fuentes | Marco teórico 6.1.6, 6.2.4 |
| Dependencias | RF-004 |
| Descripción | El artesano administrará un perfil público del taller con nombre, historia, rubro, ubicación general, horario y contactos o redes que decida publicar; el comprador podrá consultarlo desde productos y pedidos. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Datos de contacto del taller y credenciales de cuenta tienen distinta visibilidad. |

| RF-009 | SOLICITUD DE PEDIDO |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | DSI RF-009 y decisión del equipo de varios productos de un taller |
| Dependencias | RF-001, RF-004, RF-017 |
| Descripción | El comprador preparará desde la ficha de un producto una solicitud, indicando cantidad y, para la opción personalizada, características y observaciones. Podrá incorporar más renglones según RF-018 antes de enviarla; el pedido se registrará como Pendiente al enviarlo. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | La composición anterior al envío se guarda en el dispositivo y no es todavía un pedido Pendiente del servidor. No se sincroniza entre dispositivos. |

| RF-010 | GESTIONAR EL CICLO DE VIDA DEL PEDIDO |
| ----- | ----- |
| Versión | 3.1 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | DSI RF-010 y esquema de pedido mixto; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-005, RF-011, RF-018 |
| Descripción | El servidor controlará los estados y transiciones definidos en 4.4.3. Un pedido con al menos un renglón personalizado requiere Pago confirmado para pasar de Aceptado a En producción; uno completamente estándar requiere Pago confirmado para pasar directamente de Aceptado a Listo para entrega. Todos los productos deberán estar listos antes de la primera entrega. El artesano registrará cada entrega indicando fecha y cantidades por renglón; el registro descontará existencias y reservas estándar de lo entregado. El comprador podrá confirmar recepción o registrar una discrepancia para cada entrega, incluso después del cierre operativo, como evidencia separada. El pedido pasará a Entregado al completar todas las cantidades o a Cerrado parcialmente cuando proceda según RF-015. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | La confirmación del comprador no condiciona el descuento de unidades ni el cierre operativo. Un registro del artesano no equivale a recepción confirmada por el comprador: ambos hechos se muestran por separado. Una discrepancia no revierte automáticamente entrega, unidades o estado y no implica arbitraje de la plataforma. Listo para entrega admite varias entregas registradas sin cambiar a Entregado hasta completarlas. |

| RF-011 | REGISTRO Y CONFIRMACIÓN DE PAGO |
| ----- | ----- |
| Versión | 4.1 |
| Autores | Luis Gutiérrez, Keyling Rocha |
| Fuentes | Viabilidad de pasarelas de pago en Nicaragua; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-005, RF-006 |
| Descripción | Desde Aceptado, el comprador revisará el total congelado y registrará un pago externo por el 100 % del total con método, referencia y comprobante cuando corresponda; el artesano verificará y confirmará manualmente la recepción. Se conservará el historial de intentos y correcciones. Los estados serán Pendiente de pago, Pago registrado, Pago observado, Pago confirmado y Pago no recibido. Al observar un registro, el artesano indicará motivo y el sistema notificará al comprador un plazo de 48 horas desde esa notificación para corregirlo; el plazo y la notificación quedarán registrados. La corrección devolverá el intento a Pago registrado para nueva revisión. Pago no recibido cierra una revisión cuando se verifica que los fondos no llegaron; no cancela el pedido ni acorta un plazo de corrección vigente. Mientras el pedido siga Aceptado y no tenga Pago confirmado, el comprador podrá registrar otro intento, que pasará a Pago registrado, conservando el anterior. Un pedido Cancelado no admite nuevos intentos ni correcciones, pero permite resolver revisiones anteriores como Pago confirmado o Pago no recibido. Confirmar fondos después de cancelar generará la obligación de reembolso según RF-021. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Un pago económico del total puede tener varios intentos de registro o corrección; no son cuotas ni autorización para cobrar varias veces. Corregir un comprobante no exige repetir una transferencia. La confirmación de fondos no se revierte por una corrección posterior. Producción y Listo requieren Pago confirmado y pedido vivo. La plataforma no arbitra disputas de pago; las partes conservan su evidencia y deben acudir al canal externo correspondiente. |

| RF-012 | PASARELA DE PAGO (EVOLUCIÓN FUTURA) |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Keyling Rocha, Luis Gutiérrez |
| Fuentes | DSI RF-017; análisis de viabilidad de pagos electrónicos |
| Dependencias | RF-011 |
| Descripción | Postergado: la pasarela de pago del documento antiguo es evolución futura y no forma parte de la aceptación de la primera versión. Se conserva el número para evitar reutilizarlo con otro significado. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Postergado (fuera del alcance actual) |
| Estabilidad | Media |
| Comentarios | Identificador histórico reservado. La primera versión registra pagos externos sin procesar tarjetas; el DSI usa para este tema RF-017. |

| RF-013 | PANEL DE ADMINISTRACIÓN (DJANGO ADMIN) |
| ----- | ----- |
| Versión | 3.0 |
| Autores | Heidi Piña, Keyling Rocha |
| Fuentes | DSI RF-012; política de administración y acceso |
| Dependencias | RF-004 |
| Descripción | Mediante Django Admin, personal autorizado aprobará talleres, activará o desactivará cuentas, moderará productos y configurará la tasa. Podrá consultar pedidos, estados, importes e historial autorizado en solo lectura; no editará renglones del pedido ni accederá desde el rol administrativo a chats o comprobantes. |
| Importancia | Media |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Django Admin con autorización por rol y objeto. El rol administrativo no accede al contenido de chats ni comprobantes, sin excepciones en esta especificación. La supervisión no permite modificar pedidos o acuerdos comerciales. |

| RF-014 | MENSAJERÍA ASOCIADA AL PEDIDO |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Heidi Piña, Keyling Rocha |
| Fuentes | DSI RF-013; análisis de completitud del ciclo de vida del pedido |
| Dependencias | RF-005, RF-010 |
| Descripción | Comprador y artesano del pedido intercambiarán mensajes de texto desde Aceptado. En Pendiente no habrá chat; en Rechazado ni en Cancelado desde Pendiente se creará conversación; en Entregado, Cerrado parcialmente y Cancelado con chat existente será de solo lectura. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Conservar chat por pedido y polling incremental, restringido a las partes. |

| RF-015 | CANCELACIÓN Y CIERRE PARCIAL DE PEDIDOS |
| ----- | ----- |
| Versión | 2.1 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | DSI RF-014; política de cancelación y reembolso; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-010, RF-011, RF-022 |
| Descripción | El comprador podrá cancelar una solicitud Pendiente, con motivo y aviso al artesano, sin chat, reserva ni reembolso. Desde Aceptado podrá cancelar antes de pasar a En producción o a Listo para entrega. El artesano podrá cancelar por imposibilidad de cumplir desde Aceptado, En producción o Listo para entrega antes de cualquier entrega, con motivo y reembolso total de los fondos recibidos. Para cancelar por falta de pago deberá esperar al menos 48 horas desde la aceptación, respetar cualquier plazo vigente de 48 horas para corregir un comprobante y resolver las revisiones de fondos pendientes; esta acción será manual desde el detalle del pedido. El comprador no podrá cancelar unilateralmente desde En producción ni desde Listo para entrega. Después de una entrega parcial, si el artesano no puede cumplir lo restante, cerrará parcialmente con motivo; el comprador también podrá solicitar el cierre de las cantidades pendientes y el artesano aceptará o rechazará con motivo. La solicitud por sí sola no cambia el estado ni genera reembolso. Si se acepta o existe imposibilidad de cumplir, el pedido pasará a Cerrado parcialmente, conservando lo entregado y creando la obligación de devolver lo no entregado y los servicios no prestados según RF-021. Las unidades estándar pendientes se resolverán según RF-022. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | La cancelación y el cierre parcial se auditan y no requieren avanzar falsamente de estado. Cancelado y Cerrado parcialmente son estados operativos terminales; una revisión de pago, clasificación de unidades, confirmación de recepción o devolución puede seguir pendiente por separado. Tras siete días desde Listo sin recoger en taller los productos pendientes, el pedido sigue pagado y Listo, con marca de recogida atrasada y aviso; las cantidades permanecen reservadas, sin liberación, reventa ni reembolso automático, y puede acordarse nueva fecha. Esta regla no se extiende a otras modalidades de entrega por analogía. El cargo por tardanza queda fuera del alcance hasta definirlo y validarlo. |

| RF-016 | REGISTRO DE MODALIDAD DE ENTREGA |
| ----- | ----- |
| Versión | 2.1 |
| Autores | Luis Gutiérrez, Keyling Rocha |
| Fuentes | DSI RF-015; delimitación de la coordinación de entrega; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-006, RF-009 |
| Descripción | El comprador indicará una modalidad preferida y el artesano registrará antes de aceptar el plan de una o varias entregas y sus costos: recoger el pedido en el taller, punto de encuentro, entrega por el artesano u otra modalidad con detalle. Los costos por renglón, servicio y cargos compartidos cumplirán RF-006. Después de aceptar podrán coordinar fechas y lugar por chat sin alterar el total congelado; todos los productos deberán estar listos antes de la primera entrega. Las entregas efectivas y su evidencia se registrarán según RF-010. |
| Importancia | Media |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | El plan, la modalidad y los costos propuestos son visibles en Pendiente y el comprador puede cancelar la solicitud. Las fechas acordadas no equivalen a entrega efectuada. No se implementan GPS, logística propia ni seguimiento de transportistas; falta definir la política ante recepción fallida en modalidades distintas de recogida en taller. |

| RF-017 | OFERTA ESTÁNDAR Y PERSONALIZACIÓN BAJO DEMANDA |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | DSI RF-016; decisión del equipo sobre ambas modalidades |
| Dependencias | RF-001, RF-003 |
| Descripción | Una ficha podrá ofrecer unidades estándar, personalización bajo demanda o ambas. El comprador elegirá la opción de cada renglón; si la opción estándar no tiene unidades disponibles no podrá solicitar esa opción, pero sí la personalizada si está habilitada. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Una misma ficha puede ofrecer ambas opciones. Cambia el selector exclusivo de modalidad del DSI; la decisión de alcance está confirmada, la ficha requiere homologación. La disponibilidad visible al solicitar puede variar: la verificación definitiva y la reserva ocurren al aceptar. |

| RF-018 | PEDIDO DE VARIOS PRODUCTOS DE UN MISMO TALLER |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | DSI RF-009; decisión del equipo sobre pedidos por taller; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-009, RF-017 |
| Descripción | Un pedido admitirá varios renglones de un único taller, con opciones estándar, personalizadas o ambas. El sistema impedirá mezclar talleres; el artesano aceptará o rechazará todos los renglones y el comprador efectuará un pago del total, con los intentos de registro permitidos por RF-011. Las entregas podrán ocurrir en fechas distintas y se registrarán por renglón, solo cuando todos los productos estén listos. El cierre parcial por imposibilidad o por solicitud aceptada del comprador se regirá por RF-015 y RF-021. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | La composición por taller está confirmada por el equipo. Aceptación integral, pago del 100 % y varias entregas son criterios de Luis pendientes de homologación. La composición local de la solicitud no introduce un checkout tradicional. Aceptación integral no obliga a entregar todo el mismo día. |

| RF-019 | DESPUBLICACIÓN Y MODERACIÓN DE PRODUCTOS |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | Propuesta §4.4.2 y §7.1; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-001, RF-004 |
| Descripción | El artesano podrá despublicar un producto de la venta y el administrador podrá moderar o despublicar una publicación conforme a sus permisos. Dejará de aparecer para nuevas solicitudes, sin borrar sus renglones, importes ni eventos de pedidos previos. Se conservarán actor y motivo de la despublicación o moderación. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Despublicar conserva las referencias y precios históricos. La distinción de causas y el mecanismo autorizado de restitución deben concretarse en el contrato; no se presume aprobación de la elección técnica D14. |

| RF-020 | NOTIFICACIONES DE EVENTOS DEL PEDIDO |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | Propuesta §4.4.6 y diagrama de aceptación/rechazo; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-005, RF-010, RF-011, RF-015, RF-021 |
| Descripción | El sistema creará notificaciones persistentes para nueva solicitud, cancelación de solicitud Pendiente, aceptación, rechazo, registro o corrección de un intento de pago, observación con motivo y plazo, confirmación de fondos, Pago no recibido, pedido listo, cada entrega registrada, confirmación de recepción o discrepancia del comprador, solicitud de cierre parcial y su respuesta, cancelación, cierre parcial y reembolso pendiente o realizado. Notificará al artesano los pedidos aceptados sin pago después de 48 horas, respetando la información de revisiones y plazos de corrección vigentes; avisará a las partes de la recogida atrasada en taller tras siete días desde Listo. La discrepancia de entrega se notificará al artesano. Cada usuario consultará sus notificaciones y podrá marcarlas como leídas. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Los avisos no cancelan pedidos ni liberan reservas por sí mismos. La generación de avisos por plazo —al consultar o mediante ejecución programada— se decidirá en el ADR-006 y el contrato; no exige aquí Celery o Redis. La emisión debe evitar duplicados del mismo evento. Los avisos por cada mensaje de chat quedan fuera del mínimo. |

| RF-021 | REGISTRO Y SEGUIMIENTO DE REEMBOLSO EXTERNO |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | Propuesta §4.4.4; RF-015 histórico; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-006, RF-011, RF-015 |
| Descripción | El sistema creará una obligación de reembolso Pendiente por el total recibido cuando se cancele un pedido pagado antes de cualquier entrega. También la creará cuando se confirme la recepción de un pago previamente registrado después de cancelar, sin duplicar obligaciones existentes. Si hubo entregas y el artesano no puede completar lo restante o acepta la solicitud de cierre parcial del comprador, calculará la devolución de las cantidades no entregadas y de los servicios no prestados, usando el desglose y la distribución de cargos congelados según RF-006. Conservará el importe y detalle del cálculo. El artesano registrará la devolución externa con fecha, importe y referencia; el sistema marcará el reembolso Realizado y notificará al comprador. No ejecutará transferencias bancarias. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | No se genera una obligación por fondos no recibidos ni se presume ausencia de fondos porque falte confirmación. El cierre operativo puede completarse mientras el reembolso siga Pendiente. El total de devoluciones no debe superar los fondos confirmados y la repetición de una acción no debe crear un segundo reembolso por la misma obligación. La cotización original permanece como evidencia. |

| RF-022 | CONTROL MÍNIMO DE UNIDADES ESTÁNDAR Y RESERVAS |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | DSI RF-016; decisión del equipo sobre unidades estándar; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-017, RF-018 |
| Descripción | El artesano podrá registrar y ajustar con motivo las existencias físicas estándar. El sistema calculará disponibles = físicas − reservadas; al aceptar reservará atómicamente las cantidades estándar y, al registrar una entrega, descontará simultáneamente existencias y reservas de lo entregado. Al cancelar o cerrar parcialmente, el artesano clasificará las cantidades no entregadas entre reutilizables y unidades que deban darse de baja, indicando motivo. Para las reutilizables se disminuirá la reserva sin descontar las existencias físicas; para las bajas se descontarán simultáneamente existencias físicas y reservas, sin ofrecer esas unidades nuevamente. La clasificación cubrirá todas las cantidades pendientes y se aplicará atómicamente. Si cancela el comprador, la cancelación no quedará bloqueada por esta clasificación: las unidades seguirán reservadas y fuera de la disponibilidad del catálogo hasta que el artesano registre su destino. No se permitirán cantidades negativas ni modificación manual directa de reservas. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Control mínimo, sin almacenes, Kardex, compras ni valorización. Las reservas no vencen automáticamente a las 48 horas; la cancelación es manual. Una clasificación pendiente de unidades pertenece al control de reservas y no crea otro estado del pedido. La recogida atrasada mantiene las reservas. Los productos personalizados no generan una reposición automática de unidades estándar. Probar clasificación concurrente con aceptación, entrega o ajuste. |

---

## 2. Requisitos no funcionales

| RNF-001 | USABILIDAD |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | ISO 9241-210 / Heurísticas de Nielsen |
| Dependencias | RF-001, RF-009 |
| Descripción | Acciones principales en lenguaje claro, blancos táctiles de al menos 44 × 44 px y publicación de producto en un máximo de cinco pasos; estados comunicados también con texto. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Añade criterios comprobables de interacción sin cambiar el objetivo de usabilidad. |

| RNF-002 | RESPONSIVIDAD Y COMPATIBILIDAD MÓVIL |
| ----- | ----- |
| Versión | 2.1 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | Estándares web W3C; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RNF-001 |
| Descripción | Las pantallas de comprador y artesano funcionarán desde 360 px de ancho y en móviles de gama media, tableta y escritorio, sin ocultar acciones indispensables. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Verificar al menos 360 × 800, 390 × 844, 768 × 1024, 1366 × 768 y 1920 × 1080 px en los flujos esenciales; sin desbordamiento horizontal ni acciones ocultas. |

| RNF-003 | DESEMPEÑO Y CARGA PROGRESIVA |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | ISO/IEC 25010 |
| Dependencias | RF-002, RF-003 |
| Descripción | El contenido principal del catálogo deberá estar utilizable en ≤3 s bajo un perfil controlado de red móvil 3G/4G y conjunto de referencia de 500 productos; imágenes diferidas y resultados paginados. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | ≤3 s es objetivo de evaluación, no una medición ya superada. |

| RNF-004 | SEGURIDAD DE PAGOS Y DATOS SENSIBLES |
| ----- | ----- |
| Versión | 4.1 |
| Autores | Luis Gutiérrez |
| Fuentes | Política de datos del proyecto; Ley N°. 787, Ley de Protección de Datos Personales (referencia normativa por validar en revisión legal); definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-004, RF-011, RF-014 |
| Descripción | El tráfico se protegerá mediante TLS; las contraseñas usarán hash seguro y la autorización se verificará en servidor por rol, objeto y pertenencia al pedido. Se aplicará protección CSRF cuando corresponda al mecanismo de sesión. Chats, comprobantes e historial de intentos de pago solo serán accesibles a las partes autorizadas; el rol administrativo no accederá al contenido de chats ni comprobantes. No se almacenarán números de tarjeta, CVV ni credenciales bancarias. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | Los permisos y el acceso al comprobante se aplican desde backend. |

| RNF-005 | ARQUITECTURA E INTEROPERABILIDAD |
| ----- | ----- |
| Versión | 2.1 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | Principios de arquitectura de software; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | Ninguna |
| Descripción | El frontend React/TypeScript/Vite y el backend Django/DRF con PostgreSQL se comunicarán mediante API REST/JSON con contratos definidos. La capa de servicios mapeará los nombres snake_case de la API a camelCase cuando la interfaz lo requiera. Las reglas del servidor serán la autoridad para autorización, estados, importes y unidades. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | La mantenibilidad se especifica en RNF-015. El enrutador y la estructura efectiva del frontend deben verificarse en la rama que se integrará; este requisito no impone migrar React Router o TanStack Router ni atribuye una implementación a main sin evidencia. |

| RNF-006 | DISPONIBILIDAD |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | ISO/IEC 25010 |
| Dependencias | RNF-005 |
| Descripción | Durante el periodo formal de evaluación, la plataforma apuntará a ≥95 % de disponibilidad mensual, medida mediante comprobaciones periódicas de salud; definir las exclusiones de mantenimiento antes de medir. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | La meta de 95 % exige definir periodo y medición; no se atribuye al prototipo actual. |

| RNF-007 | ESCALABILIDAD |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | ISO/IEC 25010 |
| Dependencias | RF-003, RF-022 |
| Descripción | Soportará como mínimo 50 talleres activos y 500 productos publicados, con filtros paginados; se probarán además solicitudes simultáneas de las últimas unidades estándar. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | 50 talleres y 500 productos, más concurrencia de última unidad. |

| RNF-008 | TRAZABILIDAD DE PEDIDOS, PAGOS, REEMBOLSOS Y UNIDADES |
| ----- | ----- |
| Versión | 3.1 |
| Autores | Luis Gutiérrez |
| Fuentes | Buenas prácticas de auditoría de sistemas transaccionales; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-005, RF-010, RF-011, RF-015, RF-021, RF-022 |
| Descripción | Cada operación de negocio registrará usuario autenticado, fecha y hora, operación, motivo cuando corresponda, estado anterior y nuevo y cantidades o importes pertinentes. El historial incluirá aceptación, rechazo, cancelación, solicitudes y respuestas de cierre parcial, intentos y correcciones de pago, observaciones con fecha de notificación y plazo de corrección, declaración de fondos no recibidos, conciliación posterior a Cancelado, reembolsos, entregas por renglón y su confirmación o discrepancia, ajustes de unidades, reservas, clasificación de cantidades pendientes, liberaciones, bajas y consumo. El evento se persistirá en la misma transacción que la operación y no admitirá edición ordinaria. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Alta |
| Comentarios | El cierre operativo no borra intentos de pago, cantidades entregadas, solicitudes de cierre o asuntos económicos pendientes. Los avisos automáticos por plazo se basan en estos datos persistidos; su mecanismo de ejecución se define en el ADR-006. La consulta administrativa sigue los límites de RNF-004 y RNF-013. |

| RNF-009 | COMPATIBILIDAD DE NAVEGADORES DE ESCRITORIO |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Keyling Rocha |
| Fuentes | Complemento de RNF-002 (enfoque mobile-first) |
| Dependencias | RNF-002 |
| Descripción | La aplicación se validará en versiones estables recientes de Chrome, Firefox y Edge en escritorio y Chrome móvil para flujos esenciales. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Amplía la matriz de verificación de navegadores. |

| RNF-010 | EFICIENCIA EN CONSUMO DE DATOS MÓVILES (POLLING) |
| ----- | ----- |
| Versión | 2.1 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | Perfil de usuario del protocolo (conectividad limitada, planes de datos reducidos); definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-014 |
| Descripción | El sondeo REST del chat usará un intervalo de aproximadamente 15 s mientras la conversación esté activa y consultará solo mensajes nuevos mediante cursor incremental. El contrato garantizará que ningún mensaje confirmado quede omitido por escrituras concurrentes; una fecha o identificador por sí solo no basta si no existe garantía del orden de confirmación. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | La elección del cursor y su garantía de concurrencia sigue pendiente de diseño y ratificación técnica. Puede emplearse serialización por pedido u otro mecanismo demostrado. La demo usará mensajes reproducibles; no se añaden mensajes comerciales aleatorios. |

| RNF-011 | INTEGRIDAD TRANSACCIONAL Y CONCURRENCIA |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | RF-005, RF-015, RF-018, RF-021 y RF-022; PostgreSQL; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-005, RF-010, RF-011, RF-015, RF-018, RF-021, RF-022 |
| Descripción | La creación de renglones, aceptación y reserva integral, confirmación y conciliación de pagos, cancelación, cierre parcial, registro de entregas y consumo de unidades, clasificación y baja de cantidades no entregadas y generación de reembolsos usarán transacciones ACID y restricciones de PostgreSQL. Las operaciones críticas conservarán invariantes frente a concurrencia y reenvíos: no reservar ni entregar más de lo permitido, no descontar dos veces una entrega, no liberar cantidades pendientes de clasificación, no producir existencias negativas y no duplicar la confirmación ni la obligación de reembolso. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Verificar aceptación de la última unidad, aceptación simultánea con cancelación o clasificación, entrega repetida o concurrente con cierre parcial, baja de unidades dañadas y confirmación de fondos posterior a Cancelado. El reembolso se calcula con el desglose congelado. La evidencia de recepción del comprador no causa un segundo descuento. |

| RNF-012 | RESPALDO Y RECUPERACIÓN |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | Propuesta §§4.3.6, 4.3.11 y 7.1 |
| Dependencias | RNF-005 |
| Descripción | Datos de PostgreSQL y archivos necesarios tendrán respaldo periódico y procedimiento de restauración probado antes de una demostración con datos reales; la periodicidad y retención se fijarán según el entorno elegido. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Definir frecuencia y retención según entorno; comprobar restauración antes de operar con datos reales. |

| RNF-013 | MINIMIZACIÓN Y ACCESO A DATOS PERSONALES |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | Propuesta §7.1; política de datos del proyecto; Ley N°. 787, Ley de Protección de Datos Personales (referencia normativa por validar en revisión legal); definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-004, RF-008, RF-011 |
| Descripción | Se recopilarán únicamente los datos necesarios para registro, comercialización y entrega acordada. La ubicación pública del taller será general; sus contactos públicos se distinguirán del teléfono privado de acceso. Comprobantes, historial de intentos, mensajes y datos internos se protegerán por finalidad, rol y pertenencia; el rol administrativo no accederá al contenido de chats ni comprobantes. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Separar el contacto público del taller del teléfono privado de acceso. |

| RNF-014 | RESILIENCIA ANTE CONECTIVIDAD INESTABLE |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | Diagnóstico de artesanos; RF-009, RF-011 y RF-015; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RF-009, RF-010, RF-011, RF-015, RF-021, RF-022 |
| Descripción | Ante conexión móvil inestable, la interfaz mostrará carga, éxito o error y permitirá reintentar sin duplicar pedidos, intentos de registro de pago, correcciones, cancelaciones, solicitudes y respuestas de cierre parcial, entregas, clasificación de unidades ni reembolsos por reenvío de la misma acción. Al recuperar conexión consultará el resultado persistido antes de repetir una operación de efecto incierto. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Distinguir el reenvío técnico de una acción del nuevo intento de pago decidido por el comprador. La protección contra duplicados se aplica en el servidor; ocultar o deshabilitar un botón no basta. |

| RNF-015 | MANTENIBILIDAD Y PRUEBAS DE REGLAS DE NEGOCIO |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Equipo del proyecto (atribución formal por ratificar) |
| Fuentes | RNF-005 histórico; propuesta §7.1; auditoría de alineación; definiciones de funcionamiento de Luis Gutiérrez y revisión de alineación del 30-sep-2026 |
| Dependencias | RNF-005, RNF-011 |
| Descripción | Las reglas de pedidos, pagos, entregas, reembolsos y reservas se centralizarán en servicios de dominio, con pruebas de transiciones, autorización, plazos, cálculo económico, idempotencia y concurrencia. La interfaz no será autoridad de esas reglas. Requisitos, módulos, contrato y pruebas conservarán correspondencia mediante identificadores RF/RNF y control de versiones. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto para homologación |
| Estabilidad | Media |
| Comentarios | Verificar pago antes de producción, rutas estándar y personalizada, corrección del comprobante durante 48 horas, cancelación por imposibilidad, cierre parcial aceptado, conciliación tras Cancelado y baja de unidades dañadas. Las simulaciones del prototipo serán reproducibles y se distinguirán de servicios reales. |

---

## 3. Definiciones de Luis posteriores a la v2.1

Las siguientes definiciones complementan la v2.1. **Son de Luis Gutiérrez y están pendientes de homologación del equipo**; no son decisiones confirmadas ni modifican el estado «Propuesto para homologación» de ninguna ficha.

| # | Fecha | Definición | Fichas afectadas | Relación con la v2.1 |
|---|---|---|---|---|
| L-1 | 30-sep-2026 | **Pieza única o con existencias.** Las unidades de cada publicación se clasifican como *pieza única* (una sola unidad de ese producto o diseño; cantidad solicitable siempre 1) o *con existencias* (varias unidades; al publicar se indica un entero mayor que cero y se solicita entre 1 y las disponibles). Es una clasificación de unidades, independiente de la personalización. | RF-001, RF-017, RF-022 | Complementa. No aparece en la v2.1 |
| L-2 | 30-sep-2026 | **Personalización opcional sobre unidades disponibles.** La personalización no es obligatoria para pedir una unidad sin modificaciones: solo se muestra y se exige cuando el producto la admite y el comprador elige esa opción. En esta fase **personalizar modifica una unidad existente y consume la misma reserva**: una pieza única admite como máximo 1 aunque se personalice; con existencias, el máximo es la disponibilidad; sin disponibilidad no se puede pedir mediante personalización. | RF-009, RF-017, RF-022 | Complementa. **No sustituye** la personalización bajo demanda de RF-017, que puede pedirse sin unidades disponibles: se conserva como modalidad independiente, pendiente de implementación |
| L-3 | 30-sep-2026 | **Recoger el pedido en el taller cuesta C$ 0.** El artesano cotiza el costo de las demás modalidades antes de aceptar. | RF-006, RF-016 | Complementa |
| L-4 | 1-oct-2026 | **La modalidad la elige el comprador.** El artesano conserva esa elección y cotiza solo costo y notas opcionales. Para recoger en taller, después de aceptar se registra una fecha de recogida y la dirección se toma del perfil del taller. | RF-009, RF-016 | **Difiere** de RF-016 v2.1, donde el artesano «registrará antes de aceptar el plan de una o varias entregas y sus costos». Ver desviación V-9 |
| L-5 | 1-oct-2026 | **Ubicación obligatoria** para punto de encuentro y entrega por el artesano, indicada por el comprador al solicitar y no editable por el artesano. | RF-009, RF-016 | Complementa |
| L-6 | 1-oct-2026 | **El comprador solo cancela desde Aceptado.** En producción y estados posteriores no admiten cancelación del comprador. | RF-015 | Coincide con RF-015 v2.1 («El comprador no podrá cancelar unilateralmente desde En producción ni desde Listo para entrega») |

---

## 4. Máquina de estados

La máquina de estados del pedido, sus transiciones por actor y las transiciones de revisión del pago están en la sección 4.4.3 y 4.4.4 de [Módulos y funcionalidades](modulos-funcionalidades.md#443-módulo-de-solicitudes-y-pedidos). La versión histórica del 15-ago-2026 está en el [Anexo A](#a3-máquina-de-estados-del-pedido-rf-010-histórica).

---

## 5. Estado del prototipo frente a la v2.1

El prototipo `masaya-artisan-connect` simula parte de esta especificación con datos mock en el navegador (estado 3 de la escala de avance: «simulado con datos mock»). **Nada de lo simulado está integrado con API, persistido en PostgreSQL ni validado por un backend.** La persistencia local de la demo (IndexedDB) no es la persistencia del sistema ni una frontera de seguridad.

### 5.1 Qué simula el prototipo

| RF/RNF | Simulado en el prototipo | Falta |
|---|---|---|
| RF-001, RF-002, RF-003 | Publicación con fotografía, nombre, precio, rubro y descripción; tipo de unidades y personalización (L-1, L-2); imágenes JPG/PNG/WebP ≤ 5 MB; catálogo con filtros, orden y paginación | Optimización en servidor y almacenamiento fuera de PostgreSQL; aprobación de talleres; despublicación (RF-019) |
| RF-004 | Pantalla de acceso con validación; selector de vista rotulado como herramienta del prototipo | Autenticación, roles y permisos asignados por el servidor |
| RF-005, RF-006 | Cotización visible en Pendiente; aceptación con nueva comprobación de disponibilidad, reserva y total congelado; rechazo con motivo | Renglones múltiples y distribución de cargos compartidos; cargos de personalización con objeto |
| RF-008 | Perfil del taller con foto y portada reemplazables; encabezado público legible de 360 a 1920 px | Almacenamiento de archivos y propiedad verificados por servidor |
| RF-009, RF-017 | Solicitud desde la ficha de un producto, con cantidad limitada, opción sin modificaciones o con personalización (L-2) y preferencia de entrega | Composición local de varios renglones (RF-018); personalización **bajo demanda** sin unidades disponibles |
| RF-010 | Ruta estándar Aceptado → Listo y personalizada Aceptado → En producción → Listo, ambas con Pago confirmado; la entrega descuenta existencias y reservas | Entregas parciales por renglón, evidencia del comprador y Cerrado parcialmente |
| RF-011 | Intentos de pago con método, referencia, nota e imagen; Pago observado con motivo y plazo de 48 horas; corrección que conserva imágenes anteriores; Pago confirmado y Pago no recibido; nuevo intento tras Pago no recibido | Conciliación de revisiones tras Cancelado y su obligación de reembolso (ver V-3); notificación persistente de la observación |
| RF-014 | Chat por pedido según estado, con sondeo incremental de mensajes reales | Garantía de orden de confirmación (RNF-010) |
| RF-015, RF-022 | Cancelación del comprador desde Aceptado; las unidades quedan pendientes de clasificación y fuera del catálogo; clasificación en reutilizables y bajas con motivo y suma exacta; ajustes de existencias con motivo y sin bajar de lo comprometido | Cancelación de solicitud Pendiente; cancelación por imposibilidad o por falta de pago; cierre parcial |
| RF-016 | Preferencia del comprador, cotización del costo antes de aceptar, C$ 0 al recoger en el taller, fecha de recogida y coordinación sin alterar importes congelados | Plan de varias entregas; ver V-9 |
| RNF-004, RNF-013 | La imagen del comprobante se pide aparte de los metadatos y el mock solo la entrega a las partes simuladas del pedido; no aparece en catálogo, perfiles ni listados | Autorización real por servidor y archivos privados |
| RNF-008 | Historial de eventos de pedido, pago, entrega y unidades; movimientos de unidades con actor, fecha y motivo | Persistencia transaccional e inmutable en servidor |
| RNF-011 | Operaciones del mock serializadas, con reversión si falla el guardado local | Transacciones ACID y restricciones de PostgreSQL |

### 5.2 Desviaciones respecto de la v2.1

| # | Requisito | Comportamiento del prototipo | Tratamiento |
|---|---|---|---|
| V-1 | RF-009, RF-018 | Un producto por solicitud | Brecha; RF-018 conserva su alcance |
| V-2 | RF-015 | El comprador no puede cancelar una solicitud Pendiente; el artesano no puede cancelar por imposibilidad ni por falta de pago | Brecha (incluye la antigua D-4) |
| V-3 | RF-011, RF-021 | Un pedido cancelado con un intento Registrado u Observado no permite resolver esa revisión; no existen reembolsos | Brecha (incluye la antigua D-5). La conciliación tras Cancelado requiere RF-021 |
| V-4 | RF-011 | Vencidas las 48 horas, la demo bloquea la corrección del comprador y deja al artesano resolver como Confirmado o No recibido. La tabla de transiciones de la v2.1 (4.4.4) solo condiciona la corrección a que el pedido siga Aceptado, y la v2.1 indica que Pago no recibido «no acorta un plazo de corrección vigente» | **Pendiente de decisión.** El bloqueo no está en la v2.1; debe confirmarse o retirarse |
| V-5 | RF-010, RF-018 | Sin entregas parciales, evidencia del comprador ni Cerrado parcialmente | Brecha |
| V-6 | RF-017 | Sin personalización bajo demanda que no consuma unidades | Brecha independiente (L-2) |
| V-7 | RF-019, RF-020 | Sin despublicación ni notificaciones persistentes; solo avisos de mensajes nuevos | Brecha |
| V-8 | RF-004 | Sesión simulada con selector de vista | Pendiente del backend (antigua D-6) |
| V-9 | RF-016 | La modalidad la elige el comprador y el artesano solo cotiza (L-4) | Definición de Luis que difiere de la v2.1; requiere homologación o ajuste de la ficha |
| V-10 | RF-002 | Las imágenes se guardan en base64 en el navegador, sin optimizar | Pendiente del backend (antigua D-7) |
| V-11 | RF-007 | Tasa de cambio fija en el código | Pendiente del backend (antigua D-8) |
| V-12 | RF-013 | Sin rol de administración ni Django Admin | Pendiente del backend (antigua D-9) |

Las desviaciones D-1 a D-10 de la línea base se conservan con su estado en el [Anexo A](#a4-desviaciones-de-la-línea-base).

---

## Nota sobre las reglas de negocio

El RF-013 de la línea base hacía referencia a una regla **RN-06** (prohibición de que el administrador lea los mensajes del chat). En la v2.1 esa restricción está escrita directamente en RF-013, RNF-004 y RNF-013. El catálogo de reglas de negocio (RN-xx) sigue sin incorporarse al repositorio.

---

# Anexo A. Línea base del 15 de agosto de 2026 (histórica)

Texto íntegro de las fichas aprobadas y propuestas en la versión del 15-ago-2026, conservado como evidencia de la evolución del proyecto. **No es la redacción vigente.** Las aprobaciones que registra siguen siendo válidas para esas versiones y no se trasladan a las fichas v2.1.

## A.1 Requisitos funcionales (línea base)

| RF-001       | CARGA SIMPLIFICADA DE PRODUCTOS                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                              |
| Autores      | Luis Gutiérrez, Keyling Rocha                                                                                                                                    |
| Fuentes      | Encuestas a artesanos (problemas de adopción tecnológica)                                                                                                        |
| Dependencias | Ninguna                                                                                                                                                          |
| Descripción  | El sistema debe permitir la creación de un nuevo producto requiriendo únicamente cuatro campos obligatorios: Fotografía, Nombre/Precio, Categoría y Descripción. |
| Importancia  | Alta                                                                                                                                                             |
| Urgencia     | Alta                                                                                                                                                             |
| Estado       | Aprobado                                                                                                                                                         |
| Estabilidad  | Alta                                                                                                                                                             |
| Comentarios  | Sin cambios. Reduce la carga cognitiva para un usuario con baja alfabetización digital.                                                                          |

| RF-002       | OPTIMIZACIÓN Y ALMACENAMIENTO EFICIENTE DE IMÁGENES                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                                                    |
| Autores      | Luis Gutiérrez, Heidi Piña                                                                                                                                                             |
| Fuentes      | Buenas prácticas de arquitectura de software                                                                                                                                           |
| Dependencias | RF-001                                                                                                                                                                                 |
| Descripción  | El sistema debe comprimir las imágenes subidas y almacenar únicamente la ruta de acceso (URL) en la base de datos, guardando el archivo físico en el sistema de archivos del servidor. |
| Importancia  | Alta                                                                                                                                                                                   |
| Urgencia     | Alta                                                                                                                                                                                   |
| Estado       | Aprobado                                                                                                                                                                               |
| Estabilidad  | Alta                                                                                                                                                                                   |
| Comentarios  | Con DRF, se implementa con `ImageField` + `ModelSerializer`.                                                                                                                           |

| RF-003       | CATEGORIZACIÓN POR RUBRO LOCAL                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versión      | 1.0                                                                                                                                              |
| Autores      | Luis Gutiérrez, Heidi Piña                                                                                                                       |
| Fuentes      | Marco Teórico 6.1.1                                                                                                                              |
| Dependencias | RF-001                                                                                                                                           |
| Descripción  | El sistema debe clasificar los productos según los rubros artesanales de Masaya (Cuero/Calzado, Hamacas, Madera, Textiles, Dulces, entre otros). |
| Importancia  | Media                                                                                                                                            |
| Urgencia     | Media                                                                                                                                            |
| Estado       | Aprobado                                                                                                                                         |
| Estabilidad  | Alta                                                                                                                                             |
| Comentarios  | Coherente con la taxonomía real del municipio.                                                                                                   |

| RF-004       | AUTENTICACIÓN SIMPLIFICADA (ASISTIDA)                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.1                                                                                                                                                      |
| Autores      | Heidi Piña, Keyling Rocha                                                                                                                                |
| Fuentes      | Encuestas a artesanos                                                                                                                                    |
| Dependencias | Ninguna                                                                                                                                                  |
| Descripción  | Registro e inicio de sesión mediante teléfono + contraseña (MVP). OAuth2 (Google) y verificación SMS/WhatsApp quedan como capa adicional, no bloqueante. |
| Importancia  | Alta                                                                                                                                                     |
| Urgencia     | Media                                                                                                                                                    |
| Estado       | Propuesto                                                                                                                                                |
| Estabilidad  | Media                                                                                                                                                    |
| Comentarios  | MVP con `djangorestframework-simplejwt`; mejora futura con `dj-rest-auth` + `django-allauth`.                                                            |

| RF-005       | EVALUACIÓN DE SOLICITUD (ACEPTAR/RECHAZAR)                                                                                                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 2.0                                                                                                                                                                                                                                                                               |
| Autores      | Luis Gutiérrez                                                                                                                                                                                                                                                                    |
| Fuentes      | Modalidad de trabajo tradicional de los artesanos de Masaya                                                                                                                                                                                                                       |
| Dependencias | RF-001, RF-004, RF-009, RF-010                                                                                                                                                                                                                                                    |
| Descripción  | El sistema debe notificar al artesano sobre nuevas solicitudes (RF-009), permitiéndole seleccionar "Aceptar" o "Rechazar" según su capacidad de producción. El rechazo es un estado terminal (Rechazado), distinto de la cancelación posterior de un pedido ya aceptado (RF-015). |
| Importancia  | Crítica                                                                                                                                                                                                                                                                           |
| Urgencia     | Alta                                                                                                                                                                                                                                                                              |
| Estado       | Aprobado                                                                                                                                                                                                                                                                          |
| Estabilidad  | Alta                                                                                                                                                                                                                                                                              |
| Comentarios  | Es el RF que define la naturaleza del sistema: no es e-commerce de stock, es gestión de pedidos bajo demanda.                                                                                                                                                                     |

| RF-006       | RESUMEN ECONÓMICO DEL PEDIDO                                                                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                                                                             |
| Autores      | Luis Gutiérrez                                                                                                                                                                                                  |
| Fuentes      | —                                                                                                                                                                                                               |
| Dependencias | RF-005, RF-010                                                                                                                                                                                                  |
| Descripción  | El sistema debe mostrar el desglose del pedido: precio del producto, costos adicionales y costo de entrega si aplica, hasta un total estimado. No se asume todavía un modelo de comisión real de la plataforma. |
| Importancia  | Alta                                                                                                                                                                                                            |
| Urgencia     | Media                                                                                                                                                                                                           |
| Estado       | Propuesto                                                                                                                                                                                                       |
| Estabilidad  | Alta                                                                                                                                                                                                            |
| Comentarios  | Correcto no comprometerse a un modelo de comisión que el protocolo no define — evita la pregunta de tribunal "¿cuál es su modelo de negocio?".                                                                  |

| RF-007       | CONVERSIÓN DE DIVISAS                                                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.1                                                                                                                                                                                                                                                                        |
| Autores      | Keyling Rocha                                                                                                                                                                                                                                                              |
| Fuentes      | Dinámica económica bimonetaria de Nicaragua                                                                                                                                                                                                                                |
| Dependencias | Ninguna                                                                                                                                                                                                                                                                    |
| Descripción  | El sistema debe mostrar precios en Córdobas y Dólares, usando una tasa configurada manualmente por el administrador. Una fuente externa (ej. BCN) puede usarse como referencia, pero el sistema no debe depender de su disponibilidad en tiempo real para mostrar precios. |
| Importancia  | Media                                                                                                                                                                                                                                                                      |
| Urgencia     | Baja                                                                                                                                                                                                                                                                       |
| Estado       | Propuesto                                                                                                                                                                                                                                                                  |
| Estabilidad  | Media                                                                                                                                                                                                                                                                      |
| Comentarios  | Se quita la dependencia obligatoria de un API externo — si falla el día de la defensa, el sistema sigue funcionando con la tasa configurada manualmente.                                                                                                                   |

| RF-008       | PERFIL DE ARTESANO/TALLER                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                                    |
| Autores      | Propuesto en auditoría                                                                                                                                                 |
| Fuentes      | Marco teórico 6.1.6, 6.2.4                                                                                                                                             |
| Dependencias | RF-004                                                                                                                                                                 |
| Descripción  | Cada artesano debe poder configurar un perfil público: nombre del taller, descripción/historia, rubro, ubicación general, horario, teléfono/WhatsApp y redes sociales. |
| Importancia  | Alta                                                                                                                                                                   |
| Urgencia     | Media                                                                                                                                                                  |
| Estado       | Propuesto                                                                                                                                                              |
| Estabilidad  | Alta                                                                                                                                                                   |
| Comentarios  | Da correlato funcional a la narrativa cultural que el propio marco teórico usa como factor de fidelización.                                                            |

| RF-009       | SOLICITUD DE PEDIDO PERSONALIZADO                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                                                 |
| Autores      | Propuesto en auditoría                                                                                                                                                              |
| Fuentes      | Modelo de negocio de fabricación bajo demanda                                                                                                                                       |
| Dependencias | RF-001, RF-004                                                                                                                                                                      |
| Descripción  | El comprador debe poder, desde la ficha del producto, solicitar un pedido indicando cantidad y observaciones/personalización. Genera el registro que evaluará el artesano (RF-005). |
| Importancia  | Crítica                                                                                                                                                                             |
| Urgencia     | Alta                                                                                                                                                                                |
| Estado       | Propuesto                                                                                                                                                                           |
| Estabilidad  | Alta                                                                                                                                                                                |
| Comentarios  | Es el eslabón que conecta al comprador con RF-005; sin este RF, RF-005 no tiene entrada.                                                                                            |

| RF-010       | GESTIONAR EL CICLO DE VIDA DEL PEDIDO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 2.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Autores      | Propuesto en auditoría                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Fuentes      | Modelo de negocio de fabricación bajo demanda                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Dependencias | RF-005, RF-009, RF-011, RF-015                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Descripción  | El sistema debe representar el ciclo de vida del pedido mediante una máquina de estados: Pendiente → Aceptado → En producción → Listo para entrega → Entregado. Desde Pendiente, la alternativa es Rechazado (RF-005, terminal). Desde Aceptado o En producción, el pedido puede pasar a Cancelado (RF-015, terminal), siempre que no haya llegado a Listo para entrega. La transición de Aceptado a En producción requiere que el pago correspondiente haya sido registrado y confirmado, de acuerdo con RF-011. El sistema no permitirá iniciar la producción mientras el pago permanezca pendiente de confirmación. |
| Importancia  | Crítica                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Urgencia     | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Estado       | Propuesto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Estabilidad  | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Comentarios  | Se mantiene una máquina de estados independiente de la representación interna del pago, pero se establece una **precondición de negocio para iniciar la producción**: el pago debe estar confirmado. No se contempla el pago contra entrega ni el inicio de fabricación sin confirmación del pago.                                                                                                                                                                                                                                                                                                                     |

| RF-011       | REGISTRAR Y CONFIRMAR EL PAGO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 3.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Autores      | Propuesto en auditoría                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Fuentes      | Viabilidad de pasarelas de pago en Nicaragua                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Dependencias | RF-010                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Descripción  | El sistema debe permitir dos acciones separadas: **(1)** el comprador registra el pago de un pedido en estado Aceptado, indicando el método de pago y adjuntando el comprobante cuando corresponda; **(2)** el artesano verifica y confirma la recepción del pago, actualizando el campo `estado_pago` (Pendiente de pago / Pago registrado / Pago confirmado). **El pago deberá ser confirmado antes de que el pedido pueda pasar de Aceptado a En producción.** El sistema no debe almacenar datos de tarjetas ni ofrecer la modalidad de pago contra entrega. |
| Importancia  | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Urgencia     | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Estado       | Propuesto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Estabilidad  | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Comentarios  | El flujo de pago se simplifica a un único pago previo al inicio de la producción. No se implementará el esquema de pago 50/50. El comprador registra el pago después de la aceptación y el artesano lo verifica antes de iniciar la fabricación. Los comprobantes se gestionan conforme a RNF-004.                                                                                                                                                                                                                                                               |

> **RF-012 no existe.** La numeración salta deliberadamente de RF-011 a RF-013.

| RF-013       | PANEL DE ADMINISTRACIÓN (DJANGO ADMIN)                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 2.0                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Autores      | Propuesto en auditoría                                                                                                                                                                                                                                                                                                                                                                                                |
| Fuentes      | Necesidad de un rol administrador no definido en el protocolo                                                                                                                                                                                                                                                                                                                                                         |
| Dependencias | RF-001, RF-004                                                                                                                                                                                                                                                                                                                                                                                                        |
| Descripción  | El panel administrativo, vía Django Admin, debe permitir: aprobar registro de nuevos artesanos, moderar/dar de baja productos que incumplan lineamientos, consultar en solo lectura el listado general de pedidos y su estado, y activar/desactivar cuentas de usuario. NO debe permitir modificar el contenido de un pedido específico (precio, personalización) ni leer los mensajes del chat de un pedido (RN-06). |
| Importancia  | Media                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Urgencia     | Media                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Estado       | Propuesto                                                                                                                                                                                                                                                                                                                                                                                                             |
| Estabilidad  | Alta                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Comentarios  | Costo de desarrollo casi nulo (Django Admin es nativo). Se acota explícitamente el alcance para no convertirlo en un panel que decide sobre transacciones ajenas. Moderación de disputas vía chat queda como mejora futura.                                                                                                                                                                                           |

| RF-014       | MENSAJERÍA ASOCIADA AL PEDIDO                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Autores      | Propuesto en auditoría, a partir del riesgo de fuga a WhatsApp identificado por el equipo                                                                                                                                                                                                                                                                                                                                                                       |
| Fuentes      | Riesgo de desintermediación tras el primer pedido                                                                                                                                                                                                                                                                                                                                                                                                               |
| Dependencias | RF-005, RF-010                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Descripción  | El sistema debe permitir mensajes de texto entre comprador y artesano, asociados exclusivamente a un pedido. El chat se habilita automáticamente al pasar a Aceptado (no antes) y queda en solo lectura al llegar a Entregado o Cancelado. Si la solicitud es Rechazada, no se crea chat. No se permite iniciar un nuevo pedido desde la misma conversación. Se implementa mediante sondeo periódico (polling) sobre la API REST/DRF existente, sin WebSockets. |
| Importancia  | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Urgencia     | Media                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Estado       | Propuesto                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Estabilidad  | Media                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Comentarios  | Polling elegido sobre WebSockets porque reutiliza la arquitectura ya definida (RNF-005) sin un segundo runtime (ASGI/Channels/Redis), y porque la conectividad móvil inestable de los artesanos tolera mejor solicitudes cortas periódicas que una conexión persistente. Ver RNF-010 para el intervalo recomendado.                                                                                                                                             |

| RF-015       | CANCELACIÓN DE PEDIDO TRAS ACEPTACIÓN                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versión      | 1.0                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Autores      | Propuesto en auditoría                                                                                                                                                                                                                                                                                                                                                                                                               |
| Fuentes      | Gap detectado: no existía forma de cancelar un pedido ya aceptado                                                                                                                                                                                                                                                                                                                                                                    |
| Dependencias | RF-005, RF-010, RF-014                                                                                                                                                                                                                                                                                                                                                                                                               |
| Descripción  | El sistema deberá permitir al comprador o al artesano cancelar un pedido en estado Aceptado o En producción, siempre que este no haya alcanzado el estado Listo para entrega. Al realizar la cancelación, el sistema deberá notificar a la otra parte y establecer el pedido como Cancelado. Cuando el pedido haya tenido un pago confirmado, el sistema deberá registrar la necesidad de realizar un reembolso por el monto pagado. |
| Importancia  | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Urgencia     | Alta                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Estado       | Propuesto                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Estabilidad  | Media                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Comentarios  | El reembolso se registra como consecuencia de la cancelación de un pedido previamente pagado. No se contemplan pagos parciales ni reembolsos parciales. La plataforma no ejecutará directamente la transferencia bancaria; registrará el estado del reembolso.                                                                                                                                                                       |

| RF-016       | REGISTRO DE MODALIDAD DE ENTREGA                                                                                                                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versión      | 1.0                                                                                                                                                                                                                                                                                                                                        |
| Autores      | Propuesto en auditoría                                                                                                                                                                                                                                                                                                                     |
| Fuentes      | Gap detectado entre "coordinar entrega" (capacidad del actor) y la decisión de no ser plataforma logística                                                                                                                                                                                                                                 |
| Dependencias | RF-010, RF-014                                                                                                                                                                                                                                                                                                                             |
| Descripción  | El sistema debe permitir registrar la modalidad de entrega de un pedido Aceptado: retiro en taller, punto de encuentro, entrega directa por el artesano, u otra (texto libre). Sin cálculo de rutas, tracking en tiempo real ni integración con operadores logísticos — la coordinación específica (fecha, hora, lugar) ocurre vía RF-014. |
| Importancia  | Media                                                                                                                                                                                                                                                                                                                                      |
| Urgencia     | Media                                                                                                                                                                                                                                                                                                                                      |
| Estado       | Propuesto                                                                                                                                                                                                                                                                                                                                  |
| Estabilidad  | Media                                                                                                                                                                                                                                                                                                                                      |
| Comentarios  | Resuelve la contradicción entre "coordinar la entrega" (listado como capacidad del actor) y "no somos plataforma logística": esta es la versión acotada y no-logística de esa capacidad.                                                                                                                                                   |

---

## A.2 Requisitos no funcionales (línea base)

| RNF-001      | USABILIDAD                                                                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                                                           |
| Autores      | Luis Gutiérrez, Heidi Piña, Keyling Rocha                                                                                                                                                     |
| Fuentes      | ISO 9241-210 / Heurísticas de Nielsen                                                                                                                                                         |
| Dependencias | Ninguna                                                                                                                                                                                       |
| Descripción  | La interfaz debe incorporar zonas táctiles amplias (zona de pulgar), ubicación accesible de acciones, contrastes altos y fuentes ajustables, para artesanos con poca experiencia tecnológica. |
| Importancia  | Alta                                                                                                                                                                                          |
| Urgencia     | Alta                                                                                                                                                                                          |
| Estado       | Aprobado                                                                                                                                                                                      |
| Estabilidad  | Alta                                                                                                                                                                                          |
| Comentarios  | Uno de los RNF mejor fundamentados — conecta directo con el perfil de usuario del protocolo.                                                                                                  |

| RNF-002      | RESPONSIVIDAD Y COMPATIBILIDAD MÓVIL                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                                                                        |
| Autores      | Luis Gutiérrez, Heidi Piña, Keyling Rocha                                                                                                                  |
| Fuentes      | Estándares web W3C                                                                                                                                         |
| Dependencias | RNF-001                                                                                                                                                    |
| Descripción  | El sistema debe ser completamente responsive y renderizarse correctamente en navegadores móviles de dispositivos de gama media-baja, desde 360px de ancho. |
| Importancia  | Crítica                                                                                                                                                    |
| Urgencia     | Alta                                                                                                                                                       |
| Estado       | Aprobado                                                                                                                                                   |
| Estabilidad  | Alta                                                                                                                                                       |
| Comentarios  | 360px como umbral verificable en pruebas.                                                                                                                  |

| RNF-003      | DESEMPEÑO Y CARGA PROGRESIVA                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.1                                                                                                                           |
| Autores      | Luis Gutiérrez, Heidi Piña, Keyling Rocha                                                                                     |
| Fuentes      | ISO/IEC 25010                                                                                                                 |
| Dependencias | RF-002                                                                                                                        |
| Descripción  | Carga asíncrona (lazy loading): texto y estructura antes que imágenes, con carga del catálogo ≤3 segundos en red móvil 3G/4G. |
| Importancia  | Alta                                                                                                                          |
| Urgencia     | Media                                                                                                                         |
| Estado       | Aprobado                                                                                                                      |
| Estabilidad  | Alta                                                                                                                          |
| Comentarios  | Verificable con Lighthouse, perfil de red 3G simulada.                                                                        |

| RNF-004      | SEGURIDAD DE PAGOS Y DATOS SENSIBLES                                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión      | 3.0                                                                                                                                                                                                                    |
| Autores      | Luis Gutiérrez                                                                                                                                                                                                         |
| Fuentes      | Ley 787 de Nicaragua / PCI-DSS                                                                                                                                                                                         |
| Dependencias | RF-011                                                                                                                                                                                                                 |
| Descripción  | El sistema no debe almacenar datos bancarios ni de tarjetas. Los comprobantes de pago (RF-011) deben guardarse en almacenamiento con control de acceso, sin exposición pública ni URLs descargables sin autenticación. |
| Importancia  | Crítica                                                                                                                                                                                                                |
| Urgencia     | Alta                                                                                                                                                                                                                   |
| Estado       | Propuesto                                                                                                                                                                                                              |
| Estabilidad  | Alta                                                                                                                                                                                                                   |
| Comentarios  | Se simplificó de "cifrado" a "control de acceso": suficiente para el nivel de riesgo real de un comprobante de transferencia, sin sumar complejidad de manejo de claves de cifrado.                                    |

| RNF-005      | MANTENIBILIDAD                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Versión      | 1.0                                                                                                                                  |
| Autores      | Luis Gutiérrez, Heidi Piña, Keyling Rocha                                                                                            |
| Fuentes      | Principios de arquitectura de software                                                                                               |
| Dependencias | Ninguna                                                                                                                              |
| Descripción  | Django y React deben estar desacoplados, comunicándose exclusivamente vía API REST/JSON.                                             |
| Importancia  | Alta                                                                                                                                 |
| Urgencia     | Media                                                                                                                                |
| Estado       | Aprobado                                                                                                                             |
| Estabilidad  | Alta                                                                                                                                 |
| Comentarios  | Con DRF, se cumple de forma nativa vía serializers. El chat (RF-014) reutiliza este mismo patrón — no se introduce un segundo stack. |

| RNF-006      | DISPONIBILIDAD                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                             |
| Autores      | Propuesto en auditoría                                                                                          |
| Fuentes      | ISO/IEC 25010                                                                                                   |
| Dependencias | Ninguna                                                                                                         |
| Descripción  | El sistema debe mantener al menos 95% de disponibilidad mensual durante el periodo de evaluación del prototipo. |
| Importancia  | Media                                                                                                           |
| Urgencia     | Baja                                                                                                            |
| Estado       | Propuesto                                                                                                       |
| Estabilidad  | Media                                                                                                           |
| Comentarios  | 95% es razonable para un prototipo académico, no exige infraestructura de producción real.                      |

| RNF-007      | ESCALABILIDAD                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| Versión      | 1.0                                                                                                            |
| Autores      | Propuesto en auditoría                                                                                         |
| Fuentes      | ISO/IEC 25010                                                                                                  |
| Dependencias | Ninguna                                                                                                        |
| Descripción  | El sistema debe soportar al menos 50 artesanos activos y 500 productos publicados sin degradación perceptible. |
| Importancia  | Media                                                                                                          |
| Urgencia     | Baja                                                                                                           |
| Estado       | Propuesto                                                                                                      |
| Estabilidad  | Media                                                                                                          |
| Comentarios  | Número concreto y defendible para el alcance de tesis.                                                         |

| RNF-008      | TRAZABILIDAD (PEDIDOS, PAGOS Y MENSAJERÍA)                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versión      | 2.0                                                                                                                                                                                                          |
| Autores      | Propuesto en auditoría                                                                                                                                                                                       |
| Fuentes      | Buenas prácticas de auditoría de sistemas transaccionales                                                                                                                                                    |
| Dependencias | RF-010, RF-011, RF-014                                                                                                                                                                                       |
| Descripción  | El sistema debe registrar el historial de cambios de estado del pedido, cambios de `estado_pago`, y mantener el historial de mensajería de cada pedido (estado anterior, estado nuevo, usuario, fecha/hora). |
| Importancia  | Alta                                                                                                                                                                                                         |
| Urgencia     | Media                                                                                                                                                                                                        |
| Estado       | Propuesto                                                                                                                                                                                                    |
| Estabilidad  | Alta                                                                                                                                                                                                         |
| Comentarios  | Se amplió el alcance para cubrir pago y mensajería, no solo estado del pedido — necesario para resolver disputas artesano-comprador.                                                                         |

| RNF-009      | COMPATIBILIDAD DE NAVEGADORES DE ESCRITORIO                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| Versión      | 1.0                                                                                                                |
| Autores      | Propuesto en auditoría                                                                                             |
| Fuentes      | Complemento de RNF-002 (enfoque mobile-first)                                                                      |
| Dependencias | Ninguna                                                                                                            |
| Descripción  | El sistema debe funcionar correctamente en las últimas versiones estables de Chrome, Firefox y Edge en escritorio. |
| Importancia  | Media                                                                                                              |
| Urgencia     | Baja                                                                                                               |
| Estado       | Propuesto                                                                                                          |
| Estabilidad  | Media                                                                                                              |
| Comentarios  | RNF-002 cubre móviles; este cubre el caso de escritorio, que también puede ser usado por artesanos o compradores.  |

| RNF-010      | EFICIENCIA EN CONSUMO DE DATOS MÓVILES (POLLING)                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versión      | 1.0                                                                                                                                                                            |
| Autores      | Propuesto en auditoría                                                                                                                                                         |
| Fuentes      | Perfil de usuario del protocolo (conectividad limitada, planes de datos reducidos)                                                                                             |
| Dependencias | RF-014                                                                                                                                                                         |
| Descripción  | El mecanismo de polling del chat (RF-014) debe usar un intervalo no menor a 10-15 segundos y solicitar únicamente mensajes nuevos, no la conversación completa en cada sondeo. |
| Importancia  | Alta                                                                                                                                                                           |
| Urgencia     | Media                                                                                                                                                                          |
| Estado       | Propuesto                                                                                                                                                                      |
| Estabilidad  | Media                                                                                                                                                                          |
| Comentarios  | Este RNF es lo que convierte "elegimos polling" en una decisión medible y defendible, no solo una preferencia de implementación.                                               |

---

## A.3 Máquina de estados del pedido (RF-010, histórica)

```
                    ┌──────────────┐
                    │  Pendiente   │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
       (artesano acepta)         (artesano rechaza)
              │                         │
              ▼                         ▼
       ┌──────────────┐          ┌─────────────┐
       │   Aceptado   │          │  Rechazado  │ ← terminal, sin chat
       └──────┬───────┘          └─────────────┘
              │
              │ ⚠ PRECONDICIÓN: estado_pago = Pago confirmado
              │
              ▼
       ┌──────────────────┐
       │  En producción   │
       └──────┬───────────┘
              │
              ▼
       ┌────────────────────────┐
       │  Listo para entrega    │
       └──────┬─────────────────┘
              │
              ▼
       ┌──────────────┐
       │  Entregado   │ ← terminal, chat en solo lectura
       └──────────────┘

Cancelación (RF-015): desde Aceptado o En producción → Cancelado (terminal).
Si el pedido tenía pago confirmado, se registra la necesidad de reembolso.
```

**Flujo de pago (RF-011), único y previo a la producción:**

```
Pendiente de pago ──(comprador registra)──> Pago registrado
                  ──(artesano confirma)──> Pago confirmado
```

No existe pago contra entrega. No existe pago dividido 50/50. No existen pagos ni reembolsos parciales.

---

## A.4 Desviaciones de la línea base

Diferencias detectadas el 15-ago-2026 entre la línea base y el código. Estado al 4-oct-2026: D-1, D-2 y D-3 están corregidas en el prototipo; D-4 y D-5 continúan como V-2 y V-3; D-6 a D-9 como V-8, V-10, V-11 y V-12; D-10 se corrigió en la demo y queda pendiente en el backend (ver la sección 5.2).

| #    | Requisito | Comportamiento actual del prototipo                                                                                              | Corrección pendiente                                                                                                        |
| ---- | --------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| D-1  | RF-011    | `src/routes/pedidos.$id.tsx` solo permite registrar el pago cuando el pedido está en "Listo para entrega"                        | Permitirlo desde "Aceptado"                                                                                                 |
| D-2  | RF-010    | `changeOrderStatus()` en `src/services/mock-api.ts` no valida el estado del pago al avanzar                                      | Bloquear "Aceptado" → "En producción" mientras el pago no esté confirmado                                                   |
| D-3  | RF-011    | `PaymentMethod` en `src/types/index.ts` incluye "Pago contra entrega"                                                            | Eliminar esa modalidad                                                                                                      |
| D-4  | RF-015    | La interfaz del artesano (`src/routes/panel.pedidos.$id.tsx`) oculta la opción de cancelar                                       | Habilitar la cancelación para ambos roles                                                                                   |
| D-5  | RF-015    | No existe ningún concepto de reembolso                                                                                           | Modelar el registro del reembolso tras cancelar un pedido pagado                                                            |
| D-6  | RF-004    | La sesión es un usuario fijo en `src/hooks/use-session.tsx` con la constante `DEMO_ARTISAN_ID`; el rol se elige en el formulario | Autenticación real; el rol proviene de la cuenta                                                                            |
| D-7  | RF-002    | `processImage()` convierte a base64 en el cliente sin comprimir                                                                  | Compresión en el servidor con Pillow; almacenar ruta en PostgreSQL                                                          |
| D-8  | RF-007    | La tasa de cambio es la constante `TASA_CAMBIO` en `src/lib/format.ts`                                                           | Configurable por el administrador                                                                                           |
| D-9  | RF-013    | No existe rol de administrador ni panel                                                                                          | Django Admin, con el alcance acotado del RF-013                                                                             |
| D-10 | RNF-004   | Corregida en la demo del 30-sep: imagen e historial en IndexedDB, consultados solo por las partes simuladas                      | Pendiente en backend: archivos privados y autorización autenticada; el almacenamiento local no es una frontera de seguridad |

---

## A.5 Notas de revisión del prototipo (30-sep y 1-oct-2026)

Notas registradas antes de disponer de la v2.1. Se conservan como historial; su contenido vigente está en las secciones 3 y 5.

**Revisión de entrega del 1-oct-2026 (RF-009/RF-016), indicada por Luis:** la modalidad la elige el comprador y el artesano conserva esa elección al cotizar solo costo y notas opcionales. Para recoger en taller, el costo sigue en C$ 0; después de aceptar se guarda una fecha mediante selector de calendario, separada de las notas. La dirección mostrada al comprador se consulta del perfil del artesano. Esta revisión sustituye las menciones anteriores a que el artesano decide la modalidad o escribe fecha y lugar juntos para recogida; se conservan las aprobaciones históricas. Pruebas a cargo de Luis.

**Revisión operativa del 1-oct-2026 (RF-015), indicada por Luis:** el comprador solo cancela un pedido en Aceptado. En producción y estados posteriores no admiten cancelación. Esta revisión sustituye esa condición en la simulación; las menciones a cancelar desde En producción en la línea base inferior quedan como historial de la redacción anterior, sin cambiar sus aprobaciones formales. El servicio rechaza el intento y la vista del comprador oculta la acción y explica el bloqueo. Las cancelaciones válidas desde Aceptado siguen dejando las unidades pendientes de clasificación. No se alteran pedidos históricos guardados ni se implementan excepciones por el artesano. Pruebas a cargo de Luis.

**Fecha de esta versión:** 15 de agosto de 2026

**Revisión del prototipo — 30-sep-2026:** se conservan las fichas históricas y sus estados de aprobación. Las correcciones autorizadas por Luis se describen en [Módulos y funcionalidades](modulos-funcionalidades.md) y en el [plan funcional](../superpowers/plans/2026-09-30-correcciones-funcionales-demo.md). Implementarlas en el mock no homologa requisitos ni implementa Django. La especificación v2.1 sigue sin localizarse: el archivo disponible en Downloads declara v2.0, modificado a las 00:07 del 30-sep. No se sustituyen fichas por una supuesta transcripción de v2.1.

| RF/RNF afectado                    | Corrección simulada                                                                                                                                                        | Estado y brecha                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| RF-001, RF-002, RF-003, RF-017     | Publicación con pieza única/existencias y personalización opcional; catálogo con disponibilidad; imágenes JPG/PNG/WebP ≤ 5 MB                                              | Definiciones de Luis pendientes de homologación. Fabricación bajo demanda independiente, sin implementar |
| RF-004                             | Acceso visible y selector identificado como demo                                                                                                                           | Sin autenticación real                                                                                   |
| RF-005, RF-006, RF-009, RF-022     | Cantidades enteras limitadas, verificación al aceptar, reserva y total congelado                                                                                           | Transacciones reales y contrato pendientes                                                               |
| RF-008                             | Foto y portada reemplazables, persistencia local y encabezado público corregido                                                                                            | Almacenamiento y permisos de servidor pendientes                                                         |
| RF-010                             | Estándar: Aceptado → Listo; personalizado: Aceptado → En producción → Listo; ambas rutas exigen pago confirmado                                                            | Revisión autorizada por Luis, pendiente de homologación                                                  |
| RF-011                             | Intentos, imágenes y correcciones conservados; Confirmado, Observado y No recibido; plazo de 48 horas                                                                      | Detalle normativo de v2.1 pendiente de cotejo                                                            |
| RF-015, RF-022                     | Cancelación existente traslada reserva a clasificación; devuelve disponibles o descuenta bajas con motivo; entrega consume físicas y reservas                              | No amplía actores ni estados de cancelación; reembolsos pendientes                                       |
| RF-016                             | Preferencia del comprador, cotización previa por artesano, recogida C$ 0, coordinación posterior sin alterar importes                                                      | Recogida gratuita es definición nueva de Luis, pendiente de homologación                                 |
| RF-018                             | Un producto por pedido en esta fase                                                                                                                                        | Varios renglones de un taller sigue como brecha, sin reducir el alcance del RF                           |
| RNF-004, RNF-008, RNF-011, RNF-013 | Imagen separada de metadatos y consultada solo por las partes simuladas; movimientos y resoluciones auditados; operaciones serializadas con reversión si falla el guardado | Autorización real, archivos privados y concurrencia de servidor pendientes                               |

**Persistencia de demo:** IndexedDB conserva productos, imágenes del taller, pedidos, reservas, pagos, comprobantes, movimientos y mensajes. «Restablecer» borra la instantánea y vuelve al escenario inicial completo. No comparte datos entre dispositivos ni sincroniza pestañas; la serialización protege una instancia del mock.

**Plazo del pago observado:** corrección hasta observación + 48 horas; agrega una imagen y vuelve el intento a Registrado. Vencido el plazo, la demo bloquea correcciones y deja al artesano resolver como Confirmado o No recibido. No cambia el estado automáticamente. Esta mecánica requiere cotejo con v2.1 y no se presenta como redacción normativa confirmada.
