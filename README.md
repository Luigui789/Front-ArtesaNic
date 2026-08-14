# Masaya Artisans Connect

PROYECTO: SISTEMA E-COMMERCE PARA LA COMERCIALIZACIÓN DE PRODUCTOS ARTESANALES DE LAS PYMES DEL MUNICIPIO DE MASAYA

IMPORTANTE — ALCANCE DE ESTA FASE

Desarrolla EXCLUSIVAMENTE el FRONTEND web del proyecto.

NO desarrollar backend.

NO desarrollar Django.

NO desarrollar Django REST Framework.

NO desarrollar SQL Server.

NO crear base de datos.

NO crear migraciones.

NO implementar autenticación real.

NO implementar API real.

NO implementar almacenamiento real de archivos.

NO implementar pasarela de pago real.

NO implementar procesamiento real de pagos.

NO implementar infraestructura de servidor.

Todas las operaciones deben funcionar mediante DATOS MOCK y servicios simulados dentro del frontend.

El objetivo de esta fase es construir un prototipo frontend completo, navegable, responsive, visualmente profesional y funcional a nivel de demostración.

El frontend debe quedar preparado conceptualmente para conectarse posteriormente con una API REST desarrollada en Django REST Framework, pero esa integración NO debe realizarse en esta fase.

==================================================

1. TECNOLOGÍAS DEL FRONTEND

==================================================

Utilizar como tecnologías principales:

- React

- TypeScript

- Vite

- Tailwind CSS

- shadcn/ui

- Lucide React

- TanStack Query

- React Hook Form

- Zod

Utilizar el sistema de routing compatible con el entorno actual de Lovable.

NO introducir otro router innecesariamente si el proyecto ya dispone de un sistema de routing funcional.

No utilizar Next.js.

La aplicación debe ser una SPA frontend desarrollada con React + TypeScript + Vite.

==================================================

2. OBJETIVO DEL SISTEMA

==================================================

El sistema busca facilitar la comercialización de productos artesanales elaborados por PYMEs del municipio de Masaya, Nicaragua.

El modelo de negocio NO es un e-commerce tradicional basado en carrito y checkout.

El modelo es COMERCIO BAJO DEMANDA.

El flujo principal es:

Producto

→ Solicitud de pedido

→ Evaluación del artesano

→ Aceptar / Rechazar

→ Pedido

→ Producción

→ Pago

→ Entrega

Por lo tanto:

NO crear carrito de compras.

NO crear checkout tradicional.

NO crear wishlist.

NO crear sistema de calificaciones.

NO crear favoritos.

NO crear cupones.

NO crear sistema de puntos.

NO crear recomendaciones comerciales.

NO crear sistema logístico propio.

NO crear tracking GPS.

NO crear mapas.

NO crear pasarela de pago.

NO agregar funcionalidades que no estén respaldadas por los requerimientos.

==================================================

3. ROLES

==================================================

El frontend debe representar dos roles principales:

COMPRADOR

Puede:

- Explorar productos.

- Consultar catálogo.

- Filtrar productos.

- Consultar detalles de productos.

- Consultar perfiles de artesanos.

- Solicitar pedidos personalizados.

- Consultar sus pedidos.

- Consultar el estado de sus pedidos.

- Consultar el estado de pago.

- Registrar información de pago.

- Consultar la mensajería asociada a un pedido.

- Cancelar pedidos cuando corresponda.

- Consultar y registrar modalidad de entrega.

ARTESANO / PYME

Puede:

- Consultar solicitudes recibidas.

- Aceptar solicitudes.

- Rechazar solicitudes.

- Consultar pedidos.

- Actualizar estados de pedidos según las transiciones permitidas.

- Confirmar pagos.

- Registrar modalidad de entrega.

- Utilizar la mensajería asociada al pedido.

- Cancelar pedidos cuando corresponda.

- Crear productos.

- Editar productos.

- Consultar sus productos.

- Editar su perfil comercial.

ADMINISTRADOR

NO desarrollar interfaz administrativa.

La administración será gestionada posteriormente mediante Django Admin.

RF-013 queda fuera del frontend.

==================================================

4. REQUERIMIENTOS FUNCIONALES

==================================================

RF-001 — CARGA SIMPLIFICADA DE PRODUCTOS

El artesano debe poder crear y editar productos utilizando únicamente cuatro grupos de información obligatoria:

- Fotografía.

- Nombre y precio.

- Categoría.

- Descripción.

El formulario debe ser sencillo y reducir la carga cognitiva del usuario.

No agregar campos innecesarios.

Debe incluir:

- previsualización de imagen;

- validación;

- estado de carga;

- mensajes de error;

- confirmación de guardado.

RF-002 — OPTIMIZACIÓN Y ALMACENAMIENTO DE IMÁGENES

A nivel frontend se debe SIMULAR el procesamiento de imágenes.

El cargador debe mostrar:

- selección de imagen;

- previsualización;

- procesamiento;

- estado de carga;

- éxito;

- error.

No implementar almacenamiento real.

RF-003 — CATEGORIZACIÓN POR RUBRO LOCAL

Utilizar las siguientes categorías:

- Cuero y calzado.

- Hamacas.

- Madera.

- Textiles.

- Dulces.

- Otros.

Estas categorías deben aparecer en:

- inicio;

- catálogo;

- filtros;

- productos;

- formularios;

- navegación relacionada.

RF-004 — AUTENTICACIÓN SIMPLIFICADA

Crear las interfaces de:

- Registro.

- Inicio de sesión.

El método principal será:

Teléfono + contraseña.

Google y verificación mediante SMS/WhatsApp deben aparecer únicamente como funcionalidades futuras deshabilitadas.

NO implementar autenticación real.

RF-005 — EVALUACIÓN DE SOLICITUD

El artesano debe recibir solicitudes de pedidos.

Debe poder:

- Aceptar.

- Rechazar.

Antes de ejecutar cualquiera de las dos acciones mostrar una confirmación.

Debe quedar claramente indicado que:

RECHAZADO ES UN ESTADO TERMINAL.

Una solicitud rechazada NO genera chat.

RF-006 — RESUMEN ECONÓMICO

El detalle del pedido debe mostrar:

- precio del producto;

- costos adicionales cuando existan;

- costo de entrega cuando aplique;

- total estimado.

NO mostrar comisión de plataforma.

RF-007 — CONVERSIÓN DE DIVISAS

Los precios deben poder visualizarse en:

Córdobas (C$)

y

Dólares (US$).

Utilizar una tasa simulada dentro de los datos mock.

No depender de servicios externos.

RF-008 — PERFIL DEL ARTESANO

Cada artesano debe tener un perfil público con:

- nombre del taller;

- historia;

- descripción;

- rubro;

- ubicación general;

- horario;

- teléfono/WhatsApp;

- redes sociales;

- productos publicados.

El diseño debe transmitir confianza, identidad artesanal y profesionalismo.

RF-009 — SOLICITUD DE PEDIDO PERSONALIZADO

Desde la ficha de producto debe existir un CTA principal:

"SOLICITAR PEDIDO"

El formulario debe permitir:

- seleccionar producto;

- indicar cantidad;

- agregar observaciones;

- indicar características o personalización.

Debe incluir:

- validación con Zod;

- mensajes de error claros;

- confirmación previa;

- estado de carga;

- confirmación de envío.

La solicitud comienza en estado:

PENDIENTE.

RF-010 — SEGUIMIENTO DEL PEDIDO

Implementar EXACTAMENTE esta máquina de estados:

PENDIENTE

↓

ACEPTADO

↓

EN PRODUCCIÓN

↓

LISTO PARA ENTREGA

↓

ENTREGADO

Estados terminales:

PENDIENTE → RECHAZADO

ACEPTADO → CANCELADO

EN PRODUCCIÓN → CANCELADO

NO utilizar estados inventados como:

- En proceso.

- Confirmado.

- Completado.

El frontend debe impedir visualmente las transiciones inválidas.

Crear un componente visual:

OrderTimeline

Debe mostrar:

- pasos completados;

- paso actual;

- pasos pendientes;

- estado terminal cuando corresponda.

RF-011 — ESTADO DE PAGO

El pago debe manejarse independientemente del estado del pedido.

Estados:

PENDIENTE DE PAGO

↓

PAGO REGISTRADO

↓

PAGO CONFIRMADO

Crear un componente:

PaymentStatusBadge

El estado del pedido y el estado del pago SIEMPRE deben mostrarse por separado.

Ejemplo:

Pedido:

En producción

Pago:

Pendiente de pago

NO crear campos de tarjeta.

RF-013 — ADMINISTRACIÓN

Fuera del alcance del frontend.

No desarrollar dashboard administrativo.

RF-014 — MENSAJERÍA DEL PEDIDO

Crear un chat asociado exclusivamente a cada pedido.

Reglas:

Pendiente:

Chat deshabilitado.

Rechazado:

No existe chat.

Aceptado:

Chat habilitado.

En producción:

Chat habilitado.

Listo para entrega:

Chat habilitado.

Entregado:

Chat en modo solo lectura.

Cancelado:

Chat en modo solo lectura.

Simular polling cada 15 segundos.

No utilizar WebSockets.

Mostrar información como:

"Actualizado hace 8 segundos"

La simulación debe representar que únicamente se obtienen mensajes nuevos.

RF-015 — CANCELACIÓN

Permitir cancelar únicamente pedidos en:

- Aceptado.

- En producción.

No mostrar la acción de cancelar en:

- Pendiente.

- Rechazado.

- Listo para entrega.

- Entregado.

- Cancelado.

Solicitar confirmación mediante modal.

Permitir indicar motivo.

Después de cancelar:

- estado = Cancelado;

- notificar visualmente;

- chat = solo lectura.

RF-016 — MODALIDAD DE ENTREGA

Permitir registrar:

- Retiro en taller.

- Punto de encuentro.

- Entrega directa por el artesano.

- Otra.

Si se selecciona "Otra", mostrar campo de texto.

NO implementar:

- GPS;

- mapas;

- tracking;

- cálculo de rutas;

- integración con empresas logísticas.

La coordinación específica puede representarse mediante la mensajería.

==================================================

5. REQUERIMIENTOS NO FUNCIONALES

==================================================

RNF-001 — USABILIDAD

La interfaz debe estar diseñada pensando especialmente en artesanos con poca experiencia tecnológica.

Utilizar:

- botones grandes;

- acciones principales claramente visibles;

- lenguaje sencillo;

- formularios cortos;

- mensajes de error comprensibles;

- zonas táctiles mínimas de 44px;

- navegación clara;

- jerarquía visual;

- contraste adecuado.

Los estados nunca deben comunicarse únicamente mediante color.

RNF-002 — RESPONSIVIDAD

Aplicar estrategia Mobile First.

Soportar desde:

360px

Breakpoints conceptuales:

Mobile:

360px–767px

Tablet:

768px–1199px

Desktop:

1200px o superior

Mobile:

- navegación simplificada;

- filtros en panel;

- formularios verticales;

- botones grandes;

- contenido prioritario.

Tablet:

- aprovechar mejor el espacio horizontal;

- grids adaptables;

- paneles compactos.

Desktop:

- sidebar;

- grids de mayor densidad;

- tablas cuando sean apropiadas;

- mayor aprovechamiento del espacio.

RNF-003 — RENDIMIENTO

Aplicar:

- lazy loading;

- carga progresiva;

- imágenes optimizadas;

- skeleton loaders;

- evitar renderizados innecesarios;

- carga prioritaria de contenido textual;

- carga diferida de imágenes.

El catálogo debe diseñarse pensando en redes móviles 3G/4G.

RNF-004 — SEGURIDAD

No incluir:

- campos de tarjetas;

- datos bancarios almacenados;

- información sensible expuesta públicamente.

El comprobante de pago debe representarse como un recurso de acceso controlado simulado.

La seguridad real será responsabilidad del backend futuro.

RNF-005 — MANTENIBILIDAD

El frontend debe estar organizado de forma modular y reutilizable.

Separar conceptualmente:

- páginas;

- componentes;

- funcionalidades;

- tipos;

- hooks;

- servicios mock;

- layouts.

Los datos deben consumirse mediante una capa de servicios simulada para que posteriormente pueda reemplazarse por llamadas reales a Django REST Framework sin rediseñar las interfaces.

RNF-006 — DISPONIBILIDAD

No implementar infraestructura.

Sí representar estados de:

- error;

- servicio no disponible;

- reintentar.

RNF-007 — ESCALABILIDAD

La interfaz debe poder manejar como mínimo:

- 50 artesanos;

- 500 productos.

El catálogo debe utilizar renderizado eficiente y evitar cargas innecesarias.

RNF-008 — TRAZABILIDAD

En el detalle del pedido mostrar historial de cambios.

Cada evento debe mostrar:

- estado anterior;

- estado nuevo;

- usuario;

- fecha;

- hora.

Aplicarlo para:

- estado del pedido;

- estado del pago.

La mensajería debe mantener su historial.

RNF-009 — COMPATIBILIDAD

La aplicación debe funcionar correctamente en:

- Chrome;

- Firefox;

- Edge.

Utilizar estándares web modernos.

RNF-010 — POLLING

El chat debe simular actualización cada:

15 segundos.

Cada actualización debe representar únicamente la llegada de mensajes nuevos.

==================================================

6. IDENTIDAD VISUAL — "BARRO Y SOMBRA"

==================================================

La identidad visual debe inspirarse en la artesanía de Masaya sin convertir la interfaz en un diseño folclórico excesivamente cargado.

El resultado debe sentirse:

- artesanal;

- cálido;

- auténtico;

- moderno;

- profesional;

- confiable;

- limpio.

Paleta principal:

Fondo crema cálido:

#FDFaf5

Superficie:

#E8DFD0

Terracota principal:

#B5502F

Verde oliva:

#4A5D3A

Acento:

Mostaza cálido.

Texto:

Gris muy oscuro.

Texto secundario:

Gris medio.

Evitar utilizar negro puro como color principal.

La paleta debe implementarse mediante tokens semánticos.

No colocar colores directamente dentro de componentes individuales.

Utilizar variables CSS y los mecanismos de theming disponibles en Tailwind/shadcn.

==================================================

7. PRINCIPIOS DE UI/UX

==================================================

La interfaz debe priorizar:

CLARIDAD

El usuario debe entender inmediatamente:

- dónde está;

- qué puede hacer;

- qué ocurrió;

- cuál es el siguiente paso.

JERARQUÍA VISUAL

Las acciones principales deben destacar claramente.

Ejemplo:

"SOLICITAR PEDIDO"

debe tener mayor jerarquía que acciones secundarias.

SIMPLICIDAD

Evitar formularios innecesariamente complejos.

No llenar las pantallas con información secundaria.

CONFIANZA

El comprador debe poder identificar:

- quién fabrica el producto;

- dónde está ubicado el taller;

- qué está comprando;

- cuál es el precio;

- qué estado tiene su pedido.

IDENTIDAD ARTESANAL

Utilizar la identidad cultural mediante:

- fotografía;

- color;

- tipografía;

- espacios;

- iconografía;

- detalles visuales.

No utilizar decoraciones excesivas que reduzcan la usabilidad.

==================================================

8. TIPOGRAFÍA

==================================================

Utilizar una tipografía sans-serif moderna y altamente legible para:

- navegación;

- formularios;

- botones;

- información;

- descripciones.

Se puede utilizar una tipografía display con carácter artesanal exclusivamente en:

- títulos principales;

- hero;

- encabezados destacados.

No utilizar tipografías ornamentales difíciles de leer.

==================================================

9. PANTALLAS DEL COMPRADOR

==================================================

Crear:

1. INICIO

Hero principal:

"Descubre el arte y la tradición de Masaya"

CTA:

"Explorar productos"

Mostrar:

- categorías;

- productos destacados;

- artesanos destacados;

- explicación del modelo de pedido bajo demanda;

- llamada a solicitar productos;

- footer.

2. CATÁLOGO

Incluir:

- buscador;

- filtros;

- categoría;

- precio;

- artesano;

- ordenamiento;

- grid de productos;

- paginación o carga progresiva.

Desktop:

Sidebar de filtros.

Mobile:

Panel/modal de filtros.

3. DETALLE DE PRODUCTO

Mostrar:

- galería;

- nombre;

- precio;

- selector C$ / US$;

- descripción;

- categoría;

- información del artesano;

- disponibilidad;

- CTA "Solicitar pedido".

4. PERFIL DEL ARTESANO

Mostrar:

- portada;

- fotografía;

- nombre;

- historia;

- rubro;

- ubicación;

- horario;

- teléfono/WhatsApp;

- redes;

- productos.

5. SOLICITAR PEDIDO

Formulario:

- producto;

- cantidad;

- personalización;

- observaciones.

Mostrar confirmación antes del envío.

6. MIS PEDIDOS

Mostrar:

- lista;

- fecha;

- producto;

- total;

- estado del pedido;

- estado del pago.

Permitir filtrar.

7. DETALLE DE PEDIDO

Mostrar:

- OrderTimeline;

- resumen económico;

- estado del pago;

- modalidad de entrega;

- mensajería;

- historial de trazabilidad;

- acciones disponibles.

8. REGISTRO DE PAGO

Mostrar:

- método;

- transferencia;

- comprobante;

- pago contra entrega;

- otro método.

NO mostrar tarjetas.

9. MENSAJERÍA

Chat asociado al pedido.

Mostrar:

- mensajes;

- fecha;

- hora;

- estado;

- actualización simulada cada 15 segundos.

10. CANCELACIÓN

Modal de confirmación.

Motivo de cancelación.

Resultado:

Cancelado.

11. AUTENTICACIÓN

- iniciar sesión;

- registro;

- recuperación.

Método principal:

Teléfono + contraseña.

Google/SMS/WhatsApp:

"Próximamente"

Deshabilitado.

==================================================

10. PANTALLAS DEL ARTESANO

==================================================

12. PANEL PRINCIPAL

Mostrar:

- solicitudes pendientes;

- pedidos activos;

- pedidos por estado;

- pagos pendientes;

- avisos importantes.

No convertirlo en un dashboard excesivamente complejo.

13. BANDEJA DE SOLICITUDES

Mostrar:

- comprador;

- producto;

- cantidad;

- personalización;

- fecha;

- estado.

Acciones:

Aceptar.

Rechazar.

Confirmar antes de ejecutar.

14. PEDIDOS

Mostrar:

- pedidos;

- estado;

- pago;

- cliente;

- fecha.

Detalle:

- timeline;

- pago;

- entrega;

- chat;

- trazabilidad;

- cancelación.

15. MIS PRODUCTOS

Mostrar:

- productos;

- fotografía;

- nombre;

- precio;

- categoría;

- estado.

Crear y editar utilizando únicamente los campos definidos por RF-001.

16. PERFIL DEL TALLER

Editar:

- nombre;

- historia;

- rubro;

- ubicación;

- horario;

- teléfono;

- WhatsApp;

- redes sociales.

17. TRAZABILIDAD

Mostrar historial:

Estado anterior

→ Estado nuevo

→ Usuario

→ Fecha

→ Hora

Utilizar una línea temporal clara y fácil de interpretar.

==================================================

11. DESIGN SYSTEM

==================================================

Crear componentes reutilizables.

Como mínimo:

- Button;

- Input;

- Select;

- Textarea;

- SearchBar;

- ProductCard;

- ArtisanCard;

- StatusBadge;

- OrderStatusBadge;

- PaymentStatusBadge;

- OrderTimeline;

- Alert;

- Toast;

- Modal/Dialog;

- Dropdown;

- Tabs;

- Breadcrumb;

- Pagination;

- Table;

- Skeleton;

- EmptyState;

- ErrorState;

- ImageUploader;

- CurrencySwitcher;

- Chat;

- AuditTimeline.

Cada componente interactivo debe contemplar cuando corresponda:

- default;

- hover;

- focus;

- active;

- disabled;

- loading;

- error.

==================================================

12. ESTADOS DE INTERFAZ

==================================================

Todas las vistas que trabajen con datos deben contemplar:

LOADING

Skeleton loader.

EMPTY

Mensaje explicando que no existen registros y qué puede hacer el usuario.

ERROR

Mensaje claro + botón "Reintentar".

SUCCESS

Feedback mediante toast o mensaje contextual.

No mostrar pantallas vacías durante procesos de carga.

==================================================

13. ACCESIBILIDAD

==================================================

Aplicar:

- WCAG AA;

- contraste adecuado;

- foco visible;

- navegación por teclado;

- labels asociados;

- HTML semántico;

- alt en imágenes;

- botones correctamente identificados;

- áreas táctiles de mínimo 44px.

Los estados no deben depender únicamente del color.

Ejemplo:

No mostrar solamente un círculo verde.

Mostrar:

✓ Pago confirmado

==================================================

14. DATOS MOCK

==================================================

Crear datos simulados para:

- usuarios;

- artesanos;

- productos;

- categorías;

- solicitudes;

- pedidos;

- estados;

- pagos;

- mensajes;

- modalidades de entrega;

- historial.

Crear una capa de servicios mock.

La capa debe comportarse como una futura API REST:

- latencia simulada;

- loading;

- errores;

- respuestas;

- mutaciones.

Utilizar TanStack Query para gestionar consultas y mutaciones.

==================================================

15. FORMULARIOS

==================================================

Utilizar:

React Hook Form + Zod

para:

- autenticación;

- solicitud de pedido;

- productos;

- perfil;

- pago;

- entrega;

- cancelación.

Los errores deben ser comprensibles.

Ejemplo:

Incorrecto:

"Invalid input"

Correcto:

"Ingresa una cantidad mayor que 0."

==================================================

16. RESPONSIVE DESIGN

==================================================

Diseñar primero para móvil.

No crear una versión desktop y simplemente reducirla.

El layout debe adaptarse realmente.

MOBILE:

- navegación sencilla;

- contenido vertical;

- CTA principal visible;

- filtros en modal;

- tarjetas compactas;

- formularios sencillos.

TABLET:

- aprovechar espacio;

- dos columnas cuando corresponda;

- paneles adaptables.

DESKTOP:

- sidebar;

- grids;

- tablas;

- paneles de información;

- mayor densidad.

==================================================

17. IMÁGENES

==================================================

Utilizar imágenes representativas de:

- artesanía de Masaya;

- cuero;

- calzado;

- hamacas;

- madera;

- textiles;

- dulces;

- talleres artesanales.

Las imágenes son únicamente para el prototipo.

Priorizar:

- buena calidad visual;

- relación de aspecto consistente;

- lazy loading;

- imágenes adecuadas para tarjetas y galerías.

==================================================

18. SEO FRONTEND

==================================================

Cada página debe tener:

- título;

- descripción;

- metadata básica.

Ejemplos:

"Artesanías de Masaya | Inicio"

"Catálogo de productos artesanales | Masaya"

"Producto artesanal | Nombre del producto"

"Artesano | Nombre del taller"

==================================================

19. ARQUITECTURA DEL FRONTEND

==================================================

Organiza el código de manera modular y mantenible.

No es necesario seguir una estructura de carpetas rígida si el entorno de Lovable dispone de una organización diferente.

Prioriza separación entre:

- componentes reutilizables;

- páginas;

- funcionalidades;

- tipos;

- hooks;

- servicios mock;

- layouts;

- estilos.

No modificar innecesariamente la configuración interna del proyecto si ya existe una estructura funcional.

La arquitectura debe permitir que posteriormente los servicios mock sean reemplazados por llamadas reales a Django REST Framework.

==================================================

20. NAVEGACIÓN

==================================================

Crear navegación equivalente a:

/

 /catalogo

 /producto/:id

 /artesano/:id

 /solicitar/:productId

 /pedidos

 /pedidos/:id

 /pedidos/:id/pago

 /pedidos/:id/mensajes

 /auth

 /panel

 /panel/solicitudes

 /panel/pedidos

 /panel/pedidos/:id

 /panel/productos

 /panel/perfil

Utilizar el sistema de routing compatible con el proyecto actual.

No agregar un router alternativo innecesario.

==================================================

21. SIMULACIÓN DE FLUJOS

==================================================

El prototipo debe poder demostrarse sin backend.

Debe ser posible simular:

Comprador:

- consultar catálogo;

- consultar producto;

- solicitar pedido;

- consultar pedido;

- registrar pago;

- enviar mensajes;

- cancelar pedido.

Artesano:

- consultar solicitudes;

- aceptar;

- rechazar;

- actualizar pedido;

- confirmar pago;

- registrar entrega;

- cancelar;

- administrar productos;

- editar perfil.

Los cambios realizados durante la demostración deben reflejarse visualmente en la interfaz.

==================================================

22. REGLA CONTRA FUNCIONALIDADES INVENTADAS

==================================================

No inventar funcionalidades.

Todo elemento de la interfaz debe estar justificado por alguno de los RF o RNF proporcionados.

NO agregar:

- carrito;

- wishlist;

- favoritos;

- reviews;

- estrellas;

- cupones;

- puntos;

- descuentos;

- recomendaciones;

- suscripciones;

- logística propia;

- tracking;

- GPS;

- mapas;

- pasarela de pago;

- tarjetas;

- chat global;

- funcionalidades sociales.

Si una funcionalidad no está definida en RF-001 a RF-016 o RNF-001 a RNF-010, NO convertirla en una funcionalidad del sistema.

==================================================

23. REGLAS DE ESTADOS

==================================================

Es especialmente importante respetar las máquinas de estado.

PEDIDO:

Pendiente

→ Aceptado

→ En producción

→ Listo para entrega

→ Entregado

Terminal:

Pendiente

→ Rechazado

Aceptado

→ Cancelado

En producción

→ Cancelado

PAGO:

Pendiente de pago

→ Pago registrado

→ Pago confirmado

No combinar ambos estados.

Ejemplo correcto:

Pedido: En producción

Pago: Pago registrado

Ejemplo incorrecto:

Pedido: En producción / Pago confirmado

==================================================

24. EXPERIENCIA VISUAL

==================================================

La aplicación debe sentirse como una plataforma real de comercio artesanal, no como un simple CRUD académico.

La experiencia debe transmitir:

- confianza;

- autenticidad;

- cultura local;

- modernidad;

- simplicidad;

- profesionalismo.

El diseño debe utilizar espacios en blanco correctamente.

Evitar:

- exceso de tarjetas;

- exceso de sombras;

- colores saturados;

- gradientes innecesarios;

- animaciones excesivas;

- interfaces recargadas;

- componentes visualmente inconsistentes.

Utilizar animaciones sutiles únicamente cuando mejoren la experiencia:

- hover;

- transición de estados;

- apertura de modales;

- skeleton;

- feedback de acciones.

==================================================

25. CRITERIO DE VALIDACIÓN

==================================================

Antes de considerar terminada cada pantalla verificar:

1. ¿Qué requisito funcional respalda esta pantalla?

2. ¿Qué requisito no funcional afecta su diseño?

3. ¿Qué rol puede utilizarla?

4. ¿Qué acciones puede realizar?

5. ¿Qué acciones están prohibidas?

6. ¿Qué estados debe mostrar?

7. ¿Respeta las máquinas de estados?

8. ¿Funciona sin backend?

9. ¿Es responsive desde 360px?

10. ¿Es accesible?

11. ¿Tiene loading, empty y error cuando corresponde?

12. ¿Utiliza componentes reutilizables?

13. ¿Respeta la identidad visual "Barro y Sombra"?

14. ¿Evita funcionalidades no definidas?

==================================================

26. RESULTADO ESPERADO

==================================================

El resultado debe ser un FRONTEND COMPLETO Y NAVEGABLE del sistema:

"Sistema e-commerce para la comercialización de productos artesanales de las PYMEs del municipio de Masaya".

Debe incluir:

- interfaz de comprador;

- interfaz de artesano;

- catálogo;

- productos;

- perfiles de artesanos;

- solicitudes;

- pedidos;

- estados;

- pagos;

- mensajería;

- entrega;

- trazabilidad;

- autenticación simulada;

- diseño responsive;

- accesibilidad;

- design system;

- datos mock;

- estados de loading/error/empty;

- UX consistente.

Debe utilizar:

React

+

TypeScript

+

Vite

+

Tailwind CSS

+

shadcn/ui

+

Lucide

+

TanStack Query

+

React Hook Form

+

Zod

TODO debe funcionar en el frontend mediante datos simulados.

NO desarrollar backend.

NO desarrollar base de datos.

NO conectar APIs reales.

NO implementar autenticación real.

NO implementar pagos reales.

NO implementar infraestructura.

El backend Django + Django REST Framework y SQL Server serán desarrollados posteriormente y se conectarán mediante API REST.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://masaya-artisan-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a7c9366-a4ae-44b6-ae63-acd23100ce9d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
