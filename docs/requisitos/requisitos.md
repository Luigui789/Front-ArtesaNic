# Requisitos funcionales y no funcionales

**Proyecto:** Sistema e-commerce para la comercialización de productos artesanales de las PYMEs del municipio de Masaya
**Asignatura:** Diseño de sistemas en internet — UNI, Recinto Universitario Simón Bolívar
**Grupo:** 5T1-SIS-S
**Autores:** Br. Luis Fernando José Gutiérrez Dávila · Br. Heidi Leana Piña Martínez · Br. Keyling de los Ángeles Rocha Pérez
**Fecha de esta versión:** 15 de agosto de 2026

> **Este documento gobierna al prototipo.** Cuando el código contradiga un requisito, se corrige el código. Las desviaciones detectadas están listadas al final, en la sección [Desviaciones conocidas del prototipo](#desviaciones-conocidas-del-prototipo).

---

## 1. Requisitos funcionales

| RF-001 | CARGA SIMPLIFICADA DE PRODUCTOS |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Keyling Rocha |
| Fuentes | Encuestas a artesanos (problemas de adopción tecnológica) |
| Dependencias | Ninguna |
| Descripción | El sistema debe permitir la creación de un nuevo producto requiriendo únicamente cuatro campos obligatorios: Fotografía, Nombre/Precio, Categoría y Descripción. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Sin cambios. Reduce la carga cognitiva para un usuario con baja alfabetización digital. |

| RF-002 | OPTIMIZACIÓN Y ALMACENAMIENTO EFICIENTE DE IMÁGENES |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | Buenas prácticas de arquitectura de software |
| Dependencias | RF-001 |
| Descripción | El sistema debe comprimir las imágenes subidas y almacenar únicamente la ruta de acceso (URL) en SQL Server, guardando el archivo físico en el sistema de archivos del servidor. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Con DRF, se implementa con `ImageField` + `ModelSerializer`. |

| RF-003 | CATEGORIZACIÓN POR RUBRO LOCAL |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Heidi Piña |
| Fuentes | Marco Teórico 6.1.1 |
| Dependencias | RF-001 |
| Descripción | El sistema debe clasificar los productos según los rubros artesanales de Masaya (Cuero/Calzado, Hamacas, Madera, Textiles, Dulces, entre otros). |
| Importancia | Media |
| Urgencia | Media |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Coherente con la taxonomía real del municipio. |

| RF-004 | AUTENTICACIÓN SIMPLIFICADA (ASISTIDA) |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Heidi Piña, Keyling Rocha |
| Fuentes | Encuestas a artesanos |
| Dependencias | Ninguna |
| Descripción | Registro e inicio de sesión mediante teléfono + contraseña (MVP). OAuth2 (Google) y verificación SMS/WhatsApp quedan como capa adicional, no bloqueante. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | MVP con `djangorestframework-simplejwt`; mejora futura con `dj-rest-auth` + `django-allauth`. |

| RF-005 | EVALUACIÓN DE SOLICITUD (ACEPTAR/RECHAZAR) |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Luis Gutiérrez |
| Fuentes | Modalidad de trabajo tradicional de los artesanos de Masaya |
| Dependencias | RF-001, RF-004, RF-009, RF-010 |
| Descripción | El sistema debe notificar al artesano sobre nuevas solicitudes (RF-009), permitiéndole seleccionar "Aceptar" o "Rechazar" según su capacidad de producción. El rechazo es un estado terminal (Rechazado), distinto de la cancelación posterior de un pedido ya aceptado (RF-015). |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Es el RF que define la naturaleza del sistema: no es e-commerce de stock, es gestión de pedidos bajo demanda. |

| RF-006 | RESUMEN ECONÓMICO DEL PEDIDO |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez |
| Fuentes | — |
| Dependencias | RF-005, RF-010 |
| Descripción | El sistema debe mostrar el desglose del pedido: precio del producto, costos adicionales y costo de entrega si aplica, hasta un total estimado. No se asume todavía un modelo de comisión real de la plataforma. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Correcto no comprometerse a un modelo de comisión que el protocolo no define — evita la pregunta de tribunal "¿cuál es su modelo de negocio?". |

| RF-007 | CONVERSIÓN DE DIVISAS |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Keyling Rocha |
| Fuentes | Dinámica económica bimonetaria de Nicaragua |
| Dependencias | Ninguna |
| Descripción | El sistema debe mostrar precios en Córdobas y Dólares, usando una tasa configurada manualmente por el administrador. Una fuente externa (ej. BCN) puede usarse como referencia, pero el sistema no debe depender de su disponibilidad en tiempo real para mostrar precios. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | Se quita la dependencia obligatoria de un API externo — si falla el día de la defensa, el sistema sigue funcionando con la tasa configurada manualmente. |

| RF-008 | PERFIL DE ARTESANO/TALLER |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Marco teórico 6.1.6, 6.2.4 |
| Dependencias | RF-004 |
| Descripción | Cada artesano debe poder configurar un perfil público: nombre del taller, descripción/historia, rubro, ubicación general, horario, teléfono/WhatsApp y redes sociales. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Da correlato funcional a la narrativa cultural que el propio marco teórico usa como factor de fidelización. |

| RF-009 | SOLICITUD DE PEDIDO PERSONALIZADO |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Modelo de negocio de fabricación bajo demanda |
| Dependencias | RF-001, RF-004 |
| Descripción | El comprador debe poder, desde la ficha del producto, solicitar un pedido indicando cantidad y observaciones/personalización. Genera el registro que evaluará el artesano (RF-005). |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Es el eslabón que conecta al comprador con RF-005; sin este RF, RF-005 no tiene entrada. |

| RF-010 | GESTIONAR EL CICLO DE VIDA DEL PEDIDO |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Modelo de negocio de fabricación bajo demanda |
| Dependencias | RF-005, RF-009, RF-011, RF-015 |
| Descripción | El sistema debe representar el ciclo de vida del pedido mediante una máquina de estados: Pendiente → Aceptado → En producción → Listo para entrega → Entregado. Desde Pendiente, la alternativa es Rechazado (RF-005, terminal). Desde Aceptado o En producción, el pedido puede pasar a Cancelado (RF-015, terminal), siempre que no haya llegado a Listo para entrega. La transición de Aceptado a En producción requiere que el pago correspondiente haya sido registrado y confirmado, de acuerdo con RF-011. El sistema no permitirá iniciar la producción mientras el pago permanezca pendiente de confirmación. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Se mantiene una máquina de estados independiente de la representación interna del pago, pero se establece una **precondición de negocio para iniciar la producción**: el pago debe estar confirmado. No se contempla el pago contra entrega ni el inicio de fabricación sin confirmación del pago. |

| RF-011 | REGISTRAR Y CONFIRMAR EL PAGO |
| ----- | ----- |
| Versión | 3.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Viabilidad de pasarelas de pago en Nicaragua |
| Dependencias | RF-010 |
| Descripción | El sistema debe permitir dos acciones separadas: **(1)** el comprador registra el pago de un pedido en estado Aceptado, indicando el método de pago y adjuntando el comprobante cuando corresponda; **(2)** el artesano verifica y confirma la recepción del pago, actualizando el campo `estado_pago` (Pendiente de pago / Pago registrado / Pago confirmado). **El pago deberá ser confirmado antes de que el pedido pueda pasar de Aceptado a En producción.** El sistema no debe almacenar datos de tarjetas ni ofrecer la modalidad de pago contra entrega. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | El flujo de pago se simplifica a un único pago previo al inicio de la producción. No se implementará el esquema de pago 50/50. El comprador registra el pago después de la aceptación y el artesano lo verifica antes de iniciar la fabricación. Los comprobantes se gestionan conforme a RNF-004. |

> **RF-012 no existe.** La numeración salta deliberadamente de RF-011 a RF-013.

| RF-013 | PANEL DE ADMINISTRACIÓN (DJANGO ADMIN) |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Necesidad de un rol administrador no definido en el protocolo |
| Dependencias | RF-001, RF-004 |
| Descripción | El panel administrativo, vía Django Admin, debe permitir: aprobar registro de nuevos artesanos, moderar/dar de baja productos que incumplan lineamientos, consultar en solo lectura el listado general de pedidos y su estado, y activar/desactivar cuentas de usuario. NO debe permitir modificar el contenido de un pedido específico (precio, personalización) ni leer los mensajes del chat de un pedido (RN-06). |
| Importancia | Media |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Costo de desarrollo casi nulo (Django Admin es nativo). Se acota explícitamente el alcance para no convertirlo en un panel que decide sobre transacciones ajenas. Moderación de disputas vía chat queda como mejora futura. |

| RF-014 | MENSAJERÍA ASOCIADA AL PEDIDO |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría, a partir del riesgo de fuga a WhatsApp identificado por el equipo |
| Fuentes | Riesgo de desintermediación tras el primer pedido |
| Dependencias | RF-005, RF-010 |
| Descripción | El sistema debe permitir mensajes de texto entre comprador y artesano, asociados exclusivamente a un pedido. El chat se habilita automáticamente al pasar a Aceptado (no antes) y queda en solo lectura al llegar a Entregado o Cancelado. Si la solicitud es Rechazada, no se crea chat. No se permite iniciar un nuevo pedido desde la misma conversación. Se implementa mediante sondeo periódico (polling) sobre la API REST/DRF existente, sin WebSockets. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | Polling elegido sobre WebSockets porque reutiliza la arquitectura ya definida (RNF-005) sin un segundo runtime (ASGI/Channels/Redis), y porque la conectividad móvil inestable de los artesanos tolera mejor solicitudes cortas periódicas que una conexión persistente. Ver RNF-010 para el intervalo recomendado. |

| RF-015 | CANCELACIÓN DE PEDIDO TRAS ACEPTACIÓN |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Gap detectado: no existía forma de cancelar un pedido ya aceptado |
| Dependencias | RF-005, RF-010, RF-014 |
| Descripción | El sistema deberá permitir al comprador o al artesano cancelar un pedido en estado Aceptado o En producción, siempre que este no haya alcanzado el estado Listo para entrega. Al realizar la cancelación, el sistema deberá notificar a la otra parte y establecer el pedido como Cancelado. Cuando el pedido haya tenido un pago confirmado, el sistema deberá registrar la necesidad de realizar un reembolso por el monto pagado. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | El reembolso se registra como consecuencia de la cancelación de un pedido previamente pagado. No se contemplan pagos parciales ni reembolsos parciales. La plataforma no ejecutará directamente la transferencia bancaria; registrará el estado del reembolso. |

| RF-016 | REGISTRO DE MODALIDAD DE ENTREGA |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Gap detectado entre "coordinar entrega" (capacidad del actor) y la decisión de no ser plataforma logística |
| Dependencias | RF-010, RF-014 |
| Descripción | El sistema debe permitir registrar la modalidad de entrega de un pedido Aceptado: retiro en taller, punto de encuentro, entrega directa por el artesano, u otra (texto libre). Sin cálculo de rutas, tracking en tiempo real ni integración con operadores logísticos — la coordinación específica (fecha, hora, lugar) ocurre vía RF-014. |
| Importancia | Media |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | Resuelve la contradicción entre "coordinar la entrega" (listado como capacidad del actor) y "no somos plataforma logística": esta es la versión acotada y no-logística de esa capacidad. |

---

## 2. Requisitos no funcionales

| RNF-001 | USABILIDAD |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | ISO 9241-210 / Heurísticas de Nielsen |
| Dependencias | Ninguna |
| Descripción | La interfaz debe incorporar zonas táctiles amplias (zona de pulgar), ubicación accesible de acciones, contrastes altos y fuentes ajustables, para artesanos con poca experiencia tecnológica. |
| Importancia | Alta |
| Urgencia | Alta |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Uno de los RNF mejor fundamentados — conecta directo con el perfil de usuario del protocolo. |

| RNF-002 | RESPONSIVIDAD Y COMPATIBILIDAD MÓVIL |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | Estándares web W3C |
| Dependencias | RNF-001 |
| Descripción | El sistema debe ser completamente responsive y renderizarse correctamente en navegadores móviles de dispositivos de gama media-baja, desde 360px de ancho. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | 360px como umbral verificable en pruebas. |

| RNF-003 | DESEMPEÑO Y CARGA PROGRESIVA |
| ----- | ----- |
| Versión | 1.1 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | ISO/IEC 25010 |
| Dependencias | RF-002 |
| Descripción | Carga asíncrona (lazy loading): texto y estructura antes que imágenes, con carga del catálogo ≤3 segundos en red móvil 3G/4G. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Verificable con Lighthouse, perfil de red 3G simulada. |

| RNF-004 | SEGURIDAD DE PAGOS Y DATOS SENSIBLES |
| ----- | ----- |
| Versión | 3.0 |
| Autores | Luis Gutiérrez |
| Fuentes | Ley 787 de Nicaragua / PCI-DSS |
| Dependencias | RF-011 |
| Descripción | El sistema no debe almacenar datos bancarios ni de tarjetas. Los comprobantes de pago (RF-011) deben guardarse en almacenamiento con control de acceso, sin exposición pública ni URLs descargables sin autenticación. |
| Importancia | Crítica |
| Urgencia | Alta |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Se simplificó de "cifrado" a "control de acceso": suficiente para el nivel de riesgo real de un comprobante de transferencia, sin sumar complejidad de manejo de claves de cifrado. |

| RNF-005 | MANTENIBILIDAD |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Luis Gutiérrez, Heidi Piña, Keyling Rocha |
| Fuentes | Principios de arquitectura de software |
| Dependencias | Ninguna |
| Descripción | Django y React deben estar desacoplados, comunicándose exclusivamente vía API REST/JSON. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Aprobado |
| Estabilidad | Alta |
| Comentarios | Con DRF, se cumple de forma nativa vía serializers. El chat (RF-014) reutiliza este mismo patrón — no se introduce un segundo stack. |

| RNF-006 | DISPONIBILIDAD |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | ISO/IEC 25010 |
| Dependencias | Ninguna |
| Descripción | El sistema debe mantener al menos 95% de disponibilidad mensual durante el periodo de evaluación del prototipo. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | 95% es razonable para un prototipo académico, no exige infraestructura de producción real. |

| RNF-007 | ESCALABILIDAD |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | ISO/IEC 25010 |
| Dependencias | Ninguna |
| Descripción | El sistema debe soportar al menos 50 artesanos activos y 500 productos publicados sin degradación perceptible. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | Número concreto y defendible para el alcance de tesis. |

| RNF-008 | TRAZABILIDAD (PEDIDOS, PAGOS Y MENSAJERÍA) |
| ----- | ----- |
| Versión | 2.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Buenas prácticas de auditoría de sistemas transaccionales |
| Dependencias | RF-010, RF-011, RF-014 |
| Descripción | El sistema debe registrar el historial de cambios de estado del pedido, cambios de `estado_pago`, y mantener el historial de mensajería de cada pedido (estado anterior, estado nuevo, usuario, fecha/hora). |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Alta |
| Comentarios | Se amplió el alcance para cubrir pago y mensajería, no solo estado del pedido — necesario para resolver disputas artesano-comprador. |

| RNF-009 | COMPATIBILIDAD DE NAVEGADORES DE ESCRITORIO |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Complemento de RNF-002 (enfoque mobile-first) |
| Dependencias | Ninguna |
| Descripción | El sistema debe funcionar correctamente en las últimas versiones estables de Chrome, Firefox y Edge en escritorio. |
| Importancia | Media |
| Urgencia | Baja |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | RNF-002 cubre móviles; este cubre el caso de escritorio, que también puede ser usado por artesanos o compradores. |

| RNF-010 | EFICIENCIA EN CONSUMO DE DATOS MÓVILES (POLLING) |
| ----- | ----- |
| Versión | 1.0 |
| Autores | Propuesto en auditoría |
| Fuentes | Perfil de usuario del protocolo (conectividad limitada, planes de datos reducidos) |
| Dependencias | RF-014 |
| Descripción | El mecanismo de polling del chat (RF-014) debe usar un intervalo no menor a 10-15 segundos y solicitar únicamente mensajes nuevos, no la conversación completa en cada sondeo. |
| Importancia | Alta |
| Urgencia | Media |
| Estado | Propuesto |
| Estabilidad | Media |
| Comentarios | Este RNF es lo que convierte "elegimos polling" en una decisión medible y defendible, no solo una preferencia de implementación. |

---

## 3. Máquina de estados del pedido (RF-010)

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

## Desviaciones conocidas del prototipo

Diferencias entre estos requisitos y el código actual de `masaya-artisan-connect`, detectadas durante el análisis. **Deben corregirse en el código**, no en los requisitos.

| # | Requisito | Comportamiento actual del prototipo | Corrección pendiente |
|---|---|---|---|
| D-1 | RF-011 | `src/routes/pedidos.$id.tsx` solo permite registrar el pago cuando el pedido está en "Listo para entrega" | Permitirlo desde "Aceptado" |
| D-2 | RF-010 | `changeOrderStatus()` en `src/services/mock-api.ts` no valida el estado del pago al avanzar | Bloquear "Aceptado" → "En producción" mientras el pago no esté confirmado |
| D-3 | RF-011 | `PaymentMethod` en `src/types/index.ts` incluye "Pago contra entrega" | Eliminar esa modalidad |
| D-4 | RF-015 | La interfaz del artesano (`src/routes/panel.pedidos.$id.tsx`) oculta la opción de cancelar | Habilitar la cancelación para ambos roles |
| D-5 | RF-015 | No existe ningún concepto de reembolso | Modelar el registro del reembolso tras cancelar un pedido pagado |
| D-6 | RF-004 | La sesión es un usuario fijo en `src/hooks/use-session.tsx` con la constante `DEMO_ARTISAN_ID`; el rol se elige en el formulario | Autenticación real; el rol proviene de la cuenta |
| D-7 | RF-002 | `processImage()` convierte a base64 en el cliente sin comprimir | Compresión en el servidor con Pillow; almacenar ruta en SQL Server |
| D-8 | RF-007 | La tasa de cambio es la constante `TASA_CAMBIO` en `src/lib/format.ts` | Configurable por el administrador |
| D-9 | RF-013 | No existe rol de administrador ni panel | Django Admin, con el alcance acotado del RF-013 |
| D-10 | RNF-004 | Solo se guarda `comprobanteNombre` (el nombre del archivo), no el archivo | Almacenar el comprobante con control de acceso |

---

## Nota sobre las reglas de negocio

El RF-013 hace referencia a una regla **RN-06** (prohibición de que el administrador lea los mensajes del chat). El catálogo de reglas de negocio (RN-xx) no forma parte de este documento y aún no está incorporado al repositorio. Conviene añadirlo para que la trazabilidad quede completa.
