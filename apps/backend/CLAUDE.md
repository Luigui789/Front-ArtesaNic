# Contexto del backend

Identificador estable: `masaya-artisan-connect`. Django/DRF y PostgreSQL, monolito modular en `apps/<dominio>/`. Código preservado: cuentas y autenticación; no añadir RF durante la migración.

Dependencias exclusivamente con uv, `pyproject.toml` y `uv.lock`. Pruebas contra PostgreSQL. Comandos: `uv sync --locked`, `uv run python manage.py test`, `uv run ruff check .`, `uv run ruff format --check .` y `uv run python manage.py makemigrations --check --dry-run`.

Documentación central: `../../docs`; requisitos: `../../docs/requisitos/requisitos.md`; contrato implementado: `../../docs/api/openapi.yaml` y `../../docs/api/autenticacion.md`. Regenerar el esquema con `uv run python manage.py spectacular --validate --fail-on-warn --file ../../docs/api/openapi.yaml`.

Django carga `.env` específico y de la raíz sin sobreescribir variables exportadas. `settings.DOCS_DIR` localiza el contrato central; no copiar `docs/` a la aplicación. Entorno y consolidación: `../../docs/adr/0010-monorepo-y-entorno-de-desarrollo.md`. No escribir notas Obsidian sin autorización específica.
