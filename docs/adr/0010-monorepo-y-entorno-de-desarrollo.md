# ADR-010 — Monorepo y entorno de desarrollo

**Estado:** Aceptada por el responsable del proyecto el 8 de octubre de 2026, con implementación en `chore/monorepo-migration` y validación informada por separado.

**Sustituye parcialmente:** [ADR-004](0004-ubicacion-del-backend.md), sobre repositorios separados; [ADR-008](0008-entorno-de-desarrollo-local.md), sobre Compose solo para la base en desarrollo; y la ubicación física de fuentes de [ADR-009](0009-fuente-del-contrato-de-api.md). Se conservan esos documentos y su historia. El [ADR-005](0005-infraestructura-y-persistencia.md) mantiene PostgreSQL y el alcance de infraestructura simple.

## Contexto

El mismo frontend tiene dos copias locales y su nombre anterior redirige a `Front-ArtesaNic`. `feat/presentation-polish` contiene 17 commits posteriores al main inicial; 12 archivos locales adicionales se registraron en cuatro commits descriptivos. El PR #1 de documentación ya fue fusionado y conserva `3bbbb07`. El backend remoto está vacío; el código local de cuentas y autenticación carecía de commits.

Se necesita una raíz común para pruebas, documentación y desarrollo, conservando el trabajo existente y separando su consolidación del traslado técnico.

## Decisión

1. `Luigui789/Front-ArtesaNic` es el repositorio principal. Frontend en `apps/frontend`, backend en `apps/backend`, documentación en `docs`, herramientas en `infra` y CI en `.github/workflows`.
2. Conservar el historial completo del frontend, los commits locales separados y el commit del PR #1, mediante merges sin reescribir historial publicado. El backend entra como snapshot inicial independiente porque no existía historial Git que importar.
3. Mantener pnpm 10.30.3 y `pnpm-lock.yaml`; backend con Python 3.13, uv, `pyproject.toml` y `uv.lock`. No actualizar dependencias mayores ni añadir Nx, Turborepo o microservicios.
4. Docker Compose en raíz ofrece frontend, backend y PostgreSQL 17. El backend espera disponibilidad de la base y aplica migraciones; el frontend espera la sonda del backend. El desarrollo en host sigue admitido.
5. Preservar `artesanic_postgres_data`. Las pruebas de esta migración usan otro proyecto Compose y otro volumen, sin copiar credenciales privadas ni alterar el volumen anterior. El nombre y las credenciales de una base existente se configuran de forma local.
6. `.env` de raíz configura el desarrollo conjunto. Django admite `.env` específico de la aplicación; prevalece sobre el de raíz y ambos respetan las variables exportadas. Usar los nombres actuales `DJANGO_*` y `POSTGRES_*`; no añadir `DATABASE_URL` artificialmente.
7. Los flujos del frontend permanecen con mocks. La comunicación real de esta fase se limita a `GET /api/v1/salud/` mediante un proxy de Vite configurable. No se conectan pedidos, pagos, inventario ni autenticación funcional de la interfaz.
8. Centralizar las 39 fichas del PR #1 sin perder campos, autores, estados o responsables. Conservar v2.1, aprobaciones históricas, definiciones operativas, planes, contratos y discrepancias con procedencia explícita. El contrato implementado sigue generado desde Django en `docs/api/openapi.yaml`.
9. Los PR de consolidación y migración se revisan por separado. No borrar ramas, archivar repositorios ni eliminar volúmenes al terminar; cualquier limpieza posterior requiere confirmación.

## Consecuencias y reversión

La nueva estructura permite levantar los tres servicios desde una raíz y ejecutar verificaciones por rutas. Hay que adaptar los enlaces, la ruta del esquema OpenAPI, las instrucciones antiguas y el contexto de herramientas. La conexión Lovable conserva su identificación e historial; su soporte de una aplicación bajo `apps/frontend` debe comprobarse en el editor antes de usarlo de nuevo.

Las copias originales permanecen disponibles. Se puede volver a la rama de consolidación para el frontend y recuperar el backend desde el commit snapshot, sin deshacer datos de PostgreSQL. No usar force-push, rebase de commits publicados ni operaciones que borren volúmenes. La retirada de configuraciones duplicadas ocurre después de conservarlas en Git.
