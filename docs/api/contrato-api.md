# Contrato de API — Artesanica

**Estado:** Borrador para revisión. Define el contrato que expondrá el backend Django REST Framework y que consumirá el frontend React.

**Fecha:** 2026-08-15

**Decisiones que lo gobiernan:** [ADR-002 — Acceso a datos y contratos](../adr/0002-acceso-a-datos-y-contratos.md)

Este documento es la **fuente de verdad compartida** entre el frontend (este repositorio) y el backend (repositorio separado). Ninguno de los dos debe asumir nada que no esté aquí.

---

## 1. Convenciones generales

### 1.1 Base y versionado

```
https://<host>/api/v1/
```

Todas las rutas usan **plural, en español y con barra final**, siguiendo la convención de Django (`APPEND_SLASH`). El prefijo de versión permite introducir cambios incompatibles más adelante sin romper clientes existentes.

### 1.2 Identificadores

Todos los recursos se identifican con un **entero** generado por el backend.

```json
{ "id": 15 }
```

> **Regla arquitectónica:** el identificador es un valor **opaco** de tipo `number` para el frontend. Su mecanismo de generación (`AutoField`, `BigAutoField` u otro) pertenece exclusivamente al backend. El frontend nunca construye, deduce ni interpreta identificadores.

### 1.3 Nomenclatura

- **La API responde en `snake_case`** (idiomático en Python/Django).
- **El frontend trabaja en `camelCase`.**
- La conversión ocurre **exclusivamente en la capa de mapeo del cliente HTTP**. Ningún componente de React conoce los nombres de campo de la API.

Ver la tabla completa en la [sección 9](#9-tabla-de-mapeo-de-campos).

### 1.4 Códigos frente a etiquetas

Los estados, categorías y modalidades viajan como **códigos estables** en `snake_case`. Nunca viaja el texto visible.

```json
{ "estado": "en_produccion" }
```

El texto que ve la persona usuaria ("En producción") vive **solo en la capa de presentación del frontend**. Esto permite corregir la redacción de una etiqueta sin migrar datos en SQL Server ni romper el contrato.

Ver el catálogo completo en la [sección 2](#2-catálogos-de-códigos).

### 1.5 Fechas

Formato **ISO 8601 con zona horaria**, tal como las serializa DRF por defecto:

```json
{ "creado_en": "2026-08-15T10:30:00-06:00" }
```

El frontend las conserva como `string` y las formatea con las utilidades de `src/lib/format.ts`.

### 1.6 Importes

Los importes son **números**, en córdobas (NIO), sin separadores de miles ni símbolo de moneda:

```json
{ "precio": 4890 }
```

> **Atención — configuración requerida en el backend:** DRF serializa `DecimalField` como **cadena de texto** por defecto (`"4890.00"`), para no perder precisión. El frontend espera un número. El backend debe establecer `COERCE_DECIMAL_TO_STRING = False` en `REST_FRAMEWORK`, o bien declarar los importes con un tipo entero. Independientemente de ello, **la capa de mapeo del frontend convertirá defensivamente a `number`**, para que una configuración distinta en el backend no rompa la interfaz.

La conversión a dólares es una funcionalidad de presentación del frontend (`TASA_CAMBIO` en `src/lib/format.ts`). Si más adelante la tasa debe ser configurable por el administrador (RF-007), se añadirá un endpoint específico.

### 1.7 Autenticación

El **mecanismo** de autenticación (JWT frente a sesión) es una decisión pendiente y se registrará en un ADR aparte. Este contrato define únicamente **qué endpoints la requieren y qué datos deriva el backend de la identidad autenticada**.

Regla general, sin excepciones:

> **El cliente nunca envía su propia identidad, su rol ni el identificador de su taller.** El backend los deriva siempre de la petición autenticada (`request.user`). Un cuerpo o parámetro que contenga `rol`, `usuario`, `comprador_id` o `artesano_id` propio debe ser **ignorado o rechazado** por el backend.

En cada endpoint se indica:

| Marca | Significado |
|---|---|
| 🔓 | Público, no requiere autenticación |
| 🔒 | Requiere autenticación |
| 🔒👤 | Requiere autenticación con rol **comprador** |
| 🔒🔨 | Requiere autenticación con rol **artesano** |

### 1.8 Paginación

Las colecciones paginadas usan `PageNumberPagination` de DRF:

**Petición**

```
GET /api/v1/productos/?page=2&page_size=12
```

**Respuesta**

```json
{
  "count": 500,
  "next": "https://host/api/v1/productos/?page=3&page_size=12",
  "previous": "https://host/api/v1/productos/?page=1&page_size=12",
  "results": [ ... ]
}
```

El frontend consume el tipo `Paginated<T>` ya existente. **La capa de mapeo reconstruye los campos que DRF no envía**, a partir de los parámetros de la petición:

| Campo del frontend | Origen |
|---|---|
| `items` | `results` |
| `total` | `count` |
| `page` | parámetro `page` de la petición (1 si se omitió) |
| `pageSize` | parámetro `page_size` de la petición (o el valor por defecto del backend) |
| `totalPages` | `Math.ceil(count / pageSize)` |

> El `page_size` por defecto del backend debe ser **12**, que es el valor que usa hoy el catálogo. Si el backend usa otro, el mapeo de `totalPages` será incorrecto salvo que el frontend envíe `page_size` explícitamente; **se recomienda que el frontend lo envíe siempre**.

Las colecciones pequeñas y acotadas (categorías, mensajes de un pedido, pedidos de una persona) **no se paginan**: devuelven un array JSON directo.

### 1.9 Errores

Se usan los códigos de estado y formatos estándar de DRF:

| Código | Cuándo | Cuerpo |
|---|---|---|
| `400` | Validación fallida | `{"campo": ["mensaje"], ...}` o `{"detail": "..."}` |
| `401` | Sin autenticar | `{"detail": "..."}` |
| `403` | Autenticado pero sin permiso | `{"detail": "..."}` |
| `404` | Recurso inexistente o ajeno | `{"detail": "No encontrado."}` |
| `409` | Transición de estado inválida | `{"detail": "...", "codigo": "transicion_invalida"}` |
| `500` | Error del servidor | `{"detail": "..."}` |

**Reglas del contrato de errores:**

- Un recurso que existe pero **no pertenece** a quien lo solicita devuelve **`404`, no `403`**, para no revelar su existencia.
- Los errores de transición de estado usan **`409 Conflict`** con un campo `codigo` legible por máquina, porque el frontend necesita distinguirlos de un error de validación corriente.
- La capa de mapeo del frontend traduce cualquiera de estas respuestas a un objeto de error uniforme con un mensaje presentable. **Los componentes nunca inspeccionan códigos de estado HTTP.**

---

## 2. Catálogos de códigos

Los códigos son la representación en API y base de datos. Las etiquetas son responsabilidad exclusiva del frontend y se incluyen aquí solo como referencia de la redacción vigente.

### 2.1 Estado del pedido (`estado`)

| Código | Etiqueta actual |
|---|---|
| `pendiente` | Pendiente |
| `aceptado` | Aceptado |
| `en_produccion` | En producción |
| `listo_para_entrega` | Listo para entrega |
| `entregado` | Entregado |
| `rechazado` | Rechazado |
| `cancelado` | Cancelado |

### 2.2 Estado del pago (`estado_pago`)

| Código | Etiqueta actual |
|---|---|
| `pendiente` | Pendiente de pago |
| `registrado` | Pago registrado |
| `confirmado` | Pago confirmado |

> El código `pendiente` aparece tanto en el estado del pedido como en el del pago. No hay ambigüedad porque viajan en campos distintos (`estado` y `estado_pago`) y en el frontend son tipos TypeScript diferentes, pero conviene tenerlo presente al escribir consultas y filtros en el backend.

### 2.3 Categorías (`categoria`)

Las categorías son un **recurso propio** del backend, no una lista fija en el código del frontend, para que un administrador pueda añadir rubros sin desplegar el frontend (ver [sección 4](#4-categorías)).

| Código | Etiqueta actual |
|---|---|
| `cuero_y_calzado` | Cuero y calzado |
| `hamacas` | Hamacas |
| `madera` | Madera |
| `textiles` | Textiles |
| `dulces` | Dulces |
| `otros` | Otros |

### 2.4 Modalidad de entrega (`modalidad`)

| Código | Etiqueta actual |
|---|---|
| `retiro_en_taller` | Retiro en taller |
| `punto_de_encuentro` | Punto de encuentro |
| `entrega_directa` | Entrega directa por el artesano |
| `otra` | Otra |

### 2.5 Método de pago (`metodo`)

| Código | Etiqueta actual |
|---|---|
| `transferencia` | Transferencia |
| `contra_entrega` | Pago contra entrega |
| `otro` | Otro método |

### 2.6 Rol (`rol`)

| Código | Etiqueta actual |
|---|---|
| `comprador` | Comprador |
| `artesano` | Artesano |

---

## 3. Autenticación y sesión

> El mecanismo concreto se decidirá en un ADR aparte. Las rutas siguientes fijan la **forma** del contrato; los detalles de tokens quedan pendientes.

### `POST /auth/registro/` 🔓

Registra una persona usuaria. RF-004.

**Petición**

```json
{
  "nombre": "Ana Lucía Delgado",
  "telefono": "85551234",
  "password": "…",
  "rol": "comprador"
}
```

El teléfono es el identificador de acceso (8 dígitos, formato nicaragüense). Cuando `rol` es `artesano`, el backend crea también el taller asociado en estado pendiente de aprobación (RF-013).

**Respuesta `201`** — datos de sesión (forma exacta pendiente del ADR de autenticación) más el perfil.

**Errores** — `400` si el teléfono ya está registrado o el formato es inválido.

### `POST /auth/login/` 🔓

**Petición**

```json
{ "telefono": "85551234", "password": "…" }
```

`rol` **no** se envía: el backend lo conoce por la cuenta. Esto corrige el comportamiento actual del prototipo, donde el rol se elige en el formulario.

**Respuesta `200`** — credenciales de sesión más el perfil.

**Errores** — `401` con mensaje genérico, sin revelar si el teléfono existe.

### `GET /auth/perfil/` 🔒

Devuelve la identidad autenticada. **Sustituye a la constante `DEMO_ARTISAN_ID` y al usuario codificado en `src/hooks/use-session.tsx`.**

**Respuesta `200`**

```json
{
  "id": 4,
  "nombre": "Ana Lucía Delgado",
  "telefono": "85551234",
  "rol": "artesano",
  "artesano_id": 1
}
```

`artesano_id` es `null` cuando el rol es `comprador`. **Este campo es la única fuente legítima del identificador del taller en el frontend.**

---

## 4. Categorías

### `GET /categorias/` 🔓

Colección completa, sin paginar.

**Respuesta `200`**

```json
[
  { "id": 1, "codigo": "cuero_y_calzado", "nombre": "Cuero y calzado" },
  { "id": 2, "codigo": "hamacas", "nombre": "Hamacas" }
]
```

En los recursos que la referencian, la categoría se **anida en lectura** y se **envía por código en escritura**:

```jsonc
// lectura
"categoria": { "id": 1, "codigo": "cuero_y_calzado", "nombre": "Cuero y calzado" }

// escritura
"categoria": "cuero_y_calzado"
```

> **Consecuencia para el frontend:** el tipo `Category` deja de ser una unión literal de textos y pasa a ser un objeto (o un código). Los filtros del catálogo y el selector del formulario de productos deben poblarse desde este endpoint en lugar de la constante `CATEGORIES`.

---

## 5. Productos y catálogo

### `GET /productos/` 🔓

Catálogo público, paginado. RF-003.

**Parámetros de consulta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `q` | string | Búsqueda por nombre |
| `categoria` | string | Código de categoría |
| `precio_min` | number | Precio mínimo |
| `precio_max` | number | Precio máximo |
| `artesano` | number | Identificador del taller |
| `orden` | string | `recientes` (por defecto), `precio_asc`, `precio_desc`, `nombre` |
| `page` | number | Página, desde 1 |
| `page_size` | number | Tamaño de página, por defecto 12 |

**Respuesta `200`** — envoltorio de paginación (sección 1.8) cuyos `results` son objetos producto:

```json
{
  "id": 15,
  "nombre": "Sandalias de cuero natural",
  "precio": 4890,
  "categoria": { "id": 1, "codigo": "cuero_y_calzado", "nombre": "Cuero y calzado" },
  "descripcion": "…",
  "imagenes": ["https://host/media/productos/15/principal.jpg"],
  "artesano_id": 1,
  "disponible": true,
  "creado_en": "2026-08-15T10:30:00-06:00"
}
```

> `imagenes` contiene **URL absolutas servidas por el backend**, no cadenas base64. Esto sustituye el comportamiento actual, donde `processImage()` devuelve un DataURL incrustado en el objeto.

### `GET /productos/{id}/` 🔓

**Respuesta `200`** — un producto. **`404`** si no existe.

### `GET /productos/destacados/` 🔓

Selección para la portada. Array sin paginar (8 elementos).

### `GET /productos/mios/` 🔒🔨

Productos del taller autenticado. Array sin paginar. El taller se deriva del token; **no se acepta ningún parámetro de artesano**.

### `POST /productos/` 🔒🔨

Crea un producto en el taller autenticado. RF-001.

**Petición** — `multipart/form-data`, porque incluye la imagen:

| Campo | Tipo |
|---|---|
| `nombre` | texto |
| `precio` | número |
| `categoria` | código de categoría |
| `descripcion` | texto |
| `imagen` | archivo, opcional |

**Respuesta `201`** — el producto creado.

**Errores** — `400` si la imagen supera el límite o no es una imagen; la validación de tipo y tamaño (máximo 5 MB) es responsabilidad del **backend**, y la compresión se realiza en el servidor con Pillow (RF-002).

### `PATCH /productos/{id}/` 🔒🔨

Actualiza un producto propio. Mismos campos, todos opcionales. **`404`** si el producto no pertenece al taller autenticado.

---

## 6. Talleres y perfil

### `GET /artesanos/` 🔓

Colección de talleres. Array sin paginar mientras el volumen lo permita (RNF-007 fija 50 talleres).

### `GET /artesanos/{id}/` 🔓

Perfil público del taller. RF-008.

```json
{
  "id": 1,
  "nombre_taller": "Manos de Membreño",
  "responsable": "…",
  "historia": "…",
  "descripcion": "…",
  "rubro": { "id": 1, "codigo": "cuero_y_calzado", "nombre": "Cuero y calzado" },
  "ubicacion": "Barrio San Juan, Masaya",
  "horario": "…",
  "telefono": "85551234",
  "whatsapp": "85551234",
  "redes": { "facebook": "…", "instagram": "…" },
  "foto_url": "https://host/media/talleres/1/foto.jpg",
  "portada_url": "https://host/media/talleres/1/portada.jpg"
}
```

### `GET /artesanos/destacados/` 🔓

Selección para la portada. Array sin paginar (4 elementos).

### `GET /artesanos/me/` 🔒🔨

Taller de la persona autenticada.

### `PATCH /artesanos/me/` 🔒🔨

Actualiza el taller propio. **No recibe identificador**: se deriva del token. Esto sustituye `updateArtisan(DEMO_ARTISAN_ID, …)`.

---

## 7. Pedidos

La [máquina de estados del frontend](../../src/lib/order-state.ts) es la fuente de verdad para el diseño de esta sección, pero **quien la aplica es el backend**. El frontend la conserva únicamente para habilitar o deshabilitar controles; toda transición la valida y ejecuta el servidor.

```
pendiente ──┬──> aceptado ──┬──> en_produccion ──┬──> listo_para_entrega ──> entregado
            │               │                    │
            │               └──> cancelado <─────┘
            └──> rechazado
```

`entregado`, `rechazado` y `cancelado` son estados terminales.

### `GET /pedidos/` 🔒

Pedidos de la persona autenticada. **El backend filtra por identidad y rol**: un comprador recibe los suyos; un artesano, los de su taller. Esto sustituye la firma actual `listOrders({ rol, artesanoId })`, que recibía ambos datos del cliente.

**Parámetros** — `estado` (código; se omite para todos).

**Respuesta `200`** — array sin paginar.

### `GET /pedidos/{id}/` 🔒

Detalle, incluido el historial de auditoría. **`404`** si el pedido no pertenece a la persona autenticada.

```json
{
  "id": 81,
  "codigo": "PM-1009",
  "producto": { "id": 15, "nombre": "Sandalias de cuero natural", "imagen": "https://…" },
  "artesano_id": 1,
  "comprador_id": 4,
  "comprador_nombre": "Ana Lucía Delgado",
  "cantidad": 2,
  "personalizacion": "…",
  "observaciones": "…",
  "estado": "aceptado",
  "estado_pago": "pendiente",
  "precio_unitario": 4890,
  "costos_adicionales": 0,
  "costo_entrega": 0,
  "entrega": { "modalidad": "retiro_en_taller", "detalle": "…" },
  "pago": null,
  "motivo_cancelacion": null,
  "motivo_rechazo": null,
  "creado_en": "2026-08-15T10:30:00-06:00",
  "historial": [
    {
      "id": 1,
      "tipo": "pedido",
      "estado_anterior": null,
      "estado_nuevo": "pendiente",
      "usuario": "Ana Lucía Delgado",
      "fecha": "2026-08-15T10:30:00-06:00"
    }
  ]
}
```

> **Nota sobre `producto`:** se anida un resumen del producto (identificador, nombre e imagen) en lugar de solo `producto_id`. Hoy el frontend hace una segunda petición para mostrar el nombre en cada listado; anidarlo elimina esa consulta en cascada.

> **Nota sobre `estado_anterior`:** es `null` en el evento inicial. El prototipo usaba la cadena `"—"`, que es un carácter de presentación y no debe viajar por la API.

### `POST /pedidos/` 🔒👤

Crea una solicitud. RF-009.

**Petición**

```json
{
  "producto": 15,
  "cantidad": 2,
  "personalizacion": "…",
  "observaciones": "…"
}
```

El comprador, el taller, el precio unitario, el código y el estado inicial los determina el **backend**. Esto sustituye `createOrderRequest(input, usuario)`, que recibía el nombre de la persona desde el cliente.

**Respuesta `201`** — el pedido creado.

### Acciones sobre el pedido

Las transiciones con reglas o datos propios son **acciones explícitas**, no un `PATCH` genérico: cada una tiene permisos distintos y cuerpo distinto, y el registro de auditoría queda inequívoco.

| Endpoint | Rol | Desde | Hasta | Cuerpo |
|---|---|---|---|---|
| `POST /pedidos/{id}/aceptar/` 🔒🔨 | artesano | `pendiente` | `aceptado` | — |
| `POST /pedidos/{id}/rechazar/` 🔒🔨 | artesano | `pendiente` | `rechazado` | `{"motivo": "…"}` (obligatorio, mínimo 5 caracteres) |
| `POST /pedidos/{id}/cancelar/` 🔒 | **ambos** | `aceptado`, `en_produccion` | `cancelado` | `{"motivo": "…"}` (opcional) |
| `POST /pedidos/{id}/estado/` 🔒🔨 | artesano | avance lineal | siguiente | `{"estado": "en_produccion"}` |

`POST /pedidos/{id}/estado/` cubre el avance lineal (`aceptado → en_produccion → listo_para_entrega → entregado`), donde no hay datos adicionales. El backend valida la transición contra la máquina de estados y responde **`409`** si es inválida.

Todas devuelven **`200`** con el pedido actualizado, de modo que el frontend refresque su caché con la respuesta.

> **Corrección respecto del prototipo:** hoy la interfaz del artesano oculta la cancelación (`panel.pedidos.$id.tsx` filtra `"Cancelado"`), pese a que el RF-015 permite cancelar a ambas partes. El contrato la habilita para los dos roles; la interfaz deberá reflejarlo.

### `PATCH /pedidos/{id}/entrega/` 🔒🔨

Registra la modalidad de entrega. RF-016.

```json
{
  "modalidad": "punto_de_encuentro",
  "detalle": "Parque central de Masaya, sábado 10:00 a. m.",
  "costo_entrega": 150
}
```

---

## 8. Pagos y mensajería

El flujo de pago es **independiente** del estado del pedido (RF-011): registrar o confirmar un pago no altera `estado`, y avanzar el pedido no exige que el pago esté confirmado.

### `POST /pedidos/{id}/pago/` 🔒👤

El comprador registra su pago. `estado_pago`: `pendiente` → `registrado`.

**Petición** — `multipart/form-data` cuando se adjunta comprobante:

| Campo | Tipo |
|---|---|
| `metodo` | código de método de pago |
| `referencia` | texto, opcional |
| `nota` | texto, opcional |
| `comprobante` | archivo, opcional |

> **Cambio respecto del prototipo:** hoy solo se guarda `comprobanteNombre`, una cadena con el nombre del archivo. El contrato contempla el **archivo real**. Su almacenamiento y control de acceso son responsabilidad del backend (RNF-004): el comprobante solo debe ser accesible para el comprador y el artesano del pedido.

**Errores** — `409` si el pedido ya tiene un pago registrado.

> **Cuestión abierta:** el prototipo solo permite registrar el pago cuando el pedido está en `listo_para_entrega`, mientras que el RF-011 habla de un pedido `aceptado`. Es la pregunta abierta n.º 1 de la auditoría técnica y **debe resolverse antes de implementar**.

### `POST /pedidos/{id}/pago/confirmar/` 🔒🔨

El artesano confirma la recepción. `estado_pago`: `registrado` → `confirmado`. **`409`** si no hay pago registrado.

### `GET /pedidos/{id}/mensajes/` 🔒

Mensajes del pedido, en orden cronológico. Array sin paginar. RF-014.

**Parámetros** — `desde` (fecha ISO): devuelve **solo los mensajes posteriores**, para que el sondeo no reenvíe la conversación completa (RNF-010).

```json
[
  {
    "id": 42,
    "pedido_id": 81,
    "autor": "artesano",
    "autor_nombre": "Manos de Membreño",
    "texto": "…",
    "fecha": "2026-08-15T10:31:00-06:00"
  }
]
```

El frontend sondea cada 15 segundos el chat y cada 20 las notificaciones (RNF-010).

> **Desaparece por completo** la generación aleatoria de mensajes del artesano que hoy hace `pollNewMessages()` con un 45 % de probabilidad por sondeo.

### `POST /pedidos/{id}/mensajes/` 🔒

Envía un mensaje. `{"texto": "…"}`. El autor se deriva de la identidad autenticada.

El backend **rechaza con `409`** los mensajes en pedidos cuyo estado no admite conversación: `pendiente` (aún no habilitada), `rechazado` (nunca se habilita), `entregado` y `cancelado` (solo lectura).

### `GET /artesanos/me/resumen/` 🔒🔨

Indicadores del panel. Sustituye `artisanSummary()`, que hoy se calcula en el cliente recorriendo todo el almacén.

```json
{
  "solicitudes_pendientes": 1,
  "activos": 0,
  "pagos_por_confirmar": 0,
  "productos": 10,
  "por_estado": { "pendiente": 1, "aceptado": 0 }
}
```

---

## 9. Tabla de mapeo de campos

Conversión que aplica la capa de mapeo del cliente HTTP. Solo se listan los campos cuyo nombre cambia; el resto (`id`, `nombre`, `precio`, `cantidad`, `estado`, `texto`, `fecha`…) es idéntico en ambos lados.

| API (`snake_case`) | Frontend (`camelCase`) |
|---|---|
| `artesano_id` | `artesanoId` |
| `autor_nombre` | `autorNombre` |
| `comprador_id` | `compradorId` |
| `comprador_nombre` | `compradorNombre` |
| `costo_entrega` | `costoEntrega` |
| `costos_adicionales` | `costosAdicionales` |
| `creado_en` | `creadoEn` |
| `estado_anterior` | `estadoAnterior` |
| `estado_nuevo` | `estadoNuevo` |
| `estado_pago` | `estadoPago` |
| `foto_url` | `fotoUrl` |
| `motivo_cancelacion` | `motivoCancelacion` |
| `motivo_rechazo` | `motivoRechazo` |
| `nombre_taller` | `nombreTaller` |
| `pedido_id` | `pedidoId` |
| `portada_url` | `portadaUrl` |
| `precio_unitario` | `precioUnitario` |
| `registrado_en` | `registradoEn` |
| Envoltorio de paginación | ver sección 1.8 |

---

## 10. Impacto sobre el frontend actual

Cambios que este contrato implica en el código existente. **No se ejecuta ninguno hasta que el contrato sea aprobado y exista un plan.**

| Área | Cambio | Alcance |
|---|---|---|
| `src/types/index.ts` | `id: string` → `id: number` en `User`, `Artisan`, `Product`, `Order`, `Message`, `AuditEvent` | Alto — TypeScript señalará cada punto afectado |
| `src/types/index.ts` | `OrderStatus`, `PaymentStatus`, `DeliveryMode`, `PaymentMethod` pasan a códigos | Alto |
| `src/types/index.ts` | `Category` deja de ser unión literal y pasa a objeto poblado desde la API | Medio |
| Nuevo: diccionarios de etiquetas | Traducción código → texto visible para cada enum | Nuevo |
| `src/lib/order-state.ts` | Opera sobre códigos en lugar de etiquetas | Medio — lógica intacta, cambian los literales |
| `src/components/pedidos/status-badges.tsx`, `timelines.tsx` | Muestran la etiqueta traducida, no el valor | Medio |
| `src/routes/catalogo.tsx` | `?categoria=` viaja como código; el selector se puebla desde `/categorias/` | Medio |
| `src/hooks/use-session.tsx` | Se elimina `DEMO_ARTISAN_ID`; la identidad viene de `GET /auth/perfil/` | Alto |
| `src/routes/auth.tsx` | El rol deja de elegirse en el formulario de ingreso | Medio |
| `src/routes/panel.pedidos.$id.tsx` | Se habilita la cancelación para el artesano (RF-015) | Bajo |
| `src/components/productos/image-uploader.tsx` | Envía archivo al backend en vez de producir un DataURL | Medio |
| `src/services/mock-api.ts` | Se sustituye por servicios de dominio sobre un cliente HTTP | Alto |
| `src/data/seed.ts` | Desaparece como fuente de datos | Alto |

> **Observación sobre el orden de trabajo:** los cambios de tipos (identificadores y códigos de enumeración) afectan al mock tanto como al futuro cliente HTTP. Conviene aplicarlos **antes** de sustituir la capa de servicios, para que el mock siga siendo utilizable durante la transición y el compilador de TypeScript actúe como red de seguridad en un cambio a la vez.

---

## 11. Cuestiones abiertas

Deben resolverse antes o durante la implementación del backend:

1. **¿Desde qué estado puede registrarse el pago?** El RF-011 dice `aceptado`; el prototipo exige `listo_para_entrega`. Contradicción heredada de la auditoría técnica (pregunta abierta n.º 1).
2. **Mecanismo de autenticación** (JWT frente a sesión, y dónde se almacenan las credenciales en el cliente). Decisión arquitectónica siguiente.
3. **Aprobación de talleres.** El RF-013 menciona que el administrador aprueba el registro de nuevos artesanos; el contrato aún no define cómo se refleja ese estado en la API.
4. **Tasa de cambio configurable.** El RF-007 la describe configurable por el administrador; hoy es una constante del frontend. Requeriría un endpoint si se implementa.
5. **Panel de administración (RF-013).** Se prevé resolver con Django Admin, fuera de esta API. Conviene confirmarlo.
6. **Política de imágenes.** Número máximo por producto, dimensiones de salida tras la compresión con Pillow y si se generan miniaturas.
