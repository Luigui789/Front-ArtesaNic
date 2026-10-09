# Fase B — Identificadores de dominio a `number` — Plan de migración

> **Para ejecutores agénticos:** este plan **no está autorizado a ejecutarse** a la fecha de escritura. La autorización se otorga por separado, después de revisar este documento. La autorización, cuando llegue, es para ejecutar **este** plan: cualquier dependencia inesperada, diferencia entre el código real y lo aquí descrito, o hallazgo que afecte lógica de negocio, **detiene esa parte y se consulta** antes de improvisar una solución.

**Objetivo:** que los identificadores de dominio del frontend se representen como `number`, tal como los fija el contrato de API, sustituyendo las cadenas con prefijo (`"art-1"`, `"prod-15"`, `"ped-4"`) heredadas del prototipo generado.

**Naturaleza del cambio:** es una migración de **representación de identificadores**. No corrige desviaciones de requisitos, no cambia reglas de negocio, no altera la interfaz salvo donde el tipo lo obliga.

**Spec:** [`docs/api/contrato-api.md`](../api/contrato-api.md) §1.2 (identificadores), §3, §5, §6, §7, §8 (ejemplos por entidad) y §10 (tabla de impacto sobre el frontend actual).

**Decisión que lo gobierna:** [ADR-002 — Acceso a datos y contratos](../adr/0002-acceso-a-datos-y-contratos.md).

---

## Decisiones previas que este plan da por cerradas

| # | Decisión | Origen |
|---|---|---|
| 1 | Fase A completada: los estados de pedido, estados de pago, modalidades de entrega y métodos de pago viajan como **códigos** (`en_produccion`), y su texto visible vive en `src/lib/labels.ts`. | Fase A, verificada |
| 2 | `categoryLabel()` se conserva aunque hoy sea la identidad: ya tiene consumidores y una función concreta en Fase C. **No se añaden más helpers preventivos.** | Revisión de Fase A |
| 3 | El `"Pago contra entrega"` del seed quedó reasignado a `"otro"` como **compatibilidad del dataset**, no como equivalencia semántica. Ese pedido no es evidencia de comportamiento del método de pago. | Revisión de Fase A |
| 4 | Existe un helper único de parsing de identificadores de ruta. Devuelve `undefined` si falta o no es un entero válido; **la ruta decide** qué hacer con `undefined`. El helper no interpreta `URLSearchParams`: recibe un valor que ya sabemos que es semánticamente un identificador. | Esta fase |
| 5 | `AuditEvent.id` pasa a **contador global secuencial**. La legibilidad del evento viene de `tipo`, `estadoAnterior`, `estadoNuevo` y `fecha`, no del identificador. | Esta fase |
| 6 | La sesión persistida usa una **clave nueva versionada**. No se migra silenciosamente el objeto antiguo. | Esta fase |
| 7 | Se adoptan los valores del contrato: taller `1`, usuario `4`. Los dos perfiles de sesión del prototipo comparten el `id: 4` porque son **estados de sesión alternativos**, no dos usuarios (ver la estrategia de identificadores). **Esto no resuelve D-6**: cambiar `"art-1"` por `1` es cambiar el tipo del mismo bypass, no eliminarlo. | Esta fase |

---

## Alcance

### Incluye

| Grupo | Volumen |
|---|---|
| Declaraciones de tipo de identificador | 12 campos en `types/index.ts` + 2 en `use-session.tsx` |
| Firmas de servicio del mock | 19 funciones en `mock-api.ts` |
| Generadores de identificadores | 5 expresiones `Date.now()` → secuencias |
| Literales del seed | 14 sitios en `seed.ts` |
| Fronteras de URL | 5 parámetros de ruta + 2 de query |
| Diccionarios indexados por identificador | 2 en `use-notifications.tsx` |
| Claves de React Query con identificador | 8 formas |
| Identidad de la sesión demo | valores + clave de almacenamiento |

### Excluye explícitamente

Estos elementos **no se tocan en B**, aunque aparezcan en los mismos archivos o líneas contiguas:

- **`Category`** y la constante `CATEGORIES` — Fase C. En B, `Category` sigue siendo la unión literal de textos.
- **`producto` anidado** en el pedido (contrato §7). `Order.productoId` solo cambia de tipo; sigue siendo un campo plano. El anidamiento es un cambio de forma que además elimina cuatro consultas de catálogo completo, y merece su propio paso.
- **D-2** — precondición de pago confirmado para entrar en producción. Es una regla de negocio.
- **`AuditEvent.estadoAnterior: "—" → null`** — es un valor de presentación que no debe viajar por la API, pero es su propia deuda.
- **D-6** — el fallback `usuario?.artesanoId ?? DEMO_ARTISAN_ID` sobrevive a esta fase, con su tipo actualizado. Su eliminación es la fase de autenticación.
- **Autorización real, JWT, cliente HTTP** — ADR-003.
- **`src/lib/order-state.ts`** — auditado: no contiene ninguna referencia a identificadores. No se abre.
- **`src/lib/labels.ts`** — no contiene identificadores.
- **UI y copy** — ningún cambio visual, ningún texto reescrito, salvo lo que el tipo obligue (ver Tarea B6, `<Select>` de talleres).
- **Dependencias** — no se instala ni se retira ningún paquete.

### Entidades que NO migran a `number`

Verificado contra el contrato, no asumido:

| Campo | Motivo |
|---|---|
| `Order.codigo` | `"PM-1009"` es un código de negocio, no un identificador. Sigue siendo `string`. Convive con `id` en el mismo objeto: es la confusión más probable de esta fase. |
| `Category` | Tiene identificador numérico en el contrato §4, pero pertenece a Fase C. |
| `pago`, `entrega`, `reembolso` | Objetos anidados sin identificador propio en el contrato. |

---

## Tabla completa: archivo por archivo

| Archivo | Acción | Qué cambia | Riesgo |
|---|---|---|---|
| `src/lib/route-id.ts` | **Crear** | `parseRouteId()` | Bajo |
| `src/types/index.ts` | Modificar | 12 campos de identificador `string` → `number` | Bajo — el compilador propaga |
| `src/data/seed.ts` | Modificar | 14 literales + contador de eventos | Medio — cruces entre entidades |
| `src/services/mock-api.ts` | Modificar | `DEMO_ARTISAN_ID`, 19 firmas, 5 generadores | Medio |
| `src/hooks/use-session.tsx` | Modificar | Tipos, identidades demo, clave de almacenamiento | Medio — dato persistido |
| `src/hooks/use-notifications.tsx` | Modificar | 2 `Record`, firma de `marcarLeido`, `NotificacionMensaje.pedidoId` | **Alto — el compilador no lo detecta** |
| `src/routes/producto.$id.tsx` | Modificar | `parseRouteId` + clave de caché | Medio |
| `src/routes/artesano.$id.tsx` | Modificar | `parseRouteId` + 2 claves de caché | Medio |
| `src/routes/solicitar.$productId.tsx` | Modificar | `parseRouteId` + clave de caché | Medio |
| `src/routes/pedidos.$id.tsx` | Modificar | `parseRouteId` + claves + `marcarLeido` | Medio |
| `src/routes/panel.pedidos.$id.tsx` | Modificar | `parseRouteId` + claves + 3 mutaciones | Medio |
| `src/routes/catalogo.tsx` | Modificar | `artesanoId` en query string + `<Select>` + `nombreArtesano` | Medio |
| `src/routes/mensajes.tsx` | Modificar | `?pedido=`, comparación, `seleccionar`, `nombreProducto` | Medio |
| `src/routes/pedidos.index.tsx` | Modificar | `nombreProducto(id: number)` | Bajo |
| `src/routes/panel.index.tsx` | Modificar | `nombreProducto` + `artesanoId` | Bajo |
| `src/routes/panel.pedidos.index.tsx` | Modificar | `nombreProducto` + `artesanoId` | Bajo |
| `src/routes/panel.perfil.tsx` | Modificar | `artesanoId` | Bajo |
| `src/routes/panel.productos.tsx` | Modificar | `artesanoId` | Bajo |
| `src/components/pedidos/order-chat.tsx` | Modificar | prop `pedidoId: number` | Bajo |

**No se modifican:** `App.tsx` (las rutas `:id` no cambian de forma), `product-card.tsx`, `artisan-card.tsx` (solo interpolan el identificador en un enlace, y un número se interpola igual), `timelines.tsx` (`key={e.id}` acepta `number`), `labels.ts`, `order-state.ts`, `format.ts`, `image-uploader.tsx`.

---

## Estrategias

### Estrategia de identificadores

**Valores del seed** — se elimina el prefijo y se conserva el número que ya existía:

```text
art-1  … art-50    →   1 … 50
prod-1 … prod-500  →   1 … 500
ped-1  … ped-8     →   1 … 8
msg-1  … msg-3     →   1 … 3
eventos de auditoría → contador global 1 … N (asignado al construir)
```

**Identidades demo** — se adoptan los valores del contrato:

```text
artesano del panel (taller)  →  1     (era "art-1")

DEMO_COMPRADOR                DEMO_ARTESANO
  id: 4                         id: 4
  rol: "comprador"              rol: "artesano"
                                artesanoId: 1
```

> **Naturaleza de estos perfiles — leer antes de interpretar el dato.**
>
> Los perfiles comprador y artesano utilizados por el mock representan **estados de sesión alternativos para demostración de la interfaz**. La reutilización del identificador `4` entre ambos perfiles **no representa dos usuarios simultáneos** ni constituye el modelo de identidad del sistema real. La identidad y el rol definitivos serán determinados por el backend durante la implementación de autenticación.
>
> La aparente ambigüedad del contrato (§3 muestra a Ana Lucía Delgado como `artesano` con `id: 4`; §7 la muestra como compradora con `comprador_id: 4`) es, leída así, **deliberada**: el prototipo necesita poder demostrar ambas navegaciones —catálogo, solicitud y pedidos del comprador; panel, productos, aceptación, producción y confirmación de pagos del artesano— con un único dataset. No es una inconsistencia del dominio y no debe "corregirse" inventando un segundo usuario.
>
> En el sistema real la relación es la que fija el contrato §3:
>
> ```text
> usuario  →  id único  →  rol determinado por el backend a partir de la cuenta
> ```
>
> No debe existir una misma cuenta que sea comprador o artesano según qué demostración se cargue. `artesanoId` sigue siendo un dato **independiente** de `User.id`: vale `1` en el perfil artesano y no aplica en el de comprador.
>
> Si `artesanoId` debe representarse como `null` o como `undefined` cuando no aplica **no se resuelve aquí**: ya está identificado como trabajo de la fase de autenticación (contrato §3, "ausente no significa por defecto").

> **Nota sobre `compradorId`.** Hoy `listOrders()` no filtra por comprador en ningún caso: para el rol comprador devuelve todos los pedidos. La coherencia entre `Order.compradorId` y `SesionUsuario.id` es por tanto **documental, no funcional**. Se mantiene coherente por corrección del dato, pero **no se convierte en filtro en esta fase** — eso sería añadir lógica de negocio.

**Generadores del mock** — el mock ocupa el lugar del backend, así que asignar identificadores ahí es legítimo; en la UI no lo sería nunca. Se sustituye `Date.now()` por secuencias que arrancan por encima del último valor sembrado, de modo que el mock reproduzca el comportamiento observable de un `AutoField`:

```text
producto nuevo  →  501, 502, …
pedido nuevo    →  9, 10, …
mensaje nuevo   →  4, 5, …
evento nuevo    →  N+1, N+2, …
```

Se descarta `Number(Date.now())`: es válido en tipo, pero produce enteros de 13 dígitos derivados del reloj del cliente, que no se parecen a lo que devolverá el backend y hacen ilegible el dato de demostración.

### Estrategia de rutas

El helper vive en `src/lib/route-id.ts` y es deliberadamente pequeño:

```ts
/**
 * Convierte el texto de una URL en un identificador de dominio.
 *
 * Devuelve `undefined` cuando el valor falta o no es un entero positivo. Quien
 * llama decide qué significa eso: en un parámetro de ruta significa que la URL
 * no identifica ningún recurso (404); en un parámetro de búsqueda puede
 * significar simplemente "sin selección".
 *
 * Recibe el valor ya extraído, no el `URLSearchParams`: no todos los parámetros
 * de búsqueda son identificadores, y el helper no debe adivinarlo.
 */
export function parseRouteId(value: string | undefined | null): number | undefined {
  if (value == null || !/^[0-9]+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}
```

La validación por expresión regular, y no `Number.isInteger(Number(value))`, evita que `""`, `" 7 "`, `"0x10"` o `"1e3"` se acepten como identificadores.

**Parámetro de ruta** — patrón para las 5 rutas dinámicas:

```ts
const { id } = useParams<{ id: string }>();
const productoId = parseRouteId(id);

const producto = useQuery({
  queryKey: ["producto", productoId],
  queryFn: () => getProduct(productoId!),
  enabled: productoId !== undefined,
});

// … resto de hooks …

if (productoId === undefined) return <NotFound />;
```

Dos precisiones de implementación:

1. La salida temprana **debe seguir después de todos los hooks**, exactamente donde hoy está el `if (!id) return null`. Adelantarla rompería las reglas de los hooks.
2. Sustituir `return null` por `<NotFound />` es lo que pediste ("renderizar la navegación/404 correspondiente"). Es el mismo componente que ya sirve la ruta `*`, y trae su propio contenedor a pantalla completa, así que no necesita `SiteLayout`.

**Distinción que hay que preservar** — son dos fallos distintos y deben verse distintos:

```text
/producto/abc      → identificador no válido      → 404 de navegación
/producto/999999   → identificador válido, no existe → "No encontramos este producto."
```

**Parámetro de búsqueda** — el mismo helper, decisión distinta:

```text
?pedido=abc   → undefined → NO es 404: cae en la primera conversación (comportamiento actual)
?artesanoId=x → undefined → NO es 404: equivale a "todos los talleres"
```

### Estrategia de claves de React Query

React Query serializa las claves de forma determinista: `["pedido", "81"]` y `["pedido", 81]` son **claves distintas**. Un desalineamiento no produce error de compilación ni de ejecución: produce una pantalla que deja de actualizarse. Es el fallo más difícil de diagnosticar de esta fase.

**Regla:** convertir una sola vez al principio del componente y usar **esa misma variable** en la clave, en `queryFn` y en cada `invalidateQueries`. Ninguna ruta debe volver a tocar el valor crudo de `useParams()` después de la conversión.

Efecto secundario deseable, que se verifica: `producto.$id.tsx` usa `["producto", <id de ruta>]` y `pedidos.$id.tsx` usa `["producto", <productoId del pedido>]`. Hoy comparten caché porque ambos son texto. Con la conversión en la frontera **siguen compartiéndola**; sin ella, se separarían en silencio.

### Estrategia de sesión persistida

El almacenamiento actual (`masaya.sesion`) contiene objetos con la forma anterior y se lee con `JSON.parse(...) as SesionUsuario`, sin validación. Una aserción de tipo no comprueba nada en ejecución: un `{artesanoId: "art-1"}` guardado entraría como si fuera un `number` y el panel del artesano aparecería vacío, sin ningún error visible.

**Decisión:** clave nueva versionada.

```text
masaya.sesion                            →  v1, queda huérfana y se ignora
masaya-artisan-connect.session.v2        →  nueva estructura
```

No se migra el objeto antiguo. Convertir `"art-1" → 1` sería fabricar una sesión aparentemente válida a partir de datos demo de otro modelo, y mezclaría justamente los dos modelos que esta fase separa. La clave v1 no se borra: borrar datos del navegador de la persona usuaria no es necesario para el objetivo y es irreversible.

Esto **no es** la implementación de autenticación. Es impedir que el estado persistido del prototipo contamine el modelo nuevo.

---

## Orden de implementación

Cada tarea deja el compilador como guía de la siguiente: al terminar un grupo, `npx tsc --noEmit` señala exactamente qué consumidores quedan pendientes. Se espera que el proyecto **no compile** entre B1 y B10; el punto de corte real es el final de B10.

### B1 — Tipos

`src/types/index.ts`: `User.id`, `User.artesanoId`, `Artisan.id`, `Product.id`, `Product.artesanoId`, `AuditEvent.id`, `Message.id`, `Message.pedidoId`, `Order.id`, `Order.productoId`, `Order.artesanoId`, `Order.compradorId` pasan a `number`.

`Order.codigo` se deja intacto. `User.artesanoId` conserva su opcionalidad (`artesanoId?: number`): la semántica de `null` del contrato §3 pertenece a la fase de autenticación y mezclarla aquí sería tocar reglas de negocio.

### B2 — Seed e identificadores iniciales

`src/data/seed.ts`:

- `` `art-${i + 1}` `` → `i + 1`; `` `prod-${i + 1}` `` → `i + 1`; `` `ped-${n}` `` → `n`.
- `codigo: \`PM-${1000 + n}\`` **no cambia**.
- `compradorId: "user-comprador"` → `4` (dos sitios: `mk()` en seed y `createOrderRequest()` en el mock).
- Mensajes: ids `1, 2, 3`; `pedidoId: "ped-4"` → `4`, `"ped-5"` → `5`.
- Eventos de auditoría: los cuatro literales derivados (`ev-${n}-1`, `${o.id}-p${i}`, `${o.id}-t`, `${o.id}-pay1`, `${o.id}-pay2`) se sustituyen por un contador local, reiniciado al inicio de `buildOrders()` para que la construcción siga siendo determinista:

```ts
let ultimoEventoId = 0;
const nuevoEventoId = () => ++ultimoEventoId;
```

El mock necesitará saber dónde continuar; se deriva del dato, no de un número mágico (ver B3).

### B3 — Generadores secuenciales del mock

`src/services/mock-api.ts`, junto a la construcción del store:

```ts
/**
 * El mock ocupa el lugar del backend: aquí los identificadores se asignan como
 * lo haría el servidor (enteros crecientes). La interfaz nunca los construye.
 */
function secuencia(desde: number) {
  let actual = desde;
  return () => ++actual;
}

const nuevoProductoId = secuencia(products.length);
const nuevoPedidoId = secuencia(orders.length);
const nuevoMensajeId = secuencia(messages.length);
const nuevoEventoId = secuencia(orders.reduce((n, o) => n + o.historial.length, 0));
```

Sustituye las 5 expresiones: `prod-n-${Date.now()}`, `ped-n-${Date.now()}`, `ev-${Date.now()}` (evento inicial de `createOrderRequest`), `ev-${Date.now()}-${Math.random()…}` (`pushEvent`) y los dos `msg-${Date.now()}` (`sendMessage` y `pollNewMessages`).

Los demás `Math.random()` del archivo (latencia, fallo simulado, 45 % de mensajes entrantes) **no se tocan**: no generan identificadores.

### B4 — Firmas de `mock-api.ts`

Las 19 firmas inventariadas pasan su parámetro de identificador a `number`: `CatalogFilters.artesanoId`, `getProduct`, `getArtisan`, `listMyProducts`, `createProduct`, `updateProduct`, `updateArtisan`, `listOrders.params.artesanoId`, `getOrder`, `OrderRequestInput.productoId`, `mutateOrder`, `changeOrderStatus`, `registerPayment`, `confirmPayment`, `setDelivery`, `listMessages`, `sendMessage`, `pollNewMessages`, `artisanSummary`.

`DEMO_ARTISAN_ID` pasa de `"art-1"` a `1`. **Se conserva el nombre y el mecanismo**: sustituirlo aquí sería empezar D-6 dentro de una fase de tipos.

Las comparaciones internas (`x.id === id`, `p.artesanoId === artesanoId`, `m.pedidoId === pedidoId`) no requieren cambio: ambos lados migran juntos.

`countByCategory()` y `porEstado` conservan su `Record<string, number>`: están indexados por categoría y por código de estado, no por identificador.

### B5 — `parseRouteId()`

Crear `src/lib/route-id.ts` con el contenido de la sección de estrategia. Sin consumidores todavía.

### B6 — Rutas y parámetros de búsqueda

Las 5 rutas dinámicas adoptan el patrón descrito. Además:

**`mensajes.tsx`**

```ts
const seleccionado = parseRouteId(searchParams.get("pedido"));
// … `o.id === seleccionado` queda number === number | undefined
const seleccionar = (id: number) => {
  marcarLeido(id);
  setSearchParams({ pedido: String(id) });
};
const nombreProducto = (id: number) => …
```

**`catalogo.tsx`**

- `CatalogSearch.artesanoId?: number`.
- Lectura: `artesanoId: parseRouteId(params.get("artesanoId"))`.
- Escritura: `params.set("artesanoId", String(search.artesanoId))`.
- `nombreArtesano = (id: number)`.
- `<Select>` de talleres: Radix solo admite valores de texto, así que `value={search.artesanoId != null ? String(search.artesanoId) : "todos"}`, `<SelectItem key={a.id} value={String(a.id)}>` y `onValueChange={(v) => set({ artesanoId: v === "todos" ? undefined : parseRouteId(v) })}`. Es una conversión de frontera de interfaz, no de dominio.

**Los cuatro `nombreProducto(id: string)`** de `pedidos.index.tsx`, `panel.index.tsx`, `panel.pedidos.index.tsx` y `mensajes.tsx` pasan a `number`.

**Los cuatro `artesanoId = usuario?.artesanoId ?? DEMO_ARTISAN_ID`** de `panel.index.tsx`, `panel.pedidos.index.tsx`, `panel.perfil.tsx` y `panel.productos.tsx` cambian de tipo por propagación. **El fallback se queda**: es D-6.

Las interpolaciones en enlaces (`` `/producto/${p.id}` ``, `` `/panel/pedidos/${o.id}` ``, `` `/artesano/${artesanoId}` ``) no requieren cambio.

### B7 — Claves de React Query

Revisar las 8 formas que contienen identificador y confirmar que cada una usa la variable numérica ya convertida: `["producto", id]`, `["artesano", id]`, `["pedido", id]`, `["mensajes", pedidoId]`, `["productos-artesano", id]`, `["mis-productos", artesanoId]`, `["resumen-artesano", artesanoId]`, `["pedidos", "artesano", artesanoId, estado]`.

Atención especial a los tres `invalidateQueries` de `panel.pedidos.$id.tsx` y los dos de `pedidos.$id.tsx`: deben invalidar con la misma variable con la que se consultó.

### B8 — Notificaciones

`src/hooks/use-notifications.tsx`:

- `NotificacionMensaje.pedidoId: number`
- `noLeidos: Record<number, number>` (interfaz, estado y `useState`)
- `desde: useRef<Record<number, string>>({})`
- `marcarLeido: (pedidoId: number) => void` (interfaz y `useCallback`)
- `artesanoId: DEMO_ARTISAN_ID` pasa a numérico por propagación

> **Esta tarea no puede delegarse en el compilador.** Está verificado con el `tsc` del proyecto: indexar un `Record<string, X>` con un `number` **no produce ningún error** — TypeScript admite índice numérico sobre firma de índice de texto — y en ejecución tampoco falla, porque JavaScript convierte la clave. Si estas cuatro líneas no se cambian a mano, el código funciona por accidente y el tipo queda mintiendo.

`src/components/pedidos/order-chat.tsx`: prop `pedidoId: number`.

### B9 — Sesión v2

`src/hooks/use-session.tsx`:

- `SesionUsuario.id: number`, `SesionUsuario.artesanoId?: number`
- `COMPRADOR.id: 4` (rol `comprador`, sin `artesanoId`)
- `ARTESANO.id: 4` (rol `artesano`, `artesanoId: DEMO_ARTISAN_ID` = 1)
- `const KEY = "masaya-artisan-connect.session.v2"`

El identificador `4` es deliberadamente el mismo en ambas constantes: son dos **estados de sesión** del prototipo, no dos usuarios. Conviene dejar el comentario correspondiente junto a las constantes, porque es el punto exacto donde alguien leyendo el código podría interpretarlo como un error.

No se añade validación del objeto leído: en v2 solo escribe esta misma versión del código. La validación pertenece a la fase de autenticación, junto con la eliminación de `localStorage` como sustituto de persistencia.

### B10 — Barrido de identificadores en texto restantes

Búsqueda final en `src/` (excluyendo `components/ui/`) de: `art-`, `prod-`, `ped-`, `msg-`, `ev-`, `user-`, `id: string`, `Id: string`, `id!`, `Number(id`, `parseInt`. Cualquier resultado que sea un identificador de dominio es un olvido; cualquier otro (por ejemplo `id` de elementos HTML, `id="motivo-rechazo"`) se deja como está.

---

## Verificación

### Automática

```
npx tsc --noEmit
pnpm run build
pnpm run lint
```

`pnpm run build` no verifica tipos, así que ambos comandos son obligatorios, en ese orden.

### Manual (servidor de desarrollo)

| # | Comprobación | Qué demuestra |
|---|---|---|
| 1 | Catálogo carga, paginación y filtro de precio funcionan | El grueso del store sigue accesible |
| 2 | Filtrar por taller: la URL queda `?artesanoId=7` y el `<Select>` conserva la selección al recargar | Frontera de query string en ambos sentidos |
| 3 | Abrir un producto desde el catálogo y volver | Interpolación y caché por identificador |
| 4 | `/producto/abc` → 404 de navegación | `parseRouteId` rechaza lo no numérico |
| 5 | `/producto/999999` → "No encontramos este producto." | Identificador válido pero inexistente: error de datos, no 404 |
| 6 | Solicitar un pedido → navega a `/pedidos/9` y el pedido existe | Secuencia de pedidos y navegación con el id recién asignado |
| 7 | Registrar un pago en ese pedido → el detalle se actualiza solo | **Invalidación de `["pedido", id]`** — la prueba clave de B7 |
| 8 | Panel: aceptar una solicitud → cambian el detalle, la lista y el resumen | Las tres invalidaciones de `panel.pedidos.$id.tsx` |
| 9 | Chat: enviar un mensaje y verlo aparecer | `["mensajes", pedidoId]` |
| 10 | Publicar un producto en el panel → aparece en "Mis productos" y en el catálogo | Secuencia de productos (id 501) e invalidación cruzada |
| 11 | Historial del pedido: los eventos se muestran completos y sin claves duplicadas en React | Contador global de `AuditEvent` |
| 12 | Notificaciones: el contador por pedido sube y se limpia al abrir el detalle | `Record<number, …>` y `marcarLeido` |
| 13 | **Con una sesión v1 previa en `localStorage`**, recargar: la aplicación arranca con la sesión demo v2 y el panel muestra los productos del taller 1 | La clave versionada aísla el dato antiguo |
| 14 | `/mensajes?pedido=abc` selecciona la primera conversación, no un 404 | La ruta decide qué significa `undefined` |

La comprobación 13 requiere sembrar a mano la clave antigua en el navegador antes de recargar; sin ese paso, un navegador limpio no prueba nada.

---

## Riesgos

| # | Riesgo | Detección | Mitigación |
|---|---|---|---|
| 1 | **Clave de React Query desalineada** (texto en un lado, número en el otro): la invalidación deja de encontrar la entrada. Sin error de compilación ni de ejecución; solo una pantalla que no se actualiza. | Ninguna automática | Convertir una sola vez por componente y usar esa variable en todo. Comprobaciones 7, 8, 9, 10 |
| 2 | **`Record<string, …>` indexado con número**: compila y funciona, pero el tipo queda mintiendo. Verificado: TypeScript no lo señala. | Ninguna automática | B8 es un cambio manual explícito, no delegado al compilador |
| 3 | **Sesión persistida v1** con identificadores de texto entrando en un tipo `number` por una aserción sin validación | Solo en un navegador con historial | Clave versionada (B9). Comprobación 13 |
| 4 | **`Order.codigo` convertido por inercia** junto a `id` | `tsc` lo detecta si se usa como número; no si solo se muestra | Está señalado en tres puntos de este plan. Revisar `codigo` explícitamente en la revisión de código |
| 5 | **`<Select>` de talleres**: Radix exige valores de texto; un `value` numérico rompe la selección en silencio | Visual | Conversión explícita en B6. Comprobación 2 |
| 6 | **Alcance accidental**: la fase toca 18 archivos y roza `Category`, D-2, D-6 y el `producto` anidado | Revisión de código | Lista de exclusiones al principio de este documento |
| 7 | **Cruce comprador ↔ sesión** incoherente | Ninguna: hoy `compradorId` no se usa como filtro | Se documenta como valor coherente, no funcional. No se convierte en filtro |

---

## Criterios de aceptación

1. `npx tsc --noEmit`, `pnpm run build` y `pnpm run lint` pasan sin errores.
2. No queda en `src/` (excluyendo `components/ui/`) ningún identificador de dominio representado como texto: ni literales con prefijo, ni campos `id: string`, ni parámetros de servicio `string`.
3. `Order.codigo` sigue siendo `string` y conserva el formato `PM-1009`.
4. `Category` y `CATEGORIES` están **exactamente** como antes de esta fase.
5. `order-state.ts`, `labels.ts` y `format.ts` no tienen ningún cambio.
6. El fallback `usuario?.artesanoId ?? DEMO_ARTISAN_ID` sigue presente en los cuatro archivos del panel, con tipo numérico. D-6 sigue abierta y así debe quedar registrada.
7. No hay cambios visuales ni de copy, salvo la conversión de valores del `<Select>` de talleres.
8. `package.json` y `pnpm-lock.yaml` no tienen cambios.
9. Las 14 comprobaciones manuales pasan, incluida la 13 (sesión v1 previa).
10. Los identificadores generados por el mock son enteros pequeños y consecutivos al dato sembrado (501, 9, 4…), no marcas de tiempo.

---

---

## Cierre de la fase

**Estado: COMPLETADA** (2026-08-15).

Los identificadores de dominio del frontend fueron migrados de cadenas a `number` conforme al contrato de API. Se actualizaron tipos, seed, mock, rutas, parámetros de búsqueda, claves de React Query, notificaciones, chat y sesión persistida. Se incorporó parsing centralizado de identificadores de ruta y generación secuencial en el mock.

`npx tsc --noEmit` y `pnpm run build` pasan. Las 14 verificaciones funcionales pasan. El lint permanece pendiente exclusivamente por una incompatibilidad preexistente de finales de línea, no introducida por esta fase (ver deuda T-1).

### Alcance real frente al previsto

16 archivos modificados y 1 nuevo, frente a los 18 y 1 previstos. `panel.perfil.tsx` y `panel.productos.tsx` no requirieron edición: declaran `const artesanoId = usuario?.artesanoId ?? DEMO_ARTISAN_ID` sin anotación de tipo, de modo que la inferencia los convirtió a `number` sola. No es una omisión: el plan pedía revisarlos por propagación, no editarlos necesariamente. Que la propagación funcione sin tocarlos es evidencia de que la migración de tipos alcanzó correctamente a los consumidores.

La regla crítica se mantuvo intacta en todo el árbol: `usuario.id` (persona) y `artesanoId` (taller) nunca se sustituyeron el uno por el otro.

### Deuda registrada en esta fase

| # | Deuda | Detalle |
|---|---|---|
| **T-1** | **Tooling — normalización de finales de línea** | El repositorio utiliza CRLF mientras la regla `prettier/prettier` exige LF. `pnpm run lint` reporta ~3 349 errores `Delete ␍`, **todos** de esa regla, incluidos archivos que esta fase no toca (verificado sobre `eslint.config.js`, que falla en sus 40 líneas). **No se modifica durante Fase B** para evitar un diff transversal de formato ajeno al cambio. Filtrando esa regla, los archivos migrados no producen ningún error; solo quedan 2 avisos `react-refresh/only-export-components` preexistentes. Corregirlo es una decisión deliberada y global, pendiente. |
| **T-2** | **`.claude/launch.json`** | Creado fuera del plan, necesario para levantar el servidor de desarrollo durante la verificación. No es código de aplicación y **no cuenta como cambio de Fase B**. El `.gitignore` del proyecto ignora `.vscode/*` pero **no** `.claude/`, así que hoy sería versionable. Pendiente decidir si se conserva, se ignora o se elimina. |

### Auditoría posterior: contrato frente a tipos vigentes

Estado de `src/types/index.ts` tras B, contrastado con [`docs/api/contrato-api.md`](../api/contrato-api.md). Sirve como línea base para elegir la siguiente fase.

| Elemento | Contrato | Tipos vigentes | Estado |
|---|---|---|---|
| Identificadores de `User`, `Artisan`, `Product`, `Order`, `Message`, `AuditEvent` | entero | `number` | **Alineado (B)** |
| Claves foráneas `artesanoId`, `compradorId`, `productoId`, `pedidoId` | entero | `number` | **Alineado (B)** |
| `Order.codigo` | cadena (`"PM-1009"`) | `string` | **Alineado** |
| Estados, modalidades y métodos | códigos `snake_case` | códigos | **Alineado (A)** |
| `Category` | recurso propio `{id, codigo, nombre}` | unión literal de textos | Divergente — **Fase C** |
| `Artisan.rubro` | categoría anidada | `Category` (texto) | Divergente — **Fase C** |
| `Order.producto` | objeto anidado `{id, nombre, imagen}` | `productoId` plano | Divergente — fase propia |
| `AuditEvent.estadoAnterior` | `string \| null` | `string` (usa `"—"`) | Divergente — fase propia |
| `Order.reembolso` | objeto anidado (RF-015) | no existe | Divergente — **D-5** |
| `Order.pago.comprobante` | archivo real | `comprobanteNombre` | Divergente — **D-10** |
| `Product.imagenes` | URL absolutas del backend | DataURL en cliente | Divergente — **D-7** |
| `User.artesanoId` | `number \| null` explícito | `number` opcional | Divergente — fase de autenticación |
| Precondición de pago para producir | `409` del backend | no implementada | Divergente — **D-2** |
| Identidad y rol | derivados del backend | perfiles demo + fallback | Divergente — **D-6** |

Ninguna divergencia es nueva ni fue introducida por B: todas estaban inventariadas antes de empezar.

---

## Qué queda pendiente después de B

Registrado aquí para que no se pierda ni se cuele en la fase equivocada:

| Pendiente | Fase |
|---|---|
| `Category` como entidad servida por `GET /categorias/` | C |
| `producto` anidado en el pedido (elimina 4 consultas de catálogo completo) | Propia |
| D-2: precondición de pago confirmado para entrar en producción | Propia |
| `AuditEvent.estadoAnterior: "—" → null` | Propia |
| D-6: eliminación del fallback y autenticación real | Autenticación (ADR-003) |
| D-5: objeto `reembolso` | Propia |
| Cliente HTTP y sustitución del mock | Posterior |
