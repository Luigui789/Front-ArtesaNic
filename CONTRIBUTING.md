# Contribuir a ArtesaNic

Trabajar desde `main` integrado y usar ramas `feature/*`, `fix/*` o `docs/*`; esta reorganización utiliza `chore/monorepo-migration`. Los PR de consolidación y migración se revisan por separado. No borrar ramas ni archivar repositorios sin confirmación del responsable.

## Dependencias y alcance

Frontend: pnpm y `apps/frontend/pnpm-lock.yaml`. Backend: uv, `apps/backend/pyproject.toml` y `apps/backend/uv.lock`. Instalar con `--frozen-lockfile` y `--locked`; no generar locks paralelos ni actualizar versiones mayores por reorganizar carpetas.

Los flujos del frontend siguen con mocks. En esta fase la única comunicación real añadida es la comprobación de salud mediante el proxy de Vite. Nuevos RF e integración de negocio requieren una fase posterior.

## Validación de un cambio

Ejecutar lint, typecheck, pruebas del mock y build del frontend. Para backend: ruff, checks de Django, migraciones pendientes y pruebas con PostgreSQL. [Comandos](README.md#pruebas-y-calidad).

Tras cambiar endpoints implementados, desde `apps/backend` regenerar:

```bash
uv run python manage.py spectacular --validate --fail-on-warn --file ../../docs/api/openapi.yaml
```

Comprobar enlaces con `python infra/scripts/check-doc-links.py` y patrones de credenciales con `python infra/scripts/check-secrets.py`. No registrar `.env`, entornos virtuales, cachés ni archivos de usuarios. Las plantillas contienen exclusivamente valores de ejemplo.

## Documentación y decisiones

[docs/requisitos/requisitos.md](docs/requisitos/requisitos.md) contiene las 39 fichas actuales; conservar identificadores, estados, autores y aprobaciones. Las versiones anteriores permanecen en [docs/requisitos/historico/](docs/requisitos/historico/). Resolver discrepancias explícitamente, sin alterar requisitos para adaptarlos al mock.

Los ADR conservan una numeración única. El 006 permanece reservado. Una decisión nueva sustituye la anterior indicando su alcance; no reescribir decisiones históricas ni historial publicado. La conexión Lovable conserva su identificación y requiere comprobar en el editor su soporte para `apps/frontend` antes de volver a usarlo para desarrollo.
