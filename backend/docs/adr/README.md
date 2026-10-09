# Registro de decisiones de arquitectura (ADR)

La numeración es **única para los dos repositorios** ([ADR-009](0009-fuente-del-contrato-de-api.md)). Antes de crear un ADR, comprobar el último número en ambos `docs/adr/`. Un ADR aceptado no se reescribe: otro posterior lo sustituye y deja constancia.

| ADR | Título | Repositorio | Estado |
|---|---|---|---|
| 001 | [Sistema de routing](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0001-sistema-de-routing.md) | Frontend | Aceptada |
| 002 | [Acceso a datos y contratos](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0002-acceso-a-datos-y-contratos.md) | Frontend | Aceptada |
| 003 | [Autenticación y autorización](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0003-autenticacion-y-autorizacion.md) | Frontend | Aceptada; concretada por el 007 |
| 004 | [Ubicación del backend](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0004-ubicacion-del-backend.md) | Frontend | Aceptada |
| 005 | [Infraestructura y persistencia](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0005-infraestructura-y-persistencia.md) | Frontend | Aceptada; decisión 3 sustituida en local por el 008 |
| 006 | Modelo de oferta y pedido | — | **Reservado** (hoja de ratificación, D18); sin redactar |
| 007 | [Concreción de la autenticación](0007-concrecion-de-la-autenticacion.md) | Backend | Propuesta |
| 008 | [Entorno de desarrollo local](0008-entorno-de-desarrollo-local.md) | Backend | Propuesta |
| 009 | [Fuente del contrato de API](0009-fuente-del-contrato-de-api.md) | Backend | Propuesta |

A 4 de octubre de 2026, ningún ADR del frontend está todavía en su `main`: del 001 al 005 están publicados en la rama `feat/presentation-polish` (y del 001 al 003 también en `origin/feature/migrar-react-router`). Los enlaces apuntan a `main` y resolverán cuando esas ramas se integren.
