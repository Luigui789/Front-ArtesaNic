# ADR-007 — Concreción de la autenticación en el backend

**Estado:** Propuesta. Implementada en la rama `feat/backend-foundation-auth` de `Back-Artesanic`; se acepta al integrar esa rama.

**Fecha:** 2026-10-04

**Decisiones previas relacionadas:** [ADR-003 — Autenticación y autorización](0003-autenticacion-y-autorizacion.md) (repositorio del frontend). Este ADR **no sustituye** su mecanismo: lo concreta, responde sus cuestiones abiertas 1, 2 y 4 y amplía su decisión 6.

**Modifica:** la sección 3 del contrato de API del frontend (`docs/api/contrato-api.md`) en el registro, la protección CSRF y el perfil. El detalle está en [`docs/api/autenticacion.md`](../api/autenticacion.md).

**Requisitos:** RF-004, RF-013, RNF-004, RNF-013.

## Contexto

El ADR-003 eligió el mecanismo: token de acceso en memoria del cliente y token de renovación en una cookie `HttpOnly` emitida por el backend, con protección CSRF en los endpoints que dependen de esa cookie. Dejó cinco cuestiones abiertas y el documento de frontera (lista B) las agrupó como «detalles de los tokens», a cerrar «al configurar la autenticación». Esta fase es ese momento.

Al implementarlo aparecieron, además, tres hechos:

1. **El contrato se contradecía.** Su sección 1.7 prohíbe que el cliente envíe su rol, pero `POST /auth/registro/` lo recibía en el cuerpo.
2. **El registro de artesano creaba el taller**, y talleres y aprobación pertenecen a la fase siguiente.
3. **La biblioteca prevista tiene un soporte limitado.** `djangorestframework-simplejwt` 5.5.1 (julio de 2025) es la última versión publicada; su documentación declara compatibilidad con DRF 3.14–3.15 y Django ≤ 5.1, y su integración continua publicada probó Django 5.2 solo con DRF 3.15. El proyecto usa Django 5.2 LTS con DRF 3.18.1.

El mecanismo del ADR-003 es válido y está aceptado; las instrucciones de esta fase piden respetarlo. Por eso se implementa tal cual y se fijan aquí los detalles que dejó abiertos.

## Decisión

### 1. Implementación

`djangorestframework-simplejwt` 5.5.1 con su aplicación `token_blacklist`. La compatibilidad con DRF 3.18.1 no está declarada por el proyecto: **la sostiene la suite de pruebas de este repositorio**, que ejerce emisión, validación, rotación, revocación y rechazo de tokens contra PostgreSQL. Una clase propia de autenticación (`apps/accounts/api/authentication.py`) unifica los errores y aplica la regla de acceso de la API. El transporte por cookie y el CSRF son código propio, como el ADR-003 ya advertía.

### 2. Duración y rotación (cuestión abierta 1)

| Token | Duración | Rotación |
|---|---|---|
| Acceso | 5 minutos | — |
| Renovación | 7 días | Rotativa: cada uso emite una nueva y **revoca** la anterior |

Siete días permiten a artesanos y compradores con poca familiaridad tecnológica (RNF-001) volver sin iniciar sesión cada día. La rotación acota la vida útil de cada cookie: si alguien usa una robada, la de su titular deja de servir y la sesión de este termina, lo que hace visible el robo. No expulsa al atacante: simplejwt no detecta la reutilización de una renovación ya rotada.

### 3. Cierre de sesión (cuestión abierta 2)

- El backend **mantiene una lista de revocados**: `logout` revoca el token de renovación de la cookie y la borra.
- `logout` exige CSRF y la cookie, **no** el token de acceso, para que pueda cerrarse una sesión con el acceso caducado. Es idempotente.
- **Límite asumido:** un token de acceso ya emitido no se revoca y deja de servir al caducar, como máximo 5 minutos después. El frontend lo descarta al cerrar sesión, y la sesión —lo que permite obtener tokens nuevos— queda invalidada de inmediato. Revocar también los accesos exigiría consultar estado del servidor en cada petición, lo que en la práctica reintroduce sesiones de servidor.
- Desactivar una cuenta sí corta el acceso de inmediato: la cuenta se vuelve a leer en cada petición autenticada.

### 4. CSRF (amplía la decisión 6 del ADR-003)

La protección CSRF se exige en **todos los endpoints que emiten o leen la cookie de renovación**: registro, login, refrescar y logout. El ADR-003 nombraba solo los dos últimos; sin protección en login y registro, un sitio ajeno podría hacer que el navegador de una persona iniciara sesión en una cuenta del atacante. Se usa la validación de Django completa (token y origen). La SPA obtiene el token en `GET /api/v1/auth/csrf/` y lo envía en `X-CSRFToken`.

### 5. Registro mediante operaciones explícitas

`POST /auth/registro/` con `rol` en el cuerpo se sustituye por `POST /auth/registro/comprador/` y `POST /auth/registro/artesano/`. El servidor asigna el rol según la operación; `rol` y cualquier otro campo no declarado se rechazan con `400`. La cuenta de artesano **no** crea ni aprueba un taller: la cuestión abierta 5 del ADR-003 queda para la fase de talleres.

### 6. Rol administrador (cuestión abierta 4)

- `Usuario.rol` admite `comprador`, `artesano` y `administrador`.
- **La administración opera solo en Django Admin** (RF-013 y módulo 4.4.8: no hay panel administrativo en el frontend). La API no autentica cuentas de administración: el login responde `403` y un token de una de esas cuentas, `401`. El catálogo `rol` del contrato sigue siendo `comprador | artesano`.
- **El rol de negocio no concede privilegios internos de Django.** Solo una cuenta con rol administrador puede tener `is_staff` o `is_superuser` (restricciones de PostgreSQL), y tener ese rol no los otorga. Un administrador de plataforma recibe `is_staff` y permisos concretos; el superusuario es una cuenta técnica de mantenimiento.
- En Django Admin, una cuenta que no es superusuario no reasigna roles, no otorga privilegios ni cambia contraseñas ajenas, y los tokens de renovación no se muestran: cualquiera de esas vías le permitiría actuar como otra persona y leer sus chats o comprobantes, que RF-013 y RNF-004 le prohíben.

### 7. Errores de acceso

Credenciales incorrectas, teléfono inexistente y cuenta inactiva responden el mismo `401`, que no revela si la cuenta existe (comportamiento por defecto de Django). Los tokens no válidos responden un único mensaje, sin los detalles internos que simplejwt incluiría.

## Alternativa considerada

**Sesiones de Django** (cookie de sesión `HttpOnly` y CSRF) también cumplen el objetivo del ADR-003 de no exponer credenciales a JavaScript, con menos código, sin dependencia adicional y con revocación inmediata. No se adoptan porque el ADR-003 está aceptado y es válido, y esta fase debía respetarlo. Si el equipo lo reconsiderara, el cambio requiere un ADR que sustituya al ADR-003 y afecta sobre todo a `apps/accounts/api/` y al cliente HTTP del frontend.

## Consecuencias

**Positivas**

- Las cuestiones abiertas 1, 2 y 4 del ADR-003 y la lista B del documento de frontera quedan cerradas con valores explícitos y probados.
- El contrato deja de contradecirse: ninguna petición puede elegir su rol.
- Ningún token sensible queda al alcance de JavaScript de forma persistente.

**Negativas y costos asumidos**

- Ventana de hasta 5 minutos en la que un token de acceso emitido sigue siendo válido tras el logout.
- Dependencia de una biblioteca sin versiones nuevas desde julio de 2025 y sin soporte declarado para DRF 3.18. Si una actualización de DRF la rompe, las pruebas lo detectarán; las salidas son fijar DRF o cambiar de mecanismo.
- La rotación puede hacer que dos pestañas que renuevan a la vez compitan por la misma cookie; el frontend debe reintentar una vez.
- Los tokens de renovación vigentes se guardan en PostgreSQL. Los caducados deben purgarse periódicamente con `flushexpiredtokens`.
- El frontend debe implementar el token en memoria, la renovación ante `401` con una sola renovación en curso, y el envío de CSRF.

## Cuestiones que este ADR no resuelve

| Cuestión | Dónde corresponde |
|---|---|
| Alta del taller al registrar o como paso posterior (ADR-003, cuestión 5); `artesano_id` y `artesano_estado` en el perfil; representación del taller rechazado (D13) | Fase de talleres |
| Topología de despliegue (mismo sitio o sitios distintos) y valores de `SameSite`/`Secure` | Fase de despliegue |
| Caché compartida para la limitación de intentos con varios procesos | Fase de despliegue |
| Recuperación de contraseña y edición de datos propios (RF-004) | Requieren definición específica |
